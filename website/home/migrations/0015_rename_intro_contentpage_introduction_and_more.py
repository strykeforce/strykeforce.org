# Generated by Django 4.1.5 on 2023-01-24 15:46
from __future__ import annotations

from django.db import migrations
from django.db import models


class Migration(migrations.Migration):
    dependencies = [
        ("home", "0014_formpage_formfield"),
    ]

    operations = [
        migrations.RenameField(
            model_name="contentpage",
            old_name="intro",
            new_name="introduction",
        ),
        migrations.RenameField(
            model_name="formpage",
            old_name="intro",
            new_name="body",
        ),
        migrations.AddField(
            model_name="formpage",
            name="introduction",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="sponsorspage",
            name="introduction",
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
