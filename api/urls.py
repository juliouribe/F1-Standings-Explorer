from django.urls import path, include

urlpatterns = [
    path("", include("drivers.urls")),  # api/drivers & api/teams
    # path("races/", include("races.urls")),
]
