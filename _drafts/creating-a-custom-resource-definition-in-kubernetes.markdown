---
layout: post
title: Creating a custom resource definition in Kubernetes
---

asdfdsaf

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ vim crd.yaml

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get crd
    No resources found.
    vikki@drona-child-1:~$ kubectl create -f crd.yaml 
    customresourcedefinition.apiextensions.k8s.io/crontabs.testing.vikki.in created
    vikki@drona-child-1:~$ kubectl get crd
    NAME CREATED AT
    crontabs.testing.vikki.in 2018-10-02T09:00:18Z
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl describe crd crontabs.testing.vikki.in 
    Name: crontabs.testing.vikki.in
    Namespace:    
    Labels: <none>
    Annotations: <none>
    API Version: apiextensions.k8s.io/v1beta1
    Kind: CustomResourceDefinition
    Metadata:
      Creation Timestamp: 2018-10-02T09:00:18Z
      Generation: 1
      Resource Version: 82668
      Self Link: /apis/apiextensions.k8s.io/v1beta1/customresourcedefinitions/crontabs.testing.vikki.in
      UID: 95d6ee5d-c621-11e8-8539-080027165f06
    Spec:
      Additional Printer Columns:
        JSON Path: .metadata.creationTimestamp
        Description: CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.
    
    Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
        Name: Age
        Type: date
      Group: testing.vikki.in
      Names:
        Kind: CronTab
        List Kind: CronTabList
        Plural: crontabs
        Short Names:
          ct
        Singular: crontab
      Scope: Cluster
      Version: v1
      Versions:
        Name: v1
        Served: true
        Storage: true
    Status:
      Accepted Names:
        Kind: CronTab
        List Kind: CronTabList
        Plural: crontabs
        Short Names:
          ct
        Singular: crontab
      Conditions:
        Last Transition Time: 2018-10-02T09:00:18Z
        Message: no conflicts found
        Reason: NoConflicts
        Status: True
        Type: NamesAccepted
        Last Transition Time: <nil>
        Message: the initial names have been accepted
        Reason: InitialNamesAccepted
        Status: True
        Type: Established
      Stored Versions:
        v1
    Events: <none>
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ vik new-crontab.yaml

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl create -f new-crontab.yaml 
    crontab.testing.vikki.in/new-cron-object created
    vikki@drona-child-1:~$ kubectl get Crontab
    NAME AGE
    new-cron-object 13s
    vikki@drona-child-1:~$ kubectl get ct
    NAME AGE
    new-cron-object 20s
    vikki@drona-child-1:~$ kubectl describe ct
    Name: new-cron-object
    Namespace:    
    Labels: <none>
    Annotations: <none>
    API Version: testing.vikki.in/v1
    Kind: CronTab
    Metadata:
      Creation Timestamp: 2018-10-02T09:04:04Z
      Generation: 1
      Resource Version: 82952
      Self Link: /apis/testing.vikki.in/v1/crontabs/new-cron-object
      UID: 1c95727f-c622-11e8-8539-080027165f06
    Spec:
      Cron Spec: */5 * * * *
      Image: some-cron-image
    Events: <none>
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl delete -f crd.yaml 
    customresourcedefinition.apiextensions.k8s.io "crontabs.testing.vikki.in" deleted
    vikki@drona-child-1:~$ kubectl get ct
    error: the server doesn't have a resource type "ct"
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->