from rest_framework import generics

from .models import GrandPrix, RaceResult, RaceTrack
from .serializers import RaceTrackSerializer


class RaceTrackAPIView(generics.ListAPIView):
    queryset = RaceTrack.objects.all()
    serializer_class = RaceTrackSerializer
