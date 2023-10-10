---
layout: post
title: lnmp使用教程 & nginx伪静态规则
id: 965
date: 2010-09-07 23:59:33
categories: technology
tags:
- LNMP
- Linux
---

##### [2011年7月10日更新]

由于lnmp的升级，不需要再设置wordpress的伪静态了，这个其实很简单，不需要多少Linux知识就能弄懂的东西<!-- more -->

lnmp的安装不过多介绍~网上一堆…… 今天是帮助某童鞋转移站点，（此站点是wordpress）累了一天，由于是270MB内存，再加上他的站点IP上千上万，一开站就死机~内存占用完了……站点就咔嚓了！ 最后实在没办法就尝试lnmp吧~话说lnmp第一次用，在VPSYOU的后台安装了CentOS+lnmp版本的系统，很快两分钟系统装好了。 首先是数据库问题 这个似乎很简单  http://你的网站地址/phpmyadmin/ 点击里面的权限新建一个和原来数据库用户名一样的还有密码一样的用户 之后再建立一个一样的数据表，导入，一切OK！ 关于文件的转移，putty，用他就很好解决了！ 跟着我的命令来： 



``` bash
cd /home/wwwroot

进入根目录

wget http://原来地址/XXXX.zip

下载打包的文件到VPS中

unzip XXXX.zip

解压zip文件
```

一切OK！ 最后找到了nginx写伪静态的规则：

``` bash
location / {    
    index index.html index.php;
    if (-f $request_filename/index.html){
        rewrite (.*) $1/index.html break;
    }
    if (-f $request_filename/index.php){
        rewrite (.*) $1/index.php;
    }
    if (!-f $request_filename){
        rewrite (.*) /index.php;
    }
}
```

用putty登录VPS 输入 

``` bash
vi /usr/local/nginx/conf/nginx.conf
```



然后输入 i 就能插入字符了 然后按一下ESC键 输入 

``` bash
:w
```



回车保存 再输入 

``` bash
 :q
```



回车就离开了编辑界面 最后一定要记得重启nginx！ 

输入命令 

``` bash
/usr/local/nginx/sbin/nginx -s reload
```



PS：《秒速五厘米》高清版下载完了，有些小小的难受啊~ 唉~我要是能那样就好了……人生多那么的完美~