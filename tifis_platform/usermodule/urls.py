from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login$', views.view_to_login, name = 'login' ),
    url(r'^getlogin$', views.getlogin, name = 'getlogin'),
    url(r'^logout$', views.log_out, name = 'log_out' ),
    url(r'^create-new-user$', views.create_new_user, name = 'create_new_user' ),
    url(r'^badlogin/(?P<login_error_message>[0-9]+)$', views.badlogin, name = 'badlogin'),
]
