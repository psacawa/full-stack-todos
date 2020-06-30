# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASE_CONFIG = (
    #  {
    #      "ENGINE": "django.db.backends.sqlite3",
    #      "NAME": join(BASE_DIR, "db.sqlite3"),
    #  }
    #  if DEBUG
    #  else 
    {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "todos",
        "USER": "django",
        "PASSWORD": "pass",
        "HOST": "localhost",
    }
)

DATABASES = {"default": DATABASE_CONFIG}
