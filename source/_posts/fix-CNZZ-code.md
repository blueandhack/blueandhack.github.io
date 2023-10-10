---
layout: post
title: CNZZ统计通过W3C
id: 990
date: 2010-09-14 19:09:40
categories: technology
tags:
- programming
- HTML
---

小小的记录一下~又是折腾我的wordpress，因为CNZZ的统计代码不符合标准~所以只好改一改了~让CNZZ通过W3C认证。

原始代码露出来

``` javascript
<script src="http://s94.cnzz.com/stat.php?id=1979318&web_id=1979318" language="JavaScript"></script>
```

然后修改修改成如下

``` javascript
<script type="text/javascript" src='http://s94.cnzz.com/stat.php?id=1979318&web_id=1979318' language='JavaScript' charset='gb2312'></script>
```

一般的统计都有如下问题：

1.所有的网址和文本中的 & 要全部替换成 &amp

2.所有属性和标签字母要小写，要指定”type“类型，注意双引号

3.图片img标签必须要有 alt 参数

4.换行必须使用 ```<br />```

认真修改之后，就能通过认证了