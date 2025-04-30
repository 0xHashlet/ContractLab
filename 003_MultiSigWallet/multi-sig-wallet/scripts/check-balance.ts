import { ethers } from "hardhat";

async function main() {
  const [account] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(account.address);
  
  console.log("Address:", account.address);
  console.log("Balance:", ethers.formatEther(balance));
}
main().catch(console.error);