from django.db import models
from django.contrib.auth.models import Group, User

# Create your models here.
class Professor(models.Model):
    user_id = models.ForeignKey(User)
    mother_last_name = models.CharField(max_length=50, null=False)
    enrollment = models.CharField(max_length=15, null=False, unique=True)

class Student(models.Model):
    user_id = models.ForeignKey(User)
    mother_last_name = models.CharField(max_length=50, null=False)
    enrollment = models.CharField(max_length=15, null=False, unique=True)
