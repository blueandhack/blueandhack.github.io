---
title: "On Input in Java"
date: 2013-03-19 23:34:21
permalink: "en/technology/2013/03/19/Java-scanner.html"
layout: translation
lang: en
original: "_posts/Java-scanner.md"
source_hash: 64318e65caa7cc5ac92fadc57b3bd9a6f432eca7
translation_hash: 3fc99d9d05a9ae60acb0f48d5d9c351aa6748713
translated_by: claude-opus-5-5
---

This is the simplest way to read input. Here's the source code <!-- more -->

``` java
import java.util.*; //引用含有Scanner类的包

public class InputNumber

{

public static void main(String args[])

{

	Scanner numberInput=new Scanner(System.in); //定义一个扫描类	numberInput

	int Number=numberInput.nextInt(); //将值赋给整型数Number变量

	System.out.println(Number); //输出输入的Number的值

}

}

```



I spent the whole day in the reading room today and it felt great. I got a lot done. Right now I'm mainly studying Java and C. C is my main course, and Java is secondary for now. I'll write some short posts about them from here on.
