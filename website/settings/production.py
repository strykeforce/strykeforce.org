from .base import *  # noqa

DEBUG = False

try:
    from .local import *
except ImportError:
    pass
