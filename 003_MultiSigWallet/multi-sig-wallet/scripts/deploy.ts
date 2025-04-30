import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying with account:", deployer.address);

  // 配置初始所有者和阈值
  const owners: string[] = [
    await deployer.getAddress(),
    '0x3d5d9a6c9309b417e8a229ce30412b3cbf15d432', // 第二个所有者地址
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'  // 第三个所有者地址
  ];
  const threshold: number = 2;

  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(owners, threshold);
  
  await multiSigWallet.waitForDeployment();
  console.log("MultiSigWallet deployed to:", await multiSigWallet.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });