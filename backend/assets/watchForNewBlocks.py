#!python


import asyncio
import json
from typing import Union, Dict, Any, cast

import web3
from eth_typing import HexStr
from hexbytes import HexBytes
from web3 import Web3
from web3._utils.abi import get_abi_input_names, get_abi_input_types, map_abi_data
from web3._utils.normalizers import BASE_RETURN_NORMALIZERS
from web3.middleware import geth_poa_middleware  # only needed for PoA networks like BSC
import requests
from websockets import connect
from eth_abi import decode_single, decode_abi

from notifier.settings import NODE_WSS

adapter = requests.sessions.HTTPAdapter(pool_connections=50000,
                                        pool_maxsize=50000)  # pool connections and max size are for HTTP calls only, since we are using WS they are not needed.
session = requests.Session()
w3 = Web3(Web3.WebsocketProvider(NODE_WSS))
# w3.middleware_onion.inject(geth_poa_middleware, layer=0) # only needed for PoA networks like BSC

USDC = "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29"

# https://ethereum.stackexchange.com/questions/58912/how-do-i-decode-the-transactions-log-with-web3-py


from typing import Any, Dict, cast, Union

from eth_typing import HexStr
from eth_utils import event_abi_to_log_topic
from hexbytes import HexBytes
from web3._utils.abi import get_abi_input_names, get_abi_input_types, map_abi_data
from web3._utils.normalizers import BASE_RETURN_NORMALIZERS
from web3.contract import Contract


# class EventLogDecoder:
#     def __init__(self, contract: Contract):
#         self.contract = contract
#         self.event_abis = [abi for abi in self.contract.abi if abi['type'] == 'event']
#         self._sign_abis = {event_abi_to_log_topic(abi): abi for abi in self.event_abis}
#         self._name_abis = {abi['name']: abi for abi in self.event_abis}
#
#     def decode_log(self, result: Dict[str, Any]):
#         data = [t[2:] for t in result['topics']]
#         data += [result['data'][2:]]
#         data = "0x" + "".join(data)
#         return self.decode_event_input(data)
#
#     def decode_event_input(self, data: Union[HexStr, str], name: str = None) -> Dict[str, Any]:
#         # type ignored b/c expects data arg to be HexBytes
#         data = HexBytes(data)  # type: ignore
#         selector, params = data[:32], data[32:]
#
#         if name:
#             func_abi = self._get_event_abi_by_name(event_name=name)
#         else:
#             func_abi = self._get_event_abi_by_selector(selector)
#
#         names = get_abi_input_names(func_abi)
#         types = get_abi_input_types(func_abi)
#
#         decoded = self.contract.web3.codec.decode(types, cast(HexBytes, params))
#         normalized = map_abi_data(BASE_RETURN_NORMALIZERS, types, decoded)
#
#         return dict(zip(names, normalized))
#
#     def _get_event_abi_by_selector(self, selector: HexBytes) -> Dict[str, Any]:
#         try:
#             return self._sign_abis[selector]
#         except KeyError:
#             raise ValueError("Event is not presented in contract ABI.")
#
#     def _get_event_abi_by_name(self, event_name: str) -> Dict[str, Any]:
#         try:
#             return self._name_abis[event_name]
#         except KeyError:
#             raise KeyError(f"Event named '{event_name}' was not found in contract ABI.")
#

async def get_event():
    address = USDC
    parameters = '(address,address,uint256)'
    event = f"Transfer{parameters}"  # covers: ERC-20, ERC-721,
    async with connect(NODE_WSS) as ws:
        await ws.send(json.dumps({"id": 1, "method": "eth_subscribe", "params": ["logs", {
            "address": [address],
            "topics":  [w3.keccak(text=event).hex()]}]}))
        subscription_response = await ws.recv()
        # print(subscription_response)
        while True:
            try:
                # message = {"jsonrpc": "2.0", "method": "eth_subscription",
                #            "params":  {"subscription": "0x10ff10904d9e9b77720552d56c4a9b76eca5c401da34",
                #                        "result":       {"removed":          False, "logIndex": "0x2a9",
                #                                         "transactionIndex": "0x83",
                #                                         "transactionHash":  "0x3e83ea7645df1ddddc5202f5f54071d94874a099137f063594da486f16f61043",
                #                                         "blockHash":        "0x514b84337474fb2692990a833ee04bf692d2f938f84fbb5d1a7654462912a3cf",
                #                                         "blockNumber":      "0xff9cba",
                #                                         "address":          "0x7ea2be2df7ba6e54b1a9c70676f668455e329d29",
                #                                         "data":             "0x0000000000000000000000000000000000000000000000000000000156b99450",
                #                                         "topics":           [
                #                                             "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                #                                             "0x000000000000000000000000d3071235d6e3836b9290626a79d6e9d69832f1d6",
                #                                             "0x0000000000000000000000000000000000000000000000000000000000000000"]}}}
                message = await asyncio.wait_for(ws.recv(), timeout=60)
                # print(message)
                result = message['params']['result']
                # data = result['data']
                # data = json.loads(message)['params']['result']['data']
                # contract = web3.eth.contract(abi=abi, bytecode=bytecode)
                # contract = Web3.contract(USDC)
                # EventLogDecoder(contract)

                data = [t[2:] for t in result['topics']]
                data += [result['data'][2:]]
                data = "0x" + "".join(data)

                data = HexBytes(data)  # type: ignore
                # selector, params = data[:32], data[32:]

                decoded = decode_single(parameters, data)

                # print(data)
                # byte_array = bytearray.fromhex(data[2:])
                # decoded = decode_single('(address,address,uint256)',
                #                         byte_array)
                # # decoded = decode_single('(address,address,uint256)',
                # #                         bytearray.fromhex(json.loads(message)['params']['result']['data'][2:]))
                print(list(decoded))
                break
                pass
            except Exception as e:
                print("bad", e)
                break
                pass


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    while True:
        loop.run_until_complete(get_event())
        break

# from web3 import Web3
# from web3.middleware import geth_poa_middleware
#
# # connect to an Ethereum node using WebSocketProvider
# w3 = Web3(Web3.WebsocketProvider('wss://mainnet.infura.io/ws/v3/YOUR-PROJECT-ID'))
#
# # add middleware for POA networks like xDai
# w3.middleware_onion.inject(geth_poa_middleware, layer=0)
#
# # define a callback function to handle new block events
# def on_new_block(block):
#     print(f"New block received: {block['number']}")
#
# # subscribe to new block events
# subscription = w3.eth.subscribe('new_block_headers', on_new_block)
#
# # keep the script running indefinitely
# while True:
#     pass


# import asyncio
# from Crypto.Hash import keccak
# from web3 import Web3
# from python_socks import ProxyType
# from web3_proxy_providers import AsyncSubscriptionWebsocketWithProxyProvider
#
# async def callback(subs_id: str, json_result):
#     print(json_result)
#
# async def main(loop: asyncio.AbstractEventLoop):
#     provider = AsyncSubscriptionWebsocketProvider(
#         loop=loop,
#         endpoint_uri='wss://your_node_url',
#     )
#
#     # subscribe to newHeads
#     subscription_id = await provider.subscribe(
#         [
#             'logs',
#             {
#                 "address": 'newHeads',
#                 "topics": []
#             }
#         ],
#         callback
#     )
#     print(f'Subscribed with id {subscription_id}')
#
#     # unsubscribe after 30 seconds
#     await asyncio.sleep(30)
#     await provider.unsubscribe(subscription_id)
#
# if __name__ == '__main__':
#     async_loop = asyncio.get_event_loop()
#     async_loop.run_until_complete(main(loop=async_loop))
