// JavaScript Document
 ;(function($,window){
    window.$mainBox = $('#informationPage #mainBox');
	//当前分页初始化
    window.loadDataInfor = function(options){
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
            url: window.duLife.URLS.manageMsg,
            callbackParameter: 'callback',
            data: params,
            timeout:5000,
            beforeSend: function(){
                //validSession('../../login.html',this);
            },
            success: function(data){
                $.mobile.activePage.find('#loadImg').css('display','none');
                window.pageNum = pageNum;
               if(data.messageList.totalPageNum==0)
               {
                    $('#informationPage #mainWrapper').html('<p class="noComment">暂无消息</p>');
               }
               else
               {
                    $('#pullDown,#pullUp').show();
                    var src_messageList = $('#informationPage #tpl_messageList').html();
                    var tpl_messageList = Handlebars.compile(src_messageList);
                    dataHandle(tpl_messageList(data));      
                    cb && cb(tpl_messageList(data));
               }
               
            },
            error: function(args){
                $.duLife.fns.tips("加载数据错误~");
                cb && cb(true);
                return false;
            }
        });
    };
    $('#informationPage').on('pagebeforeshow',function(){
        window.pageNum = 1;
        loadDataInfor({'cb':initScroll});
    });
	/*选中回复状态*/
	function showRestore()
    {
        $mainBox.delegate('.inforBox','click',function()
        {
            var $target=$(this);
            if($target.hasClass('activeBox'))
            {
               
                $('.inforBox').removeClass('activeBox');
            }
            else
            {
                $target.addClass('activeBox').siblings().removeClass('activeBox');
            };
            var msgId=$(this).attr('msgid');
            var url=window.duLife.URLS.updateMsg;
            var json={
                  id:msgId
             };
            $.jsonp({
                type:'GET',
                url: url,
                callbackParameter: 'callback',
                timeout:5000,
                data: json,
                beforeSend: function(){
                    //validSession('../../login.html',this);
                },
                success: function(data){
                },
                error: function(args){
                    $.duLife.fns.tips("加载数据错误~");
                    return false;
                }
            });
        });
        
    };
    showRestore();
    /**
      * 下拉刷新 （自定义实现此方法）
      * myScroll.refresh();     // 数据加载完成后，调用界面更新方法
   */
    function pullDownAction (fresh) {
        var type = $('#informationPage #tabTransfer .current').attr('type');
        setTimeout(function () {   
            window.loadDataInfor({'type':type, 'pageNum':1,'cb':function(){
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
        var type = $('#informationPage #tabTransfer .current').attr('type');
        setTimeout(function () {
            window.loadDataInfor({'type':type,'pageNum':window.pageNum+1,'cb':function(data){
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
        var $mainWrapper = $('#informationPage #mainWrapper');
        setTimeout(function(){
            $mainWrapper.css('height',$('body>div').height() - parseInt($('header').height()));
            $mainWrapper.refresh({'wrapper':$mainWrapper[0],'pullDownAction':pullDownAction,'pullUpAction':pullUpAction});
        },200)
    } 
})(jQuery,window);
