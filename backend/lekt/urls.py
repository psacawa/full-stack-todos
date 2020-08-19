"""lekt URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.http.request import HttpRequest
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static
from os.path import join
from .views import csrf_view
from dj_rest_auth.registration.views import VerifyEmailView
from allauth.account.views import ConfirmEmailView,  EmailVerificationSentView

urlpatterns = [
    path(r"admin/", admin.site.urls),
    path(r"api/", include("todos.urls")),
    path(r"auth/", include("dj_rest_auth.urls")),
    path(r"auth/registration/", include("dj_rest_auth.registration.urls")),
    re_path(
        r"^auth/confirm-email/(?P<key>[-:\w]+)/$",
        ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
    path(
        "auth/confirm-email/",
        EmailVerificationSentView.as_view(),
        name="account_email_verification_sent",
    )
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [path("__debug__", include(debug_toolbar.urls)),] + urlpatterns
