from rest_framework import serializers

from .models import GrandPrix, RaceResult, RaceTrack


class RaceTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaceTrack
        fields = ("name", "country")
