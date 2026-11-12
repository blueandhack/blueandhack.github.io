---
title: "Printing a Diamond in One Line"
date: 2013-06-20 00:04:59
permalink: "en/technology/2013/06/20/print-diamond.html"
layout: translation
lang: en
original: "_posts/print-diamond.md"
source_hash: 0e6a2843290e9970b4814e46b4908910ccd8951d
translation_hash: 0e0ed55b92db58b2886b9c1f1dae5833e86573ea
translated_by: claude-opus-5-5
---
I first saw this on [pwhack](https://web.archive.org/web/20130629201540/http://www.pwhack.me/archives/print_rhombus.html)'s blog. He wrote it in Go, but for a classic exercise like this there are lots of ways to do it in C. So I wanted to see just how short the simplest version of this problem could get. And then I found this snippet <!-- more -->

``` c
#include "stdio.h"

int line = 1; 

int main() { 

	printf("%s\n",7-(line>4? line-4: 4-line),"**"+2*(line>4? line-4:4-line)); 

	if(++line != 8) main(); 

	return 0; 

} 
```

### You might be wondering: what's the * doing in printf()?

Actually, * is a modifier, and you can use it in both scanf() and printf(). In scanf, * means skip... For example:  

`scanf("%*d %*d %d",&n;); printf("%d",n);`

So when you type 1 2 3, only n gets stored, and it prints 3 as normal. With * in printf("%*d"，width,n);, because the order is * then d, width actually sets the output width of n, and n is what gets printed. For example: ` int n=3; scanf("%d",width); printf("%*d",width,n); ` When you type 2, it prints `(空格)3`

### Maybe you're asking what `"*******"+2*(line>4? line-4:4-line)` means?

If you look closely, it's just a string pointer plus an int, in other words shifting the pointer. For example, when line=1 on the first row, 2*(line>4? line-4:4-line) comes out to 6, so the pointer to the 7-star string shifts by 6 and only one star gets printed. This is the shortest one-liner diamond I've ever seen. If you know a shorter one, tell me here.
