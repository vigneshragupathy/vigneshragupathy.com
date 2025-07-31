---
layout: post
title: Using the proxy in Kubernetes
---

dsfsadfsfdffa  
We can also user proxy to retrieve data from API.  
The proxy can run for a node or inside a pod using sidecar

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl proxy --api-prefix=/ &
    [1] 2073
    vikki@drona-child-1:~$ Starting to serve on 127.0.0.1:8001
    
    vikki@drona-child-1:~$ curl http://127.0.0.1:8001/api
    {
      "kind": "APIVersions",
      "versions": [
        "v1"
      ],
      "serverAddressByClientCIDRs": [
        {
          "clientCIDR": "0.0.0.0/0",
          "serverAddress": "160.0.0.1:6443"
        }
      ]
    }vikki@drona-child-1:~$ 

<!--kg-card-end: code-->

Genreally we need token for retriving data from API servers in restful method. But now the proxy will do everything on our behalf without a token.

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ curl http://127.0.0.1:8001/api/v1/namespaces
    {
      "kind": "NamespaceList",
      "apiVersion": "v1",
      "metadata": {
        "selfLink": "/api/v1/namespaces",
        "resourceVersion": "24627"
      },
      "items": [
        {
          "metadata": {
            "name": "default",
            "selfLink": "/api/v1/namespaces/default",
            "uid": "97d343ac-a92d-11e8-b6cb-080027165f06",
            "resourceVersion": "4",
            "creationTimestamp": "2018-08-26T12:43:12Z"
          },
          "spec": {
            "finalizers": [
              "kubernetes"
            ]
          },
          "status": {
            "phase": "Active"
          }
        },

<!--kg-card-end: code-->