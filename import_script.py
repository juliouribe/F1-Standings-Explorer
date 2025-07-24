import requests
import json

BASE_URL = "http://localhost:8000"
ENDPOINT = "/api/drivers/create"
API_URL = f"{BASE_URL}{ENDPOINT}"


def create_object(data):
    headers = {
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(API_URL, json=data, headers=headers)
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
    test_data = {
        "name": "Carlos Sainz",
        "dob": "1994-09-01",
        "short_name": "SAI",
    }

    response = create_object(test_data)


if __name__ == "__main__":
    main()
