from __future__ import annotations

from django.contrib import admin

from website.events.models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    pass
