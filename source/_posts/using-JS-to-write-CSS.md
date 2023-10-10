---
layout: post
title: 用JS写CSS 
id: 1168
date: 2010-10-22 01:34:14
categories: technology
tags:
- Javascript
- programming
---

完全的伪技术~从某人的博客的JS文件里学习到的~所以本着共享的精神，分享一下啦！其实我也不知道这种技术叫啥~~囧……直接上代码了！<!-- more -->

``` javascript
//留言问题

css_string = '#comments{word-wrap: break-word; /解决留言不换行的问题/}';//第一句没有+号

//链接背景延迟

css_string += 'a:hover {-webkit-transition: all 1s;}';//有+号的是第二句以后才写的

//相关文章

css_string += 'h2,h3,#about';

css_string += '{text-shadow:2px 2px 2px #84C1FF}';

//lightbox

css_string += '#lightbox-nav-btnPrev, #lightbox-nav-btnNext {zoom: 1;}';

//标题

css_string += 'h1';

css_string += '{text-shadow:2px 2px 2px #84C1FF;font-weight: bold;}';

//头部

css_string += '#header, .description{text-shadow:2px 2px 2px #84C1FF;font-weight: bold;}';

//头像

css_string += '.avatar';

css_string += '{-moz-box-shadow: rgba(0,0,0,.8) 1px 5px 7px; -webkit-box-shadow: rgba(0,0,0,.8) 1px 5px 7px; -khtml-box-shadow: rgba(0,0,0,.8) 1px 5px 7px; box-shadow: rgba(0,0,0,.8) 1px 5px 7px;}';

//文章里的截图

css_string += 'a img';

css_string += '{opacity: 0.9; -webkit-transition: all 0.2s ease-out;}';

css_string += 'a:hover img { opacity: 1; -moz-transform: scale(1.05) rotate(2deg); -webkit-transform: scale(1.05) rotate(2deg); -o-transform: scale(1.05) rotate(2deg); }';

document.write('<style type="text\/css">' + css_string + '<\/style>'); //记得最后一句一定要写，别忘记了

//要注意的问题写成注释了……


```

为了通过W3C的CSS 3.0的认证，为了自慰一下，为了装X一下，为了……（为了很多很多一下），我就把不能通过CSS 3.0验证的样式丢到JS里了……好蛋疼啊……其中有些是CSS 3中的特效。

听说很多人用JS写CSS，来通过了W3C能自慰一下，又能进行兼容。

文囧完毕~~关灯睡觉……