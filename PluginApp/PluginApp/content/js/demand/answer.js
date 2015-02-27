 ;(function($,window){
    if(window.is40){ return false; }
        window.$mainView = $('#demandAnswer #nextQuestion');
        var answerScroll;
        window.loadAnswerData = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var paramData = $.duLife.fns.getUrlParam();
        var id =paramData.id;
        var contentID=paramData.contentID || '';
        if(contentID)
        {
            var params={id:id,contentID:contentID};
        }
        else
        {
            var params={id:id};
        }
        var cb = options.cb || function(){};
        $.jsonp({
            url: window.duLife.URLS.demandAnswer,
            callbackParameter: 'callback',
            timeout:8000,
            data: params,
            beforeSend: function(xhr){
            	//validSession('../../login.html',this);
            },
            success: function(data){
                var con=data.articleList.length;
                if(con<1)
               {
                    $('#demandAnswer #demandContent').html('<p class="noComment">暂无回答</p>');
                     handleBars($('#nextQuestion'),$('#tpl_nextQuestion'),data);
                     setTimeout(function(){
                         var padBot=$('#nextQuestion')[0].offsetHeight;
                         $('#nextQuestion').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - padBot,'visibility':'visible'})
                     },200);
               }
               else
               {
                    handleBars($('#demandContent'),$('#tpl_demandAnswer'),data);
                    handleBars($('#nextQuestion'),$('#tpl_nextQuestion'),data);
                    setTimeout(function(){
                        var padBot=$('#nextQuestion')[0].offsetHeight;
                        $('#demandContent').css('padding-bottom',padBot+'px');
                        $('#nextQuestion').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - padBot,'visibility':'visible'})
                        var wrapper = $('#demandAnswer #mainWrapper');
                        wrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
                        answerScroll = new iScroll(wrapper[0]);
                     },200);
    				var i = 1;
    		        var freshInterval = setInterval(function(){
    		            if(i>=4){
    		                clearInterval(freshInterval);
    		            }
    		            answerScroll.refresh();
    		            i++;
    		        },500);
                    cb && cb();
                }
            },
            error: function(args){
            	$.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                cb && cb();
                return false;
            },
            complete: function(xhr){
    
            }
        });
    };
    $('#demandAnswer').on('pagebeforeshow',function(){
    	loadAnswerData();
    });
   $mainView.delegate('#question','click',function(){
        var id=$(this).attr('prevId');
        var contentID=$(this).attr('questionId');
        location.replace('./../../view/demand/answer.html?id='+id+'&contentID='+contentID);
   });
    function handleBars(target,template,json){
       var tpl= template.html();
       var template = Handlebars.compile(tpl);
       target.html(template(json));
    };
})(jQuery,window);
