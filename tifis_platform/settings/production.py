# -*- encoding: utf-8 -*-

from base import *

print "running production"

#sensitive data
CFG = yamjam()['tifis_prod']
DBCFG = yamjam()['tifis_prod']['database']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = CFG['django_secret_key']

ADMINS = (
    ('Webmaster', 'sezzhltd@gmail.com'),
    ('Administrator', 'sezzhltd@gmail.com')
)

MANAGERS = ADMINS

# SECURITY session stuff
# These three params is for HTTPS configurations
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
# This value is for prevent ajax calls with client-side javascript
CSRF_COOKIE_HTTPONLY = False


X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
# SECURE_SSL_REDIRECT = True

# A list of strings representing the host/domain names that this Django
# site can serve.
ALLOWED_HOSTS = [
    '.tifis.dynalias.com'
    '192.168.1.84'
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
