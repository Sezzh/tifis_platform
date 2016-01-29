# -*- coding: utf-8 -*-
from django.db import models
from usermodule.models import Professor, Student
# Create your models here.


class Period(models.Model):
    professor = models.ForeignKey(Professor)
    name = models.CharField(max_length=50, null=False)
    start_date = models.DateField(
        auto_now=False, auto_now_add=False, null=False
    )
    end_date = models.DateField(
        auto_now=False, auto_now_add=False, null=False
    )

    def __unicode__(self):
        return self.name

    @property
    def name_url(self):
        return '%s' % (self.name.replace(' ', '-'))


class Signature(models.Model):
    period = models.ForeignKey(Period)
    name = models.CharField(max_length=30, null=False)
    career = models.CharField(max_length=80, null=True)

    def __unicode__(self):
        return self.name

    @property
    def name_url(self):
        return '%s' % (self.name.replace(' ', '-'))


class Group(models.Model):
    signature = models.ForeignKey(Signature)
    students = models.ManyToManyField(Student, through='StudentGroup')
    name = models.CharField(max_length=100, null=False)

    def __unicode__(self):
        return self.name

    @property
    def name_url(self):
        return '%s' % (self.name.replace(' ', '-'))

    @property
    def group_code(self):
        group_pk = str(self.pk)
        block_digits = 4
        code = ''
        count = 1
        for i in range(len(group_pk)):
            code += group_pk[i]
            if count == block_digits:
                if not i + 1 == len(number_str):
                    code += '-'
                count = 0
            count = count + 1
        return code


class StudentGroup(models.Model):
    student = models.ForeignKey(Student)
    group = models.ForeignKey(Group)
    authorized = models.BooleanField(default=False)
    participation = models.FloatField(default=0.0, null=True)


class Notice(models.Model):
    group = models.ForeignKey(Group)
    title = models.CharField(max_length=100, null=False)
    description = models.TextField(null=False)
    publish_date = models.DateTimeField(
        auto_now=True, auto_now_add=False, null=False
    )

    def __unicode__(self):
        return self.title


class EvaluationType(models.Model):
    name = models.CharField(max_length=20, null=False)

    def __unicode__(self):
        return self.name


class ConfigurationPartial(models.Model):
    homework = models.BooleanField(default=False)
    laboratory = models.BooleanField(default=False)
    project = models.BooleanField(default=False)
    review = models.BooleanField(default=False)
    exhibition = models.BooleanField(default=False)


class ConfigurationValue(models.Model):
    configuration_partial = models.OneToOneField(ConfigurationPartial)
    homework = models.FloatField(default=0.0, null=True)
    laboratory = models.FloatField(default=0.0, null=True)
    project = models.FloatField(default=0.0, null=True)
    review = models.FloatField(default=0.0, null=True)
    exhibition = models.FloatField(default=0.0, null=True)


class Partial(models.Model):
    group = models.ForeignKey(Group)
    evaluation_type = models.OneToOneField(EvaluationType)
    configuration_partial = models.OneToOneField(ConfigurationPartial)
    name = models.CharField(max_length=50, null=False)
    start_date = models.DateField(
        auto_now=False, auto_now_add=False, null=False
    )
    end_date = models.DateField(
        auto_now=False, auto_now_add=False, null=False
    )

    def __unicode__(self):
        return self.name
