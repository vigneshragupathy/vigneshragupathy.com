---
layout: post
title: Working with ReplicaSets in Kubernetes
---

sfsdafds

Create a simple yaml file to create a replica set

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ vim replica_set.yaml

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create -f replica_set.yaml 
    replicaset.extensions/replicate-set-vikki created

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get rs
    NAME DESIRED CURRENT READY AGE
    nginx-64f497f8fd 0 0 0 33d
    nginx-6f858d4d45 1 1 1 33d
    replicate-set-vikki 2 2 2 3m
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl describe rs replicate-set-vikki 
    Name: replicate-set-vikki
    Namespace: default
    Selector: system=ReplicaOne
    Labels: system=ReplicaOne
    Annotations: <none>
    Replicas: 2 current / 2 desired
    Pods Status: 2 Running / 0 Waiting / 0 Succeeded / 0 Failed
    Pod Template:
      Labels: system=ReplicaOne
      Containers:
       nginx:
        Image: nginx
        Port: <none>
        Host Port: <none>
        Environment: <none>
        Mounts: <none>
      Volumes: <none>
    Events:
      Type Reason Age From Message
      ---- ------ ---- ---- -------
      Normal SuccessfulCreate 3m replicaset-controller Created pod: replicate-set-vikki-tcqfq
      Normal SuccessfulCreate 3m replicaset-controller Created pod: replicate-set-vikki-2nkhr
    vikki@drona-child-1:~$ 
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get pods
    NAME READY STATUS RESTARTS AGE
    busybox 1/1 Running 0 45m
    nginx-6f858d4d45-6zr5f 1/1 Running 1 33d
    replicate-set-vikki-2nkhr 1/1 Running 0 3m
    replicate-set-vikki-tcqfq 1/1 Running 0 3m
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

We can delete the replica set without deleting the pods

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl delete rs replicate-set-vikki --cascade=false
    replicaset.extensions "replicate-set-vikki" deleted
    vikki@drona-child-1:~$ kubectl get rs
    NAME DESIRED CURRENT READY AGE
    nginx-64f497f8fd 0 0 0 33d
    nginx-6f858d4d45 1 1 1 33d
    vikki@drona-child-1:~$ kubectl get pods
    NAME READY STATUS RESTARTS AGE
    busybox 1/1 Running 0 46m
    nginx-6f858d4d45-6zr5f 1/1 Running 1 33d
    replicate-set-vikki-2nkhr 1/1 Running 0 5m
    replicate-set-vikki-tcqfq 1/1 Running 0 5m
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

We can recreate the replcia sets and it will automatically take the ownerships of the pods

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create -f replica_set.yaml 
    replicaset.extensions/replicate-set-vikki created
    vikki@drona-child-1:~$ kubectl get rs
    NAME DESIRED CURRENT READY AGE
    nginx-64f497f8fd 0 0 0 33d
    nginx-6f858d4d45 1 1 1 33d
    replicate-set-vikki 2 2 2 5s
    vikki@drona-child-1:~$ kubectl get pods
    NAME READY STATUS RESTARTS AGE
    busybox 1/1 Running 0 47m
    nginx-6f858d4d45-6zr5f 1/1 Running 1 33d
    replicate-set-vikki-2nkhr 1/1 Running 0 6m
    replicate-set-vikki-tcqfq 1/1 Running 0 6m
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

We can also isolate the pod from replicaset. This can be acheived by adding a label.

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl edit pod replicate-set-vikki-2nkhr 

<!--kg-card-end: code-->

Now we can see the replicate set the running with a new pods and total pods running is 3(1 as isolated)

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get rs
    NAME DESIRED CURRENT READY AGE
    nginx-64f497f8fd 0 0 0 33d
    nginx-6f858d4d45 1 1 1 33d
    replicate-set-vikki 2 2 2 6m
    vikki@drona-child-1:~$ kubectl get pods -L system
    NAME READY STATUS RESTARTS AGE SYSTEM
    busybox 1/1 Running 0 55m       
    nginx-6f858d4d45-6zr5f 1/1 Running 1 33d       
    replicate-set-vikki-2nkhr 1/1 Running 0 14m IsolatedPod
    replicate-set-vikki-m4w6k 1/1 Running 0 2m ReplicaOne
    replicate-set-vikki-tcqfq 1/1 Running 0 14m ReplicaOne
    vikki@drona-child-1:~$ 
    

<!--kg-card-end: code-->

Now try deleting the replicaset, still one of the pod will be running because it is isolated

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl delete rs replicate-set-vikki 
    replicaset.extensions "replicate-set-vikki" deleted
    vikki@drona-child-1:~$ kubectl get rs
    NAME DESIRED CURRENT READY AGE
    nginx-64f497f8fd 0 0 0 33d
    nginx-6f858d4d45 1 1 1 33d
    vikki@drona-child-1:~$ kubectl get pods
    NAME READY STATUS RESTARTS AGE
    busybox 1/1 Running 0 57m
    nginx-6f858d4d45-6zr5f 1/1 Running 1 33d
    replicate-set-vikki-2nkhr 1/1 Running 0 15m
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

We are use the label IsolatedPod to delete all the pods in specific label.

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get pods -L system
    NAME READY STATUS RESTARTS AGE SYSTEM
    busybox 1/1 Running 0 58m       
    nginx-6f858d4d45-6zr5f 1/1 Running 1 33d       
    replicate-set-vikki-2nkhr 1/1 Running 0 16m IsolatedPod
    vikki@drona-child-1:~$ kubectl delete pods -l system=IsolatedPod
    pod "replicate-set-vikki-2nkhr" deleted
    vikki@drona-child-1:~$ kubectl get pods -L system
    NAME READY STATUS RESTARTS AGE SYSTEM
    busybox 1/1 Running 0 58m       
    nginx-6f858d4d45-6zr5f 1/1 Running 1 33d       
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->