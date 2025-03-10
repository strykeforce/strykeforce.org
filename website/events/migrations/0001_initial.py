# Generated by Django 4.1.5 on 2023-01-07 21:38
from __future__ import annotations

import django.db.models.deletion
import django.utils.timezone
import wagtail.fields
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("wagtailcore", "0078_referenceindex"),
    ]

    operations = [
        migrations.CreateModel(
            name="Event",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("key", models.CharField(default="", max_length=1000, unique=True)),
                ("name", models.CharField(default="", max_length=1000)),
                ("event_code", models.CharField(default="", max_length=1000)),
                ("event_type", models.IntegerField(default=-1)),
                ("district", models.JSONField(blank=True, null=True)),
                ("city", models.CharField(blank=True, max_length=1000, null=True)),
                (
                    "state_prov",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("country", models.CharField(blank=True, max_length=1000, null=True)),
                ("start_date", models.DateField(default=django.utils.timezone.now)),
                ("end_date", models.DateField(default=django.utils.timezone.now)),
                ("year", models.IntegerField(default=django.utils.timezone.now)),
                (
                    "short_name",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                (
                    "event_type_string",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("week", models.IntegerField(blank=True, null=True)),
                ("address", models.CharField(blank=True, max_length=1000, null=True)),
                (
                    "postal_code",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                (
                    "gmaps_place_id",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("gmaps_url", models.URLField(blank=True, max_length=1000, null=True)),
                ("lat", models.FloatField(blank=True, null=True)),
                ("lng", models.FloatField(blank=True, null=True)),
                (
                    "location_name",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("website", models.URLField(blank=True, max_length=1000, null=True)),
                (
                    "first_event_id",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                (
                    "first_event_code",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("webcasts", models.JSONField(blank=True, null=True)),
                ("division_keys", models.JSONField(blank=True, null=True)),
                (
                    "parent_event_key",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("playoff_type", models.IntegerField(blank=True, null=True)),
                (
                    "playoff_type_string",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("body", wagtail.fields.RichTextField(blank=True)),
            ],
            options={
                "ordering": ["-start_date"],
            },
        ),
        migrations.CreateModel(
            name="EventIndexPage",
            fields=[
                (
                    "page_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="wagtailcore.page",
                    ),
                ),
                (
                    "body",
                    models.TextField(
                        blank=True,
                        help_text="Text to describe the page",
                        max_length=1000,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
            bases=("wagtailcore.page",),
        ),
        migrations.AddIndex(
            model_name="event",
            index=models.Index(fields=["year"], name="events_even_year_f60a43_idx"),
        ),
        migrations.AddIndex(
            model_name="event",
            index=models.Index(
                fields=["start_date"],
                name="events_even_start_d_d4b514_idx",
            ),
        ),
    ]
