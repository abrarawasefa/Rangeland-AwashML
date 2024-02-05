from django.urls import path
from GisApp.views import *
from django.contrib.auth.decorators import login_required

app_name = 'GisApp'

urlpatterns = [
    path('', dashboard, name='element-list'),
    path('create-feature', createSpatialFeature, name='create-spatial-feature'),
    path('modal', modal, name='modal-popup'),
    path('navbar', navbar, name='navbar'),
]