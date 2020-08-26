import pytest
from .models import Todo
from test_plus.test import APITestCase
from rest_framework.response import Response
from django.urls import reverse


@pytest.mark.django_db
def todo_searchview_test(tp_api: APITestCase):
    """ basic test of functionality of todo search view """
    response: Response = tp_api.client.get(
        '/api/search/', data={"search_query": "justifie"}
    )
    tp_api.response_200 (response)
    for item in response.data['results']:
       assert "justifie" in item['text']
       assert item['owner'] == None
