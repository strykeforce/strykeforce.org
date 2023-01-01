from __future__ import annotations

from django.core.management import BaseCommand
from django.core.management import CommandError
from django.db import transaction

from website.members.factories import MentorFactory
from website.members.models import Member


class Command(BaseCommand):
    help = "Seed database with sample student data."

    @transaction.atomic
    def handle(self, *args, **options):
        if Member.mentors.exists():
            raise CommandError(
                "This command cannot be run when any mentors exist, to guard against accidental use in production.",
            )

        self.stdout.write("Seeding database with sample mentors...")
        MentorFactory.create_batch(5)
        self.stdout.write("Done.")
