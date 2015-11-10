from django.db import models
from django.contrib.auth.models import Group, User

# Create your models here.
class Professor(models.Model):
    user = models.OneToOneField(User, primary_key=True)
    mother_last_name = models.CharField(max_length=50, null=False)
    enrollment = models.CharField(max_length=15, null=False, unique=True)

    def __unicode__(self):
        return self.mother_last_name

class Student(models.Model):
    user = models.OneToOneField(User, primary_key=True)
    mother_last_name = models.CharField(max_length=50, null=False)
    enrollment = models.CharField(max_length=15, null=False, unique=True)

    def __unicode__(self):
        return self.mother_last_name
