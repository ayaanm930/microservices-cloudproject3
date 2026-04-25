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

Follow these exact commands to provision, configure, and deploy the application from scratch.

### Step 1: Provision Infrastructure (Terraform)
Create the AWS EC2 instance, VPC, and Security Groups.
```bash
cd terraform
terraform init
terraform apply -auto-approve
```

**2. Configure the Node with Ansible:**
Save the output private key to a file (e.g. `k8s_key.pem`), set correct permissions (`chmod 400 k8s_key.pem`), and run the Ansible playbook to install MicroK8s and ArgoCD:
```bash
# Run this inside your WSL terminal:
cmd.exe /c "terraform output -raw private_key > k8s_key.pem"
cp k8s_key.pem ~/.ssh/k8s_key.pem
chmod 400 ~/.ssh/k8s_key.pem
```

### Step 2: Configure the Cluster (Ansible)
Run the Ansible playbook to install MicroK8s, install ArgoCD, and automatically apply the ArgoCD GitHub-tracker application.
```bash
cd ../ansible
ansible-playbook -i "<EC2_PUBLIC_IP>," -u ubuntu --private-key ~/.ssh/k8s_key.pem playbook.yml
```

### Step 3: Retrieve ArgoCD Credentials
Log into the EC2 server and retrieve the auto-generated ArgoCD administrator password:
```bash
ssh -i ~/.ssh/k8s_key.pem ubuntu@3.219.231.179
sudo microk8s kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
exit
```

### Step 4: Trigger the CI/CD Pipeline
Commit and push all code changes to the `main` branch. This tells GitHub Actions to build the Docker containers and update the manifests, which ArgoCD will instantly detect and deploy!
```bash
git add .
git commit -m "Triggering pipeline deployment"
git push origin main
```

---

## 📸 Evidence of Working Deployment

*(Drop your screenshots in the spaces below to verify the successful deployment of the project!)*

### 1. Terraform Infrastructure Deployed
*Screenshot showing the `terraform apply` success output or the running EC2 instance in the AWS Console.*
![Terraform Success](<PLACE_YOUR_IMAGE_LINK_HERE>)

### 2. Ansible Playbook Execution
*Screenshot showing the Ansible PLAY RECAP with `ok` statuses and zero ignored errors.*
![Ansible Success](<PLACE_YOUR_IMAGE_LINK_HERE>)

### 3. GitHub Actions CI Pipeline Success
*Screenshot showing the green checkmarks on your GitHub Actions workflow running successfully.*
![GitHub Actions Workflow](<PLACE_YOUR_IMAGE_LINK_HERE>)

### 4. ArgoCD Dashboard & Synchronization
*Screenshot of the ArgoCD web UI (`https://<EC2_IP>:30443`) showing the `microservices-demo` application fully synced and healthy.*
![ArgoCD Dashboard](<PLACE_YOUR_IMAGE_LINK_HERE>)

### 5. Running Kubernetes Pods
*Screenshot of your SSH terminal showing `kubectl get pods` with all services in a `Running` state.*
![Kubernetes Pods](<PLACE_YOUR_IMAGE_LINK_HERE>)

### 6. Live Application Frontend
*Screenshot of your React application successfully loading in the browser via the EC2 Public IP on port `30080`.*
![Live App Frontend](<PLACE_YOUR_IMAGE_LINK_HERE>)
