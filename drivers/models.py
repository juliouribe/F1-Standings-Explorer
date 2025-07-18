import uuid
from django.db import models
from django.core.exceptions import ValidationError


def validate_exactly_3_chars(value):
    if len(value) != 3:
        raise ValidationError("Short name must be exactly 3 characters long.")


class Driver(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(max_length=100)
    dob = models.DateField()
    short_name = models.CharField(
        max_length=3,
        validators=[validate_exactly_3_chars],
    )

    class Meta:
        indexes = [
            models.Index(fields=["id"], name="driver_id_index"),
        ]

    def __str__(self):
        return self.name


class Constructor(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(max_length=100)

    class Meta:
        indexes = [
            models.Index(fields=["id"], name="constructor_id_index"),
        ]

    def __str__(self):
        return self.name
