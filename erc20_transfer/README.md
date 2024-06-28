# Gas Benchmarks: Access List Transactions On ERC20 Token Transfer.

This is a repository benchmarking access list transactions on ERC20 token transfer (cross-contract call) vs not using them. The access list transaction saves gas by correctly pre-warming the token address needed for the call. Follow the commands below to run the benchmarks locally.

## Setup
    
 1. Install necessary dependencies:

    ```shell
    npm install
    ```
## Running the Benchmark

After setup is done, run the following command:

```shell
REPORT_GAS=true npx hardhat test
```
### Expected Output:
screenshot


The blue box is the gas cost with access list, while the red box is the gas cost without access list.

