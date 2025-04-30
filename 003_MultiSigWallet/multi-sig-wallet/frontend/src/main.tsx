// 导入React相关依赖
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 导入RainbowKit相关依赖 - Web3钱包连接UI组件库
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'

// 导入Wagmi相关依赖 - 以太坊React Hooks库
import { WagmiProvider } from 'wagmi'

// 导入支持的区块链网络
import { mainnet, polygon, optimism, arbitrum, base, sepolia, hardhat } from 'wagmi/chains'

// 导入React Query相关依赖 - 数据请求状态管理
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 配置Wagmi客户端
const hardhatChain = {
  ...hardhat,
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_PUBLIC_HARDHAT_RPC!] // 添加非空断言
    }
  }
} as const;

const config = getDefaultConfig({
  appName: 'MultiSigWallet app', // 应用名称
  projectId: 'YOUR_PROJECT_ID',   // WalletConnect项目ID
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, hardhatChain], // 使用修改后的链配置
})

// 创建React Query客户端实例
const queryClient = new QueryClient()

// 渲染React应用
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wagmi提供者 - 处理web3状态 */}
    <WagmiProvider config={config}>
      {/* React Query提供者 - 处理数据请求状态 */}
      <QueryClientProvider client={queryClient}>
        {/* RainbowKit提供者 - 提供钱包连接UI */}
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
