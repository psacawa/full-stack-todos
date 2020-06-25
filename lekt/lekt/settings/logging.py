LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{asctime}] {levelname} {name} {lineno} {funcName} {message}",
            "style": "{",
        },
        "simple": {"format": "{levelname} {name} {message}", "style": "{"},
    },
    "loggers": {"lekt": {"handlers": ["console"], "level": "DEBUG", "propagate": True}},
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
}
