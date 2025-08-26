from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models.functions import Extract

from .models import GrandPrix, RaceTrack
from .serializers import (
    GrandPrixSerializer,
    RaceTrackSerializer,
    GrandPrixBySeasonSerializer,
)


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


class GrandPrixSearchView(generics.ListAPIView):
    """
    List all Grand Prix objects filtered by year.
    Usage:
    - GET /api/races/grand_prix/filter/ (all Grand Prix)
    - GET /api/races/grand_prix/filter/?year=2025
    """

    serializer_class = GrandPrixBySeasonSerializer

    def get_queryset(self):
        queryset = GrandPrix.objects.all().order_by("date")
        year = self.request.GET.get("year")

        if year is not None:
            try:
                year_int = int(year)
                queryset = queryset.filter(date__year=year_int)
            except ValueError:
                return GrandPrix.objects.none()

        return queryset


class SeasonsAPIView(APIView):
    def get(self, request):
        years = (
            GrandPrix.objects.annotate(year=Extract("date", "year"))
            .values_list("year", flat=True)
            .distinct()
            .order_by("year")
        )

        return Response(list(years))
