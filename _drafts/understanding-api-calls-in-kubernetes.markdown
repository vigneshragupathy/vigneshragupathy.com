---
layout: post
title: Understanding API Calls in Kubernetes
---

hi, this is some description

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get endpoints 
    NAME ENDPOINTS AGE
    kubernetes 160.0.0.1:6443 33d
    nginx 40.168.1.19:80,40.168.1.20:80 33d
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

To understand how the above command uses API calls we can use strace command

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ strace kubectl get endpoints

<!--kg-card-end: code-->

This will print a large output. Below is the truncated output where we can see the files used for previous commands

Navigate to the directory and you will see some folders

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ cd /home/vikki/.kube/cache/discovery/160.0.0.1_6443/
    vikki@drona-child-1:~/.kube/cache/discovery/160.0.0.1_6443$ ls -l
    total 72
    drwxr-xr-x 3 root root 4096 Aug 26 18:15 admissionregistration.k8s.io
    drwxr-xr-x 3 root root 4096 Aug 26 18:15 apiextensions.k8s.io
    drwxr-xr-x 4 root root 4096 Aug 26 18:15 apiregistration.k8s.io
    drwxr-xr-x 5 root root 4096 Aug 26 18:15 apps
    drwxr-xr-x 4 root root 4096 Aug 26 18:15 authentication.k8s.io
    drwxr-xr-x 4 root root 4096 Aug 26 18:15 authorization.k8s.io
    drwxr-xr-x 4 root root 4096 Aug 26 18:15 autoscaling
    drwxr-xr-x 4 root root 4096 Aug 26 18:15 batch
    drwxr-xr-x 3 root root 4096 Aug 26 18:15 certificates.k8s.io
    drwxr-xr-x 3 root root 4096 Aug 26 18:15 events.k8s.io
    drwxr-xr-x 3 root root 4096 Aug 26 18:15 extensions
    drwxr-xr-x 3 root root 4096 Aug 26 18:15 networking.k8s.io
    drwxr-xr-x 3 root root 4096 Aug 26 18:15 policy
    drwxr-xr-x 4 root root 4096 Aug 26 18:15 rbac.authorization.k8s.io
    drwxr-xr-x 3 root root 4096 Aug 26 18:15 scheduling.k8s.io
    -rwxr-xr-x 1 root root 3545 Sep 29 11:28 servergroups.json
    drwxr-xr-x 4 root root 4096 Aug 26 18:15 storage.k8s.io
    drwxr-xr-x 2 root root 4096 Sep 29 11:28 v1
    vikki@drona-child-1:~/.kube/cache/discovery/160.0.0.1_6443$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~/.kube/cache/discovery/160.0.0.1_6443$ python3 -m json.tool v1/serverresources.json |grep shortNames -A 1
                "shortNames": [
                    "cs"
    --
                "shortNames": [
                    "cm"
    --
                "shortNames": [
                    "ep"
    --
                "shortNames": [
                    "ev"
    --
                "shortNames": [
                    "limits"
    --
                "shortNames": [
                    "ns"
    --
                "shortNames": [
                    "no"
    --
                "shortNames": [
                    "pvc"
    --
                "shortNames": [
                    "pv"
    --
                "shortNames": [
                    "po"
    --
                "shortNames": [
                    "rc"
    --
                "shortNames": [
                    "quota"
    --
                "shortNames": [
                    "sa"
    --
                "shortNames": [
                    "svc"
    vikki@drona-child-1:~/.kube/cache/discovery/160.0.0.1_6443$ 

<!--kg-card-end: code-->

Try with some of the shortname

<!--kg-card-begin: code-->

    vikki@drona-child-1:~/.kube/cache/discovery/160.0.0.1_6443$ kubectl get sa
    NAME SECRETS AGE
    dashboard 1 33d
    default 1 33d
    vikki@drona-child-1:~/.kube/cache/discovery/160.0.0.1_6443$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~/.kube/cache/discovery/160.0.0.1_6443$ python3 -m json.tool v1/serverresources.json |grep kind
        "kind": "APIResourceList",
                "kind": "Binding",
                "kind": "ComponentStatus",
                "kind": "ConfigMap",
                "kind": "Endpoints",
                "kind": "Event",
                "kind": "LimitRange",
                "kind": "Namespace",
                "kind": "Namespace",
                "kind": "Namespace",
                "kind": "Node",
                "kind": "Node",
                "kind": "Node",
                "kind": "PersistentVolumeClaim",
                "kind": "PersistentVolumeClaim",
                "kind": "PersistentVolume",
                "kind": "PersistentVolume",
                "kind": "Pod",
                "kind": "Pod",
                "kind": "Binding",
                "kind": "Eviction",
                "kind": "Pod",
                "kind": "Pod",
                "kind": "Pod",
                "kind": "Pod",
                "kind": "Pod",
                "kind": "PodTemplate",
                "kind": "ReplicationController",
                "kind": "Scale",
                "kind": "ReplicationController",
                "kind": "ResourceQuota",
                "kind": "ResourceQuota",
                "kind": "Secret",
                "kind": "ServiceAccount",
                "kind": "Service",
                "kind": "Service",
                "kind": "Service",
    vikki@drona-child-1:~/.kube/cache/discovery/160.0.0.1_6443$ 
    

<!--kg-card-end: code-->

Explore other files.

