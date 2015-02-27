;(function($){
	if(window.is40){ return false; }
	$('#textareaBox').textLimit(300);
	$('#formBtn').on('click',function(){
		if($(this).hasClass('disable'))
		{
			return;
		}
		var val = $.trim($('#textareaBox').val());
		var str =$.mobile.activePage.attr('data-url');
		var paramData = $.duLife.fns.getUrlParam({str:str});
		var articleId = paramData.articleid || '';
		var commentId = paramData.commentid || '';
		var author=paramData.author || '';

		var s = '';
		for(var i = 0; i < val.length; i++){
			if(val[i].charCodeAt() != 8198){
				s += val[i];	
			}else{
				s += ' ';
			}
		}
		$(this).addClass('disable');
		setTimeout(function(){
			val = s;
			if(val && val!='回复'+author+'：'){
				var json={
					'articleId':articleId,
					'commentId':commentId,
					'content':val
				};
				//alert(window.duLife.URLS.submitCommnets+'?content='+json.content)
				var url=window.duLife.URLS.submitCommnets;
				
				$.jsonp({
					type:'post',
					url: url,
					callbackParameter: 'callback',
					data: json,
					beforeSend: function(){
						// validSession('../../login.html',this);
					},
					success: function(data){
						if(data.success)
						{
							$.duLife.fns.tips(data.message);
							$('#lifeComment').undelegate('#backTo','click');
							$('#lifeComment header a').removeAttr('href').attr('data-rel','back');
			                $('#textareaBox').val('');	
			                var str =$.mobile.activePage.attr('data-url');
							var commentType =$.duLife.fns.getUrlParam({str:str}).commentType || '生活站';
							var id=$.duLife.fns.getUrlParam().id;
							setTimeout(function()
							{
								if(window.is40){
            						window.params = {'articleid':articleId,'id':id,'commentid':commentId,'comListType':commentType};
            						$.mobile.changePage('../../view/life/comment_list.html',{changeHash:false,transition :'none'});
            					}else{
									$.mobile.changePage('../../view/life/comment_list.html?articleid='+articleId+'&commentid='+commentId+'&comListType='+commentType,{changeHash:false,transition :'none'});
								}
							},1000);
						}
						else
						{
							$.duLife.fns.tips(data.message);
						};
						$('#formBtn').removeClass('disable');
					}
				})
			}else
			{
				   $.duLife.fns.tips('评论内容不能为空，请输入评论内容。');
				   $('#formBtn').removeClass('disable');
			};
		},500)
	});
	$('#lifeComment').on('pagebeforeshow',function(){
		var str =$.mobile.activePage.attr('data-url');
		var strData = $.duLife.fns.getUrlParam({str:str});
		var commentId = strData.commentid || '';
		var commentType =strData.commentType || '生活站';
		var author=strData.author || '';
		var locatonHref=window.location.href;
		if(str.indexOf('comment_list')!=-1 || locatonHref.indexOf('comment_list')!=-1)
		{
			$.mobile.activePage.find('header').html('<a id="backTo" href="javascript:;" class="ui-link"></a>'+commentType);
			$('#lifeComment #backTo').removeAttr('data-rel');
			$('#lifeComment').delegate('#backTo','click',function(){
			$.mobile.changePage(locatonHref,{changeHash:false});
			});
		}else{
			$.mobile.activePage.find('header').html('<a id="backTo" data-rel="back" href="javascript:;" class="ui-link"></a>'+commentType);
		};
		if(commentId)
		{
			$('#textareaBox').val('回复'+author+'：');
		};
	});
	$(window).on('orientationchange',function(){
		setTimeout(function(){
			$('header').css('position','absolute')
		},500)
		
	}).on('resize',function(){
		setTimeout(function(){
			$('header').css('position','absolute')
		},500)
	})
})(jQuery);

