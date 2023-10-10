---
layout: post
title: C语言关于链表的头插入和头删除
post_id: 1573
date: 2013-03-21 23:32:42
categories: technology
tags:
- C
- programming
- college
---

今天上课所写的链表的头插入和头删除，考虑了各种异常处理。

<!-- more -->

``` c
#include<stdio.h>

#include<stdlib.h>

struct node

{

  int data;

  struct node *next;

};

/创建链表，并返回链表头指针head/

struct node *create()

{

  struct node *head=NULL;

  struct node *p;

  p=(struct node*)malloc(sizeof(struct node));

  p->data=95;

  p->next=head;

  head=p;

  p=(struct node*)malloc(sizeof(struct node));

  p->data=90;

  p->next=head;

  head=p;

  return head;

}

/输出链表head/

void print(struct node *head)

{

  struct node *p=head;

  while(p!=NULL)

  {

printf("%d\t",p->data);
p=p->next;
  }

}

/将数据data插入到链表head中/

struct node *insert(struct node *head,int data)

{

  struct node *p;

  struct node q,s;

  q=head;

  while(q!=NULL&&q->data<data)

  {

s=q;
q=q->next;
  }

  p=(struct node*)malloc(sizeof(struct node));

  p->data=data;

  if(q==head)

  {

p->next=q;
head=p;
  }

  else

  {

p->next=q;
s->next=p;
  }

  return head;

}

/删除链表head中的指定元素data/

struct node *deletePoint(struct node *head,int data)

{

  /*

  1.确定q和s的位置，q代表查找到的元素的位置，s始终指向q的前一个位置。

  2。如果q指向第一个结点，改变的是head指针的指向

  3.其余的时候改变都是s指针。

  注意：在删除之前确定当前链表中是否存在结点。

  */

  struct node s,q;

  q=head;

  while(q!=NULL&&q->data!=data)

  {

s=q;
q=q->next;
  }

  if(q==head)

  {

head=q->next;
  }

  else

  {

s->next=q->next;
  }

  free(q);

  return head;

}

void main()

{

  struct node *head;

  head=create();

  printf("head链表中的元素：");

  print(head);

  printf("\n");

  head=insert(head,92);

  printf("head链表中插入操作以后的元素：");

  print(head);

  printf("\n");

  head=insert(head,87);

  printf("head链表中插入操作以后的元素：");

  print(head);

  printf("\n");

  head=insert(head,85);

  printf("head链表中插入操作以后的元素：");

  print(head);

  printf("\n");

  head=insert(head,100);

  printf("head链表中插入操作以后的元素：");

  print(head);

  printf("\n");

  head=deletePoint(head,87);

  head=deletePoint(head,85);

  head=deletePoint(head,100);

  printf("head链表中删除操作以后的元素：");

  print(head);

  printf("\n");

}
```



这段时间太忙了，连女朋友都不能照顾到了，宝宝，和你说声对不起。