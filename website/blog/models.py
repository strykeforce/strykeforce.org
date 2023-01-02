from __future__ import annotations

from django.db import models
from django.db.models import ForeignKey
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import FieldPanel
from wagtail.admin.panels import InlinePanel
from wagtail.admin.panels import MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Orderable
from wagtail.models import Page
from wagtail.search import index


class BlogIndexPage(Page):
    body = models.TextField(
        blank=True,
        max_length=1000,
        help_text="Text to describe the page",
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    subpage_types = ["blog.BlogPage"]

    def get_context(self, request, **kwargs):
        context = super().get_context(request)
        context["posts"] = BlogPage.objects.descendant_of(self).live().order_by("-date")
        return context


class BlogMemberAuthorRelation(Orderable, models.Model):
    page = ParentalKey("blog.BlogPage", on_delete=models.CASCADE, related_name="authors")
    member = ForeignKey("members.Member", on_delete=models.CASCADE, related_name="+")

    class Meta(Orderable.Meta):
        verbose_name = "blog author"
        verbose_name_plural = "blog authors"

    panels = [
        FieldPanel("member"),
    ]

    def __str__(self):
        return self.page.title + " -> " + self.member.name


class BlogPage(Page):
    date = models.DateField("Post date")
    introduction = models.TextField(
        blank=True,
        max_length=1000,
        help_text="Text to describe the page",
    )
    body = RichTextField(blank=True)
    # noinspection PyUnresolvedReferences
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
                InlinePanel("authors", label="Authors"),
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
