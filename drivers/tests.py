from django.test import TestCase
from datetime import date

from .models import Driver, Constructor


class DriverTests(TestCase):
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


class ConstructorTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.constructor = Constructor.objects.create(
            name="Uribe Racing",
        )

    def test_constructor_fields(self):
        self.assertEqual(self.constructor.name, "Uribe Racing")
