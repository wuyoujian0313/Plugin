;(function($){
	$('#formBtn').on('click',function(){
		if($(this).hasClass('disable'))return;
		var val = $.trim($('#textareaBox').val());
		if(val){
			var json={
				'opinion':val
			};
			var url = window.duLife.URLS.submitFeedback;
			$(this).addClass('disable');

			$.jsonp({
				type:'get',
                url: url,
                callbackParameter: 'callback',
                timeout:5000,
                data: json,
                beforeSend: function(){
                },
                success: function(data){
					if(data.success){
						$.duLife.fns.tips('反馈成功');
						setTimeout(function(){
							location.href='../../view/personal/setting.html';
						},1000);
					}else{
						$.duLife.fns.alert('反馈失败');
					}
                	$('#formBtn').removeClass('disable');
                },
                error: function(args){
                    $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                    return false;
                }
            })
		}else{
			$.duLife.fns.tips('请输入想要反馈的内容');
			$('#formBtn').removeClass('disable');
		}
	});
})(jQuery);