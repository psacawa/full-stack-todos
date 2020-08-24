from django.dispatch import receiver
from allauth.account.signals import email_confirmed
from .models import UserProfile
import logging
logger = logging.getLogger(__name__)


@receiver(email_confirmed)
def createUserProfile(sender, **kwargs):
    """createUserProfile on User creation"""
    try:
        logger.debug (f"{createUserProfile}: {kwargs}")
        email = kwargs.get("email_address")
        user = email.user
        user_profile = UserProfile.objects.create(user=user)
        user_profile.save()
    except Exception as e:
        logger.error(e)
        raise e
