const { ethers } = require("ethers");
require("dotenv").config();

// const provider = ethers.provider;

const fromOrToAddress = "0x0000000000000000000000000000000000000000";

async function main() {
  // const provider = ethers.provider;
  const provider = new ethers.providers.WebSocketProvider(
    process.env.MAINNET_RPC ?? ""
  );

  // // listen to pending transactions in the mempool from the node we are connected to
  // const completion = (tx) => {
  //   /* do some stuff */
  //   console.log("Finished");
  // };

  // check the tx to see if it is from or to the address we are looking for
  const checkTxHash = async (txHash) => {
    console.log("txHash", txHash);
  };

  provider.on("alchemy_pendingTransactions", checkTxHash, {
    toAddress: [fromOrToAddress, fromOrToAddress],
    hashesOnly: true,
  });

  provider._websocket.on("error", async () => {
    console.log(
      `Unable to connect to ${process.env.MAINNET_RPC} retrying in 3s...`
    );
    setTimeout(main, 3000);
  });

  provider._websocket.on("close", async (code) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    provider._websocket.terminate();
    setTimeout(main, 3000);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
