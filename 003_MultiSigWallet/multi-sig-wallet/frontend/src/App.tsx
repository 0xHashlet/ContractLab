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

  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");

  return (
    <div className="container">
      <h1 className="title">多签钱包前端</h1>
      <ConnectButton />
      <div className="section">
        <h2 className="subtitle">合约信息</h2>
        <div>当前账户: {address || "未连接"}</div>
        <div>当前网络: {chain?.name || "未知"}</div>
      </div>
      <div className="section">
        <h2 className="subtitle">发起多签交易</h2>
        <input
          className="input"
          placeholder="目标地址"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="input"
          placeholder="金额（wei）"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          className="input"
          placeholder="数据（可选）"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button
          className="button"
          onClick={() => handleSubmitTx(to, value, data)}
          disabled={isSubmitting || !address}
        >
          发起交易
        </button>
        {isTxPending && <span className="pending">交易提交中...</span>}
        {isTxSuccess && <span className="success">交易已上链！</span>}
      </div>
      <div className="section">
        <h2 className="subtitle">待确认交易</h2>
        <div>nonce: {nonce != null ? String(nonce) : "0"}</div>
        <ul>
          {transactionList?.map((tx, index) => (
            <li key={index} className="transaction">
              <div className="tx-item">
                <div>接收地址: {tx.to}--------</div>
                <div>转账金额: {tx.value} wei--------</div>
                <div>调用数据: {tx.data || "无"}--------</div>
                <div>确认人数: {tx.confirmations || 0}--------</div>
              </div>
              <div>
                {!tx.executed && (
                  <button
                    className="confirm-button"
                    onClick={() => handleConfirmTx(index)}
                    disabled={isConfirming || !address}
                  >
                    确认交易
                  </button>
                )}
                <button
                  className={`execute-button ${tx.executed ? 'executed' : ''}`}
                  onClick={() => handleExecuteTx(index)}
                  disabled={isExecuting || !address || tx.executed || (tx.confirmations || 0) < (threshold || 0)}
                >
                  {tx.executed ? '已执行' : '执行交易'}
                </button>
                {isExecuting && <span className="executing">执行中...</span>}
              </div>
            </li>
          )) || <li>暂无交易</li>}
        </ul>
        <button className="refresh-button" onClick={() => refetchData()}>刷新交易列表</button>
      </div>
    </div>
  );
}

export default App;
