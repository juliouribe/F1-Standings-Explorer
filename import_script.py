import requests
import json

BASE_URL = "http://localhost:8000"
DRIVER_ENDPOINT = "/api/drivers/create/"
CONSTRUCTOR_ENDPOINT = "/api/constructors/create/"
RACE_TRACK_ENDPOINT = "/api/races/race_tracks/create/"
GRAND_PRIX_ENDPOINT = "/api/races/grand_prix/create/"

ERGAST_URL = "https://api.jolpi.ca/ergast/f1/"


def query_third_party(year, limit, offset=None):
    url = f"{ERGAST_URL}/{year}/results/?{limit}"
    if offset:
        url += f"&offset={offset}"
    try:
        response = requests.get(
            url,
        )
        print("Making Third Party API call...")
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")

        if response.status_code == 200:
            print("Query completed successfully")
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


def parse_data(data) -> list:
    # Each item in parsed_data is one Grand Prix with hopefully 20 race results.
    parsed_data = []
    races = data.get("RaceTable", {}).get("Races", [])
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
                "race_track": {
                    "name": race.get("Circuit", {}).get("circuitName", ""),
                    "country": race.get("Circuit", {})
                    .get("Location", {})
                    .get("country"),
                },
                "date": date,
                "race_results": [],
            }

        for result in race.get("Results", []):
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
            print(f"Response Headers: {dict(response.headers)}")

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


def load_json_data(filename: str):
    with open(filename, "r") as file:
        data = json.load(file)
    return data


def main():
    test_data_driver = {
        "name": "Carlos Sainz",
        "dob": "1994-09-01",
        "short_name": "SAI",
        "endpoint": DRIVER_ENDPOINT,
    }
    test_data_constructor = {
        "name": "Williams",
        "endpoint": CONSTRUCTOR_ENDPOINT,
    }
    test_data_race_track = {
        "name": "Albert Park Grand Prix Circuit",
        "country": "Australia",
        "endpoint": RACE_TRACK_ENDPOINT,
    }
    test_data_grand_prix = {
        "race_track": {
            "name": "Shanghai International Circuit",
            "country": "China",
        },
        "date": "2025-03-23",
        "endpoint": GRAND_PRIX_ENDPOINT,
        "race_results": [
            {
                "driver": {
                    "name": "Charles Leclerc",
                    "dob": "1997-10-16",
                    "short_name": "LEC",
                },
                "constructor": {
                    "name": "Ferrari",
                },
                "start_position": 1,
                "finish_position": 1,
                "finish_status": "finished",
                "points": 25,
            },
            {
                "driver": {
                    "name": "Lando Norris",
                    "dob": "1999-11-13",
                    "short_name": "NOR",
                },
                "constructor": {
                    "name": "McLaren",
                },
                "start_position": 2,
                "finish_position": 2,
                "finish_status": "finished",
                "points": 18,
            },
            {
                "driver": {
                    "name": "Lance Stroll",
                    "dob": "1997-10-16",
                    "short_name": "STR",
                },
                "constructor": {
                    "name": "Aston Martin",
                },
                "start_position": 15,
                "finish_position": 20,
                "finish_status": "retired",
                "points": 0,
            },
        ],
    }

    test_data_grand_prix_two = {
        "race_track": {
            "name": "Yas Marina Circuit",
            "country": "United Arab Emirates",
        },
        "date": "2021-12-12",
        "endpoint": GRAND_PRIX_ENDPOINT,
        "race_results": [
            {
                "driver": {
                    "name": "Max Verstappen",
                    "dob": "1997-09-30",
                    "short_name": "VER",
                },
                "constructor": {
                    "name": "Red Bull Racing",
                },
                "start_position": 1,
                "finish_position": 1,
                "finish_status": "finished",
                "points": 25,
            },
            {
                "driver": {
                    "name": "Lewis Hamilton",
                    "dob": "1985-01-07",
                    "short_name": "HAM",
                },
                "constructor": {
                    "name": "Mercedes",
                },
                "start_position": 2,
                "finish_position": 2,
                "finish_status": "finished",
                "points": 18,
            },
        ],
    }
    """
    Make API call to get the data
    Parse data into another iterable with formatting that matches endpoint
    Iterate over GPs and make repeated calls
    Make sure it's synchronous to avoid potential issues in get or create calls
    """
    data = []
    offset = 0
    limit = 40
    total = None

    while True:
        response = query_third_party(2025, limit, offset)

        if total is None:
            total = response.get("total", 0)

        data.extend(response.get("RaceTable", {}).get("Races", []))
        offset += limit

        if len(data) >= total:
            break

    parsed_data = parse_data(data)
    write_data(parsed_data)


if __name__ == "__main__":
    main()
