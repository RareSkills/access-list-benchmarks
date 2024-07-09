const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("Access list tx on proxies VS not using them", function () {
  let counterProxyInstance;

  before(async () => {
    const counterImpl = await ethers.getContractFactory("Counter");
    counterProxyInstance = await upgrades.deployProxy(counterImpl, [4], {
      initializer: "initialize",
      kind: "transparent", // optional, as kind of proxy defaults to "transparent"
    });

    await counterProxyInstance.waitForDeployment();
  });

  it("can increment", async function () {
    const [user] = await ethers.getSigners();

    const counterProxyAddress = await counterProxyInstance.getAddress();

    const data = ethers.id("increment()").substring(0, 10);

    const implAddress = await upgrades.erc1967.getImplementationAddress(
      counterProxyAddress,
    );

    // TX with access list - START
    const tx1 = {
      from: user.address,
      to: counterProxyAddress,
      data: data,
      value: 0,
      type: 1,
      accessList: [
        {
          address: implAddress,
          storageKeys: [],
        },
      ],
    };

    const tx1Receipt = await (await user.sendTransaction(tx1)).wait();
    console.log(`Gas used with access list tx: ${tx1Receipt.gasUsed}`);
    // TX with access list - END

    // TX without access list - START
    const tx2 = {
      from: user.address,
      to: counterProxyAddress,
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
