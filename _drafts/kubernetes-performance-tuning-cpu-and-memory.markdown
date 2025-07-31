---
layout: post
title: Kubernetes - Performance tuning CPU and Memory
---

vikki@drona-child-1:~$ kubectl run stress-test --image=vish/stress  
deployment.apps "stress-test" created  
vikki@drona-child-1:~$ kubectl get pods  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; READY &nbsp; &nbsp; STATUS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;RESTARTS &nbsp; AGE  
nginx-768979984b-mmgbj &nbsp; &nbsp; &nbsp; &nbsp; 1/1 &nbsp; &nbsp; &nbsp; Running &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 6 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;65d  
stress-test-78944d5478-wmmtc &nbsp; 0/1 &nbsp; &nbsp; &nbsp; ContainerCreating &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;6s  
vikki@drona-child-1:~$ kubectl get pods  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; READY &nbsp; &nbsp; STATUS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;RESTARTS &nbsp; AGE  
nginx-768979984b-mmgbj &nbsp; &nbsp; &nbsp; &nbsp; 1/1 &nbsp; &nbsp; &nbsp; Running &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 6 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;65d  
stress-test-78944d5478-wmmtc &nbsp; 0/1 &nbsp; &nbsp; &nbsp; ContainerCreating &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;9s  
vikki@drona-child-1:~$

[root@drona-child-3 ~]# docker logs e8e43da13b23  
I0819 13:01:00.200714 &nbsp; &nbsp; &nbsp; 1 main.go:26] Allocating "0" memory, in "4Ki" chunks, with a 1ms sleep between allocations  
I0819 13:01:00.200804 &nbsp; &nbsp; &nbsp; 1 main.go:29] Allocated "0" memory  
[root@drona-child-3 ~]#

vikki@drona-child-1:~$ kubectl get deployment stress-test -o yaml \> stress.test.yaml  
vikki@drona-child-1:~$ vim stress.test.yaml

