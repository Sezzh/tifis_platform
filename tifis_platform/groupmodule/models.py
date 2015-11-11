from django.db import models
from usermodule.models import Professor, Student
# Create your models here.

class Period(models.Model):
    professor = models.ForeignKey(Professor)
    name = models.CharField(max_length=10, null=False)
    start_date = models.DateField(
        auto_now=False, auto_now_add=False, null=False
    )
    end_date = models.DateField(
        auto_now=False, auto_now_add=False, null=False
    )
