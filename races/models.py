from django.db import models


class RaceTrack(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} {self.country}"


class GrandPrix(models.Model):
    track = models.ForeignKey(RaceTrack, on_delete=models.CASCADE, related_name="races")
    date = models.DateField()
    # TODO: Add relationship to race results

    class Meta:
        verbose_name = "Grand prix"
        verbose_name_plural = "Grand prix"

    def __str__(self):
        return f"{self.date.year} {self.track.name}"
