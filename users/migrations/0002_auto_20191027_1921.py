# Generated by Django 2.2.6 on 2019-10-27 13:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='firstName',
            new_name='first_name',
        ),
        migrations.RenameField(
            model_name='userprofile',
            old_name='lastName',
            new_name='last_name',
        ),
        migrations.RenameField(
            model_name='userprofile',
            old_name='regDateTime',
            new_name='reg_date_time',
        ),
    ]
