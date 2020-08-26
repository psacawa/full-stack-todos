from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from rest_framework import fields
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .models import Todo
from main.models import UserProfile
import logging
logger = logging.getLogger(__name__)

class TodoSerializer(ModelSerializer):
    owner = PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Todo
        fields = "__all__"


class TodoViewSet(ModelViewSet):
    model = Todo
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """ Get only todos for the authed user. """
        user = self.request.user
        return user.profile.todos.all()
    
    def perform_create(self, serializer):
        """ Fill in user from authentication data """
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        """ Fill in user from authentication data """
        serializer.save(owner=self.request.user)

class SearchTodoView(generics.ListAPIView):
    #  permission_classes = [IsAuthenticated]
    serializer_class = TodoSerializer

    def get_queryset(self):
        data = self.request.data
        search_query = self.request.query_params.get('search_query', '')
        return Todo.objects.filter(text__contains=search_query, owner__isnull=True)
