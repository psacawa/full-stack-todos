import pytest
from rest_framework.test import APIClient
from test_plus.test import APITestCase
from django.core import mail
from rest_framework.response import Response
from rest_framework import status
from pytest_django.asserts import TestCase
from allauth.account.models import EmailAddress
import re
import logging

pytestmark = pytest.mark.filterwarnings("ignore::")

@pytest.mark.django_db
def create_account_test(tp_api: APITestCase, mailoutbox):
    create_account_data = {
        "username": "testuser",
        "password1": "sdfgsdfg",
        "password2": "sdfgsdfg",
        "email": "testuser@gmail.com",
    }

    response: Response = tp_api.client.post("/auth/registration/", create_account_data)

    assert response.status_code == 201
    assert len(mailoutbox) == 1
    email: mail.EmailMessage = mailoutbox[0]
    assert len(email.to) == 1
    assert ["testuser@gmail.com"] == email.to

    assert EmailAddress.objects.count() == 1
    email_address: EmailAddress = EmailAddress.objects.get()
    assert not email_address.verified 
