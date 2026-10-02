---
title: "Istio Hands-On Part 2: Setting Up the Playground with kind"
description: Spin up a local Kubernetes cluster with kind and install Istio in under ten minutes.
date: 2025-11-06
tags: [istio, kubernetes, kind]
---
Before we touch sidecars or mTLS, we need a cluster we can break without consequences. `kind` runs Kubernetes nodes as Docker containers, which makes it perfect for this.

## Create the cluster

```bash
kind create cluster --name istio-lab --config kind.yaml
kubectl cluster-info --context kind-istio-lab
```

## Install Istio

```bash
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
```

That's it. Next part: understanding what the sidecar injector actually did.
