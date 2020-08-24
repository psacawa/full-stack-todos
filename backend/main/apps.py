from django.apps import AppConfig

class TodosConfig(AppConfig):
    name = 'todos'
    def ready(self):
        from .signals import createUserProfile
