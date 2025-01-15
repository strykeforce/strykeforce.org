from __future__ import annotations

import tbaapiv3client
from django.conf import settings
from django.core.management import BaseCommand, CommandError
from django.db import transaction
from tbaapiv3client import ApiException

from website.events.models import Event


class Command(BaseCommand):
    help = "Download events from TBA for specified season."

    def add_arguments(self, parser):
        parser.add_argument("year", type=int)

    def download_events(self, year: int):
        configuration = tbaapiv3client.Configuration(
            host="https://www.thebluealliance.com/api/v3",
            api_key={"X-TBA-Auth-Key": settings.TBA_READ_KEY},
        )

        with tbaapiv3client.ApiClient(configuration) as api_client:
            api_instance = tbaapiv3client.EventApi(api_client)
            team_key = "frc2767"

            try:
                return api_instance.get_team_events_by_year(team_key, year)
            except ApiException as e:
                raise CommandError(e)

    def parse_district(self, district_list):
        if not district_list:
            return None
        return {
            "abbreviation": district_list.abbreviation,
            "display_name": district_list.display_name,
            "key": district_list.key,
            "year": district_list.year,
        }

    def parse_webcasts(self, webcasts):
        if not webcasts:
            return None

        return [
            {
                "type": w.type,
                "channel": w.channel,
                "date": w.date if hasattr(w, "date") else None,
                "file": w.file if hasattr(w, "file") else None,
            }
            for w in webcasts
        ]

    def copy_tba_event(self, tba_event, event):
        for attr in vars(event):
            match attr:
                case "district":
                    event.district = self.parse_district(tba_event.district)
                case "webcasts":
                    event.webcasts = self.parse_webcasts(tba_event.webcasts)
                case "division_keys" if hasattr(tba_event, "division_keys"):
                    event.division_keys = tba_event.division_keys
                case _ if not attr.startswith("_") and hasattr(tba_event, attr):
                    setattr(event, attr, getattr(tba_event, attr))
                case _:
                    pass

    @transaction.atomic
    def handle(self, *args, **options):
        for tba_event in self.download_events(options["year"]):
            event, created = Event.objects.get_or_create(key=tba_event.key)
            self.copy_tba_event(tba_event, event)
            event.save()
