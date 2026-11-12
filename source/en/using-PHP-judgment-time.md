---
title: "Loading Different CSS or JS Depending on the Time with PHP"
date: 2011-01-02 23:23:59
permalink: "en/technology/2011/01/02/using-PHP-judgment-time.html"
layout: translation
lang: en
original: "_posts/using-PHP-judgment-time.md"
source_hash: 74e3ff81630654bdc0002deff4f71b2834bd88ba
translation_hash: fbdbf69c6854ce98fd4934cb56b55433b68d007d
translated_by: claude-opus-5-5
---
On a whim, I tweaked my CSS so that it loads by time of day. The time here is Beijing time. Here's the code<!-- more -->

``` php
<?php $hc = date("H");if ($hc >= 0 && $hc < 10) { ?> //判断时间

<link rel="stylesheet" href="<?php bloginfo('template_directory'); ?>/style.css" type="text/css" media="screen" />

<?php } else { ?>

<link rel="stylesheet" href="<?php bloginfo('template_directory'); ?>/night.css" type="text/css" media="screen" />

<?php } ?>  

{% endhighlight %}

  其他非WordPress主题也适用（PHP），只要稍稍的修改一下子啦~

{% highlight PHP %}

<?php $hc = date("H");if ($hc >= 0 && $hc < 10) { ?> //判断时间

<link rel="stylesheet" href="你的CSS的路径/style.css" type="text/css" media="screen" />

<?php } else { ?>

<link rel="stylesheet" href="你的CSS的路径/night.css" type="text/css" media="screen" />

<?php } ?>

{% endhighlight %}

  同时也可以判断时间加载不同的JS

{% highlight PHP %}

<?php $hc = date("H");if ($hc >= 0 && $hc < 10) { ?>

<script type="text/javascript" src="javascript路径"></script>

<?php } else { ?>

<script type="text/javascript" src="javascript路径"></script>

<?php } ?>
```
