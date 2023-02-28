from websocket import create_connection
import json, time
import requests

# import os
# from twilio.rest import Client
# import pickle

# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
# account_sid = "<TWILIO SID>"
# auth_token = "<TWILIO AUTH TOKEN>"
# client = Client(account_sid, auth_token)

ALCHEMY_KEY = "wss://eth-mainnet.g.alchemy.com/v2/7vRrjaYY7lNFwUB8s6nIKX0Zu2c64b0O"


def subscribe_to_pending_transactions(fromOrToAddress):
    # empty transactions array that we will fill
    transactions = []
    
    # run 3 times to ensure web socket connection is made
    for i in range(3):
        try:
            ws = create_connection(ALCHEMY_KEY)
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
                "method": "eth_subscribe",
                "params": [
                    "alchemy_pendingTransactions",
                    {
                        # "toAddress": fromOrToAddress,
                        "fromAddress": fromOrToAddress,
                        "hashesOnly": False,
                    },
                ],
                "id": 1,
            }
        )
    )
    print("JSON eth_subscribe sent")

    while len(transactions) != 0:
        try:
            result = ws.recv()
            result = json.loads(result)
            # time.sleep(1)

            from_address = result["params"]["result"]["from"]
            to_address = result["params"]["result"]["to"]
            input = result["params"]["result"]["input"]
            gas = result["params"]["result"]["gas"]
            gasPrice = result["params"]["result"]["gasPrice"]
            value = result["params"]["result"]["value"]
            
            # todo: add block number to the transaction...?
            
            transactions.append([
                {
                    "from": from_address,
                    "to": to_address,
                    "data": input,
                    "gas": gas,
                    "gasPrice": gasPrice,
                    "value": value,
                }
            ])

        except KeyError as error:
            print("Check JSON params for parsing")

        except Exception as error:
            print("JSON Error: " + repr(error))
            time.sleep(1)

        # message = client.messages.create(
        #     body="\n \n PENDING TX! \n\n From: "
        #     + from_address
        #     + " \n\n To: "
        #     + to_address
        #     + "\n\n  @tx:"
        #     + hash,
        #     from_="+14435267244",
        #     to="+14158230041",
        # )

        # print(message.sid)
        
    return transactions


# simulate the pending transactions that contain the addresses we want to watch
# transactions should have from, to, and data fields
def simulate_transactions(transactions):
    # create a payload with the transactions we want to simulate
    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "tenderly_simulateBundle",
        "params": [
            transactions
        ],
    }
    
            #     [
            #     {
            #         "from": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            #         "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            #         "data": "0x095ea7b300000000000000000000000020a5814b73ef3537c6e099a0d45c798f4bd6e1d60000000000000000000000000000000000000000000000000000000000000001",
            #     },
            #     {
            #         "from": "0x20a5814b73ef3537c6e099a0d45c798f4bd6e1d6",
            #         "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            #         "data": "0x23b872dd000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
            #     },
            # ],
            # "0xF4D880",
    
    # create the request
    headers = {"accept": "application/json", "content-type": "application/json"}
    
    # execute the request
    response = requests.post(
        "https://mainnet.gateway.tenderly.co/5BBigIgtuWNO7GytLTHkWW",
        json=payload,
        headers=headers,
    )
    
    # print results
    print("Tenderly TX Simulated: ")
    print(response.text)


fromOrToAddress = "0x0000000000000000000000000000000000000000"

simulate_transactions(subscribe_to_pending_transactions(fromOrToAddress))