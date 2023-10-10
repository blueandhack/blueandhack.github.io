---
layout: post
title: DirectAdmin下安装Zend Opitimizer和eAccelerator
id: 1028
date: 2010-10-02 00:38:34
categories: technology
tags:
- Linux
- programming
---

今天折腾了一下VPS 给DirectAdmin下安装Zend Opitimizer和eAccelerator，下面就是我写的教程了。 

<!-- more -->

1，先安装Zend 

``` bash
cd /usr/local/src

mkdir zend

cd zend

wget http://downloads.zend.com/optimizer/3.3.3/ZendOptimizer-3.3.3-linux-glibc23-i386.tar.gz

tar -xzvf  ZendOptimizer-3.3.3-linux-glibc23-i386.tar.gz

cd ZendOptimizer-3.3.3-linux-glibc23-i386

./install.sh
```



一路回车~不需要选择什么，在/usr/local/lib  下，php.ini就被重写保存并且存储了一个php.ini-zend_optimizer.bak 文件 

2，接着安装eAccelerator

``` bash
yum install autoconf

yum install automake

cd /usr/local/src

mkdir eAccelerator

cd eAccelerator

wget http://bart.eaccelerator.net/source/0.9.6/eaccelerator-0.9.6.tar.bz2

tar -xvjf eaccelerator-0.9.6.tar.bz2

cd eaccelerator-0.9.6

export PHP_PREFIX="/data/webserver/php"

$PHP_PREFIX/bin/phpize

./configure --enable-eaccelerator=shared --with-php-config=$PHP_PREFIX/bin/php-config

make & make install

cd /tmp

mkdir eaccelerator

chmod 0777 eaccelerator
```



编辑 php.ini 

``` bash
cd /usr/local/lib vi php.ini
```



在[Zend]上面加 

``` bash
[eaccelerator]
zend_extension=”/usr/local/lib/php/extensions/no-debug-non-zts-20060613/eaccelerator.so”
eaccelerator.shm_size=”32″
eaccelerator.cache_dir=”/tmp/eaccelerator”
eaccelerator.enable=”1″
eaccelerator.optimizer=”1″
eaccelerator.check_mtime=”1″
eaccelerator.debug=”0″
eaccelerator.filter=”"
eaccelerator.shm_max=”0″
eaccelerator.shm_ttl=”0″
eaccelerator.shm_prune_period=”0″
eaccelerator.shm_only=”0″
eaccelerator.compress=”1″
eaccelerator.compress_level=”9″
```

重启apache 

``` bash
service httpd restart
```

最后 

``` bash
php -v
```



查看最后结果 

``` 
Zend Engine v2.2.0, Copyright (c) 1998-2010 Zend Technologies with eAccelerator v0.9.6, Copyright (c) 2004-2010 eAccelerator, by eAccelera tor with Zend Extension Manager v1.2.2, Copyright (c) 2003-2007, by Zend Technol ogies with Zend Optimizer v3.3.3, Copyright (c) 1998-2007, by Zend Technologies
```

只要显示以上内容，一切OK了！