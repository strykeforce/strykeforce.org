from __future__ import annotations

from django.core.management import BaseCommand
from django.core.management import CommandError
from django.db import transaction

from website.members.factories import MentorFactory
from website.members.models import Mentor


class Command(BaseCommand):
    help = "Seed database with sample student data."

    @transaction.atomic
    def handle(self, *args, **options):
        if Mentor.objects.exists():
            raise CommandError(
                "This command cannot be run when any students exist, to guard against accidental use in production.",
            )

        self.stdout.write("Seeding database with sample students...")
        MentorFactory.create_batch(5)
        self.stdout.write("Done.")
