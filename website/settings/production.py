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
