 ;(function($,window){
 	if(window.is40){ return false; }
	window.$viewContent = $('#viewContent');
	var assDetailScroll;
	window.loadDatas = function(opt){
		var opt = opt || {},
		pageNum = opt.pageNum? opt.pageNum : window.pageNum,
		dataHandle = opt.dataHandle ? opt.dataHandle : function(data){$viewContent.html(data)},
		cb = opt.cb || function(){};
		var id = $.duLife.fns.getUrlParam().id;
		$.jsonp({
			url: window.duLife.URLS.teamDetail,
			callbackParameter: 'callback',
			timeout:5000,
			beforeSend: function(){
			},
			data: {
				id:id
			},
			success: function(data){
				var src_associationsDetail = $('#tpl_associationsDetail').html(),
				tpl_associationsDetail = Handlebars.compile(src_associationsDetail);
				dataHandle(tpl_associationsDetail(data)); 
				setTimeout(function(){
					var wrapper = $('#associationsDetail #viewContent');
					$('#associationsDetail #viewContent').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
					assDetailScroll = new iScroll(wrapper[0]);
				},200);
				var i = 1;
		        var freshInterval = setInterval(function(){
		            if(i>=4){
		                clearInterval(freshInterval);
		            }
		            assDetailScroll.refresh();
		            i++;
		        },500);
				cb && cb();
			},
			error: function(args){
				$.duLife.fns.alert('亲，网络环境不稳定，请刷新重试');
				cb && cb();
				return false;
			}
		})
 };
 //初始化加载数据
 $('#associationsDetail').on('pagebeforeshow',function(){
	loadDatas();
 });
})(jQuery,window);
