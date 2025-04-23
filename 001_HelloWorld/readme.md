# 001 Hello World 智能合约开发与部署教程

本教程将带你一步步学习智能合约的开发流程，从环境配置到合约部署再到前端开发，最后完成一个完整的DApp应用。

我们将通过一个简单的"Hello World"智能合约示例，详细讲解以下内容：
- MetaMask钱包配置与测试网络连接
- Solidity合约编写基础
- 使用Remix在线IDE部署合约
- React前端界面开发与合约交互
- 安全注意事项与最佳实践

让我们开始Web3之旅吧！
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
// MetaMask网络配置参数
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
```java
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string private greeting;

    constructor(string memory _initialGreeting) {
        greeting = _initialGreeting;
    }

    function updateGreeting(string memory _newGreeting) public {
        greeting = _newGreeting;
    }

    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}
```

### 2.2 关键功能说明
代码部分	作用描述
pragma solidity	指定Solidity编译器版本（必须≥0.8.0）
view修饰符	声明该函数不会修改链上状态，调用时无需支付Gas费

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
在构造函数输入初始问候语（如 "Hello Web3！"）
点击 ​​Deploy​​ → 在钱包中确认交易

### 3.3 获取合约地址
部署成功后，在 ​​Deployed Contracts​​ 区域查看地址：

0xBdb2a78454e60859C4BD374C7c19329bEb0B823f

## 四、前端代码开发

### 4.1 前端项目初始化
```bash
# 创建React项目
npx create-react-app hello-world
cd hello-world

# 安装ethers.js
npm install ethers
```

### 4.2 连接合约代码示例
```javascript
import { ethers } from 'ethers';

// 合约ABI (从Remix编译获取)
const contractABI = [
  // getGreeting函数ABI
  {
    "inputs": [],
    "name": "getGreeting",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  // updateGreeting函数ABI
  {
    "inputs": [{"internalType": "string", "name": "_newGreeting", "type": "string"}],
    "name": "updateGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// 合约地址 (替换为你的合约地址)
const contractAddress = "0x4a8cB7C481919f852D6784B6eDc0dC92B37d927A";

async function connectContract() {
  // 检查MetaMask是否安装
  if (!window.ethereum) {
    alert("请安装MetaMask!");
    return;
  }

  // 连接钱包
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  // 创建provider和signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // 创建合约实例
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}

// 获取问候语
async function getGreeting() {
  try {
    const contract = await connectContract();
    const greeting = await contract.getGreeting();
    console.log("当前问候语:", greeting);
    return greeting;
  } catch (error) {
    console.error("获取问候语失败:", error);
  }
}

// 更新问候语
async function updateGreeting(newGreeting) {
  try {
    const contract = await connectContract();
    const tx = await contract.updateGreeting(newGreeting);
    await tx.wait();
    console.log("问候语更新成功!");
  } catch (error) {
    console.error("更新问候语失败:", error);
  }
}
```

### 4.3 前端界面示例
```javascript
// 在React组件中使用
function App() {
  const [greeting, setGreeting] = useState("");
  const [newGreeting, setNewGreeting] = useState("");

  useEffect(() => {
    // 页面加载时获取当前问候语
    const fetchGreeting = async () => {
      const currentGreeting = await getGreeting();
      setGreeting(currentGreeting);
    };
    fetchGreeting();
  }, []);

  const handleUpdate = async () => {
    if (!newGreeting) return;
    await updateGreeting(newGreeting);
    // 更新后重新获取问候语
    const updatedGreeting = await getGreeting();
    setGreeting(updatedGreeting);
    setNewGreeting("");
  };

  return (
    <div>
      <h1>当前问候语: {greeting}</h1>
      <input 
        type="text" 
        value={newGreeting}
        onChange={(e) => setNewGreeting(e.target.value)}
        placeholder="输入新问候语"
      />
      <button onClick={handleUpdate}>更新问候语</button>
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