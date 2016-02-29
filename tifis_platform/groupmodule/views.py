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
from django.shortcuts import render, get_object_or_404
from lib.ext_base_serializers import ExtBaseSerializer, ExtJsonSerializer
from usermodule.models import Professor, Student
from .models import (
    Period, Signature, Group, StudentGroup, Notice, EvaluationType,
    ConfigurationPartial, ConfigurationValue, Partial
)
from .validators import ContextValidator


@login_required
def professor_periods_index(request, professor_username):
    """Send the period template and the form for create new periods.

    Check if the username which log into the system is a professor, then sends
    the proper template for load periods through ajax from the glbal app.js.

    Args:
        request: Usually request django objectself.
        professor_username: The value of the username passing through GET URL.

    Returns:
        response: Django Object with the template form for the periods.
    """
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            response = render(
                request, 'groupmodule/forms/new_period.html', context={}
            )
        else:
            response = HttpResponseRedirect(
                reverse(
                    'groupmodule:professor_periods_index',
                    args=[request.user.get_username()]
                )
            )
    else:
        response = HttpResponseRedirect(reverse('groupmodule:student_index'))
    return response


@login_required
def professor_signatures_index(request, professor_username, period_name):
    """Send the period selected object template for create new signatures.

    Check if the current user is a professor, then with his username and
    selected period look in the db if exist then loads the context period
    into the template for enable to create signatures for that period.

    if the period doesn't exist, then raises a 404 page not found error.

    Args:
        request: Usual django request object.
        professor_username: A string which contains the username.
        period_name: A string which contains the name of the period.

    Returns:
        response: Django usual render object with the attributes of the
        selected period.
            example:
            {'current_period_name': '2014 2',
             'current_period_start_date': '01 29 2019',
             'current_period_end_date': '04 30 2019',
             'current_period_pk': '233'}
    """
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            period_name = period_name.replace('-', ' ')
            current_user = User.objects.get(
                username__exact=request.user.get_username()
            )
            current_period = get_object_or_404(
                Period, name__exact=period_name,
                professor_id__exact=current_user.id
            )
            context = {
                'current_period_name': current_period.name,
                'current_period_start_date': current_period.start_date,
                'current_period_end_date': current_period.end_date,
                'current_period_pk': current_period.pk,
            }
            response = render(
                request, 'groupmodule/forms/new_signature.html', context
            )
        else:
            response = HttpResponseRedirect(
                reverse(
                    'groupmodule:professor_signatures_index',
                    args=[request.user.get_username(), period_name]
                )
            )
    else:
        response = HttpResponseRedirect(reverse('groupmodule:student_index'))
    return response


@login_required
def professor_groups_index(
        request, professor_username, period_name, signature_name):
    """Send the template and context of the selected signature.

    Check if the current user is a professor, then with the params send in the
    url find the period, the signature which is containig in the period for
    create the context and template for create groups for that signature.

    Args:
        request: Usually Django request object.
        professor_username: String which contains username.
        period_name: String which contains the period name of the user account.
        signature_name: String wich contains the signature name of the current
            period.

    Returns:
        response: Usually django render object with the dict context which
            contains the attributes of signature model requested.
            context example:
            {'current_signature_name': current_signature.name,
             'current_signature_career': current_signature.career,
             'current_signature_pk': current_signature.pk}
    """
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            signature_name = signature_name.replace('-', ' ')
            period_name = period_name.replace('-', ' ')
            current_user = User.objects.get(
                username__exact=request.user.get_username()
            )
            current_period = get_object_or_404(
                Period, name__exact=period_name,
                professor_id__exact=current_user.id
            )
            current_signature = get_object_or_404(
                Signature, name__exact=signature_name,
                period_id__exact=current_period.id
            )
            context = {
                'current_signature_name': current_signature.name,
                'current_signature_career': current_signature.career,
                'current_signature_pk': current_signature.pk,
            }
            response = render(
                request, 'groupmodule/forms/new_group.html', context
            )
        else:
            response = HttpResponseRedirect(
                reverse(
                    'groupmodule:professor_groups_index',
                    args=[
                        request.user.get_username(),
                        period_name, signature_name
                    ]
                )
            )
    else:
        response = HttpResponseRedirect(reverse('groupmodule:student_index'))
    return response


@login_required
def professor_group_detail_index(
        request, professor_username, period_name, signature_name, group_name):
    """
    """
    context = {
        'current_username': None,
        'current_period_name': None,
        'current_signature_name': None,
        'current_signature_career': None,
        'current_group_pk': None,
        'current_group_name': None,
        'current_group_group_code': None,
    }
    phrases = [
        _('Now, you have to set an evaluation '),
        _('type and configure 1 partial at '),
        _('least in order to invite students.')
    ]
    status_no_partial = ''.join(phrases)
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            period_name = period_name.replace('-', ' ')
            signature_name = signature_name.replace('-', ' ')
            group_name = group_name.replace('-', ' ')
            current_user = User.objects.get(
                username__exact=request.user.get_username()
            )
            current_period = get_object_or_404(
                Period, name__exact=period_name,
                professor_id__exact=current_user.id
            )
            current_signature = get_object_or_404(
                Signature, name__exact=signature_name,
                period_id__exact=current_period.id
            )
            current_group = get_object_or_404(
                Group, name__exact=group_name,
                signature_id__exact=current_signature.id
            )
            partials = current_group.partial_set.all()
            if len(partials) == 0:
                context['current_group_no_partials'] = status_no_partial
            context['current_username'] = current_user.get_username()
            context['current_period_name'] = current_period.name_url
            context['current_signature_name'] = current_signature.name_url
            context['current_signature_career'] = current_signature.career
            context['current_group_pk'] = current_group.pk
            context['current_group_name'] = current_group.name_url
            context['current_group_group_code'] = current_group.group_code
            response = render(
                request, 'groupmodule/professor_detail_group_view.html',
                context
            )
    return response


@login_required
def professor_group_configuration(
        request, professor_username, period_name, signature_name, group_name):
    """
    """
    configuration_text = _('There are two types of evaluation availables: ')
    warning_message = [
        _('If you choose an evaluation type this can '),
        _('not be changed in the future.'),
    ]
    context = {
        'configuration': _('this if now can be translate')
    }
    response = render(
        request, 'groupmodule/professor_group_configuration_view.html', context
    )
    return response


@login_required
def get_current_user(request):
    """Get the current user for front-end ajax purposes.

    Check if exist a login session, then get the user data set into the
    user_data dict type variable according to professor or student content
    and send back to the front formatted in JSON.

    Args:
        request: Usually Django object which contains the current session.

    Returns:
        response: The user data in JSON format.
    """
    user_data = User.objects.get(username__exact=request.user.get_username())
    data = {
        'username': user_data.get_username(),
        'name': user_data.get_short_name(),
        'father_last_name': user_data.last_name,
        'email': user_data.email,
        'error': False,
    }
    if hasattr(user_data, 'professor'):
        data['mother_last_name'] = user_data.professor.mother_last_name
        data['enrollment'] = user_data.professor.enrollment
    elif hasattr(user_data, 'student'):
        data['mother_last_name'] = user_data.student.mother_last_name
        data['enrollment'] = user_data.student.enrollment
    else:
        data['error'] = True
    response = JsonResponse(data)
    return response


@login_required
def new_period(request):
    """Creates a new period from the form of new_period.html template.

    Getting the data from a request.POST[] method to create a new period
    this works in the front-end with an ajax call, creating two datetime.date
    objects to handle the period_start_date and period_end_date model
    attributes, look in the Period objects of the current_user if exist a
    same period_name if this period name exist can not be two periods with
    the same name. It returns a data dict type variable with the result of the
    process in a JSON format.

    Args:
        request: Usually django request object with .POST[] attribute where
            can be find the form values.

    Returns:
        response: a dict type varaible in JSON format with the response of the
            process.
    """
    period_name = request.POST['period_name']
    start_month = int(request.POST['start_month'])
    start_day = int(request.POST['start_day'])
    start_year = int(request.POST['start_year'])
    end_month = int(request.POST['end_month'])
    end_day = int(request.POST['end_day'])
    end_year = int(request.POST['end_year'])
    data = {
        'status': '',
        'error': False,
    }
    status_ok = _('The period was successful created.')
    status_error = _("You can't have periods with the same name.")
    status_not_authorized = _('You are not authorized to create periods.')
    if hasattr(request.user, 'professor'):
        current_user = User.objects.get(
            username__exact=request.user.get_username()
        )
        period_start_date = datetime.date(
            start_year, start_month, start_day
        )
        period_end_date = datetime.date(
            end_year, end_month, end_day
        )
        periods = current_user.professor.period_set.all()
        for period in periods:
            if period.name == period_name:
                data['status'] = status_error
                data['error'] = True
        if not data['error']:
            current_user.professor.period_set.create(
                name=period_name, start_date=period_start_date,
                end_date=period_end_date
            )
            data['status'] = status_ok
    else:
        data['status'] = status_not_authorized
        data['error'] = True
    response = JsonResponse(data)
    return response


@login_required
def new_signature(request):
    """Creates a new signature from the form of new_signature.html template.

    Getting the data from a request.POST[] method to create a new signature
    this works in the front-end with an ajax call, look in the Signature
    objects of the current_user inside the current_period if exist a same
    signature_name in this period, can not be two signatures with the same
    name. It returns a data dict type variable with the result of the process
    in a JSON format.

    Args:
        request: Usually django request object with .POST[] attribute where
            can be find the form values.

    Returns:
        response: a dict type varaible in JSON format with the response of the
            process.
    """
    signature_name = request.POST['signature_name']
    signature_career = request.POST['signature_career']
    period_pk = int(request.POST['period_pk'])
    data = {
        'status': '',
        'error': False,
    }
    status_error = _('you already have a signature with that name.')
    status_ok = _('signature successful created.')
    status_not_authorized = _('you can not do this...')
    if hasattr(request.user, 'professor'):
        current_period = Period.objects.get(pk=period_pk)
        signatures = current_period.signature_set.all()
        for signature in signatures:
            if signature.name == signature_name:
                data['status'] = status_error
                data['error'] = True
        if not data['error']:
            current_period.signature_set.create(
                name=signature_name, career=signature_career
            )
            data['status'] = status_ok
    else:
        data['status'] = status_not_authorized
        data['error'] = True
    response = JsonResponse(data)
    return response


@login_required
def new_group(request):
    """Creates a new group from the form of new_group.html template.

    Getting the data from a request.POST[] method to create a new group
    this works in the front-end with an ajax call, look in the Group
    objects of the current_user inside the current_signature if exist a same
    group_name in this period, can not be two groups with the same
    name. It returns a data dict type variable with the result of the process
    in a JSON format.

    Args:
        request: Usually django request object with .POST[] attribute where
            can be find the form values.

    Returns:
        response: a dict type varaible in JSON format with the response of the
            process.
    """
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
        groups = current_signature.group_set.all()
        for group in groups:
            if group.name == group_name:
                data['status'] = status_error
                data['error'] = True
        if not data['error']:
            current_signature.group_set.create(
                name=group_name
            )
            data['status'] = status_ok
    else:
        data['status'] = status_not_authorized
        data['error'] = True
    response = JsonResponse(data)
    return response


@login_required
def get_periods(request, professor_username):
    """Get the Professor created periods from the database.

    With the professor_username through the url request search any period in
    the database relationated with the current username only the logged
    professo can see his own periods. If the professor doesn't has any period,
    returns a status saying "You have no periods availables."

    Args:
        request: Usually Django request object.
        professor_username: String which contains the username.

    Returns:
        response: a dict type variable wich contains a key string 'status' with
            a message for the user about his periods status, also a error
            boolean flag to know if is returning periods or not and finally a
            'periods' key which contains the serialize data with all periods of
            the current user.
            example:
                {'status': 'There are available periods.',
                 'error': False,
                 'periods': [{period_1_data}], [{period_2_data}]}
    """
    data = {
        'status': '',
        'error': False,
        'periods': None,
    }
    status_no_available_periods = _('You have no periods availables.')
    status_available_periods = _('There are available periods.')
    status_not_authorized = _('You are not authorized to request periods.')
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            current_user = User.objects.get(username__exact=professor_username)
            periods = current_user.professor.period_set.all()
            if len(periods) == 0:
                data['status'] = status_no_available_periods
                data['error'] = True
            else:
                data_dump = ExtJsonSerializer().serialize(
                    periods, fields=('name', 'start_date', 'end_date'),
                    props=['name_url']
                )
                data['periods'] = json.loads(data_dump)
                data['status'] = status_available_periods
                for key in data['periods']:
                    del key['model']
                    del key['pk']
            response = JsonResponse(data)
        else:
            response = HttpResponseRedirect(
                reverse(
                    'groupmodule:get_periods',
                    args=[request.user.get_username()]
                )
            )
    else:
        data['status'] = status_not_authorized
        data['error'] = True
        response = JsonResponse(data)
    return response


@login_required
def get_signatures(request, professor_username, period_name):
    """Get the Professor created signatures from the database.

    With the professor_username and period_name through the url request search
    any signature relationated with the current_period which is the period_name
    only professsor owners can get his owns signatures. If no signatures exists
    send a status message with no available signatures for that period.

    Args:
        request: Usually Django request object.
        professor_username: A string which contains the professor username.
        period_name: A string which contains the current period name.

    Returns:
        response: A Django JsonResponse object which contains status, error
            flag and the signatures. also can retrive another HttpRequest if
            the name of the professor_username arg don't have a coincidence
            with the current user logged.
    """
    data = {
        'status': '',
        'error': False,
        'signatures': None,
    }
    status_no_available_signatures = _('You have no signatures availables.')
    status_available_signatures = _('There are available signatures.')
    status_not_authorized = _('You are not authorized to request signatures.')
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            period_name = period_name.replace('-', ' ')
            current_user = User.objects.get(
                username__exact=request.user.get_username()
            )
            current_period = Period.objects.get(
                name__exact=period_name, professor_id__exact=current_user.id
            )
            signatures = current_period.signature_set.all()
            if len(signatures) == 0:
                data['status'] = status_no_available_signatures
                data['error'] = True
            else:
                data_dump = ExtJsonSerializer().serialize(
                    signatures, fields=('name', 'career'), props=['name_url']
                )
                data['signatures'] = json.loads(data_dump)
                data['status'] = status_available_signatures
                for d in data['signatures']:
                    del d['model']
            response = JsonResponse(data)
        else:
            response = HttpResponseRedirect(
                reverse(
                    'groupmodule:get_signatures',
                    args=[request.user.get_username(), period_name]
                )
            )
    else:
        data['status'] = status_not_authorized
        data['error'] = False
        response = JsonResponse(data)
    return response


@login_required
def get_groups(request, professor_username, period_name, signature_name):
    """Get the Professor created groups from the database.

    With the professor_username, period_name and signature_name getting each
    respective object. Try to find if the current_signature has any group
    available, if there are not groups sends a status_no_available_groups
    message for the user with a flag error True, in the other case sends the
    key data['groups'] with each groups available in the db relationated with
    de current_signature.

    Args:
        request: Usually Django request object.
        professor_username: A string which contains the professor username.
        period_name: A string which contains the current period name.
        signature_name: A string which contains the current signature name.

    Returns:
        response: A Django JsonResponse object which contains status, error
            flag and the groups. also can retrive another HttpRequest if
            the name of the professor_username arg don't have a coincidence
            with the current user logged.
    """
    data = {
        'status': '',
        'error': False,
        'groups': None,
    }

    status_no_available_groups = _('You have no groups availables.')
    status_available_groups = _('There are available groups.')
    status_not_authorized = [
        _('You are not authorized to request groups '),
        _('in this way.')
    ]
    if hasattr(request.user, 'professor'):
        if request.user.get_username() == professor_username:
            period_name = period_name.replace('-', ' ')
            signature_name = signature_name.replace('-', ' ')
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
            if len(groups) == 0:
                data['status'] = status_no_available_groups
                data['error'] = True
            else:
                data_dump = ExtJsonSerializer().serialize(
                    groups, fields=('name'), props=['name_url', 'group_code']
                )
                data['groups'] = json.loads(data_dump)
                data['status'] = status_available_groups
            response = JsonResponse(data)
        else:
            response = HttpResponseRedirect(
                reverse(
                    'groupmodule:get_groups',
                    args=[
                        request.user.get_username(), period_name,
                        signature_name
                    ]
                )
            )
    else:
        data['status'] = ''.join(status_not_authorized)
        data['error'] = True
        response = JsonResponse(data)
    return response


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
