from django.core.serializers.base import Serializer as BaseSerializer
from django.core.serializers.python import Serializer as PythonSerializer
from django.core.serializers.json import Serializer as JsonSerializer
from django.utils import six

class ExtBaseSerializer(BaseSerializer):
    """ Abstract serializer class; everything is the same as Django's base
    except from the marked lines. 
    """
    def serialize(self, queryset, **options):
        self.options = options

        self.stream = options.pop('stream', six.StringIO())
        self.selected_fields = options.pop('fields', None)
        self.selected_props = options.pop('props', None)  # added this
        self.use_natural_keys = options.pop('use_natural_keys', False)
        self.use_natural_foreign_keys = options.pop('use_natural_foreign_keys', False)
        self.use_natural_primary_keys = options.pop('use_natural_primary_keys', False)

        self.start_serialization()
        self.first = True
        for obj in queryset:
            self.start_object(obj)
            concrete_model = obj._meta.concrete_model
            for field in concrete_model._meta.local_fields:
                if field.serialize:
                    if field.rel is None:
                        if self.selected_fields is None or field.attname in self.selected_fields:
                            self.handle_field(obj, field)
                    else:
                        if self.selected_fields is None or field.attname[:-3] in self.selected_fields:
                            self.handle_fk_field(obj, field)
            for field in concrete_model._meta.many_to_many:
                if field.serialize:
                    if self.selected_fields is None or field.attname in self.selected_fields:
                        self.handle_m2m_field(obj, field)
            # added this loop
            if self.selected_props:
                for field in self.selected_props:
                    self.handle_prop(obj, field)
            self.end_object(obj)
            if self.first:
                self.first = False
        self.end_serialization()
        return self.getvalue()

    # added this function
    def handle_prop(self, obj, field):
        self._current[field] = getattr(obj, field)


class ExtPythonSerializer(ExtBaseSerializer, PythonSerializer):
    pass


class ExtJsonSerializer(ExtPythonSerializer, JsonSerializer):
    pass
