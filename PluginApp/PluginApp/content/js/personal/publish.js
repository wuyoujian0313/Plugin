// JavaScript Document
 ;(function($,window){
    window.$mainBox = $('#mainBox');
    var publishScroll;
	//当前分页初始化
    window.pageNum = 1;
    window.loadDataPub = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainBox.html(data)};
        var cb = options.cb || function(){};
        $.jsonp({
            url: window.duLife.URLS.managePosts,
            callbackParameter: 'callback',
            timeout:5000,
            beforeSend: function(){
                // validSession('../../login.html',this);
            },
            data: {
                pageSize:1000
            },
            success: function(data){
                $.mobile.activePage.find('#loadImg').css('display','none');
                var src_messagePosts = $('#tpl_messagePosts').html();
                var tpl_messagePosts = Handlebars.compile(src_messagePosts);
                dataHandle(tpl_messagePosts(data));
                setTimeout(function(){
                    $('#mainBox').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
                    publishScroll = new iScroll('mainBox');
                },500);
                cb && cb();
            },
            error: function(args){
                $.duLife.fns.tips("加载数据错误~");
                cb && cb();
                return false;
            }
        });
    };
    //关闭发布
    $('#publishPage').delegate('.changeStatus','swiperight',function(){
        var _this=$(this);
        var pubId=_this.attr('data-id');
        var pubarticleId=_this.attr('data-articleId');
        var json={
                   id:pubId,
            articleId:pubarticleId
        };
        var url=window.duLife.URLS.closeGoods;
        $.jsonp({
            type:'GET',
            url: url,
            callbackParameter: 'callback',
            data: json,
            timeout:5000,
            beforeSend: function(){
                //validSession('../../login.html',this);
            },
            success: function(data){
               $.duLife.fns.tips(data.message);
               _this.addClass('dis');
               var par=_this.parents('.situation');
               par.find('.overStatus').removeClass('dis');
               par.find('.showSituation').removeClass('success').addClass('sendBack').html('<div><b></b>已出</div>');
               par.find('.modify').removeAttr('href');
               par.find('.modify b').addClass('modis');
            },
            error: function(args){
                $.duLife.fns.tips("加载数据错误~");
                return false;
            }
        });
    });
    //开启发布
    $('#publishPage').delegate('.overStatus','swipeleft',function(){
        var _this=$(this);
        var pubId=_this.attr('data-id');
        var pubarticleId=_this.attr('data-articleId');
        var json={
                   id:pubId,
            articleId:pubarticleId
        };
        var url=window.duLife.URLS.openGoods;
        $.jsonp({
            type:'GET',
            url: url,
            callbackParameter: 'callback',
            timeout:5000,
            beforeSend: function(){
                //validSession('../../login.html',this);
            },
            data: json,
            success: function(data){
               $.duLife.fns.tips(data.message);
               var par=_this.parents('.situation');
               var hrefValue=par.find('.modify').attr('data-href');
               _this.addClass('dis');
               par.find('.changeStatus').removeClass('dis');
               par.find('.showSituation').removeClass('sendBack').addClass('success').html('<div><b></b>已发布</div>');
               par.find('.modify').attr('href',hrefValue);
               par.find('.modify b').removeClass('modis');

            },
            error: function(args){
                $.duLife.fns.tips("加载数据错误~");
                return false;
            }
        });
            
    });
    //删除
    $('#publishPage').delegate('.resultTips .cancle','click',function(){
        var _this=$(this);
        $('#publishPage .cancle').removeClass('current');
        _this.addClass('current');
        $.duLife.fns.confirm('确定要删除？',function(){
        var url=window.duLife.URLS.delGoods;
        $.jsonp({
            type:'GET',
            url: url,
            callbackParameter: 'callback',
            timeout:5000,
            data: {
                articleId:$('#publishPage .cancle.current').data('id')
            },
            beforeSend: function(){
                //validSession('../../login.html',this);
            },
            success: function(data){
              if(data.success)
              {
                $.duLife.fns.tips(data.message);
                $('#publishPage .cancle.current').closest('.situation').remove();
              }
              else
              {
                $.duLife.fns.tips(data.message);
              }
            },
            error: function(args){
                $.duLife.fns.tips("加载数据错误~");
                return false;
            }
         });
        });
    });
    $('#publishPage').on('pagebeforeshow',function(){
        loadDataPub();
    });
})(jQuery,window);
