# -*- coding: utf-8 -*-
import datetime
import json
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required
from django.http import (
    HttpResponseRedirect, HttpResponse, Http404, JsonResponse
)
from django.contrib.auth.models import Group, User
from django.db import IntegrityError
from django.utils.translation import ugettext as _
from django.shortcuts import render
from lib.extbaseserializer import ExtBaseSerializer, ExtJsonSerializer
from usermodule.models import Professor, Student
from .models import (
    Period, Signature, Group, StudentGroup, Notice, EvaluationType,
    ConfigurationPartial, ConfigurationValue, Partial
)
# Create your views here.


@login_required
def professor_periods_index(request, professor_username):
    """Check if the username which log into the system is a professor and
    if he has any period in the database, then recover it and shows up.

    Keyword arguments:
    request -- Usually request django object.
    professor_username -- The value of the url passing through GET URL.
    """
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            return render(
                request, 'groupmodule/forms/new_period.html', context={}
            )
        else:
            return HttpResponseRedirect(
                reverse(
                    'groupmodule:professor_index',
                    args=[request.user.get_username()]
                )
            )
    else:
        return HttpResponseRedirect(reverse('groupmodule:student_index'))


@login_required
def professor_signatures_index(request, professor_username, period_name):
    """professor_signatures_index
    """
    period_name = period_name.replace('-', ' ')
    current_user = User.objects.get(
        username__exact=request.user.get_username()
    )
    current_period = Period.objects.get(
        name__exact=period_name, professor_id__exact=current_user.id
    )
    context = {
        'current_period_name': current_period.name,
        'current_period_start_date': current_period.start_date,
        'current_period_end_date': current_period.end_date,
        'current_period_pk': current_period.pk,
    }
    return render(
        request, 'groupmodule/forms/new_signature.html', context
    )


@login_required
def professor_groups_index(
        request, professor_username, period_name,
        signature_name):
    """professor_groups_index
    """
    context = {}
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            signature_name = signature_name.replace('-', ' ')
            period_name = period_name.replace('-', ' ')
            current_user = User.objects.get(
                username__exact=request.user.get_username()
            )
            current_period = Period.objects.get(
                name__exact=period_name, professor_id__exact=current_user.id
            )
            current_signature = Signature.objects.get(
                name__exact=signature_name, period_id__exact=current_period.id
            )
            context = {
                'current_signature_name': current_signature.name,
                'current_signature_career': current_signature.career,
                'current_signature_pk': current_signature.pk,
            }
            return render(request, 'groupmodule/forms/new_group.html', context)
    else:
        return HttpResponseRedirect(reverse('groupmodule:student_index'))


@login_required
def ajax_test(request):
    data = {}
    if not request.is_ajax():
        data = {
            'ajaxResponse': False
        }
    else:
        data = {
            'ajaxResponse': True
        }
    return JsonResponse(data)


@login_required
def get_current_user(request):
    """Get the current login user for front-end ajax purposes.
    """
    user_data = User.objects.get(username__exact=request.user.get_username())
    data = {
        'username': user_data.get_username(),
        'name': user_data.get_short_name(),
        'father_last_name': user_data.last_name,
        'email': user_data.email
    }
    if hasattr(user_data, 'professor'):
        data['mother_last_name'] = user_data.professor.mother_last_name
        data['enrollment'] = user_data.professor.enrollment
    elif hasattr(user_data, 'student'):
        data['mother_last_name'] = user_data.student.mother_last_name
        data['enrollment'] = user_data.student.enrollment
    else:
        data = {
            'error': _('no autorized')
        }
    return JsonResponse(data)


@login_required
def new_period(request):
    """Creates a new period from the form of new_period.html template with a
    request.POST ajax submit.
    Keyword arguments:
    request.POST[] -- Content of the form data.
    """
    period_name = ''
    start_month = ''
    start_day = ''
    start_year = ''
    end_month = ''
    end_day = ''
    end_year = ''
    data = {}
    if hasattr(request.user, 'professor'):
        if request.user.is_authenticated():
            period_name = request.POST['period_name']
            start_month = int(request.POST['start_month'])
            start_day = int(request.POST['start_day'])
            start_year = int(request.POST['start_year'])
            end_month = int(request.POST['end_month'])
            end_day = int(request.POST['end_day'])
            end_year = int(request.POST['end_year'])

            period_start_date = datetime.date(
                start_year, start_month, start_day
                )
            period_end_date = datetime.date(
                end_year, end_month, end_day
            )
            # saving the period in the database.
            try:
                period = request.user.professor.period_set.create(
                    name=period_name,
                    start_date=period_start_date,
                    end_date=period_end_date
                )
                data = {
                    'status': _('The period was successful created.')
                }
            except Exception as e:
                data = {
                    'status': e
                }
            return JsonResponse(data)
        else:
            return HttpResponseRedirect(reverse('username:index'))
    else:
        return HttpResponseRedirect(reverse('groupmodule:student_index'))


@login_required
def new_signature(request):
    signature_name = request.POST['signature_name']
    signature_career = request.POST['signature_career']
    period_pk = int(request.POST['period_pk'])
    data = {
        'status': '',
        'error': False,
    }
    status_error = _('you already have a signature with that name.')
    status_ok = _('signature successful created.')
    if hasattr(request.user, 'professor'):
        current_period_signatures = Signature.objects.filter(
            period_id__exact=period_pk
        )
        for i in range(len(current_period_signatures)):
            if current_period_signatures[i].name == signature_name:
                data['status'] = status_error
                data['error'] = True
        if not data['error']:
            current_period = Period.objects.get(pk=period_pk)
            current_period.signature_set.create(
                name=signature_name, career=signature_career
            )
            data['status'] = status_ok
        return JsonResponse(data)
    else:
        return HttpResponseRedirect(reverse('groupmodule:student_index'))


@login_required
def new_group(request):
    group_name = request.POST['group_name']
    signature_pk = int(request.POST['signature_pk'])
    data = {
        'status': '',
        'error': False,
    }
    status_error = _('you already have a group with that name.')
    status_ok = _('group successful created.')
    status_not_authorized = _('you can not do this...')
    if hasattr(request.user, 'professor'):
        current_signature = Signature.objects.get(pk=signature_pk)
        current_signature_groups = current_signature.group_set.all()
        if len(current_signature_groups) > 0:
            for i in range(len(current_signature_groups)):
                if current_signature_groups[i].name == group_name:
                    data['status'] = status_error
                    data['error'] = True
                else:
                    current_signature.group_set.create(name=group_name)
                    data['status'] = status_ok
        else:
            current_signature.group_set.create(name=group_name)
            data['status'] = status_ok
    else:
        data['status'] = status_not_authorized
        data['error'] = True
    return JsonResponse(data)


@login_required
def get_periods(request, professor_username):
    """Get the Professor created periods from the database and send to the
    front-end through JsonResponse.
    """
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            periods = request.user.professor.period_set.all()
            data = ExtJsonSerializer().serialize(
                periods, fields=('name', 'start_date', 'end_date'),
                props=['name_url']
            )
            data_dump = json.loads(data)
            for d in data_dump:
                del d['model']
                del d['pk']
            return JsonResponse(data_dump, safe=False)
        else:
            return HttpResponseRedirect(
                reverse(
                    'groupmodule:professor_index',
                    args=[request.user.get_username()]
                )
            )
    else:
        return HttpResponseRedirect(reverse('groupmodule:student_index'))


@login_required
def get_signatures(request, professor_username, period_name):
    if hasattr(request.user, 'professor'):
        period_name = period_name.replace('-', ' ')
        current_user = User.objects.get(
            username__exact=request.user.get_username()
        )
        current_period = Period.objects.get(
            name__exact=period_name, professor_id__exact=current_user.id
        )
        signatures = current_period.signature_set.all()
        if len(signatures) == 0:
            data = {
                'status': None,
            }
        else:
            data = ExtJsonSerializer().serialize(
                signatures, fields=('name', 'career'), props=['name_url']
            )
            data_dump = json.loads(data)
            for d in data_dump:
                del d['model']
        return JsonResponse(data_dump, safe=False)
    else:
        return HttpResponseRedirect(reverse('groupmodule:student_index'))


@login_required
def get_groups(request, professor_username, period_name, signature_name):
    period_name = period_name.replace('-', ' ')
    signature_name = signature_name.replace('-', ' ')
    data = {
        'status': '',
        'error': False
    }
    if hasattr(request.user, 'professor'):
        current_user = User.objects.get(
            username__exact=request.user.get_username()
        )
        current_period = Period.objects.get(
            name__exact=period_name, professor_id__exact=current_user.id
        )
        current_signature = Signature.objects.get(
            name__exact=signature_name, period_id__exact=current_period.id
        )
        groups = current_signature.group_set.all()
        data_serialize = ExtJsonSerializer().serialize(
            groups, fields=('name'), props=['name_url', 'group_code']
        )
        data = json.loads(data_serialize)
    else:
        data['error'] = True
    return JsonResponse(data, safe=False)


@login_required
def student_index(request):
    if hasattr(request.user, 'student'):
        if request.user.is_authenticated():
            context = {
                'work': 'Eres un usuario',
                'usuario': request.user
            }
        else:
            context = {
                'work': 'Eres un usuario anonimo',
                'usuario': request.user
            }
        return render(request, 'groupmodule/testview.html', context)
    else:
        return HttpResponseRedirect(reverse('groupmodule:professor_index'))
