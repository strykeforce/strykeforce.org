from __future__ import annotations

from django.core.management import BaseCommand
from django.core.management import call_command

from website.members.models import Member
from website.members.models import School


class Command(BaseCommand):
    help = "Creates random data."

    def handle(self, **options):
        if not School.objects.exists():
            call_command("seed_schools")
        else:
            self.stdout.write("Schools are loaded, skipping...")

        if not Member.students.exists():
            call_command("seed_sample_students")
        else:
            self.stdout.write("Students are loaded, skipping...")

        if not Member.mentors.exists():
            call_command("seed_sample_mentors")
        else:
            self.stdout.write("Mentors are loaded, skipping...")
