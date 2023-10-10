---
layout: post
title: PHP根据时间加载不同的CSS或JS
id: 1315
date: 2011-01-02 23:23:59
categories: technology
tags:
- PHP
- programming
---

一时兴起，就改了一下CSS，分时间加载，这里的时间是北京时间。 代码如下<!-- more -->

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