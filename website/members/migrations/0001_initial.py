# Generated by Django 4.1.4 on 2023-01-01 14:37
from __future__ import annotations

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import wagtail.fields
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("wagtailimages", "0024_index_image_file_hash"),
    ]

    operations = [
        migrations.CreateModel(
            name="Member",
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
                ("first_name", models.CharField(max_length=100)),
                ("last_name", models.CharField(max_length=100)),
                (
                    "member_type",
                    models.CharField(
                        choices=[("STUDENT", "Student"), ("MENTOR", "Mentor"), ("OTHER", "Other")],
                        default="STUDENT",
                        max_length=50,
                    ),
                ),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("title", models.CharField(blank=True, max_length=255)),
                ("blurb", wagtail.fields.RichTextField(blank=True)),
                ("date_joined", models.DateField(default=django.utils.timezone.now)),
                (
                    "grade",
                    models.PositiveIntegerField(
                        blank=True,
                        null=True,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(12),
                        ],
                    ),
                ),
            ],
            options={
                "verbose_name": "member",
                "verbose_name_plural": "members",
            },
        ),
        migrations.CreateModel(
            name="School",
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
                ("name", models.CharField(max_length=255, unique=True)),
                ("url", models.URLField()),
            ],
            options={
                "verbose_name": "school",
                "verbose_name_plural": "schools",
            },
        ),
        migrations.AddIndex(
            model_name="school",
            index=models.Index(fields=["name"], name="members_sch_name_a4271b_idx"),
        ),
        migrations.AddField(
            model_name="member",
            name="image",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="wagtailimages.image",
            ),
        ),
        migrations.AddField(
            model_name="member",
            name="school",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="members.school",
            ),
        ),
        migrations.AddIndex(
            model_name="member",
            index=models.Index(
                fields=["last_name", "first_name"],
                name="members_mem_last_na_92a910_idx",
            ),
        ),
    ]
