---
layout: post
title: Restful API access in Kubernetes
---

We can use **curl** to make API request to the cluster in secure manner.  
First we need to know the IP Address and Port of the API server. This information we can get from the config view

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl config view
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: REDACTED
        server: https://160.0.0.1:6443
      name: kubernetes
    contexts:
    - context:
        cluster: kubernetes
        user: kubernetes-admin
      name: kubernetes-admin@kubernetes
    current-context: kubernetes-admin@kubernetes
    kind: Config
    preferences: {}
    users:
    - name: kubernetes-admin
      user:
        client-certificate-data: REDACTED
        client-key-data: REDACTED
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

We should use an authenticaion to retirve data in a restful way. The authenticaiotn method we are going to use is called "bearer token".  
This is part of the default secrets in Kubernetes cluster.

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get secrets 
    NAME TYPE DATA AGE
    dashboard-token-xkkgj kubernetes.io/service-account-token 3 33d
    default-token-842zc kubernetes.io/service-account-token 3 33d
    vikki@drona-child-1:~$ kubectl describe secrets dashboard-token-xkkgj
    Name: dashboard-token-xkkgj
    Namespace: default
    Labels: <none>
    Annotations: kubernetes.io/service-account.name=dashboard
                  kubernetes.io/service-account.uid=3c4c5998-a92e-11e8-b6cb-080027165f06
    
    Type: kubernetes.io/service-account-token
    
    Data
    ====
    ca.crt: 1025 bytes
    namespace: 7 bytes
    token: eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImRhc2hib2FyZC10b2tlbi14a2tnaiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJkYXNoYm9hcmQiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiIzYzRjNTk5OC1hOTJlLTExZTgtYjZjYi0wODAwMjcxNjVmMDYiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZGVmYXVsdDpkYXNoYm9hcmQifQ.aYciSQYcXInr5o7AFYgf8XqVJ8wcxk9f_73EZqmTIVH8wwboQGWhAFgQY7Qj1kMvDVS3axRAcI7_UZN7AVE2dXfG7O-dILvfVoZuLnyIgfmNUJG-rb1KZb3-CGtmOAKpxV5d9SpH0Y1Ue11URhlZkCTL2TWYcalSWKKcIoJXZw2TBoYwJ31fQMUc5J6TmUwmOAFaAVOjtAdxM1tcrP9cNEOFHotMCgBhNkNr4XFTeSWWMHcLNqLU4aRH40CEloXXeNsXmK2xk_WSNMzmKrWSNQU5jXLnc2aoJ4VB3kjT6C5GkYKB0XHyGaCvqR9-QYf0neYjEEh9abOrvBtxGPdD6w
    vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

Export this token value to a variabel token

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ export token=$(kubectl describe secrets dashboard-token-xkkgj |grep "token:" |cut -f7 -d ' ')
    vikki@drona-child-1:~$ echo $token
    eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImRhc2hib2FyZC10b2tlbi14a2tnaiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJkYXNoYm9hcmQiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiIzYzRjNTk5OC1hOTJlLTExZTgtYjZjYi0wODAwMjcxNjVmMDYiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZGVmYXVsdDpkYXNoYm9hcmQifQ.aYciSQYcXInr5o7AFYgf8XqVJ8wcxk9f_73EZqmTIVH8wwboQGWhAFgQY7Qj1kMvDVS3axRAcI7_UZN7AVE2dXfG7O-dILvfVoZuLnyIgfmNUJG-rb1KZb3-CGtmOAKpxV5d9SpH0Y1Ue11URhlZkCTL2TWYcalSWKKcIoJXZw2TBoYwJ31fQMUc5J6TmUwmOAFaAVOjtAdxM1tcrP9cNEOFHotMCgBhNkNr4XFTeSWWMHcLNqLU4aRH40CEloXXeNsXmK2xk_WSNMzmKrWSNQU5jXLnc2aoJ4VB3kjT6C5GkYKB0XHyGaCvqR9-QYf0neYjEEh9abOrvBtxGPdD6w
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ curl https://160.0.0.1:6443/apis --header "Authorization: Bearer $token" -k
    {
      "kind": "APIGroupList",
      "apiVersion": "v1",
      "groups": [
        {
          "name": "apiregistration.k8s.io",
          "versions": [
            {
              "groupVersion": "apiregistration.k8s.io/v1",
              "version": "v1"
            },
            {
              "groupVersion": "apiregistration.k8s.io/v1beta1",
              "version": "v1beta1"
            }

<!--kg-card-end: code-->

Some of the other URL to expolore  
[https://160.0.0.1:6443/api/v1/namespaces](https://160.0.0.1:6443/api/v1/namespaces)  
[https://160.0.0.1:6443/api/v1](https://160.0.0.1:6443/api/v1)

