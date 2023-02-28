"use strict";
exports.__esModule = true;
var alchemy_sdk_1 = require("alchemy-sdk");
var ethers_1 = require("ethers");
var toOrFromAddr = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
var settings = {
    apiKey: "6Q8Kt1lWN5qOYC2Q_znUQuSo1r7NqMvo",
    network: alchemy_sdk_1.Network.ETH_MAINNET
};
var alchemy = new alchemy_sdk_1.Alchemy(settings);
var transferEvents = {
    address: toOrFromAddr,
    // topics: [],
    topics: [ethers_1.ethers.utils.id("Transfer(address,address,uint256)")]
};
alchemy.ws.on(transferEvents, function (log, event) {
    console.log("New Log Detected!");
    console.log("Transaction Hash:", log.transactionHash);
});
