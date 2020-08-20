from split_settings.tools import include, optional
from os import environ

ENVIRONMENT = environ.get("DJANGO_ENV", "development")
assert ENVIRONMENT in (
    "development",
    "production",
), f"Unsupported environment {ENVIRONMENT}"

base_patterns = [
    "base.py",
    "auth.py",
    "templates.py",
    "api.py",
    "database.py",
    "logging.py",
    "extra.py",
    f'{ENVIRONMENT}.py',
]

include (*base_patterns)
