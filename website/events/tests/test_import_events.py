import datetime
import pickle

from django.test import TestCase

from website.events.management.commands.import_events import Command
from website.events.models import Event


class TestImportEvents(TestCase):
    def test_parse_awards(self):
        command = Command()
        with open("website/events/tests/2024_data.pickle", "rb") as f:
            data = pickle.load(f)

        command.awards = data["awards"]

        awards = command.parse_awards("2024misjo")
        self.assertEqual(len(awards), 2)
        self.maxDiff = None
        self.assertCountEqual(
            awards,
            [
                {
                    "name": "District Event Winner",
                    "recipients": ["frc2054", "frc2767", "frc5610", "frc5501"],
                },
                {
                    "name": "Autonomous Award",
                    "recipients": ["frc2767"],
                },
            ],
        )

    def test_parse_district(self):
        command = Command()
        with open("website/events/tests/2024_data.pickle", "rb") as f:
            data = pickle.load(f)

        tba = data["events"][1].district

        district = command.parse_district(tba)
        self.assertEqual(district["abbreviation"], "fim")
        self.assertEqual(district["display_name"], "FIRST In Michigan")
        self.assertEqual(district["key"], "2024fim")
        self.assertEqual(district["year"], 2024)

    def test_parse_webcasts(self):
        command = Command()
        with open("website/events/tests/2024_data.pickle", "rb") as f:
            data = pickle.load(f)

        # West Michigan Robotics Invitational has no webcasts
        tba = data["events"][7].webcasts
        webcasts = command.parse_webcasts(tba)
        self.assertEqual(webcasts, [])

        tba = data["events"][1].webcasts
        webcasts = command.parse_webcasts(tba)
        self.assertEqual(webcasts[0]["type"], "twitch")
        self.assertEqual(webcasts[0]["channel"], "firstinspires34")
        self.assertEqual(webcasts[0]["file"], None)
        self.assertEqual(webcasts[1]["type"], "youtube")
        self.assertEqual(webcasts[1]["channel"], "j1d_mc0ndhY")
        self.assertEqual(webcasts[1]["file"], None)
        self.assertEqual(webcasts[3]["type"], "youtube")
        self.assertEqual(webcasts[3]["channel"], "x166EHXb9X4")
        self.assertEqual(webcasts[3]["file"], None)

    def test_parse_status(self):
        command = Command()
        with open("website/events/tests/2024_data.pickle", "rb") as f:
            data = pickle.load(f)

        command.results = data["results"]
        status = command.parse_status("2024misjo")
        self.assertEqual(status, "won")

        status = command.parse_status("2024mikaai")
        self.assertEqual(status, "eliminated")

    def test_parse_status_none(self):
        command = Command()
        with open("website/events/tests/2024_data.pickle", "rb") as f:
            data = pickle.load(f)

        command.results = data["results"]
        status = command.parse_status("2024miwyo")
        self.assertEqual(status, "none")

    def test_parse_body(self):
        command = Command()
        with open("website/events/tests/2024_data.pickle", "rb") as f:
            data = pickle.load(f)

        command.results = data["results"]
        body = command.parse_body("2024miwyo")
        self.assertEqual(
            body,
            "Team 2767 was <b>Rank 1/18</b> with a record of <b>6-0-0</b> in quals.",
        )

        body = command.parse_body("2024wmri")
        self.assertEqual(body, "")

    def test_dont_overwrite_edited_events(self):
        command = Command()
        with open("website/events/tests/2024_data.pickle", "rb") as f:
            data = pickle.load(f)

        command.events = data["events"]
        command.awards = data["awards"]
        command.results = data["results"]

        command.handle(year=2024)
        event = Event.objects.get(key="2024misjo")
        self.assertIsNone(event.edited_on)
        self.assertEqual(event.status, "won")

        event.status = "edited"
        event.edited_on = datetime.datetime.now()
        event.save()

        command.handle(year=2024)
        event = Event.objects.get(key="2024misjo")
        self.assertEqual(event.status, "edited")
