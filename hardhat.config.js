require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-ganache");

if (process.env.REPORT_GAS) {
  require("hardhat-gas-reporter");
}

if (process.env.REPORT_COVERAGE) {
  require("solidity-coverage");
}

require("./scripts");

const { ALCHEMY_KEY, ACCOUNT_PRIVATE_KEY } = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "ganache",
  networks: {
    hardhat: {},
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    ethereum: {
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: "ZD5N25CGMPKRGAVSY26943ZEZXTTMQF5V6",
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 800,
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    showTimeSpent: true,
  },
  plugins: ["solidity-coverage"],
};
