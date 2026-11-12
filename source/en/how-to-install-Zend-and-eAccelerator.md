---
title: "Installing Zend Opitimizer and eAccelerator on DirectAdmin"
date: 2010-10-02 00:38:34
permalink: "en/technology/2010/10/02/how-to-install-Zend-and-eAccelerator.html"
layout: translation
lang: en
original: "_posts/how-to-install-Zend-and-eAccelerator.md"
source_hash: c70d2d2923861ebed94c4fa64aa203549cc8ae0b
translation_hash: d6ed664eb1c8974f3a6def9623c59a68f49ffb2b
translated_by: claude-opus-5-5
---
Today I spent some time messing with my VPS and installed Zend Opitimizer and eAccelerator under DirectAdmin. Here's the tutorial I wrote. 

<!-- more -->

1. First, install Zend 

``` bash
cd /usr/local/src

mkdir zend

cd zend

wget http://downloads.zend.com/optimizer/3.3.3/ZendOptimizer-3.3.3-linux-glibc23-i386.tar.gz

tar -xzvf  ZendOptimizer-3.3.3-linux-glibc23-i386.tar.gz

cd ZendOptimizer-3.3.3-linux-glibc23-i386

./install.sh
```



Just keep hitting Enter~ no need to choose anything. Under /usr/local/lib, php.ini gets rewritten and saved, and a php.ini-zend_optimizer.bak file is saved as well 

2. Next, install eAccelerator

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



Edit php.ini 

``` bash
cd /usr/local/lib vi php.ini
```



Add this above [Zend] 

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

Restart Apache 

``` bash
service httpd restart
```

Finally 

``` bash
php -v
```



Check the final result 

``` 
Zend Engine v2.2.0, Copyright (c) 1998-2010 Zend Technologies with eAccelerator v0.9.6, Copyright (c) 2004-2010 eAccelerator, by eAccelera tor with Zend Extension Manager v1.2.2, Copyright (c) 2003-2007, by Zend Technol ogies with Zend Optimizer v3.3.3, Copyright (c) 1998-2007, by Zend Technologies
```

As long as you see the output above, everything's OK!
