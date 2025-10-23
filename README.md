# Microservices Architecture Demo (React + Node.js + FastAPI)

This project demonstrates how **microservices architecture** works in contrast to a monolithic setup.
You’ll see how splitting an app into independent services helps prevent total system failure — and how Docker makes it easy to run them together locally.

---

## Overview

In a **monolithic app**, all features (frontend, authentication, business logic, database) are tightly coupled into one unit.
If one part fails (say, the backend), the entire system can go down.

**Microservices architecture** solves this by breaking an application into smaller, independent services that:

* Run in isolation
* Communicate via APIs
* Can fail without crashing the entire system
* Are easier to scale and maintain

In this demo:

* The **React app** is the frontend interface
* The **Node.js (Express)** service handles authentication
* The **Python (FastAPI)** service provides business logic/data

---

## Project Structure

```
microservices-demo/
├── frontend/        # React app (port 3000)
├── auth-service/    # Node.js auth API (port 4000)
├── backend-service/ # FastAPI backend (port 8000)
└── docker-compose.yml
```

---

## ⚙️ 1. Frontend (React)

**Purpose:** User interface that communicates with the Node.js and FastAPI services.

**Setup:**

```bash
cd frontend
npm install
npm start
```

**Environment Variables:**

```
REACT_APP_AUTH_URL=http://localhost:4000
REACT_APP_BACKEND_URL=http://localhost:8000
```

This runs the frontend on **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 2. Auth Service (Node.js + Express)

**Purpose:** Usually Handles authentication logic — registration, login, JWT token generation.

**Our Demo:** Just shows some Auth Service text.

**Setup:**

```bash
cd auth-service
npm install
node index.js
```

Runs on **[http://localhost:4000](http://localhost:4000)**.

---

## 🐍 3. Backend Service (Python + FastAPI)

**Purpose:** Simulates business or data-processing logic.

**Our Demo:** Shows names of Avengers

**Setup:**

```bash
cd backend-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Test Endpoint:**

```bash
GET /health
```

Runs on **[http://localhost:8000](http://localhost:8000)**.

---

## 🧪 4. Local Testing

Run each service manually on its own port.

1. Visit the frontend ([http://localhost:3000](http://localhost:3000)) — it should connect to both APIs.
2. Try stopping one service (e.g., FastAPI backend).

   * The React app throws an error page covering the content undernneath
3. Stop the auth service next.

   * React app throes an error page as well and disrupts the user's experience

✅ **Result:** You’ve just simulated *a failure* — disabling one service has affected the entire webapp.

---

## 🐳 5. Containerization with Docker

Each service includes its own **Dockerfile**.

**Example build commands:**

```bash
docker build -t react-frontend ./frontend
docker build -t node-auth ./auth-service
docker build -t python-backend ./backend-service
```

**Run manually:**

```bash
docker run -d -p 3000:80 react-frontend # 80 because that's the usual port for HTTP
docker run -d -p 4000:4000 node-auth
docker run -d -p 8000:8000 python-backend
```

**Test failure scenario again:**
Stop one container (`docker stop python-backend`) and see that the others remain functional.

✅ ***Result*** : You’ve just simulated *partial failure* — something that would crash a monolithic app, but in a microservice setup, other services stay alive.

---

## 🧩 6. Simplified Orchestration (Docker Compose)

The `docker-compose.yml` makes it easier to manage all containers.

**Example:**

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80" # set to open on port 80 - usual port for HTTP
    depends_on:
      - auth
      - backend

  auth:
    build: ./auth-service
    ports:
      - "4000:4000"

  backend:
    build: ./backend-service
    ports:
      - "8000:8000"
```

**Run all at once:**

```bash
docker compose up --build # first time build // rebuild images before starting
```

**Other useful commands**

```bash
docker compose up -d # run in detached mode (run in background)
```

```bash
docker compose down # stops and removes containers, networks, and default volumes creeated by Compose
```

```bash
docker compose ps # view running services
```

```bash
docker compose logs # view logs of conntainers managed by docker-compose
```

---

## 🔍 7. Architecture Diagram

```
 ┌────────────┐        ┌───────────────┐        ┌─────────────┐
 │  Frontend  │ <----> │  Auth Service │ <----> │  Backend    │
 │ (React)    │        │ (Node.js)     │        │ (FastAPI)   │
 └────────────┘        └───────────────┘        └─────────────┘
        │
        └── Docker Network (local)
```

Each service runs independently in its own container — communicating over a shared Docker network.

---

## 🧠 8. Key Learnings

* Each microservice can be built, deployed, and tested independently.
* A crash in one service does **not** affect others.
* Docker enables isolated environments for each service.
* Docker Compose simplifies local multi-container orchestration.

---

## 🛠️ 9. Next Steps

In the next stage, we’ll:

* Deploy these microservices on **AWS ECS Fargate** using **Terraform**
* Implement a **CI/CD pipeline** with **GitHub Actions**
* Add **Prometheus & Grafana** for observability

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).