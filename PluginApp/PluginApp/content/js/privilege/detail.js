// JavaScript Document
 ;(function($,window){
    window.$mainBox = $('#privilegeDetail #mainBox');
	//当前分页初始化
    window.pageNum = 1;
    window.loadData = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainBox.html(data)};
        var cb = options.cb || function(){};
        var pageNum = ((options.pageNum==0) || options.pageNum)? options.pageNum : window.pageNum;
        if(options.id){
            var params = {pageNum:pageNum,id:options.id};
        }else{
            var params = {pageNum:pageNum};
        }
        $.jsonp({
            url: window.duLife.URLS.couponList,
            callbackParameter: 'callback',
            timeout:5000,
            data: params,
            beforeSend: function(){
            },
            success: function(data){
                window.pageNum = pageNum;
                //$('#pullDown,#pullUp').css('visibility','visible');
                var src_privilegeDetail = $('#privilegeDetail #tpl_privilegeDetail').html();
                var tpl_privilegeDetail = Handlebars.compile(src_privilegeDetail);
                dataHandle(tpl_privilegeDetail(data));
                cb(tpl_privilegeDetail(data));
            },
            error: function(args){
                $.duLife.fns.tips('加载数据错误~');
                cb();
                return false;
            }
        });
    };
	loadData({'cb':initScroll});
    /**
      * 下拉刷新 （自定义实现此方法）
      * myScroll.refresh();     // 数据加载完成后，调用界面更新方法
   */
    function pullDownAction (fresh) {
        setTimeout(function () {    // <-- Simulate network congestion, remove setTimeout from production!
            var type = $('#privilegeDetail #tabTransfer .current').attr('type');
            window.loadData({'type':type, 'pageNum':1, cb:function(){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh();
                                        i++;
                                    },500);
                            }, 'dataHandle':function(data){window.$mainBox.html(data);}})
        }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
    }

    /**
     * 滚动翻页 （自定义实现此方法）
     * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
     */
    function pullUpAction (fresh) {
        setTimeout(function () {    // <-- Simulate network congestion, remove setTimeout from production!
            var type = $('#privilegeDetail #tabTransfer .current').attr('type');
            window.loadData({'type':type,'pageNum':window.pageNum+1,cb:function(data){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh(data);
                                        i++;
                                    },500);
                            },'dataHandle':function(data){window.$mainBox.append(data);}})
        }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
    }

    //上下拉动自动刷新内容
    function initScroll(){
        var $mainWrapper = $('#privilegeDetail #mainWrapper');
        setTimeout(function()
        {
            $mainWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($mainWrapper.offset().top));
            $mainWrapper.refresh({'wrapper':$mainWrapper[0],'pullDownAction':pullDownAction,'pullUpAction':pullUpAction});
        });
    } 
})(jQuery,window);
