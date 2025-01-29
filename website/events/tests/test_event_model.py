from django.test import TestCase

from website.events.models import Event


class TestEventModel(TestCase):
    def test_event_key(self):
        Event.objects.create(
            name="Test Event",
            event_code="TEST",
            year=2025,
        )
        event = Event.objects.get(event_code="TEST")
        self.assertEqual(event.key, "test-2025")
        Event.objects.all().delete()

    def test_event_key_collision(self):
        Event.objects.create(
            name="Test Event 1",
            event_code="TEST",
            year=2025,
        )
        Event.objects.create(
            name="Test Event 2",
            event_code="TEST",
            year=2025,
        )
        event = Event.objects.get(name="Test Event 2")
        self.assertEqual(event.key, "test-2025-1")
        Event.objects.all().delete()

    def test_website(self):
        event = Event.objects.create(
            name="Test Event",
            event_code="TEST",
            year=2025,
            website="https://www.test.com",
        )
        event = Event.objects.get(pk=event.pk)
        self.assertEqual(event.website, "https://www.test.com")
        Event.objects.all().delete()

    def test_website_firstinmichigan(self):
        event = Event.objects.create(
            name="Test Event",
            event_code="TEST",
            year=2025,
            website="http://www.firstinmichigan.org/",
        )
        event = Event.objects.get(pk=event.pk)
        self.assertEqual(event.website, "https://www.firstinmichigan.org/FRC/TEST")
        Event.objects.all().delete()


class TestEventManager(TestCase):
    @classmethod
    def setUpTestData(cls):
        Event.objects.create(name="E1", event_code="e1", year=2023, status="won")
        Event.objects.create(name="E2", event_code="e2", year=2023, status="eliminated")
        Event.objects.create(name="E3", event_code="e3", year=2024, status="default")
        Event.objects.create(name="E4", event_code="e4", year=2024, status="won")
        Event.objects.create(name="E5", event_code="e5", year=2024, status="won")
        Event.objects.create(name="E6", event_code="e6", year=2025, status="won")
        Event.objects.create(name="E7", event_code="e7", year=2026, status="default")
        Event.objects.create(name="E8", event_code="e8", year=2026, status="default")

    def test_years(self):
        years = Event.objects.years()
        self.assertEqual(years.count(), 4)
        self.assertCountEqual(years, [2023, 2024, 2025, 2026])

    def test_won_events_for_year_returns_correct_events(self):
        won_events = Event.objects.won_events_for_year(2024)
        self.assertEqual(won_events.count(), 2)
        self.assertCountEqual(won_events.values_list("name", flat=True), ["E4", "E5"])

    def test_won_events_for_year_excludes_non_won_events(self):
        won_events = Event.objects.won_events_for_year(2023)
        for event in won_events:
            self.assertEqual(event.status, "won")

    def test_won_events_for_year_excludes_different_years(self):
        won_events = Event.objects.won_events_for_year(2024)
        for event in won_events:
            self.assertEqual(event.year, 2024)

    def test_won_events_for_year_no_won_events(self):
        # Choose a year with no 'won' events
        won_events = Event.objects.won_events_for_year(2026)
        self.assertEqual(won_events.count(), 0)

    def test_won_events_for_year_handles_no_events_in_year(self):
        # Choose a year with no events
        won_events = Event.objects.won_events_for_year(2022)
        self.assertEqual(won_events.count(), 0)
