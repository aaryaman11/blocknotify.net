from django.contrib import admin

from .models import PhoneVerification, User


class PhoneVerificationAdmin(admin.ModelAdmin):
    list_display = ('phone', 'challenge')

admin.site.register(PhoneVerification)
admin.site.register(User)
