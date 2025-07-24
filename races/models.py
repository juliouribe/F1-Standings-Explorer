from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from drivers.models import Driver, Constructor

FINISHED_STATUS_CHOICES = [
    ("finished", "Finished the race"),
    ("retired", "Did not finish the race for whatever reason"),
    ("mechanical", "Mechanical failure"),
]


class RaceTrack(models.Model):
    name = models.CharField(max_length=200, unique=True)
    country = models.CharField(max_length=200, blank=True, default="")

    def __str__(self):
        return f"{self.name} {self.country}"


class GrandPrix(models.Model):
    track = models.ForeignKey(
        RaceTrack,
        on_delete=models.CASCADE,
        related_name="races",
    )
    date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "Grand prix"
        verbose_name_plural = "Grand prix"
        unique_together = [
            ("track", "date"),
        ]

    def __str__(self):
        return f"{self.date.year} {self.track.name}"


class RaceResult(models.Model):
    driver = models.ForeignKey(
        Driver,
        on_delete=models.CASCADE,
        related_name="race_results",
    )
    constructor = models.ForeignKey(
        Constructor,
        on_delete=models.CASCADE,
        related_name="race_results",
    )
    grand_prix = models.ForeignKey(
        GrandPrix,
        on_delete=models.CASCADE,
        related_name="race_results",
    )
    # Increase max value validator if there are F1 races with more than 30 drivers.
    start_position = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(30)]
    )
    # null okay in case a driver doesn't finish
    finish_position = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(30)], null=True, blank=True
    )
    finish_status = models.CharField(
        max_length=100,
        default="finished",
        choices=FINISHED_STATUS_CHOICES,
    )
    points = models.PositiveIntegerField(default=0)
    is_sprint = models.BooleanField(default=False)

    class Meta:
        # Ensure unique positions per grand prix
        unique_together = [
            ("grand_prix", "start_position"),
            ("grand_prix", "finish_position"),
        ]
        # Ensure each driver only appears once per grand prix
        constraints = [
            models.UniqueConstraint(
                fields=["grand_prix", "driver"], name="unique_driver_per_grand_prix"
            )
        ]
        ordering = ["grand_prix", "finish_position"]

    def __str__(self):
        return f"{self.driver} - {self.grand_prix} (P{self.finish_position})"
