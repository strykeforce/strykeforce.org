from __future__ import annotations

from django.core.management import BaseCommand
from django.core.management import CommandError
from django.db import transaction

from website.members.factories import StudentFactory
from website.members.models import Member


class Command(BaseCommand):
    help = "Seed database with sample student data."

    @transaction.atomic
    def handle(self, *args, **options):
        if Member.students.exists():
            raise CommandError(
                "This command cannot be run when any students exist, to guard against accidental use in production.",
            )

        self.stdout.write("Seeding database with sample students...")
        StudentFactory.create_batch(30)
        self.stdout.write("Done.")
