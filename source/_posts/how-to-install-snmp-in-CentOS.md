---
layout: post
title: CentOS安装snmp 使用监控宝监测服务器性能的详细安装设置的方法
id: 971
date: 2010-09-09 15:23:04
categories: technology
tags:
- CentOS
- Linux
---

今天早上VPS宕机7小时，找不出原因，于是我想还是用监控宝监控吧~省事一点。 于是就有了下篇…… 首先安装snmp <!-- more -->

``` bash
yum install -y net-snmp net-snmp-utils
```



然后配置snmp 第一步： （yum安装的配置文件为/etc/snmp/snmpd.conf ，里面一大堆东西，一份非常详细的文档，可是我总是有借口没去细看，先移动再说，再自己创建一个snmpd.conf） 

``` bash
mv /etc/snmp/snmpd.conf /etc/snmp/snmpd.conf.bak
vi /etc/snmp/snmpd.conf
```

输入“rouser jiankongbao auth”保存退出。 （v3c的验证方式,添加一个只读帐号，如下：rouser jiankongbao auth 上面 添加帐号的意思是：在v3c中，“rouser”用于表示只读帐号类型，随后的“jiankongbao”是指定的用户名，后边的“auth”指明需要验证。） 第二步：需要创建 jiankongbao这个用户，我们需要这个文件：/var/net-snmp/snmpd.conf,这个文件会在snmpd启动的时候被自动调用, 由于此时我们还没有运行snmp，所以手动创建这个文件，命令如下： 

``` bash
mkdir /var/net-snmp
touch /var/net-snmp/snmpd.conf
vi /var/net-snmp/snmpd.conf
```

输入以下文字 

``` bash
createUser jiankongbao MD5 mypassword
```



（这行配置的意思是创建一个名为 “jiankongbao”的用户，密码为“mypassword”，并且用MD5进行加密传输。这里要提醒的是，密码至少要有8个字节，这是SNMP协 议的规定，如果小于8个字节，通信将无法进行。） 最后运行snmp 

``` bash
service snmpd start
```



设置成开机自动运行 

``` bash
chkconfig snmpd on
```



现在可以在监控宝后台添加服务器监控了。 监控宝中具体设置，请看监控宝的博客 [在Linux服务器上开启安全的SNMP代理](http://blog.jiankongbao.com/?p=160) 

PS：![鲁迅](https://cdn.blueandhack.com/wp-content/uploads/2010/09/e284aca8cd58b9c21f17a2e41_thumb.gif)

鲁迅，党用了60年才弄懂鲁迅在骂谁，用了几个月的时间，将他从教科书上抹去，缺少民族英雄的民族，真是一种悲哀，少了点激进的人，少了点左派份子，少了点愤青，少了点……这个国家就安全了吗？可笑！悲哀，我无法从政，想去从政，但是当我坐上那个位置的时候，我也许就和他一样了，那个位置，给谁去做，都行的！下面一群人帮着他呢！ 以上PS纯属娱乐！

