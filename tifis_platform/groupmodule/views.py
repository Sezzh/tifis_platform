# -*- encoding: utf-8 -*-
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse, Http404, JsonResponse
from django.contrib.auth.models import Group, User
from django.db import IntegrityError
from usermodule.models import Professor, Student
# Create your views here.

@login_required
def professor_index(request, professor_id):
    if hasattr(request.user, 'professor'):
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
        return HttpResponseRedirect(reverse('groupmodule:student_index'))

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
