---
layout: post
title: 关于C语言链表创建的小实例
post_id: 1563
date: 2013-03-18 23:37:44
categories: notes-of-life
tags:
- C
- programming
- college
---

这几天一直在学习C语言结构体，所以上课写的小代码，在这里贴出，加上了注释，应该可以看懂的，链表头插入法，老师说在数据结构中，后插入法很少用到，因为太多的判断导致程序很复杂，所以在数据结构中常用到的就是头插入法了。

<!-- more -->

``` c
#include<stdio.h>

#include<stdlib.h>

define N 3

struct date //定义date函数体 

{ 

	int year; 

	int month; 

	int day; 

	struct date *next; 

}; 

struct date *create(struct date *head) //定义一个指针函数，创建链表函数 

{

  int i;

  struct date *p; //顶一个date类型的指针p

  for(i=0;i<N;i++)

  {

p=(struct date *)malloc(sizeof(struct date)); //内存动态分配一个date结构体大小的内存空间
scanf("%d%d%d",&p->year,&p->month,&p->day); //输入时间
p->next=head; //将头指针指向next，初次的值为NULL
head=p; //将p指针赋给head
  }

  return head; //返回链表的头指针

}

void print(struct date *head)  //打印链表函数

{

  struct date *p=head;

  if(head=NULL)

printf("连表为空");
  else

  {

while(p!=NULL)
{
  printf("%d年%d月%d日\n",p->year,p->month,p->day);
  p=p->next ;
}
  }

}

main()

{

  struct date *head;

  head=NULL;

  head=create(head);

  print(head);

}


```



今天我乖乖的去了图书馆，开始了我的学习之旅，不知道能坚持几天，坚持就是胜利，我会在博客中记录，监督提醒自己。 在这里我想说，我只所以继续背我的托福词汇，我想这点梦我都拖了三年了，何不一口气将他做完。青春没有几年了，不能留下遗憾。这就是青春，再迷茫的青春也有他的目标。