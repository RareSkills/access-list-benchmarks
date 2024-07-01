// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Counter is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public count;

    function initialize(address _owner, uint256 _startCount) public initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();
        count = _startCount;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function increment() external {
        count++;
    }

    function decrement() external {
        count--;
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
