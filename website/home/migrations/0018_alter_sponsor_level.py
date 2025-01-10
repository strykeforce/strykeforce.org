# Generated by Django 5.1.4 on 2025-01-07 22:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("home", "0017_homepage_featured_page_1_homepage_featured_page_2_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sponsor",
            name="level",
            field=models.CharField(
                choices=[
                    ("DIAMOND", "Diamond"),
                    ("PLATINUM", "Platinum"),
                    ("GOLD", "Gold"),
                    ("SILVER", "Silver"),
                    ("BRONZE", "Bronze"),
                ],
                default="BRONZE",
                max_length=20,
            ),
        ),
    ]
