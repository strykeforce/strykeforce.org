# Generated by Django 4.1.4 on 2022-12-29 23:10
from __future__ import annotations

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("wagtailcore", "0078_referenceindex"),
        ("home", "0010_delete_aboutpage"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="PartnersPage",
            new_name="SponsorsPage",
        ),
    ]