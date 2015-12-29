# -*- encoding: utf-8 -*-

from base import *

print "running production"

#sensitive data
CFG = yamjam()['tifis_prod']
DBCFG = yamjam()['tifis_prod']['database']

# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = CFG['django_secret_key']

ADMINS = (
    ('Webmaster', 'sezzhltd@gmail.com'),
    ('Administrator', 'sezzhltd@gmail.com')
)

# SECURITY session stuff
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_SSL_REDIRECT = True



MANAGERS = ADMINS

DEBUG = False

ALLOWED_HOSTS = [
    '.tifis.dynalias.com'
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
