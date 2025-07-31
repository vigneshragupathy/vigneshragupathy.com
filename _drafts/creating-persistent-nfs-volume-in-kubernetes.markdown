---
layout: post
title: config maps
---

asdfsdafsd  
Kubernetes volume, unlike container volume has a lifetime of pod and not limited to container.

ConfigMap is a set of key-value pair. The ConfigMap is similar to secrets expect it is not encoded with base64 byte.

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ mkdir primary
    vikki@drona-child-1:~$ echo c > primary/cyan
    vikki@drona-child-1:~$ echo m > primary/magenta
    vikki@drona-child-1:~$ echo y > primary/yellow
    vikki@drona-child-1:~$ echo k > primary/black
    vikki@drona-child-1:~$ echo "known as key" >> primary/black 
    vikki@drona-child-1:~$ echo blue > favorite
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create configmap colors --from-literal=text=black --from-file=./favorite --from-file=./primary/
    configmap/colors created
    vikki@drona-child-1:~$ 
    vikki@drona-child-1:~$ kubectl get configmaps colors 
    NAME DATA AGE
    colors 6 26s
    vikki@drona-child-1:~$ kubectl get configmaps colors -o yaml 
    apiVersion: v1
    data:
      black: |
        k
        known as key
      cyan: |
        c
      favorite: |
        blue
      magenta: |
        m
      text: black
      yellow: |
        y
    kind: ConfigMap
    metadata:
      creationTimestamp: 2018-09-30T06:45:31Z
      name: colors
      namespace: default
      resourceVersion: "45148"
      selfLink: /api/v1/namespaces/default/configmaps/colors
      uid: 6ccb87f1-c47c-11e8-ad73-080027165f06
    vikki@drona-child-1:~$ 
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ vim simpleshell.yaml 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create -f simpleshell.yaml 
    pod/shell-demo created
    vikki@drona-child-1:~$ kubectl get pods
    NAME READY STATUS RESTARTS AGE
    busybox 0/1 Error 0 23h
    daemon-set-vikki-roll-update-d4gjg 1/1 Running 1 17h
    nginx-6f858d4d45-6zr5f 1/1 Running 3 34d
    shell-demo 0/1 ContainerCreating 0 5s
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    [root@drona-child-3 ~]# docker exec -it k8s_nginx_shell-demo_default_12e02444-c47d-11e8-ad73-080027165f06_0 bash
    root@shell-demo:/# env
    HOSTNAME=shell-demo
    NJS_VERSION=1.15.4.0.2.4-1~stretch
    NGINX_VERSION=1.15.4-1~stretch
    NGINX_PORT_80_TCP=tcp://10.106.108.131:80
    KUBERNETES_PORT_443_TCP_PROTO=tcp
    KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
    NGINX_PORT=tcp://10.106.108.131:80
    KUBERNETES_PORT=tcp://10.96.0.1:443
    PWD=/
    HOME=/root
    NGINX_SERVICE_PORT=80
    KUBERNETES_SERVICE_PORT_HTTPS=443
    KUBERNETES_PORT_443_TCP_PORT=443
    NGINX_PORT_80_TCP_ADDR=10.106.108.131
    NGINX_PORT_80_TCP_PORT=80
    KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
    TERM=xterm
    NGINX_PORT_80_TCP_PROTO=tcp
    SHLVL=1
    KUBERNETES_SERVICE_PORT=443
    ilike=blue
    
    PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    KUBERNETES_SERVICE_HOST=10.96.0.1
    NGINX_SERVICE_HOST=10.106.108.131
    _=/usr/bin/env
    root@shell-demo:/# 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ vim simpleshell.yaml 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create -f simpleshell.yaml 
    pod/shell-demo created
    vikki@drona-child-1:~$ kubectl get pods
    NAME READY STATUS RESTARTS AGE
    busybox 0/1 Error 0 1d
    daemon-set-vikki-roll-update-d4gjg 1/1 Running 1 17h
    nginx-6f858d4d45-6zr5f 1/1 Running 3 34d
    shell-demo 1/1 Running 0 28s
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    [root@drona-child-3 ~]# docker exec -it k8s_nginx_shell-demo_default_19655dfb-c47f-11e8-ad73-080027165f06_0 bash
    root@shell-demo:/# env
    HOSTNAME=shell-demo
    NJS_VERSION=1.15.4.0.2.4-1~stretch
    NGINX_VERSION=1.15.4-1~stretch
    black=k
    known as key
    
    favorite=blue
    
    NGINX_PORT_80_TCP=tcp://10.106.108.131:80
    KUBERNETES_PORT_443_TCP_PROTO=tcp
    KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
    NGINX_PORT=tcp://10.106.108.131:80
    text=black
    KUBERNETES_PORT=tcp://10.96.0.1:443
    PWD=/
    HOME=/root
    NGINX_SERVICE_PORT=80
    KUBERNETES_SERVICE_PORT_HTTPS=443
    KUBERNETES_PORT_443_TCP_PORT=443
    NGINX_PORT_80_TCP_ADDR=10.106.108.131
    NGINX_PORT_80_TCP_PORT=80
    KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
    yellow=y
    
    magenta=m
    
    TERM=xterm
    NGINX_PORT_80_TCP_PROTO=tcp
    SHLVL=1
    KUBERNETES_SERVICE_PORT=443
    cyan=c
    
    PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    KUBERNETES_SERVICE_HOST=10.96.0.1
    NGINX_SERVICE_HOST=10.106.108.131
    _=/usr/bin/env
    root@shell-demo:/# 

<!--kg-card-end: code-->

**ConfigMap from Yaml**

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ vim car-map.yaml
    vikki@drona-child-1:~$ kubectl get configmaps 
    NAME DATA AGE
    colors 6 23m
    vikki@drona-child-1:~$ kubectl create -f car-map.yaml 
    configmap/fast-car created
    vikki@drona-child-1:~$ kubectl get configmaps 
    NAME DATA AGE
    colors 6 23m
    fast-car 3 2s
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ vim simpleshell.yaml 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get pods
    NAME READY STATUS RESTARTS AGE
    busybox 0/1 Error 0 1d
    daemon-set-vikki-roll-update-d4gjg 1/1 Running 1 18h
    nginx-6f858d4d45-6zr5f 1/1 Running 3 34d
    shell-demo 1/1 Running 0 7m
    vikki@drona-child-1:~$ kubectl delete pods shell-demo 
    pod "shell-demo" deleted
    vikki@drona-child-1:~$ kubectl create -f simpleshell.yaml 
    pod/shell-demo created
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    [root@drona-child-3 ~]# docker exec -it k8s_nginx_shell-demo_default_61bc27ec-c480-11e8-ad73-080027165f06_0 bash
    root@shell-demo:/# df -h
    Filesystem Size Used Avail Use% Mounted on
    overlay 6.2G 4.1G 2.2G 66% /
    tmpfs 1000M 0 1000M 0% /dev
    tmpfs 1000M 0 1000M 0% /sys/fs/cgroup
    /dev/mapper/centos-root 6.2G 4.1G 2.2G 66% /etc/cars
    shm 64M 0 64M 0% /dev/shm
    tmpfs 1000M 12K 1000M 1% /run/secrets/kubernetes.io/serviceaccount
    tmpfs 1000M 0 1000M 0% /proc/acpi
    tmpfs 1000M 0 1000M 0% /proc/scsi
    tmpfs 1000M 0 1000M 0% /sys/firmware
    root@shell-demo:/# ls /etc/cars/
    car.make car.model car.trim
    root@shell-demo:/# cat /etc/cars/car.* 
    FordMustangShelbyroot@shell-demo:/# 

<!--kg-card-end: code-->