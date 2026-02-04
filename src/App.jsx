import React, { useEffect, useState } from "react";

/* ---------- Helper hook ---------- */
function useAutoFetch(url, refreshMs) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const fetchData = () => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => {
        setData(Array.isArray(json) ? json : json ? [json] : []);
        setStatus("ok");
        setError(null);
      })
      .catch((err) => {
        console.error(url, err);
        setStatus("error");
        setError("Failed to load");
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshMs);
    return () => clearInterval(interval);
  }, [url, refreshMs]);

  return { data, status, error };
}

/* ---------- UI ---------- */
export default function App() {
  const prices = { data: [], status: "ok" };
  const signals = useAutoFetch("/api/signals", 10_000); // if exists
  const analysis = { data: [], status: "ok" };


  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Forex Platform</h1>

      {/* Live Prices */}
      <Section title="Live Prices" state={prices}>
        {prices.data.map((p, i) => (
          <Row
            key={i}
            left={p.symbol || "PAIR"}
            right={p.price ?? JSON.stringify(p)}
          />
        ))}
      </Section>

      {/* Signals */}
      <Section title="Trading Signals" state={signals}>
        {signals.data.map((s, i) => (
          <Row
            key={i}
            left={`${s.symbol || "PAIR"} (${s.type || "signal"})`}
            right={s.confidence || s.strength || "—"}
          />
        ))}
      </Section>

      {/* Analysis */}
      <Section title="Market Analysis" state={analysis}>
        {analysis.data.map((a, i) => (
          <div key={i} style={styles.analysis}>
            {a.text || a.summary || JSON.stringify(a)}
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ---------- Reusable components ---------- */

function Section({ title, state, children }) {
  return (
    <div style={styles.section}>
      <h2>{title}</h2>

      {state.status === "loading" && <p>Loading…</p>}
      {state.status === "error" && (
        <p style={{ color: "red" }}>{state.error}</p>
      )}
      {state.status === "ok" && state.data.length === 0 && (
        <p>No data available.</p>
      )}

      {state.status === "ok" && children}
    </div>
  );
}

function Row({ left, right }) {
  return (
    <div style={styles.row}>
      <span>{left}</span>
      <strong>{right}</strong>
    </div>
  );
}

/* ---------- Styles ---------- */

const styles = {
  page: {
    padding: 40,
    fontFamily: "Arial, sans-serif",
    background: "#f7f7f7",
  },
  title: {
    marginBottom: 30,
  },
  section: {
    background: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 6,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #eee",
  },
  analysis: {
    padding: "8px 0",
    lineHeight: 1.5,
  },
};
