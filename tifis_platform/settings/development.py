# -*- encoding: utf-8 -*-

from base import *

print "running development"

#sensitive data
CFG = yamjam()['tifis']
DBCFG = yamjam()['tifis']['database']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = CFG['django_secret_key']

ADMINS = (
    ('Webmaster', 'sezzhltd@gmail.com'),
    ('Administrator', 'sezzhltd@gmail.com')
)

MANAGERS = ADMINS

ALLOWED_HOSTS = [
    '.devtifis.dynalias.com'
]

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': DBCFG['engine'],
        'NAME': DBCFG['name'],
        'USER': DBCFG['user'],
        'PASSWORD': DBCFG['password'],
        'HOST': DBCFG['host'],
        'PORT': DBCFG['port'],
    }
}
