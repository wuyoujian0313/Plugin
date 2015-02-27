 ;(function($,window){
    if(window.is40){ return false; }
        window.$mainView = $('#demandDetail #detailList');
        var demandScroll;
        window.loadDetailData = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var paramData = $.duLife.fns.getUrlParam();
        var id = paramData.id;
        var cb = options.cb || function(){};
        $.jsonp({
            url: window.duLife.URLS.demandDetail,
            callbackParameter: 'callback',
            timeout:8000,
            data: {
                id:id
            },
            beforeSend: function(xhr){
            	//validSession('../../login.html',this);
            },
            success: function(data){
                var conLen=data.modules.length;
                if(conLen<1)
                {
                    $('#demandDetail #detailList').html('<p class="noComment">暂无提问</p>');
                    handleBars($('#detailTitle'),$('#tpl_detailTitle'),data);
                }
                else
                {
                    handleBars($('#detailTitle'),$('#tpl_detailTitle'),data);
                    handleBars($('#detailList'),$('#tpl_detailList'),data);
                    setTimeout(function(){
                        var wrapper = $('#demandDetail #mainWrapper');
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
                }
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
    $('#demandDetail').on('pagebeforeshow',function(){
    	loadDetailData();
    });
    $mainView.delegate('li','click',function(){
        var demandid = $(this).attr('demandid');
        $.mobile.changePage('./../../view/demand/answer.html?id='+demandid,{transition :'none'});
    });
    function handleBars(target,template,json){
       var tpl= template.html();
       var template = Handlebars.compile(tpl);
       target.html(template(json));
    };
})(jQuery,window);
