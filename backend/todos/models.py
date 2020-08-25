from django.db import models
from django.db.models.manager import BaseManager
from allauth.account.signals import email_confirmed

class Todo(models.Model):
    """ Generic Todo """

    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=1000)

    def __repr__(self):
        return f'Todo(text="{self.text}")'

    def __str__(self):
        return self.text
