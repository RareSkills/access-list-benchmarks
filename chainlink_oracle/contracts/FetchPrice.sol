// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FetchPrice {
    IPriceFeed priceFeed;

    constructor(address _priceFeed) {
        priceFeed = IPriceFeed(_priceFeed);
    }

    function price() external view returns (int256 price) {
        (, price,,,) = priceFeed.latestRoundData();
    }
}

interface IPriceFeed {
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}
