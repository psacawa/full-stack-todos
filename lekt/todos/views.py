from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from .models import Todo

class TodoSerializer(ModelSerializer):
    class Meta:
        model = Todo
        fields = "__all__"

class TodoViewSet(ModelViewSet):
    model = Todo
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

