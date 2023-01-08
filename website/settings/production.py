from __future__ import annotations

import os

from .base import *  # noqa

DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]
ALLOWED_HOSTS = [
    "strykeforce.j3ff.io",
    "strykeforce.org",
    "www.strykeforce.org",
]

try:
    from .local import *  # noqa
except ImportError:
    pass

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/website",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    },
}
