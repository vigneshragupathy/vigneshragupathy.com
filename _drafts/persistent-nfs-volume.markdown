---
layout: post
title: Persistent nfs volume
---

vikki@drona-child-1:~$ sudo apt-get install nfs-kernel-server  
[sudo] password for vikki:  
Reading package lists... Done  
Building dependency tree  
Reading state information... Done  
The following additional packages will be installed:  
keyutils libnfsidmap2 libtirpc1 nfs-common rpcbind  
Suggested packages:  
open-iscsi watchdog  
The following NEW packages will be installed:  
keyutils libnfsidmap2 libtirpc1 nfs-common nfs-kernel-server rpcbind  
0 upgraded, 6 newly installed, 0 to remove and 138 not upgraded.  
Creating config file /etc/exports with new version  
Creating config file /etc/default/nfs-kernel-server with new version  
Processing triggers for libc-bin (2.27-3ubuntu1) ...  
Processing triggers for systemd (237-3ubuntu10.3) ...  
Processing triggers for ureadahead (0.100.0-20) ...  
vikki@drona-child-1:~$

vikki@drona-child-1:~$ sudo mkdir /opt/sfw  
vikki@drona-child-1:~$ sudo chmod 1777 /opt/sfw/  
vikki@drona-child-1:~$ sudo echo software \> /opt/sfw/hello.txt  
vikki@drona-child-1:~$ cat /opt/sfw/hello.txt  
software  
vikki@drona-child-1:~$

[root@drona-child-3 ~]# yum install nfs-utils  
[root@drona-child-3 ~]# showmount -e 192.168.1.101  
Export list for 192.168.1.101:  
/opt/sfw \*  
[root@drona-child-3 ~]#

vikki@drona-child-1:~$ vim PVol.yaml  
vikki@drona-child-1:~$ kubectl get pv  
No resources found.  
vikki@drona-child-1:~$ kubectl create -f PVol.yaml  
persistentvolume/pvvol-1-vikki created  
vikki@drona-child-1:~$ kubectl get pv  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;CAPACITY &nbsp; ACCESS MODES &nbsp; RECLAIM POLICY &nbsp; STATUS &nbsp; &nbsp; &nbsp;CLAIM &nbsp; &nbsp; STORAGECLASS &nbsp; REASON &nbsp; &nbsp;AGE  
pvvol-1-vikki &nbsp; 1Gi &nbsp; &nbsp; &nbsp; &nbsp;RWX &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Retain &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Available &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2s  
vikki@drona-child-1:~$

vikki@drona-child-1:~$ kubectl get pvc  
No resources found.  
vikki@drona-child-1:~$ vim pvc.yaml  
vikki@drona-child-1:~$ kubectl create -f pvc.yaml  
error: error parsing pvc.yaml: error converting YAML to JSON: yaml: line 7: did not find expected '-' indicator  
vikki@drona-child-1:~$ vim pvc.yaml  
vikki@drona-child-1:~$ kubectl create -f pvc.yaml  
persistentvolumeclaim/pvc-one-vikki created  
vikki@drona-child-1:~$ kubectl get pvc  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;STATUS &nbsp; &nbsp;VOLUME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;CAPACITY &nbsp; ACCESS MODES &nbsp; STORAGECLASS &nbsp; AGE  
pvc-one-vikki &nbsp; Bound &nbsp; &nbsp; pvvol-1-vikki &nbsp; 1Gi &nbsp; &nbsp; &nbsp; &nbsp;RWX &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 6s  
vikki@drona-child-1:~$  
vikki@drona-child-1:~$ kubectl get pv  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;CAPACITY &nbsp; ACCESS MODES &nbsp; RECLAIM POLICY &nbsp; STATUS &nbsp; &nbsp;CLAIM &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; STORAGECLASS &nbsp; REASON &nbsp; &nbsp;AGE  
pvvol-1-vikki &nbsp; 1Gi &nbsp; &nbsp; &nbsp; &nbsp;RWX &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Retain &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Bound &nbsp; &nbsp; default/pvc-one-vikki &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;3m  
vikki@drona-child-1:~$

vikki@drona-child-1:~$ vim depl.yaml

vikki@drona-child-1:~$ kubectl create -f depl.yaml  
deployment.extensions/nginx-nfs-pv created  
vikki@drona-child-1:~$ kubectl get deployments  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; DESIRED &nbsp; CURRENT &nbsp; UP-TO-DATE &nbsp; AVAILABLE &nbsp; AGE  
nginx &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 34d  
nginx-nfs-pv &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 9s  
vikki@drona-child-1:~$ kubectl get pv  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;CAPACITY &nbsp; ACCESS MODES &nbsp; RECLAIM POLICY &nbsp; STATUS &nbsp; &nbsp;CLAIM &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; STORAGECLASS &nbsp; REASON &nbsp; &nbsp;AGE  
pvvol-1-vikki &nbsp; 1Gi &nbsp; &nbsp; &nbsp; &nbsp;RWX &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Retain &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Bound &nbsp; &nbsp; default/pvc-one-vikki &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;54m  
vikki@drona-child-1:~$ kubectl get pvc  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;STATUS &nbsp; &nbsp;VOLUME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;CAPACITY &nbsp; ACCESS MODES &nbsp; STORAGECLASS &nbsp; AGE  
pvc-one-vikki &nbsp; Bound &nbsp; &nbsp; pvvol-1-vikki &nbsp; 1Gi &nbsp; &nbsp; &nbsp; &nbsp;RWX &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 51m

vikki@drona-child-1:~$ kubectl get pods  
NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; READY &nbsp; &nbsp; STATUS &nbsp; &nbsp;RESTARTS &nbsp; AGE  
busybox &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;0/1 &nbsp; &nbsp; &nbsp; Error &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1d  
daemon-set-vikki-roll-update-d4gjg &nbsp; 1/1 &nbsp; &nbsp; &nbsp; Running &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;19h  
nginx-6f858d4d45-6zr5f &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1/1 &nbsp; &nbsp; &nbsp; Running &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;34d  
nginx-nfs-pv-87c776f67-984bq &nbsp; &nbsp; &nbsp; &nbsp; 1/1 &nbsp; &nbsp; &nbsp; Running &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;32s  
shell-demo &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1/1 &nbsp; &nbsp; &nbsp; Running &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1h  
vikki@drona-child-1:~$ kubectl describe pod nginx-nfs-pv-87c776f67-984bq  
Name: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; nginx-nfs-pv-87c776f67-984bq  
Namespace: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;default  
Priority: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 0  
PriorityClassName: &nbsp;  
Node: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; drona-child-3/10.0.2.15  
Start Time: &nbsp; &nbsp; &nbsp; &nbsp; Sun, 30 Sep 2018 14:03:20 +0530  
Labels: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; pod-template-hash=437332923  
run=nginx  
Annotations: &nbsp; &nbsp; &nbsp; &nbsp;  
Status: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Running  
IP: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 40.168.1.45  
Controlled By: &nbsp; &nbsp; &nbsp;ReplicaSet/nginx-nfs-pv-87c776f67  
Containers:  
nginx:  
Container ID: &nbsp; docker://7f9d05629fbc2873729074712b0f6b3f2a4a37215ae9b80224f8ece130579c27  
Image: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;nginx  
Image ID: &nbsp; &nbsp; &nbsp; docker-pullable://docker.io/nginx@sha256:e8ab8d42e0c34c104ac60b43ba60b19af08e19a0e6d50396bdfd4cef0347ba83  
Port: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 80/TCP  
Host Port: &nbsp; &nbsp; &nbsp;0/TCP  
State: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Running  
Started: &nbsp; &nbsp; &nbsp;Sun, 30 Sep 2018 14:03:40 +0530  
Ready: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;True  
Restart Count: &nbsp;0  
Environment: &nbsp; &nbsp;  
Mounts:  
/opt from nfs-vol (rw)  
/var/run/secrets/kubernetes.io/serviceaccount from default-token-842zc (ro)  
Conditions:  
Type &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Status  
Initialized &nbsp; &nbsp; &nbsp; True  
Ready &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; True  
ContainersReady &nbsp; True  
PodScheduled &nbsp; &nbsp; &nbsp;True  
Volumes:  
nfs-vol:  
Type: &nbsp; &nbsp; &nbsp; PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)  
ClaimName: &nbsp;pvc-one-vikki  
ReadOnly: &nbsp; false  
default-token-842zc:  
Type: &nbsp; &nbsp; &nbsp; &nbsp;Secret (a volume populated by a Secret)  
SecretName: &nbsp;default-token-842zc  
Optional: &nbsp; &nbsp;false  
QoS Class: &nbsp; &nbsp; &nbsp; BestEffort  
Node-Selectors: &nbsp;  
Tolerations: &nbsp; &nbsp; node.kubernetes.io/not-ready:NoExecute for 300s  
node.kubernetes.io/unreachable:NoExecute for 300s  
Events:  
Type &nbsp; &nbsp;Reason &nbsp; &nbsp; Age &nbsp; From &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Message

<!--kg-card-begin: hr-->
* * *
<!--kg-card-end: hr-->

Normal &nbsp;Scheduled &nbsp;47s &nbsp; default-scheduler &nbsp; &nbsp; &nbsp; Successfully assigned default/nginx-nfs-pv-87c776f67-984bq to drona-child-3  
Normal &nbsp;Pulling &nbsp; &nbsp;36s &nbsp; kubelet, drona-child-3 &nbsp;pulling image "nginx"  
Normal &nbsp;Pulled &nbsp; &nbsp; 28s &nbsp; kubelet, drona-child-3 &nbsp;Successfully pulled image "nginx"  
Normal &nbsp;Created &nbsp; &nbsp;27s &nbsp; kubelet, drona-child-3 &nbsp;Created container  
Normal &nbsp;Started &nbsp; &nbsp;27s &nbsp; kubelet, drona-child-3 &nbsp;Started container  
vikki@drona-child-1:~$

[root@drona-child-3 ~]# docker exec -it k8s\_nginx\_nginx-nfs-pv-87c776f67-984bq\_default\_7cb542e1-c48b-11e8-ad73-080027165f06\_0 bash  
root@nginx-nfs-pv-87c776f67-984bq:/# df -h  
Filesystem &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Size &nbsp;Used Avail Use% Mounted on  
overlay &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;6.2G &nbsp;4.1G &nbsp;2.1G &nbsp;67% /  
tmpfs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1000M &nbsp; &nbsp; 0 1000M &nbsp; 0% /dev  
tmpfs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1000M &nbsp; &nbsp; 0 1000M &nbsp; 0% /sys/fs/cgroup  
drona-child-1:/opt/sfw &nbsp; 8.9G &nbsp;6.7G &nbsp;1.7G &nbsp;80% /opt  
/dev/mapper/centos-root &nbsp;6.2G &nbsp;4.1G &nbsp;2.1G &nbsp;67% /etc/hosts  
shm &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 64M &nbsp; &nbsp; 0 &nbsp; 64M &nbsp; 0% /dev/shm  
tmpfs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1000M &nbsp; 12K 1000M &nbsp; 1% /run/secrets/kubernetes.io/serviceaccount  
tmpfs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1000M &nbsp; &nbsp; 0 1000M &nbsp; 0% /proc/acpi  
tmpfs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1000M &nbsp; &nbsp; 0 1000M &nbsp; 0% /proc/scsi  
tmpfs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 1000M &nbsp; &nbsp; 0 1000M &nbsp; 0% /sys/firmware  
root@nginx-nfs-pv-87c776f67-984bq:/# ls /opt/  
hello.txt  
root@nginx-nfs-pv-87c776f67-984bq:/# cat /opt/hello.txt  
software  
root@nginx-nfs-pv-87c776f67-984bq:/#

