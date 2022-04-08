# Generated by Django 3.1.2 on 2021-01-25 22:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0027_auto_20210107_0025'),
    ]

    operations = [
        migrations.AddField(
            model_name='followed',
            name='following_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='followingUser', to=settings.AUTH_USER_MODEL),
        ),
    ]
