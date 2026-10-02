---
title: Istio Hands-on Part 9 - Exposing Services Securely with Ingress Gateway
date: '2026-11-01T00:50:00'
tags:
- kubernetes
- observability
cover: /images/2025/istio_part1_cover.webp
coverAlt: Istio Part1 Cover
coverHidden: true
toc: false
---

[⬅ Back to Intro](../istio-hands-on-part-1-from-kubernetes-to-service-mesh)

> 💡 *This post is part of my [Istio Hands-on Series](../istio-hands-on-part-1-from-kubernetes-to-service-mesh) — a practical journey into Kubernetes Service Mesh. Each post builds on the previous one with hands-on labs, real command outputs, and clear explanations aimed at learning Istio by doing, not just reading.*

In the previous parts, we’ve explored traffic management, observability, and authentication.

Now it’s time to make our services **accessible securely from outside the cluster** — through the **Istio Ingress Gateway** .

This is where Istio truly shines — giving you **fine-grained control** , **TLS termination** , and **layer-7 routing** right at the edge of your service mesh.

---

### What You’ll Learn

In this post, we’ll:

* Understand what the Istio Ingress Gateway does
* Replace the `frontend` workload with a real web service
* Expose the `frontend` service securely to external clients
* Configure **HTTP → HTTPS redirection**
* Set up **TLS termination** with self-signed certificates
* Optionally, add mutual TLS for extra securit
* Understand what the Istio Ingress Gateway does
* Expose the `frontend` service securely to external clients
* Configure **HTTP → HTTPS redirection**
* Set up **TLS termination** with self-signed certificates
* Optionally, add mutual TLS for extra security

---

### Step 1: Confirm the Ingress Gateway Is Running

Check if the Ingress Gateway is up and running in your `istio-system` namespace:

```bash
kubectl get pods -n istio-system -l istio=ingressgateway
```

✅ Expected output:

```bash
NAME                                    READY   STATUS    RESTARTS       AGE
istio-ingressgateway-7d7f977654-spgkh   1/1     Running   4 (112m ago)   4d21h
```

And confirm the service type:

```bash
kubectl get svc -n istio-system istio-ingressgateway
```

If you’re running on **kind** , you’ll see:

```bash
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                                      AGE
istio-ingressgateway   LoadBalancer   10.96.163.224   <pending>     15021:31608/TCP,80:30860/TCP,443:32111/TCP,31400:32139/TCP,15443:32682/TCP   4d21h
```


We’ll use those NodePorts in our testing.


### Step 2 – Deploy a Real Frontend Service

Previously, the `frontend` pod just ran a `curl` loop calling the backend —

so there was nothing listening for inbound requests, causing the *503 upstream connect error* .

Let’s fix that by deploying a lightweight web service that responds to HTTP requests.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: hashicorp/http-echo
        args:
        - "-text=Hello from Frontend"
        ports:
        - containerPort: 5678
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 5678
EOF
```

✅ Verify deployment:

```bash
kubectl get pods -l app=frontend
```

Expect `2/2 Running` (frontend + sidecar).

---

### Step 3 – Create a Self-Signed Certificate

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout frontend.key -out frontend.crt \
  -subj "/CN=frontend.local"

kubectl create -n istio-system secret tls frontend-credential \
  --key=frontend.key \
  --cert=frontend.crt
```

---

### Step 4 – Create Gateway and VirtualService

```bash
cat <<EOF | kubectl apply -f -
apiVersion: networking.istio.io/v1
kind: Gateway
metadata:
  name: frontend-gateway
  namespace: default
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
    tls:
      httpsRedirect: true
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: frontend-credential
    hosts:
    - "frontend.local"
---
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: frontend-vs
  namespace: default
spec:
  hosts:
  - "frontend.local"
  gateways:
  - frontend-gateway
  http:
  - route:
    - destination:
        host: frontend
        port:
          number: 80
EOF
```

---

### Step 5 – Access via Kind Gateway

Fetch NodePort + IP:

```bash
export INGRESS_PORT=$(kubectl -n istio-system get svc istio-ingressgateway -o jsonpath='{.spec.ports[?(@.port==443)].nodePort}')
export INGRESS_HOST=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' istio-lab-control-plane)
echo "$INGRESS_HOST frontend.local" | sudo tee -a /etc/hosts
```

---

### Step 6 – Test Secure Access

```bash
curl -k https://frontend.local:$INGRESS_PORT
```

✅ Expected:

```bash
HTTP/2 200
Hello from Frontend
```

If you see a `301`, that’s the HTTP → HTTPS redirect working.

---

### Step 7 – (Optional) Enable Mutual TLS

Switch to mutual TLS:

```bash
tls:
  mode: MUTUAL
  credentialName: frontend-credential
  caCertificates: /etc/certs/ca-cert.pem
```

Then:

```bash
curl --cert frontend.crt --key frontend.key -k https://frontend.local:$INGRESS_PORT
```

---

### Key Takeaways


| Concept                  | Purpose                             |
| -------------------------- | ------------------------------------- |
| **Ingress Gateway**      | Secure entry point into the mesh    |
| **Gateway CRD**          | Defines ports & hosts to expose     |
| **VirtualService**       | Routes inbound requests to services |
| **SIMPLE TLS**           | Terminates HTTPS at the gateway     |
| **MUTUAL TLS**           | Requires client certificates        |
| **HTTP→HTTPS Redirect** | Forces encrypted traffic            |

---

### Wrapping Up

You’ve now:

* Replaced your `frontend` with a real web endpoint
* Exposed it securely via Istio Ingress Gateway
* Set up HTTPS termination with self-signed TLS
* Learned how to test secure access from kind

This lays the groundwork for production-grade ingress — where gateways handle **TLS** , **auth** , and **routing** for all external traffic.

---

### Next Up

👉 **Istio Hands-on Part 9 – Ingress Gateway and External Traffic**

We’ll explore **rate limiting, retries, and circuit breaking** , making the mesh not only secure but also resilient.

[⬅ Back to Intro](../istio-hands-on-part-1-from-kubernetes-to-service-mesh)
