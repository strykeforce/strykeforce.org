from __future__ import annotations

from .dev import *  # noqa

DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    },
}

MIGRATION_MODULES = {app: None for app in INSTALLED_APPS}  # noqa
