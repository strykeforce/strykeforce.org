from __future__ import annotations

from django.core.management import BaseCommand
from django.core.management import call_command

from website.members.models import Mentor
from website.members.models import School
from website.members.models import Student


class Command(BaseCommand):
    help = "Creates random data."

    def handle(self, **options):
        if not School.objects.exists():
            call_command("seed_schools")
        else:
            self.stdout.write("Schools are loaded, skipping...")

        if not Student.objects.exists():
            call_command("seed_sample_students")
        else:
            self.stdout.write("Students are loaded, skipping...")

        if not Mentor.objects.exists():
            call_command("seed_sample_mentors")
        else:
            self.stdout.write("Mentors are loaded, skipping...")
