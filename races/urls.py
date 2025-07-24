from django.urls import path

from .views import (
    RaceTrackAPIView,
    RaceTrackCreateView,
    GrandPrixAPIView,
    GrandPrixCreateView,
)

urlpatterns = [
    path("race_tracks/", RaceTrackAPIView.as_view(), name="race_tracks"),
    path(
        "race_tracks/create/", RaceTrackCreateView.as_view(), name="create_race_tracks"
    ),
    path("grand_prix/", GrandPrixAPIView.as_view(), name="grand_prix"),
    path("grand_prix/create/", GrandPrixCreateView.as_view(), name="create_grand_prix"),
]
