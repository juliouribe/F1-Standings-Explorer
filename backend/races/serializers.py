from rest_framework import serializers

from .models import GrandPrix, RaceTrack, RaceResult
from drivers.models import Driver, Constructor
from drivers.serializers import DriverSerializer, ConstructorSerializer


class RaceResultSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(read_only=True)
    constructor = ConstructorSerializer(read_only=True)

    class Meta:
        model = RaceResult
        fields = (
            "driver",
            "constructor",
            "start_position",
            "finish_position",
            "finish_status",
            "points",
        )


class RaceTrackSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        instance, _ = self.Meta.model.objects.get_or_create(
            name=validated_data["name"],
            country=validated_data["country"],
            defaults={},
        )
        return instance

    class Meta:
        model = RaceTrack
        fields = "__all__"


class GrandPrixSerializer(serializers.ModelSerializer):
    # For input: accept track data as nested object
    race_track = serializers.DictField(write_only=True)
    race_results = serializers.ListField(
        child=serializers.DictField(write_only=True),
        write_only=True,
    )
    # For output: show track details
    race_track_details = RaceTrackSerializer(source="race_track", read_only=True)
    race_result_details = serializers.SerializerMethodField()

    class Meta:
        model = GrandPrix
        fields = (
            "round",
            "name",
            "date",
            "race_track",
            "race_track_details",
            "race_results",
            "race_result_details",
        )
        validators = []

    def get_race_result_details(self, obj):
        return RaceResultSerializer(obj.race_results.all(), many=True).data

    def create(self, validated_data):
        print(validated_data)
        race_track_data = validated_data.pop("race_track")
        race_results_data = validated_data.pop("race_results")

        race_track, _ = RaceTrack.objects.get_or_create(
            name=race_track_data["name"],
            country=race_track_data.get("country", ""),
            defaults={},
        )
        grand_prix, _ = GrandPrix.objects.get_or_create(
            race_track=race_track,
            date=validated_data.get("date"),
            defaults=validated_data,
        )

        for result in race_results_data:
            driver_data = result["driver"]
            driver, _ = Driver.objects.get_or_create(
                name=driver_data["name"],
                dob=driver_data["dob"],
                short_name=driver_data["short_name"],
                defaults={},
            )
            constructor_data = result["constructor"]
            constructor, _ = Constructor.objects.get_or_create(
                name=constructor_data["name"],
                defaults={},
            )

            RaceResult.objects.get_or_create(
                driver=driver,
                grand_prix=grand_prix,
                defaults={
                    "constructor": constructor,
                    "start_position": result["start_position"],
                    "finish_position": result["finish_position"],
                    "finish_status": result["finish_status"],
                    "points": result["points"],
                },
            )

        return grand_prix


class GrandPrixBySeasonSerializer(serializers.ModelSerializer):
    race_track = RaceTrackSerializer()
    race_results = RaceResultSerializer(many=True)

    class Meta:
        model = GrandPrix
        fields = (
            "id",
            "round",
            "name",
            "date",
            "race_track",
            "race_results",
        )
