 ;(function($,window){
    var lifeScroll;
    var assJsonpAjax;
    window.$viewList = $('#associationsIndex #viewList');
    //当前分页初始化
    window.pageNum = 1;
    window.loadAsIndexData = function(opt){
            var opt = opt || {},
            type = opt.type? opt.type : 'all',
            pageNum = ((opt.pageNum==0) || opt.pageNum)? opt.pageNum : window.pageNum,
            dataHandle = opt.dataHandle ? opt.dataHandle : function(data){$viewList.html(data)},
            cb = opt.cb || function(){};
        if(opt.id){
            var params = {type:type,pageNum:pageNum,id:opt.id};
        }else{
            var params = {type:type,pageNum:pageNum};
        };
        if(assJsonpAjax && assJsonpAjax.abort){
            assJsonpAjax.abort();
        }
        if(type=='teamActivity')
            {
                assJsonpAjax = $.jsonp({
                    url: window.duLife.URLS.activity,
                    callbackParameter: 'callback',
                    data: params,
                    timeout:5000,
                    beforeSend: function(xhr){
                        //validSession('../../login.html',this);
                        //$("body").append('<div class="loading-screen"></div>');
                       // alert('beforeSend:'+xhr)
                    },
                    success: function(data){
                        $('#newestData').hide();
                       // $('.loading-screen').remove();
                        window.pageNum = pageNum;
                        $.mobile.activePage.find('#loadImg').css('display','none');
                        //$.mobile.activePage.find('#pullDown,#pullUp').css('visibility','visible');
                        var src_articlelist = $('#associationsIndex  #tpl_teamActivity').html(),
                        tpl_teamActivity = Handlebars.compile(src_articlelist);
                        dataHandle(tpl_teamActivity(data)); 
                        cb && cb(tpl_teamActivity(data));
                    },
                    error: function(args){
                        $('.loading-screen').remove();
                        $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                        $.mobile.activePage.find('#loadImg').css('display','none');
                        cb && cb(true);
                        return false;
                    }
                });
            }else
            {
                assJsonpAjax = $.jsonp({
                    url: window.duLife.URLS.teamIndex,
                    callbackParameter: 'callback',
                    data: params,
                    timeout:5000,
                    beforeSend: function(xhr){
                        //validSession('../../login.html',this);
                        //$("body").append('<div class="loading-screen"></div>');
                       // alert('beforeSend:'+xhr)
                    },
                    success: function(data){
                        $('#newestData').hide();
                        //$('.loading-screen').remove();
                        window.pageNum = pageNum;
                        $('#loadImg').css('display','none');
                        //$('#pullDown,#pullUp').css('visibility','visible');
                        var src_teamList = $('#associationsIndex #tpl_teamList').html(),
                        tpl_teamList = Handlebars.compile(src_teamList);
                        dataHandle(tpl_teamList(data)); 
                        cb && cb(tpl_teamList(data));
                    },
                    error: function(args){
                        $('.loading-screen').remove();
                        $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                        $('#loadImg').css('display','none');
                        cb && cb(true);
                        return false;
                    }
                });
            };
    };
    //初始化加载数据
    $('#associationsIndex').on('pageinit',function(){
        $('#tabTransfer li').each(function()
        {
            if($(this).hasClass('current'))
            {
                tabType=$(this).attr('type');
            }
        });
       loadAsIndexData({'type':tabType,'cb':initScroll});
    });
    changeTab({'cb':function(type)
    {
        $('#associationsIndex #pullUp').css("visibility",'hidden');
        var cb = initScroll;
        if(lifeScroll){
            if(!lifeScroll.enabled) return; // data loading
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
            }
        }
        $('#associationsIndex #viewList').removeClass().addClass(type);
        window.loadAsIndexData({'type':type,'cb':cb});
    }});

    //跳转至精彩活动的详情页
    $viewList.delegate('.articleItem','click',function(){
        var articleid = $(this).attr('articleid');
        if(window.is40){
            window.params = {articleid:articleid,detailtype:'社团汇'};
            $.mobile.changePage('./../../view/life/life_detail.html',{transition :'none'});
        }else{
            $.mobile.changePage('./../../view/life/life_detail.html?articleid='+articleid+'&detailtype=社团汇',{transition :'none'});
        }
    });
    //跳转至社团详情页
    $viewList.delegate('.privilegeInfor','click',function(){
        var teamListId = $(this).attr('teamListId');
        if(window.is40){
            window.params = {id:teamListId};
            $.mobile.changePage('./../../view/associations/detail.html',{transition :'none'});
        }else{
            $.mobile.changePage('./../../view/associations/detail.html?id='+teamListId,{transition :'none'});
        }
        
    });
    
    /**
      * 下拉刷新 （自定义实现此方法）
      * myScroll.refresh();     // 数据加载完成后，调用界面更新方法
   */
    function pullDownAction (fresh) { 
        var type = $('#associationsIndex #tabTransfer .current').attr('type');
        setTimeout(function () {
            window.loadAsIndexData({'type':type,'pageNum':1,'cb':function(){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh();
                                        i++;
                                    },500);
                            }, 'dataHandle':function(data){$('#associationsIndex #viewList.'+type).html(data);}})
        }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
    }

    /**
     * 滚动翻页 （自定义实现此方法）
     * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
     */
    function pullUpAction (fresh) {
        var type = $('#tabTransfer .current').attr('type');
        setTimeout(function () { 
            window.loadAsIndexData({'type':type,'pageNum':window.pageNum+1, 'cb':function(data){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh(data);
                                        i++;
                                    },500);
                            },'dataHandle':function(data){$('#associationsIndex #viewList.'+type).append(data);}})
        }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
    }

    //上下拉动自动刷新内容
    function initScroll(){
        var $mainWrapper = $('#associationsIndex #mainWrapper');
        setTimeout(function()
        {
            $mainWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($mainWrapper.offset().top));
            lifeScroll = $mainWrapper.refresh({'wrapper':$mainWrapper[0],'pullDownAction':pullDownAction,'pullUpAction':pullUpAction});
        },200);
    }; 
})(jQuery,window);
