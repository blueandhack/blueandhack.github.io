---
layout: post
title: 返回顶部功能之完美篇
id: 1070
date: 2010-10-14 02:12:44
categories: technology
tags:
- HTML
- blog
- programming
---

此文木木童鞋早已写过，但是还是再啰嗦的整理一遍。 直接切入正题：<!-- more -->

首先加载jquery（如果你的博客已经加载了，就不要重复加载jquery了）

``` javascript
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
```

然后新建一个名为huadong的js文件，在里面写入如下内容：

``` javascript

jQuery(document).ready(function($) {

 var s = $('#shangxia').offset().top;

$(window).scroll(function() {
    $("#shangxia").animate({
        top: $(window).scrollTop() + s + "px"
    },
    {
        queue: false,
        duration: 500
    })
});
$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
$('#shang').click(function() {
    $body.animate({
        scrollTop: '0px'
    },
    400)
});
$('#xia').click(function() {
    $body.animate({
        scrollTop: $('#footer').offset().top
    },
    400)
});
$('#comt').click(function() {
    $body.animate({
        scrollTop: $('#comments').offset().top
    },
    400)
});

});
```

然后在头部加载huadong.js文件：

``` javascript
<script type="text/javascript" src="http://blueandhack.com/wp-content/themes/white-love/js/huadong.js"></script>
```



在头部写下如下代码：

``` php

<?php if (is_home()) { ?>

<div id="shangxia"><div id="shang"></div><div id="xia"></div></div>

<?php } else { ?>

<div id="shangxia"><div id="shang"></div><div id="comt"></div><div id="xia"></div></div>

<?php } ?>
```

CSS代码，添加到主题的style.css里：

``` css

# shangxia{position:absolute;top:40%;left:50%;margin-left:-520px;display:block;}

# shang{background:url(images/huadong.gif) no-repeat;position:relative;cursor:pointer;height:42px;width:32px;margin:10px 0;}

# comt{background:url(images/huadong.gif) no-repeat center -45px;position:relative;cursor:pointer;height:32px;width:32px;margin:10px 0;}

# xia{background:url(images/huadong.gif) no-repeat center -78px;position:relative;cursor:pointer;height:42px;width:32px;margin:10px 0;}
```

要用到的图片（记得要放到主题里的images文件夹里）

![](http://lh4.ggpht.com/_PPQYFMSsqUA/TLX0VQ3heJI/AAAAAAAAAGo/PjsoigTtRRE/huadong.gif)

所有步骤都完成了，效果出来了吧，嘿嘿，木木的东西就是经典啊，原文地址 [“返回顶部”加强版代码及释义](http://immmmm.com/added-sliding-effect-enhanced.html) 为什么是完美篇，因为比木木的完善，素材都提供给你了，真的是很傻瓜化了。