import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/") // Python service
      .then((res) => res.json())
      .then((data) => setData(data));

    fetch("http://localhost:4000/") // Node auth service
      .then((res) => res.json())
      .then((msg) => setMessage(msg.message));
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
