from __future__ import annotations

from django.contrib import admin

from website.events.models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    fields = [
        "key",
        "name",
        "event_code",
        "city",
        "state_prov",
        "start_date",
        "end_date",
        "year",
        "address",
        "postal_code",
        "gmaps_url",
        "location_name",
        "website",
    ]
