---
layout: post
title: Working with TLS in Kubernetes
---

asdfsadfsadf

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ systemctl status kubelet.service
    ● kubelet.service - kubelet: The Kubernetes Node Agent
       Loaded: loaded (/lib/systemd/system/kubelet.service; enabled; vendor preset: enabled)
      Drop-In: /etc/systemd/system/kubelet.service.d
               └─10-kubeadm.conf
       Active: active (running) since Tue 2018-10-02 17:46:41 IST; 6min ago
         Docs: https://kubernetes.io/docs/home/
     Main PID: 801 (kubelet)
        Tasks: 18 (limit: 4660)
       CGroup: /system.slice/kubelet.service
               └─801 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --cgroup-driver=cgroupfs --cni-bin-
    
    Oct 02 17:47:33 drona-child-1 kubelet[801]: E1002 17:47:33.140553 801 remote_runtime.go:278] ContainerStatus "3c76f3bcfa0a31cc9db3d78f0216d077f1a0be79c176e18a8a76835992af328e" from runtime service failed: rp
    Oct 02 17:47:33 drona-child-1 kubelet[801]: E1002 17:47:33.140600 801 kuberuntime_container.go:391] ContainerStatus for 3c76f3bcfa0a31cc9db3d78f0216d077f1a0be79c176e18a8a76835992af328e error: rpc error: code
    Oct 02 17:47:33 drona-child-1 kubelet[801]: E1002 17:47:33.140615 801 kuberuntime_manager.go:873] getPodContainerStatuses for pod "kubernetes-dashboard-6948bdb78-zzjqq_kube-system(ffc7a3a9-a92d-11e8-b6cb-080
    Oct 02 17:47:33 drona-child-1 kubelet[801]: E1002 17:47:33.140637 801 generic.go:241] PLEG: Ignoring events for pod kubernetes-dashboard-6948bdb78-zzjqq/kube-system: rpc error: code = Unknown desc = Error: N
    Oct 02 17:47:33 drona-child-1 kubelet[801]: W1002 17:47:33.448894 801 cni.go:243] CNI failed to retrieve network namespace path: cannot find network namespace for the terminated container "45863fe60b98d008b7
    Oct 02 17:47:33 drona-child-1 kubelet[801]: W1002 17:47:33.450034 801 cni.go:243] CNI failed to retrieve network namespace path: cannot find network namespace for the terminated container "820f38fe707626b739
    Oct 02 17:47:34 drona-child-1 kubelet[801]: I1002 17:47:34.059108 801 kuberuntime_manager.go:757] checking backoff for container "nginx" in pod "daemon-set-vikki-roll-update-6gx9r_default(50f24f9c-c616-11e8-
    Oct 02 17:47:34 drona-child-1 kubelet[801]: W1002 17:47:34.392270 801 pod_container_deletor.go:75] Container "a272f2980a108ddeabedd7c024fb1f67c3aa722f6ae52492b5a3718767b3eabf" not found in pod's containers
    Oct 02 17:47:34 drona-child-1 kubelet[801]: I1002 17:47:34.539379 801 kuberuntime_manager.go:757] checking backoff for container "coredns" in pod "coredns-78fcdf6894-z5599_kube-system(4ab5acb8-c618-11e8-a452
    Oct 02 17:47:35 drona-child-1 kubelet[801]: I1002 17:47:35.470026 801 kuberuntime_manager.go:757] checking backoff for container "tiller" in pod "tiller-deploy-58c4d6d4f7-pbjxh_kube-system(fc7bacd6-c623-11e8
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ grep clientCAFile /var/lib/kubelet/config.yaml
        clientCAFile: /etc/kubernetes/pki/ca.crt
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ sudo ls /etc/kubernetes/manifests/
    etcd.yaml kube-apiserver.yaml	kube-controller-manager.yaml kube-scheduler.yaml
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get secrets -n kube-system |grep certificate
    certificate-controller-token-l6l9r kubernetes.io/service-account-token 3 36d
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl get secrets -n kube-system certificate-controller-token-l6l9r -o yaml 
    apiVersion: v1
    data:
      ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRFNE1EZ3lOakV5TkRJek1Wb1hEVEk0TURneU16RXlOREl6TVZvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTW9zCkRkY042emhMZ2NCN24xZmhQSXFod0JIRVdvL2lOaVh1bWttZFVDZW9haFRDT2pDWXE4bmM4czFkREJGc2w5cWQKc1pDMDIvc1IxazRQTnhXYjl1dG9md1JBblVtdVd2WVRQQ2puZnVrSFQ3Ym9RWVY0SzFHNFpxbTZmeUZxd09nYQplaG53R3BoV1FiTFhaQS9qQTlKa1NLQ3NmYUVZYXRpdmV0dE94ZW11cUQxTS90L3RxMWJqSk9iS3pVOHlTaVg5CnFqaWVVY2hjbVZVTlRXU3lCd3RIOTgwQkFpTTdkbFMwdGFMTkRZSnAxZmRIYzloRyt0N0xwTGRmQ2YvdnZ4UzgKdW1IWW10akRMRWdDQVQ2L0dpaVpTckpwRnFDckdUVGFFeEtFcFltd2lYVTA0ay9oNWY2WTd1WFVlMnROOVBVOApzOW5KMTFJb0w0TklkOVJ5TERVQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFDbWlvTGVpa2ZYaXIzNG1xazllUk9QL3RlN20KZEM0aFVZQ1NPYlplQ1FBcFJIeFRUMUVwOFFFZWxINzl6VE9Da3lBR2kzVWJ0VDlPME9DcFlWZGhUeUlhTnd4QQpRVHZVSG92V1RQUStoTEdVaHN4UmVHUU8yQlpsVEw2YkRiQW4ycFhsZ3VaUkxPQjRiL21iVkQ3VmlnTk15SVErClBKMHdsMW5UQ282VWIrQ25IYVJNTVlUOFNjYVJ0RWFGcHhiZWQ4OThMN3VxR3l4QWF5UkwwUEF5NTU5K0lWc0oKdWtaQm1XV0tvTXRjSEhRcTE1dGZZSEVvdHZ5VmFKZWlnSVBVNFM2eGI1YkJqNmpjcTRzYkp0ZXUwNTZkd0FYTgpuemVKSjlMSHVvbWdobEhFWldSM002QnA5a3MwVENTZitxQlNKZGlERzlMWEEyMXVJM1B5NnpEeXduRT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
      namespace: a3ViZS1zeXN0ZW0=
      token: ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklpSjkuZXlKcGMzTWlPaUpyZFdKbGNtNWxkR1Z6TDNObGNuWnBZMlZoWTJOdmRXNTBJaXdpYTNWaVpYSnVaWFJsY3k1cGJ5OXpaWEoyYVdObFlXTmpiM1Z1ZEM5dVlXMWxjM0JoWTJVaU9pSnJkV0psTFhONWMzUmxiU0lzSW10MVltVnlibVYwWlhNdWFXOHZjMlZ5ZG1salpXRmpZMjkxYm5RdmMyVmpjbVYwTG01aGJXVWlPaUpqWlhKMGFXWnBZMkYwWlMxamIyNTBjbTlzYkdWeUxYUnZhMlZ1TFd3MmJEbHlJaXdpYTNWaVpYSnVaWFJsY3k1cGJ5OXpaWEoyYVdObFlXTmpiM1Z1ZEM5elpYSjJhV05sTFdGalkyOTFiblF1Ym1GdFpTSTZJbU5sY25ScFptbGpZWFJsTFdOdmJuUnliMnhzWlhJaUxDSnJkV0psY201bGRHVnpMbWx2TDNObGNuWnBZMlZoWTJOdmRXNTBMM05sY25acFkyVXRZV05qYjNWdWRDNTFhV1FpT2lJNVlURm1OR1EwTVMxaE9USmtMVEV4WlRndFlqWmpZaTB3T0RBd01qY3hOalZtTURZaUxDSnpkV0lpT2lKemVYTjBaVzA2YzJWeWRtbGpaV0ZqWTI5MWJuUTZhM1ZpWlMxemVYTjBaVzA2WTJWeWRHbG1hV05oZEdVdFkyOXVkSEp2Ykd4bGNpSjkuSllxOGpGazFNVHNWT21GOXFPNFE2NTNzTlFjZmtLaXA4dkZLTmdhR19IaEdSSGpfc2gyTHpMWmZSelBtSm9kZmpDSU5STWhvcGxmSFBrcU03aUhuNGlWaVFkT0RHN1czZldHN05TLS1NbzAzX2ZoVlJ4QWRPYzRVaGJoS2doUExQbWxuaFFyMTVvdWhjYkpoQ1g3WGhxSnZMV3Z5bHpGVGNhUmJmVzg2cVMtV0dIcXYybW1jYnNCOFpkenJWelhYY1BmZGZKbHdmMWNRMEZtUWprY2tuNXNaa0Z6clpNaF9UR2xDRnhRMXhqWEx6MlBrUzU2ZTFFVTEtQl9kekF5NkdBQ1dPSzVyMUV3ZmtmY1U2Q3BwTHE0a0puOXpuSXJrcFE5T213Q2lpVFd6RURHaUgxN2Jkekk0QklrTHBoUGltRVRaXzNyd25NbTdpbW44Wm90RW9B
    kind: Secret
    metadata:
      annotations:
        kubernetes.io/service-account.name: certificate-controller
        kubernetes.io/service-account.uid: 9a1f4d41-a92d-11e8-b6cb-080027165f06
      creationTimestamp: 2018-08-26T12:43:15Z
      name: certificate-controller-token-l6l9r
      namespace: kube-system
      resourceVersion: "183"
      selfLink: /api/v1/namespaces/kube-system/secrets/certificate-controller-token-l6l9r
      uid: 9a20db8c-a92d-11e8-b6cb-080027165f06
    type: kubernetes.io/service-account-token
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

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

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ cp ~/.kube/config ~/cluster-api-config
    vikki@drona-child-1:~$ kubectl config 
    current-context delete-context get-contexts set set-context unset view             
    delete-cluster get-clusters rename-context set-cluster set-credentials use-context      

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ sudo kubeadm config print-default

<!--kg-card-end: code-->