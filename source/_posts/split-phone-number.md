---
layout: post
title: 给N多手机号用逗号分隔
post_id: 1614
date: 2013-07-04 02:05:41
categories: 
- technology
tags:
- C
- programming
---

晚上的时候，我需要给50多个人发短信，然后就想到了豌豆荚，于是乎从Excel中复制号码到豌豆荚中使用短信群发发送。 结果事情并没有我想的那么简单。 

<!-- more -->

![复制之后](https://cdn.blueandhack.com/wp-content/uploads/2013/07/复制之后-174x300.png) 

我通过Excel复制到记事本中，结果他是按照Excel的方式，成列复制了，并不能形成一行，于是乎我就把一列的号码拷贝到豌豆荚中，结果让我蛋碎了一地…… 

![无法正常识别](https://cdn.blueandhack.com/wp-content/uploads/2013/07/无法正常识别.png) 

可以看到显示的是，将发送给一位联系人，这可是好？难道让我一个一个添加英文逗号来进行分隔？ 我告诉我我自己，不能那么低级，至少自己还是个码农呢！ 

### 用C语言探路，简单搞定

自己会C和Java，但是最终还是选择了C来写这个小程序。 首先需要创建一个字符数组，来容纳庞大的号码。接着通过替换换行符为英文逗号，来实现整个程序。

``` c
#include <stdio.h>
#include <string.h>
define N 100000

int main()

{

  FILE *fp;

  fp=fopen("Output.txt","w+");

  int i=0,j=0;

  char a[N],b[N];

  scanf("%c",&a[i]);

  while(a[i]!='#')

  {

i++;
scanf("%c",&a[i]);
  }

  for(i=0;a[i]!='#';i++)

  {

if(strchr(a, '\n')==NULL) //如果查找不到指针值为空，就跳出循环
  break;
*(strchr(a, '\n')) = ','; //查找a字符数组中的换行符，返回一个指针
  }

  for(i=0;a[i]!='#';i++)

  {

fputc(a[i],fp);
printf("%c",a[i]);
  }

  fclose(fp);

  return 0;

}
```





通过C语言的文件函数将号码输出到Output.txt中，啊哈！这下就方便多了。

