# Generated by Django 4.1.5 on 2023-01-24 15:21
from __future__ import annotations

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0002_blogpage_blog_blogpa_date_7f56a0_idx"),
    ]

    operations = [
        migrations.RenameField(
            model_name="blogindexpage",
            old_name="body",
            new_name="introduction",
        ),
    ]
