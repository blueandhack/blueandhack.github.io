---
title: "Hello World! in C++"
date: 2010-07-16 16:10:12
permalink: "en/technology/2010/07/16/C-plus-plus-hello-world.html"
layout: translation
lang: en
original: "_posts/C-plus-plus-hello-world.md"
source_hash: 720584b0a30977f128e68263ccb17b9d68adaf99
translation_hash: db358b602207ddb543fca382248bef4907ad22fc
translated_by: claude-opus-5-5
---

I'm starting a series on the C++ programming language. The goal is to explain C++ and teach everyone how to use it. My steps will follow roughly the same order as the book *C++ Primer*, so you could say I'm retelling *C++ Primer* in my own words! <!-- more -->

First off, *C++ Primer* is an absolutely amazing book. It explains things in really, really fine detail, though I haven't finished it myself. Let's take it one step at a time. I'll use the plainest language I can to walk you through the algorithms, the syntax and so on…… OK, on to lesson one. I won't waste words on what C++ is. Lots of CPP textbooks spend page after page on how CPP was born, which is a total waste of resources. From what I've seen, plenty of people can't remember anything from later in the book, yet they can recite the history of CPP at the front by heart. That history stuff can be skipped in a sentence or two. *C++ Primer*, for example, doesn't spend pages on the birth of C++. I've noticed that the worse the C++ textbook, the more filler it has…… OK, that's the end of my own filler…… First, I should mention that I'm using Microsoft Visual Studio 2010 as my compiler. It's easy to find; just download one online. 

![VS icon](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image_thumb1.png)

Then open it. On the Start Page there's an option to create a new project. Click it.

![Create a project](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image_thumb2.png)

![Creation steps](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image12_thumb.png)

① In the templates on the left, choose Visual C++ under Installed Templates. My Visual C++ option is already expanded; that depends on the default development environment you picked. Then in the middle ② choose Win32 Console Application ③ Next, fill in the project's name in the box at the bottom (you could call it the solution name). I typed cpp-1-02 ④ Finally, click OK

![Wizard settings 1](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image_thumb3.png)

A Win32 Application Wizard dialog will appear. Click Next

![Wizard settings 2](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image_thumb4.png)

No need to change anything; keep the default options. If you hover over each option you'll get an explanation, like this

![Hover explanation](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image_thumb5.png)

Finally, click Finish, and the project is created 

![Done](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image_thumb6.png)

OK, that's how to create the most basic C++ project. Now let's start writing the simplest "Hello World!" program! About C++: every C++ program contains one or more functions, and one of them must be named main. In the VS editor this function is _tmain, which comes from the compiler: depending on whether the program uses Unicode characters, the function may be named main or wmain. Both wmain and _tmain are Microsoft-specific. For C++, the ISO/ANSI-standard name for the main function is main. In all my ISO/ANSI C++ examples I'll use the name main. 

Here's the source code. It's very simple, and I've added comments 

About comments: C++ has two kinds, single-line comments and paired comments. A single-line comment starts with a double slash (//), and the paired comment markers (/* */) are inherited from C. I won't go into detail on those. OK, let's look at the source code 

``` c++
#include "iostream";

#using namespace std; //这是写入流输出流定义在namespace(命名空间) std中

int main()
{

	cout<<"Hello World!"<<endl; //这是输出流语句
	return 0; //返回0值表明程序成功执行完毕
}
```





![Compile](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image_thumb7.png) 

Click Yes

![Result](https://cdn.blueandhack.com/images/2010/07/C-plus-plus-hello-world/image_thumb8.png)

OK, see whether "Hello World!" shows up~ That's it for today's tutorial~ Look forward to the next one, which introduces C++ control structures and gives a brief intro to classes. 

PS: This post was a difficult birth. A long time passed after my last promise before I finally finished it. Posts like this are actually really hard to write, since you have to think about how the reader will take it……
