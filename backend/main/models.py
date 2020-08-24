from django.db import models
from django.contrib.auth.models import User
import logging 
logger = logging.getLogger(__name__)


class UserProfile(models.Model):
    """ User Profile """

    #  id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    todos = models.ManyToManyField("Todo")

    def __repr__(self):
        return f"UserProfile(user={self.user})"

    def __str__(self):
        return self.user.name
