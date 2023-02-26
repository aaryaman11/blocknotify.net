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
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.MAINNET_PRIVATE_KEY}`],
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
      }
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: `${process.env.CMC_API_KEY}`,
  },
  etherscan: {
    apiKey: {
      ropsten: process.env.ETHERSCAN_API_KEY,
      kovan: process.env.ETHERSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
      pxltest: "abc"
    },
    customChains: [
      {
        network: "pxltest",
        chainId: 123321,
        urls: {
          apiURL: "https://explorer.testnet.pyxelchain.com/api",
          browserURL: "https://explorer.testnet.pyxelchain.com"
        }
      }
    ]
  }
};
