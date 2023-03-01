import json
import traceback

from django.http import JsonResponse

import os
from twilio.rest import Client
from eth_keys import keys
from random import randint
from ninja import NinjaAPI

from .models import PhoneVerification, User

api = NinjaAPI()


class InvalidPhoneNumberException(Exception):
    pass


class ExistingUserException(Exception):
    pass


class ExistingVerificationException(Exception):
    pass


class RegistrationMissingException(Exception):
    pass


class IncorrectChallengeException(Exception):
    pass


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


def format_number(pn, country_code="US"):
    account_sid = TWILIO_ACCOUNT_SID
    auth_token = TWILIO_AUTH_TOKEN
    client = Client(account_sid, auth_token)
    result = client.lookups.v2.phone_numbers(
        pn).fetch(country_code=country_code)
    if result.valid:
        return result.phone_number
    else:
        raise InvalidPhoneNumberException(f"Invalid phone number {pn} for country code '{country_code}'")


@api.post("/register")
def register(request):
    data = json.loads(request.body)
    # TODO: remove this, it is here until Aaryaman adds signatures...
    phone = data['phone']
    # phone = data['fake_phone'] if 'fake_phone' in data else data['phone']
    # import ipdb; ipdb.set_trace()
    phone = format_number(phone)
    signature = data['signature']
    public_key = recover_public_key(bytes.fromhex(signature[2:]), phone)
    address = public_key.to_checksum_address()
    existing_user = User.objects.filter(address=address).exists()
    if existing_user:
        raise ExistingUserException("This address is already registered!")
    existing_verification = PhoneVerification.objects.filter(address=address).exists()
    if existing_verification:
        # TODO: add check here that if records are old than 10 minutes, then delete them
        raise ExistingVerificationException("There is already a pending verification for this address!")
    challenge = random_with_N_digits(6)
    PhoneVerification.objects.create(
        phone=data['phone'],
        # NOTE: add the phone we wanted to set here, the fake_number is the number of the signature and is just used to get the address
        address=address,
        challenge=f"{challenge}"
    )
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    # TODO: we could log the message, it probably has good debug data...
    # message = client.messages
    client.messages \
        .create(
        body=f'BlockNotify security code: {challenge}',
        from_=TWILIO_FROM_NUMBER,  # our service number
        # status_callback='http://postb.in/1234abcd',
        to=f'{phone}'
    )
    return {"address": address}


@api.post("/verify")
def verify(request):
    data = json.loads(request.body)
    challenge = data['challenge']
    signature = data['signature']
    public_key = recover_public_key(bytes.fromhex(signature[2:]), challenge)
    address = public_key.to_checksum_address()
    # TODO: add timestamp, before we run this remove all pending registrations up to ?10 min? ago
    verifications = PhoneVerification.objects.filter(address=address)
    if len(verifications) != 1:  # NOTE: 2+ are not allowed (unique=true), but let's only fall through with 1
        raise RegistrationMissingException("This address doesn't have any pending verifications (perhaps it expired)!")
    # if "123123" != challenge:
    if verifications[0].challenge != challenge:  # <-- this is correct
        raise IncorrectChallengeException("The challenge code for this address does not match!")
    # Now we're good, right?
    verifications[0].delete()
    new_user = User.objects.create(phone=verifications[0].phone, address=address)
    return {"address": new_user.address}
    # return {"address": address}


@api.get("/status")
def status(request):
    data = request.GET
    # data = json.loads(request.body)
    verifications = PhoneVerification.objects.filter(address__iexact=data['address'])
    users = User.objects.filter(address__iexact=data['address'])
    is_new = "exists" if users.exists() else "new"
    status = "pending" if verifications.exists() else is_new
    return {"status": status}
#
#
# @api.get("/is_user")
# def is_user(request):
#     data = request.GET
#     # data = json.loads(request.body)
#     return {"exists": users.exists()}
#
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
