from rest_framework import generics

from .models import Driver, Team
from .serializers import DriverSerializer, TeamSerializer


class DriverAPIView(generics.ListAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer


class TeamAPIView(generics.ListAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
