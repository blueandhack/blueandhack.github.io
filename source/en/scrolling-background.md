---
title: "Floating Clouds, It's All Just Floating Clouds (Making a Background Image Scroll with jQuery)"
date: 2010-10-13 21:24:47
permalink: "en/technology/2010/10/13/scrolling-background.html"
layout: translation
lang: en
original: "_posts/scrolling-background.md"
source_hash: 17727e6882fc5146c5839947cdb1004062fc5859
translation_hash: 572d5b926aead0c0fbcd667f7add12cf4c4a131a
translated_by: claude-opus-5-5
---
This one comes from a post by fellow blogger MOPVHS, [jQuery(Making a background image scroll](https://web.archive.org/web/20101010061923/http://www.tulongzhiji.com/mopvhs/2010/04/02/jquery%e8%ae%a9%e8%83%8c%e6%99%af%e5%9b%be%e7%89%87%e6%bb%91%e5%8a%a8%e8%b5%b7%e6%9d%a5/). It looked pretty nice, so I started tinkering with it.  Floating clouds, these are floating clouds, take a look:<!-- more -->

![Floating clouds](https://cdn.blueandhack.com/wp-content/uploads/2010/10/image_thumb5.png)

The clouds in the background are drifting, so these really are floating clouds. Now, straight to the point: first find a background. I ripped mine off some theme. Put it in the images folder in your theme directory. First you need to load the jQuery library, then load this jQuery effect. The code is below:

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

Next, add this CSS to your theme's style.css:

``` css
#clouds { background:url('images/clouds_header.jpg') repeat-x scroll 0 0 transparent; width:100%; }
```

Then in the header, right after the body tag, add

``` html
<div id="clouds">
```

Then in the footer, right before the closing body tag, add

``` html
</div>
```
