from rest_framework import serializers

from .models import Driver, Team


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ("name", "dob", "short_name")


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ("name",)
