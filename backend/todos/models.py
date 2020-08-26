from django.db import models
from django.db.models.manager import BaseManager
from allauth.account.signals import email_confirmed
from django.db.models import Q
from polymorphic.models import PolymorphicModel


class Todo(models.Model):
    """ Generic Todo """

    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=1000, unique=True)
    owner = models.ForeignKey(
        "main.UserProfile",
        on_delete=models.SET_NULL,
        null=True,
        related_name="personal_todos",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["text", "owner"],
                name="public_todos_unique",
                condition=Q(owner__isnull=True),
            )
        ]

    def __repr__(self):
        return f'Todo(text="{self.text}", owner="{self.owner}")'

    def __str__(self):
        return self.text
