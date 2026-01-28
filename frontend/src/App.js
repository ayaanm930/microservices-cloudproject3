import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    // Use relative paths in Docker (nginx proxies to services)
    // Falls back to localhost for local development
    const dataUrl = process.env.NODE_ENV === 'production' ? '/api/data/' : 'http://localhost:8000/';
    const authUrl = process.env.NODE_ENV === 'production' ? '/api/auth/' : 'http://localhost:4000/';

    fetch(dataUrl)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Data service error:', err));

    fetch(authUrl)
      .then((res) => res.json())
      .then((msg) => setMessage(msg.message))
      .catch((err) => console.error('Auth service error:', err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Microservices Demo 1</h1>
      <h3>Auth says: {message}</h3>
      <ul>
        {data.map((d, i) => (
          <li key={i}>{d.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
