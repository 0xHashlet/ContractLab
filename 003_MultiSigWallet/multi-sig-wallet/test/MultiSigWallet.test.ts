import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { MultiSigWallet } from "../typechain-types";

describe("MultiSigWallet", function () {
  let owner1: SignerWithAddress;
  let owner2: SignerWithAddress;
  let owner3: SignerWithAddress;
  let nonOwner: SignerWithAddress;
  let owners: SignerWithAddress[];
  let multiSigWallet: MultiSigWallet;

  before(async function () {
    [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();
    
    owners = [owner1, owner2, owner3];
  });

  beforeEach(async function () {
    const MultiSigWalletFactory = await ethers.getContractFactory("MultiSigWallet");
    multiSigWallet = await MultiSigWalletFactory.deploy(owners.map(o => o.address), 2);
    await multiSigWallet.waitForDeployment();
  });

  it("Should submit a transaction", async function () {
    const txData = multiSigWallet.interface.encodeFunctionData("submitTransaction", [
      nonOwner.address,
      ethers.parseEther("1.0"),
      "0x"
    ]);

    await expect(
      multiSigWallet.connect(owners[0]).submitTransaction(
        owners[1].address,
        ethers.parseEther("1.0"),
        txData
      )
    ).to.emit(multiSigWallet, "ProposalCreated");
  });

  it("Should execute transaction with enough confirmations", async function () {
    const txData = multiSigWallet.interface.encodeFunctionData("submitTransaction", [
      nonOwner.address,
      ethers.parseEther("1.0"),
      "0x"
    ]);

    await multiSigWallet.connect(owners[0]).submitTransaction(
      owners[1].address,
      ethers.parseEther("1.0"),
      txData
    );
    
    await multiSigWallet.connect(owners[1]).confirmTransaction(0);
    
    await expect(
      multiSigWallet.connect(owners[2]).executeTransaction(0)
    ).to.changeEtherBalance(nonOwner, ethers.parseEther("1.0"));
  });

  // it("Should revert if insufficient confirmations", async function () {
  //   const txData = multiSigWallet.interface.encodeFunctionData("transfer", [
  //     nonOwner.address,
  //     ethers.parseEther("1.0")
  //   ]);

  //   await multiSigWallet.connect(owners[0]).submitTransaction(
  //     owners[1].address,
  //     ethers.parseEther("1.0"),
  //     txData
  //   );

  //   await expect(
  //     multiSigWallet.connect(nonOwner).executeTransaction(0)
  //   ).to.be.revertedWithCustomError(multiSigWallet, "InsufficientConfirmations");
  // });
});
