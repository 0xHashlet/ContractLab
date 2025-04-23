import { ethers } from 'ethers';

/**
 * 合约ABI (Application Binary Interface)
 * 定义了智能合约的接口规范，包括构造函数、可调用函数及其参数类型
 * 此ABI从Remix编译获取，包含以下功能:
 * 1. 构造函数 - 初始化问候语
 * 2. updateGreeting - 更新问候语
 * 3. getGreeting - 获取当前问候语
 */
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_initialGreeting",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_newGreeting",
				"type": "string"
			}
		],
		"name": "updateGreeting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGreeting",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

/**
 * 合约地址 - 部署在区块链上的智能合约地址
 * 注意: 需要替换为你自己部署的合约地址
 */
const contractAddress = "0xBdb2a78454e60859C4BD374C7c19329bEb0B823f";

/**
 * 连接智能合约
 * @returns {Promise<ethers.Contract>} 返回已连接的合约实例
 * @description 
 * 1. 检查用户是否安装了以太坊钱包(如MetaMask)
 * 2. 请求连接用户钱包
 * 3. 创建provider和signer用于与区块链交互
 * 4. 使用合约地址和ABI创建合约实例
 */
async function connectContract() {
  // 检查MetaMask是否安装
  if (!window.ethereum) {
    alert("请先安装钱包如：MetaMask/OKX Wallet!");
    return;
  }

  // 连接钱包 - 请求用户授权
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  // 创建provider(区块链连接)和signer(签名者)
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // 使用合约地址、ABI和signer创建合约实例
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}

/**
 * 获取当前问候语
 * @returns {Promise<string>} 返回智能合约中存储的问候语
 * @description 
 * 1. 连接智能合约
 * 2. 调用合约的getGreeting方法
 * 3. 返回问候语字符串
 * 4. 错误处理: 捕获并记录可能的错误
 */
export async function getGreeting() {
  try {
    const contract = await connectContract();
    const greeting = await contract.getGreeting();
    console.log("当前问候语:", greeting);
    return greeting;
  } catch (error) {
    console.error("获取问候语失败:", error);
  }
}

/**
 * 更新问候语
 * @param {string} newGreeting 新的问候语内容
 * @description 
 * 1. 连接智能合约
 * 2. 调用合约的updateGreeting方法并传入新问候语
 * 3. 等待交易确认(区块链上完成)
 * 4. 错误处理: 捕获并记录可能的错误
 */
export async function updateGreeting(newGreeting) {
  try {
    const contract = await connectContract();
    const tx = await contract.updateGreeting(newGreeting);
    await tx.wait();  // 等待交易被区块链确认
    console.log("问候语更新成功!");
  } catch (error) {
    console.error("更新问候语失败:", error);
  }
}