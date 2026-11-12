---
title: "A Frustrating Afternoon"
date: 2010-02-24 16:35:30
permalink: "en/notes-of-life/2010/02/24/depressing-day.html"
layout: translation
lang: en
original: "_posts/depressing-day.md"
source_hash: ecda8dbaa23bf36eae10674f0a46d05a4d9c0e6f
translation_hash: f567c46b28a51c734c539672a2fc725b1d1a97b6
translated_by: claude-opus-5-5
---

This morning I got up pretty early for me, at 9:30, because I went to bed early last night. Then I rushed off to the exit-entry hall at the Public Security Bureau to apply for a passport.<!-- more -->Sigh, getting a passport this early, I really had no choice. My school doesn't give me a student ID, so the only way to take the TOEFL is with a passport. Sad, just sad. Still, it's good to get it done early, it'll make things a little easier later... In the afternoon, well, more like around noon, things got even more frustrating. This site got hijacked and redirected for no reason to [61.132.255.212](https://web.archive.org/web/20031026205830/http://61.132.255.212). Ha, this is Anhui Telecom's handiwork. It was hijacked for a full 5 hours and I couldn't log in. Ha. Then I bothered customer support and asked what was going on, and the answer was that it loaded fine on their end. Well, uh~~~ Telecom really is brilliant! Here are some ways to deal with this situation: Method 1: Edit your computer's routing table. Note: the routing table, not the hosts file, because Telecom's ad injection no longer relies only on DNS hijacking. The command to permanently change the routing table on Windows: "Accessories" - "cmd", which needs to be run as administrator. Then enter the following route -p add 61.132.255.212 mask 255.255.255.255 127.0.0.1 route -p add 61.132.221.146 mask 255.255.255.255 127.0.0.1 Method 2: Edit the routing table on your ADSL modem. I recommend this one. You do it once and you're done, and it's especially good if more than one computer in your home goes online. The Telecom-provided ADSL modem at my house is a fairly old model. For how to log in to the ADSL modem, see one of my earlier posts. Click "Advanced Settings" –> "Routing Settings" –> "Static Routes" in order, then in the main window on the right, click the "Add" button to add a route. IP address: the IP you want to block, e.g. 61.132.255.212 Subnet mask: 255.255.255.255 Gateway IP address: 127.0.0.1 Be sure to save once you've edited the routing table, and the settings only take effect after you restart the ADSL modem! The methods are partly reposted from the blog of [Zhuzaixiao](http://www.huangwei.me/blog/2010/02/09/anti-telecom-ad/)
