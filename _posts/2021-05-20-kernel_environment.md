---
layout: post
title: 学习笔记 - kernel 学习环境搭建
date: 2021-05-20
Author: Hans Yao
tags: [Linux Kernel, 教程]
comments: false
toc: true
---

## 1. Build/install upstream kernel as host
```shell
# mkdir -p ~/sandbox/
# git clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git linux.host
# cd linux.host
# cp /boot/config-5.4.70-amd64-desktop ./.config
# git checkout -b debug
# make olddefconfig
# make dep-pkg -j7
# cd ..
# sudo dpkg -i *.deb
# sudo reboot
```
## 2. Build buildroot
```shell
# cd ~/sandbox
# git clone https://github.com/buildroot/buildroot buildroot
# cd buildroot
# make menuconfig
 Target optins -> x86_64
 Filesystem images -> cpio the root filesystem image
                      Compression method (xz)
# make -j
<../output/images/rootfs.cpio.xz is the output root filesystem image>
```
## 3. Build guest kernel
```shell
# cd ~/sandbox
# git clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git linux.guest
# cd linux.guest
# git checkout -b debug
# cp <attached_guest_config_file> .config
# make -j
<../arch/x86/boot/bzImage is the kernel image to be used later>
```
## 4. Build QEMU
```shell
# cd ~/sandbox
# git clone https://git.qemu.org/git/qemu.git qemu
# cd qemu
# ./configure --target-list=x86_64-softmmu --enable-debug \
            --enable-werror --disable-fdt --enable-kvm  \
            --disable-xen --disable-vnc
# make -j
<~/sandbox/qemu.main/build/aarch64-softmmu/qemu-system-x86 is the output binary>
```
## 5. Boot guest kernel
```shell
   # mkdir ~/sandbox/images
   # ~/sandbox/qemu/build/qemu-img create -f qcow2 ~/sandbox/images/vm.img 1G
   # ~/sandbox/qemu/build/qemu-img create -f qcow2 ~/sandbox/images/vm1.img 1G
```
## 6. start VM machine - to create a shell script [start_vm_x86.sh]
```shell
start_vm_x86() {
    sudo ~/sandbox/qemu/build/x86_64-softmmu/qemu-system-x86_64 \
    --enable-kvm -machine type=q35,accel=kvm,kernel-irqchip=on -cpu host    \
    -smp 2 -m 1G -monitor none -nographic -s                                \
    -serial mon:stdio                                                       \
    -kernel ~/sandbox/linux.guest/arch/x86/boot/bzImage                      \
    -initrd ~/sandbox/buildroot/output/images/rootfs.cpio.xz                \
    -append "earlyprintk=ttyS0 console=ttyS0 debug swapaccount=1"           \
    -device virtio-net-pci,netdev=unet,mac=52:54:00:f1:26:a6                \
    -netdev user,id=unet,hostfwd=tcp::50959-:22                             \
    -drive file=~/sandbox/images/vm.img,if=none,format=raw,id=nvme0         \
    -device nvme,drive=nvme0,serial=foo                                     \
    -drive file=~/sandbox/images/vm1.img,if=none,format=raw,id=nvme1        \
    -device nvme,drive=nvme1,serial=foo1
}
start_vm_x86
```
  
