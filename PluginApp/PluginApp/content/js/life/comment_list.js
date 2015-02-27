// JavaScript Document
;(function($,window){
    if(window.is40){ return false; }
    //validSession('../../login.html');
//window.updateTokenFn();

    window.$mainBox = $('#commentList #mainBox');
    var commentListScroll;
	//当前分页初始化
    window.loadCommentListData = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainBox.html(data);};
        var cb = options.cb || function(){};
        var str =$.mobile.activePage.attr('data-url');
        var paramData = $.duLife.fns.getUrlParam();
        var id = paramData.id;
        var strData = $.duLife.fns.getUrlParam({str:str});
        var commentId=strData.commentid;
        var articleId = strData.articleid; 
        var comListType= strData.comListType || '生活站';
        var pageNum = ((options.pageNum==0) || options.pageNum)? options.pageNum : window.pageNum;
        $.mobile.activePage.find('header').html('<a id="backTo" href="javascript:;" data-rel="back" class="ui-link"></a>'+comListType);
        if(options.id){
            var params = {'commentid':commentId,'id':articleId,'pageNo':pageNum,'latestId':options.id};
        }else{
            var params = {'commentid':commentId,'id':articleId,'pageNo':pageNum};
        }
        $.jsonp({
            url: window.duLife.URLS.comments,
            callbackParameter: 'callback',
            data: params,
            timeout:5000,
            beforeSend: function(){
                // validSession('../../login.html',this);
            },
            success: function(data){
                window.pageNum = pageNum;
                $.mobile.activePage.find('#loadImg').remove();
                if(data.commentList.totalPageNum==0)
                {
                    $('#commentList #mainWrapper').html('<p class="noComment">暂无评论</p>');
                    $.mobile.activePage.find('#pullDown,#pullUp').css('visibility','hidden');
                }
                else
                {
                    $.mobile.activePage.find('#pullDown,#pullUp').css('visibility','visible');
                    var src_commentList = $('#commentList #tpl_commentList').html();
                    var tpl_commentList = Handlebars.compile(src_commentList);
                    dataHandle(tpl_commentList(data));
                    cb && cb(tpl_commentList(data));
                    
                }
                
            },
            error: function(args){
                $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                // $.mobile.activePage.find('#pullDown,#pullUp').css('visibility','visible');
                $.mobile.activePage.find('#loadImg').css('display','none');
                cb && cb();
                return false;
            }
        });
    };
    
    $('#commentList').on('pagebeforeshow',function(){
        window.pageNum = 1;
        loadCommentListData({'cb':initScroll});
    })
    
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
            }
			
		});
		$mainBox.delegate('.restore','click',function(){
			var articleId = $(this).parents('.inforBox').attr('aritlceid');
            var commentId=$(this).parents('.inforBox').attr('commentlistid'); 
            var author=$(this).parents('.inforBox').attr('author');
            var str =$.mobile.activePage.attr('data-url');
            var comListType= $.duLife.fns.getUrlParam({str:str}).comListType || '生活站';
            if(window.is40){
                window.params = {'commentType':comListType,'commentid':commentId,'articleid':articleId,'author':author};
                $.mobile.changePage('./../../view/life/life_comment.html',{changeHash:false,transition :'none'});
            }else{
                $.mobile.changePage('./../../view/life/life_comment.html?commentType='+comListType+'&commentid='+commentId+'&articleid='+articleId+'&author='+author,{changeHash:false,transition :'none'});
            }
   		});
	};

    showRestore();

    /**
      * 下拉刷新 （自定义实现此方法）
      * myScroll.refresh();     // 数据加载完成后，调用界面更新方法
   */
    function pullDownAction (fresh) {
        var type = $('#tabTransfer .current').attr('type');
        setTimeout(function () {   
            window.loadCommentListData({'type':type, 'pageNum':1, 'cb':function(){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh();
                                        i++;
                                    },500);
                            },'dataHandle':function(data){window.$mainBox.html(data);}})
        }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
    }

    /**
     * 滚动翻页 （自定义实现此方法）
     * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
     */
    function pullUpAction (fresh) {
        var type = $('#tabTransfer .current').attr('type');
        setTimeout(function () {
            window.loadCommentListData({'type':type,'cb':function(data){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh(data);
                                        i++;
                                    },500);

                            },'pageNum':window.pageNum+1,'dataHandle':function(data){window.$mainBox.append(data);}})
        }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
    }

    //上下拉动自动刷新内容
    function initScroll(){
        var $mainWrapper = $('#commentList #mainWrapper');
        setTimeout(function(){
            $mainWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
            commentListScroll = $mainWrapper.refresh({'wrapper':$mainWrapper[0],'pullDownAction':pullDownAction,'pullUpAction':pullUpAction});
            $mainWrapper.find('#scroller').css('-webkit-transform','translate(0px, -41px) scale(1) translateZ(0px)')
        },200)
        // var i = 1;
        // var freshInterval = setInterval(function(){
        //     if(i>=4){
        //         clearInterval(freshInterval);
        //     }
        //     commentListScroll.refresh();
        //     i++;
        // },500);
    } 
})(jQuery,window);
