from django.shortcuts import render


from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PhoneVerificationSerializer
from .models import PhoneVerification

# Create your views here.

class PhoneVerificationView(viewsets.ModelViewSet):
    serializer_class = PhoneVerificationSerializer
    queryset = PhoneVerification.objects.all()
