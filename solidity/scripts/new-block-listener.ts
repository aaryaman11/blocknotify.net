import { Alchemy, AlchemyEventType, Network } from "alchemy-sdk";
import { ethers } from "ethers";

const toOrFromAddr = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const settings = {
  apiKey: "6Q8Kt1lWN5qOYC2Q_znUQuSo1r7NqMvo", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

const transferEvents = {
  address: toOrFromAddr,
  // topics: [],
  topics: [ethers.utils.id("Transfer(address,address,uint256)")],
};

alchemy.ws.on(transferEvents, (log, event) => {
  console.log("New Log Detected!");
  console.log("Block Number:", log.blockNumber);
  console.log("Transaction Hash:", log.transactionHash);
});
