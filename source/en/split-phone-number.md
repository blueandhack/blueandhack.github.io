---
title: "Separating a Ton of Phone Numbers with Commas"
date: 2013-07-04 02:05:41
permalink: "en/technology/2013/07/04/split-phone-number.html"
layout: translation
lang: en
original: "_posts/split-phone-number.md"
source_hash: 59a8fff04f9d95c98a2268a504c846b1ba17ffd3
translation_hash: e951ea549840e290926d694609309b69892de66a
translated_by: claude-opus-5-5
---
Tonight I needed to text more than 50 people, so I thought of Wandoujia. I copied the numbers from Excel into Wandoujia to send them all at once with its group SMS feature. As it turned out, things weren't as simple as I'd thought. 

<!-- more -->

![After copying](https://cdn.blueandhack.com/images/2013/07/split-phone-number/after-copying-174x300.png) 

I copied from Excel into Notepad, and it pasted the Excel way, as a column, not as a single line. So I copied the column of numbers into Wandoujia, and the result left me shattered... 

![Not recognized correctly](https://cdn.blueandhack.com/images/2013/07/split-phone-number/not-recognized.png) 

You can see it says it will be sent to one contact. What now? Was I supposed to add English commas one by one to separate them? I told myself I couldn't do something that primitive. After all, I'm a code monkey! 

### Scouting the Way with C, Done in No Time

I know C and Java, but in the end I chose C to write this little program. First you create a character array to hold the huge pile of numbers. Then the whole program works by replacing newline characters with English commas.

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





Using C's file functions, the numbers get written out to Output.txt. Aha! That makes things so much easier.
