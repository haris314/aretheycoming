# Generated by Django 2.2.6 on 2019-10-28 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0010_auto_20191028_1238'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='description',
            field=models.TextField(blank=True, default='No description'),
        ),
    ]