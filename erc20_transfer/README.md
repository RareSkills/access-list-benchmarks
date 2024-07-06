# Gas Benchmarks: Access List Transactions On ERC20 Token Transfer.

This is a repository benchmarking access list transactions on ERC20 token transfer (cross-contract call) vs not using them. The access list transaction saves gas by correctly pre-warming the `token` address, `from` and `to` token balance before the call. Follow the commands below to run the benchmarks locally.

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
<img width="855" alt="Screenshot 2024-07-06 at 23 13 53" src="https://github.com/RareSkills/access-list-benchmarks/assets/36541366/d041c716-f732-482f-8a91-4adb1937017c">



The blue box is the gas cost with access list, while the red box is the gas cost without access list.

