---
layout: post
title: ResourceQuota to limit PVC count and usage in Kubernetes
---

sdfsafsda

    vikki@drona-child-1:~$ vim storage-quota.yaml
    vikki@drona-child-1:~$ kubectl create namespace small
    namespace/small created
    vikki@drona-child-1:~$ kubectl describe ns small
    Name: small
    Labels: <none>
    Annotations: <none>
    Status: Active
    
    No resource quota.
    
    No resource limits.
    vikki@drona-child-1:~$ 

    vikki@drona-child-1:~$ kubectl create -f PVol.yaml -n small
    persistentvolume/pvvol-1-vikki created
    vikki@drona-child-1:~$ kubectl create -f pvc.yaml -n small
    persistentvolumeclaim/pvc-one-vikki created
    vikki@drona-child-1:~$ kubectl create -f storage-quota.yaml -n small
    resourcequota/storagequota created
    vikki@drona-child-1:~$ kubectl describe ns small
    Name: small
    Labels: <none>
    Annotations: <none>
    Status: Active
    
    Resource Quotas
     Name: storagequota
     Resource Used Hard
     -------- --- ---
     persistentvolumeclaims 1 10
     requests.storage 200Mi 500Mi
    
    No resource limits.
    vikki@drona-child-1:~$ 

    vikki@drona-child-1:~$ vim depl.yaml

<script src="https://gist.github.com/vignesh88/6bfb8d60383b503dcefa413f1744dd8d.js"></script>

    vikki@drona-child-1:~$ kubectl create -f depl.yaml -n small
    deployment.extensions/nginx-nfs-pv created
    vikki@drona-child-1:~$ kubectl get deployments -n small
    NAME DESIRED CURRENT UP-TO-DATE AVAILABLE AGE
    nginx-nfs-pv 1 1 1 1 36s
    vikki@drona-child-1:~$ kubectl get pods -n small
    NAME READY STATUS RESTARTS AGE
    nginx-nfs-pv-87c776f67-4p9sx 1/1 Running 0 51s
    vikki@drona-child-1:~$ kubectl -n small describe 
    error: You must specify the type of resource to describe. Use "kubectl api-resources" for a complete list of supported resources.
    vikki@drona-child-1:~$ kubectl -n small describe deployment
    Name: nginx-nfs-pv
    Namespace: small
    CreationTimestamp: Sun, 30 Sep 2018 17:31:08 +0530
    Labels: run=nginx
    Annotations: deployment.kubernetes.io/revision=1
    Selector: run=nginx
    Replicas: 1 desired | 1 updated | 1 total | 1 available | 0 unavailable
    StrategyType: RollingUpdate
    MinReadySeconds: 0
    RollingUpdateStrategy: 25% max unavailable, 25% max surge
    Pod Template:
      Labels: run=nginx
      Containers:
       nginx:
        Image: nginx
        Port: 80/TCP
        Host Port: 0/TCP
        Environment: <none>
        Mounts:
          /opt from nfs-vol (rw)
      Volumes:
       nfs-vol:
        Type: PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
        ClaimName: pvc-one-vikki
        ReadOnly: false
    Conditions:
      Type Status Reason
      ---- ------ ------
      Available True MinimumReplicasAvailable
      Progressing True NewReplicaSetAvailable
    OldReplicaSets: <none>
    NewReplicaSet: nginx-nfs-pv-87c776f67 (1/1 replicas created)
    Events:
      Type Reason Age From Message
      ---- ------ ---- ---- -------
      Normal ScalingReplicaSet 1m deployment-controller Scaled up replica set nginx-nfs-pv-87c776f67 to 1
    vikki@drona-child-1:~$ 

    vikki@drona-child-1:~$ kubectl describe pods nginx-nfs-pv-87c776f67-4p9sx -n small
    Name: nginx-nfs-pv-87c776f67-4p9sx
    Namespace: small
    Priority: 0
    PriorityClassName: <none>
    Node: drona-child-3/10.0.2.15
    Start Time: Sun, 30 Sep 2018 17:31:09 +0530
    Labels: pod-template-hash=437332923
                        run=nginx
    Annotations: <none>
    Status: Running
    IP: 40.168.1.52
    Controlled By: ReplicaSet/nginx-nfs-pv-87c776f67
    Containers:
      nginx:
        Container ID: docker://9937ce20849ab85fb92f4adc3231203c8a02a31e901738341fd1f7852d34ec3c
        Image: nginx
        Image ID: docker-pullable://docker.io/nginx@sha256:e8ab8d42e0c34c104ac60b43ba60b19af08e19a0e6d50396bdfd4cef0347ba83
        Port: 80/TCP
        Host Port: 0/TCP
        State: Running
          Started: Sun, 30 Sep 2018 17:31:18 +0530
        Ready: True
        Restart Count: 0
        Environment: <none>
        Mounts:
          /opt from nfs-vol (rw)
          /var/run/secrets/kubernetes.io/serviceaccount from default-token-6zl7q (ro)
    Conditions:
      Type Status
      Initialized True 
      Ready True 
      ContainersReady True 
      PodScheduled True 
    Volumes:
      nfs-vol:
        Type: PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
        ClaimName: pvc-one-vikki
        ReadOnly: false
      default-token-6zl7q:
        Type: Secret (a volume populated by a Secret)
        SecretName: default-token-6zl7q
        Optional: false
    QoS Class: BestEffort
    Node-Selectors: <none>
    Tolerations: node.kubernetes.io/not-ready:NoExecute for 300s
                     node.kubernetes.io/unreachable:NoExecute for 300s
    Events:
      Type Reason Age From Message
      ---- ------ ---- ---- -------
      Normal Scheduled 4m default-scheduler Successfully assigned small/nginx-nfs-pv-87c776f67-4p9sx to drona-child-3
      Normal Pulling 4m kubelet, drona-child-3 pulling image "nginx"
      Normal Pulled 4m kubelet, drona-child-3 Successfully pulled image "nginx"
      Normal Created 4m kubelet, drona-child-3 Created container
      Normal Started 4m kubelet, drona-child-3 Started container
    vikki@drona-child-1:~$ 

Now we can see the disk usage in base server is not counted in ResourceQuota.

    vikki@drona-child-1:~$ kubectl describe ns small
    Name: small
    Labels: <none>
    Annotations: <none>
    Status: Active
    
    Resource Quotas
     Name: storagequota
     Resource Used Hard
     -------- --- ---
     persistentvolumeclaims 1 10
     requests.storage 200Mi 500Mi
    
    No resource limits.
    vikki@drona-child-1:~$ sudo dd if=/dev/zero of=/opt/
    cni/ sfw/ VBoxGuestAdditions-5.2.12/ 
    vikki@drona-child-1:~$ sudo dd if=/dev/zero of=/opt/sfw/bigfile_1 bs=1M count=300
    [sudo] password for vikki: 
    300+0 records in
    300+0 records out
    314572800 bytes (315 MB, 300 MiB) copied, 0.300187 s, 1.0 GB/s
    vikki@drona-child-1:~$ kubectl describe ns small
    Name: small
    Labels: <none>
    Annotations: <none>
    Status: Active
    
    Resource Quotas
     Name: storagequota
     Resource Used Hard
     -------- --- ---
     persistentvolumeclaims 1 10
     requests.storage 200Mi 500Mi
    
    No resource limits.
    vikki@drona-child-1:~$ 

Now lets see what happens when the deployment request more than the quota.  
First delete teh existing deployment and vefiry

    vikki@drona-child-1:~$ kubectl -n small get deploy
    NAME DESIRED CURRENT UP-TO-DATE AVAILABLE AGE
    nginx-nfs-pv 1 1 1 1 9m
    vikki@drona-child-1:~$ kubectl -n small delete deploy nginx-nfs-pv 
    deployment.extensions "nginx-nfs-pv" deleted
    vikki@drona-child-1:~$ kubectl -n small get pods
    NAME READY STATUS RESTARTS AGE
    nginx-nfs-pv-87c776f67-4p9sx 0/1 Terminating 0 10m
    vikki@drona-child-1:~$ kubectl -n small get pods
    No resources found.
    vikki@drona-child-1:~$ kubectl -n small get resourcequotas 
    NAME CREATED AT
    storagequota 2018-09-30T11:56:17Z
    vikki@drona-child-1:~$ kubectl get resourcequotas 
    No resources found.
    vikki@drona-child-1:~$ kubectl describe ns small
    Name: small
    Labels: <none>
    Annotations: <none>
    Status: Active
    
    Resource Quotas
     Name: storagequota
     Resource Used Hard
     -------- --- ---
     persistentvolumeclaims 1 10
     requests.storage 200Mi 500Mi
    
    No resource limits.
    vikki@drona-child-1:~$ 

Now we can see the space is not automatically cleaned up.

    vikki@drona-child-1:~$ kubectl get pvc -n small
    NAME STATUS VOLUME CAPACITY ACCESS MODES STORAGECLASS AGE
    pvc-one-vikki Bound pvvol-1-vikki 1Gi RWX 16m
    vikki@drona-child-1:~$ kubectl delete pvc pvc-one-vikki ^C small 
    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Retain Bound small/pvc-one-vikki 17m
    vikki@drona-child-1:~$ kubectl delete pvc pvc-one-vikki -n small
    persistentvolumeclaim "pvc-one-vikki" deleted
    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Retain Released small/pvc-one-vikki 18m
    vikki@drona-child-1:~$ 
    vikki@drona-child-1:~$ kubectl describe namespace small
    Name: small
    Labels: <none>
    Annotations: <none>
    Status: Active
    
    Resource Quotas
     Name: storagequota
     Resource Used Hard
     -------- --- ---
     persistentvolumeclaims 0 10
     requests.storage 0 500Mi
    
    No resource limits.
    vikki@drona-child-1:~$ 
    

Now the storage space is cleaned up.

Lets see how to dynamically provision the stroage using reclaim policy.

    vikki@drona-child-1:~$ kubectl get pv pvvol-1-vikki -o yaml |grep ReclaimPolicy
      persistentVolumeReclaimPolicy: Retain
    vikki@drona-child-1:~$ 

Delete and recreate the PV and pathch to change the reclaim policy

    vikki@drona-child-1:~$ kubectl get pv pvvol-1-vikki -o yaml |grep ReclaimPolicy
      persistentVolumeReclaimPolicy: Retain
    vikki@drona-child-1:~$ kubectl delete pv pvvol-1-vikki 
    persistentvolume "pvvol-1-vikki" deleted
    vikki@drona-child-1:~$ kubectl get pv
    No resources found.
    vikki@drona-child-1:~$ kubectl create -f PVol.yaml 
    persistentvolume/pvvol-1-vikki created
    vikki@drona-child-1:~$ kubectl get pv
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Retain Available 47s
    vikki@drona-child-1:~$ kubectl patch pv pvvol-1-vikki -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
    persistentvolume/pvvol-1-vikki patched
    vikki@drona-child-1:~$ kubectl get pv
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Delete Available 1m
    vikki@drona-child-1:~$ 

Create new storage quota with 100M limit

    vikki@drona-child-1:~$ vim storage-quota.yaml 
    vikki@drona-child-1:~$ kubectl create -f storage-quota.yaml -n small
    resourcequota/storagequota created
    vikki@drona-child-1:~$ kubectl describe ns small
    Name: small
    Labels: <none>
    Annotations: <none>
    Status: Active
    
    Resource Quotas
     Name: storagequota
     Resource Used Hard
     -------- --- ---
     persistentvolumeclaims 0 10
     requests.storage 0 100Mi
    
    No resource limits.
    vikki@drona-child-1:~$ kubectl create -f pvc.yaml -n small
    Error from server (Forbidden): error when creating "pvc.yaml": persistentvolumeclaims "pvc-one-vikki" is forbidden: exceeded quota: storagequota, requested: requests.storage=200Mi, used: requests.storage=0, limited: requests.storage=100Mi
    

Now we can see we are not abel to create the PVC since the resource quota for PV is set to 100Mi and the pvc is trying to create 200Mi

Lets change the value to 50Mi and recreate pvc

    vikki@drona-child-1:~$ kubectl create -f pvc.yaml -n small
    persistentvolumeclaim/pvc-one-vikki created
    vikki@drona-child-1:~$ kubectl get pvc -n small
    NAME STATUS VOLUME CAPACITY ACCESS MODES STORAGECLASS AGE
    pvc-one-vikki Bound pvvol-1-vikki 1Gi RWX 12s
    
    vikki@drona-child-1:~$ kubectl describe ns small
    Name: small
    Labels: <none>
    Annotations: <none>
    Status: Active
    
    Resource Quotas
     Name: storagequota
     Resource Used Hard
     -------- --- ---
     persistentvolumeclaims 1 10
     requests.storage 50Mi 100Mi
    
    No resource limits.

Tryign to delete the pvc results in failed status in PV

    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Delete Bound small/pvc-one-vikki 22m
    vikki@drona-child-1:~$ kubectl delete -n small pvc pvc-one-vikki
    persistentvolumeclaim "pvc-one-vikki" deleted
    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Delete Failed small/pvc-one-vikki 23m
    vikki@drona-child-1:~$ 

Manually delete the PV

    vikki@drona-child-1:~$ kubectl delete pv -n small pvvol-1-vikki
    persistentvolume "pvvol-1-vikki" deleted

    vikki@drona-child-1:~$ vim PVol.yaml

<script src="https://gist.github.com/vignesh88/d6867289bd2bbc882823f9a18dc9f4f7.js"></script>

    vikki@drona-child-1:~$ kubectl -n small create -f PVol.yaml 
    persistentvolume/pvvol-1-vikki created
    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Recycle Available 15s
    vikki@drona-child-1:~$ 
    ikki@drona-child-1:~$ kubectl create -f pvc.yaml -n small
    persistentvolumeclaim/pvc-one-vikki created
    vikki@drona-child-1:~$ kubectl -n small get pvc
    NAME STATUS VOLUME CAPACITY ACCESS MODES STORAGECLASS AGE
    pvc-one-vikki Bound pvvol-1-vikki 1Gi RWX 10s
    vikki@drona-child-1:~$ 
    

    vikki@drona-child-1:~$ kubectl create -f nfs-pod.yaml -n small
    deployment.apps/nginx-nfs created
    vikki@drona-child-1:~$ kubectl get pvc -n small
    NAME STATUS VOLUME CAPACITY ACCESS MODES STORAGECLASS AGE
    pvc-one-vikki Bound pvvol-1-vikki 1Gi RWX 2m
    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Recycle Bound small/pvc-one-vikki 3m
    vikki@drona-child-1:~$ kubectl -n small delete deployments nginx-nfs 
    deployment.extensions "nginx-nfs" deleted
    vikki@drona-child-1:~$ kubectl get pvc -n small
    NAME STATUS VOLUME CAPACITY ACCESS MODES STORAGECLASS AGE
    pvc-one-vikki Bound pvvol-1-vikki 1Gi RWX 3m
    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Recycle Bound small/pvc-one-vikki 4m
    vikki@drona-child-1:~$ kubectl -n small delete pvc pvc-one-vikki
    persistentvolumeclaim "pvc-one-vikki" deleted
    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Recycle Released small/pvc-one-vikki 4m
    vikki@drona-child-1:~$ kubectl get pv -n small
    NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
    pvvol-1-vikki 1Gi RWX Recycle Available 4m
    vikki@drona-child-1:~$ 
    ``

<!--kg-card-end: markdown-->