from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^period/(?P<professor_id>[0-9]+)$', views.professor_index, name='professor_index'),
    url(r'^group$', views.student_index, name='student_index'),
]
