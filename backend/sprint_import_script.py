"""
Import script for querying third party API and writing to Django Backend.
How to run:
python sprint_import_script.py --year=2025  // queries API and creates test_data2025.json
python sprint_import_script.py --filename=test_data2024.json // reads from file to populate backend.

"""

import argparse
import json
import requests
import time
from django.core.cache import cache


BASE_URL = "http://localhost:8000"
DRIVER_ENDPOINT = "/api/drivers/create/"
CONSTRUCTOR_ENDPOINT = "/api/constructors/create/"
RACE_TRACK_ENDPOINT = "/api/races/race_tracks/create/"
GRAND_PRIX_ENDPOINT = "/api/races/grand_prix/create/"

ERGAST_URL = "https://api.jolpi.ca/ergast/f1/"


def query_third_party(year, limit, offset=None):
    url = f"{ERGAST_URL}/{year}/sprint/?limit={limit}"
    if offset:
        url += f"&offset={offset}"

    try:
        response = requests.get(
            url,
        )
        print(f"Making Third Party API call to URL: {url}")
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json().get("MRData", {})
            races = data.get("RaceTable", {}).get("Races", [])
            total_race_results = sum(len(race.get("Results", [])) for race in races)
            print(f"Retrieved {total_race_results} race results")
            return data
        elif response.status_code == 400:
            print("❌ Validation errors:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            print(response.text)

    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure your Django server is running")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
    except json.JSONDecodeError:
        print("❌ Invalid JSON response")


def parse_data(races) -> list:
    # Each item in parsed_data is one Grand Prix with hopefully 20 race results.
    parsed_data = []
    for race in races:
        """
        Check if we already have a race for these results. Append to those
        race results if we do. Otherwise create a new dict. It's possible to
        have an existing race because of the way results get paginated.
        """
        date = race.get("date", "")
        current_race = next(
            (
                existing_race
                for existing_race in parsed_data
                if existing_race["date"] == date
            ),
            None,
        )
        if current_race is None:
            current_race = {
                "round": race.get("round", 0),
                "name": race.get("raceName", ""),
                "race_track": {
                    "name": race.get("Circuit", {}).get("circuitName", ""),
                    "country": race.get("Circuit", {})
                    .get("Location", {})
                    .get("country"),
                },
                "date": date,
                "race_results": [],
                "is_sprint": True,
            }

        for result in race.get("SprintResults", []):
            driver_info = result.get("Driver")
            current_race["race_results"].append(
                {
                    "driver": {
                        "name": driver_info.get("givenName", "")
                        + " "
                        + driver_info.get("familyName", ""),
                        "dob": driver_info.get("dateOfBirth"),
                        "short_name": driver_info.get("code"),
                    },
                    "constructor": {
                        "name": result.get("Constructor", {}).get("name", "")
                    },
                    "start_position": result.get("grid"),
                    "finish_position": result.get("position"),
                    "finish_status": result.get("status"),
                    "points": result.get("points"),
                }
            )
        parsed_data.append(current_race)

    return parsed_data


def write_data(parsed_data):
    url = f"{BASE_URL}{GRAND_PRIX_ENDPOINT}"
    headers = {
        "Content-Type": "application/json",
    }

    for grand_prix_data in parsed_data:
        try:
            response = requests.post(
                url,
                json=grand_prix_data,
                headers=headers,
            )
            print("Making write requests to Django Backend...")
            print(f"Status Code: {response.status_code}")

            if response.status_code == 201:
                print("✅ Grand Prix successfully created!")
                print(f"Grand Prix data: {response.json()}")
            elif response.status_code == 400:
                print("❌ Validation errors:")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"❌ Unexpected response: {response.status_code}")
                print(response.text)

        except requests.exceptions.ConnectionError:
            print("❌ Connection error - make sure your Django server is running")
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error: {e}")
        except json.JSONDecodeError:
            print("❌ Invalid JSON response")
        time.sleep(1)


def load_json_data(filename: str):
    with open(filename, "r") as file:
        data = json.load(file)
    return data


def main():
    parser = argparse.ArgumentParser(
        description="Process F1 data for a given year from Ergast API"
    )
    parser.add_argument("--year", type=int, help="Which year of F1 results to grab")
    parser.add_argument(
        "--filename", type=str, help="Optional filename to avoid API calls"
    )
    args = parser.parse_args()

    data = []
    offset = 0
    count = 0
    limit = 40  # the number of results per query.
    total = None  # the number of total results for a given season.
    year = args.year
    filename = args.filename

    if filename is None:
        if year is not None:
            while True:
                """
                When we query we will find out the total number of race results after
                the first call. We track this with count and total. Initially count is 0
                and will continue until we hit the total. Updating count is tricky
                because the race results are nested a few layers deep.
                """
                response = query_third_party(year, limit, offset)

                if total is None:
                    total = int(response.get("total", 0))

                # The number of results is kind of nested inside the race objects
                races = response.get("RaceTable", {}).get("Races", [])
                data.extend(races)
                for race in races:
                    count += len(race.get("SprintResults", []))

                offset += limit
                print(f"Currently on {offset}/{total} results")
                if count >= total:
                    break

                time.sleep(1)

            with open(f"test_data{year}_sprint.json", "w") as f:
                json.dump(data, f)
    else:
        data = load_json_data(filename)

    if len(data) >= 0:
        parsed_data = parse_data(data)
        write_data(parsed_data)
        cache.clear()


if __name__ == "__main__":
    main()
