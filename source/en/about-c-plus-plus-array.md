---
title: "A Simple Question About C++ Arrays"
date: 2010-03-23 00:39:59
permalink: "en/technology/2010/03/23/about-c-plus-plus-array.html"
layout: translation
lang: en
original: "_posts/about-c-plus-plus-array.md"
source_hash: c3df64200a1fcff67ff2e3e921b940bfb68695bc
translation_hash: 450e073b75f93d588bdb4ef9bb506fc9457cf483
translated_by: claude-opus-5-5
---
Yesterday I actually got stumped by a dead-simple C++ question. Here it is. The question: 

``` c++
设有下定义的语句： [c]int a3={10,20,30,40,50,60}; int b3={10,20,30,40,50,60};[/c] 则a1*b2的结果为（） 
A）2000        B）1200      C）2400        D)3000
```

<!-- more -->

As it turned out, I just couldn't work it out. I mixed up the declared size with the index (something like that, anyway)~ Let me explain. For example: a[x][y]={}; x and y only tell the computer how much memory to allocate. They aren't addresses, and they don't count from 0, whereas the positions of the data are counted by address. For example, if you fill in numbers for a[2][3]={}, the addresses are a[0][0]    a[0][1]    a[0][2] a[1][0]    a[1][1]    a[1][2] and not a[1][1]    a[1][2]    a[1][3]  a[2][1]    a[2][2]    a[2][3] Remember that the computer counts from 0 in memory, and that's basically true across the whole C family. So the index and the allocated size are counted differently. Here's a screenshot of me checking it in VC++ ![Screenshot of the check](https://cdn.blueandhack.com/images/2010/03/about-c-plus-plus-array/thumb3.jpg) The answer is C) 2400. Here's the code I used to check it: 

``` c++

// 数组测试.cpp

//

#include "stdafx.h";

#include "iostream";

using namespace std;

void main()

{

int a[3][2]={10,20,30,40,50,60};
int b[3][2]={10,20,30,40,50,60};
cout<<a[1][1]*b[2][1];
}

```



If anything here is wrong, please point it out~
