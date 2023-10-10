---
layout: post
title: 一句话打印菱形
post_id: 1608
date: 2013-06-20 00:04:59
categories: 
- technology
tags:
- C
- programming
---

之前在[pwhack](http://www.pwhack.me/archives/print_rhombus.html)的博客里看到的。 虽然他是Go语言写的，但是对于这道经典例题来说，用C有很多种写法。 于是我想看看这道题目最简单的到底可以多简单。 于是搜到一段代码 <!-- more -->

``` c
#include "stdio.h"

int line = 1; 

int main() { 

	printf("%s\n",7-(line>4? line-4: 4-line),"**"+2*(line>4? line-4:4-line)); 

	if(++line != 8) main(); 

	return 0; 

} 
```

### 你会发出疑问在printf()中的*是什么？

其实*是修饰符，可以在scanf()和printf()中使用。 *在scanf中的作用是跳过... 例如：  

`scanf("%*d %*d %d",&n;); printf("%d",n);`

这样当输入1 2 3的时候，只会存储n，正常打印3 *在printf("%*d"，width,n);这样因为是 * d 的顺序，所以width实际表达的是 n的输出宽度，n才是要输出的内容。 例如： ` int n=3; scanf("%d",width); printf("%*d",width,n); ` 当输入2时，打印 `(空格)3`

### 也许你会问，`"*******"+2*(line>4? line-4:4-line)`是什么意思？

其实认真看一下，就是一个字符串指针加上一个int整数，也就是指针的平移。 比如line=1第一行时，2*(line>4? line-4:4-line)即为6，也就是7个星号的字符串指针平移6个，所以输出一个星号了。 这算是我见过最简单的一句话打印菱形了。如果还有更简单的，你可以在这里告诉我。