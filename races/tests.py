from datetime import date

from django.db import IntegrityError
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase

from .models import RaceTrack, GrandPrix, RaceResult
from drivers.models import Driver, Constructor


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


class RaceResultTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.race_track = RaceTrack.objects.create(
            name="Monaco",
            country="Monaco",
        )
        cls.grand_prix = GrandPrix.objects.create(
            track=cls.race_track,
            date=date.fromisoformat("2025-05-25"),
        )
        cls.driver1 = Driver.objects.create(
            name="Lewis Hamilton",
            dob=date.fromisoformat("1985-01-07"),
            short_name="HAM",
        )
        cls.driver2 = Driver.objects.create(
            name="Max Verstappen",
            dob=date.fromisoformat("1997-09-30"),
            short_name="VER",
        )
        cls.constructor = Constructor.objects.create(
            name="Mercedes",
        )

    def test_race_result_creation(self):
        """Test basic race result creation"""
        race_result = RaceResult.objects.create(
            driver=self.driver1,
            constructor=self.constructor,
            grand_prix=self.grand_prix,
            start_position=1,
            finish_position=1,
            points=25,
        )

        self.assertEqual(race_result.driver, self.driver1)
        self.assertEqual(race_result.constructor, self.constructor)
        self.assertEqual(race_result.grand_prix, self.grand_prix)
        self.assertEqual(race_result.start_position, 1)
        self.assertEqual(race_result.finish_position, 1)
        self.assertEqual(race_result.points, 25)
        self.assertEqual(race_result.finish_status, "finished")  # default
        self.assertFalse(race_result.is_sprint)  # default

    def test_race_result_str_method(self):
        """Test the string representation"""
        race_result = RaceResult.objects.create(
            driver=self.driver1,
            constructor=self.constructor,
            grand_prix=self.grand_prix,
            start_position=2,
            finish_position=1,
            points=25,
        )

        expected = f"{self.driver1} - {self.grand_prix} (P1)"
        self.assertEqual(str(race_result), expected)

    def test_unique_start_position_constraint(self):
        """Test that start positions are unique per grand prix"""
        RaceResult.objects.create(
            driver=self.driver1,
            constructor=self.constructor,
            grand_prix=self.grand_prix,
            start_position=1,
            finish_position=1,
            points=25,
        )

        # Try to create another result with same start position
        with self.assertRaises(IntegrityError):
            RaceResult.objects.create(
                driver=self.driver2,
                constructor=self.constructor,
                grand_prix=self.grand_prix,
                start_position=1,  # Same start position
                finish_position=2,
                points=18,
            )

    def test_unique_finish_position_constraint(self):
        """Test that finish positions are unique per grand prix"""
        RaceResult.objects.create(
            driver=self.driver1,
            constructor=self.constructor,
            grand_prix=self.grand_prix,
            start_position=1,
            finish_position=1,
            points=25,
        )

        # Try to create another result with same finish position
        with self.assertRaises(IntegrityError):
            RaceResult.objects.create(
                driver=self.driver2,
                constructor=self.constructor,
                grand_prix=self.grand_prix,
                start_position=2,
                finish_position=1,  # Same finish position
                points=18,
            )

    def test_unique_driver_per_grand_prix_constraint(self):
        """Test that each driver only appears once per grand prix"""
        RaceResult.objects.create(
            driver=self.driver1,
            constructor=self.constructor,
            grand_prix=self.grand_prix,
            start_position=1,
            finish_position=1,
            points=25,
        )

        # Try to create another result with same driver and grand prix
        with self.assertRaises(IntegrityError):
            RaceResult.objects.create(
                driver=self.driver1,  # Same driver
                constructor=self.constructor,
                grand_prix=self.grand_prix,  # Same grand prix
                start_position=2,
                finish_position=2,
                points=18,
            )

    def test_dnf_with_null_finish_position(self):
        """Test creating a DNF result with null finish position"""
        race_result = RaceResult.objects.create(
            driver=self.driver1,
            constructor=self.constructor,
            grand_prix=self.grand_prix,
            start_position=1,
            finish_position=None,  # DNF
            finish_status="retired",
            points=0,
        )

        self.assertIsNone(race_result.finish_position)
        self.assertEqual(race_result.finish_status, "retired")
        self.assertEqual(race_result.points, 0)

    def test_position_validators(self):
        """Test that position validators work correctly"""
        # Test invalid start position (too low)
        with self.assertRaises(ValidationError):
            race_result = RaceResult(
                driver=self.driver1,
                constructor=self.constructor,
                grand_prix=self.grand_prix,
                start_position=0,  # Invalid
                finish_position=1,
            )
            race_result.full_clean()

        # Test invalid start position (too high)
        with self.assertRaises(ValidationError):
            race_result = RaceResult(
                driver=self.driver1,
                constructor=self.constructor,
                grand_prix=self.grand_prix,
                start_position=31,  # Invalid
                finish_position=1,
            )
            race_result.full_clean()

    def test_related_name_queries(self):
        """Test that related name queries work correctly"""
        race_result = RaceResult.objects.create(
            driver=self.driver1,
            constructor=self.constructor,
            grand_prix=self.grand_prix,
            start_position=1,
            finish_position=1,
            points=25,
        )

        # Test driver.race_results
        driver_results = self.driver1.race_results.all()
        self.assertEqual(list(driver_results), [race_result])

        # Test constructor.race_results
        constructor_results = self.constructor.race_results.all()
        self.assertEqual(list(constructor_results), [race_result])

        # Test grand_prix.race_results
        gp_results = self.grand_prix.race_results.all()
        self.assertEqual(list(gp_results), [race_result])

    def test_sprint_race_flag(self):
        """Test the is_sprint boolean field"""
        sprint_result = RaceResult.objects.create(
            driver=self.driver1,
            constructor=self.constructor,
            grand_prix=self.grand_prix,
            start_position=1,
            finish_position=1,
            points=8,
            is_sprint=True,
        )

        self.assertTrue(sprint_result.is_sprint)
