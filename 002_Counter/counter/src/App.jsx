import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { getCurrentCount, increment, decrement, reset } from "./api";

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
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <h1>链上计数器</h1>
        <h2>当前计数: {loading ? "处理中..." : count}</h2>
        <div>
          <button onClick={handleIncrement} disabled={loading}>
            增加
          </button>
          <button onClick={handleDecrement} disabled={loading}>
            减少
          </button>
          <button onClick={handleReset} disabled={loading}>
            重置
          </button>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
