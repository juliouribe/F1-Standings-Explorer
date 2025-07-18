from django.contrib import admin

from .models import RaceTrack


class RaceTrackAdmin(admin.ModelAdmin):
    list_display = ["name", "country"]
    search_fields = ["name", "country"]


admin.site.register(RaceTrack, RaceTrackAdmin)
