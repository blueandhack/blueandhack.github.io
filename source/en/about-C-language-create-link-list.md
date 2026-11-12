---
title: "A Small Example of Building a Linked List in C"
date: 2013-03-18 23:37:44
permalink: "en/notes-of-life/2013/03/18/about-C-language-create-link-list.html"
layout: translation
lang: en
original: "_posts/about-C-language-create-link-list.md"
source_hash: b44a805344845daf8597be922cbd9d270093f129
translation_hash: ff798d0e5b36f5aaa1e18505168d8bf9fb4c54d7
translated_by: claude-opus-5-5
---
I've been studying C structs these past few days, so here's a little piece of code I wrote in class. I've added comments, so it should be easy to follow. It builds a linked list by inserting at the head. My teacher said that in data structures, inserting at the tail is rarely used, because all the extra checks make the program complicated, so head insertion is what you'll mostly see.

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



Today I dutifully went to the library and started my study journey. I don't know how many days I can keep it up, but sticking with it is half the battle. I'll log it on the blog to keep myself in check. What I want to say here is why I'm still memorizing TOEFL vocab: I've been putting this little dream off for three years now, so why not finish it in one go? There aren't many years of youth left, and I don't want regrets. That's youth for you: even the most lost youth has its goal.
