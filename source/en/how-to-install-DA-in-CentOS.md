---
title: "Installing the DirectAdmin Panel on a CentOS VPS"
date: 2010-08-31 02:52:11
permalink: "en/technology/2010/08/31/how-to-install-DA-in-CentOS.html"
layout: translation
lang: en
original: "_posts/how-to-install-DA-in-CentOS.md"
source_hash: 52d37f9951b8c5ca74332e826b2d3ca19bfa90ba
translation_hash: c541a8d7b4c31fe1607eec7651e1149b39fb4d41
translated_by: claude-opus-5-5
---
I finally bought a VPS, and only got it set up today... I bought a license for the DirectAdmin panel and installed it. I spent two hours wrestling with it before it finally worked, and then the Chinese localization ran into problems. Thankfully the expert Chuanzhang fixed it for me~~ hehe~~ Now let me explain how to install the DirectAdmin panel on CentOS 5.5. First you need a clean CentOS system. I chose <!-- more -->

![CentOS](https://cdn.blueandhack.com/images/2010/08/how-to-install-DA-in-CentOS/image_thumb16.png)

Step 1: install the CentOS packages you need. First run 

`yum update –y`

Then run 

`yum -y  install gcc gcc-c++ flex make perl quota automaker`

PS: Depending on the system, some VPSes are missing a lot of packages, so install whatever the prompts tell you to. Step 2: CentOS comes with the Unix version of httpd, but DirectAdmin needs a clean system to install, so before installing you have to uninstall web components like httpd, php and mysql 

`yum remove httpd* php* mysql* -y`

Step 3: the actual installation. Run this command to get the install script 

`wget http://www.directadmin.com/setup.sh`

Make the script executable 

`chmod +x setup.sh`

Run the script 

`./setup.sh`

Once it's running it asks you for your license details and so on, for example: Please enter your Client ID : Please enter your License ID : Please enter your hostname \(server.domain.com\) as well as the licensed IP address and so on! When it got to "Enter your choice (1 or 2):" I chose 2. After that it should be just typing y and pressing Enter. There's a step mentioned online here that I never ran into, so I'll skip it…… /* On a dedicated server you're done at this point, but on a VPS the panel won't open yet. There's one more step: configure the network device. Run the ifconfig command to see your VPS's IP address. The device that IP address is bound to is what we need to note down, for example venet0:0 (OpenVZ VPSes need this change, Xen doesn't). The IP device I found during my install was also venet0:0, so it's probably the same for most VPSes! Open the DirectAdmin config file /usr/local/directadmin/conf/directadmin.conf with vi 

``` bash
vi /usr/local/directadmin/conf/directadmin.conf
```

Find something like ```ethernet_dev=***```, change the value after the equals sign to the venet0:0 we just looked up, then save and exit vi. */ Then reboot Linux so the changes take effect. After the reboot, enter http://ip:2222 in your browser. If you see a login box, DirectAdmin has been installed successfully. (Make sure you reboot! Unlucky me didn't, and so the control panel wouldn't open.) Next up is the Chinese localization for the DirectAdmin panel. First download a tool, [fzftp.rar ](https://web.archive.org/web/20101121065756/http://u.115.com/file/f44e9e63d1), and use it to connect to the VPS. Then download the language pack [lang.zip ](https://web.archive.org/web/20101120032628/http://u.115.com/file/f4b41c4060) and copy the files in the language pack over the ones in 

``` bash
/usr/local/directadmin/data/skins/enhanced/lang
```

and that's it. Edit ```user.conf``` 

``` bash
vi /usr/local/directadmin/data/users/admin/user.conf
```

and that's it. All done~ Ta-da…… the brand-new DirectAdmin panel appears before your eyes! 

![DirectAdmin](https://cdn.blueandhack.com/images/2010/08/how-to-install-DA-in-CentOS/image_thumb17.png)

One last plug: I'm still sharing this VPS with others. I'll post the specific resource plans in a few days. PS: Could everyone please ping godvps.net to test the speed~ and let me know how it is. My little blog will move to the VPS in a few days, so please bear with me
