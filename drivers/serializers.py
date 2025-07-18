from rest_framework import serializers

from .models import Driver, Constructor


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ("name", "dob", "short_name")


class ConstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Constructor
        fields = ("name",)
