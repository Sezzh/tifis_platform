# -*- encoding: utf-8 -*-
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse, Http404, JsonResponse
from django.contrib.auth.models import Group, User
from django.db import IntegrityError

from .models import Professor, Student
# Create your views here.

def index(request):
    """This for check databinding.
    """
    context = {}
    return render(request, 'usermodule/index.html', context)

def create_new_user(request):
    """This function is used for create new users throw the login register
    usermodule.
    """
    username = request.POST['username']
    password = request.POST['password']
    email = request.POST['email']
    enrollment = request.POST['enrollment']
    name = request.POST['name']
    last_name = request.POST['last_name']
    mother_last_name = request.POST['mother_last_name']
    account_type = request.POST['account_type']
    try:
        new_user = User.objects.create_user(username, email, password)
        new_user.last_name = last_name
        new_user.first_name = name
        new_user.save()

        if account_type == 'professor':
            new_account = Professor(
                user=new_user, enrollment=enrollment,
                mother_last_name=mother_last_name
            )

        if account_type == 'student':
            new_account = Student(
                user=new_user, enrollment=enrollment,
                mother_last_name=mother_last_name
            )

        new_account.save()

    except IntegrityError as e:
        # error if the username already exist in the database.
        context = {
            'username': username,
            'message': 'El usuario ya exisite, elige otro',
        }
        return JsonResponse(context)
    # if all is fine just told to the user he alredy got an account.
    context = {
        'username': username,
        'message': 'Todo salio bien, ahora inicia sesión',
    }
    return JsonResponse(context)
    #return render(request, 'usermodule/testview.html', context)



def view_to_login(request):
    """This returns the login for all system.
    """
    return render(request, 'usermodule/login.html')


def getlogin(request):
    """This do the work for login all users in the system.
    """
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponseRedirect(reverse('usermodule:index'))
        else:
            login_error_message = 1 #the user is inactive
            return HttpResponseRedirect(
                reverse('usermodule:badlogin', args=[login_error_message])
            )
    else:
        login_error_message = 2 # something go wrong
        return HttpResponseRedirect(
            reverse('usermodule:badlogin', args=[login_error_message])
        )


def badlogin(request, login_error_message):
    """This return errors for the user when happens a bad login in the whole
    system.
    """
    if login_error_message == '1':
        login_error_message = 'El usuario parece estar inactivo...'
    if login_error_message == '2':
        login_error_message = 'Algo salio mal intenta de nuevo...'
    context = {
        'login_error_message': login_error_message
    }
    return render(request, 'usermodule/index.html', context)


def log_out(request):
    """Do the work for log off a user.
    """
    logout(request)
    return HttpResponseRedirect(reverse('usermodule:results'))
