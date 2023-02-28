require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: false,
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    mainnet: {
      url: process.env.MAINNET_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    localhost: {
      url: `http://127.0.0.1:8545`,
      chainId: 1337,
    },
    hardhat: {
      chainId: 1337,
      mining: {
        auto: false,
        interval: 1000,
        // mempool: {
        //     order: "fifo",
        // }
      },
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    coinmarketcap: `${process.env.CMC_API_KEY}`,
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
<<<<<<< HEAD
    }
  }
=======
    },
  },
>>>>>>> master
};
