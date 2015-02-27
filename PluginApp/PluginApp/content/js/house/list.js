 ;(function($,window){
    window.$viewList = $('#houseList #viewList');
    window.$statistics = $('#houseList #statistics');
    //当前分页初始化
    window.pageNum = 1;
    window.loadData = function(opt){
        var opt = opt || {},
            pageNum = ((opt.pageNum==0) || opt.pageNum)? opt.pageNum : window.pageNum,
            dataHandle = opt.dataHandle ? opt.dataHandle : function(data){
                $statistics.html(data.statistics);
                $viewList.html(data.viewList);
            },
            cb = opt.cb || function(){};
        if(opt.id){
            var params = {pageNum:pageNum,id:opt.id};
        }else{
            var params = {pageNum:pageNum};
        }
        $.jsonp({
            url: window.duLife.URLS.houseList,
            callbackParameter: 'callback',
            timeout:5000,
            data: params,
            beforeSend: function(xhr){
                // validSession('../../login.html',this);
                $("body").append('<div class="loading-screen"></div>');
               // alert('beforeSend:'+xhr)
            },
            success: function(data){
                $('.loading-screen').remove();
                    window.pageNum = pageNum;
                    $.mobile.activePage.find('#loadImg').css('display','none');
                    var src_articlelist = $('#houseList #tpl_goodslist').html(),
                    tpl_articlelist = Handlebars.compile(src_articlelist),
                    src_statistics = $('#houseList #tpl_statistics').html(),
                    tpl_statistics = Handlebars.compile(src_statistics);
                dataHandle({'statistics':tpl_statistics(data), 'viewList':tpl_articlelist(data)},data); 
                cb(tpl_articlelist(data));
            },
            error: function(args){
                $('.loading-screen').remove();
                $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                cb(true);
                return false;
            }
        })
        
    }
    //初始化加载数据
    loadData({'cb':initScroll});
    //跳转至详情页
    $viewList.delegate('.articleItem','click',function(){
        var articleid = $(this).attr('articleid');
        if(window.is40){
            window.params = {id:articleid};
            $.mobile.changePage('../../view/house/detail.html',{transition :'none'});
        }else{
            $.mobile.changePage('../../view/house/detail.html',{data:{id:articleid},transition :'none'});
        }
    })

    /**
      * 下拉刷新 （自定义实现此方法）
      * myScroll.refresh();     // 数据加载完成后，调用界面更新方法
   */
    function pullDownAction (fresh) {
        setTimeout(function () {    // <-- Simulate network congestion, remove setTimeout from production!
            window.loadData({
                'pageNum':1, 
                'cb':function(){
                        var i = 1;
                        var freshInterval = setInterval(function(){
                            if(i>=4){
                                clearInterval(freshInterval);
                            }
                            fresh();
                            i++;
                        },500);
                },
                'id':window.$viewList.children('.articleItem').eq(0).attr('articleId'),
                'dataHandle':function(data,json){
                    var total =json.articleList.totalCount;
                    var today = json.count.todayCount;
                    $('#statistics span').eq(0).find('em').text(total);
                    $('#statistics span').eq(1).find('em').text(today);
                    window.$viewList.html(data.viewList);
                }
            })
        }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
    }

    /**
     * 滚动翻页 （自定义实现此方法）
     * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
     */
    function pullUpAction (fresh) {
        setTimeout(function () { 
            window.loadData({'pageNum':window.pageNum+1,'cb':function(data){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh(data);
                                        i++;
                                    },500);
                            },'dataHandle':function(data){
                                window.$viewList.append(data.viewList);
                            }})
        }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
    }

    //上下拉动自动刷新内容
    function initScroll(){
        var $mainWrapper = $('#houseList #mainWrapper');
        setTimeout( function(){
            $mainWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($mainWrapper.offset().top));
            $mainWrapper.refresh({'wrapper':$mainWrapper[0],'pullDownAction':pullDownAction,'pullUpAction':pullUpAction});
        },200);
    } 
    
})(jQuery,window);










