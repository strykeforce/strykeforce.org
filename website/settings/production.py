from __future__ import annotations

import os

from .base import *  # noqa

DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]

try:
    from .local import *  # noqa
except ImportError:
    pass
