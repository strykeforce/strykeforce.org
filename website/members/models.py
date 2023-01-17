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


@register_snippet
class School(models.Model):
    """School choices for Student"""

    name = CharField(max_length=255, unique=True)
    url = URLField()

    panels = [FieldPanel("name"), FieldPanel("url")]

    class Meta:
        indexes = [models.Index(fields=["name"])]
        verbose_name = "school"
        verbose_name_plural = "schools"

    def __str__(self):
        return self.name


class StudentsManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(member_type="STUDENT")


class MentorsManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(member_type="MENTOR")


@register_snippet
class Member(index.Indexed, models.Model):
    """Team members snippet model."""

    MEMBER_TYPE = (
        ("STUDENT", "Student"),
        ("MENTOR", "Mentor"),
        ("OTHER", "Other"),
    )

    first_name = CharField(max_length=100)
    last_name = CharField(max_length=100)
    member_type = CharField(choices=MEMBER_TYPE, default="STUDENT", max_length=50)
    email = EmailField(blank=True)
    title = CharField(max_length=255, blank=True)
    # noinspection PyUnresolvedReferences
    image = models.ForeignKey(
        "wagtailimages.Image",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )
    blurb = RichTextField(blank=True, features=["bold", "italic", "link", "document-link"])
    date_joined = DateField(default=timezone.now)

    # Students
    grade = PositiveIntegerField(
        blank=True,
        null=True,
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

    objects = models.Manager()
    students = StudentsManager()
    mentors = MentorsManager()

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
                FieldPanel("member_type"),
            ],
            "Member Information",
        ),
        FieldPanel("image"),
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
        FieldPanel("title"),
        FieldPanel("blurb"),
        # PublishingPanel(),
    ]

    search_fields = [
        index.SearchField("first_name"),
        index.SearchField("last_name"),
    ]

    class Meta:
        indexes = [models.Index(fields=["last_name", "first_name"])]
        verbose_name = "member"
        verbose_name_plural = "members"

    def __str__(self):
        if self.member_type == "STUDENT":
            return f"{self.name} ({self.grade})"
        return f"{self.name} ({self.member_type.lower()})"

    @property
    def name(self):
        """Full name of member."""
        return self.first_name + " " + self.last_name

    @property
    def student_name(self):
        "First name plus last initial of member."
        return f"{self.first_name} {self.last_name[0]}."


class JoinFormField(AbstractFormField):
    page = ParentalKey("JoinFormPage", on_delete=models.CASCADE, related_name="form_fields")


class JoinFormPage(AbstractEmailForm):
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
