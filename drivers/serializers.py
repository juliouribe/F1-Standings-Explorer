from rest_framework import serializers

from .models import Driver, Constructor


class DriverSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        instance, _ = self.Meta.model.objects.get_or_create(
            name=validated_data["name"],
            defaults={
                "dob": validated_data["dob"],
                "short_name": validated_data["short_name"],
            },
        )
        return instance

    class Meta:
        model = Driver
        fields = ("name", "dob", "short_name")


class ConstructorSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        instance, _ = self.Meta.model.objects.get_or_create(**validated_data)
        return instance

    class Meta:
        model = Constructor
        fields = ("name",)
