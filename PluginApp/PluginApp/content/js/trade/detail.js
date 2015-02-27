// JavaScript Document
;(function($,window){
    //validSession('../../login.html');
//window.updateTokenFn();

    if(window.is40){ return false; }
    window.$mainView = $('#tradeDetail #mainView');
    var tradeDetailScroll;
    window.loadtradeDetialData = function(options){
        var options = options || {};
        var type = options.type || 'all';
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var cb = options.cb || function(){};
        var paramData = $.duLife.fns.getUrlParam();
        var id = paramData.id || null;
        var articleId = paramData.articleId || null;
        $.jsonp({
            url: window.duLife.URLS.goodsDetail,
            callbackParameter: 'callback',
            timeout:8000,
            data: {
                id:id,
                articleId:articleId
            },
            beforeSend: function(){
                // validSession('../../login.html',this);
            },
            success: function(data){
                var status=data.goods.status;
                var src_goods = $('#tpl_goods').html();
                var tpl_goods = Handlebars.compile(src_goods);
                dataHandle(tpl_goods(data));
                $("#contentText").find('img').css({'max-width':'100%','height':'auto'});
                $("#contentText").find("input[type=image]").css({'max-width':'100%','height':'auto'});
                setTimeout(function(){
                    if(status=='发布')
                    {
                        $('#tradeWrapper').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()) - parseInt($('#tradeDetail menu').height())); 
                    }
                    else
                    {
                       $('#tradeWrapper').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height())); 
                    }
                    tradeDetailScroll = new iScroll('tradeWrapper');
                    $('menu').css({'top':Math.min(Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight ,parseInt(window.screen.height)) - parseInt($('#tradeDetail menu').height()),'visibility':'visible'});
                },500);
                var i = 1;
                var freshInterval = setInterval(function(){
                    if(i>=4){
                        clearInterval(freshInterval);
                    }
                    tradeDetailScroll.refresh();
                    i++;
                },510);
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
                $('menu').delegate('.writeComment','click',function(){
                    var articleid = $(this).attr('articleid');
                    if(window.is40){
                        window.params = {'commentType':'跳蚤街','articleid':articleid};
                        $.mobile.changePage('../../view/life/life_comment.html',{transition :'none'});
                    }else{
                        $.mobile.changePage('../../view/life/life_comment.html?commentType=跳蚤街&articleid='+articleid,{transition :'none'});
                    }
                });
                $('menu').delegate('.lookComment','click',function(){
                    var articleid = $(this).attr('articleid');
                    if(window.is40){
                        window.params = {'comListType':'跳蚤街','articleid':articleid};
                        $.mobile.changePage('../../view/life/comment_list.html',{transition :'none'});
                    }else{
                        $.mobile.changePage('../../view/life/comment_list.html?comListType=跳蚤街&articleid='+articleid,{transition :'none'});
                    }
                });
                cb && cb();
            },
            error: function(args){
                $.duLife.fns.tips("加载数据错误~");
                return false;
            }
        });
        // var src_goods = $('#tpl_goods').html();
        // var tpl_goods = Handlebars.compile(src_goods);
        // dataHandle(tpl_goods(window.duLife.feData.goodsDetail));
        // setTimeout(function(){
        //     $('#tradeWrapper').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight  - parseInt($('#mainView').offset().top) - parseInt($('#tradeDetail menu').height()));
        //     tradeDetailScroll = new iScroll('tradeWrapper');
        // },500)
    };
    //初始化加载数据
    $('#tradeDetail').on('pagebeforeshow',function(){
        var ifmation =$.duLife.fns.getUrlParam().ifmation;
        if(ifmation)
        {
            $('#tradeDetail #backTo').removeAttr('data-rel');
            $('#tradeDetail #backTo').attr({'href':'../../view/personal/information.html','data-ajax':false});
        };
       loadtradeDetialData();
    });
})(jQuery,window);
