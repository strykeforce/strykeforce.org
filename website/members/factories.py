from __future__ import annotations

import random

from factory import Faker
from factory import LazyFunction
from factory.django import DjangoModelFactory

from .models import Member
from .models import School

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
        model = Member

    member_type = "STUDENT"
    first_name = Faker("first_name")
    last_name = Faker("first_name")
    email = Faker("email")

    grade = LazyFunction(get_grade)
    school = LazyFunction(get_school)


class MentorFactory(DjangoModelFactory):
    class Meta:
        model = Member

    member_type = "MENTOR"
    first_name = Faker("first_name")
    last_name = Faker("first_name")
    email = Faker("email")

    title = Faker("job")
    blurb = Faker("paragraph", nb_sentences=5)
