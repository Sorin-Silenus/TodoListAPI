from tortoise.models import Model
from tortoise.fields import IntField, CharField, BooleanField

class Todo(Model):
    id = IntField(pk=True) # pk = primary key
    task = CharField(max_length=255, null=False) #reject null values
    done = BooleanField(default=False, null=False) 