from rest_framework import serializers

from .models import GrandPrix, RaceTrack, RaceResult


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
    # For output: show track details
    race_track_details = RaceTrackSerializer(source="race_track", read_only=True)

    class Meta:
        model = GrandPrix
        fields = ("race_track", "race_track_details", "date")

    def create(self, validated_data):
        race_track_data = validated_data.pop("race_track")

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

        return grand_prix


class RaceResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = RaceResult
        fields = "__all__"


"""
I want to hit an endpoint with all the grand prix data.
I'll have data including drivers, construtors, race result info, etc.
I would like to:
- Create a new track if necessary
- Create a new grand prix
- Create new drivers if necessary
- Create new teams if neccessary
- Create several race results
"""
