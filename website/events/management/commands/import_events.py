from __future__ import annotations

import pickle

import tbaapiv3client
from django.conf import settings
from django.core.management import BaseCommand, CommandError
from django.db import transaction
from tbaapiv3client import ApiException

from website.events.models import Event

TEAM_KEY = "frc2767"


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
            event_api = tbaapiv3client.EventApi(api_client)
            team_api = tbaapiv3client.TeamApi(api_client)

            try:
                self.events = event_api.get_team_events_by_year(TEAM_KEY, year)
                self.awards = team_api.get_team_awards_by_year(TEAM_KEY, year)
                self.results = team_api.get_team_events_statuses_by_year(TEAM_KEY, year)
                if False:
                    with open(
                        settings.BASE_DIR
                        / "website/events/tests"
                        / f"{year}_data.pickle",
                        "rb",
                    ) as f:
                        data = pickle.load(f)
                        self.events = data["events"]
                        self.awards = data["awards"]
                        self.results = data["results"]
            except ApiException as e:
                raise CommandError(e)

    def parse_district(self, district_list):
        if not district_list:
            return dict()
        return {
            "abbreviation": district_list.abbreviation,
            "display_name": district_list.display_name,
            "key": district_list.key,
            "year": district_list.year,
        }

    def parse_webcasts(self, webcasts):
        if not webcasts:
            return list()

        return [
            {
                "type": w.type,
                "channel": w.channel,
                "date": w.date if hasattr(w, "date") else None,
                "file": w.file if hasattr(w, "file") else None,
            }
            for w in webcasts
        ]

    def parse_awards(self, key):
        return [
            {"name": a.name, "recipients": [r.team_key for r in a.recipient_list]}
            for a in self.awards
            if a.event_key == key
        ]

    def parse_status(self, key):
        return (
            self.results[key].playoff.status
            if self.results[key]
            and self.results[key].playoff
            and hasattr(self.results[key].playoff, "status")
            else "none"
        )

    def parse_body(self, key):
        return (
            self.results[key].overall_status_str
            if self.results[key] and hasattr(self.results[key], "overall_status_str")
            else ""
        )

    def copy_tba_event(self, tba_event, event):
        for attr in vars(event):
            match attr:
                case "district":
                    event.district = self.parse_district(tba_event.district)
                case "webcasts":
                    event.webcasts = self.parse_webcasts(tba_event.webcasts)
                case "division_keys" if hasattr(tba_event, "division_keys"):
                    event.division_keys = tba_event.division_keys
                case "awards":
                    event.awards = self.parse_awards(tba_event.key)
                case "status":
                    event.status = self.parse_status(tba_event.key)
                case "body":
                    event.body = self.parse_body(tba_event.key)
                case _ if not attr.startswith("_") and hasattr(tba_event, attr):
                    val = getattr(tba_event, attr)
                    if val is not None:
                        setattr(event, attr, val)
                case _:
                    pass

    def handle(self, *args, **options):
        self.download_events(options["year"])

        for tba_event in self.events:
            with transaction.atomic():
                event, created = Event.objects.get_or_create(key=tba_event.key)
                if not event.edited_on:
                    self.copy_tba_event(tba_event, event)
                    event.save()
