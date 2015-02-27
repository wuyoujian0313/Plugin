 ;(function($,window){
        if(window.is40){ return false; }
        window.$mainView = $('#asking #askList');
        var askScroll;
        window.loadData = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var pageNum = ((options.pageNum==0) || options.pageNum)? options.pageNum : window.pageNum;
        var cb = options.cb || function(){};
        if(options.id){
            var params = {pageNum:pageNum,id:options.id};
        }else{
            var params = {pageNum:pageNum};
        }
        $.jsonp({
            url: window.duLife.URLS.askingIndex,
            callbackParameter: 'callback',
            timeout:8000,
            data: params,
            beforeSend: function(xhr){
            	//validSession('../../login.html',this);
            },
            success: function(data){
                $.mobile.activePage.find('#loadImg').css('display','none');
                var length=data.myQuestion.questions.length;
                if(length==0)
                {
                    $('#asking #mainWrapper').html('<p class="noComment">暂无提问</p>');
                    setTimeout(function(){
                        var padBot=$('#askQuestion')[0].offsetHeight;
                        $('#askQuestion').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - padBot,'visibility':'visible'})
                    },200);
                }else{
                    var src_demandList = $('#tpl_askList').html();
                    var tpl_demandList = Handlebars.compile(src_demandList);
                    dataHandle(tpl_demandList(data));
                    setTimeout(function(){
                        var padBot=$('#askQuestion')[0].offsetHeight;
                        $('#askQuestion').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - padBot,'visibility':'visible'})
                        var wrapper = $('#asking #mainWrapper');
                        wrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
                        askScroll = new iScroll(wrapper[0]);
                    },200);
                    cb && cb();                    
                }
            },
            error: function(args){
                $.mobile.activePage.find('#loadImg').css('display','none');
            	$.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                cb && cb();
                return false;
            },
            complete: function(xhr){
    
            }
        });

    };
    $('#askQuestion').on({
        'touchstart':function()
        {
            $(this).addClass('hover');
        },
        'touchend':function()
        {
            $(this).removeClass('hover');
        }
    });
    $('#asking').on('pagebeforeshow',function(){
        window.pageNum = 1;
    	loadData();
     });
    $('#asking').delegate('#askQuestion','click',function(){
       $.mobile.changePage('../../view/asking/askingGenre.html',{transition :'none'});
    });
    $('#asking').delegate('.situation','click',function()
    {
       var id=$(this).attr('data-id');
       var categoryName=$(this).attr('categoryName');
       window.location='../../view/asking/askingAnswer.html?id='+id+'&categoryName='+categoryName;
  
    });

})(jQuery,window);
