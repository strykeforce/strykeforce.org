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

MIDDLEWARE = (
    ["django.middleware.cache.UpdateCacheMiddleware"]
    + MIDDLEWARE
    + ["django.middleware.cache.FetchFromCacheMiddleware"]
)

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/website",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    },
}

CACHE_MIDDLEWARE_ALIAS = "default"
CACHE_MIDDLEWARE_SECONDS = 600  # or 604800 for 1 week
CACHE_MIDDLEWARE_KEY_PREFIX = ""
