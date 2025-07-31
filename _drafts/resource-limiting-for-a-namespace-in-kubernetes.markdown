---
layout: post
title: Resource limiting for a namespace in kubernetes
---

We have seen about resource limiting cpu and memory at pod level. Now we are going to see resourse limiting as namespace level

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create namespace low-usage-tier-1
    namespace/low-usage-tier-1 created

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get namespaces
    NAME STATUS AGE
    default Active 1h
    kube-public Active 1h
    kube-system Active 1h
    low-usage-tier-1 Active 10s
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

Now create a yaml file with limits and requests value added.  
The kind should be LimitRange.

Now apply the LimitRange to the namespace we created

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create -f limit_range.yaml --namespace=low-usage-tier-1 
    limitrange/low-usage-tier-1 created
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

Verify the limitanges

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get limitranges 
    No resources found.
    vikki@drona-child-1:~$ kubectl get limitranges --all-namespaces
    NAMESPACE NAME CREATED AT
    low-usage-tier-1 low-usage-limit-range 2018-08-26T14:21:36Z

<!--kg-card-end: code-->

Now run any pod with the namespace low-usage-tier-1

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl run stress-test-limited --image vish/stress -n low-usage-tier-1 
    deployment.apps/stress-test-limited created
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

Verify the pod is started.

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get deployments --all-namespaces
    NAMESPACE NAME DESIRED CURRENT UP-TO-DATE AVAILABLE AGE
    default nginx 2 2 2 2 46m
    kube-system coredns 2 2 2 2 1h
    kube-system kubernetes-dashboard 1 1 1 1 1h
    low-usage-tier-1 stress-test-limited 1 1 1 1 1m
    vikki@drona-child-1:~$ 
    
    vikki@drona-child-1:~$ kubectl get pod --all-namespaces
    NAMESPACE NAME READY STATUS RESTARTS AGE
    default nginx-6f858d4d45-6zr5f 1/1 Running 0 40m
    default nginx-6f858d4d45-b54bf 1/1 Running 0 42m
    kube-system coredns-78fcdf6894-7bsns 1/1 Running 2 1h
    kube-system coredns-78fcdf6894-phj5j 1/1 Running 2 1h
    kube-system etcd-drona-child-1 1/1 Running 2 1h
    kube-system kube-apiserver-drona-child-1 1/1 Running 2 1h
    kube-system kube-controller-manager-drona-child-1 1/1 Running 2 1h
    kube-system kube-flannel-ds-amd64-8b6rb 1/1 Running 1 47m
    kube-system kube-flannel-ds-amd64-qgxrd 1/1 Running 2 1h
    kube-system kube-proxy-2ch2w 1/1 Running 2 1h
    kube-system kube-proxy-qwgq5 1/1 Running 0 47m
    kube-system kube-scheduler-drona-child-1 1/1 Running 2 1h
    kube-system kubernetes-dashboard-6948bdb78-zzjqq 1/1 Running 2 1h
    low-usage-tier-1 stress-test-limited-58b76c667f-ssthq 1/1 Running 0 55s
    

<!--kg-card-end: code-->

Now export the pod to yaml and verify the limits/requests options are automatically inhereted from namespace low-usage-tier-1

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get pod stress-test-limited-58b76c667f-ssthq --namespace=low-usage-tier-1 -o yaml

<!--kg-card-end: code-->