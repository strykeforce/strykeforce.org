from __future__ import annotations

from django.db import models
from django.db.models import CharField
from django.db.models import DateField
from django.db.models import URLField
from django.utils import timezone
from wagtail.admin.panels import FieldPanel
from wagtail.admin.panels import FieldRowPanel
from wagtail.admin.panels import MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Page


class EventIndexPage(Page):
    body = models.TextField(
        blank=True,
        max_length=1000,
        help_text="Text to describe the page",
    )

    def events(self):
        return EventPage.objects.descendant_of(self).live().order_by("date_start")

    def future_events(self):
        return self.events().filter(date_start__gt=timezone.now())

    def events_by_year(self):
        return self.get_children().live().order_by("title")

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    subpage_types = [
        "events.EventIndexPage",
        "events.EventPage",
    ]


class EventPage(Page):
    date_start = DateField()
    date_end = DateField()
    tba_url = URLField(blank=True, verbose_name="TBA URL")
    event_url = URLField(blank=True, verbose_name="Event URL")
    venue = CharField(max_length=100)
    street = CharField(max_length=100)
    city = CharField(max_length=100)
    state = CharField(max_length=2)
    zip = CharField(max_length=10)
    body = RichTextField(blank=True)

    class Meta:
        indexes = [models.Index(fields=["date_start"])]

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldRowPanel(
                    [
                        FieldPanel("date_start"),
                        FieldPanel("date_end"),
                    ],
                ),
                FieldPanel("tba_url"),
                FieldPanel("event_url"),
            ],
        ),
        MultiFieldPanel(
            [
                FieldPanel("venue"),
                FieldPanel("street"),
                FieldRowPanel(
                    [
                        FieldPanel("city"),
                        FieldPanel("state"),
                        FieldPanel("zip"),
                    ],
                ),
            ],
        ),
        FieldPanel("body"),
    ]

    subpage_types: list[str] = []
    parent_page_types = ["events.EventIndexPage"]
