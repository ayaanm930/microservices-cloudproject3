const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "Open Sesame: Auth Service is up and running!" });
});
app.get('/health', (req, res) => res.json({ status: 'Auth service running' }));
app.post('/login', (req, res) => res.json({ token: 'demo-token' }));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Auth service running on ${PORT}`));
