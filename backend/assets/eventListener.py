#!python
from eth_abi import decode_single
from hexbytes import HexBytes
from websocket import create_connection
import json, time

# from notifier.settings import NODE_WSS
NODE_WSS = "wss://mainnet.infura.io/ws/v3/edfe2781ec614f63adf7d7f539cc0781"


def listen_to_events(contractAddress, eventName, fromAddress, toAddress):
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

            print("Event Triggered")
            print("Block Number: " + blockNumber)
            print("Transaction Hash: " + txHash)
            print("Result: ", result["params"]["result"])
            data = [t[2:] for t in result["params"]["result"]['topics']]
            data += [result["params"]["result"]['data'][2:]]
            data = "0x" + "".join(data)
            data = HexBytes(data)  # type: ignore
            selector, params = data[:32], data[32:]
            print("sel:", selector.hex())
            print("params:", params.hex())
            parameters = '(address,address,uint256)'
            decoded = decode_single(parameters, params)
            print("decoded:", decoded)

        except KeyError as error:
            print("Check JSON params for parsing")
            raise

        except Exception as error:
            print("JSON Error: " + repr(error))
            time.sleep(1)


zeroAddress = "0x0000000000000000000000000000000000000000"
BUSD = "0x4Fabb145d64652a948d72533023f6E7A623C7C53"
USDC = "0x7EA2be2df7BA6E54B1A9C70676f668455E329d29"
contract = USDC
# contract = "0x41fc5635Fc878D13934dC576134c139941b854F9"

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
# listen_to_events(contract, None, None, None)

# Example 4: all ERC20 xfers
listen_to_events(None, erc20Transfer, None, None)
