from rest_framework import generics

from .models import GrandPrix, RaceResult, RaceTrack
from .serializers import GrandPrixSerializer, RaceTrackSerializer


class RaceTrackAPIView(generics.ListAPIView):
    queryset = RaceTrack.objects.all()
    serializer_class = RaceTrackSerializer


class RaceTrackCreateView(generics.CreateAPIView):
    queryset = RaceTrack.objects.all()
    serializer_class = RaceTrackSerializer


class GrandPrixAPIView(generics.ListAPIView):
    queryset = GrandPrix.objects.all()
    serializer_class = GrandPrixSerializer


class GrandPrixCreateView(generics.CreateAPIView):
    queryset = GrandPrix.objects.all()
    serializer_class = GrandPrixSerializer
