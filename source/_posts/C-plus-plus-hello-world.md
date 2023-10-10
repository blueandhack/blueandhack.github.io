---
layout: post
title: C++中的 Hello World!
id: 683
date: 2010-07-16 16:10:12
categories: technology
tags:
- programming
- C++
---

我开始了讲解C++编程语言，此文章会是一个系列，讲解C++，教会大家使用C++语言，我讲的步骤和《C++ PRIMER》这本书上的步骤差不多~等于是用我自己的语言把《C++ PRIMER》叙述一边吧！ <!-- more -->

首先来说《C++ PRIMER》这是一本绝世好书，可以说一是本讲解非常非常细致的书了，虽然我没有看完，大家一步步来，我会用最通俗的语言，和大家说明，其中的算法啊，语法啊，等等的……  好了，开始第一节，C++是什么我就不废话了，在很多的CPP的教科书上都是CPP诞生什么的，占用了好几页，真的是浪费资源，我看啊，很多人后面的没记住，就前面的CPP的诞生历史背的滚瓜烂熟，其实那个历史什么的完全可以一概而过，就像《C++ PRIMER》中，没有花费大篇幅去说明C++的诞生，我发现越是那种没有水准的C++教材，越是那样废话……好了，我的废话也完了…… 首先，先说明一下我使用的是Microsoft Visual Studio 2010编译器，这个东西很好找，你从网上下载一个就行了。 

![VS图标](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image_thumb1.png)

然后打开，起始页中有新建项目的选项，单击打开

![创建项目](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image_thumb2.png)

![创建步骤](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image12_thumb.png)

① 右边模板选择已安装模板中的Visual C++选项，我这里Visual C++选项是打开的，这个和你选择的默认开发环境有关系。然后在中间的选项中 ② 选择Win32 控制台应用程序 ③ 然后在下方的选项框中填入这个项目的名称，可以说是工程名称，我这里输入的是cpp-1-02 ④最后点击确定

![向导设置1](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image_thumb3.png)

然后会出现一个Win32应用程序向导的对话框，点击下一步

![向导设置2](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image_thumb4.png)

不需要更改，默认这些选项，在每个选项上悬停会有解释的，就像这样

![悬停解析](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image_thumb5.png)

最后点击完成 项目创建成功 

![创建完成](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image_thumb6.png)

好了以上是教您如何创建最基本的C++项目 然后开始，编写最简单的”Hello World!”程序了！ 关于C++ 每个C++程序都包含一个或多个函数，而且必须有一个命名为main函数在VS编辑器中是_tmain这个函数，这是由于编译器导致的，取决于程序是否使用Unicode字符，它允许函数的名称是main或wmain。wmain或_tmain都是Microsoft特有的。对于C++来说，符合ISO/ANSI标准的主函数名称是main。在所有的ISO/ANSI C++事例中，我都将使用名称main。 

以下是源代码，很简单的，我加了注释 

关于注释，C++中有单行注释和成对注释两种类型的注释。单行注释以双斜线（//）开头，成对注释符号（/* */）是从C语言继承过来的，这个我就不详细讲解了。 好了，看源代码吧 

``` c++
#include "iostream";

#using namespace std; //这是写入流输出流定义在namespace(命名空间) std中

int main()
{

	cout<<"Hello World!"<<endl; //这是输出流语句
	return 0; //返回0值表明程序成功执行完毕
}
```





![编译](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image_thumb7.png) 

点击是

![结果](https://cdn.blueandhack.com/wp-content/uploads/2010/07/image_thumb8.png)

好了，看看”Hello World!”是不是显示了~ 今天的教程就到这里~期待我的下一篇吧 下一篇介绍C++控制结构和类的简介。 

PS：这篇文章很难产，继我上次的承诺过去了很久，这篇文章终于写完了，其实这样的文章很难写，要考虑读者的感受啊……

