from django.test import TestCase
from datetime import date

from .models import Driver


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
