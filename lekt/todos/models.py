from django.db import models
from django.db.models.manager import BaseManager
from django.contrib.auth.models import User


class Todo(models.Model):
    """ Generic todo """
    text = models.CharField(max_length=1000)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __repr__(self):
        return f'Todo(text="{self.text}", owner={self.owner})'
    
    def __str__(self):
        return self.text
