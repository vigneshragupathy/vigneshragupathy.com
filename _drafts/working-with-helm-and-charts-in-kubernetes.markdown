---
layout: post
title: Working with Helm and charts in Kubernetes
---

sdfsadfsdaf

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ wget goo.gl/nbEcHn
    --2018-10-02 14:38:31-- http://goo.gl/nbEcHn
    Resolving goo.gl (goo.gl)... 172.217.163.110, 2404:6800:4007:80d::200e
    Connecting to goo.gl (goo.gl)|172.217.163.110|:80... connected.
    HTTP request sent, awaiting response... 301 Moved Permanently
    Location: https://storage.googleapis.com/kubernetes-helm/helm-v2.7.0-linux-amd64.tar.gz [following]
    --2018-10-02 14:38:31-- https://storage.googleapis.com/kubernetes-helm/helm-v2.7.0-linux-amd64.tar.gz
    Resolving storage.googleapis.com (storage.googleapis.com)... 216.58.197.80, 2404:6800:4007:808::2010
    Connecting to storage.googleapis.com (storage.googleapis.com)|216.58.197.80|:443... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 12169373 (12M) [application/x-tar]
    Saving to: ‘nbEcHn’
    
    nbEcHn 100%[=====================================================================================================================>] 11.61M 4.85MB/s in 2.4s    
    
    2018-10-02 14:38:35 (4.85 MB/s) - ‘nbEcHn’ saved [12169373/12169373]
    

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ tar -xvf nbEcHn
    linux-amd64/
    linux-amd64/README.md
    linux-amd64/helm
    linux-amd64/LICENSE
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ sudo cp linux-amd64/helm /usr/local/bin/
    [sudo] password for vikki: 
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

Due to new RBAC configuration helm is unable to run in the default namespace, in this version of Kubernetes. During  
initialization you could choose to create and declare a new namespace.

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create serviceaccount --namespace=kube-system tiller
    serviceaccount/tiller created
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

Bind the serviceaccount to the admin role called cluster-admin inside the kube-system namespace.

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create clusterrolebinding tiller-cluster-role --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
    clusterrolebinding.rbac.authorization.k8s.io/tiller-cluster-role created
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

Initialize helm

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ helm init
    Creating /home/vikki/.helm 
    Creating /home/vikki/.helm/repository 
    Creating /home/vikki/.helm/repository/cache 
    Creating /home/vikki/.helm/repository/local 
    Creating /home/vikki/.helm/plugins 
    Creating /home/vikki/.helm/starters 
    Creating /home/vikki/.helm/cache/archive 
    Creating /home/vikki/.helm/repository/repositories.yaml 
    Adding stable repo with URL: https://kubernetes-charts.storage.googleapis.com 
    Adding local repo with URL: http://127.0.0.1:8879/charts 
    $HELM_HOME has been configured at /home/vikki/.helm.
    
    Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.
    Happy Helming!
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl describe deployments tiller-deploy -n kube-system |grep "Service Account:"
      Service Account:  
    vikki@drona-child-1:~$ kubectl -n kube-system patch deployments tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
    deployment.extensions/tiller-deploy patched
    vikki@drona-child-1:~$ kubectl describe deployments tiller-deploy -n kube-system |grep "Service Account:"
      Service Account: tiller

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get pods -n kube-system
    NAME READY STATUS RESTARTS AGE
    coredns-78fcdf6894-7bsns 0/1 Evicted 0 36d
    coredns-78fcdf6894-phj5j 0/1 Evicted 0 36d
    coredns-78fcdf6894-vb2pk 1/1 Running 1 1h
    coredns-78fcdf6894-z5599 1/1 Running 1 1h
    etcd-drona-child-1 1/1 Running 3 36d
    kube-apiserver-drona-child-1 1/1 Running 1 36d
    kube-controller-manager-drona-child-1 1/1 Running 2 36d
    kube-flannel-ds-amd64-54xd9 1/1 Running 1 1h
    kube-flannel-ds-amd64-qgxrd 1/1 Running 17 36d
    kube-proxy-2ch2w 1/1 Running 13 36d
    kube-proxy-qwgq5 1/1 Running 7 36d
    kube-scheduler-drona-child-1 1/1 Running 3 36d
    kubernetes-dashboard-6948bdb78-zzjqq 1/1 Running 2 36d
    tiller-deploy-58c4d6d4f7-pbjxh 1/1 Running 0 2m
    vikki@drona-child-1:~$ kubectl -n kube-system logs tiller-deploy-58c4d6d4f7-pbjxh
    [main] 2018/10/02 09:17:39 Starting Tiller v2.7.0 (tls=false)
    [main] 2018/10/02 09:17:39 GRPC listening on :44134
    [main] 2018/10/02 09:17:39 Probes listening on :44135
    [main] 2018/10/02 09:17:39 Storage driver is ConfigMap
    [main] 2018/10/02 09:17:39 Max history per release is 0
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ helm home
    /home/vikki/.helm
    vikki@drona-child-1:~$ ls /home/vikki/.helm
    cache plugins repository starters
    vikki@drona-child-1:~$ ls /home/vikki/.helm/cache/
    archive
    vikki@drona-child-1:~$ helm version
    Client: &version.Version{SemVer:"v2.7.0", GitCommit:"08c1144f5eb3e3b636d9775617287cc26e53dba4", GitTreeState:"clean"}
    Server: &version.Version{SemVer:"v2.7.0", GitCommit:"08c1144f5eb3e3b636d9775617287cc26e53dba4", GitTreeState:"clean"}
    vikki@drona-child-1:~$ helm init --upgrade
    $HELM_HOME has been configured at /home/vikki/.helm.
    
    Tiller (the Helm server-side component) has been upgraded to the current version.
    Happy Helming!
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ helm search database
    NAME VERSION	DESCRIPTION                                       
    stable/cockroachdb 1.2.6 CockroachDB is a scalable, survivable, strongly...
    stable/dokuwiki 3.0.2 DokuWiki is a standards-compliant, simple to us...
    stable/janusgraph 0.2.0 Open source, scalable graph database.             
    stable/kubedb 0.1.3 DEPRECATED KubeDB by AppsCode - Making running ...
    stable/mariadb 5.0.6 Fast, reliable, scalable, and easy to use open-...
    stable/mediawiki 4.0.3 Extremely powerful, scalable software and a fea...
    stable/mongodb 4.3.8 NoSQL document-oriented database that stores JS...
    stable/mongodb-replicaset 3.5.7 NoSQL document-oriented database that stores JS...
    stable/mysql 0.10.1 Fast, reliable, scalable, and easy to use open-...
    stable/mysqldump 1.0.0 A Helm chart to help backup MySQL databases usi...
    stable/neo4j 0.8.0 Neo4j is the world's leading graph database       
    stable/postgresql 0.18.1 Object-relational database management system (O...
    stable/prometheus 7.1.3 Prometheus is a monitoring system and time seri...
    stable/rethinkdb 0.1.4 The open-source database for the realtime web     
    stable/hazelcast 1.0.1 Hazelcast IMDG is the most widely used in-memor...
    stable/influxdb 0.11.0 Scalable datastore for metrics, events, and rea...
    stable/percona 0.3.2 free, fully compatible, enhanced, open source d...
    stable/percona-xtradb-cluster	0.2.0 free, fully compatible, enhanced, open source d...
    stable/redis 4.1.1 Open source, advanced key-value store. It is of...
    stable/redis-ha 2.2.3 Highly available Redis cluster with multiple se...

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ helm --debug install stable/mariadb --set master.persistence.enabled=false --set slave.persistence.enabled=false
    [debug] Created tunnel using local port: '46525'
    
    [debug] SERVER: "localhost:46525"
    
    [debug] Original chart version: ""
    [debug] Fetched stable/mariadb to /home/vikki/.helm/cache/archive/mariadb-5.0.6.tgz
    
    [debug] CHART PATH: /home/vikki/.helm/cache/archive/mariadb-5.0.6.tgz
    
    NAME: lumbering-quoll
    REVISION: 1
    RELEASED: Tue Oct 2 14:53:09 2018
    CHART: mariadb-5.0.6
    USER-SUPPLIED VALUES:
    master:
      persistence:
        enabled: false
    slave:
      persistence:
        enabled: false
    
    COMPUTED VALUES:
    db:
      forcePassword: false
      name: my_database
      password: null
      user: null
    image:
      pullPolicy: IfNotPresent
      registry: docker.io
      repository: bitnami/mariadb
      tag: 10.1.36-debian-9
    master:
      affinity: {}
      antiAffinity: soft
      config: |-
        [mysqld]
        skip-name-resolve
        explicit_defaults_for_timestamp
        basedir=/opt/bitnami/mariadb
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        tmpdir=/opt/bitnami/mariadb/tmp
        max_allowed_packet=16M
        bind-address=0.0.0.0
        pid-file=/opt/bitnami/mariadb/tmp/mysqld.pid
        log-error=/opt/bitnami/mariadb/logs/mysqld.log
        character-set-server=UTF8
        collation-server=utf8_general_ci
    
        [client]
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        default-character-set=UTF8
    
        [manager]
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        pid-file=/opt/bitnami/mariadb/tmp/mysqld.pid
      livenessProbe:
        enabled: true
        failureThreshold: 3
        initialDelaySeconds: 120
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      persistence:
        accessModes:
        - ReadWriteOnce
        annotations: null
        enabled: false
        size: 8Gi
      readinessProbe:
        enabled: true
        failureThreshold: 3
        initialDelaySeconds: 30
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      resources: {}
      tolerations: []
    metrics:
      annotations:
        prometheus.io/port: "9104"
        prometheus.io/scrape: "true"
      enabled: false
      image:
        pullPolicy: IfNotPresent
        registry: docker.io
        repository: prom/mysqld-exporter
        tag: v0.10.0
      resources: {}
    replication:
      enabled: true
      forcePassword: false
      password: null
      user: replicator
    rootUser:
      forcePassword: false
      password: null
    service:
      port: 3306
      type: ClusterIP
    slave:
      affinity: {}
      antiAffinity: soft
      config: |-
        [mysqld]
        skip-name-resolve
        explicit_defaults_for_timestamp
        basedir=/opt/bitnami/mariadb
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        tmpdir=/opt/bitnami/mariadb/tmp
        max_allowed_packet=16M
        bind-address=0.0.0.0
        pid-file=/opt/bitnami/mariadb/tmp/mysqld.pid
        log-error=/opt/bitnami/mariadb/logs/mysqld.log
        character-set-server=UTF8
        collation-server=utf8_general_ci
    
        [client]
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        default-character-set=UTF8
    
        [manager]
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        pid-file=/opt/bitnami/mariadb/tmp/mysqld.pid
      livenessProbe:
        enabled: true
        failureThreshold: 3
        initialDelaySeconds: 120
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      persistence:
        accessModes:
        - ReadWriteOnce
        annotations: null
        enabled: false
        size: 8Gi
      readinessProbe:
        enabled: true
        failureThreshold: 3
        initialDelaySeconds: 45
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      replicas: 1
      resources: {}
      tolerations: []
    
    HOOKS:
    ---
    # lumbering-quoll-mariadb-test-uq5x1
    apiVersion: v1
    kind: Pod
    metadata:
      name: "lumbering-quoll-mariadb-test-uq5x1"
      annotations:
        "helm.sh/hook": test-success
    spec:
      initContainers:
        - name: "test-framework"
          image: "dduportal/bats:0.4.0"
          command:
            - "bash"
            - "-c"
            - |
              set -ex
              # copy bats to tools dir
              cp -R /usr/local/libexec/ /tools/bats/
          volumeMounts:
          - mountPath: /tools
            name: tools
      containers:
        - name: mariadb-test
          image: "docker.io/bitnami/mariadb:10.1.36-debian-9"
          imagePullPolicy: "IfNotPresent"
          command: ["/tools/bats/bats", "-t", "/tests/run.sh"]
          env:
            - name: MARIADB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: lumbering-quoll-mariadb
                  key: mariadb-root-password
          volumeMounts:
          - mountPath: /tests
            name: tests
            readOnly: true
          - mountPath: /tools
            name: tools
      volumes:
      - name: tests
        configMap:
          name: lumbering-quoll-mariadb-tests
      - name: tools
        emptyDir: {}
      restartPolicy: Never
    MANIFEST:
    
    ---
    # Source: mariadb/templates/secrets.yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: lumbering-quoll-mariadb
      labels:
        app: "mariadb"
        chart: mariadb-5.0.6
        release: "lumbering-quoll"
        heritage: "Tiller"
    type: Opaque
    data:
      mariadb-root-password: "U3VqS0NMWGRqVA=="
      
      mariadb-replication-password: "U25lazBuc1R0aQ=="
    ---
    # Source: mariadb/templates/initialization-configmap.yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: lumbering-quoll-mariadb-master-init-scripts
      labels:
        app: mariadb
        component: "master"
        chart: mariadb-5.0.6
        release: "lumbering-quoll"
        heritage: "Tiller"
    data:
      README.md: |-
        You can copy here your custom .sh, .sql or .sql.gz file so they are executed during the first boot of the image.
      
        More info in the [bitnami-docker-mariadb](https://github.com/bitnami/bitnami-docker-mariadb#initializing-a-new-instance) repository.
    ---
    # Source: mariadb/templates/master-configmap.yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: lumbering-quoll-mariadb-master
      labels:
        app: mariadb
        component: "master"
        chart: mariadb-5.0.6
        release: "lumbering-quoll"
        heritage: "Tiller"
    data:
      my.cnf: |-
        [mysqld]
        skip-name-resolve
        explicit_defaults_for_timestamp
        basedir=/opt/bitnami/mariadb
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        tmpdir=/opt/bitnami/mariadb/tmp
        max_allowed_packet=16M
        bind-address=0.0.0.0
        pid-file=/opt/bitnami/mariadb/tmp/mysqld.pid
        log-error=/opt/bitnami/mariadb/logs/mysqld.log
        character-set-server=UTF8
        collation-server=utf8_general_ci
        
        [client]
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        default-character-set=UTF8
        
        [manager]
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        pid-file=/opt/bitnami/mariadb/tmp/mysqld.pid
    ---
    # Source: mariadb/templates/slave-configmap.yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: lumbering-quoll-mariadb-slave
      labels:
        app: mariadb
        component: "slave"
        chart: mariadb-5.0.6
        release: "lumbering-quoll"
        heritage: "Tiller"
    data:
      my.cnf: |-
        [mysqld]
        skip-name-resolve
        explicit_defaults_for_timestamp
        basedir=/opt/bitnami/mariadb
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        tmpdir=/opt/bitnami/mariadb/tmp
        max_allowed_packet=16M
        bind-address=0.0.0.0
        pid-file=/opt/bitnami/mariadb/tmp/mysqld.pid
        log-error=/opt/bitnami/mariadb/logs/mysqld.log
        character-set-server=UTF8
        collation-server=utf8_general_ci
        
        [client]
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        default-character-set=UTF8
        
        [manager]
        port=3306
        socket=/opt/bitnami/mariadb/tmp/mysql.sock
        pid-file=/opt/bitnami/mariadb/tmp/mysqld.pid
    ---
    # Source: mariadb/templates/tests.yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: lumbering-quoll-mariadb-tests
    data:
      run.sh: |-
        @test "Testing MariaDB is accessible" {
          mysql -h lumbering-quoll-mariadb -uroot -p$MARIADB_ROOT_PASSWORD -e 'show databases;'
        }
    ---
    # Source: mariadb/templates/master-svc.yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: lumbering-quoll-mariadb
      labels:
        app: "mariadb"
        component: "master"
        chart: mariadb-5.0.6
        release: "lumbering-quoll"
        heritage: "Tiller"
    spec:
      type: ClusterIP
      ports:
      - name: mysql
        port: 3306
        targetPort: mysql
      selector:
        app: "mariadb"
        component: "master"
        release: "lumbering-quoll"
    ---
    # Source: mariadb/templates/slave-svc.yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: lumbering-quoll-mariadb-slave
      labels:
        app: "mariadb"
        chart: mariadb-5.0.6
        component: "slave"
        release: "lumbering-quoll"
        heritage: "Tiller"
    spec:
      type: ClusterIP
      ports:
      - name: mysql
        port: 3306
        targetPort: mysql
      selector:
        app: "mariadb"
        component: "slave"
        release: "lumbering-quoll"
    ---
    # Source: mariadb/templates/master-statefulset.yaml
    apiVersion: apps/v1beta1
    kind: StatefulSet
    metadata:
      name: lumbering-quoll-mariadb-master
      labels:
        app: "mariadb"
        chart: mariadb-5.0.6
        component: "master"
        release: "lumbering-quoll"
        heritage: "Tiller"
    spec:
      selector:
        matchLabels:
          release: "lumbering-quoll"
          component: "master"
          app: mariadb
      serviceName: "lumbering-quoll-mariadb-master"
      replicas: 1
      updateStrategy:
        type: RollingUpdate
      template:
        metadata:
          labels:
            app: "mariadb"
            component: "master"
            release: "lumbering-quoll"
            chart: mariadb-5.0.6
        spec:
          securityContext:
            runAsUser: 1001
            fsGroup: 1001
          affinity:
            podAntiAffinity:
              preferredDuringSchedulingIgnoredDuringExecution:
              - weight: 1
                podAffinityTerm:
                  topologyKey: kubernetes.io/hostname
                  labelSelector:
                    matchLabels:
                      app: "mariadb"
                      release: "lumbering-quoll"
          containers:
          - name: "mariadb"
            image: docker.io/bitnami/mariadb:10.1.36-debian-9
            imagePullPolicy: "IfNotPresent"
            env:
            - name: MARIADB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: lumbering-quoll-mariadb
                  key: mariadb-root-password
            - name: MARIADB_DATABASE
              value: "my_database"
            - name: MARIADB_REPLICATION_MODE
              value: "master"
            - name: MARIADB_REPLICATION_USER
              value: "replicator"
            - name: MARIADB_REPLICATION_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: lumbering-quoll-mariadb
                  key: mariadb-replication-password
            ports:
            - name: mysql
              containerPort: 3306
            livenessProbe:
              exec:
                command: ["sh", "-c", "exec mysqladmin status -uroot -p$MARIADB_ROOT_PASSWORD"]
              initialDelaySeconds: 120
              periodSeconds: 10
              timeoutSeconds: 1
              successThreshold: 1
              failureThreshold: 3
            readinessProbe:
              exec:
                command: ["sh", "-c", "exec mysqladmin status -uroot -p$MARIADB_ROOT_PASSWORD"]
              initialDelaySeconds: 30
              periodSeconds: 10
              timeoutSeconds: 1
              successThreshold: 1
              failureThreshold: 3
            resources:
              {}
              
            volumeMounts:
            - name: data
              mountPath: /bitnami/mariadb
            - name: custom-init-scripts
              mountPath: /docker-entrypoint-initdb.d
            - name: config
              mountPath: /opt/bitnami/mariadb/conf/my.cnf
              subPath: my.cnf
          volumes:
            - name: config
              configMap:
                name: lumbering-quoll-mariadb-master
            - name: custom-init-scripts
              configMap:
                name: lumbering-quoll-mariadb-master-init-scripts
            - name: "data"
              emptyDir: {}
    ---
    # Source: mariadb/templates/slave-statefulset.yaml
    apiVersion: apps/v1beta1
    kind: StatefulSet
    metadata:
      name: lumbering-quoll-mariadb-slave
      labels:
        app: "mariadb"
        chart: mariadb-5.0.6
        component: "slave"
        release: "lumbering-quoll"
        heritage: "Tiller"
    spec:
      selector:
        matchLabels:
          release: "lumbering-quoll"
          component: "slave"
          app: mariadb
      serviceName: "lumbering-quoll-mariadb-slave"
      replicas: 1
      updateStrategy:
        type: RollingUpdate
      template:
        metadata:
          labels:
            app: "mariadb"
            component: "slave"
            release: "lumbering-quoll"
            chart: mariadb-5.0.6
        spec:
          securityContext:
            runAsUser: 1001
            fsGroup: 1001
          affinity:
            podAntiAffinity:
              preferredDuringSchedulingIgnoredDuringExecution:
              - weight: 1
                podAffinityTerm:
                  topologyKey: kubernetes.io/hostname
                  labelSelector:
                    matchLabels:
                      app: "mariadb"
                      release: "lumbering-quoll"
          containers:
          - name: "mariadb"
            image: docker.io/bitnami/mariadb:10.1.36-debian-9
            imagePullPolicy: "IfNotPresent"
            env:
            - name: MARIADB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: lumbering-quoll-mariadb
                  key: mariadb-root-password
            - name: MARIADB_DATABASE
              value: "my_database"
            - name: MARIADB_REPLICATION_MODE
              value: "slave"
            - name: MARIADB_MASTER_HOST
              value: lumbering-quoll-mariadb
            - name: MARIADB_MASTER_PORT_NUMBER
              value: "3306"
            - name: MARIADB_MASTER_ROOT_USER
              value: "root"
            - name: MARIADB_MASTER_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: lumbering-quoll-mariadb
                  key: mariadb-root-password
            - name: MARIADB_REPLICATION_USER
              value: "replicator"
            - name: MARIADB_REPLICATION_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: lumbering-quoll-mariadb
                  key: mariadb-replication-password
            ports:
            - name: mysql
              containerPort: 3306
            livenessProbe:
              exec:
                command: ["sh", "-c", "exec mysqladmin status -uroot -p$MARIADB_ROOT_PASSWORD"]
              initialDelaySeconds: 120
              periodSeconds: 10
              timeoutSeconds: 1
              successThreshold: 1
              failureThreshold: 3
            readinessProbe:
              exec:
                command: ["sh", "-c", "exec mysqladmin status -uroot -p$MARIADB_ROOT_PASSWORD"]
              initialDelaySeconds: 45
              periodSeconds: 10
              timeoutSeconds: 1
              successThreshold: 1
              failureThreshold: 3
            resources:
              {}
              
            volumeMounts:
            - name: data
              mountPath: /bitnami/mariadb
            - name: config
              mountPath: /opt/bitnami/mariadb/conf/my.cnf
              subPath: my.cnf
          volumes:
            - name: config
              configMap:
                name: lumbering-quoll-mariadb-slave
            - name: "data"
              emptyDir: {}
    LAST DEPLOYED: Tue Oct 2 14:53:09 2018
    NAMESPACE: default
    STATUS: DEPLOYED
    
    RESOURCES:
    ==> v1/Secret
    NAME TYPE DATA AGE
    lumbering-quoll-mariadb Opaque 2 1s
    
    ==> v1/ConfigMap
    NAME DATA AGE
    lumbering-quoll-mariadb-master-init-scripts 1 1s
    lumbering-quoll-mariadb-master 1 1s
    lumbering-quoll-mariadb-slave 1 1s
    lumbering-quoll-mariadb-tests 1 1s
    
    ==> v1/Service
    NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
    lumbering-quoll-mariadb ClusterIP 10.100.219.117 <none> 3306/TCP 1s
    lumbering-quoll-mariadb-slave ClusterIP 10.106.9.181 <none> 3306/TCP 1s
    
    ==> v1beta1/StatefulSet
    NAME DESIRED CURRENT AGE
    lumbering-quoll-mariadb-master 1 1 1s
    lumbering-quoll-mariadb-slave 1 1 1s
    
    
    NOTES:
    
    Please be patient while the chart is being deployed
    
    Tip:
    
      Watch the deployment status using the command: kubectl get pods -w --namespace default -l release=lumbering-quoll
    
    Services:
    
      echo Master: lumbering-quoll-mariadb.default.svc.cluster.local:3306
      echo Slave: lumbering-quoll-mariadb-slave.default.svc.cluster.local:3306
    
    Administrator credentials:
    
      Username: root
      Password : $(kubectl get secret --namespace default lumbering-quoll-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
    
    To connect to your database:
    
      1. Run a pod that you can use as a client:
    
          kubectl run lumbering-quoll-mariadb-client --rm --tty -i --image docker.io/bitnami/mariadb:10.1.36-debian-9 --namespace default --command -- bash
    
      2. To connect to master service (read/write):
    
          mysql -h lumbering-quoll-mariadb.default.svc.cluster.local -uroot -p my_database
    
      3. To connect to slave service (read-only):
    
          mysql -h lumbering-quoll-mariadb-slave.default.svc.cluster.local -uroot -p my_database
    
    To upgrade this helm chart:
    
      1. Obtain the password as described on the 'Administrator credentials' section and set the 'rootUser.password' parameter as shown below:
    
          ROOT_PASSWORD=$(kubectl get secret --namespace default lumbering-quoll-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
          helm upgrade lumbering-quoll stable/mariadb --set rootUser.password=$ROOT_PASSWORD

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get secret -n default lumbering-quoll-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode
    SujKCLXdjT

<!--kg-card-end: code--><!--kg-card-begin: code-->

    [root@drona-child-3 ~]# docker exec -it k8s_mariadb_lumbering-quoll-mariadb-master-0_default_c7bad0e1-c624-11e8-8539-080027165f06_0 bash
    I have no name!@lumbering-quoll-mariadb-master-0:/$ 
    I have no name!@lumbering-quoll-mariadb-master-0:/$ ip a
    bash: ip: command not found
    I have no name!@lumbering-quoll-mariadb-master-0:/$ mysql -h localhost -uroot -p
    Enter password: 
    Welcome to the MariaDB monitor. Commands end with ; or \g.
    Your MariaDB connection id is 578
    Server version: 10.1.36-MariaDB Source distribution
    
    Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.
    
    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    
    MariaDB [(none)]> show databases;
    +--------------------+
    | Database |
    +--------------------+
    | information_schema |
    | my_database |
    | mysql |
    | performance_schema |
    | test |
    +--------------------+
    5 rows in set (0.00 sec)
    
    MariaDB [(none)]> \q
    Bye
    I have no name!@lumbering-quoll-mariadb-master-0:/$ exit
    exit

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ helm list -a
    NAME REVISION	UPDATED STATUS CHART NAMESPACE
    lumbering-quoll	1 Tue Oct 2 14:53:09 2018	DEPLOYED	mariadb-5.0.6	default  
    vikki@drona-child-1:~$ helm delete lumbering-quoll
    release "lumbering-quoll" deleted
    vikki@drona-child-1:~$ helm repo add stable http://storage.googleapis.com/kubernetes-charts
    "stable" has been added to your repositories
    vikki@drona-child-1:~$ helm search
    NAME VERSION	DESCRIPTION                                       
    stable/acs-engine-autoscaler 2.2.0 Scales worker nodes within agent pools            
    stable/aerospike 0.1.7 A Helm chart for Aerospike in Kubernetes          
    stable/anchore-engine 0.2.3 Anchore container analysis and policy evaluatio...
    stable/apm-server 0.1.0 The server receives data from the Elastic APM a...
    stable/ark 1.2.1 A Helm chart for ark ........................           
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->