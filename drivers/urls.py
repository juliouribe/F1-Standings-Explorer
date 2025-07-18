from django.urls import path

from .views import DriverAPIView, TeamAPIView

urlpatterns = [
    path("drivers/", DriverAPIView.as_view(), name="drivers"),
    path("teams/", TeamAPIView.as_view(), name="teams"),
]
