REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50
    #  'DEFAULT_THROTTLE_CLASSES': [
    #      'rest_framework.throttling.UserRateThrottle',
    #  ],
    #  'DEFAULT_THROTTLE_RATES': {
    #      'user': '1/second',
    #  }
}
