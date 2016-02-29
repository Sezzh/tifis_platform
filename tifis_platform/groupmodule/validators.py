"""
"""


class ProfessorValidator(object):
    """docstring for ProfessorValidator"""
    def __init__(self, professor_username):
        self.professor_username = professor_username


class ContextValidator(object):
    """docstring for ContextValidator"""
    def __init__(self, **kwargs):
        if 'current_user' in kwargs:
            self._current_user = User.objects.get(
                username__exact=kwargs['current_user'].user.get_username()
            )
        if 'period_name' in kwargs:
            self._period_name = kwargs['period_name'].replace('-', ' ')
        else:
            self._period_name = None
        if 'signature_name' in kwargs:
            self._signature_name = kwargs['signature_name'].replace('-', ' ')
        else:
            self._signature_name = None
        if 'group_name' in kwargs:
            self._group_name = kwargs['group_name'].replace('-', ' ')
        else:
            self._group_name = None
        self._current_period = None
        self._current_group = None
        self._current_signature = None

    @property
    def current_user(self):
        return self._current_user

    @current_user.setter
    def current_user(self, current_user):
        self._current_user = current_username

    @property
    def period_name(self):
        return self._period_name

    @period_name.setter
    def period_name(self, period_name):
        self._period_name = period_name

    @property
    def signature_name(self):
        return self._signature_name

    @signature_name.setter
    def signature_name(self, signature_name):
        self._signature_name = signature_name

    @property
    def group_name(self):
        return self._group_name

    @group_name.setter
    def group_name(self, group_name):
        self._group_name = group_name

    @property
    def current_period(self):
        return self._current_period

    @current_period.setter
    def current_period(self, current_period):
        self._current_period = current_period

    @property
    def current_signature(self):
        return self._current_signature

    @current_signature.setter
    def current_signature(self, current_signature):
        self._current_signature = current_signature

    @property
    def current_group(self):
        return self._current_group

    @current_group.setter
    def current_group(self, current_group):
        self._current_group = current_group

    def validate(self):
        if self.period_name is not None:
            self.validate_period()
        if self.signature_name is not None:
            self.validate_signature()
        if self.group_name is not None:
            self.validate_group()

    def validate_period(self):
        self.current_period = get_object_or_404(
            Period, name__exact=period_name,
            professor_id__exact=self.current_user.id
        )

    def validate_signature(self):
        self.current_signature = get_object_or_404(
            Signature, name__exact=signature_name,
            period_id__exact=current_period.id
        )

    def validate_group(self):
        self.current_group = get_object_or_404(
            Group, name__exact=group_name,
            signature_id__exact=current_signature.id
        )
