# Generated by Django 3.1.2 on 2020-12-15 23:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0010_auto_20201215_2319'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='liked',
            field=models.IntegerField(default=0),
        ),
    ]
