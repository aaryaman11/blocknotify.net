#!python
import json
import time

from django.core.management import BaseCommand
from eth_abi import decode_single
from hexbytes import HexBytes
from twilio.rest import Client
from web3 import Web3
import requests

# from assets.eventListener import listen_to_events
from blockmonitor.models import User
from notifier.settings import NODE_WSS, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
from websocket import create_connection

adapter = requests.sessions.HTTPAdapter(pool_connections=50000,
                                        pool_maxsize=50000)  # pool connections and max size are for HTTP calls only, since we are using WS they are not needed.
session = requests.Session()
w3 = Web3(Web3.WebsocketProvider(NODE_WSS))

USDC = "0x7EA2be2df7BA6E54B1A9C70676f668455E329d29"
ERC_20_TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
ERC_721_TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"


class Command(BaseCommand):
    help = "Run the block monitor and send notifications on matching criteria"
    new_to_addresses = []
    new_from_addresses = []

    def handle(self, *args, **options):
        print("Starting the monitoring engine...")
        self.listen_to_all_events()

    def listen_to_all_events(self):
        self.listen_to_events(None, ERC_20_TRANSFER, None, None)

    def listen_to_events(self, contractAddress, eventName, fromAddress, toAddress):
        # run 3 times to ensure web socket connection is made
        for i in range(3):
            try:
                ws = create_connection(NODE_WSS)
                print("Connection made")
            except Exception as error:
                print("Connection Error: " + repr(error))
                time.sleep(3)
            else:
                break

        ws.send(
            json.dumps(
                {
                    "jsonrpc": "2.0",
                    "method":  "eth_subscribe",
                    "params":  [
                        "logs",
                        {
                            "address": contractAddress,
                            "topics":  [eventName, fromAddress, toAddress],
                        },
                    ],
                    "id":      1,
                }
            )
        )
        print("JSON eth_subscribe sent")

        while True:
            try:
                result = ws.recv()
                result = json.loads(result)
                # time.sleep(1)

                if "params" not in result:
                    print(result)
                    continue

                blockNumber = result["params"]["result"]["blockNumber"]
                txHash = result["params"]["result"]["transactionHash"]

                # print("Event Triggered")
                # print("Block Number: " + blockNumber)
                # print("Transaction Hash: " + txHash)
                print("Result: ", result)
                # print("Result: ", result["params"]["result"])
                data = [t[2:] for t in result["params"]["result"]['topics']]
                data += [result["params"]["result"]['data'][2:]]
                data = "0x" + "".join(data)
                data = HexBytes(data)  # type: ignore
                selector, params = data[:32], data[32:]
                # print("sel:", selector.hex())
                # print("params:", params.hex())
                parameters = '(address,address,uint256)'
                decoded = decode_single(parameters, params)
                # print("decoded:", decoded)
                contract = result["params"]["result"]["address"]
                from_address = decoded[0]
                print("from:", from_address)
                to_address = decoded[1]
                print("to:", to_address)
                # TODO: add check here for result["to"] address to see if it is ERC-20 or ERC-721
                amount = decoded[2]  # for ERC-20
                # nftid = decoded[2]  # for ERC-721
                matching_from = User.objects.filter(address__iexact=from_address)
                print("matching_from: ", matching_from)
                for this_from in matching_from:
                    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                    # TODO: we could log the message, it probably has good debug data...
                    # message = client.messages
                    client.messages \
                        .create(
                        body=f'⌜👁⌟BlockNotify: Watch Alert! ▿Received {amount} of {contract} from {from_address} to {to_address}',
                        from_=TWILIO_FROM_NUMBER,  # our service number
                        # status_callback='http://postb.in/1234abcd',
                        to=f'{this_from.phone}'
                    )
                    # raise Exception("sent-from")
                matching_to = User.objects.filter(address__iexact=to_address)
                print("matching_to: ", matching_to)
                for this_to in matching_to:
                    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                    # TODO: we could log the message, it probably has good debug data...
                    # message = client.messages
                    client.messages \
                        .create(
                        body=f'⌜👁⌟BlockNotify: Watch Alert! ▵Sent {amount} of {contract} from {from_address} to {to_address}',
                        from_=TWILIO_FROM_NUMBER,  # our service number
                        # status_callback='http://postb.in/1234abcd',
                        to=f'{this_to.phone}'
                    )
                    # raise Exception("sent-to")

            except KeyError as error:
                print("Check JSON params for parsing")
                raise

            except Exception as error:
                print("JSON Error: " + repr(error))
                time.sleep(1)
