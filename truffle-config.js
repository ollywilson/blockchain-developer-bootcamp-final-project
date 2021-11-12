const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const dotenv = require("dotenv");
dotenv.config();
const mnemonic = process.env.MNEMONIC;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    // NB: uncomment develop to run on a local default Ganache server
    // develop: {
    //   host: "127.0.0.1",
    //   port: "8545",
    //   netword_id: "*",
    // },
    // NB: configuration for ropsten test network
    // terminal command: truffle migrate --network ropsten
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, process.env.PROVIDER_URL),
      network_id: 3, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
};
