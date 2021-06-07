---
layout: post
title: 谷歌地图api国内访问
date: 2021-06-06
Author: Hans Yao
tags: [原创, Google, 教程]
comments: false
toc: true
---

# 前言

由于业务需求，需要使用谷歌地图API，但是由于众所周之的原因在国内不能访问谷歌地图，所以决定使用 nginx 做一下反向代理，保证图层等可以在墙内正常获取到。


<!-- more -->

# 准备工作

>1. 一台未被墙的海外服务器并绑定域名
>2. 部署了字符串替换的模块[replace-filter-nginx-module](https://github.com/openresty/replace-filter-nginx-module)的`nginx` web服务器，并开启`https`。具体部署方法参见[这里](https://github.com/openresty/replace-filter-nginx-module#installation)

<br>

# 步骤一 分析

我们知道谷歌地图API的调用地址为[https://maps.googleapis.com/maps/api/js?key=\`yourapikey\`](https://maps.googleapis.com/maps/api/js?key=)，点击这个地址，可以得到一个js源码页面如下图所示，分析得知，google map api调用相关的部分其实就是一个json格式字符串，就是图中圈选出来的部分(介于`apiLoad`之后和`LoadScriptTime`之前的方括号`[]`之间的部分)。
![google API URL](https://cdn.jsdelivr.net/gh/hansyao/image-hosting@master/20210606/2021-06-06%2021-19-00%20的屏幕截图.40o65n1u0sk0.png)

<br>

分析这段json, 写一行shell脚本解析出其中的URL(注：这里用到了json解析命令`jq` - v1.6, 如果没有需要先安装）：

```bash
curl -H POST https://maps.googleapis.com/maps/api/js?key= | grep "apiLoad(\[" | cut -d \( -f 2|sed 's/, loadScriptTime);//g' | jq -r | grep https:// |awk -F'"' '{print $2}'| sort -n | uniq
```
得到google map api url 所调用到的URL清单如下:

    https://cbks0.googleapis.com/cbk?
    https://cbks1.googleapis.com/cbk?
    https://earthbuilder.googleapis.com
    https://geo0.ggpht.com/cbk
    https://geo1.ggpht.com/cbk
    https://geo2.ggpht.com/cbk
    https://geo3.ggpht.com/cbk
    https://khms0.googleapis.com/kh?v=129&hl=en-US&
    https://khms0.googleapis.com/kh?v=903&hl=en-US&
    https://khms0.google.com/kh?v=129&hl=en-US&
    https://khms0.google.com/kh?v=903&hl=en-US&
    https://khms1.googleapis.com/kh?v=129&hl=en-US&
    https://khms1.googleapis.com/kh?v=903&hl=en-US&
    https://khms1.google.com/kh?v=129&hl=en-US&
    https://khms1.google.com/kh?v=903&hl=en-US&
    https://khms.googleapis.com/mz?v=903&
    https://lh3.ggpht.com/
    https://lh4.ggpht.com/
    https://lh5.ggpht.com/
    https://lh6.ggpht.com/
    https://maps.googleapis.com
    https://maps.googleapis.com/maps/api/js/GeoPhotoService.GetMetadata
    https://maps.googleapis.com/maps/api/js/GeoPhotoService.SingleImageSearch
    https://maps.googleapis.com/maps-api-v3/api/js/45/1a
    https://maps.googleapis.com/maps/vt
    https://maps.google.com
    https://maps.gstatic.com/mapfiles/
    https://maps.gstatic.com/maps-api-v3/api/images/
    https://mts.googleapis.com/maps/vt/icon
    https://static.panoramio.com.storage.googleapis.com/photos/
    https://www.google.com
    https://www.google.com/maps
    https://www.google.com/maps/preview/log204
    https://www.google.com/maps/vt


很明显，如果只是对主域名[maps.googleapis.com](maps.googleapis.com)用`nginx`做反向代理的话，这个api中的上述url调用地址并不能被代理。

因此，我们需要做字符串替换，将上述url的域名部分替换为自己的反向代理域名。幸运的是，有开发者为`nginx`做了个字符串替换的模块[replace-filter-nginx-module](https://github.com/openresty/replace-filter-nginx-module)，可参见本文开头的[准备工作](#准备工作)部分。

<br>

# 步骤二  子域名配置文件生成 

通过[步骤一](#步骤一-分析)的分析，我们现在可以很容易地编写出字符串替换和反向代理的`nginx`配置文件。理论上我们建立一个子域名+n个location配置即可，但通过web调试分析，以下域名下第一级目录的有重复性。

```
maps.googleapis.com/maps-api-v3
maps.googleapis.com/maps
maps.google.com/maps-api-v3
maps.gstatic.com/maps-api-v3
www.google.com/maps
```
因此，为了完美使用，我们最好同时为建立4个子域名对应这4个google的域名，对应关系如下。

| google域名 | 反代域名 | nginx域名配置 |
| :---: | :---: | :---: |
| maps.googleapi.com | v1.sample.com | include vhost/location_v1_conf.txt; |
| maps.google.com | v2.sample.com | include vhost/location_v2_conf.txt; |
| maps.gstatic.com | v3.sample.com | include vhost/location_v3_conf.txt; |
| www.google.com | v4.sample.com | include vhost/location_v4_conf.txt; |

<br>

这里我们写一个简单的脚本[googleapi.sh](#附-googleapish源码)来一键生成配置文件， 然后运行`googleapi.sh`将得到的配置文件全部`cp`到nginx的配置文件folder里`/usr/local/nginx/conf/vhost`。并在`v1.sample.com.conf`, `v2.sample.com.conf`，`v3.sample.com.conf`，`v4.sample.com.conf`分别添加一行`include vhost/location_v?_conf.txt;` (见上对应关系表)，将配置文件包含进这4个反代域名。

完成后，在调用谷歌地图api时将maps.googleapi.com改成反向代理的域名`v1.sample.com`， 然后重启nginx服务器`systemctl restart nginx`，测试成功一切完美，包括所有地图图层、街景、地标图片等在墙内均正常显示。可参见本站例子-[联系方式](https://hansyao.github.io/contact/)中的谷歌地图。

`googleapi.sh`运行显示结果如下：
```bash
chmod 755 googleapi.sh
➜  ./googleapi.sh

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  131k    0  131k    0     0  50425      0 --:--:--  0:00:02 --:--:-- 50406

-------------------------------------------------------------------
completed configuration for Google Map APIs, what you need to do as below:

API_URL: https://v1.sample.com/maps/api/js?key=yourapikey , please follow this link to see where replace effecively

location header: location_header.txt
location header: location_header_host_v2.txt
location header: location_header_host_v3.txt
location header: location_header_host_v4.txt
location file: location_v1_conf.txt
location file: location_v2_conf.txt
location file: location_v3_conf.txt
location file: location_v4_conf.txt

replace file: replace_conf_v1.txt
replace file: replace_conf_v2.txt
replace file: replace_conf_v3.txt
replace file: replace_conf_v4.txt

Four domains need to be configured!
Domain conf file: v1.sample.com.conf for maps.googleapis.com
Domain conf file: v2.sample.com.conf for maps.google.com
Domain conf file: v3.sample.com.conf for www.google.com
Domain conf file: v4.sample.com.conf for maps.gstatic.com

----------------------------------------------------
1. add include vhost/locationfile;  in your nginx domain config
2. cp  locationfile  and  replacefile  to nginx config path (eg. /usr/local/nginx/conf/vhost/)
3. then systemctl restart nginx, all done.....

```

## 附： `googleapi.sh`源码

```bash
#!/bin/bash

# wrote by Hans Yao
# date: 2021-05-18

apiurl=https://maps.googleapis.com/maps/api/js?key=
apikey=yourapikey

# jq version - 1.6
jq=/usr/bin/jq

maps_googleapis_com=v1.sample.com
maps_google_com=v2.sample.com
www_google_com=v3.sample.com
maps_gstatic_com=v4.sample.com


apiurlist=googleapiurl.txt
domain_with_location=domain_with_location.txt
domainlist=domainlist.txt

replacefile_header=replace_header.txt
replacefile_v1=replace_conf_v1.txt
replacefile_v2=replace_conf_v2.txt
replacefile_v3=replace_conf_v3.txt
replacefile_v4=replace_conf_v4.txt

location_header=location_header.txt
location_header_host_v2=location_header_host_v2.txt
location_header_host_v3=location_header_host_v3.txt
location_header_host_v4=location_header_host_v4.txt
locationfile_v1=location_v1_conf.txt
locationfile_v2=location_v2_conf.txt
locationfile_v3=location_v3_conf.txt
locationfile_v4=location_v4_conf.txt

# # get urllist:
curl -H POST $apiurl | grep "apiLoad(\[" | cut -d \( -f 2|sed 's/, loadScriptTime);//g' | $jq -r | grep https:// |awk -F'"' '{print $2}'| sort -n | uniq > $apiurlist

# # get domain_with_location (column1: domain; column2: location )
cat $apiurlist | awk -F "?" '{print $1}' | awk -F "/" '{print $3,"/",$4}' | sort -n | uniq  >$domain_with_location


if [ -e $domainlist ]; then rm $domainlist; fi

# get domainlist to be replace
cat $apiurlist | awk -F'/' '{print $3}' | sort -n | uniq > $domainlist

# add addtional domainlist: optional - not a must which would be customized according to your requests
# (非必选项，只有当出现错误链接问题需要修正时才需要, 例如 fonts.googleapis.com fonts.gstatic.com 为了修正国内用户加载google字体也走反向代理)
cat >> $domainlist <<EOF
fonts.googleapis.com
fonts.gstatic.com
fonts.google.com
apis.google.com
www.gstatic.com
ssl.gstatic.com
tpc.googlesyndication.com
maps.gstatic.com
ssl.gstatic.com
ogs.google.com
play.google.com
khms.googleapis.com
khms1.google.com
khms2.google.com
khms3.google.com
developers.google.com
support.google.com
lh3.googleusercontent.com
lh5.googleusercontent.com
streetviewpixels-pa.googleapis.com
EOF

cat $domainlist | sort -n | uniq > tmpdomainlist.txt      #remove duplication
cp tmpdomainlist.txt  $domainlist     #save to new list
rm -rf tmpdomainlist.txt

if [ -e $replacefile_v1 ]; then rm $replacefile_v1; fi
if [ -e $replacefile_v2 ]; then rm $replacefile_v2; fi
if [ -e $replacefile_v3 ]; then rm $replacefile_v3; fi
if [ -e $replacefile_v4 ]; then rm $replacefile_v4; fi
if [ -e $replacefile_header ]; then rm $replacefile_header; fi

if [ -e $locationfile_v1 ]; then rm $locationfile_v1; fi
if [ -e $locationfile_v2 ]; then rm $locationfile_v2; fi
if [ -e $locationfile_v3 ]; then rm $locationfile_v3; fi
if [ -e $locationfile_v4 ]; then rm $locationfile_v4; fi
if [ -e $location_header ]; then rm $location_header; fi

# initiate replace header
cat > $replacefile_header <<EOF
replace_filter_max_buffered_size 500k;
replace_filter_last_modified keep;
replace_filter_types  text/javascript application/javascript text/css;
EOF

cat $replacefile_header > $locationfile_v1
cat $replacefile_header > $locationfile_v2
cat $replacefile_header > $locationfile_v3
cat $replacefile_header > $locationfile_v4

# initiate location header
cat > $location_header <<EOF
proxy_set_header User-Agent \$http_user_agent;
proxy_set_header Accept-Encoding "";
proxy_set_header X-Real-IP \$remote_addr;
proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto https;
proxy_set_header Accept-Language "zh-CN";
EOF


lines=$(cat $domainlist | wc -l)
i=1
while (($i<=$lines))
do
    # echo -e line$i
    domain[$i]=$(cat $domainlist | sed -n $i\p)
    # echo ${domain[$i]}
    str=$(cat /proc/sys/kernel/random/uuid  | md5sum |cut -c 1-20)  #生成20个随机字符作为反代location地址
    if [[ ${domain[$i]}  == "maps.googleapis.com" ]]; then          #v1.sample.com

        echo -e replace_filter ${domain[$i]} $maps_googleapis_com ig\; >> $replacefile_v1
        echo -e replace_filter ${domain[$i]} $maps_googleapis_com ig\; >> $replacefile_v2
        echo -e replace_filter ${domain[$i]} $maps_googleapis_com ig\; >> $replacefile_v3
        echo -e replace_filter ${domain[$i]} $maps_googleapis_com ig\; >> $replacefile_v4

        echo -e location /maps/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/maps/\; include vhost/$replacefile_v1\; \} >> $locationfile_v1
        echo -e location /maps-api-v3/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/maps-api-v3/\; include vhost/$replacefile_v1\; \} >> $locationfile_v1

    elif [[ ${domain[$i]}  == "script.google.com" ]]; then          #v1.sample.com

        echo -e replace_filter ${domain[$i]} $maps_googleapis_com ig\; >> $replacefile_v1
        echo -e replace_filter ${domain[$i]} $maps_googleapis_com ig\; >> $replacefile_v2
        echo -e replace_filter ${domain[$i]} $maps_googleapis_com ig\; >> $replacefile_v3
        echo -e replace_filter ${domain[$i]} $maps_googleapis_com ig\; >> $replacefile_v4

        echo -e location /macros/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/macros/\; include vhost/$replacefile_v1\; \} >> $locationfile_v1

    elif [[ ${domain[$i]}  == "maps.google.com" ]]; then            #v2.sample.com

        echo -e replace_filter ${domain[$i]} $maps_google_com ig\; >> $replacefile_v1
        echo -e replace_filter ${domain[$i]} $maps_google_com ig\; >> $replacefile_v2
        echo -e replace_filter ${domain[$i]} $maps_google_com ig\; >> $replacefile_v3
        echo -e replace_filter ${domain[$i]} $maps_google_com ig\; >> $replacefile_v4


        # initiate location header with host
        echo proxy_set_header  Host  \"${domain[$i]}\"\;  >$location_header_host_v2
        cat $location_header >>$location_header_host_v2
        
        echo -e location / \{ include vhost/$location_header_host_v2\; proxy_pass https://${domain[$i]}/\; include vhost/$replacefile_v2\; \} >> $locationfile_v2
        echo -e location /maps/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/maps/\; include vhost/$replacefile_v2\; \} >> $locationfile_v2
        echo -e location /maps-api-v3/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/maps-api-v3/\; include vhost/$replacefile_v2\; \} >> $locationfile_v2

    elif [[ ${domain[$i]}  == "www.google.com" ]]; then             #v3.sample.com

        echo -e replace_filter ${domain[$i]} $www_google_com ig\; >> $replacefile_v1
        echo -e replace_filter ${domain[$i]} $www_google_com ig\; >> $replacefile_v2
        echo -e replace_filter ${domain[$i]} $www_google_com ig\; >> $replacefile_v3
        echo -e replace_filter ${domain[$i]} $www_google_com ig\; >> $replacefile_v4

        # initiate location header with host
        echo proxy_set_header  Host  \"${domain[$i]}\"\;  >$location_header_host_v3
        cat $location_header >>$location_header_host_v3
        
        echo -e location / \{ include vhost/$location_header_host_v3\; proxy_pass https://${domain[$i]}/\; include vhost/$replacefile_v3\; \} >> $locationfile_v3
        echo -e location /maps/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/maps/\; include vhost/$replacefile_v3\; \} >> $locationfile_v3
        echo -e location /maps-api-v3/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/maps-api-v3/\; include vhost/$replacefile_v3\; \} >> $locationfile_v3

    elif [[ ${domain[$i]}  == "maps.gstatic.com" ]]; then           #v4.sample.com

        echo -e replace_filter ${domain[$i]} $maps_gstatic_com ig\; >> $replacefile_v1
        echo -e replace_filter ${domain[$i]} $maps_gstatic_com ig\; >> $replacefile_v2
        echo -e replace_filter ${domain[$i]} $maps_gstatic_com ig\; >> $replacefile_v3
        echo -e replace_filter ${domain[$i]} $maps_gstatic_com ig\; >> $replacefile_v4

        echo proxy_set_header  Host  \"${domain[$i]}\"\;  >$location_header_host_v4
        cat $location_header >>$location_header_host_v4
        
        echo -e location / \{ include vhost/$location_header_host_v4\; proxy_pass https://${domain[$i]}/\; include vhost/$replacefile_v4\; \} >> $locationfile_v4
        echo -e location /maps/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/maps/\; include vhost/$replacefile_v4\; \} >> $locationfile_v4
        echo -e location /maps-api-v3/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/maps-api-v3/\; include vhost/$replacefile_v4\; \} >> $locationfile_v4
        echo -e location /mapfiles/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/mapfiles/\; include vhost/$replacefile_v4\; \} >> $locationfile_v4
        echo -e location /tactile/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/tactile/\; include vhost/$replacefile_v4\; \} >> $locationfile_v4

    elif [[ ${domain[$i]}  == "" ]]; then break;

    else

        echo -e replace_filter ${domain[$i]} $maps_googleapis_com/$str ig\; >> $replacefile_v1
        echo -e replace_filter ${domain[$i]} $maps_google_com/$str ig\; >> $replacefile_v2
        echo -e replace_filter ${domain[$i]} $www_google_com/$str ig\; >> $replacefile_v3
        echo -e replace_filter ${domain[$i]} $maps_gstatic_com/$str ig\; >> $replacefile_v4

        echo -e location /$str/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/\; include vhost/$replacefile_v1\; \} >> $locationfile_v1
        echo -e location /$str/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/\; include vhost/$replacefile_v2\; \} >> $locationfile_v2
        echo -e location /$str/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/\; include vhost/$replacefile_v3\; \} >> $locationfile_v3
        echo -e location /$str/ \{ include vhost/$location_header\; proxy_pass https://${domain[$i]}/\; include vhost/$replacefile_v4\; \} >> $locationfile_v4
    fi

    let "i++"

done
        # add proxy pass for script.google.com in location_file_v1
        echo -e location /macros/ \{ include vhost/$location_header\; proxy_pass https://script.google.com/macros/\; include vhost/$replacefile_v1\; \} >> $locationfile_v1


echo ""
echo "-------------------------------------------------------------------"
echo "completed configuration for Google Map APIs, what you need to do as below:"
echo ""
echo -e "API_URL: https://\\033[41;20m$maps_googleapis_com\033[0m/maps/api/js?key=\\033[41;20m$apikey\033[0m" , please follow this link to see where replace effecively
echo -e ""
echo -e "location header: $(pwd)/\\033[41;20m$location_header\033[0m"
echo -e "location header: $(pwd)/\\033[41;20m$location_header_host_v2\033[0m"
echo -e "location header: $(pwd)/\\033[41;20m$location_header_host_v3\033[0m"
echo -e "location header: $(pwd)/\\033[41;20m$location_header_host_v4\033[0m"

echo -e "location file: $(pwd)/\\033[41;20m$locationfile_v1\033[0m"
echo -e "location file: $(pwd)/\\033[41;20m$locationfile_v2\033[0m"
echo -e "location file: $(pwd)/\\033[41;20m$locationfile_v3\033[0m"
echo -e "location file: $(pwd)/\\033[41;20m$locationfile_v4\033[0m"
echo -e ""
echo -e "replace file: $(pwd)/\\033[41;20m$replacefile_v1\033[0m"
echo -e "replace file: $(pwd)/\\033[41;20m$replacefile_v2\033[0m"
echo -e "replace file: $(pwd)/\\033[41;20m$replacefile_v3\033[0m"
echo -e "replace file: $(pwd)/\\033[41;20m$replacefile_v4\033[0m"
echo -e  ""
echo -e "Four domains need to be configured!"
echo -e "Domain conf file: $(pwd)/\\033[41;20m$maps_googleapis_com.conf\033[0m for maps.googleapis.com"
echo -e "Domain conf file: $(pwd)/\\033[41;20m$maps_google_com.conf\033[0m for maps.google.com"
echo -e "Domain conf file: $(pwd)/\\033[41;20m$www_google_com.conf\033[0m for www.google.com"
echo -e "Domain conf file: $(pwd)/\\033[41;20m$maps_gstatic_com.conf\033[0m for maps.gstatic.com"


echo -e  ""
echo -e "----------------------------------------------------"
echo -e "1. add include \\033[41;20mvhost/locationfile; \033[0m in your nginx domain config"
echo -e "2. cp \\033[41;20m locationfile \033[0m and \\033[41;20m replacefile \033[0m to nginx config path (eg. /usr/local/nginx/conf/vhost/)"
echo -e "3. then \\033[41;20msystemctl restart nginx\033[0m, all done....."

```


