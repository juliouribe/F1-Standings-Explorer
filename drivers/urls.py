from django.urls import path

from .views import DriverAPIView, ConstructorAPIView

urlpatterns = [
    path("drivers/", DriverAPIView.as_view(), name="drivers"),
    path("constructors/", ConstructorAPIView.as_view(), name="constructors"),
]
