const { ethers } = require('hardhat');
// const ethers = require('ethers');

// Create a provider pointing to your Ethereum node
// const provider = new ethers.providers.JsonRpcProvider('https://your-ethereum-node-url.com');
const provider = ethers.provider;
if (!provider) {
  throw new Error("Provider is undefined!")
}

async function main() {
  const provider = ethers.provider;
  // Subscribe to new block headers
  provider.on('block', (blockNumber) => {
    provider.getBlock(blockNumber).then((block) => {
      console.log(block);
      console.log("Txn 0: %o", block['transactions'][0]);
    });
  });

  // Unsubscribe after 10 blocks
  setTimeout(() => {
    provider.removeAllListeners('block');
  }, 10 * 1000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
