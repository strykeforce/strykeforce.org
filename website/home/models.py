from __future__ import annotations

from django.db import models
from django.db.models import BooleanField
from django.db.models import CharField
from django.db.models import URLField
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import FieldPanel
from wagtail.admin.panels import FieldRowPanel
from wagtail.admin.panels import InlinePanel
from wagtail.admin.panels import MultiFieldPanel
from wagtail.contrib.forms.models import AbstractEmailForm
from wagtail.contrib.forms.models import AbstractFormField
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.search import index
from wagtail.snippets.models import register_snippet

from website.blog.models import BlogIndexPage
from website.blog.models import BlogPage
from website.events.models import EventIndexPage

LATEST_NEWS = 2


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
        blog_index_page = BlogIndexPage.objects.child_of(self).live().first()
        context["blog_posts"] = blog_index_page.recent_blogs()[0:LATEST_NEWS]
        context["blog_title"] = blog_index_page.title
        context["blog_intro"] = blog_index_page.body
        event_index_page = EventIndexPage.objects.child_of(self).live().first()
        context["event_index"] = event_index_page
        sponsors_index = SponsorsPage.objects.child_of(self).live().first()
        context["sponsors_index"] = sponsors_index
        return context

    content_panels = Page.content_panels + [
        FieldPanel("hero_image"),
        FieldPanel("body"),
    ]


class SponsorsPage(Page):
    body = models.TextField(blank=True)

    def sponsors(self):
        return Sponsor.objects.filter(active=True).order_by("name")

    def platinum_sponsors(self):
        return self.sponsors().filter(level__exact=LevelType.PLATINUM)

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


LevelType = models.TextChoices("LevelType", "PLATINUM GOLD SILVER BRONZE")  # type: ignore


@register_snippet
class Sponsor(index.Indexed, models.Model):
    """Sponsors type snippet model."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=1000, blank=True)
    website = URLField(blank=True)
    # noinspection PyUnresolvedReferences
    level = CharField(choices=LevelType.choices, default=LevelType.BRONZE, max_length=20)
    active = BooleanField(default=True)
    # noinspection PyUnresolvedReferences
    logo = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    def grid_columns(self):
        return round(self.logo.width / self.logo.height)

    panels = [
        FieldPanel("name"),
        MultiFieldPanel(
            [
                FieldRowPanel(
                    [
                        FieldPanel("level"),
                        FieldPanel("active"),
                    ],
                ),
            ],
        ),
        FieldPanel("website"),
        FieldPanel("logo"),
        FieldPanel("description"),
    ]

    search_fields = [
        index.SearchField("name"),
    ]

    class Meta:
        indexes = [models.Index(fields=["level", "name"])]
        verbose_name = "sponsor"
        verbose_name_plural = "sponsors"

    def __str__(self):
        # noinspection PyUnresolvedReferences
        level = LevelType[self.level.__str__()].label
        return f"{self.name} ({level})"


class FormField(AbstractFormField):
    page = ParentalKey("FormPage", on_delete=models.CASCADE, related_name="form_fields")


class FormPage(AbstractEmailForm):
    intro = RichTextField(blank=True)
    thank_you_text = RichTextField(blank=True)

    content_panels = AbstractEmailForm.content_panels + [
        FieldPanel("intro"),
        InlinePanel("form_fields", label="Form fields"),
        FieldPanel("thank_you_text"),
        MultiFieldPanel(
            [
                FieldRowPanel(
                    [
                        FieldPanel("from_address", classname="col6"),
                        FieldPanel("to_address", classname="col6"),
                    ],
                ),
                FieldPanel("subject"),
            ],
            "Email",
        ),
    ]
