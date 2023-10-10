---
layout: post
title: VPS CentOS系统安装DirectAdmin面板
id: 924
date: 2010-08-31 02:52:11
categories: technology
tags:
- CentOS
- DirectAdmin
- blog
---

终于买了VPS，今天才弄好……买的DirectAdmin面板的授权，然后安装，话说折腾了两个小时，终于折腾好了，然后汉化又出了问题，多亏船长大牛，给我弄好了~~嘿嘿~~ 现在说说CentOS 5.5怎么安装DirectAdmin面板吧。 首先需要一个干净的CentOS系统，我选择的是 <!-- more -->

![CentOS](https://cdn.blueandhack.com/wp-content/uploads/2010/08/image_thumb16.png)

第一步、安装CentOS的相关组件 先运行命令 

`yum update –y`

然后运行 

`yum -y  install gcc gcc-c++ flex make perl quota automaker`

PS：更具系统的情况，有些VPS会缺少很多组件，所以要更具提示安装。 第二步、CentOS是附带了httpd的unix版本，但是因为directadmin的安装需要干净的系统，所以在装之前要反安装httpd,php,mysql这些web组件 

`yum remove httpd* php* mysql* -y`

第三步、正式进入安装 运行此命令，获得安装脚本 

`wget http://www.directadmin.com/setup.sh`

给予脚本权限 

`chmod +x setup.sh`

运行脚本 

`./setup.sh`

运行之后要你输入相关的授权信息等，如： Please enter your Client ID : Please enter your License ID : Please enter your hostname \(server.domain.com\) 以及授权的ip地址等！ 运行到：Enter your choice (1 or 2):的时候我选2 应该都是输入y然后按回车 关于网上的这一步，我没有遇到，所以省略…… /* 独立服务器到这里就可以结束了，vps到这里是打不开的，还需要一个步骤： 配置网络设备： 执行ifconfig命令查看VPS的IP地址，这个IP地址所绑定的设备就是我们需要记录下来的，例如venet0:0(OpenVZ的VPS要这样改，XEN不需要) 我安装时查到的ip设备值也是venet0:0 看来大多数的vps都是这个吧！ 用vi打开DirectAdmin的配置文件/usr/local/directadmin/conf/directadmin.conf 

``` bash
vi /usr/local/directadmin/conf/directadmin.conf
```

找到```ethernet_dev=***```这样的字符，然后把等号后面的字符改为刚才我们查看到的venet0:0，然后保存退出vi。 */ 然后重启Linux使我们的更改生效，重启之后在浏览器里面输入http://ip:2222，如果你看到一个登陆框，那就说明DirectAdmin安装成功了。（记得一定要重启，杯具的我就是没重启，导致无法打开控制面板） 然后是DirectAdmin面板的汉化了 首先下载一个工具 [fzftp.rar ](http://u.115.com/file/f44e9e63d1)用此工具链接VPS 然后下载 语言包[lang.zip ](http://u.115.com/file/f4b41c4060) 把语言包里的文件覆盖到 

``` bash
/usr/local/directadmin/data/skins/enhanced/lang
```

即可 修改 ```user.conf``` 

``` bash
vi /usr/local/directadmin/data/users/admin/user.conf
```

即可 好了一切完工喽~ 当当当……崭新的DirectAdmin面板出现在眼前了！ 

![DirectAdmin](https://cdn.blueandhack.com/wp-content/uploads/2010/08/image_thumb17.png)

最后再广告一下，现在VPS仍然合租，具体资源方案过几天再出 PS：麻烦各位ping一下 godvps.net 测测速度~ 报一下速度情况 本人小博过几天搬上VPS ，需要各位耐心等待了

