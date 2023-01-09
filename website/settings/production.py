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
        "LOCATION": "unix:///run/redis/redis.sock?db=0",
        "TIMEOUT": None,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PARSER_CLASS": "redis.connection.HiredisParser",
            "PICKLE_VERSION": -1,
        },
    },
}

CACHE_MIDDLEWARE_ALIAS = "default"
CACHE_MIDDLEWARE_SECONDS = 604800
CACHE_MIDDLEWARE_KEY_PREFIX = ""

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"
