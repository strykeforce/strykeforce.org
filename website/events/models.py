from __future__ import annotations

import logging

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
from django.utils.decorators import method_decorator
from django.utils.functional import cached_property
from django.utils.text import slugify
from django.views.decorators.cache import cache_page
from wagtail.admin.forms import WagtailAdminModelForm
from wagtail.admin.panels import FieldPanel, FieldRowPanel
from wagtail.admin.views.generic.models import get_object_or_404
from wagtail.contrib.routable_page.models import RoutablePageMixin, path
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import EditView as SnippetEditView
from wagtail.snippets.views.snippets import SnippetViewSet

MAX_LENGTH = 255

logger = logging.getLogger(__name__)


class EventIndexPage(RoutablePageMixin, Page):
    introduction = models.CharField(max_length=255, blank=True)
    body = models.TextField(
        blank=True,
        max_length=1000,
        help_text="Text to describe the page",
    )

    content_panels = Page.content_panels + [
        FieldPanel("introduction"),
        FieldPanel("body"),
    ]

    @staticmethod
    def events():
        return Event.objects.order_by("start_date")

    def future_events(self):
        return self.events().filter(end_date__gte=timezone.now())

    @path("")
    @path("<int:year>/")
    @method_decorator(cache_page(60 * 60))
    def events_for_year(self, request, year=None):
        """View function for current season's events."""
        if year is None:
            year = timezone.now().year

        events = self.events().filter(start_date__year=year)
        years = Event.objects.years().order_by("-year")
        won_events = Event.objects.won_events_for_year(year)

        return self.render(
            request,
            context_overrides={
                "title": f"{year} Events",
                "events": events,
                "current_year": year,
                "is_active_season": year == timezone.now().year,
                "years": years,
                "won_events": won_events,
            },
        )

    @path("key/<slug:key>/")
    @method_decorator(cache_page(60 * 60))
    def event_for_key(self, request, key):
        """View function for event looked up by event key."""

        event = get_object_or_404(Event, key=key)
        years = Event.objects.years().order_by("-year")

        return self.render(
            request,
            template="events/event_page.html",
            context_overrides={
                "event": event,
                "next_event": event.get_next(),
                "previous_event": event.get_previous(),
                "week": event.week + 1 if event.week else None,
                "current_year": event.year,
                "years": years,
            },
        )


class EventManager(models.Manager):
    def won_events_for_year(self, year):
        return self.filter(year=year, status="won").order_by("start_date")

    def years(self):
        return self.values_list("year", flat=True).distinct()


class Event(models.Model):
    objects: EventManager = EventManager()

    key = CharField(unique=True, blank=True, max_length=25, editable=False)  # slug
    name = CharField(
        "Event Name",
        blank=True,
        max_length=MAX_LENGTH,
        help_text="If this is blank, it is recommended to copy an earlier version of this event and edit as neccessary.",
    )  # used
    event_code = CharField(
        "Event Code",
        blank=True,
        max_length=25,
        help_text="Short and unique (i.e. misjo, openhouse, etc.)",
    )
    event_type = IntegerField(default=-1, editable=False)
    district = JSONField(default=dict, editable=False)
    city = CharField(max_length=MAX_LENGTH, blank=True)  # used
    state_prov = CharField(
        "State",
        max_length=MAX_LENGTH,
        blank=True,
        default="MI",
    )  # used
    country = CharField(max_length=MAX_LENGTH, blank=True, editable=False)
    start_date = DateField(default=timezone.now)  # used
    end_date = DateField(default=timezone.now)  # used
    year = IntegerField(default=timezone.now().year, help_text="Year of event")
    short_name = CharField(max_length=MAX_LENGTH, blank=True)
    event_type_string = CharField(max_length=MAX_LENGTH, blank=True)
    week = IntegerField(blank=True, null=True)  # used, conditionally
    address = CharField(max_length=MAX_LENGTH, blank=True, editable=False)
    postal_code = CharField(
        max_length=MAX_LENGTH,
        blank=True,
        editable=False,
    )
    gmaps_place_id = CharField(
        max_length=MAX_LENGTH,
        blank=True,
        editable=False,
    )
    gmaps_url = URLField(max_length=MAX_LENGTH, blank=True)  # used
    lat = FloatField(blank=True, null=True, editable=False)
    lng = FloatField(blank=True, null=True, editable=False)
    location_name = CharField(
        max_length=MAX_LENGTH,
        blank=True,
        help_text="Familiar location name (i.e. Fieldhouse Arena) or street address.",
    )  # used
    website = URLField(max_length=MAX_LENGTH, blank=True)  # used
    first_event_code = CharField(
        max_length=MAX_LENGTH,
        blank=True,
        editable=False,
    )
    webcasts = JSONField(default=list, editable=False)
    parent_event_key = CharField(
        max_length=MAX_LENGTH,
        blank=True,
        editable=False,
    )
    edited_on = DateField(null=True, editable=False)
    status = CharField(max_length=25, default="default", editable=False)
    awards = JSONField(default=list, editable=False)
    body = RichTextField(blank=True, editable=False)

    panels = [
        FieldPanel("name"),
        FieldRowPanel([FieldPanel("short_name"), FieldPanel("event_type_string")]),
        FieldRowPanel([FieldPanel("event_code"), FieldPanel("year")]),
        FieldRowPanel([FieldPanel("city"), FieldPanel("state_prov")]),
        FieldRowPanel(
            [FieldPanel("start_date"), FieldPanel("end_date"), FieldPanel("week")],
        ),
        FieldPanel("location_name"),
        FieldPanel("gmaps_url"),
        FieldPanel("website"),
    ]

    def get_next(self):
        return (
            type(self)
            .objects.filter(start_date__gt=self.start_date)
            .order_by("start_date")
            .first()
        )

    def get_previous(self):
        return (
            type(self)
            .objects.filter(start_date__lt=self.start_date)
            .order_by("-start_date")
            .first()
        )

    def save(self, *args, **kwargs):
        if self.website and self.website.startswith("http://www.firstinmichigan.org"):
            self.website = f"https://www.firstinmichigan.org/FRC/{self.event_code}"

        if self.key:
            super().save(*args, **kwargs)
            return

        # Generate the initial slug for the `key` field
        base_slug = slugify(f"{self.event_code}-{self.year}")
        unique_slug = base_slug
        num = 1

        # Check for uniqueness and append a counter if necessary
        while Event.objects.filter(key=unique_slug).exists():
            unique_slug = f"{base_slug}-{num}"
            num += 1

        self.key = unique_slug
        super().save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(fields=["year"]),
            models.Index(fields=["start_date"]),
        ]

    def __str__(self):
        return self.name


class EventSnippetForm(WagtailAdminModelForm):
    def save(self, commit=True):
        logger.info(f"Saving {self.instance}")
        instance = super().save(commit=False)
        instance.edited_on = timezone.now().date()
        if commit:
            instance.save()
        return instance


class EventEditView(SnippetEditView):
    def save_instance(self):
        instance = super().save_instance()
        instance.edited_on = timezone.now().date()
        instance.save()
        return instance


@register_snippet
class EventViewSet(SnippetViewSet):
    model = Event
    edit_view_class = EventEditView

    @cached_property
    def icon(self) -> str:
        return "calendar"

    @cached_property
    def list_display(self) -> list[str]:
        return ["name", "year"]

    @cached_property
    def list_filter(self) -> list[str]:
        return ["name", "year"]

    @cached_property
    def ordering(self) -> list[str]:
        return ["-start_date"]
