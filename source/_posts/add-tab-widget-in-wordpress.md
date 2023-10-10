---
layout: post
title: 侧边栏Tab切换效果Widget，实现可以拖拽的Widget 
id: 1058
date: 2010-10-13 04:04:01
categories: technology
tags:
- wordpress
- blog
- plugin
- programming
---

第一篇伪原创文章，wordpress文章写的不多，这个算其中的一篇。 侧边栏Tab切换效果Widget，这是从木木童鞋那里学到的（但是木木那里的侧边栏Tab切换效果小工具是不可拖拽的），然后又参考了分文童鞋的代码，还有willin大师的代码（是最新留言的代码），等等童鞋的代码……最后将其嵌入到主题之中，实现了实现可以拖拽的Widget。什么是可拖拽的，能够激活删除的Widget呢？

<!-- more -->  

![拖拽](https://cdn.blueandhack.com/wp-content/uploads/2010/10/image_thumb3.png) 

这就是可拖拽的小工具他们可以拖拽小工具到边栏以激活它们，将它们拖回来则自动禁用它们并删除设置。实现此功能，我是查找了很多资料，一开始只找中文资料，但是没有多少好的中文资料去介绍Widget的，所以只好去翻wordpress的codex，结果，还真让我翻到了，[传送门](http://codex.wordpress.org/zh-cn:%E6%8C%82%E4%BB%B6%E6%8E%A5%E5%8F%A3) 此文档中介绍了Widget的API，就是你写的函数要用勾到哪里，做什么事，都需要API来实现，官方文档给了一个很好的例子，我也就是用那个例子改的。 现在说说木木的那个TAB切换特效的小工具吧，这个你可以看我的侧边栏。 直接说操作步骤了 

一、首先在自己主题文件下的header.php的head标签里加载jquery库。 

二、加载jquery特效（一般加载到头部）： 

``` javascript
jQuery(document).ready(function($){ 

$('#tab-title span').click(function(){

  $(this).addClass("selected").siblings().removeClass();

  $("#tab-content > ul").slideUp('1500').eq($('#tab-title span').index(this)).slideDown('1500');

});

});
```



三、在你使用的主题文件夹里找到主题函数文件（functions.php），在里面添加一下代码（这段代码我纠结了两天……12号的晚上才憋出来的……很辛苦的……）： 

``` php
//Tabber

/**

Tabber Class

*/

class Tabber extends WP_Widget {

 /** 构造函数 */

 function Tabber() {

 parent::WP_Widget(false, $name = 'Tabber'); 
 }

 /** @see WP_Widget::widget */

 function widget($args, $instance) {   



 extract( $args );
 ?>
       <?php echo $before_widget; ?>
           <?php echo $before_title
               . $instance['title']
               . $after_title; ?>
   <div id="sidebar-tab"> 
   <div id="tab-title"> 
   <h2><span class="selected">|  最新文章  |</span><span>|  近期热评  |</span><span>|  热门标签  |</span></h2> 
   </div> 
   <div id="tab-content"> 
   <ul><?php wp_get_archives('type=postbypost&limit=10'); ?></ul> 
   <ul class="hide"><?php
     global $wpdb;
     $my_email = get_bloginfo ('admin_email');
     $rc_comms = $wpdb->get_results("
         SELECT ID, post_title, comment_ID, comment_author, comment_author_email, comment_content
         FROM $wpdb->comments LEFT OUTER JOIN $wpdb->posts
         ON ($wpdb->comments.comment_post_ID = $wpdb->posts.ID)
         WHERE comment_approved = '1'
         AND comment_type = ''
         AND post_password = ''
         AND comment_author_email != '$my_email'
         ORDER BY comment_date_gmt
         DESC LIMIT 10
     ");
     $rc_comments = '';
     foreach ($rc_comms as $rc_comm) {
         //$a = 'avatar/'.md5(strtolower($rc_comm->comment_author_email)).'.jpg'; // 頭像緩存用的
         $rc_comments .= "<li>" . get_avatar($rc_comm,$size='20',$default='<path_to_url>' ) . "<a href='"
         . get_permalink($rc_comm->ID) . "#comment-" . $rc_comm->comment_ID
         //. htmlspecialchars(get_comment_link( $rc_comm->comment_ID, array('type' => 'comment'))) // 可取代上一行, 會顯示 cpage, 但較耗資源
         . "' title='on " . $rc_comm->post_title . "'>" . strip_tags($rc_comm->comment_content)
         . "</a></li>\n";
     }
     $rc_comments = convert_smilies($rc_comments);
     echo $rc_comments;
   ?></ul> 
   <ul class="hide"><?php wp_tag_cloud('smallest=6&largest=18'); ?></ul> 
   </div> 
   </div> 
       <?php echo $after_widget; ?>
 <?php
 }

 /** @see WP_Widget::update */

 function update($new_instance, $old_instance) {       

 return $new_instance;
 }

 /** @see WP_Widget::form */

 function form($instance) {        

 $title = esc_attr($instance['title']);
 ?>
     <p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?> <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" /></label></p>
 <?php 
 }

} // class Tabber

// 注册 Tabber 挂件

add_action('widgets_init', create_function('', 'return register_widget("Tabber");'));

```



四、在样式（style.css）中添加一下代码：

``` css
/* Tabber */

sidebar-tab{border:0px;margin-bottom:1.5em;overflow:hidden;}

tab-title h3{color:#666;font-size:15px;font-weight:400;}

tab-title .selected{color:#356aa0;border-bottom:0px;} /标题被选中时的样式/

tab-title span{padding:5px 9px 5px 9px;border:0px;border-right:0px;margin-left:-1px;cursor:pointer;}

tab-content .hide{display:none;} /默认让第一块内容显示，其余隐藏/

tab-content ul{padding:5px 5px;overflow:hidden;}

tab-content ul li{padding-top:5px;overflow:hidden;} }
```



五、一切OK

现在到你的小工具选项中有没有看见一个名叫tabber的小工具呢？

![成功](https://cdn.blueandhack.com/wp-content/uploads/2010/10/image_thumb4.png) 哈哈，看见了就说明你成功了，如果没有成功，报错等等问题，留言提问哦~~我会耐心解答的。过几天准备弄成插件……方便小白……不过我还是不赞成使用插件…… 

PS：codex真的不错，就是很多英文文档没有翻译成中文，实在太可惜了……

