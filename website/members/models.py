from __future__ import annotations

from django import forms
from django.core.validators import MaxValueValidator
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import CharField
from django.db.models import DateField
from django.db.models import EmailField
from django.db.models import PositiveIntegerField
from django.db.models import Q
from django.db.models import URLField
from django.utils import timezone
from wagtail.admin.panels import FieldPanel
from wagtail.admin.panels import FieldRowPanel
from wagtail.admin.panels import MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.search import index
from wagtail.snippets.models import register_snippet

HIGH_SCHOOL_GRADE_NAMES = [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
]


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
        return (
            super()
            .get_queryset()
            .filter(Q(member_type="STUDENT") | Q(member_type="STUDENT_LEADER"))
        )


class MentorsManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(member_type="MENTOR")


@register_snippet
class Member(index.Indexed, models.Model):
    """Team members snippet model."""

    MEMBER_TYPE = (
        ("STUDENT", "Student"),
        ("STUDENT_LEADER", "Student Leader"),
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
    blurb = RichTextField(blank=True)
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
        index.AutocompleteField("first_name"),
        index.SearchField("last_name"),
        index.AutocompleteField("last_name"),
    ]

    class Meta:
        indexes = [models.Index(fields=["last_name", "first_name"])]
        verbose_name = "member"
        verbose_name_plural = "members"

    def __str__(self):
        if self.member_type == "STUDENT" or self.member_type == "STUDENT_LEADER":
            return f"{self.name} ({self.grade})"
        return f"{self.name} ({self.member_type.lower()})"

    @property
    def name(self):
        """Full name of member."""
        return self.first_name + " " + self.last_name

    @property
    def student_name(self):
        """First name plus last initial of member."""
        return f"{self.first_name} {self.last_name[0]}."

    def high_school_label(self):
        grade = HIGH_SCHOOL_GRADE_NAMES[self.grade - 9]
        return f"{self.school} {grade}" if self.school else grade


class StudentIndexPage(Page):
    """Page for displaying current season's students."""

    introduction = models.TextField(
        blank=True,
        max_length=1000,
        help_text="Text to describe the page",
    )

    @staticmethod
    def student_leaders():
        return Member.objects.filter(member_type="STUDENT_LEADER").order_by(
            "-grade", "last_name"
        )

    @staticmethod
    def students():
        return Member.objects.filter(member_type="STUDENT").order_by(
            "-grade", "last_name"
        )

    def get_context(self, request, *args, **kwargs):
        context = super().get_context(request, *args, **kwargs)
        context["student_leaders"] = self.student_leaders()
        context["students"] = self.students()
        return context

    content_panels = Page.content_panels + [
        FieldPanel("introduction"),
    ]

    subpage_types: list[str] = []


class MentorIndexPage(Page):
    """Page for displaying mentors."""

    introduction = models.TextField(
        blank=True,
        max_length=1000,
        help_text="Text to describe the page",
    )

    @staticmethod
    def mentors():
        return Member.objects.filter(member_type="MENTOR").order_by("last_name")

    def get_context(self, request, *args, **kwargs):
        context = super().get_context(request, *args, **kwargs)
        context["mentors"] = self.mentors()
        return context

    content_panels = Page.content_panels + [
        FieldPanel("introduction"),
    ]

    subpage_types: list[str] = []
