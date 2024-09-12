from __future__ import annotations

import logging
import time

from django.conf import settings
from django.db import models
from django.db.models import BooleanField
from django.db.models import CharField
from django.db.models import Q
from django.db.models import URLField
from modelcluster.fields import ParentalKey
from wagtail.admin.mail import send_mail
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
from wagtail.snippets.views.snippets import SnippetViewSet

from website.blog.models import BlogIndexPage
from website.events.models import EventIndexPage

logger = logging.getLogger(__name__)

LATEST_NEWS = 2
HONEYPOT_ENABLED = True
HONEYPOT_NAME = "phone_number"
HONEYPOT_TIME = "model_time"
HONEYPOT_INTERVAL = 3  # seconds


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
    featured_page_1 = models.ForeignKey(
        "wagtailcore.Page",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="First featured page for the homepage.",
        verbose_name="Featured page 1",
    )
    featured_page_2 = models.ForeignKey(
        "wagtailcore.Page",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Second featured page for the homepage.",
        verbose_name="Featured page 2",
    )
    featured_page_3 = models.ForeignKey(
        "wagtailcore.Page",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Third featured page for the homepage.",
        verbose_name="Featured page 3",
    )

    def get_context(self, request, **kwargs):
        context = super().get_context(request)
        blog_index_page = BlogIndexPage.objects.child_of(self).live().first()
        context["blog_posts"] = blog_index_page.recent_blogs()[0:LATEST_NEWS]
        context["blog_title"] = blog_index_page.title
        context["blog_intro"] = blog_index_page.introduction
        event_index_page = EventIndexPage.objects.child_of(self).live().first()
        context["event_index"] = event_index_page
        sponsors_index = SponsorsPage.objects.live().first()
        context["sponsors_index"] = sponsors_index
        return context

    content_panels = Page.content_panels + [
        FieldPanel("hero_image"),
        FieldPanel("body"),
        MultiFieldPanel(
            [
                FieldPanel("featured_page_1"),
                FieldPanel("featured_page_2"),
                FieldPanel("featured_page_3"),
            ],
        ),
    ]

    def recent_updates(self):
        return self.get_descendants().live().order_by("-last_published_at")[:3]


class ContentPageIndex(Page):
    introduction = models.CharField(max_length=250)
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("introduction"),
        FieldPanel("body"),
    ]

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = [
        "home.ContentPage",
        "home.SponsorsPage",
        "members.StudentIndexPage",
        "members.MentorIndexPage",
    ]


class SponsorsPage(Page):
    introduction = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)

    def sponsors(self):
        return Sponsor.objects.filter(active=True).order_by("name")

    def diamond_sponsors(self):
        return self.sponsors().filter(active=True, level__exact=LevelType.DIAMOND).order_by("name")

    def platinum_sponsors(self):
        return (
            self.sponsors().filter(active=True, level__exact=LevelType.PLATINUM).order_by("name")
        )

    def gold_sponsors(self):
        return self.sponsors().filter(active=True, level__exact=LevelType.GOLD).order_by("name")

    def silver_sponsors(self):
        return self.sponsors().filter(active=True, level__exact=LevelType.SILVER).order_by("name")

    def bronze_sponsors(self):
        return self.sponsors().filter(active=True, level__exact=LevelType.BRONZE).order_by("name")

    def diamond_or_platinum_sponsors(self):
        return self.sponsors().filter(
            Q(active=True),
            Q(level__exact=LevelType.DIAMOND) | Q(level__exact=LevelType.PLATINUM),
        )

    content_panels = Page.content_panels + [
        FieldPanel("introduction"),
        FieldPanel("body"),
    ]


class ContentPage(Page):
    introduction = models.CharField(max_length=250)
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("introduction"),
        FieldPanel("body"),
    ]

    subpage_types: list[str] = []


LevelType = models.TextChoices("LevelType", "DIAMOND PLATINUM GOLD SILVER BRONZE")  # type: ignore


class Sponsor(index.Indexed, models.Model):
    """Sponsors type snippet model."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=1000, blank=True)
    website = URLField(blank=True)
    # noinspection PyUnresolvedReferences
    level = CharField(choices=LevelType.choices, default=LevelType.BRONZE, max_length=20)  # type: ignore
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


class SponsorViewSet(SnippetViewSet):
    model = Sponsor
    list_display = ["name", "level", "active"]
    list_filter = ["active", "level"]
    ordering = ["level", "name"]
    copy_view_enabled = False


register_snippet(SponsorViewSet)


class FormField(AbstractFormField):
    page = ParentalKey("FormPage", on_delete=models.CASCADE, related_name="form_fields")


class FormPage(AbstractEmailForm):
    introduction = models.CharField(max_length=255, blank=True)
    body = RichTextField(blank=True)
    thank_you_text = RichTextField(blank=True)

    content_panels = AbstractEmailForm.content_panels + [
        FieldPanel("introduction"),
        FieldPanel("body"),
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

    def get_context(self, request, *args, **kwargs):
        context = super().get_context(request)
        context["time"] = str(time.time()).split(".")[0]
        return context

    def process_form_submission(self, form):
        if not HONEYPOT_ENABLED:
            return super().process_form_submission(form)

        score = []
        if HONEYPOT_NAME in form.data and HONEYPOT_TIME in form.data:
            score.append(form.data[HONEYPOT_NAME] == "")
            score.append(self.time_diff(form.data[HONEYPOT_TIME], HONEYPOT_INTERVAL))
            if len(score) and all(score):
                return super().process_form_submission(form)
            else:
                if settings.SEND_FORM_REJECTED_EMAIL:
                    send_mail(
                        f"[strykeforce.org] Form Rejected: {score}",
                        self.render_email(form),
                        ["jeff@j3ff.io"],
                        self.from_address,
                    )
                return None

    @staticmethod
    def time_diff(value, interval):
        now_time = str(time.time()).split(".")[0]
        diff = abs(int(now_time) - int(value))
        return True if diff > interval else False
