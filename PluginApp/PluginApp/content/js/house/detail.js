// JavaScript Document
 ;(function($,window){
    if(window.is40){ return false; }
    window.$mainView = $('#houseDetail #mainView');
    var houseDetailScroll;
    window.loadDetailData = function(options){
        var options = options || {};
        var type = options.type || 'all';
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var cb = options.cb || function(){};
        var paramData = $.duLife.fns.getUrlParam();
        var id = paramData.id || null;
        var articleId = paramData.articleId || null;
        $.jsonp({
            url: window.duLife.URLS.houseDetail,
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
                var status=data.house.status;
                var src_house = $('#tpl_house').html();
                var tpl_house = Handlebars.compile(src_house);
                dataHandle(tpl_house(data));
                $("#contentText").find('img').css({'max-width':'100%','height':'auto'});
                $("#contentText").find("input[type=image]").css({'max-width':'100%','height':'auto'});               
                setTimeout(function(){
                    if(status=='发布')
                    {
                        $('#houseWrapper').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()) - parseInt($('#houseDetail menu').height())); 
                    }
                    else
                    {
                       $('#houseWrapper').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height())); 
                    }
                   
                    houseDetailScroll = new iScroll('houseWrapper');
                    $('menu').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('#houseDetail menu').height()),'visibility':'visible'})
                },500);
                var i = 1;
                var freshInterval = setInterval(function(){
                    if(i>=4){
                        clearInterval(freshInterval);
                    }
                    houseDetailScroll.refresh();
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
                //$('menu').css('top',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight +'px');
                $('menu').delegate('.writeComment','click',function(){
                    var articleid = $(this).attr('articleid');
                    if(window.is40){
                        window.params = {'commentType':'安居坊','articleid':articleid};
                        $.mobile.changePage('../../view/life/life_comment.html',{transition :'none'});
                    }else{
                        $.mobile.changePage('../../view/life/life_comment.html?commentType=安居坊&articleid='+articleid,{transition :'none'});
                    }
                });
                $('menu').delegate('.lookComment','click',function(){
                    var articleid = $(this).attr('articleid');
                    if(window.is40){
                        window.params = {'comListType':'安居坊','articleid':articleid};
                        $.mobile.changePage('../../view/life/comment_list.html',{transition:'none'});
                    }else{
                        $.mobile.changePage('../../view/life/comment_list.html?comListType=安居坊&articleid='+articleid,{transition :'none'});
                        //location.href = '../../view/life/comment_list.html?comListType='+titleText+'&articleid='+articleid;
                    }
                });
                cb && cb();
            },
            error: function(args){
                $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                cb && cb();
                return false;
            }
        });
    };
    $('#houseDetail').on('pagebeforeshow',function(){
        var ifmation =$.duLife.fns.getUrlParam().ifmation;
        var hsy = $.duLife.fns.getUrlParam().hsy;
        if(ifmation)
        {
            $('#houseDetail #backTo').removeAttr('data-rel');
            $('#houseDetail #backTo').attr({'href':'../../view/personal/information.html','data-ajax':false});
        };   
        loadDetailData();
    })
})(jQuery,window);
