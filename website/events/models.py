from __future__ import annotations

from django.db import models
from django.db.models import (
    CharField,
    DateField,
    FloatField,
    IntegerField,
    JSONField,
    URLField,
)
from django.utils import timezone
from wagtail.admin.panels import FieldPanel
from wagtail.contrib.routable_page.models import RoutablePageMixin, path
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.snippets.models import register_snippet

MAX_LENGTH = 1000


class EventIndexPage(RoutablePageMixin, Page):
    introduction = models.CharField(max_length=255, blank=True)
    body = models.TextField(
        blank=True,
        max_length=1000,
        help_text="Text to describe the page",
    )

    @staticmethod
    def events():
        return Event.objects.order_by("start_date")

    def future_events(self):
        return self.events().filter(end_date__gte=timezone.now())

    @path("")
    @path("year/<int:year>/")
    def events_for_year(self, request, year=None):
        """View function for current season's events."""
        if year is None:
            year = timezone.now().year

        events = self.events().filter(start_date__year=year)

        return self.render(
            request,
            context_overrides={
                "title": f"{year} Events",
                "events": events,
            },
        )

    @path("key/<slug:key>/")
    def event_for_key(self, request, key):
        """View function for event looked up by event key."""

        event = Event.objects.get(key=key)

        return self.render(
            request,
            template="events/event_page.html",
            context_overrides={
                "event": event,
                "week": event.week + 1 if event.week else None,
            },
        )

    content_panels = Page.content_panels + [
        FieldPanel("introduction"),
        FieldPanel("body"),
    ]


@register_snippet
class Event(models.Model):
    key = CharField(unique=True, default="", max_length=MAX_LENGTH)
    name = CharField(default="", max_length=MAX_LENGTH)
    event_code = CharField(default="", max_length=MAX_LENGTH)
    event_type = IntegerField(default=-1)
    district = JSONField(blank=True, null=True)
    city = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    state_prov = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    country = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    start_date = DateField(default=timezone.now)
    end_date = DateField(default=timezone.now)
    year = IntegerField(default=timezone.now)
    short_name = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    event_type_string = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    week = IntegerField(blank=True, null=True)
    address = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    postal_code = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    gmaps_place_id = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    gmaps_url = URLField(max_length=MAX_LENGTH, blank=True, null=True)
    lat = FloatField(blank=True, null=True)
    lng = FloatField(blank=True, null=True)
    location_name = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    website = URLField(max_length=MAX_LENGTH, blank=True, null=True)
    first_event_id = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    first_event_code = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    webcasts = JSONField(blank=True, null=True)
    division_keys = JSONField(blank=True, null=True)
    parent_event_key = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    playoff_type = IntegerField(blank=True, null=True)
    playoff_type_string = CharField(max_length=MAX_LENGTH, blank=True, null=True)
    body = RichTextField(blank=True)

    class Meta:
        ordering = ["-start_date"]
        indexes = [
            models.Index(fields=["year"]),
            models.Index(fields=["start_date"]),
        ]

    def __str__(self):
        return self.name
