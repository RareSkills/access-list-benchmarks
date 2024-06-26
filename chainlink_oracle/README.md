# Gas Benchmarks: Access List Transactions On Chainlink Oracles

This is a repository benchmarking access list transactions on chainlink price oracle. The access list transaction saves gas by correctly pre-warming the aggregator address needed to fetch price. Follow the commands below to run the benchmarks locally.

## Setup
    
 1. Install necessary dependencies:

    ```shell
    npm install
    ```
 2. Mainnet RPC
    Add your mainnet rpc url to `hardhat.config.js` file
    ```shell
    networks: {
      hardhat: {
        forking: {
          url: "<your_mainnet_rpc_url>",
        },
      },
    }
    ```
## Running the Benchmark

After setup is done, run the following command:

```shell
REPORT_GAS=true npx hardhat test
```
### Expected Output:
<img width="767" alt="Screenshot 2024-06-25 at 09 25 02" src="https://github.com/RareSkills/access-list-benchmarks/assets/36541366/b9949033-c465-45ac-8486-765c09953cb2">


The blue box is the gas cost with access list, while the red box is the gas cost without access list.

Read more about [Access List](https://www.rareskills.io/post/eip-2930-optional-access-list-ethereum) and [Chainlink PriceFeed](https://www.rareskills.io/post/chainlink-price-feed-contract).
