# Dapp实战案例002：从零部署链上计数器合约并实现前端交互 

本教程将指导你开发一个链上计数器DApp应用，通过这个实例你将学习完整的智能合约开发流程。

我们将构建一个支持增加、减少和重置功能的计数器合约，并实现以下核心内容：
- 配置MetaMask钱包并连接Sepolia测试网
- 使用Solidity编写计数器智能合约
- 在Remix IDE中编译与部署合约
- 开发React前端界面实现合约交互
- Web3开发中的安全最佳实践

这个项目将帮助你掌握区块链开发的基础知识，让我们开始动手实践吧！
GitHub仓库: [https://github.com/0xHashlet/ContractLab.git](https://github.com/0xHashlet/ContractLab.git)
---

## 目录
1. [环境准备](#一环境准备)
2. [合约开发](#二合约开发)
3. [Remix部署](#三remix在线部署)
4. [前端开发](#四前端代码开发)
5. [安全须知](#五安全须知)
6. [FAQ](#六常见问题解答)

## 一、环境准备

### 1.1 钱包配置
1. **安装MetaMask/OKX Wallet**
   - 浏览器访问 [MetaMask官网](https://metamask.io/) 或 [OKX Wallet官网](https://www.okx.com/cn/web3)
   - 添加Chrome/Firefox扩展
   - 创建新钱包（**务必保存助记词！**）

2. **连接Sepolia测试网**
```javascript
// MetaMask网络配置参数或者钱包中直接搜索Sepolia
网络名称: Sepolia Testnet
新增RPC URL: https://rpc.sepolia.org
链ID: 11155111
货币符号: ETH
区块浏览器: https://sepolia.etherscan.io/
```

### 1.2 获取测试币
访问水龙头：[Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
输入钱包地址 → 领取0.1 ETH测试币

## 二、合约开发

### 2.1 基础合约代码
在 Remix 中创建 `Counter.sol`：
```java
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 导入OpenZeppelin的Ownable合约，用于实现基本的访问控制
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

// Counter合约继承自Ownable，实现了一个简单的计数器功能
contract Counter is Ownable {
    // 私有状态变量，用于存储计数值
    uint256 private _count;

    // 定义事件，当计数更新时触发，记录新值和操作者地址
    event CountUpdated(uint256 newValue, address operator);

    // 构造函数，初始化Ownable并设置合约部署者为owner
    constructor() Ownable(msg.sender) {}

    // 查看当前计数的函数，使用view修饰符表示不修改状态
    function current() public view returns (uint256) {
        return _count;
    }

    // 增加计数的函数
    function increment() public {
        _count += 1;
        emit CountUpdated(_count, msg.sender);
    }

    // 减少计数的函数
    function decrement() public {
        require(_count > 0, "Counter: cannot decrement below zero");
        _count -= 1;
        emit CountUpdated(_count, msg.sender);
    }

    // 重置计数为0的函数，只有owner可以调用
    function reset() public onlyOwner {
        _count = 0;
        emit CountUpdated(_count, msg.sender);
    }
}
```

### 2.2 关键功能说明
代码部分	作用描述
`import "@openzeppelin/contracts..."` | 导入OpenZeppelin的Ownable合约用于访问控制
`contract Counter is Ownable` | 定义Counter合约并继承Ownable的权限管理功能
`event CountUpdated` | 定义事件，当计数更新时记录新值和操作者

## 三、Remix在线部署

### 3.1 部署步骤
访问 Remix IDE
左侧文件管理器新建 HelloWorld.sol
粘贴上述合约代码 → 保存（Ctrl+S）
进入编译界面：
选择Solidity版本 0.8.0
点击 ​​Compile HelloWorld.sol​​

### 3.2 执行部署
切换到 ​​Deploy & Run Transactions​​
环境选择 WalletConnect - MetaMask​​/OKX Wallet
确认网络为Sepolia
在构造函数输入初始值（如 0）
点击 ​​Deploy​​ → 在钱包中确认交易

### 3.3 获取合约地址
部署成功后，在 ​​Deployed Contracts​​ 区域查看地址：

0x2dC66F868d690EA73426093db7c63E79ce0695D8

## 四、前端代码开发

### 4.1 前端项目初始化
```bash
# 创建Vite项目
npm create vite@latest counter --template react

# 安装依赖
npm install

# 安装ethers.js
npm install ethers
```

### 4.2 连接合约代码示例
```javascript
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
    alert("请安装MetaMask!");
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
```

### 4.3 前端界面示例
```javascript
// 在React组件中使用
function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 页面加载时获取当前计数
    const fetchCount = async () => {
      const currentCount = await getCurrentCount();
      setCount(currentCount);
    };
    fetchCount();
  }, []);

  const handleIncrement = async () => {
    try {
      setLoading(true);
      await increment();
      const updatedCount = await getCurrentCount();
      setCount(updatedCount);
    } catch (error) {
      console.error("增加计数失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    try {
      setLoading(true);
      await decrement();
      const updatedCount = await getCurrentCount();
      setCount(updatedCount);
    } catch (error) {
      if (error.message.toLowerCase().includes("cannot decrement below zero")) {
        alert("计数不能小于零");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await reset();
      const updatedCount = await getCurrentCount();
      setCount(updatedCount);
    } catch (error) {
      console.error(error);
      alert("非合约部署者，重置失败！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>链上计数器</h1>
      <h2>当前计数: {loading ? "处理中..." : count}</h2>
      <div>
        <button onClick={handleIncrement} disabled={loading}>增加</button>
        <button onClick={handleDecrement} disabled={loading}>减少</button>
        <button onClick={handleReset} disabled={loading}>重置</button>
      </div>
    </div>
  );
}
```

### 4.4 注意事项
1. 确保MetaMask已连接Sepolia测试网
2. 合约地址和ABI需要替换为你部署的合约
4. 交易需要支付少量测试ETH作为Gas费


## 五、安全须知

### 5.1 私钥保护
⚠️ ​​永远不要做以下操作​​：

将私钥提交到GitHub等公开平台
在截图/录屏中暴露私钥
使用测试网私钥操作主网

### 5.2 合约安全实践
使用OpenZeppelin库的Ownable合约
所有外部输入需验证有效性
重要操作添加事件日志

## 六、常见问题解答


❓ 交易长时间未确认
✅ 解决方案：

检查MetaMask的Gas费设置
在Etherscan查看网络拥堵情况
重新发送交易并提高Gas Price

❓ 合约代码无法验证
✅ 排查步骤：

确认编译器版本与部署时一致
检查是否包含完整的依赖库
验证时代码是否完全一致（包括空格）

❓ 函数调用返回错误
✅ 常见原因：

未连接钱包或网络错误（是否连接了主网！！！）
调用未授权的权限函数
Gas费不足导致交易失败

本教程已通过实际环境测试，所有代码均可直接复制使用。如需进一步帮助，可参考 Solidity官方文档 或 以太坊开发者资源。