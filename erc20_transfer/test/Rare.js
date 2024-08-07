const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ERC20 Transfer", function () {
  let rareCallerInstance, rareCallerAddress, rareVaultInstance;

  before(async () => {
    rareCallerInstance = await ethers.deployContract("RareVaultCaller");
    rareCallerAddress = await rareCallerInstance.getAddress();

    rareVaultInstance = await ethers.deployContract("RareVault");
  });

  it("can get transfer tokens", async function () {
    const rareVaultAddress = await rareVaultInstance.getAddress();
    const rareTokenAddress = await rareVaultInstance.rareToken();

    // Get storage slot for `from` balance
    const fromBalanceslotHash = ethers.solidityPackedKeccak256(
      ["bytes32", "uint256"],
      [`0x000000000000000000000000${rareVaultAddress.substring(2)}`, 0],
    );

    // Get storage slot for `to` balance
    const toBalanceslotHash = ethers.solidityPackedKeccak256(
      ["bytes32", "uint256"],
      [`0x000000000000000000000000${rareCallerAddress.substring(2)}`, 0],
    );

    // Changes this contract token balance from zero to nonzero
    rareCallerInstance.pre_transferToken(rareVaultAddress);

    const [user] = await ethers.getSigners();
    const data =
      ethers
        .id("call_transferToken(address)")
        .substring(0, 10)
        .padEnd(34, "0") + rareVaultAddress.substring(2);

    // TX with access list - START
    const tx1 = {
      from: user.address,
      to: rareCallerAddress,
      data: data,
      value: 0,
      type: 1,
      accessList: [
        {
          address: rareTokenAddress,
          storageKeys: [
            fromBalanceslotHash, // `from` balance storage slot
            toBalanceslotHash, // `to` balance storage slot
          ],
        },
        {
          address: rareVaultAddress,
          storageKeys: [
            "0x0000000000000000000000000000000000000000000000000000000000000000", // rareToken storage slot
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
      to: rareCallerAddress,
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
