---
layout: post
title: 浮云，这就是浮云（jQuery让背景图片滑动起来）
id: 1066
date: 2010-10-13 21:24:47
categories: technology
tags:
- theme
- wordpress
- blog
---

此篇来自MOPVHS童鞋的文章，[jQuery(让背景图片滑动起来](http://www.tulongzhiji.com/mopvhs/2010/04/02/jquery%e8%ae%a9%e8%83%8c%e6%99%af%e5%9b%be%e7%89%87%e6%bb%91%e5%8a%a8%e8%b5%b7%e6%9d%a5/)，因为看起来不错，所以就折腾了起来。  浮云，这就是浮云，大家请看：<!-- more -->

![浮云](https://cdn.blueandhack.com/wp-content/uploads/2010/10/image_thumb5.png)

后面的云是在飘动的哦，此乃浮云也。下面直接接触正题： 首先找个背景，我的背景是从某个主题上扒下来的，添加到主题目录里的images文件夹中 首先加载要加载jquery库了。然后再加载此jquery特效，代码如下：

``` javascript
  var scrollSpeed = 70;
  var step = 1;
  var current = 0;
  var imageWidth = 2247;
  var headerWidth = 800;    

  var restartPosition = -(imageWidth - headerWidth);

  function scrollBg(){
    current -= step;
    if (current == restartPosition){
      current = 0;
    }

    $('#clouds').css("background-position",current+"px 0");
  }

  var init = setInterval("scrollBg()", scrollSpeed);
```

接着在主题的style.css里添加一段CSS代码：

``` css
#clouds { background:url('images/clouds_header.jpg') repeat-x scroll 0 0 transparent; width:100%; }
```

然后在头部的body之后，标签之后添加

``` html
<div id="clouds">
```

然后在底部的body闭合标签标签之前添加

``` html
</div>
```

