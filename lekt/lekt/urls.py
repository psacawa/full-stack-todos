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

def static_redirect(request: HttpRequest):
    """
    A stupid redirect to the directory serving files statically for development.
    """
    prefix = settings.STATIC_URL.rstrip(r'/')
    if len (request.path) <= 1: 
        request.path = '/index.html'
        print (f'new path is {request.path}')
    new_url = f"{prefix}{request.path}" 
    print (f'static_redirect to {new_url}') 
    return redirect(new_url)

urlpatterns = [
    path(r'admin/', admin.site.urls),
    path(r'api/', include ('todos.urls')),
]

# stupid  development hack to serve static files for frontend
if settings.DEBUG:
    urlpatterns += [
        re_path(r'^.*/$', static_redirect), 
        path('', static_redirect),
    ]
