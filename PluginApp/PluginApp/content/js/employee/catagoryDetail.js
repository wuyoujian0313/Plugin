 ;(function($,window){
    if(window.is40){ return false; }
    window.$mainView = $('#detailIndex #mainView');
	var detailScroll;
    window.loadDetail = function(options){
//  	window.$mainView.addClass('box');
    	
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var cb = options.cb || function(){};
        
        var id = $.duLife.fns.getUrlParam().id;
        var url = window.duLife.URLS.employeeContent;
        
        $.jsonp({
            url: url,
            callbackParameter: 'callback',
            data: {
            	id:id
            },
            timeout:5000,
            beforeSend: function(){
                // validSession('../../login.html',this);
            },
            success: function(data){
            	if(data.articleList && data.articleList.length > 0){
            		var tpl_content = $('#tpl_contentList').html();
            		var template = Handlebars.compile(tpl_content);
            		dataHandle(template(data));
                    setTimeout(function(){
                        window.$mainView.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
                        detailScroll = new iScroll(window.$mainView[0]);
                    },200);
            	}
                cb && cb();
            },
            error: function(args){
            	$.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                return false;
            }
        });
    };
    
    $('#detailIndex').on('pagebeforeshow',function(){
    	loadDetail();
    });

})(jQuery,window);
