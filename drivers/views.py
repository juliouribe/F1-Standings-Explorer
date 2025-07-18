from django.views.generic import ListView

from .models import Driver, Team

class DriverListView(ListView):
    model = Driver
    
