---
layout: post
title: PHP编译
date: 2021-06-13
Author: Hans Yao
tags: [原创, Linux, arm, php]
comments: false
toc: true
---

刚从Oracle嫖了一台arm架构服务器，选择的oracle官方镜像Oracel Linux 8(redhat 8)。直接用onestack的lnmp配置web服务器。由于是干净系统，编译安装php时实在是太蛋疼了，一系列的依赖问题需要解决，特记录如下。


<!-- more -->

**编译环境**
```
$ uname -a    #查看内核版本
Linux instance 5.4.17-2102.201.3.el8uek.aarch64 #2 SMP Fri Apr 23 09:42:46 PDT 2021 aarch64 aarch64 aarch64 GNU/Linux

$ cat /etc/system-release         #查看系统版本
Oracle Linux Server release 8.4

$ gcc --version | head -n 1     # 查看gcc版本
gcc (GCC) 8.4.1 20200928 (Red Hat 8.4.1-1.0.1)

```

**依赖项:**

直接安装，缺失时报错，记录缺失依赖项如下：
```
gcc-c++
openssl-devel
ncurses-devel
rpcsvc
automake
libtirpc-devel
libicu-devel
oniguruma-devel
freetype-devel
libjpeg-devel
libpng-devel
libcurl-devel
sqlite-devel
libxml2-devel
gettext-devel

```

**安装步骤**

1. oniguruma-devel和rpcsvc-proto：oracel镜像源缺失源码，oniguruma-devel可以从centos源安装， rpcsvc-proto直接从github拉取源码编译安装。

```bash
 sudo dnf install https://rpmfind.net/linux/centos/8-stream/PowerTools/aarch64/os/Packages/oniguruma-devel-6.8.2-2.el8.aarch64.rpm

 git clone https://github.com/thkukuk/rpcsvc-proto
 cd rpcsvc-proto
 make
 sudo make install
```

2. 其他依赖直接从官方源安装

```bash
sudo dnf install \
gcc-c++  \
openssl-devel \
ncurses-devel \
rpcsvc \
automake \
libtirpc-devel \
libicu-devel \
oniguruma-devel \
freetype-devel \
libjpeg-devel \
libpng-devel \
libcurl-devel \
sqlite-devel \
libxml2-devel \
gettext-devel
```

3. 编译安装php

```bash

cd lnmp
sudo ./install.sh --php_option 9 --phpcache_option 1

```

完工！！！！