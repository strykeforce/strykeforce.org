from __future__ import annotations

import random

from factory import Faker
from factory import LazyFunction
from factory.django import DjangoModelFactory

from .models import Mentor
from .models import School
from .models import Student

schools = None


def get_school():
    global schools
    if schools is None:
        schools = list(School.objects.all())
    return random.choice(schools)


def get_grade():
    return random.randrange(12) + 1


class StudentFactory(DjangoModelFactory):
    class Meta:
        model = Student

    first_name = Faker("first_name")
    last_name = Faker("first_name")
    email = Faker("email")

    grade = LazyFunction(get_grade)
    school = LazyFunction(get_school)


class MentorFactory(DjangoModelFactory):
    class Meta:
        model = Mentor

    first_name = Faker("first_name")
    last_name = Faker("first_name")
    email = Faker("email")

    blurb = Faker("paragraph", nb_sentences=5)
