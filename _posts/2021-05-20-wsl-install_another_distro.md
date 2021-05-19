---
layout: post
title: WSL2-安装任意Linux发行版教程
date: 2021-05-20
Author: Hans Yao
tags: [Linux, WSL2, 教程]
comments: false
toc: false
---

1. Here are some default vars for the process
```bash
ISO_DIR=~/fedora;
ROOTFS_MOUNT_DIR=/mnt/contents

DISTRO_LOCATION=
```

1. Install Ubuntu Bash

2. Install 7zip in ubuntu
```bash
sudo apt-get install p7zip 
```

3. Download the distro of your choice (i.e Fedora)

4. Move the ISO to its own folder, i.e `~/fedora`

5. Navigate to the directory and Extract using 7Zip
```bash
mkdir $ISO_DIR; cd $ISO_DIR;
7z x Fedora-Cinnamon-Live-x86_64-31-1.9.iso
```
*You should see the following files or similar*
```
artman41@DESKTOP-TQGCI07:~/fedora$ ll | less
total 2139660
drwxr-xr-x  7 artman41 artman41       4096 Mar 31 16:04 ./
drwxr-xr-x 10 artman41 artman41       4096 Mar 31 16:03 ../
drwx------  3 artman41 artman41       4096 Oct 24 00:15 EFI/
-rwxr-xr-x  1 artman41 artman41 2203779072 Mar 31 16:03 Fedora-Cinnamon-Live-x86_64-31-1.9.iso*
drwx------  2 artman41 artman41       4096 Oct 24 00:15 LiveOS/
drwx------  2 artman41 artman41       4096 Mar 31 16:04 [BOOT]/
drwx------  3 artman41 artman41       4096 Oct 24 00:15 images/
drwx------  2 artman41 artman41       4096 Oct 24 00:15 isolinux/
```

6. Navigate to `LiveOS` (or where the `squashfs` is) and 'unsquash' the `squash.img`:
```bash
cd LiveOS;
sudo unsquashfs -d squashfs squashfs.img
```

7. Navigate to `squashfs/LiveOS` and mount the `rootfs.img`:
```bash
sudo mkdir $ROOTFS_MOUNT_DIR;
sudo mount -o loop squashfs/LiveOS/rootfs.img $ROOTFS_MOUNT_DIR;
```

7. Navigate to `$ROOTFS_MOUNT_DIR` and tar.gz the files:
```bash
cd $ROOTFS_MOUNT_DIR;
sudo tar -zcvf $ISO_DIR/distro.tar.gz .
```

8. Navigate to `$ISO_DIR` and import the .tar.gz using `wsl`
```bash
cd $ISO_DIR
wsl.exe --import $DISTRO_NAME $DISTRO_LOCATION distro.tar.gz
```

9. Open your distro and create a user
```bash
wsl.exe -d $DISTRO_NAME
useradd -m $USER
```

## Logging in to your account by default
*Note: Don't forget to add yourself to `visudo` or you'll be unable to perform super-user actions until you set the `DefaultUser` field in `regedit` to `0`*

10. Get your uid
```bash
grep $USER /etc/passwd
# The return will be something like artman41:x:1000:1000:root:/root:/bin/bash
#  where the format is $USER:x:$USER_ID:$GROUP_ID:$GROUP:$HOME:$SHELL
```

11. Install [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal-preview/9n0dx20hk701) and Open the JSON Settings
```powershell
#in powershell
notepad.exe $env:LocalAppData\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\profiles.json
```

12. Look for the profile with `$DISTRO_NAME` and note the GUID (referred to as `$DISTRO_GUID` in the guide)
  - *copying the GUID to `defaultProfile` will make you load in to your custom distro by default using the windows terminal*

13. Open `regedit` and navigate to `Computer\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Lxss\$DISTRO_GUID`

14. Ensure the following values are set

| Name | Type | Data |
|-|-|-|
| `DefaultEnvironment` | `REG_MULTI_SZ` | `HOSTTYPE=x86_64`<br/>`LANG=en_US.UTF-8`<br/>`PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games`<br/>`TERM=xterm-256color` |
| `DefaultUid` | `REG_DWORD` | `$USER_ID` |

15. Restart your custom distro shell