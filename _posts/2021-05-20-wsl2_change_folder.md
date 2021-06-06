---
layout: post
title: WSL2系统迁移
date: 2021-05-20
Author: Hans Yao
tags: [Linux, WSL2, 教程]
comments: false
---

1.  查看已安装的linux发行版本

```dos
wsl -l --all -v
```

2.  导出分发版为tar文件到d盘

```dos
wsl --export Ubuntu-20.04 d:\wsl-ubuntu20.04.tar
```

3. 注销当前分发版

```dos
wsl --unregister Ubuntu-20.04
```

4. 重新导入并安装WSL在D盘

```dos
wsl --import Ubuntu-20.04 d:\wsl-ubuntu20.04 d:\wsl-ubuntu20.04.tar --version 2
```

5. 设置默认登陆用户为安装时用户名

```dos
ubuntu2004 config --default-user USERNAME
```

6. 删除wsl-ubuntu20.04.tar

```dos
del d:\wsl-ubuntu20.04.tar
```

