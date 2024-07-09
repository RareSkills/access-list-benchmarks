// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Counter is Initializable {
    uint256 public count;

    function initialize(uint256 _startCount) public initializer {
        count = _startCount;
    }

    function increment() external {
        count++;
    }

    function decrement() external {
        count--;
    }
}
