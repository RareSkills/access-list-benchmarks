# Gas Benchmarks: Access List Transactions On Proxies vs. Not Using Them

This is a repository benchmarking access list transactions on proxies vs not using them. The access list transaction saves gas by correctly pre-warming the implementation and beacon address needed for the call. Follow the commands below to run the benchmarks locally.

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
<img width="809" alt="Screenshot 2024-06-26 at 06 45 15" src="https://github.com/RareSkills/access-list-benchmarks/assets/36541366/d67a4233-9d9a-47b1-937f-51a1a904e83f">


The blue box is the gas cost with access list, while the red box is the gas cost without access list.

Read more about [Beacon proxy](https://docs.openzeppelin.com/contracts/3.x/api/proxy#BeaconProxy).
