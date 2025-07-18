from django.db import models


class RaceTrack(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} {self.country}"
