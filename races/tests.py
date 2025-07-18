from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import RaceTrack


class RaceTrackTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.race_track = RaceTrack.objects.create(
            name="Monza",
            country="Italy",
        )

    def test_RaceTrack_fields(self):
        self.assertEqual(self.race_track.name, "Monza")
        self.assertEqual(self.race_track.country, "Italy")
