from rest_framework import serializers

from .models import GrandPrix, RaceResult, RaceTrack


class RaceTrackSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        instance, _ = self.Meta.model.objects.get_or_create(
            name=validated_data["name"],
            defaults={
                "country": validated_data["country"],
            },
        )
        return instance

    class Meta:
        model = RaceTrack
        fields = ("name", "country")


class GrandPrixSerializer(serializers.ModelSerializer):
    track = serializers.DictField()

    class Meta:
        model = GrandPrix
        fields = ("track", "date")

    def create(self, validated_data):
        track_data = validated_data.pop("track")

        race_track, _ = RaceTrack.objects.get_or_create(
            name=track_data["name"],
            defaults=track_data,
        )

        grand_prix, _ = GrandPrix.objects.get_or_create(
            track=race_track,
            date=validated_data["date"],
        )

        return grand_prix

    def to_representation(self, instance):
        return {
            "track": {
                "name": instance.track.name,
                "country": instance.track.country,
            },
            "date": instance.date.isoformat() if instance.date else None,
        }
