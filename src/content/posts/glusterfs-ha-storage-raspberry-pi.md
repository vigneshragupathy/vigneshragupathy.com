---
title: GlusterFS HA Storage with Raspberry Pi
description: Building a two-node replicated GlusterFS volume on Raspberry Pis for cheap highly-available storage.
date: 2017-10-01
tags: [glusterfs, raspberry-pi, storage]
---
Two Raspberry Pis, two USB drives, one replicated volume. Cheap, slow, and surprisingly reliable.

```bash
gluster peer probe pi2
gluster volume create gv0 replica 2 pi1:/data/brick pi2:/data/brick
gluster volume start gv0
```

Mount it from any client and pull a cable. Writes keep going.
