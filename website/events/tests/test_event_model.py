import datetime

from django.test import TestCase

from website.events.models import Event


class TestEventModel(TestCase):
    def test_event_key(self):
        event = Event.objects.get(pk=1)
        self.assertEqual(event.key, "test-2025")

    def test_event_key_collision(self):
        Event.objects.create(
            name="Test Event",
            event_code="TEST",
            year=2025,
        )
        event = Event.objects.get(pk=2)
        self.assertEqual(event.key, "test-2025-1")

    @classmethod
    def setUpTestData(cls):
        Event.objects.create(
            name="Test Event",
            event_code="TEST",
            event_type=1,
            city="Test City",
            state_prov="Test State",
            start_date=datetime.datetime.now(),
            end_date=datetime.datetime.now(),
            year=2025,
            week=1,
            gmaps_url="https://www.google.com/maps/place/Test+City,+Test+State,+12345",
            location_name="Test Location",
            website="https://www.test.com",
        )
