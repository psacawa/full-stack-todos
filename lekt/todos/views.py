from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from .models import Todo

class TodoSerializer(ModelSerializer):
    class Meta:
        model = Todo

class TodoViewSet(ModelViewSet):
    model = Todo
    serializer_class = TodoSerializer

def home(request):
    """ stub home view"""
    return render ('index.html')
