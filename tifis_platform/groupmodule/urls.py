# -*- coding: utf-8 -*-
from django.conf.urls import url
from . import views

urlpatterns = [
    url(
        r'^(?P<professor_username>[a-zA-Z0-9]+)/$',
        views.professor_periods_index,
        name='professor_periods_index'
    ),
    url(
        r'^get-periods/(?P<professor_username>[0-9A-Za-z]+)$',
        views.get_periods,
        name='get_periods'
    ),
    url(
        r'^(?P<professor_username>[0-9A-Za-z]+)/(?P<period_name>[^/]+)/$',
        views.professor_signatures_index,
        name='professor_signatures_index'
    ),
    url(
        r'^get-signatures/(?P<professor_username>[0-9A-Za-z]+)/' +
        r'(?P<period_name>[\w\W]+)$',
        views.get_signatures,
        name='get_signatures'
    ),
    url(
        r'^(?P<professor_username>[0-9A-Za-z]+)/(?P<period_name>[^/]+)' +
        r'/(?P<signature_name>[^/]+)/$',
        views.professor_groups_index,
        name='professor_groups_index'
    ),
    url(
        r'^get-groups/(?P<professor_username>[0-9A-Za-z]+)/' +
        r'(?P<period_name>[^/]+)/(?P<signature_name>[^/]+)/$',
        views.get_groups,
        name='get_groups'
    ),
    url(
        r'^get-current-user$',
        views.get_current_user,
        name='get_current_user'
    ),
    url(
        r'^new-period$',
        views.new_period,
        name='new_period'
    ),
    url(
        r'^new-signature$',
        views.new_signature,
        name='new_signature'
    ),
    url(
        r'^new-group$',
        views.new_group,
        name='new_group'
    ),
    url(r'get-ajax-response$', views.ajax_test, name='ajax_test')
    # url(r'^group$', views.student_index, name='student_index'),
]
