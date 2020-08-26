from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import TodoViewSet, SearchTodoView

router = SimpleRouter()
router.register(r"todos", TodoViewSet, basename="todos")
urlpatterns = router.urls
urlpatterns.append (path(r'search/', SearchTodoView.as_view(), name='todo_search' ))
