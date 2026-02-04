import React, { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Loading news...");
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        return res.json();
      })
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setStatus("Latest Forex News");
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load news");
        setStatus("Error");
      });
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Forex Platform</h1>
      <p>{status}</p>

      {error && (
        <p style={{ color: "red", marginTop: 20 }}>
          {error}
        </p>
      )}

      {!error && news.length === 0 && (
        <p style={{ marginTop: 20 }}>No news available.</p>
      )}

      <ul style={{ marginTop: 20 }}>
        {news.map((item, index) => (
          <li key={index} style={{ marginBottom: 16 }}>
            <strong>{item.title || "Untitled"}</strong>
            {item.description && (
              <p style={{ margin: "4px 0" }}>{item.description}</p>
            )}
            {item.url && (
              <a href={item.url} target="_blank" rel="noreferrer">
                Read more
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
