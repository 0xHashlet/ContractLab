import logo from "./logo.svg";
import { useState, useEffect } from "react";
import { getGreeting, updateGreeting } from "./api";
import "./App.css";

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
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
