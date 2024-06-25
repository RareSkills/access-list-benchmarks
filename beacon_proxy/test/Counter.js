const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("Access list tx on proxies VS not using them", function () {
  let counterImpl, beacon, beaconProxy;

  before(async () => {
    counterImpl = await ethers.getContractFactory("Counter");

    beacon = await (
      await upgrades.deployBeacon(counterImpl)
    ).waitForDeployment();

    beaconProxy = await (
      await upgrades.deployBeaconProxy(beacon, counterImpl, [2])
    ).waitForDeployment();
  });

  it("can increment", async function () {
    const [user] = await ethers.getSigners();

    const counterCallerAddress = await (
      await ethers.deployContract("CounterCaller")
    ).getAddress();

    const beaconAddress = await beacon.getAddress();
    const beaconProxyAddress = await beaconProxy.getAddress();

    const data =
      ethers.id("callIncrement(address)").substring(0, 10).padEnd(34, "0") +
      beaconProxyAddress.substring(2);

    // TX with access list - START
    const tx1 = {
      from: user.address,
      to: counterCallerAddress,
      data: data,
      value: 0,
      type: 1,
      accessList: [
        {
          address: beaconProxyAddress,
          storageKeys: [
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          ],
        },
        {
          address: beaconAddress,
          storageKeys: [
            "0x0000000000000000000000000000000000000000000000000000000000000001",
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
      to: counterCallerAddress,
      data: data,
      value: 0,
    };

    const tx2Receipt = await (await user.sendTransaction(tx2)).wait();
    console.log(`Gas used without access list tx: ${tx2Receipt.gasUsed}`);
    // TX without access list - END

    // Assert tx1.gasUsed() < tx2.gasUsed()
    expect(tx1Receipt.gasUsed).to.lt(tx2Receipt.gasUsed);

    expect(await beaconProxy.getCount()).to.equal(4);
  });
});
