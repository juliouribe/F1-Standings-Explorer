from django.urls import path

from .views import RaceTrackAPIView, RaceTrackCreateView

urlpatterns = [
    path("race_tracks/", RaceTrackAPIView.as_view(), name="race_tracks"),
    path(
        "race_tracks/create/", RaceTrackCreateView.as_view(), name="create_race_tracks"
    ),
]
