// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 1.
contract RareToken is ERC20 {
    constructor() ERC20("RareToken", "RRT") {
        _mint(msg.sender, 100);
    }

    function mint(address recipient) external {
        _mint(recipient, 1);
    }
}

// 2.
contract RareVault {
    address public to;
    address public from = address(this);

    RareToken public rareToken;

    constructor(address _rareVaultCaller) {
        rareToken = new RareToken();
        to = _rareVaultCaller;
    }

    function transferToken() external {
        RareToken _rareToken = RareToken(rareToken);
        require(_rareToken.balanceOf(from) > 0, "Insufficient Vault Balance.");

        _rareToken.transfer(to, 10);
    }
}

// 3.
contract RareVaultCaller {
    function call_transferToken(address _rareVault) external {
        RareVault(_rareVault).transferToken();
    }

    // Changes this contract token balance from zero to nonzero
    function pre_transferToken(address _rareVault) external {
        RareToken rareToken = RareVault(_rareVault).rareToken();
        rareToken.mint(address(this));
    }
}
