from __future__ import annotations

from django.core.management import BaseCommand
from django.core.management import CommandError
from django.db import transaction

from website.members.models import School


class Command(BaseCommand):
    help = "Seed database with school data."

    @transaction.atomic
    def handle(self, *args, **options):
        if School.objects.exists():
            raise CommandError(
                "This command cannot be run when any schools exist, to guard against accidental use in production.",
            )

        self.stdout.write("Seeding database with schools...")
        schools = [
            ("Comstock High School", "https://www.comstockps.org/Schools/high"),
            ("Galesburg Jr. Sr. High School", "https://ghs.galesburg205.org"),
            ("Gull Lake High School", "https://www.gulllakecs.org/glhs"),
            ("Hackett Catholic Prep", "https://csgk.org/hackett-welcome"),
            (
                "Kalamazoo Central High School",
                "https://www.kalamazoopublicschools.com/Domain/8",
            ),
            ("Loy Norrix High School", "https://www.kalamazoopublicschools.com/LNHS"),
            ("Mattawan High School", "https://www.mattawanschools.org/hs"),
            ("Parchment High School", "https://www.parchmentschools.org/o/phs"),
            ("Portage Central High School", "https://portageps.org/chs/"),
            ("Portage Northern High School", "https://portageps.org/nhs/"),
            (
                "Schoolcraft Jr. Sr. High School",
                "https://www.schoolcraftschools.org/o/shs",
            ),
            (
                "Vicksburg High School",
                "https://www.vicksburgschools.org/schools/high-school/",
            ),
        ]
        School.objects.bulk_create(
            [School(name=school[0], url=school[1]) for school in schools]
        )
        self.stdout.write("Done.")
