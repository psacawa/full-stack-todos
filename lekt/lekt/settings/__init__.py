from split_settings.tools import include, optional
from os import environ

base_patterns = [
    "base.py",
    "auth.py",
    "templates.py",
    "api.py",
    "database.py",
    "logging.py",
]

include (*base_patterns)
