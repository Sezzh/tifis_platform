from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^log-in$', views.view_to_log_in, name='log_in' ),
    url(r'^get-log-in$', views.get_log_in, name='get_log_in'),
    url(r'^log-out$', views.log_out, name='log_out' ),
    url(r'^create-new-user$', views.create_new_user, name='create_new_user' ),
    url(r'^bad-log-in/(?P<login_error_message>[0-9]+)$', views.bad_log_in, name='bad_log_in'),
]
