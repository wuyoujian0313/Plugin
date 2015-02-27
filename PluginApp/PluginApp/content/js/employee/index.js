 ;(function($,window){
    if(window.is40){ return false; }
    var lifeScroll;
    var employeeJsonpAjax;
    var lifeIndex = {
        CONSTANT: {
            $viewList:$('#lifeIndex #viewList'),
            $mainWrapper:$('#lifeIndex #mainWrapper'),
            $tabTransfer: $('#lifeIndex #tabTransfer')
        },
        init:function(){
            var self = this;
            self.initNavigation();

            self.CONSTANT.$tabTransfer.delegate('li','click',function(event){
                if(employeeJsonpAjax && employeeJsonpAjax.abort){
                    employeeJsonpAjax.abort();
                }
                var cb = self.initScroll;
                if(lifeScroll){
                    cb = function(){
                        setTimeout(function(){
                            lifeScroll.refresh();
                            lifeScroll.scrollTo(0,0);
                        },200) 
                        var i = 1;
                        var freshInterval = setInterval(function(){
                            if(i>=4){
                                clearInterval(freshInterval);
                            }
                            lifeScroll.refresh();
                            i++;
                        },500);
                    };
                }
                
                var $target = $(this);
                if($target.hasClass('current')) return false;
                $target.siblings().removeClass('current');
                $target.addClass('current');
                
                $("#tabBox img").each(function(){
                    $(this).attr('src',$(this).attr('normalsrc'));
                });
                
                var tempid = "ul#tabBox li:eq(" + $target.index() + ")>img";
                $(tempid).attr("src",$(tempid).attr("hlightsrc"));
                
                var navigationid = $target.attr('navigationid');
                self.initContent({'id':navigationid,'cb':cb});
            });
        },

        initScroll: function(){
            var self = lifeIndex;
            setTimeout(function()
            {
                self.CONSTANT.$mainWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) 
                    - window.statusHeight - parseInt($('header').height()) - parseInt($('#tabTransfer').height()));
                lifeScroll = new iScroll(self.CONSTANT.$mainWrapper[0]);
            },200);
        },
        initNavigation:function(){
            var self = lifeIndex;
            var url = window.duLife.URLS.employeeNavigation; 
            employeeJsonpAjax = $.jsonp({
                url:url,
                data:{},
                callbackParameter: 'callback',
                timeout:5000,
                beforeSend: function(){
                    //validSession('../../login.html',this);
                },
                success: function(data){
                    convertNavagation(data);
                    
                    var $target = $(".tabBox li:first");
                    $target.addClass('current');
            
                    var $targetImg = $(".tabBox li:first img");
                    $targetImg.attr('src',$targetImg.attr('hlightsrc'));
            
                    var firstNavigationid = $target.attr('navigationid');
                    setTimeout(self.initContent({id:firstNavigationid,'cb':self.initScroll}),200);
                },
                error: function(args){
                    $.duLife.fns.tips("加载数据错误");
                    return false;
                }
            });
        },
        initContent:function(opt){
            var self = lifeIndex;
//          self.CONSTANT.$mainWrapper.addClass('box');
            var opt = opt || {},
                dataHandle = opt.dataHandle ? opt.dataHandle : function(data){self.CONSTANT.$viewList.html(data)},
                cb = opt.cb || function(){};
            
            var url = window.duLife.URLS.employeeContent; 
            $.jsonp({
                url:url,
                data:{
                    id:opt.id
                },
                callbackParameter: 'callback',
                timeout:5000,
                beforeSend: function(){
                    //validSession('../../login.html',this);
                },
                success: function(data){
                    if(data.catagoryList && data.catagoryList.length > 0){
                        convertContent(data);
                        
                        $('#lifeIndex #viewList li:even').css("background","#ffffff");
//                      self.CONSTANT.$mainWrapper.removeClass('box');
                        
                        self.CONSTANT.$viewList.delegate('li','click',function(){
                            var catagoryid = $(this).attr('catagoryid');
//                          $.mobile.changePage('catagoryDetail.html',{data:{id:catagoryid},transition:'none'});
                            location.href = 'catagoryDetail.html?id=' + catagoryid;
                        });
                    }
                    
                    if(data.articleList && data.articleList.length > 0){
                        convertContent(data);
                    }
                    
                    cb();
                },
                error: function(args){
                    $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                    cb();
                    return false;
                }
            });
        }
    } 
    $('#lifeIndex').on('pagebeforeshow',function(){
        lifeIndex.init();
    });
    
    function handleBars(target,template,json){
       var tpl= template.html();
       var template = Handlebars.compile(tpl);
       target.html(template(json));
    }
    function convertNavagation(json){
        handleBars($('#tabTransfer'),$('#tpl_navigation'),json);
    }
    
    function convertContent(json){
        handleBars($('#viewList'),$('#tpl_contentList'),json);
    }
       
})(jQuery,window);
