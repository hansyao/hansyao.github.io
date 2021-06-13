---
layout: post
title: tmux用法
date: 2021-06-12
Author: Hans Yao
tags: [原创, Linux, 工具]
comments: false
toc: true
---

## 前言

tmux是一个 terminal multiplexer（终端复用器），它可以启动一系列终端会话。
它解绑了会话和终端窗口。关闭终端窗口再打开，会话并不终止，而是继续运行在执行。将会话与终端窗后彻底分离。
原来我一直用老古董`screen`，最近刚发现redhat从仓库里移除了`screen`不再维护，代替以tmux。简单看了下文档，特做笔记如下；

<!-- more -->

**安装方法一** 从源码编译

```bash
git clone https://github.com/tmux/tmux.git
cd tmux
sh autogen.sh
./configure && make
```

**安装方法二**

```bash
# redhat/centos/fedora
sudo yum install tmux # 或者 sudo dnf install tmux
```

启动与退出
讲解使用之前，我们需要先搞清楚窗口与会话的概念。

所谓窗口，其实就是我们终端打开的一个tab，如终端里面所操作的命令、启动的服务，为会话，如下图所示：

在理解了窗口和会话的观念上，我们介绍下tmux使用。

## 启动tmux

```bash
tmux
```

## 退出
```
exit # 或者 Ctrl+D
```
在终端窗口上，运行tmux，其实就打开了一个终端与tmux服务的会话。只不过我们可以在tmux会话上层，再次输入’会话‘命令，使tmux上层运行的'会话'与终端窗口进行分离。这里面tmux其实可以称之为伪窗口（它其实是会话）。

启动tmux后，底部[0] 表示第0个tmux伪窗口，再启动一个tmux伪窗口，则为[1],依次递增。

## 启动命名tmux
```bash
tmux new -s <name>
```
底部不再是数字，而是命名的名字，如下图

分离会话
在会话窗口上，执行cd demo操作后，再执行tmux detach，可见退出了tmux伪窗口

## 分离会话

```bash
tmux detach
```
执行tmux ls可看到当前所有的tmux伪窗口。

重接会话
我们通过tmux detach关闭tmux伪窗口后，希望能再次进入某一个会话窗口，怎么操做？

## 重接会话 使用伪窗口编号

```bash
tmux attach -t 0
```

## 重接会话 使用伪窗口名称

```bash
tmux attach -t xiaoqi
```

杀死会话
有时候我们想彻底关闭某个会话，不想让其再执行，怎么操作?

## 使用会话编号

```bash
tmux kill-session -t 0
```
## 使用会话名称

```bash
tmux kill-session -t <name>
```
切换会话
## 使用会话编号

```bash
tmux switch -t 0
```

## 使用会话名称

```bash
tmux switch -t <session-name>
```
重命名会话

```bash
tmux rename-session -t 0 <new-name>
```
其他命令
## 列出所有快捷键，及其对应的 Tmux 命令

```bash
tmux list-keys
```

## 列出所有 Tmux 命令及其参数

```bash
tmux list-commands
```
## 列出当前所有 Tmux 会话的信息

```bash
tmux info
```

## 重新加载当前的 Tmux 配置
```bash
tmux source-file ~/.tmux.conf
```
好了，到这里，tmux的基本用法已经全部掌握了，可以愉快的使用了。