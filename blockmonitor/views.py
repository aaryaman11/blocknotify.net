import json
from rest_framework.response import Response

from ninja import NinjaAPI
from django.shortcuts import render
from rest_framework import viewsets, status
from .serializers import PhoneVerificationSerializer
from .models import PhoneVerification

api = NinjaAPI()

class PhoneVerificationView(viewsets.ModelViewSet):
    serializer_class = PhoneVerificationSerializer
    queryset = PhoneVerification.objects.all()

    def create(self, request):
        assets = []
        farming_details = {}
        # Set your serializer
        data = json.loads(request.body.decode('utf-8'))
        print("data:", data)
        serializer = PhoneVerificationSerializer(data=request.data)
        if serializer.is_valid():  # MAGIC HAPPENS HERE
            # ... Here you do the routine you do when the data is valid
            # You can use the serializer as an object of you Assets Model
            # Save it
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
