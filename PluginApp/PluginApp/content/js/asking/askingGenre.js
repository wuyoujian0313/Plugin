 ;(function($,window){
        if(window.is40){ return false; }
        window.$mainView = $('#askingGenre #demandList');
        var genreScroll;
        window.loadData = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var cb = options.cb || function(){};
        $.jsonp({
            url: window.duLife.URLS.askingGenre,
            callbackParameter: 'callback',
            timeout:8000,
            data: {},
            beforeSend: function(xhr){
            	//validSession('../../login.html',this);
            },
            success: function(data){
                var src_demandList = $('#tpl_genreList').html();
                var tpl_demandList = Handlebars.compile(src_demandList);
                dataHandle(tpl_demandList(data));
                setTimeout(function(){
                    var wrapper = $('#askingGenre #mainWrapper');
                    wrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
                    genreScroll = new iScroll(wrapper[0]);
                 },200);
				var i = 1;
		        var freshInterval = setInterval(function(){
		            if(i>=4){
		                clearInterval(freshInterval);
		            }
		            genreScroll.refresh();
		            i++;
		        },500);
                cb && cb();
            },
            error: function(args){
            	$.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                return false;
            },
            complete: function(xhr){
    
            }
        });
    };
    $('#askingGenre').on('pagebeforeshow',function(){
    	loadData();
     });
    $mainView.delegate('li','click',function(){
       var askedId = $(this).attr('askedId');
       var con=$(this).find('.genreLeft').text();
       //window.location='./../../view/asking/askingQuestion.html?content='+con;
       $.mobile.changePage('../../view/asking/askingQuestion.html?categoryName='+con+'&categoryID='+askedId+'&newCreat=ok',{transition :'none'});

   });
})(jQuery,window);
