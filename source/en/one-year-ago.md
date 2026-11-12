---
title: "Another Year, a Year Gone By"
date: 2010-09-01 01:00:06
permalink: "en/notes-of-life/2010/09/01/one-year-ago.html"
layout: translation
lang: en
original: "_posts/one-year-ago.md"
source_hash: 2f48b918ad28834d52242555f08902daa21c7069
translation_hash: b0e361f794e918c5219f1a8c9af1b7d9a9914a1f
translated_by: claude-opus-5-5
---

Time really flies. Writing this post feels a bit heavy.<!-- more -->

A year has passed. Today I went to a buddy's birthday dinner. Eight of us, not many, not few. Last year, I remember it was September 3rd (this year we celebrated early because of classes), a few of us buddies got together, and today we got together again. In a year, not much has changed, it's just that I really miss my classmates.

I haven't been to school in two months, and there's a good chance I won't go this semester. I'm busy with all the exams for going abroad. There aren't that many really, just a few. I don't want to go back and visit school because I don't like the teachers there. They're annoying, really unbearable.

Today's conversation was all just chitchat. Since they have class tomorrow, nobody drank, heh. After dinner we went to a pool hall and played for a while, then everyone headed home.

The guys have all changed~ grown up, I guess. After all, we're seniors in high school now, so I need to work hard too.

Four months of hard work, then an offer from UCB, and I'll be completely satisfied. No, not satisfied. MIT is my ultimate goal.

I hate China's exam-oriented education. Senior year, no foreign prep program, studying every subject there is. That's the tragedy of an ordinary high school.

I'm done complaining. Be sunnier, change myself!

 

Here are some PS's:

Haven't had coffee in ages~ Today I'm getting an iced one, and I'll go out for a walk every day when I've got nothing to do.

**My blog has now moved to a VPS, so everyone is welcome to test its speed!**

Let me talk about the move. It was actually pretty simple. My old blog was hosted at Qingyun with a CP panel, and the new one uses a DA panel. The move had a few small hiccups.

First, log in to my CP panel and pack up and compress the whole root directory.

Then use putty for the transfer. You need ssh for this, so if you don't have ssh enabled this method won't work for you...

Next enter your username and password (they won't be shown in plain text)

Then you'll get a command line. Right after that, enter

ls

Then you'll see the directory listing. Find the public_html directory

Enter cd public_html

Right after that, enter wget http://XXXXXX/wordpress.zip (the address is your blog's address, adjust to your situation)

At this point, the wordpress.zip archive from the old host gets downloaded to the new host.

Then enter logoout to exit

One more reminder: don't point the domain to the new host before the transfer, that makes the download easier.

Then go to the new host's root directory, unzip wordpress.zip, and everything's OK.

After that comes MYSQL

MYSQL: I first backed up the database in the CP panel, then created a new account in the DA panel and imported the SQL, and that's it. This was written pretty casually... heh

##### 10.11.2015 update

Later I went to UofA, and I'm pretty happy with how it turned out. It just took four years. You can do a lot in four years, but I kept at it, and maybe fifty years from now I'll be able to tell myself I have no regrets.
