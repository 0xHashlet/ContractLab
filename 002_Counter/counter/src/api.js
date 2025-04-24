import { ethers } from 'ethers';

// Counter合约ABI,直接在Remix编译后菜单底部复制
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newValue",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "CountUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "decrement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "increment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "current",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// 合约地址 (替换为你的合约地址)
const contractAddress = "0x2dC66F868d690EA73426093db7c63E79ce0695D8";

// 连接合约的函数
async function connectContract() {
  if (!window.ethereum) {
    alert("请先安装钱包如：MetaMask/OKX Wallet!");
    return;
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}

// 获取当前计数
async function getCurrentCount() {
  try {
    const contract = await connectContract();
    const count = await contract.current();
    console.log("当前计数:", count);
    return Number(count);
  } catch (error) {
    console.error("获取计数失败:", error);
    return 0;
  }
}

// 增加计数
async function increment() {
  try {
    const contract = await connectContract();
    const tx = await contract.increment();
    await tx.wait();
    console.log("计数增加成功!");
    return true;
  } catch (error) {
    console.error("增加计数失败:", error);
    return false;
  }
}

// 减少计数
async function decrement() {
  try {
    const contract = await connectContract();
    const tx = await contract.decrement();
    await tx.wait();
    console.log("计数减少成功!");
    return true;
  } catch (error) {
    console.error("减少计数失败:", error);
    throw error; // 改为抛出错误而不是返回false
  }
}

// 重置计数
async function reset() {
  try {
    const contract = await connectContract();
    const tx = await contract.reset();
    await tx.wait();
    console.log("计数重置成功!");
    return true;
  } catch (error) {
    console.error("重置计数失败:", error);
    throw error; // 改为抛出错误而不是返回false
  }
}

export {
  getCurrentCount,
  increment,
  decrement,
  reset
};