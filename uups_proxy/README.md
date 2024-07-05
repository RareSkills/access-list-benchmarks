# Gas Benchmarks: Access List Transactions On Proxies vs. Not Using Them

This is a repository benchmarking access list transactions on proxies vs not using them. The access list transaction saves gas by correctly pre-warming the implementation address needed for the call. Follow the commands below to run the benchmarks locally.

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
<img width="811" alt="Screenshot 2024-07-05 at 19 07 34" src="https://github.com/RareSkills/access-list-benchmarks/assets/36541366/ce22aa87-d0f4-45e4-9409-2483a921f4f1">



The blue box is the gas cost with access list, while the red box is the gas cost without access list.

Read more about [UUPS proxy](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable).
