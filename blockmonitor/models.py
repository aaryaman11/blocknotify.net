from django.db import models


class PhoneVerification(models.Model):
    phone = models.CharField(max_length=42)
    challenge = models.CharField(max_length=6)

    def _str_(self):
        return self.phone + ':' + self.challenge
