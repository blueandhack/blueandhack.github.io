---
title: "Installing SNMP on CentOS: A Detailed Guide to Monitoring Server Performance with Jiankongbao"
date: 2010-09-09 15:23:04
permalink: "en/technology/2010/09/09/how-to-install-snmp-in-CentOS.html"
layout: translation
lang: en
original: "_posts/how-to-install-snmp-in-CentOS.md"
source_hash: 70e800fdac4635ef19811584e70c02dab39b4820
translation_hash: 3cb9c59ee0cce9e0f1e3a9a05950bfcf21c65cf8
translated_by: claude-opus-5-5
---

This morning my VPS was down for 7 hours and I couldn't figure out why, so I decided I'd just use Jiankongbao for monitoring~ It saves some trouble. Hence the following…… First, install snmp <!-- more -->

``` bash
yum install -y net-snmp net-snmp-utils
```



Then configure snmp. Step one: (with a yum install the config file is /etc/snmp/snmpd.conf. It's full of stuff, a very detailed document, but I always find an excuse not to read it carefully. So move it out of the way first, then create your own snmpd.conf) 

``` bash
mv /etc/snmp/snmpd.conf /etc/snmp/snmpd.conf.bak
vi /etc/snmp/snmpd.conf
```

Enter "rouser jiankongbao auth", then save and quit. (This is v3c authentication, adding a read-only account as follows: rouser jiankongbao auth. What that line means: in v3c, "rouser" indicates a read-only account type, the following "jiankongbao" is the chosen username, and the "auth" after it says authentication is required.) Step two: we need to create the user jiankongbao. For that we need the file /var/net-snmp/snmpd.conf, which is loaded automatically when snmpd starts. Since we haven't run snmp yet, create the file by hand with these commands: 

``` bash
mkdir /var/net-snmp
touch /var/net-snmp/snmpd.conf
vi /var/net-snmp/snmpd.conf
```

Enter the following text 

``` bash
createUser jiankongbao MD5 mypassword
```



(This line creates a user named "jiankongbao" with the password "mypassword", using MD5 for encrypted transmission. One reminder: the password must be at least 8 bytes long. That's required by the SNMP protocol; if it's shorter than 8 bytes, communication won't work.) Finally, start snmp 

``` bash
service snmpd start
```



Set it to start automatically at boot 

``` bash
chkconfig snmpd on
```



Now you can add server monitoring in the Jiankongbao dashboard. For the detailed Jiankongbao settings, see Jiankongbao's blog post [Enabling a Secure SNMP Agent on a Linux Server](https://web.archive.org/web/20100728080252/http://blog.jiankongbao.com/?p=160) 

PS: ![Lu Xun](https://cdn.blueandhack.com/images/2010/09/how-to-install-snmp-in-CentOS/e284aca8cd58b9c21f17a2e41_thumb.gif)

Lu Xun. It took the Party 60 years to figure out who Lu Xun was cursing, and just a few months to erase him from the textbooks. A nation short on national heroes is a sad thing indeed. A few fewer radicals, a few fewer leftists, a few fewer angry young men, a few fewer…… does that make the country safe? Ridiculous! Sad. I can't go into politics. I'd like to, but once I sat in that seat, maybe I'd end up just like him. Anyone could fill that seat! There's a whole crowd underneath helping him out! The PS above is purely for fun!
