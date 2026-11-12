---
title: "Getting CNZZ Analytics to Pass W3C Validation"
date: 2010-09-14 19:09:40
permalink: "en/technology/2010/09/14/fix-CNZZ-code.html"
layout: translation
lang: en
original: "_posts/fix-CNZZ-code.md"
source_hash: b1a8defd70d93a43a1086d3649bba4a3d2c545c4
translation_hash: e975babdb1feed9c319ca2d8f2073f667cf8a61a
translated_by: claude-opus-5-5
---
Just a quick note~ I was tinkering with my wordpress again, because the CNZZ analytics code isn't standards-compliant~ so I had to modify it~ to get CNZZ to pass W3C validation.

Here's the original code

``` javascript
<script src="http://s94.cnzz.com/stat.php?id=1979318&web_id=1979318" language="JavaScript"></script>
```

Then I changed it to the following

``` javascript
<script type="text/javascript" src='http://s94.cnzz.com/stat.php?id=1979318&web_id=1979318' language='JavaScript' charset='gb2312'></script>
```

Most analytics code has the following problems:

1.Every & in URLs and text has to be replaced with &amp

2.All attributes and tag names must be lowercase, and you need to specify the "type", note the double quotes

3.Image img tags must have an alt attribute

4.Line breaks must use ```<br />```

After carefully fixing these, it will pass validation
