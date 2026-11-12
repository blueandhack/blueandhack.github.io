---
title: "LNMP Tutorial & Nginx Rewrite Rules"
date: 2010-09-07 23:59:33
permalink: "en/technology/2010/09/07/LNMP-and-Nginx.html"
layout: translation
lang: en
original: "_posts/LNMP-and-Nginx.md"
source_hash: a57227c5d83efd4d3ae54b4828a94c3e3af73a92
translation_hash: 25aaa6e3da8846937b5b7eaf444cda194566005d
translated_by: claude-opus-5-5
---
##### [Updated July 10, 2011]

Since LNMP has been upgraded, you no longer need to set up rewrite rules for WordPress. It's actually really simple, the kind of thing you can figure out without much Linux knowledge<!-- more -->

I won't say much about installing LNMP~ there's tons online... Today I helped a buddy move his site (a WordPress site). It took me all day. With only 270MB of RAM, plus his site getting thousands and thousands of IPs, the server crashed the moment the site went up~ memory maxed out... and the site was toast! In the end I had no other option, so I tried LNMP~ This was my first time using LNMP. In the VPSYOU control panel I installed the CentOS + LNMP system image, and two minutes later the system was up. First, the database. This seems simple: go to http://你的网站地址/phpmyadmin/ (your site's address followed by /phpmyadmin/), click Privileges, and create a new user with the same username and password as the original database user. Then create an identical database, import, and everything's OK! As for moving the files, PuTTY makes it easy! Follow my commands: 



``` bash
cd /home/wwwroot

进入根目录

wget http://原来地址/XXXX.zip

下载打包的文件到VPS中

unzip XXXX.zip

解压zip文件
```

Everything's OK! Finally, I found the rewrite rules for nginx:

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

Log in to the VPS with PuTTY and enter 

``` bash
vi /usr/local/nginx/conf/nginx.conf
```



Then type i and you can insert text. Then press ESC and enter 

``` bash
:w
```



Press Enter to save, then enter 

``` bash
 :q
```



Press Enter and you'll leave the editor. Finally, be sure to remember to restart nginx! 

Enter the command 

``` bash
/usr/local/nginx/sbin/nginx -s reload
```



PS: I finished downloading the HD version of *5 Centimeters per Second*, and it left me feeling a little down~ Sigh~ If only my life could be like that... how perfect life would be~
