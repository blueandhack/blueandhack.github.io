---
layout: post
title: DirectAdmin泛解析设置方法
id: 1325
date: 2011-01-06 04:13:02
categories: technology
tags:
- DirectAdmin
- blog
---

还是一个月以前的事了，DirectAdmin面板安装WordPress，然后开启多站点，由于DirectAdmin不支持*的子站添加，所以必须手动修改配置文件，这就是此篇文章的目的。  对于单个域名的设置 首先登录SSH（需要root权限） 输入一下命令 yourdomain.com 用你的域名替换 

``` bash
cd /usr/local/directadmin/data/users/yourdomain/
vi httpd.conf
```

找到 ``` ServerAlias www.yourdomain.com yourdomain.com ```

在后面添加: ``` *.yourdomain.com ```

如此变为 ``` ServerAlias www.yourdomain.com yourdomain.com *.yourdomain.com ```

保存，重启Apache，你的泛解析记录就生效了 PS:我发现我开始习惯用HTML写文章了……可视化编辑器真垃圾……