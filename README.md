# Microservices Architecture  (React + Node.js + FastAPI)
## Project 3 Cloud 
->Mishal Ali 22i-1291
-> Ayaan Mughal 22i-0861

This project demonstrates how **microservices architecture** works in contrast to a monolithic setup.
You’ll see how splitting an app into independent services helps prevent total system failure — and how Docker makes it easy to run them together locally.

---

## Overview

**Microservices architecture** solves this by breaking an application into smaller, independent services that:

* Run in isolation
* Communicate via APIs
* Can fail without crashing the entire system
* Are easier to scale and maintain

In this project:

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
├──ansible/
├──k8s/
├──terraform/
└──docker-compose.yml
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

**Our Project:** Just shows some Auth Service text.

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

## 🚀 9. Deployment on AWS EC2 with K8s/ ansible & terraform (Project 3)

This project has been updated to support deployment on an AWS EC2 instance running a local Kubernetes cluster (MicroK8s), fully managed via GitOps (ArgoCD) and GitHub Actions.

### Deployment Steps:

**1. Provision Infrastructure with Terraform:**
```bash
cd terraform
terraform init
terraform apply -auto-approve
```
This will create a VPC, Security Groups, an EC2 instance, and output the public IP of the instance as well as the SSH private key. Save the private key to access the EC2 instance.

**2. Configure the Node with Ansible:**
Save the output private key to a file (e.g. `k8s_key.pem`), set correct permissions (`chmod 400 k8s_key.pem`), and run the Ansible playbook to install MicroK8s and ArgoCD:
```bash
cd ansible
ansible-playbook -i "<EC2_PUBLIC_IP>," -u ubuntu --private-key k8s_key.pem playbook.yml
```

**3. Configure ArgoCD:**
The Ansible playbook automatically installs ArgoCD and exposes it on NodePort `30443` (HTTPS) and `30081` (HTTP). 
- Access the ArgoCD UI: `https://<EC2_PUBLIC_IP>:30443`
- Retrieve the initial admin password from the EC2 instance:
  ```bash
  ssh -i k8s_key.pem ubuntu@<EC2_PUBLIC_IP>
  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
  ```

**4. Deploy ArgoCD Application:**
Apply the ArgoCD App configuration to track the repository:
```bash
kubectl apply -f k8s/argocd-app.yaml
```
ArgoCD will now monitor the `k8s/` folder in the main branch and auto-sync changes to the cluster.

**5. CI/CD Pipeline (GitHub Actions):**
Any push to the `main` branch will trigger the GitHub Actions pipeline (`.github/workflows/deploy.yml`), which:
- Builds the Docker images for `frontend`, `auth-service`, and `data-service`.
- Pushes the images to GitHub Container Registry (GHCR).
- Updates the image tags in the `k8s/*.yaml` files and commits the changes back to the repository.
- ArgoCD automatically detects the changes and deploys the new images to the MicroK8s cluster.

**Accessing the Application:**
Once deployed, the frontend application will be accessible at:
```
http://<EC2_PUBLIC_IP>:30080
```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
