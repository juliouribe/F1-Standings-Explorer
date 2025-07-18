from django.urls import path

from .views import DriverListView, TeamListView

urlpatterns = [
    path("", DriverListView.as_view(), name="drivers"),
    path("teams/", TeamListView.as_view(), name="teams"),
]
