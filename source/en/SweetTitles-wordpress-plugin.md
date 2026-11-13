---
title: "The SweetTitles Plugin: Beautiful Title Tooltips"
date: 2010-08-19 01:14:45
permalink: "en/plugins/2010/08/19/SweetTitles-wordpress-plugin.html"
layout: translation
lang: en
original: "_posts/SweetTitles-wordpress-plugin.md"
source_hash: 88b806ecf2a7fe800a78b968fbaf099c58c0c71e
translation_hash: 7833b79b01625df5466ee24ab1bb9c21aa4550a8
translated_by: claude-opus-5-5
---

The name Sweet Titles comes from a JS plugin that changes how title tooltips look: [Sweet Titles Finalized](https://web.archive.org/web/20100305070407/http://www.dustindiaz.com/sweet-titles-finalized/).<!-- more -->This plugin not only makes your title tooltips look nicer, it also shows the URL of the link you're about to click, so users know where they're going, which improves the user experience. Also, in my opinion, the system's built-in title tooltips have a delay, while ones done in JS show up instantly. The plugin's JS and CSS come from the guru [leeiio](http://leeiio.me/sweet-titles-for-jquery), so first, thanks to him for his hard work. All I did was turn it into a plugin. Truly, one generation plants the trees and the next enjoys the shade! This is my very first work, so come check it out. If you'd rather not use a plugin, leeiio's site has instructions for adding it by hand. OK, now let me introduce the plugin 

- Plugin name: sweetTitles (Chinese name: "Beautiful Titles") 
- Initial version: 0.9 
- Release version: 1.4 
- Plugin conceived: August 5, 2010 
- Plugin released: August 19, 2010 (I was away traveling for part of that time, so I didn't think about it for a long while) 
- What it does (screenshot): hover the mouse over a hyperlink and a floating tooltip for the link appears

![Plugin effect](https://cdn.blueandhack.com/images/2010/08/SweetTitles-wordpress-plugin/image_thumb13.png)

About the plugin: it makes life easy for the lazy folks, who can get this effect without lifting a finger. But it has a downside too: it may cause jQuery to be loaded twice. Since this is the initial version, there are no admin options yet; those will come later. Future plans: I'll add several options for users to choose from, letting you pick how jQuery is loaded, and you'll be able to set sweetTitles' CSS styles from the admin panel. I'll also optimize the code and so on, so you get a better experience. Known issue: when using Windows Live Writer (the WLW offline editor), you may get an error that xmlrpc.php can't be reached. After testing, it turns out this is caused by script support not being turned on. In the Windows Live Writer toolbar, go to Blog - Edit blog settings - Advanced - Blog overrides - Scripts, and choose to support them. That fixes the problem. 

![Setup steps](https://cdn.blueandhack.com/images/2010/08/SweetTitles-wordpress-plugin/image_thumb15.png)

Thanks to everyone who helped me: [leeiio](http://leeiio.me) (provided the JS and more), [ilover](https://web.archive.org/web/20100830012610/http://www.ilover.me/) (helped me revise the initial version, though in the end I rewrote it), [hey33](http://www.hey33.com/) (bravely tested the plugin for me), and [Mumu](http://immmmm.com). I'm really grateful for their selfless help. Thank you all! Official download: [sweetTitles 1.4v](http://wordpress.org/extend/plugins/sweettitles/)
