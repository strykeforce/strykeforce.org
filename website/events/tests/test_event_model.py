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
