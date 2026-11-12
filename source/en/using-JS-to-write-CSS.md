---
title: "Writing CSS with JS"
date: 2010-10-22 01:34:14
permalink: "en/technology/2010/10/22/using-JS-to-write-CSS.html"
layout: translation
lang: en
original: "_posts/using-JS-to-write-CSS.md"
source_hash: 91451d8f5e7c54f8879a93fbeb64293a8cf7c342
translation_hash: c226b3a087450e6f06ad86f617f8bc0be7888734
translated_by: claude-opus-5-5
---
Totally fake tech~ I picked it up from a JS file on someone's blog~ so in the spirit of sharing, here it is! Honestly I don't even know what this technique is called~~ awkward…… Straight to the code!<!-- more -->

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

To pass the W3C CSS 3.0 validator, to make myself feel good, to show off a little, to…… (to do lots and lots of things), I dumped all the styles that couldn't pass CSS 3.0 validation into JS…… How pointless is that…… Some of them are CSS3 effects.

I hear lots of people write CSS with JS so they can pass W3C and feel good about themselves, while keeping things compatible too.

End of this awkward post~~ Lights out, time to sleep……
