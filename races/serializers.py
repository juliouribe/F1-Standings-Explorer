from rest_framework import serializers

from .models import GrandPrix, RaceTrack


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
        fields = ("name", "country")


class GrandPrixSerializer(serializers.ModelSerializer):
    # For input: accept track data as nested object
    race_track = serializers.DictField(write_only=True)
    # For output: show track details
    race_track_details = RaceTrackSerializer(source="race_track", read_only=True)

    class Meta:
        model = GrandPrix
        fields = ("race_track", "date", "race_track_details")

    def create(self, validated_data):
        race_track_data = validated_data.pop("race_track")

        race_track, _ = RaceTrack.objects.get_or_create(
            name=race_track_data["name"],
            country=race_track_data.get("country", ""),
            defaults={},
        )

        validated_data["race_track"] = race_track

        grand_prix, _ = GrandPrix.objects.get_or_create(
            race_track=race_track,
            date=validated_data.get("date"),
            defaults=validated_data,
        )

        return grand_prix
