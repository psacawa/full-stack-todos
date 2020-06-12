from django.db import models

# Create your models here.

class Todo(models.Model):
    """ Generic todo """
    text = models.CharField (max_length = 1000)
    author = models.CharField (max_length = 100, default = 'psacawa')
