from datetime import date

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import RaceTrack, GrandPrix


class BaseRaceTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.race_track = RaceTrack.objects.create(
            name="Monza",
            country="Italy",
        )
        cls.grand_prix = GrandPrix.objects.create(
            track=cls.race_track,
            date=date.fromisoformat("2025-02-19"),
        )


class RaceTrackTests(BaseRaceTestCase):
    def test_race_track_fields(self):
        self.assertEqual(self.race_track.name, "Monza")
        self.assertEqual(self.race_track.country, "Italy")


class GrandPrixTests(BaseRaceTestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

    def test_grand_prix_fields(self):
        self.assertEqual(self.grand_prix.track, self.race_track)
        self.assertEqual(self.grand_prix.date, date.fromisoformat("2025-02-19"))
