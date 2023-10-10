---
layout: post
title: 关于Java的输入编程
post_id: 1568
date: 2013-03-19 23:34:21
categories: technology
tags:
- programming
- college
- Java
---

这是一种最简单的输入方式，这里直接给出源码 <!-- more -->

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



今天在阅览室待了一天的感觉真是不错，收获不小，现在我主要学习的是Java和C，C是我主要的课程Java目前是次要的，今后我会写写关于这些的小文章。