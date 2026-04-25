import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Use relative paths in Docker (nginx proxies to services).
    // Falls back to localhost for local development.
    const dataUrl = process.env.NODE_ENV === 'production' ? '/api/data/' : 'http://localhost:8000/';
    const authUrl = process.env.NODE_ENV === 'production' ? '/api/auth/' : 'http://localhost:4000/';

    Promise.all([
      fetch(dataUrl).then((res) => {
        if (!res.ok) {
          throw new Error("Data service is currently unavailable.");
        }
        return res.json();
      }),
      fetch(authUrl).then((res) => {
        if (!res.ok) {
          throw new Error("Auth service is currently unavailable.");
        }
        return res.json();
      }),
    ])
      .then(([dataItems, authResponse]) => {
        if (!isMounted) {
          return;
        }
        setData(dataItems);
        setMessage(authResponse.message || "Connected");
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        console.error("Service error:", err);
        setError("We could not load service data. Please try again shortly.");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Cloud-native Starter</p>
        <h1>Microservices Control Panel</h1>
        <p className="hero-subtitle">
          Monitor your connected services and live sample data in one place.
        </p>
      </header>

      <section className="status-grid" aria-label="service-status">
        <article className="status-card auth-card">
          <div className="status-header">
            <h2>Auth Service</h2>
            <span className={`pill ${loading ? "pill-warn" : error ? "pill-danger" : "pill-success"}`}>
              {loading ? "Checking" : error ? "Issue" : "Healthy"}
            </span>
          </div>
          <p className="status-value">
            {loading ? "Connecting..." : error ? "Unavailable" : message || "Connected"}
          </p>
        </article>

        <article className="status-card data-service-card">
          <div className="status-header">
            <h2>Data Service</h2>
            <span className={`pill ${loading ? "pill-warn" : error ? "pill-danger" : "pill-success"}`}>
              {loading ? "Syncing" : error ? "Issue" : "Healthy"}
            </span>
          </div>
          <p className="status-value">
            {loading ? "Loading records..." : error ? "No data available" : `${data.length} records loaded`}
          </p>
        </article>
      </section>

      <section className="data-panel dataset-card">
        <div className="data-panel-header">
          <h2>Sample Dataset</h2>
          {!loading && !error && <span>{data.length} items</span>}
        </div>

        {loading && <p className="feedback-message">Fetching data from your services...</p>}
        {error && <p className="feedback-message error">{error}</p>}

        {!loading && !error && (
          <ul className="data-list">
            {data.map((item, index) => (
              <li key={`${item.name}-${index}`} className="data-item">
                <span className="item-index">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
