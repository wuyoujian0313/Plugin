;(function($){
	if(window.is40){ return false; }
	$('#textareaBox').textLimit(300);
	$('#subBtn').on('click',function(){
		if($(this).hasClass('disable'))
		{
			return;
		}
		var val = $.trim($('#textareaBox').val());
		var str =$.mobile.activePage.attr('data-url');
		var paramData = $.duLife.fns.getUrlParam({str:str});
		var categoryID=paramData.categoryID;
		var categoryName= paramData.categoryName;
		var newCreat = paramData.newCreat || '';
		var topicID= paramData.topicID || '';
		var againAsk = paramData.againAsk || '';
		var id = paramData.id || '';
		$(this).addClass('disable');
		setTimeout(function(){
			if(val){
				if(id)
				{
	     			var json={'categoryID':categoryID,'content':val,'id':id};
				}else if(againAsk)
				{
					var json={'categoryID':categoryID,'content':val,'topicID':topicID};
				}else
				{
	     			var json={'categoryID':categoryID,'content':val};
				}
				if(againAsk)
				{
                    var url=window.duLife.URLS.againAsk;
				}else{
					var url=window.duLife.URLS.askingQuestion;
				};
				$.jsonp({
					type:'post',
					url: url,
					callbackParameter: 'callback',
					data: json,
					beforeSend: function(){
					},
					success: function(data){
						if(data.success)
						{
							$.duLife.fns.tips(data.message);
							setTimeout(function()
							{
								if(newCreat)
								{
				            		window.location='../../view/asking/index.html';
								}
								else
								{
									location.replace('../../view/asking/askingAnswer.html?categoryID='+categoryID+'&categoryName='+categoryName+'&id='+topicID);
								}

							},1000);
						}
						else
						{
							$.duLife.fns.tips(data.message);
						};
						$('#subBtn').removeClass('disable');
					}
				})
			}else
			{
				   $.duLife.fns.tips('提问内容不能为空，请输入想要提问的内容。');
				   $('#subBtn').removeClass('disable');
			};
		},500)
	});
	$('#askQet').on('pagebeforeshow',function(){
		var str =$.mobile.activePage.attr('data-url');
		var strData = $.duLife.fns.getUrlParam({str:str});
		var headerText = strData.categoryName || '';
		var quCon = strData.title || '';
		var locatonHref=window.location.href;
		$.mobile.activePage.find('header').html('<a id="backTo" href="javascript:;" data-rel="back" class="ui-link"></a>'+headerText);
		if(quCon)
		{
			$('#textareaBox').val(quCon);
		};
	});
})(jQuery);

