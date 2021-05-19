---
layout: post
title: 学习笔记 - git常用命令大全
date: 2021-05-20
Author: Hans Yao
tags: [Git, 教程]
comments: false
---

## 本地仓库 ##

第一步git设置
```shell
git config --global user.name "your name"
git config --global user.email "yourmail@example.com"
```
第二步：初始化仓库
```shell
git init
```
添加文件:
```shell
git add filename1.txt			从工作区到暂存区(stage)
git commit -m "added filename1.txt"   从暂存区到分支
```
查看状态
```shell
git status
```
查看日志
```shell
git log		历史日志
git log --graph 查看分支合并图
git log --pretty=oneline	每个commit单行显示
git reflog	未来日志
```

回退版本
```shell
git reset --hard HEAD^	(HEAD^ 上一版本，其他-commit_ID)
```
撤销修改
```shell
git checkout -- filename1.txt 测销工作区的修改
```
删除文件
```shell
git rm filename1.txt
(版本库里有，工作区删除掉了，可用git checkout -- filename1.txt恢复)
```

## 链接远程库 ##
* step1. 密钥
* step2. 关联远程仓库
```shell
git remote add origin git@github.com:hansyao/myrepository.git
```
* step3. 提交到远程仓库
```shell
git push -u origin master   (-u参数：和远程分支关联)
git push origin --delete <branchName> 删除远程分支
```	
从远程库克隆到本地库
```shell
git clone git@github.com:hansyao/myrepository.git		(https协议较慢，最好这样用ssh协议)
```
## 创建合并分支 ##
```shell
git branch  查看分支
git branch name	创建分支
git checkout name 切换分支
git checkout -b name 创建+切换分支
git merge name 合并name到当前分支
git branch -d name 删除分支
```
## bug分支 ##
```shell
git stash 储藏当前工作区
git stash list
git stash apply 恢复stash工作区
git stash apply stash@{0}
git stash drop 删除stash工作区
git stash pop 恢复的同时删除stash工作区
```

## 多人协作 ##
```shell
git remote  查看远程分支
git remote -v 查看远程分支详细信息
git push origin master 合并到远程master分支
git push origin dev 合并到远程dev分支
git checkout -b dev origin/dev  创建本地dev分支并与远程dev链接，同时切换到本地dev分支
git pull 远程同步到本地仓库
git branch --set-upsteam dev origin/dev
```
* step1. git push orgin branch-name 推送自己的修改
* step2. 如果推送失败,先用git pull试图合并
* step3. 如果合并有冲突, 则解决冲突，并在本地提交
* step4. 没有冲突或者解决掉冲突后，再用git push origin branch-name 推送
如果"no tracking information", 需要建立本地和远程分支的链接 "git branch --set-upsteam dev origin/dev"

## 创建标签 ##
```shell
git tag 查看所有标签
git tag v0.1 打名为v0.1的标签
git tag v0.1 commit_ID
git show v0.1 查看标签详细信息
```
## 忽略特殊文件 ##
```shell
.gitignore
```
