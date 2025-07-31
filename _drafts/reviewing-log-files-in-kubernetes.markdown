---
layout: post
title: Reviewing log files in Kubernetes
---

safdsfs

<!--kg-card-begin: code-->

    vikki@drona-child-1:~$ journalctl -u kubelet.service

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ sudo find / -name "*apiserver*log"
    [sudo] password for vikki: 
    /var/log/containers/kube-apiserver-drona-child-1_kube-system_kube-apiserver-60e62ad21eedb60cf7540f84814c4241ad909f71580d57a8f0df9816cecb5ffc.log
    /var/log/containers/kube-apiserver-drona-child-1_kube-system_kube-apiserver-c3bd7f365cbeb3f5ded7ca8b88ed4e2d790c8c5e4413a400a14fa5af7960253f.log

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ ls /var/log/containers/
    coredns-78fcdf6894-vb2pk_kube-system_coredns-23683db037eeffe521ea4d29130403b2d96cc863289bed15919b8055ac5d5826.log
    coredns-78fcdf6894-vb2pk_kube-system_coredns-f3a3f4b29a67848318682b6ba933fc9ccf0d583a44c78d8efc391c6ad55297da.log
    coredns-78fcdf6894-z5599_kube-system_coredns-6f60f618ac519ff2d168acae08812c6c954783e65ef548b3453e08f113af1642.log
    coredns-78fcdf6894-z5599_kube-system_coredns-f961983ed423ff1cbd0cabf7b03fd43c687284b0e8da070228e48c29a7c0a1ac.log
    daemon-set-vikki-roll-update-6gx9r_default_nginx-1ce4a3894b91ff0cbc436882428173407575ea544306fc0ab0c32eb4f6528be5.log
    daemon-set-vikki-roll-update-6gx9r_default_nginx-3ed38d3175bea45cbd654df2be5565ccfba3a7fb3fc1bdd13ec272dfb84e4e90.log
    etcd-drona-child-1_kube-system_etcd-63c7c8c57869486f1a225a956dae8936c720d751311757070168f5da9065341e.log
    etcd-drona-child-1_kube-system_etcd-e45901a6a095f3789be6c828f6c93892c2607af5442c820575ed8089a12e739b.log
    kube-apiserver-drona-child-1_kube-system_kube-apiserver-60e62ad21eedb60cf7540f84814c4241ad909f71580d57a8f0df9816cecb5ffc.log
    kube-apiserver-drona-child-1_kube-system_kube-apiserver-c3bd7f365cbeb3f5ded7ca8b88ed4e2d790c8c5e4413a400a14fa5af7960253f.log
    kube-controller-manager-drona-child-1_kube-system_kube-controller-manager-59932af67237cf92a10ecaa3d9e64c673b2973d9b7db7e07ebcda6f2cf459500.log
    kube-controller-manager-drona-child-1_kube-system_kube-controller-manager-ff51d6e8aa812501b55ef7fdfa9d3a2528b3beffc788d9eb63520b3dea83ca86.log
    kube-flannel-ds-amd64-qgxrd_kube-system_install-cni-e08552dd933be48e27e4b2f7b2206e98ec8041e8c71e90019ef665529b0a5137.log
    kube-flannel-ds-amd64-qgxrd_kube-system_kube-flannel-80584040f90f98e2a148f263d267ef035f9a0905064b0823ad5060897d430315.log
    kube-flannel-ds-amd64-qgxrd_kube-system_kube-flannel-bb51b0505d5c534901e64f4192c812e89de305e546a2e436e8b70c7cacf0ad09.log
    kube-proxy-2ch2w_kube-system_kube-proxy-c3d7f1851c4a8ed42f9802f78b1a523c8704e60eb8a9d7834e7118be7351be84.log
    kube-proxy-2ch2w_kube-system_kube-proxy-e5b12263920791e53d835cff94bdf8584df3ae8a6162081041f7120e4e400465.log
    kubernetes-dashboard-6948bdb78-zzjqq_kube-system_kubernetes-dashboard-4b6585990c9e7b0f0f5e7371b1c1d0e7ba2f99f373dfa8177ad22f98ca522252.log
    kubernetes-dashboard-6948bdb78-zzjqq_kube-system_kubernetes-dashboard-6a14504eb36b5649d342b3fdd3478916826e9493b14d47fedb3bb18f09bfb254.log
    kube-scheduler-drona-child-1_kube-system_kube-scheduler-58b212a7fe97033b7794d060cb5d5c2884549c0d6fb13f523f63bad8e911d564.log
    kube-scheduler-drona-child-1_kube-system_kube-scheduler-86c7a2e7913179aacd768c6b564cdb44b5848ec9bb0211bb750f9e9328eb609c.log
    taint-deployment-67594d6bf6-rs4f4_default_nginx-02f777c44e19db1c65557c4236cf2805966379800b39b1797b63a88dead0557c.log
    taint-deployment-67594d6bf6-rs4f4_default_nginx-169be929f7baca8b081ccb1f765ec6212e86341ae2489b789e8e38345023e4aa.log
    taint-deployment-67594d6bf6-xg7q6_default_nginx-3156173c891235156f43a09bca78cbd8894af73539bdf0235e2e7731b1fc0a4c.log
    taint-deployment-67594d6bf6-xg7q6_default_nginx-cf8a398c7a8b0f04ae30d1344d2ecaf1ab3e2bdfece84eef4ef3d8342dce0183.log
    vikki@drona-child-1:~$ 

<!--kg-card-end: code--><!--kg-card-begin: code-->

    vikki@drona-child-1:~$ kubectl -n kube-system logs coredns-78fcdf6894-z5599
    2018/10/02 08:38:37 [INFO] CoreDNS-1.1.3
    2018/10/02 08:38:37 [INFO] linux/amd64, go1.10.1, b0fd575c
    2018/10/02 08:38:37 [INFO] plugin/reload: Running configuration MD5 = 2a066f12ec80aeb2b92740dd74c17138
    .:53
    CoreDNS-1.1.3
    linux/amd64, go1.10.1, b0fd575c

<!--kg-card-end: code-->