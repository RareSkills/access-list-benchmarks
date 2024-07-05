const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("Access list tx on proxies VS not using them", function () {
  let counterProxyInstance;

  before(async () => {
    const [owner] = await ethers.getSigners();

    const counterImpl = await ethers.getContractFactory("Counter");
    counterProxyInstance = await upgrades.deployProxy(
      counterImpl,
      [owner.address, 4],
      {
        initializer: "initialize",
        kind: "uups",
      },
    );

    await counterProxyInstance.waitForDeployment();
  });

  it("can increment", async function () {
    const [user] = await ethers.getSigners();

    const counterCallerAddress = await (
      await ethers.deployContract("CounterCaller")
    ).getAddress();

    const counterProxyAddress = await counterProxyInstance.getAddress();

    const data =
      ethers.id("callIncrement(address)").substring(0, 10).padEnd(34, "0") +
      counterProxyAddress.substring(2);

    // TX with access list - START
    const tx1 = {
      from: user.address,
      to: counterCallerAddress,
      data: data,
      value: 0,
      type: 1,
      accessList: [
        {
          address: counterProxyAddress,
          storageKeys: [
            "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc", // implementation address storage slot
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

    expect(await counterProxyInstance.count()).to.equal(6);
  });
});
