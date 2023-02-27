from websocket import create_connection

ALCHEMY_KEY = "<Alchemy Key>"

for i in range(3):
    try:
        ws = create_connection("wss://eth-goerli.g.alchemy.com/v2/"+ALCHEMY_KEY)
        print("Connection made")
    except Exception as error:
        print('Connection Error: ' + repr(error))
        time.sleep(3)
    else:
        break

ws.send(json.dumps({"jsonrpc":"2.0","method":"eth_subscribe","params":["alchemy_filteredNewFullPendingTransactions", {"toAddress": "0xcF3A24407aae7c87bd800c47928C5F20Cd4764D2"}],"id":1}))
print("JSON eth_subscribe sent")