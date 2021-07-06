---
layout: post
title: Shell爬取中考网电子教材
date: 2021-07-06
Author: Hans Yao
tags: [原创, Shell]
comments: false
toc: false
mermaid: false
---

>又是一年暑假季，学生们马上要开学准备新学期的学习。为了为我家少爷准备新学期的教材先预习一下, 到网上搜索了下，只在中考网上找到电子教材，不过都是一页一页的JPG图片。 图床不支持递归下载，因此写了个简单的Shell脚本下载下来自动生成PDF装订成册。特将脚本分享如下：

<!-- more -->

先找到电子教程网页，以沪教版七年级数学为例：

[http://sh.zhongkao.com/20091103/4aefdc51ca5d7.shtml](http://sh.zhongkao.com/20091103/4aefdc51ca5d7.shtml)

得到图床的URL地址为 [http://img.eduuu.com/zhongkao_sh/style/czjc/7sx1/char9/](http://img.eduuu.com/zhongkao_sh/style/czjc/7sx1/char9/)

据此写个shell脚本, 运行下即可将所选章节无损或者选择需要的图片质量转换为单个PDF文件。附脚本源码如下：

```s

#!/bin/bash
# 环境配置：linux, ImageMagick库

# setup
CHARPTER=9			# 章节数
TEMP=temp.pdf			# 临时PDF文件名
OUTPUT='第'$CHARPTER'章'.pdf	# 输出PDF文件名
DENSITY=300			# 像素密度(图像质量)
URL=https://img.eduuu.com/zhongkao_sh/style/czjc/7sx1/char$CHARPTER
n=10		# 总小节数
PAGE=0		# 页码初始化

rm -f $OUTPUT

m=0
while ((m <= n))
do
	i=1;			# 每章节起始页码
	j=100;  		# 每章节最大爬取页码
	while ((i <= $j));
	do
		wget -q $URL/$m-$i.jpg -O $m-$i.jpg
		if [ ! -s $m-$i.jpg ]; then 
			rm -rf $m-$i.jpg
			break
		fi
		echo -e "已爬取jpg原图像文件 $m-$i.jpg"

		let i++
		let PAGE++
	done

	let m++
done

if [[ $PAGE == 0 ]]; then echo '文件不存在！';  exit 0; fi;

echo -e "\n开始转换PDF文件..."
convert -density $DENSITY `ls -v *.jpg` $OUTPUT
rm -f *.jpg

echo -e '共生成 '$PAGE' 页的PDF文件保存在 '$(pwd)/$OUTPUT

exit 0;

```
