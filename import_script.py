import requests
import json

BASE_URL = "http://localhost:8000"
DRIVER_ENDPOINT = "/api/drivers/create/"
CONSTRUCTOR_ENDPOINT = "/api/constructors/create/"
RACE_TRACK_ENDPOINT = "/api/races/race_tracks/create/"
GRAND_PRIX_ENDPOINT = "/api/races/grand_prix/create/"


def create_object(data):
    headers = {
        "Content-Type": "application/json",
    }
    url = f"{BASE_URL}{data["endpoint"]}"

    try:
        response = requests.post(url, json=data, headers=headers)
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
    create_object(test_data_grand_prix_two)


if __name__ == "__main__":
    main()
