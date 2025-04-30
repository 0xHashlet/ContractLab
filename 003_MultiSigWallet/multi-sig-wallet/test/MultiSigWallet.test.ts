// 导入必要的依赖
import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { MultiSigWallet } from "../typechain-types";

describe("MultiSigWallet", function () {
  // 定义测试需要的变量
  let owner1: SignerWithAddress;
  let owner2: SignerWithAddress;
  let owner3: SignerWithAddress;
  let nonOwner: SignerWithAddress;
  let owners: SignerWithAddress[];
  let multiSigWallet: MultiSigWallet;

  // 在所有测试开始前执行一次
  before(async function () {
    // 获取测试账号
    [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();
    // 设置多签钱包的所有者
    owners = [owner1, owner2, owner3];
  });

  // 每个测试用例执行前都会执行
  beforeEach(async function () {
    // 部署多签钱包合约，设置所有者和确认门槛为2
    const MultiSigWalletFactory = await ethers.getContractFactory("MultiSigWallet");
    multiSigWallet = await MultiSigWalletFactory.deploy(owners.map(o => o.address), 2);
    await multiSigWallet.waitForDeployment();
  });

  // 测试提交交易功能
  it("Should submit a transaction", async function () {
    await expect(
      multiSigWallet.connect(owners[0]).submitTransaction(
        owners[1].address,
        ethers.parseEther("1.0"),
        "0x"
      )
    ).to.emit(multiSigWallet, "ProposalCreated");
  });

  // 测试具有足够确认数的交易执行
  it("Should execute transaction with enough confirmations", async function () {
    // 1. 给合约充值 1 ETH
    await owners[0].sendTransaction({
      to: await multiSigWallet.getAddress(),
      value: ethers.parseEther("1.0")
    });

    // 2. owner1 提交交易，目标为 nonOwner，金额 1 ETH，data 为 "0x"
    await multiSigWallet.connect(owners[0]).submitTransaction(
      nonOwner.address,
      ethers.parseEther("1.0"),
      "0x"
    );

    // 3. owner1 和 owner2 分别确认
    await multiSigWallet.connect(owners[0]).confirmTransaction(0);
    await multiSigWallet.connect(owners[1]).confirmTransaction(0);

    // 打印当前交易的确认次数
    const tx = await multiSigWallet.transactions(0);
    console.log("Current confirmations:", tx.confirmations.toString());
    // 4. owner3 执行交易，验证 nonOwner 收到 1 ETH
    await expect(
      multiSigWallet.connect(owners[2]).executeTransaction(0)
    ).to.changeEtherBalance(nonOwner, ethers.parseEther("1.0"));
  });

  // 测试确认数不足时交易执行失败
  it("Should revert if insufficient confirmations", async function () {
    // 1. 给合约充值 1 ETH
    await owners[0].sendTransaction({
      to: await multiSigWallet.getAddress(),
      value: ethers.parseEther("1.0")
    });

    // 2. owner1 提交交易，目标为 nonOwner，金额 1 ETH，data 为 "0x"
    await multiSigWallet.connect(owners[0]).submitTransaction(
      nonOwner.address,
      ethers.parseEther("1.0"),
      "0x"
    );

    // 3. 只确认一次（不足阈值2）
    await multiSigWallet.connect(owners[0]).confirmTransaction(0);

    // 4. nonOwner 尝试执行交易，应该 revert
    await expect(
      multiSigWallet.connect(owners[2]).executeTransaction(0)
    ).to.be.revertedWith("Insufficient confirmations");
  });
});
