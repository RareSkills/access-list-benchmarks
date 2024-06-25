const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Chainlink Price Oracle", function () {
  const priceFeedAddress = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"; // mainnet price feed contract
  let fetchPriceInstance;

  before(async () => {
    const fetchPrice = await ethers.getContractFactory("FetchPrice");
    fetchPriceInstance = await fetchPrice.deploy(priceFeedAddress);
  });

  it("can get current ETH/USD price", async function () {
    const [user] = await ethers.getSigners();
    const data = ethers.id("price()").substring(0, 10);
    const fetchPriceInstanceAddress = await fetchPriceInstance.getAddress();

    // TX with access list - START
    const tx1 = {
      from: user.address,
      to: fetchPriceInstanceAddress,
      data: data,
      value: 0,
      type: 1,
      accessList: [
        {
          address: priceFeedAddress,
          storageKeys: [
            "0x0000000000000000000000000000000000000000000000000000000000000005",
          ],
        },
      ],
    };

    const tx1Receipt = await (await user.sendTransaction(tx1)).wait();
    console.log(`Gas used with access list tx: ${tx1Receipt.gasUsed}`);
    // TX with access list - END

    // TX without access list - START
    const tx2 = {
      from: user.address,
      to: fetchPriceInstanceAddress,
      data: data,
      value: 0,
    };

    const tx2Receipt = await (await user.sendTransaction(tx2)).wait();
    console.log(`Gas used without access list tx: ${tx2Receipt.gasUsed}`);
    // TX without access list - END

    // Assert tx1.gasUsed() < tx2.gasUsed()
    expect(tx1Receipt.gasUsed).to.lt(tx2Receipt.gasUsed);
  });
});
