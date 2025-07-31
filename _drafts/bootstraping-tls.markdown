---
layout: post
title: Bootstraping TLS
---

Download kubectl

<!--kg-card-begin: code-->

    vikki@kubernetes1:~$ curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl % Total % Received % Xferd Average Speed Time Time Time Current
                                     Dload Upload Total Spent Left Speed
    100 44.5M 100 44.5M 0 0 3954k 0 0:00:11 0:00:11 --:--:-- 4111k
    vikki@kubernetes1:~$ chmod +x ./kubectl
    vikki@kubernetes1:~$ sudo mv ./kubectl /usr/local/bin/kubectl
    vikki@kubernetes1:~$ kubectl version
    Client Version: version.Info{Major:"1", Minor:"16", GitVersion:"v1.16.3", GitCommit:"b3cbbae08ec52a7fc73d334838e18d17e8512749", GitTreeState:"clean", BuildDate:"2019-11-13T11:23:11Z", GoVersion:"go1.12.12", Compiler:"gc", Platform:"linux/amd64"}
    The connection to the server localhost:8080 was refused - did you specify the right host or port?
    vikki@kubernetes1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ sudo apt-get install bash-completion
    Reading package lists... Done
    Building dependency tree       
    Reading state information... Done
    bash-completion is already the newest version (1:2.1-4.2ubuntu1.1).
    0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
    vikki@kubernetes1:~$ type _init_completion
    
    
    vikki@kubernetes1:~$ sudo kubectl completion bash >/tmp/kubectl
    
    vikki@kubernetes1:~$ sudo cp /tmp/kubectl /etc/bash_completion.d/.

<!--kg-card-end: code-->

CA certicates

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out ca.key 2048
    Generating RSA private key, 2048 bit long modulus
    ......................................+++
    ......................................................................+++
    e is 65537 (0x10001)
    vikki@kubernetes1:~/keys$ openssl req -new -key ca.key -subj "/CN=KUBERNETES-CA" -out ca.csr
    vikki@kubernetes1:~/keys$ openssl x509 -req -in ca.csr -signkey ca.key -CAcreateserial -out ca.crt -days 1000
    Signature ok
    subject=/CN=KUBERNETES-CA
    Getting Private key
    vikki@kubernetes1:~/keys$ ls
    ca.crt ca.csr ca.key

<!--kg-card-end: code-->

Admin user certificates

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out admin.key 2048
    Generating RSA private key, 2048 bit long modulus
    ........+++
    .+++
    e is 65537 (0x10001)
    
    vikki@kubernetes1:~/keys$ openssl req -new -key admin.key -subj "/CN=admin/O=system:masters" -out admin.csr
    
    vikki@kubernetes1:~/keys$ openssl x509 -req -in admin.csr -CAkey ca.key -CA ca.crt -CAcreateserial -out admin.crt -days 1000
    Signature ok
    subject=/CN=admin/O=system:masters
    Getting CA Private Key

<!--kg-card-end: code-->

Kube-controller-manager client certificate

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out kube-controller-manager.key 2048
    Generating RSA private key, 2048 bit long modulus
    ................+++
    .............................................+++
    e is 65537 (0x10001)
    
    vikki@kubernetes1:~/keys$ openssl req -new -key kube-controller-manager.key -subj "/CN=system:kube-controller-manager" -out kube-controller-manager.csr
    
    vikki@kubernetes1:~/keys$ openssl x509 -req -in kube-controller-manager.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out kube-controller-manager.crt -days 1000
    Signature ok
    subject=/CN=system:kube-controller-manager
    Getting CA Private Key

<!--kg-card-end: code-->

Kube-proxy client certficate

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out kube-proxy.key 2048
    Generating RSA private key, 2048 bit long modulus
    .............................................+++
    ...+++
    e is 65537 (0x10001)
    
    vikki@kubernetes1:~/keys$ openssl req -new -key kube-proxy.key -subj "/CN=system:kube-proxy" -out kube-proxy.csr
    
    vikki@kubernetes1:~/keys$ openssl x509 -req -in kube-proxy.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out kube-proxy.crt -days 1000
    Signature ok
    subject=/CN=system:kube-proxy
    Getting CA Private Key

<!--kg-card-end: code-->

Kube-scheduler client certificate

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out kube-scheduler.key 2048
    Generating RSA private key, 2048 bit long modulus
    ................................+++
    .........................+++
    e is 65537 (0x10001)
    
    vikki@kubernetes1:~/keys$ openssl req -new -key kube-scheduler.key -subj "/CN=system:kube-scheduler" -out kube-scheduler.csr
          
    vikki@kubernetes1:~/keys$ openssl x509 -req -in kube-scheduler.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out kube-scheduler.crt -days 1000
    Signature ok
    subject=/CN=system:kube-scheduler
    Getting CA Private Key

<!--kg-card-end: code-->

Kube-apiserver server certificate

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ vim kube-apiserver.conf 

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/6c3e4bac05d0aa902aaf10d5879341a1.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out kube-apiserver.key 2048
    Generating RSA private key, 2048 bit long modulus
    ..............................+++
    ...........+++
    e is 65537 (0x10001)
    
    vikki@kubernetes1:~/keys$ openssl req -new -key kube-apiserver.key -subj "/CN=kube-apiserver" -out kube-apiserver.csr -config kube-apiserver.conf
    
    vikki@kubernetes1:~/keys$ openssl x509 -req -in kube-apiserver.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out kube-apiserver.crt -days 1000 -extfile kube-apiserver.conf -extensions req_ext
    Signature ok
    subject=/C=IN/ST=Karnataka/L=Bangalore/O=Vikki/OU=Vikki/CN=10.0.0.1
    Getting CA Private Key

<!--kg-card-end: code-->

etcd-server server certificate

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ vim etcd.conf

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/9851f6787a484337da573dabdcbe3206.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out etcd-server.key 2040
    Generating RSA private key, 2040 bit long modulus
    .........................................................................+++
    ...................................................................................................................................................................................................+++
    e is 65537 (0x10001)
    
    
    vikki@kubernetes1:~/keys$ openssl req -new -key etcd-server.key -subj "/CN=etcd-server" -out etcd-server.csr -config etcd.conf 
    
    vikki@kubernetes1:~/keys$ openssl x509 -req -in etcd-server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out etcd-server.crt -days 1000 -extensions req_ext -extfile etcd.conf 
    Signature ok
    subject=/CN=etcd-server
    Getting CA Private Key

<!--kg-card-end: code-->

service-account certificate

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out service-account.key 2048
    Generating RSA private key, 2048 bit long modulus
    .....+++
    ....................+++
    e is 65537 (0x10001)
    
    vikki@kubernetes1:~/keys$ openssl req -new -key service-account.key -subj "/CN=service-account" -out service-account.csr 
    
    vikki@kubernetes1:~/keys$ openssl x509 -req -in service-account.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out service-account.crt -days 1000
    Signature ok
    subject=/CN=service-account
    Getting CA Private Key

<!--kg-card-end: code-->

worker node certificate

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ vim kubernetes2.conf

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/882927b52aa9a7dffa02ad698c1881c4.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ openssl genrsa -out kubernetes2.key 2048
    Generating RSA private key, 2048 bit long modulus
    ........................................+++
    ..............................................+++
    e is 65537 (0x10001)
    
    vikki@kubernetes1:~/keys$ openssl req -new -key kubernetes2.key -subj "/CN=system:node:kubernetes2/O=system:nodes" -out kubernetes2.csr -config kubernetes2.conf 
    vikki@kubernetes1:~/keys$ openssl x509 -req -in kubernetes2.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out kubernetes2.crt -days 100 -extensions req_ext -extfile kubernetes2.conf 
    Signature ok
    subject=/CN=system:node:kubernetes2/O=system:nodes
    Getting CA Private Key
    

<!--kg-card-end: code-->

Creating kubeconfig files

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ cd ..
    vikki@kubernetes1:~$ mkdir config

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-proxy.kubeconfig set-cluster kubernetes-cluster --server=https://10.0.0.1:6443 --certificate-authority=keys/ca.crt --embed-certs=true
    Cluster "kubernetes-cluster" set.
    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-proxy.kubeconfig set-credentials kube-proxy --client-certificate=keys/kube-proxy.crt --client-key=keys/kube-proxy.key --embed-certs=true
    User "kube-proxy" set.
    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-proxy.kubeconfig set-context default --cluster=kubernetes-cluster --user=system:kube-proxy
    Context "default" created.
    vikki@kubernetes1:~$ 
    vikki@kubernetes1:~$ kubectl config use-context default --kubeconfig=config/kube-proxy.kubeconfig 
    Switched to context "default".
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-controller-manager.kubeconfig set-cluster kubernetes-cluster --server=https://127.0.0.1:6443 --certificate-authority=keys/ca.crt --embed-certs=true
    Cluster "kubernetes-cluster" set.
    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-controller-manager.kubeconfig set-credentials system:kube-controller-manager --client-certificate=keys/kube-controller-manager.crt --client-key=keys/kube-controller-manager.key 
    User "system:kube-controller-manager" set.
    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-controller-manager.kubeconfig set-context default --cluster=kubernetes-cluster --user=system:kube-controller-manager
    Context "default" created.
    vikki@kubernetes1:~$ kubectl config use-context default --kubeconfig=config/kube-controller-manager.kubeconfig 
    Switched to context "default".
    vikki@kubernetes1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-scheduler.kubeconfig set-cluster kubernetes-cluster --server=https://127.0.0.1:6443 --certificate-authority=keys/ca.crt --embed-certs=true
    Cluster "kubernetes-cluster" set.
    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-scheduler.kubeconfig set-credentials system:kube-scheduler --client-certificate=keys/kube-scheduler.crt --client-key=keys/kube-scheduler.key --embed-certs=true
    User "system:kube-scheduler" set.
    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/kube-scheduler.kubeconfig set-context default --cluster=kubernetes-cluster --user=system:kube-scheduler
    Context "default" created.
    vikki@kubernetes1:~$ kubectl config use-context default --kubeconfig=config/kube-scheduler.kubeconfig 
    Switched to context "default".
    vikki@kubernetes1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/admin.kubeconfig set-cluster kubernetes-cluster --server=https://127.0.0.1:6443 --certificate-authority=keys/ca.crt --embed-certs=trueCluster "kubernetes-cluster" set.
    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/admin.kubeconfig set-credentials admin --client-certificate=keys/admin.crt --client-key=keys/admin.key --embed-certs=true
    User "admin" set.
    vikki@kubernetes1:~$ kubectl config --kubeconfig=config/admin.kubeconfig set-context default --cluster=kubernetes-cluster --user=admin 
    Context "default" created.
    vikki@kubernetes1:~$ kubectl config use-context default --kubeconfig=config/admin.kubeconfig 
    Switched to context "default".
    vikki@kubernetes1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/keys$ kubectl config --kubeconfig=../config/kubernetes2.kubeconfig set-cluster kubernetes-cluster --server=https://10.0.0.1:6443 --certificate-authority=ca.crt --embed-certs=true
    Cluster "kubernetes-cluster" set.
    vikki@kubernetes1:~/keys$ kubectl config --kubeconfig=../config/kubernetes2.kubeconfig set-credentials system:node:kubernetes2 --client-certificate=kubernetes2.crt --client-key=kubernetes2.key --embed-certs=true
    User "system:node:kubernetes2" set.
    vikki@kubernetes1:~/keys$ kubectl config --kubeconfig=../config/kubernetes2.kubeconfig set-context default --cluster=kubernetes-cluster --user=system:node:kubernetes2 
    Context "default" created.
    vikki@kubernetes1:~/keys$ kubectl config use-context default --kubeconfig=../config/kubernetes2.kubeconfig 
    Switched to context "default".

<!--kg-card-end: code-->

Creating encryption config

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes$ head -c 32 /dev/urandom | base64
    /WfVaHN7BB6Qj3h3GkXVvr92EaaPaPI7+yFuYaev/OE=
    vikki@kubernetes1:~/extract/kubernetes$ vim ~/config/encryption-config.yaml

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/95b7d331a310c8c29003de25583eb8cc.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ mkdir extract
    vikki@kubernetes1:~$ cd extract/
    vikki@kubernetes1:~/extract$ wget shortlinks.vikki.in/etcd
    --2019-11-30 15:15:46-- http://shortlinks.vikki.in/etcd
    Resolving shortlinks.vikki.in (shortlinks.vikki.in)... 172.217.166.51, 2404:6800:4009:80d::2013
    Connecting to shortlinks.vikki.in (shortlinks.vikki.in)|172.217.166.51|:80... connected.
    HTTP request sent, awaiting response... 302 Found
    Location: https://github.com/vignesh88/blog/raw/master/kubernetes/etcd/etcd-v3.2.28-linux-amd64.tar.gz [following]
    --2019-11-30 15:15:47-- https://github.com/vignesh88/blog/raw/master/kubernetes/etcd/etcd-v3.2.28-linux-amd64.tar.gz
    Resolving github.com (github.com)... 52.74.223.119
    Connecting to github.com (github.com)|52.74.223.119|:443... connected.
    HTTP request sent, awaiting response... 302 Found
    Location: https://raw.githubusercontent.com/vignesh88/blog/master/kubernetes/etcd/etcd-v3.2.28-linux-amd64.tar.gz [following]
    --2019-11-30 15:15:48-- https://raw.githubusercontent.com/vignesh88/blog/master/kubernetes/etcd/etcd-v3.2.28-linux-amd64.tar.gz
    Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 151.101.76.133
    Connecting to raw.githubusercontent.com (raw.githubusercontent.com)|151.101.76.133|:443... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 10529149 (10M) [application/octet-stream]
    Saving to: ‘etcd’
    
    etcd 100%[=====================================================================================================>] 10.04M 3.48MB/s in 2.9s    
    
    2019-11-30 15:15:53 (3.48 MB/s) - ‘etcd’ saved [10529149/10529149]

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract$ tar -xvf etcd
    etcd-v3.2.28-linux-amd64/
    etcd-v3.2.28-linux-amd64/etcdctl
    etcd-v3.2.28-linux-amd64/etcd
    etcd-v3.2.28-linux-amd64/README-etcdctl.md
    etcd-v3.2.28-linux-amd64/README.md
    etcd-v3.2.28-linux-amd64/Documentation/
    etcd-v3.2.28-linux-amd64/Documentation/faq.md
    etcd-v3.2.28-linux-amd64/Documentation/tuning.md
    etcd-v3.2.28-linux-amd64/Documentation/dl_build.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/etcd-2-2-0-rc-benchmarks.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/etcd-3-demo-benchmarks.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/etcd-storage-memory-benchmark.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/_index.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/README.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/etcd-2-1-0-alpha-benchmarks.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/etcd-2-2-0-rc-memory-benchmarks.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/etcd-2-2-0-benchmarks.md
    etcd-v3.2.28-linux-amd64/Documentation/benchmarks/etcd-3-watch-memory-benchmark.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/security.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/authentication.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/recovery.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/container.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/supported-platform.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/monitoring.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/clustering.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/etcd3_alert.rules
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/grafana.json
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/_index.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/versioning.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/maintenance.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/gateway.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/runtime-configuration.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/performance.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/v2-migration.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/configuration.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/etcd-sample-grafana.png
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/hardware.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/grpc_proxy.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/runtime-reconf-design.md
    etcd-v3.2.28-linux-amd64/Documentation/op-guide/failures.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/api_concurrency_reference_v3.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/experimental_apis.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/api_grpc_gateway.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/_index.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/interacting_v3.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/grpc_naming.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/local_cluster.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/api_reference_v3.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/limit.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/apispec/
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/apispec/swagger/
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/apispec/swagger/v3lock.swagger.json
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/apispec/swagger/rpc.swagger.json
    etcd-v3.2.28-linux-amd64/Documentation/dev-guide/apispec/swagger/v3election.swagger.json
    etcd-v3.2.28-linux-amd64/Documentation/_index.md
    etcd-v3.2.28-linux-amd64/Documentation/README.md
    etcd-v3.2.28-linux-amd64/Documentation/upgrades/
    etcd-v3.2.28-linux-amd64/Documentation/upgrades/upgrade_3_2.md
    etcd-v3.2.28-linux-amd64/Documentation/upgrades/upgrade_3_1.md
    etcd-v3.2.28-linux-amd64/Documentation/upgrades/upgrading-etcd.md
    etcd-v3.2.28-linux-amd64/Documentation/upgrades/_index.md
    etcd-v3.2.28-linux-amd64/Documentation/upgrades/upgrade_3_4.md
    etcd-v3.2.28-linux-amd64/Documentation/upgrades/upgrade_3_0.md
    etcd-v3.2.28-linux-amd64/Documentation/upgrades/upgrade_3_3.md
    etcd-v3.2.28-linux-amd64/Documentation/reporting_bugs.md
    etcd-v3.2.28-linux-amd64/Documentation/production-users.md
    etcd-v3.2.28-linux-amd64/Documentation/branch_management.md
    etcd-v3.2.28-linux-amd64/Documentation/platforms/
    etcd-v3.2.28-linux-amd64/Documentation/platforms/aws.md
    etcd-v3.2.28-linux-amd64/Documentation/platforms/_index.md
    etcd-v3.2.28-linux-amd64/Documentation/platforms/freebsd.md
    etcd-v3.2.28-linux-amd64/Documentation/platforms/container-linux-systemd.md
    etcd-v3.2.28-linux-amd64/Documentation/demo.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-internal/
    etcd-v3.2.28-linux-amd64/Documentation/dev-internal/logging.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-internal/discovery_protocol.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-internal/_index.md
    etcd-v3.2.28-linux-amd64/Documentation/dev-internal/release.md
    etcd-v3.2.28-linux-amd64/Documentation/learning/
    etcd-v3.2.28-linux-amd64/Documentation/learning/api_guarantees.md
    etcd-v3.2.28-linux-amd64/Documentation/learning/glossary.md
    etcd-v3.2.28-linux-amd64/Documentation/learning/why.md
    etcd-v3.2.28-linux-amd64/Documentation/learning/auth_design.md
    etcd-v3.2.28-linux-amd64/Documentation/learning/data_model.md
    etcd-v3.2.28-linux-amd64/Documentation/learning/api.md
    etcd-v3.2.28-linux-amd64/Documentation/docs.md
    etcd-v3.2.28-linux-amd64/Documentation/integrations.md
    etcd-v3.2.28-linux-amd64/Documentation/rfc/
    etcd-v3.2.28-linux-amd64/Documentation/rfc/_index.md
    etcd-v3.2.28-linux-amd64/Documentation/rfc/v3api.md
    etcd-v3.2.28-linux-amd64/Documentation/metrics.md
    etcd-v3.2.28-linux-amd64/READMEv2-etcdctl.md
    vikki@kubernetes1:~/extract$ ls
    etcd etcd-v3.2.28-linux-amd64
    vikki@kubernetes1:~/extract$ cd etcd-v3.2.28-linux-amd64/
    vikki@kubernetes1:~/extract/etcd-v3.2.28-linux-amd64$ ls
    Documentation etcd etcdctl README-etcdctl.md README.md READMEv2-etcdctl.md

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/etcd-v3.2.28-linux-amd64$ sudo cp etcd* /usr/local/bin/
    vikki@kubernetes1:~/extract/etcd-v3.2.28-linux-amd64$ sudo mkdir -p /etc/etcd /var/lib/etcd

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/etcd-v3.2.28-linux-amd64$ cd
    vikki@kubernetes1:~$ sudo cp keys/ca.crt /etc/etcd/
    vikki@kubernetes1:~$ sudo cp keys/etcd-server.key /etc/etcd/
    vikki@kubernetes1:~$ sudo cp keys/etcd-server.crt /etc/etcd/
    vikki@kubernetes1:~$ sudo vim /etc/systemd/system/etcd.service

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ sudo vim /etc/systemd/system/etcd.service

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/26d1ecf209a90ed6d046d27e76da7ffa.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ sudo systemctl enable etcd
    Created symlink from /etc/systemd/system/multi-user.target.wants/etcd.service to /etc/systemd/system/etcd.service.
    vikki@kubernetes1:~$ sudo systemctl restart etcd

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ sudo ETCDCTL_API=3 etcdctl member list --endpoints=https://10.0.0.1:2379 --cacert=/etc/etcd/ca.crt --cert=/etc/etcd/etcd-server.crt --key=/etc/etcd/etcd-server.key
    ab49ae925e7be22f, started, kubernetes1, https://10.0.0.1:2380, https://10.0.0.1:2379

<!--kg-card-end: code-->

Bootstrapping kubernetes control planes

<!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract$ wget https://dl.k8s.io/v1.16.0/kubernetes-server-linux-amd64.tar.gz
    --2019-11-30 18:02:02-- https://dl.k8s.io/v1.16.0/kubernetes-server-linux-amd64.tar.gz
    Resolving dl.k8s.io (dl.k8s.io)... 35.201.71.162
    Connecting to dl.k8s.io (dl.k8s.io)|35.201.71.162|:443... connected.
    HTTP request sent, awaiting response... 302 Moved Temporarily
    Location: https://storage.googleapis.com/kubernetes-release/release/v1.16.0/kubernetes-server-linux-amd64.tar.gz [following]
    --2019-11-30 18:02:03-- https://storage.googleapis.com/kubernetes-release/release/v1.16.0/kubernetes-server-linux-amd64.tar.gz
    Resolving storage.googleapis.com (storage.googleapis.com)... 172.217.167.176, 2404:6800:4009:80c::2010
    Connecting to storage.googleapis.com (storage.googleapis.com)|172.217.167.176|:443... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 397204651 (379M) [application/x-tar]
    Saving to: ‘kubernetes-server-linux-amd64.tar.gz’
    
    kubernetes-server-linux-amd64.tar.gz 100%[=====================================================================================================>] 378.80M 4.12MB/s in 95s     
    
    2019-11-30 18:03:39 (4.01 MB/s) - ‘kubernetes-server-linux-amd64.tar.gz’ saved [397204651/397204651]

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract$ tar -xvf kubernetes-server-linux-amd64.tar.gz 
    kubernetes/
    kubernetes/server/
    kubernetes/server/bin/
    kubernetes/server/bin/kube-scheduler.tar
    kubernetes/server/bin/mounter
    kubernetes/server/bin/kube-scheduler.docker_tag
    kubernetes/server/bin/kubeadm
    kubernetes/server/bin/kube-controller-manager.docker_tag
    kubernetes/server/bin/hyperkube
    kubernetes/server/bin/kube-apiserver.docker_tag
    kubernetes/server/bin/kube-apiserver
    kubernetes/server/bin/kubectl
    kubernetes/server/bin/kube-proxy.docker_tag
    kubernetes/server/bin/kube-apiserver.tar
    kubernetes/server/bin/kube-proxy.tar
    kubernetes/server/bin/kubelet
    kubernetes/server/bin/apiextensions-apiserver
    kubernetes/server/bin/kube-controller-manager.tar
    kubernetes/server/bin/kube-proxy
    kubernetes/server/bin/kube-scheduler
    kubernetes/server/bin/kube-controller-manager
    kubernetes/kubernetes-src.tar.gz
    kubernetes/LICENSES
    kubernetes/addons/

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract$ ls
    etcd etcd-v3.2.28-linux-amd64 kubernetes kubernetes-server-linux-amd64.tar.gz
    vikki@kubernetes1:~/extract$ cd kubernetes/
    vikki@kubernetes1:~/extract/kubernetes$ ls
    addons kubernetes-src.tar.gz LICENSES server
    vikki@kubernetes1:~/extract/kubernetes$ cd server/
    vikki@kubernetes1:~/extract/kubernetes/server$ ls
    bin
    vikki@kubernetes1:~/extract/kubernetes/server$ cd bin/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ ls
    apiextensions-apiserver kube-apiserver kube-controller-manager kubectl kube-proxy.docker_tag kube-scheduler.docker_tag
    hyperkube kube-apiserver.docker_tag kube-controller-manager.docker_tag kubelet kube-proxy.tar kube-scheduler.tar
    kubeadm kube-apiserver.tar kube-controller-manager.tar kube-proxy kube-scheduler mounter

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp kube-apiserver /usr/local/bin/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp kube-controller-manager /usr/local/bin/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp kube-scheduler /usr/local/bin/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp kubectl /usr/local/bin/

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo mkdir -p /var/lib/kubernetes

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp ~/keys/ca.crt /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp ~/keys/ca.key /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp ~/keys/kube-apiserver.crt /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp ~/keys/kube-apiserver.key /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp ~/keys/service-account.key /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp ~/keys/service-account.crt /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp ~/keys/etcd-server.key /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes/server/bin$ sudo cp ~/keys/etcd-server.crt /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes$ sudo cp ~/config/encryption-config.yaml /var/lib/kubernetes/
    vikki@kubernetes1:~/extract/kubernetes$ sudo cp ~/config/kube-scheduler.kubeconfig /var/lib/kubernetes/
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes$ sudo vim /etc/systemd/system/kube-apiserver.service

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/a97095762fd4bbc482eef5e1f8367df2.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes$ sudo systemctl daemon-reload
    vikki@kubernetes1:~/extract/kubernetes$ sudo systemctl enable kube-apiserver
    Created symlink from /etc/systemd/system/multi-user.target.wants/kube-apiserver.service to /etc/systemd/system/kube-apiserver.service.
    vikki@kubernetes1:~/extract/kubernetes$ sudo systemctl start kube-apiserver

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes$ sudo vim /etc/systemd/system/kube-controller-manager.service

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/c761b0652b68aac9c7aca0d67d67d7dc.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes$ sudo systemctl daemon-reload
    vikki@kubernetes1:~/extract/kubernetes$ sudo systemctl start kube-controller-manager.service

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes$ sudo vim /etc/systemd/system/kube-scheduler.service

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/6605ec3ce173383ec3d1082ff0cb4aa0.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~/extract/kubernetes$ sudo systemctl daemon-reload
    vikki@kubernetes1:~/extract/kubernetes$ sudo systemctl start kube-scheduler.service

<!--kg-card-end: code-->

Bootstrapping the kubernetes worknode

<!--kg-card-begin: code-->

    vikki@kubernetes1:~$ scp keys/ca.crt kubernetes2:keys/.
    ca.crt 100% 989 1.0KB/s 00:00    
    vikki@kubernetes1:~$ scp keys/kubernetes2.crt kubernetes2:keys/.
    kubernetes2.crt 100% 1086 1.1KB/s 00:00    
    vikki@kubernetes1:~$ scp keys/kubernetes2.key kubernetes2:keys/.
    kubernetes2.key 100% 1675 1.6KB/s 00:00    
    vikki@kubernetes1:~$ scp config/kubernetes2.kubeconfig kubernetes2:config/.
    kubernetes2.kubeconfig 100% 5390 5.3KB/s 00:00    
    vikki@kubernetes1:~$ 
    vikki@kubernetes1:~$ scp config/kube-proxy.kubeconfig kubernetes2:config/.
    kube-proxy.kubeconfig 100% 5247 5.1KB/s 00:00    
    vikki@kubernetes1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes2:~$ mkdir extracts
    vikki@kubernetes2:~$ cd extracts/
    vikki@kubernetes2:~/extracts$ wget https://dl.k8s.io/v1.16.0/kubernetes-node-linux-amd64.tar.gz
    --2019-11-30 19:10:48-- https://dl.k8s.io/v1.16.0/kubernetes-node-linux-amd64.tar.gz
    Resolving dl.k8s.io (dl.k8s.io)... 35.201.71.162
    Connecting to dl.k8s.io (dl.k8s.io)|35.201.71.162|:443... connected.
    HTTP request sent, awaiting response... 302 Moved Temporarily
    Location: https://storage.googleapis.com/kubernetes-release/release/v1.16.0/kubernetes-node-linux-amd64.tar.gz [following]
    --2019-11-30 19:10:48-- https://storage.googleapis.com/kubernetes-release/release/v1.16.0/kubernetes-node-linux-amd64.tar.gz
    Resolving storage.googleapis.com (storage.googleapis.com)... 172.217.166.48, 2404:6800:4009:80d::2010
    Connecting to storage.googleapis.com (storage.googleapis.com)|172.217.166.48|:443... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 101990064 (97M) [application/x-tar]
    Saving to: ‘kubernetes-node-linux-amd64.tar.gz’
    
    kubernetes-node-linux-amd64.tar.gz 100%[=====================================================================================================================>] 97.26M 4.13MB/s in 24s     
    
    2019-11-30 19:11:13 (4.00 MB/s) - ‘kubernetes-node-linux-amd64.tar.gz’ saved [101990064/101990064]

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes2:~/extracts$ ls
    kubernetes-node-linux-amd64.tar.gz
    vikki@kubernetes2:~/extracts$ tar -xvf kubernetes-node-linux-amd64.tar.gz 
    kubernetes/
    kubernetes/kubernetes-src.tar.gz
    kubernetes/LICENSES
    kubernetes/node/
    kubernetes/node/bin/
    kubernetes/node/bin/kubeadm
    kubernetes/node/bin/kubectl
    kubernetes/node/bin/kubelet
    kubernetes/node/bin/kube-proxy
    vikki@kubernetes2:~/extracts$ cd kubernetes/
    vikki@kubernetes2:~/extracts/kubernetes$ ls
    kubernetes-src.tar.gz LICENSES node
    vikki@kubernetes2:~/extracts/kubernetes$ cd node/bin/
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ ls
    kubeadm kubectl kubelet kube-proxy

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo mkdir -p /etc/cni/net.d /opt/cni/bin /var/lib/kubelet /var/lib/kube-proxy /var/lib/kubernetes /var/run/kubernetes
    [sudo] password for vikki: 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo cp kubectl /usr/local/bin/
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo cp kube-proxy /usr/local/bin/
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo cp kubelet /usr/local/bin/
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo cp ~/keys/kubernetes2.key /var/lib/kubelet/
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo cp ~/keys/kubernetes2.crt /var/lib/kubelet/
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo cp ~/config/kubernetes2.kubeconfig /var/lib/kubelet/kubeconfig
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo cp ~/keys/ca.crt /var/lib/kubernetes/
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo cp ~/config/kube-proxy.kubeconfig /var/lib/kube-proxy/kubeconfig
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo vim /var/lib/kubelet/kubelet-config.yaml

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/b3fe578beae785291e4741d0901086a8.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo vim /etc/systemd/system/kubelet.service

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/813d15d4fa0a908e571147b0ec2fee44.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo vim /var/lib/kube-proxy/kube-proxy-config.yaml

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/116ca2516a6d1e2ed4fbb6f3a245d35c.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo vim /etc/systemd/system/kube-proxy.service

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/085c020e08b2143e8f8dbd55e3cbb06e.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo systemctl daemon-reload
    vikki@kubernetes2:~/extracts/kubernetes/node/bin$ sudo systemctl restart kube-proxy.service kubelet.service 
    vikki@kubernetes2:~$ sudo systemctl enable kubelet.service kube-proxy.service 
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl get nodes --kubeconfig=config/admin.kubeconfig 
    NAME STATUS ROLES AGE VERSION
    kubernetes2 NotReady <none> 49s v1.16.0
    vikki@kubernetes1:~$ 

<!--kg-card-end: code-->

TLS bootstrapping worker node

<!--kg-card-begin: code-->

    vikki@kubernetes1:~$ scp keys/ca.crt kubernetes3:keys/.
    ca.crt 100% 989 1.0KB/s 00:00 
    vikki@kubernetes1:~$ scp config/kube-proxy.kubeconfig kubernetes3:config/.
    kube-proxy.kubeconfig 100% 5247 5.1KB/s 00:00 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ vim config/bootstrap-token.yaml

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/7105fa45fa7c5d774c4bfad951f9c242.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl create -f config/bootstrap-token.yaml 
    secret/bootstrap-token-07401b created
    vikki@kubernetes1:~$ kubectl get secrets 
    NAME TYPE DATA AGE
    default-token-7ttc9 kubernetes.io/service-account-token 3 172m

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ vim config/autorize-create-csr.yaml

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/d25bc89e3b55a4d223fdb24866a5c8c7.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl create -f config/autorize-create-csr.yaml 
    clusterrolebinding.rbac.authorization.k8s.io/create-csrs-for-bootstrapping created

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ vim config/autorize-approve-csr.yaml

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/96f5d6f109598c630f3294589e4023f2.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl create -f config/autorize-approve-csr.yaml 
    clusterrolebinding.rbac.authorization.k8s.io/auto-approve-csrs-for-group created

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ vim config/autorize-autorenew.yaml 

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/96e2cbe506c501c45cfec0a7aff35f53.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl create -f config/autorize-autorenew.yaml 
    clusterrolebinding.rbac.authorization.k8s.io/auto-approve-renewals-for-nodes created

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes3:~$ mkdir extract
    vikki@kubernetes3:~$ cd extract/
    vikki@kubernetes3:~/extract$ wget https://dl.k8s.io/v1.16.0/kubernetes-node-linux-amd64.tar.gz
    vikki@kubernetes3:~/extract$ wget https://dl.k8s.io/v1.16.0/kubernetes-node-linux-amd64.tar.gz
    --2019-11-30 21:17:42-- https://dl.k8s.io/v1.16.0/kubernetes-node-linux-amd64.tar.gz
    Resolving dl.k8s.io (dl.k8s.io)... 35.201.71.162
    Connecting to dl.k8s.io (dl.k8s.io)|35.201.71.162|:443... connected.
    HTTP request sent, awaiting response... 302 Moved Temporarily
    Location: https://storage.googleapis.com/kubernetes-release/release/v1.16.0/kubernetes-node-linux-amd64.tar.gz [following]
    --2019-11-30 21:17:43-- https://storage.googleapis.com/kubernetes-release/release/v1.16.0/kubernetes-node-linux-amd64.tar.gz
    Resolving storage.googleapis.com (storage.googleapis.com)... 216.58.203.144, 2404:6800:4009:80b::2010
    Connecting to storage.googleapis.com (storage.googleapis.com)|216.58.203.144|:443... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 101990064 (97M) [application/x-tar]
    Saving to: ‘kubernetes-node-linux-amd64.tar.gz’
    
    kubernetes-node-linux-amd64.tar.gz 100%[=====================================================================================================================>] 97.26M 3.83MB/s in 24s     
    
    2019-11-30 21:18:07 (4.03 MB/s) - ‘kubernetes-node-linux-amd64.tar.gz’ saved [101990064/101990064]

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract$ tar -xvf kubernetes-node-linux-amd64.tar.gz 
    kubernetes/
    kubernetes/kubernetes-src.tar.gz
    kubernetes/LICENSES
    kubernetes/node/
    kubernetes/node/bin/
    kubernetes/node/bin/kubeadm
    kubernetes/node/bin/kubectl
    kubernetes/node/bin/kubelet
    kubernetes/node/bin/kube-proxy

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract$ sudo mkdir -p /etc/cni/net.d /opt/cni/bin /var/lib/kubelet /var/lib/kube-proxy /var/lib/kubernetes /var/run/kubernetes

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo cp ../bin/{kubectl,kube-proxy,kubelet} /usr/local/bin/
    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo cp ~/keys/ca.crt /var/lib/kubernetes/
    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo cp ~/config/kube-proxy.kubeconfig /var/lib/kube-proxy/kubeconfig
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo vim /var/lib/kubelet/bootstrap-kubeconfig

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/9b91c76587391e9fcc523f4489d6d1ac.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo vim /var/lib/kube-proxy/kube-proxy-config.yaml

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/116ca2516a6d1e2ed4fbb6f3a245d35c.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo vim /etc/systemd/system/kube-proxy.service

<!--kg-card-end: code--><!--kg-card-begin: html--><script src="https://gist.github.com/vignesh88/085c020e08b2143e8f8dbd55e3cbb06e.js"></script><!--kg-card-end: html--><!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo systemctl daemon-reload
    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo systemctl start kubelet kube-proxy
    vikki@kubernetes3:~/extract/kubernetes/node/bin$ sudo systemctl enable kubelet kube-proxy
    Created symlink from /etc/systemd/system/multi-user.target.wants/kubelet.service to /etc/systemd/system/kubelet.service.
    Created symlink from /etc/systemd/system/multi-user.target.wants/kube-proxy.service to /etc/systemd/system/kube-proxy.service.
    vikki@kubernetes3:~/extract/kubernetes/node/bin$ 
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl get csr
    NAME AGE REQUESTOR CONDITION
    csr-5d7dd 23s system:node:kubernetes3 Pending
    csr-ds4sf 17s system:node:kubernetes3 Pending
    csr-gc58b 27s system:bootstrap:07401b Approved,Issued
    vikki@kubernetes1:~$ kubectl certificate approve csr-5d7dd
    certificatesigningrequest.certificates.k8s.io/csr-5d7dd approved

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl get nodes
    NAME STATUS ROLES AGE VERSION
    kubernetes2 NotReady <none> 102m v1.16.0
    kubernetes3 NotReady <none> 70s v1.16.0

<!--kg-card-end: code-->

<!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract$ wget https://github.com/containernetworking/plugins/releases/download/v0.7.5/cni-plugins-amd64-v0.7.5.tgz
    --2019-11-30 22:37:38-- https://github.com/containernetworking/plugins/releases/download/v0.7.5/cni-plugins-amd64-v0.7.5.tgz
    Resolving github.com (github.com)... 13.250.177.223
    Connecting to github.com (github.com)|13.250.177.223|:443... connected.
    HTTP request sent, awaiting response... 302 Found
    Location: https://github-production-release-asset-2e65be.s3.amazonaws.com/84575398/131b7380-4751-11e9-8db3-7b96b6a634f3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20191130%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20191130T170738Z&X-Amz-Expires=300&X-Amz-Signature=344395a62d981bf7a829f2a5bb27d5d97c2295d2160919ea90c098bec30f508d&X-Amz-SignedHeaders=host&actor_id=0&response-content-disposition=attachment%3B%20filename%3Dcni-plugins-amd64-v0.7.5.tgz&response-content-type=application%2Foctet-stream [following]
    --2019-11-30 22:37:38-- https://github-production-release-asset-2e65be.s3.amazonaws.com/84575398/131b7380-4751-11e9-8db3-7b96b6a634f3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20191130%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20191130T170738Z&X-Amz-Expires=300&X-Amz-Signature=344395a62d981bf7a829f2a5bb27d5d97c2295d2160919ea90c098bec30f508d&X-Amz-SignedHeaders=host&actor_id=0&response-content-disposition=attachment%3B%20filename%3Dcni-plugins-amd64-v0.7.5.tgz&response-content-type=application%2Foctet-stream
    Resolving github-production-release-asset-2e65be.s3.amazonaws.com (github-production-release-asset-2e65be.s3.amazonaws.com)... 52.217.45.108
    Connecting to github-production-release-asset-2e65be.s3.amazonaws.com (github-production-release-asset-2e65be.s3.amazonaws.com)|52.217.45.108|:443... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 17109361 (16M) [application/octet-stream]
    Saving to: ‘cni-plugins-amd64-v0.7.5.tgz’
    
    cni-plugins-amd64-v0.7.5.tgz 100%[=====================================================================================================================>] 16.32M 619KB/s in 23s     
    
    2019-11-30 22:38:03 (725 KB/s) - ‘cni-plugins-amd64-v0.7.5.tgz’ saved [17109361/17109361]

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes3:~/extract$ sudo tar -xvf cni-plugins-amd64-v0.7.5.tgz --directory /opt/cni/bin/
    ./
    ./flannel
    ./ptp
    ./host-local
    ./portmap
    ./tuning
    ./vlan
    ./host-device
    ./sample
    ./dhcp
    ./ipvlan
    ./macvlan
    ./loopback
    ./bridge

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl apply -f https://docs.projectcalico.org/v3.8/manifests/calico.yaml
    configmap/calico-config created
    customresourcedefinition.apiextensions.k8s.io/felixconfigurations.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/ipamblocks.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/blockaffinities.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/ipamhandles.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/ipamconfigs.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/bgppeers.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/bgpconfigurations.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/ippools.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/hostendpoints.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/clusterinformations.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/globalnetworkpolicies.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/globalnetworksets.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/networkpolicies.crd.projectcalico.org created
    customresourcedefinition.apiextensions.k8s.io/networksets.crd.projectcalico.org created
    clusterrole.rbac.authorization.k8s.io/calico-kube-controllers created
    clusterrolebinding.rbac.authorization.k8s.io/calico-kube-controllers created
    clusterrole.rbac.authorization.k8s.io/calico-node created
    clusterrolebinding.rbac.authorization.k8s.io/calico-node created
    daemonset.apps/calico-node created
    serviceaccount/calico-node created
    deployment.apps/calico-kube-controllers created
    serviceaccount/calico-kube-controllers created

<!--kg-card-end: code-->

<!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl get pods --namespace=kube-system 
    NAME READY STATUS RESTARTS AGE
    calico-kube-controllers-55754f75c-mr9wx 0/1 ContainerCreating 0 10m
    calico-node-r4rkl 0/1 Running 6 10m
    calico-node-v6vf5 0/1 Running 6 10m
    vikki@kubernetes1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@kubernetes1:~$ kubectl get nodes
    NAME STATUS ROLES AGE VERSION
    kubernetes2 Ready <none> 162m v1.16.0
    kubernetes3 Ready <none> 60m v1.16.0

<!--kg-card-end: code-->