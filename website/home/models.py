from __future__ import annotations

from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Page

from website.blog.models import BlogIndexPage
from website.blog.models import BlogPage
from website.events.models import EventIndexPage


class HomePage(Page):
    body = RichTextField(blank=True)
    # noinspection PyUnresolvedReferences
    hero_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    def get_context(self, request, **kwargs):
        context = super().get_context(request)
        context["blog_posts"] = BlogPage.objects.descendant_of(self).live().order_by("-date")[0:3]
        blog_index_page = BlogIndexPage.objects.child_of(self).live().first()
        context["blog_title"] = blog_index_page.title
        context["blog_intro"] = blog_index_page.body
        event_index_page = EventIndexPage.objects.child_of(self).live().first()
        context["event_index"] = event_index_page
        return context

    content_panels = Page.content_panels + [
        FieldPanel("hero_image"),
        FieldPanel("body"),
    ]


class SponsorsPage(Page):
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]


class ContentPage(Page):
    intro = models.CharField(max_length=250)
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
        FieldPanel("body"),
    ]

    subpage_types: list[str] = []
