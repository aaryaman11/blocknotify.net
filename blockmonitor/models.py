from django.db import models


class Approval(models.Model):
    test = models.CharField(max_length=42)
