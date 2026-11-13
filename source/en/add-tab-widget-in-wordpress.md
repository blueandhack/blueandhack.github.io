---
title: "A Tabbed Sidebar Widget That Can Be Dragged and Dropped"
date: 2010-10-13 04:04:01
permalink: "en/technology/2010/10/13/add-tab-widget-in-wordpress.html"
layout: translation
lang: en
original: "_posts/add-tab-widget-in-wordpress.md"
source_hash: 617b6173246d8d77959f145f4bff3ee6973131b9
translation_hash: bbb5ba6fa03ace13c96fdc8d1f5e2d55c0194ed0
translated_by: claude-opus-5-5
---
My first semi-original post. I haven't written many WordPress posts, and this counts as one of them. A tabbed sidebar widget: I learned this from my buddy Mumu (though Mumu's tabbed sidebar widget can't be dragged and dropped), then I also borrowed from my buddy Fenwen's code, master willin's code (the recent comments code), and code from other folks... Finally I built it into my theme and ended up with a widget you can drag and drop. So what's a drag-and-drop widget, one you can activate and remove?

<!-- more -->  

![Drag and drop](https://cdn.blueandhack.com/images/2010/10/add-tab-widget-in-wordpress/image_thumb3.png) 

These are drag-and-drop widgets: you drag a widget into the sidebar to activate it, and drag it back out to disable it and delete its settings. To make this work I dug through a lot of material. At first I only looked for Chinese resources, but there wasn't much good Chinese material on widgets, so I had to go through the WordPress Codex, and sure enough, I found it. [Here's the link](http://codex.wordpress.org/zh-cn:%E6%8C%82%E4%BB%B6%E6%8E%A5%E5%8F%A3) This document covers the Widget API, meaning which hooks your functions attach to and what they do; it all goes through the API. The official docs give a really good example, and that's the example I modified. Now about Mumu's tabbed widget: you can see it in my sidebar. Let's go straight to the steps 

1. First, load the jQuery library inside the head tag of header.php in your theme folder. 

2. Load the jQuery effect (usually in the header): 

``` javascript
jQuery(document).ready(function($){ 

$('#tab-title span').click(function(){

  $(this).addClass("selected").siblings().removeClass();

  $("#tab-content > ul").slideUp('1500').eq($('#tab-title span').index(this)).slideDown('1500');

});

});
```



3. In the folder of the theme you're using, find the theme functions file (functions.php) and add the following code to it (I agonized over this code for two days... only squeezed it out on the night of the 12th... it was hard work...): 

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



4. Add the following code to your stylesheet (style.css):

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



5. All done

Now go to your Widgets page. Do you see a widget called tabber?

![Success](https://cdn.blueandhack.com/images/2010/10/add-tab-widget-in-wordpress/image_thumb4.png) Haha, if you see it, you've done it. If it didn't work, or you get errors or anything, leave a comment and ask~~ I'll patiently answer. In a few days I plan to turn this into a plugin... to make it easier for newbies... though I'm still not a fan of using plugins... 

PS: The Codex is really good. It's just a real shame that a lot of the English docs haven't been translated into Chinese...
