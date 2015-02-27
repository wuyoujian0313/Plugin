 ;(function($,window){
        window.$mainView = $('#demand #demandList');
        var demandScroll;
        window.loadData = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var cb = options.cb || function(){};
        $.jsonp({
            url: window.duLife.URLS.demand,
            callbackParameter: 'callback',
            timeout:8000,
            data: {},
            beforeSend: function(xhr){
            	//validSession('../../login.html',this);
            },
            success: function(data){
                var src_demandList = $('#tpl_demandList').html();
                var tpl_demandList = Handlebars.compile(src_demandList);
                dataHandle(tpl_demandList(data));
                setTimeout(function(){
                    var wrapper = $('#demand #mainWrapper');
                    wrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
                    demandScroll = new iScroll(wrapper[0]);
                 },200);
				var i = 1;
		        var freshInterval = setInterval(function(){
		            if(i>=4){
		                clearInterval(freshInterval);
		            }
		            demandScroll.refresh();
		            i++;
		        },500);
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
    $('#demand').on('pagebeforeshow',function(){
    	loadData();
     });
    $mainView.delegate('li','click',function(){
       var demandid = $(this).attr('demandid');
       window.location='./../../view/demand/detail.html?id='+demandid;
   });
})(jQuery,window);
