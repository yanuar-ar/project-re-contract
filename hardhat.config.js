require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
require('hardhat-abi-exporter');
require('@nomiclabs/hardhat-etherscan');
require('solidity-coverage');
require('./tasks');
require('hardhat-gas-reporter');

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: {
    version: '0.8.15',
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    telos: {
      url: `https://mainnet.telos.net/evm`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    ganache: {
      url: `HTTP://127.0.0.1:7545`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    hardhat: {
      initialBaseFeePerGas: 0,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  abiExporter: {
    path: './abi',
    clear: true,
  },
  gasReporter: {
    enabled: !process.env.CI,
    currency: 'USD',
    gasPrice: 30,
    src: 'contracts',
    coinmarketcap: '7643dfc7-a58f-46af-8314-2db32bdd18ba',
  },
};
