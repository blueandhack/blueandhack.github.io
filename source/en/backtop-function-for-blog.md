---
title: "The Perfect \"Back to Top\" Feature"
date: 2010-10-14 02:12:44
permalink: "en/technology/2010/10/14/backtop-function-for-blog.html"
layout: translation
lang: en
original: "_posts/backtop-function-for-blog.md"
source_hash: 9b86c0a4f9c3ddf5f8bc4fe333824cf69da0f8a6
translation_hash: 2419e1ebe63abd1a83c79fa0e837856bba932f94
translated_by: claude-opus-5-5
---

Mumu already wrote about this a while ago, but I'm going to ramble through it once more anyway. Let's get straight to the point:<!-- more -->

First, load jQuery (if your blog already loads it, don't load jQuery twice)

``` javascript
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
```

Then create a JS file named huadong and put the following in it:

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

Then load the huadong.js file in the header:

``` javascript
<script type="text/javascript" src="http://blueandhack.com/wp-content/themes/white-love/js/huadong.js"></script>
```



Put the following code in the header:

``` php

<?php if (is_home()) { ?>

<div id="shangxia"><div id="shang"></div><div id="xia"></div></div>

<?php } else { ?>

<div id="shangxia"><div id="shang"></div><div id="comt"></div><div id="xia"></div></div>

<?php } ?>
```

CSS code, add it to your theme's style.css:

``` css

# shangxia{position:absolute;top:40%;left:50%;margin-left:-520px;display:block;}

# shang{background:url(images/huadong.gif) no-repeat;position:relative;cursor:pointer;height:42px;width:32px;margin:10px 0;}

# comt{background:url(images/huadong.gif) no-repeat center -45px;position:relative;cursor:pointer;height:32px;width:32px;margin:10px 0;}

# xia{background:url(images/huadong.gif) no-repeat center -78px;position:relative;cursor:pointer;height:42px;width:32px;margin:10px 0;}
```

The image you'll need (remember to put it in the images folder inside your theme)

![](http://lh4.ggpht.com/_PPQYFMSsqUA/TLX0VQ3heJI/AAAAAAAAAGo/PjsoigTtRRE/huadong.gif)

That's every step done. The effect is working now, right? Hehe, Mumu's stuff really is a classic. Original post: ["Back to Top" enhanced code, with explanations](http://immmmm.com/added-sliding-effect-enhanced.html) Why call this the perfect version? Because it's more complete than Mumu's: I've given you all the materials, so it's truly foolproof.
