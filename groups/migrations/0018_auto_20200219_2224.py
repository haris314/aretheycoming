# Generated by Django 2.2.6 on 2020-02-19 16:54

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0017_auto_20200208_2126'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vote',
            name='vote',
        ),
        migrations.AlterField(
            model_name='event',
            name='create_time',
            field=models.DateTimeField(default=datetime.datetime(2020, 2, 19, 22, 24, 56, 809246)),
        ),
    ]
