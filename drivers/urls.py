from django.urls import path

from .views import (
    DriverAPIView,
    DriverCreateView,
    ConstructorAPIView,
    ConstructorCreateView,
)

urlpatterns = [
    path("drivers/", DriverAPIView.as_view(), name="drivers"),
    path("drivers/create/", DriverCreateView.as_view(), name="create_driver"),
    path("constructors/", ConstructorAPIView.as_view(), name="constructors"),
    path(
        "constructors/create/",
        ConstructorCreateView.as_view(),
        name="create_constructors",
    ),
]
