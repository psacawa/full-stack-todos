# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASE_CONFIG = {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": "todos",
    "USER": "django",
    "PASSWORD": "pass",
    "HOST": "localhost",
}

DATABASES = {"default": DATABASE_CONFIG}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "TIMEOUT": 30,
        "LOCATION": "redis://127.0.0.1:6379",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            #  "PASSWORD": "sekret",
        },
    }
}
