require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Ensure private keys are kept secure and loaded conditionally
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const accounts = DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [];

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200, // Optimize contract size and gas consumption for production mainnet
      },
    },
  },
  networks: {
    // 1. Ethereum L1 Mainnet (Homestead)
    ethereum: {
      url: process.env.MAINNET_RPC_URL || "https://eth.llamarpc.com",
      accounts: accounts,
      chainId: 1,
    },
    // 2. Arbitrum One L2 Mainnet
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
      accounts: accounts,
      chainId: 42161,
    },
    // 3. Optimism L2 Mainnet (OP Mainnet)
    optimism: {
      url: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
      accounts: accounts,
      chainId: 10,
    },
    // 4. Base L2 Mainnet (Coinbase L2)
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: accounts,
      chainId: 8453,
    },
    // 5. Polygon POS Mainnet
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: accounts,
      chainId: 137,
    },
    // Local Hardhat Network for local testing and simulation
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    // API keys for contract source code verification on block explorers
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
};
