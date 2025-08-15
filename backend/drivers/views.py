from rest_framework import generics

from .models import Driver, Constructor
from .serializers import DriverSerializer, ConstructorSerializer


class DriverAPIView(generics.ListAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer


class DriverCreateView(generics.CreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer


class ConstructorAPIView(generics.ListAPIView):
    queryset = Constructor.objects.all()
    serializer_class = ConstructorSerializer


class ConstructorCreateView(generics.CreateAPIView):
    queryset = Constructor.objects.all()
    serializer_class = ConstructorSerializer
