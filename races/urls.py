from django.urls import path

from .views import RaceTrackAPIView

urlpatterns = [
    path("race_tracks/", RaceTrackAPIView.as_view(), name="race_tracks"),
]
