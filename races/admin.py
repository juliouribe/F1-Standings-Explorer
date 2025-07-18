from django.contrib import admin

from .models import RaceTrack, GrandPrix, RaceResult


class RaceTrackAdmin(admin.ModelAdmin):
    list_display = ["name", "country"]
    search_fields = ["name", "country"]


class GrandPrixAdmin(admin.ModelAdmin):
    list_display = ["date", "track"]
    search_fields = ["date", "track"]


class RaceResultAdmin(admin.ModelAdmin):
    list_display = [
        "grand_prix",
        "driver",
        "start_position",
        "finish_position",
        "constructor",
    ]


admin.site.register(RaceTrack, RaceTrackAdmin)
admin.site.register(GrandPrix, GrandPrixAdmin)
admin.site.register(RaceResult, RaceResultAdmin)
