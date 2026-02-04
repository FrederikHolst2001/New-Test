
import React, { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Loading backend...");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then(res => res.text())
      .then(txt => {
        setStatus("Backend connected successfully");
        setData(txt);
      })
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Forex Platform</h1>
      <p>Status: {status}</p>
      {data && (
        <pre style={{ background: "#111", color: "#0f0", padding: 20 }}>
          {data}
        </pre>
      )}
    </div>
  );
}
