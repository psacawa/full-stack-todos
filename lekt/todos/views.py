from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from rest_framework import fields
from rest_framework.permissions import IsAuthenticated
from .models import Todo
#  from .utils import ReadWriteSerializerMixin

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
        return Todo.objects.filter(owner=user)
    def perform_create(self, serializer):
        """ Fill in user from authentication data """
        serializer.save(owner=self.request.user)
    def perform_update(self, serializer):
        """ Fill in user from authentication data """
        serializer.save(owner=self.request.user)
