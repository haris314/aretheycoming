# Generated by Django 2.2.6 on 2020-02-07 15:15

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0014_auto_20200207_0018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='create_time',
            field=models.DateTimeField(default=datetime.datetime(2020, 2, 7, 15, 15, 4, 465074, tzinfo=utc)),
        ),
    ]
