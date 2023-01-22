from __future__ import annotations

import tbaapiv3client
from django.conf import settings
from django.core.management import BaseCommand
from django.core.management import CommandError
from django.db import transaction
from django.db.models import Model
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

    @transaction.atomic
    def handle(self, *args, **options):
        events = self.download_events(options["year"])
        for event in events:
            try:
                obj = Event.objects.get(key=event.key)
            except Model.DoesNotExist:
                obj = Event()

            obj.key = event.key
            obj.name = event.name
            obj.event_code = event.event_code
            obj.event_type = event.event_type
            obj.district = self.parse_district(event.district)
            obj.city = event.city
            obj.state_prov = event.state_prov
            obj.country = event.country
            obj.start_date = event.start_date
            obj.end_date = event.end_date
            obj.year = event.year
            obj.short_name = event.short_name
            obj.event_type_string = event.event_type_string
            obj.week = event.week
            obj.address = event.address
            obj.postal_code = event.postal_code
            obj.gmaps_place_id = event.gmaps_place_id
            obj.gmaps_url = event.gmaps_url
            obj.lat = event.lat
            obj.lng = event.lng
            obj.location_name = event.location_name
            obj.website = event.website
            obj.first_event_id = event.first_event_id
            obj.first_event_code = event.first_event_code
            obj.webcasts = self.parse_webcasts(event.webcasts)
            obj.division_keys = events.division_keys if hasattr(events, "division_keys") else None
            obj.parent_event_key = event.parent_event_key
            obj.playoff_type = event.playoff_type
            obj.playoff_type_string = event.playoff_type_string

            obj.save()
