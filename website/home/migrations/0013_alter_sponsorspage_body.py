# Generated by Django 4.1.5 on 2023-01-12 13:34
from __future__ import annotations

from django.db import migrations
from django.db import models


class Migration(migrations.Migration):
    dependencies = [
        ("home", "0012_sponsor_sponsor_home_sponso_level_ee6564_idx"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sponsorspage",
            name="body",
            field=models.TextField(blank=True),
        ),
    ]
