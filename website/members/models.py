from __future__ import annotations

from django import forms
from django.core.validators import MaxValueValidator
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import CharField
from django.db.models import DateField
from django.db.models import EmailField
from django.db.models import PositiveIntegerField
from django.db.models import URLField
from django.utils import timezone
from wagtail.admin.panels import FieldPanel
from wagtail.admin.panels import FieldRowPanel
from wagtail.admin.panels import MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.snippets.models import register_snippet


@register_snippet
class School(models.Model):
    """School choices for Student"""

    name = CharField(max_length=255, unique=True)
    url = URLField()

    panels = [FieldPanel("name"), FieldPanel("url")]

    def __str__(self):
        return self.name


class Member(models.Model):
    """Abstract base class for team members."""

    first_name = CharField(max_length=100)
    last_name = CharField(max_length=100)
    email = EmailField(blank=True)
    # noinspection PyUnresolvedReferences
    image = models.ForeignKey(
        "wagtailimages.Image",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )
    date_joined = DateField(default=timezone.now)

    panels = [
        MultiFieldPanel(
            [
                FieldRowPanel(
                    [
                        FieldPanel("first_name"),
                        FieldPanel("last_name"),
                    ],
                ),
                FieldRowPanel(
                    [
                        FieldPanel("email"),
                        FieldPanel("date_joined"),
                    ],
                ),
            ],
            "Member Information",
        ),
        FieldPanel("image"),
        # PublishingPanel(),
    ]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        abstract = True


@register_snippet
class Student(Member):
    grade = PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(12),
        ],
    )
    school = models.ForeignKey(
        "members.School",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )

    panels = Member.panels + [
        MultiFieldPanel(
            [
                FieldRowPanel(
                    [
                        FieldPanel("grade"),
                        FieldPanel("school", widget=forms.Select),
                    ],
                ),
            ],
        ),
    ]


@register_snippet
class Mentor(Member):
    title = CharField(max_length=255, blank=True)
    blurb = RichTextField(blank=True, features=["bold", "italic", "link", "document-link"])

    panels = Member.panels + [
        FieldPanel("title"),
        FieldPanel("blurb"),
    ]


class StudentsPage(Page):
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]
