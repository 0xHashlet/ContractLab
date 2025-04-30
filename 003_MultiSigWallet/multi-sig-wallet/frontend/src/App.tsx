import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./App.css";
import { useMultiSigWallet } from "./hooks/useMultiSigWallet";
import { useState } from "react";

function App() {
  const {
    nonce,
    handleSubmitTx,
    handleConfirmTx,
    handleExecuteTx,
    isExecuting,
    threshold,
    transactionList,
    isSubmitting,
    refetchData,
    isConfirming,
    isTxPending,
    isTxSuccess,
    address,
    chain,
  } = useMultiSigWallet();

  // 发起交易表单状态
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");

  return (
    <div className="container">
      <h1>多签钱包前端</h1>
      <ConnectButton />
      <div className="section">
        <h2>合约信息</h2>
        <div>当前账户: {address || "未连接"}</div>
        <div>当前网络: {chain?.name || "未知"}</div>
      </div>
      <div className="section">
        <h2>发起多签交易</h2>
        <input
          placeholder="目标地址"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          placeholder="金额（wei）"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          placeholder="数据（可选）"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button
          onClick={() => handleSubmitTx(to, value, data)}
          disabled={isSubmitting || !address}
        >
          发起交易
        </button>
        {isTxPending && <span>交易提交中...</span>}
        {isTxSuccess && <span>交易已上链！</span>}
      </div>
      <div className="section">
        <h2>待确认交易</h2>
        <div>nonce: {String(nonce)}</div>
        <ul>
          {transactionList?.map((tx, index) => (
            <li key={index}>
              <div
                className="tx-item"
                style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
              >
                <div>接收地址: {tx.to}--------</div>
                <div>转账金额: {tx.value} wei--------</div>
                <div>调用数据: {tx.data || "无"}--------</div>
                <div>确认人数: {tx.confirmations || 0}--------</div>
              </div>
              <div>
                {!tx.executed && (
                  <button
                    onClick={() => handleConfirmTx(index)}
                    disabled={isConfirming || !address}
                  >
                    确认交易
                  </button>
                )}
                <button
                  onClick={() => handleExecuteTx(index)}
                  disabled={isExecuting || !address || tx.executed || (tx.confirmations || 0) < (threshold || 0)}
                >
                  {tx.executed ? '已执行' : '执行交易'}
                </button>
                {isExecuting && <span>执行中...</span>}
              </div>
            </li>
          )) || <li>暂无交易</li>}
        </ul>
        <button onClick={() => refetchData()}>刷新交易列表</button>
      </div>
    </div>
  );
}

export default App;
