from __future__ import annotations

from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.admin.panels import MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.search import index


class BlogIndexPage(Page):
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    subpage_types = ["blog.BlogPage"]


class BlogPage(Page):
    date = models.DateField("Post date")
    introduction = models.TextField(
        blank=True,
        max_length=1000,
        help_text="Text to describe the page",
    )
    body = RichTextField(blank=True)
    image = models.ForeignKey(
        "wagtailimages.Image",
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Landscape mode only; horizontal width greater than 1200 pixels.",
    )

    search_fields = Page.search_fields + [
        index.SearchField("introduction"),
        index.SearchField("body"),
    ]

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("date"),
            ],
            heading="Blog information",
        ),
        FieldPanel("introduction"),
        FieldPanel("image", heading="Main Image"),
        FieldPanel("body"),
    ]

    parent_page_types = ["blog.BlogIndexPage"]
    subpage_types: list[str] = []
