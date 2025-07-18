from django.contrib import admin

from .models import RaceTrack, GrandPrix


class RaceTrackAdmin(admin.ModelAdmin):
    list_display = ["name", "country"]
    search_fields = ["name", "country"]


class GrandPrixAdmin(admin.ModelAdmin):
    list_display = ["date", "track"]
    search_fields = ["date", "track"]


admin.site.register(RaceTrack, RaceTrackAdmin)
admin.site.register(GrandPrix, GrandPrixAdmin)
