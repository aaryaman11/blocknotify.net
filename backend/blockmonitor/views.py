import json
import traceback

from django.http import JsonResponse
from rest_framework.response import Response

from eth_keys import keys
from random import randint
from ninja import NinjaAPI
from django.shortcuts import render
from rest_framework import viewsets, status
# from .serializers import PhoneVerificationSerializer
from .models import PhoneVerification, User

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


# TODO: Remove this for production
@api.get("/register")
def get_pending_registrations(request):
    return [{"id": ver.id, "phone": ver.phone, "challenge": ver.challenge} for ver in PhoneVerification.objects.all()]


def random_with_N_digits(n):
    range_start = 10 ** (n - 1)
    range_end = (10 ** n) - 1
    return randint(range_start, range_end)


def recover_public_key(signature, original_message):
    prefix = "\x19Ethereum Signed Message:\n"
    sign_msg = f"{prefix}{len(original_message)}{original_message}"
    sig_bytes = bytearray(signature)
    sig_bytes[64] -= 27  # Ethereum's signatures use 0x1b and 0x1c so X - 27 sets to 0 or 1
    recovered_public_key = keys.Signature(sig_bytes).recover_public_key_from_msg(
        str.encode(sign_msg))
    return recovered_public_key


@api.post("/register")
def register(request):
    data = json.loads(request.body)
    # TODO: remove this, it is here until Aaryaman adds signatures...
    phone = data['fake_phone'] if 'fake_phone' in data else data['phone']
    signature = data['signature']
    public_key = recover_public_key(bytes.fromhex(signature[2:]), phone)
    address = public_key.to_checksum_address()
    existing_user = User.objects.filter(address=address).exists()
    if existing_user:
        raise ExistingUserException("This address is already registered!")
    PhoneVerification.objects.create(
        phone=data['phone'],
        # NOTE: add the phone we wanted to set here, the fake_number is the number of the signature and is just used to get the address
        address=address,
        challenge=f"{random_with_N_digits(6)}"
    )
    return {"address": address}


class ExistingUserException(Exception):
    pass


class RegistrationMissingException(Exception):
    pass


class IncorrectChallengeException(Exception):
    pass


@api.post("/verify")
def verify(request):
    data = json.loads(request.body)
    challenge = data['challenge']
    signature = data['signature']
    public_key = recover_public_key(bytes.fromhex(signature[2:]), challenge)
    address = public_key.to_checksum_address()
    # TODO: add timestamp, before we run this remove all pending registrations up to ?10 min? ago
    verifications = PhoneVerification.objects.filter(address=address)
    if len(verifications) != 1:  # NOTE: 2+ are not allowed as this field is marked as unique=true, but lets only fall through with 1
        raise RegistrationMissingException("This address doesn't have any pending verifications (perhaps it expired)!")
    if "123123" != challenge:
        # if verification.challenge != challenge:  # <-- this is correct
        raise IncorrectChallengeException("The challenge code for this address does not match!")
    # Now we're good, right?
    verifications[0].delete()
    new_user = User.objects.create(phone=verifications[0].phone, address=address)
    return {"address": new_user.address}
    # return {"address": address}


# class PhoneVerificationView(viewsets.ModelViewSet):
#     serializer_class = PhoneVerificationSerializer
#     queryset = PhoneVerification.objects.all()
#
#     def create(self, request):
#         assets = []
#         farming_details = {}
#         # Set your serializer
#         data = json.loads(request.body.decode('utf-8'))
#         # print("data:", data)
#         serializer = PhoneVerificationSerializer(data=request.data)
#         if serializer.is_valid():  # MAGIC HAPPENS HERE
#             # ... Here you do the routine you do when the data is valid
#             # You can use the serializer as an object of you Assets Model
#             # Save it
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
