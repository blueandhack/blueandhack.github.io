---
title: "How to Set Up Wildcard Domains in DirectAdmin"
date: 2011-01-06 04:13:02
permalink: "en/technology/2011/01/06/domain-for-DirectAdmin.html"
layout: translation
lang: en
original: "_posts/domain-for-DirectAdmin.md"
source_hash: 7fe0146619857976570f52908f8abb389556453d
translation_hash: a54d2be59d2555cca154c8d68d5e29e9bea799f8
translated_by: claude-opus-5-5
---

This was something from a month ago. I installed WordPress on a DirectAdmin panel and turned on Multisite. Since DirectAdmin doesn't support adding * subdomains, you have to edit the config file by hand, which is what this post is about.  To set it up for a single domain, first log in over SSH (you need root) and enter the following commands, replacing yourdomain.com with your own domain 

``` bash
cd /usr/local/directadmin/data/users/yourdomain/
vi httpd.conf
```

Find ``` ServerAlias www.yourdomain.com yourdomain.com ```

Add this after it: ``` *.yourdomain.com ```

So it becomes ``` ServerAlias www.yourdomain.com yourdomain.com *.yourdomain.com ```

Save, restart Apache, and your wildcard record takes effect. PS: I've noticed I'm getting used to writing posts in HTML…… the visual editor is garbage……
