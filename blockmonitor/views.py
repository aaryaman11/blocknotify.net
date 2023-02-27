import json
import traceback

from django.http import JsonResponse
from rest_framework.response import Response

from random import randint
from ninja import NinjaAPI
from django.shortcuts import render
from rest_framework import viewsets, status
from .serializers import PhoneVerificationSerializer
from .models import PhoneVerification

api = NinjaAPI()


@api.exception_handler(Exception)
def json_exception_handler(request, exception):
    # Log the exception
    print(traceback.print_exc())
    # print(exception)

    # Create a response with a JSON representation of the exception
    response = JsonResponse({
        'errors': [str(exception)],
    })
    response.status_code = 500
    return response


@api.get("/register")
def get_pending_registrations(request):
    # data = json.loads(request.body)
    # print([ver for ver in PhoneVerification.objects.all()])
    return [{"id": ver.id, "phone": ver.phone, "challenge": ver.challenge} for ver in PhoneVerification.objects.all()]
    # return [{
    #     # "data": {
    #     "id":        "123",
    #     "phone":     "123123123",
    #     "challenge": "0x456456456456456456456456456",
    #     # }
    # },{
    #     "id":        "3123",
    #     "phone":     "567575675",
    #     "challenge": "0x456456456456456456456456456",
    # }]


def random_with_N_digits(n):
    range_start = 10 ** (n - 1)
    range_end = (10 ** n) - 1
    return randint(range_start, range_end)


@api.post("/register")
def register(request):
    data = json.loads(request.body)
    print(f"register_data: {data}")
    address = data['signature'][:42]
    new_contract = PhoneVerification.objects.create(
        phone=data['phone'],
        address=address,
        challenge=f"{random_with_N_digits(6)}"
    )
    print(f"contract: {new_contract}")
    return {"address": address}


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
