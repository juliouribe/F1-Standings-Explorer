from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date

from .models import Driver, Constructor


class DriverTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.driver = Driver.objects.create(
            name="Julio Uribe",
            dob=date.fromisoformat("1992-02-19"),
            short_name="JCU",
        )

    def test_driver_fields(self):
        self.assertEqual(self.driver.name, "Julio Uribe")
        self.assertEqual(self.driver.dob, date.fromisoformat("1992-02-19"))
        self.assertEqual(self.driver.short_name, "JCU")

    def test_api_listview(self):
        response = self.client.get(reverse("drivers"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Driver.objects.count(), 1)
        self.assertContains(response, self.driver)


class ConstructorTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.constructor = Constructor.objects.create(
            name="Uribe Racing",
        )

    def test_constructor_fields(self):
        self.assertEqual(self.constructor.name, "Uribe Racing")

    def test_api_listview(self):
        response = self.client.get(reverse("constructors"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Constructor.objects.count(), 1)
        self.assertContains(response, self.constructor)
