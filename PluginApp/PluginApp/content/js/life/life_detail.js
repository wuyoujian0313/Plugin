// JavaScript Document

;(function($,window){
	if(window.is40){ return false; }
    window.$mainView = $('#lifeDetail #mainView');
	window.tm=null;
	var lifeDetailScroll;
    window.loadDetailData = function(options){
        var options = options || {};
        var type = options.type || 'all';
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var cb = options.cb || function(){};
        var paramData = $.duLife.fns.getUrlParam();
        var id = paramData.articleid;
        var type= paramData.detailtype || '生活站';
        $.mobile.activePage.find('header').html('<a id="backTo" href="javascript:;" data-rel="back" class="ui-link"></a>'+type);
        $.jsonp({
            url: window.duLife.URLS.lifeDetail,
            callbackParameter: 'callback',
            timeout:8000,
            data: {
            	id: id
            },
            beforeSend: function(xhr){
            	// validSession('../../login.html',this);
            },
            success: function(data){
               	var count=data.article.topCount;
				var idNum=data.article.id;
                var src_article = $('#tpl_article').html();
                var tpl_article = Handlebars.compile(src_article);
                var titleText=$('#lifeDetail header').text();
                dataHandle(tpl_article(data));
                $("#contentText").find('img').css({'max-width':'100%','height':'auto'});
                $("#contentText").find("input[type=image]").css({'max-width':'100%','height':'auto'});
               	if(data.article.status=='进行中')
				{
					clearInterval(tm);
					tm=null;
					var s=parseInt((data.article.endDate-data.article.today)/1000);
					s= countDown(data.article.today,data.article.endDate,s);
					tm=setInterval(function(){s= countDown(data.article.today,data.article.endDate,s)},1000);
				}else if(data.article.status=='敬请期待')
				{
					var day=Math.ceil((data.article.startDate-data.article.today)/(1000*60*60*24));
					$('.countDown').html('距开始'+day+'天');
				}
				else
				{

					$('.countDown').html('已结束').css({'background':'none','color':'#999999'});
				};
				$('menu>a').on({
					'touchstart':function()
					{
						$(this).addClass('hover');
					},
					'touchend':function()
					{
						$(this).removeClass('hover');
					}
				});
				/*点赞*/
				$('menu .somePraise').on('click',function()
				{
					var $target=$(this);
					var url=window.duLife.URLS.support;
					 if(!$target.hasClass('clickAfter'))
					 {
						var json={
							'id':idNum
						};
						$.jsonp({
							type:'GET',
							url: url,
							callbackParameter: 'callback',
							data: json,
							timeout:5000,
							beforeSend: function(){
								//validSession('../../login.html',this);
							},
							success: function(data){
								if(data.success)
								{
									$target.addClass('clickAfter');
									if(data.topCount>999)
									{
										$target.find('b').text('999+');
									}
									else
									{
										$target.find('b').text(data.topCount);
									}
									$.duLife.fns.tips(data.message);
								}else{
									$.duLife.fns.tips(data.message);
								}
								
							},
						})
					 }else{
					 	$.duLife.fns.tips('赞过了');
					 };		
				});
				/*参与*/	
				$('menu .participation').on('click',function()
				{
					var $target=$(this);
					var url=window.duLife.URLS.isJoin;
					if(!$target.hasClass('clickAfter'))
					 {
						var json={
							'id':idNum
						};
						$.jsonp({
							type:'GET',
							url: url,
							callbackParameter: 'callback',
							timeout:5000,
							data: json,
							beforeSend: function(){
								//validSession('../../login.html',this);
							},
							success: function(data){
							    if(data.success)
								{
									$target.addClass('clickAfter');
									if(data.joinCount>999)
									{
										$target.find('b').text('999+');
									}
									else
									{
										$target.find('b').text(data.joinCount);
									}
									$.duLife.fns.tips(data.message);
								}else{
									$.duLife.fns.tips(data.message);
								}
							},
						})
					 }else
					 {
					 	$.duLife.fns.tips('已参与');
					 };	
				});
				setTimeout(function(){
					var wrapper = $('#lifeDetail #mainView #articleWrapper');
					$('#lifeDetail #mainView #articleWrapper').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()) - parseInt($('#lifeDetail menu').height()));
					lifeDetailScroll = new iScroll(wrapper[0]);

            		$('menu').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('#lifeDetail menu').height()),'visibility':'visible'});
				},200)
				var i = 1;
		        var freshInterval = setInterval(function(){
		            if(i>=4){
		                clearInterval(freshInterval);
		            }
		            lifeDetailScroll.refresh();
		            i++;
		        },500);
				$('menu').delegate('.writeComment','click',function(){
	                var articleid = $(this).attr('articleid');
	                if(window.is40){
            			window.params = {'commentType':titleText,'articleid':articleid};
            			$.mobile.changePage('../../view/life/life_comment.html',{transition :'none'});
            		}else{
	                	$.mobile.changePage('../../view/life/life_comment.html?commentType='+titleText+'&articleid='+articleid,{transition :'none'});
	            	}
	            });
	            $('menu').delegate('.lookComment','click',function(){
	                var articleid = $(this).attr('articleid');
	                if(window.is40){
            			window.params = {'comListType':titleText,'articleid':articleid};
            			$.mobile.changePage('../../view/life/comment_list.html',{transition :'none'});
            		}else{
	                	$.mobile.changePage('../../view/life/comment_list.html?comListType='+titleText+'&articleid='+articleid,{transition :'none'});
	                	//location.href = '../../view/life/comment_list.html?comListType='+titleText+'&articleid='+articleid;
	            	}
	            });
                cb && cb();
            },
            error: function(args){
            	$.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                cb && cb();
                return false;
            },
            complete: function(xhr){
    
            }
        });
    };
    $('#lifeDetail').on('pagebeforeshow',function(){
    	var ifmation =$.duLife.fns.getUrlParam().ifmation;
    	if(ifmation)
    	{
    		$('#lifeDetail #backTo').removeAttr('data-rel');
            $('#lifeDetail #backTo').attr({'href':'../../view/personal/information.html','data-ajax':false});
    	}
    	loadDetailData();
     })
    $('#lifeDetail').on('pagebeforehide',function(){
    	clearInterval(tm);
    });

	/*倒计时*/
	function double(n)
	{
		return n<10 && n>=0?'0'+n:''+n;
	};
	function countDown(today,endDate,s)
	{
	   if(s<=0)
		{
			clearInterval(tm);
			$('.countDown').html('已结束').css('background','none');
		}else{
			s--;
			var sec=s;
			var d=parseInt(sec/86400);
			sec%=86400;
			var h=parseInt(sec/3600);
			sec%=3600;
			var m=parseInt(sec/60);
			sec%=60;
			$('.countDown').html(double(d)+'天'+double(h)+'时'+double(m)+'分'+double(sec)+'秒');	
		}
		return s;
	};
})(jQuery,window);
