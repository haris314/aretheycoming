# Generated by Django 2.2.6 on 2020-02-06 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0013_auto_20200207_0013'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]