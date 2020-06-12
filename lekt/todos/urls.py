from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import TodoViewSet, home

router = SimpleRouter()
router.register(r"todos", TodoViewSet, basename="todos")
urlpatterns = router.urls
urlpatterns += [path(r"/", home)]
