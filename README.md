
# Fullstack Kubernetes Assignment

**Submitted by:**

- 22F-3688 Muhammad Sarim
- 22F-3709 Usman Aamir


This project deploys a full-stack newsletter application on Kubernetes using Minikube.

Stack:
- Frontend: Vue + Nginx
- Backend: Node.js + Express
- Database: MongoDB
- Orchestration: Kubernetes (Deployments, Services, StatefulSet, PV/PVC, HPA)

## Assignment Requirements Covered

### Task 3: Kubernetes Deployment
- Frontend Deployment with 3 replicas
- Backend Deployment with 3 replicas
- Image and container port configuration

### Task 4: Persistent Storage
- PersistentVolume (PV)
- PersistentVolumeClaim (PVC)
- MongoDB mounted at `/data/db`

### Task 5: Application Scaling
- HPA for backend
- HPA for frontend
- `minReplicas: 2`
- `maxReplicas: 5`
- `CPU target: 70%`

## Kubernetes Manifests

All manifests are in `k8s/`:
- `backend-deployment.yaml`
- `backend-service.yaml`
- `backend-hpa.yaml`
- `frontend-deployment.yaml`
- `frontend-service.yaml`
- `frontend-hpa.yaml`
- `mongo-service.yaml`
- `mongo-pv.yaml`
- `mongo-pvc.yaml`
- `mongo-statefulset.yaml`

## Prerequisites

- Docker running
- Minikube installed
- kubectl available (or use `minikube kubectl --`)

## Deploy Steps (Minikube)

Run from project root:

```bash
cd /Users/muhammadsarim/Desktop/fullstack-k8s-webapp

# Start minikube if needed
minikube start

# Build application images
docker build -t fullstack-k8s-backend:dev ./backend
docker build -t fullstack-k8s-frontend:dev ./frontend

# Load images into minikube
minikube image load fullstack-k8s-backend:dev
minikube image load fullstack-k8s-frontend:dev

# Apply all manifests
minikube kubectl -- apply -f k8s/ --validate=false

# Ensure metrics-server (required by HPA)
minikube addons enable metrics-server

# If old mongo Deployment exists, remove it
minikube kubectl -- delete deployment mongo --ignore-not-found

# Re-apply storage/stateful manifests in order
minikube kubectl -- apply -f k8s/mongo-pv.yaml
minikube kubectl -- apply -f k8s/mongo-pvc.yaml
minikube kubectl -- apply -f k8s/mongo-statefulset.yaml
```

## Verify Deployment

```bash
minikube kubectl -- get deployments,sts,pods,svc,pv,pvc,hpa -o wide
minikube kubectl -- get hpa
minikube service frontend --url
```

Backend API quick check:

```bash
minikube kubectl -- port-forward svc/backend 9000:9000
# In another terminal:
curl http://127.0.0.1:9000/api/list
```

## Screenshot Checklist (For Submission)

Capture these screenshots in order:

1. Project folder + manifest files
- Show `k8s/` directory in terminal/editor.

2. Deployments with replica counts
- Command:
```bash
minikube kubectl -- get deployments
```
- Ensure frontend and backend show `3/3` ready.

3. Pods running
- Command:
```bash
minikube kubectl -- get pods -o wide
```

4. Services exposed
- Command:
```bash
minikube kubectl -- get svc
```

5. Persistent storage proof
- Commands:
```bash
minikube kubectl -- get pv,pvc
minikube kubectl -- get sts
```
- Show PV/PVC bound and `mongo` StatefulSet running.

6. Mongo logs (running and receiving connections)
- Commands:
```bash
minikube kubectl -- get pods -l app=mongo
minikube kubectl -- logs pod/mongo-0 -c mongo
```

7. HPA configuration proof
- Command:
```bash
minikube kubectl -- get hpa
```
- Show min 2, max 5, target CPU 70%.

8. Frontend application running in browser
- Command:
```bash
minikube service frontend --url
```
- Open URL and capture page.

9. Backend API response proof
- Commands:
```bash
minikube kubectl -- port-forward svc/backend 9000:9000
curl http://127.0.0.1:9000/api/list
```

10. Optional autoscaling behavior proof
- Generate load and capture changing replica count:
```bash
minikube kubectl -- top pods
minikube kubectl -- get hpa -w
```

## Notes

- Use `minikube kubectl --` if local `kubectl` context causes validation/API errors.
- The `mongo-pv.yaml` uses `hostPath` for local Minikube demonstration.
