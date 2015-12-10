#! /bin/sh

pip install virtualenv

virtualenv env

source env/Scripts/activate

easy_install binaries/psycopg2-2.6.1.win-amd64-py2.7-pg9.4.4-release.exe

pip install -I django==1.8.6

pip install ipython ipdb pyreadline yamjam
