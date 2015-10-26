from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.contrib.auth.models import Group, User

# Create your views here.

def index(request):
    """This for check databinding
    """
    context = {}
    return render(request, 'usermodule/index.html', context)


def view_to_login(request):
    """This returns the login for all system.
    """
    return render(request, 'usermodule/login.html')


def getlogin(request):
    """This do the work for login all users in the system.
    """
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username = username, password = password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponseRedirect(reverse('usermodule:index'))
        else:
            login_error_message = 1 #the user is inactive
            return HttpResponseRedirect(reverse('usermodule:badlogin', args=[login_error_message]))
    else:
        login_error_message = 2 # something go wrong
        return HttpResponseRedirect(reverse('usermodule:badlogin', args=[login_error_message]))


def badlogin(request, login_error_message):
    """This return errors for the user when happens a bad login in the whole
    system.
    """
    if login_error_message == '1':
        login_error_message = 'El usuario parece estar inactivo...'
    if login_error_message == '2':
        login_error_message = 'Algo salio mal intenta denuevo...'
    context = {
        'login_error_message': login_error_message
    }
    return render(request, 'usermodule/login.html', context)


def log_out(request):
    """Do the work for log off a user.
    """
    logout(request)
    return HttpResponseRedirect(reverse('usermodule:results'))
