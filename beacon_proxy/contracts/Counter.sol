// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Counter is Initializable {
    uint256 public count;

    function initialize(uint256 _startCount) external initializer {
        count = _startCount;
    }

    function increment() external {
        count++;
    }

    function decrement() external {
        count--;
    }

    function getCount() external view returns (uint256) {
        return count;
    }
}

contract CounterCaller {
    function callIncrement(address proxy) external {
        assembly {
            // stores `increment()` function selector in mem[0x00]
            mstore(0x00, 0xd09de08a)

            // calls the `increment()` function
            pop(call(gas(), proxy, 0x00, 0x1c, 0x04, 0x00, 0x00))
        }
    }
}
