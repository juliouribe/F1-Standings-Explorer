import requests
import json

BASE_URL = "http://localhost:8000"
DRIVER_ENDPOINT = "/api/drivers/create/"
CONSTRUCTOR_ENDPOINT = "/api/constructors/create/"
RACE_TRACK_ENDPOINT = "/api/races/race_tracks/create/"
GRAND_PRIX_ENDPOINT = "/api/races/grand_prix/create/"

ERGAST_URL = "https://api.jolpi.ca/ergast/f1/"


def query_third_party(year):
    url = f"{ERGAST_URL}/{year}/results"
    try:
        response = requests.get(
            url,
        )
        print("Making Third Party API call...")
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")

        if response.status_code == 201:
            print("Query completed successfully")
            data = response.json()
            races = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            total_race_results = sum(len(race.get("Results", [])) for race in races)
            print(f"Retrieve {total_race_results} race results")
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
        print(response.text)

def parse_data(data):
    parsed_data = []

    return parsed_data


def write_data(parsed_data):
    url = f"{BASE_URL}{GRAND_PRIX_ENDPOINT}"
    headers = {
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            url,
            json=parsed_data,
            headers=headers,
        )
        print("Making write requests to Django Backend...")
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")

        if response.status_code == 201:
            print("✅ Object created successfully!")
            print(f"Created object: {response.json()}")
        elif response.status_code == 400:
            print("❌ Validation errors:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            print(response.text)

        return response

    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure your Django server is running")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
    except json.JSONDecodeError:
        print("❌ Invalid JSON response")
        print(response.text)


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
    rez = query_third_party(test_data_grand_prix_two)


if __name__ == "__main__":
    main()
