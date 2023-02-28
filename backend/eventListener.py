from websocket import create_connection
import json, time

ALCHEMY_KEY = "wss://eth-mainnet.g.alchemy.com/v2/6Q8Kt1lWN5qOYC2Q_znUQuSo1r7NqMvo"

def listen_to_events(contractAddress, eventName, fromAddress, toAddress):
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
                    "logs",
                    {
                        "address": contractAddress,
                        "topics": [eventName, fromAddress, toAddress],
                    },
                ],
                "id": 1,
            }
        )
    )
    print("JSON eth_subscribe sent")

    while True:
        try:
            result = ws.recv()
            result = json.loads(result)
            # time.sleep(1)

            blockNumber = result["params"]["result"]["blockNumber"]
            txHash = result["params"]["result"]["transactionHash"]

            print("Event Triggered")
            print("Block Number: " + blockNumber)
            print("Transaction Hash: " + txHash)

        except KeyError as error:
            print("Check JSON params for parsing")

        except Exception as error:
            print("JSON Error: " + repr(error))
            time.sleep(1)


zeroAddress = "0x0000000000000000000000000000000000000000"
BUSD = "0x4Fabb145d64652a948d72533023f6E7A623C7C53"
contract = "0x41fc5635Fc878D13934dC576134c139941b854F9"

# sha3 hashing of event signature
erc20Transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
erc721Transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

# contractAddress, eventName, fromAddress, toAddress

# All of the following is based on newly mined blocks

# Example 1: get all transfer events in or out of BUSD
# listen_to_events(BUSD, erc20Transfer, None, None)

# Example 2: get all events in or out of BUSD
# listen_to_events(BUSD, None, None, None)

# Example 3: get all events in or out of a contract
listen_to_events(contract, None, None, None)