 ;(function($,window){
    if(window.is40){ return false; }
        window.$mainView = $('#askingAnswer #askingMenu');
        var answerScroll;
        window.loadAnswerData = function(options){
        var options = options || {};
        var dataHandle = options.dataHandle || function(data){$mainView.html(data)};
        var paramData = $.duLife.fns.getUrlParam();
        var id = paramData.id;
        var categoryName = paramData.categoryName || '';
        var cb = options.cb || function(){};
        $.mobile.activePage.find('header').html('<a id="backTo" href="../../view/asking/index.html" data-ajax="false" class="ui-link"></a>'+categoryName);
        $.jsonp({
            url: window.duLife.URLS.askingAnswer,
            callbackParameter: 'callback',
            timeout:8000,
            data: {id:id},
            beforeSend: function(xhr){
            },
            success: function(data){
                handleBars($('#askingContent'),$('#tpl_askingContent'),data);
                handleBars($('#askingMenu'),$('#tpl_askingMenu'),data);
                $('#askingMenu .bg').on({
                    'touchstart':function()
                    {
                        $(this).addClass('hover');
                    },
                    'touchend':function()
                    {
                        $(this).removeClass('hover');
                    }
                });
                if(data.answer=='有回复')
                {
                    $('#askingAnswer #backTo').removeAttr('href');
                    $('#askingAnswer #backTo').click(function()
                    { 
                        var _this=$(this);
                        commentDialog(_this);
                        $('.praiseBox #simpleclose').click(function()
                        {
                            window.location.href='../../view/asking/index.html';
                        });
                    });
                };
                $('#askingContent .question').eq(0).find('.trace').text('提问');
                setTimeout(function(){
                    var padBot=$('#askingMenu')[0].offsetHeight;
                    $('#askingMenu').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - padBot,'visibility':'visible'})
                    var wrapper = $('#askingAnswer #mainWrapper');
                    wrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
                    answerScroll = new iScroll(wrapper[0]);
                 },200); 
               var topicID = $('#topic').attr('topic');
               var categoryID = $('#topic').attr('category');
               /*修改*/
               $mainView.delegate('.modify','click',function()
                {
                    var paramData = $.duLife.fns.getUrlParam();
                    var id = $('#topic').attr('data-id');
                    $.jsonp({
                        url: window.duLife.URLS.modifyAsking,
                        callbackParameter: 'callback',
                        timeout:8000,
                        data: {id:id,categoryID:categoryID},
                        beforeSend: function(xhr){
                        },
                        success: function(data){
                            var categoryName=data.question.categoryName;
                            var title=data.question.title;
                            $.mobile.changePage('../../view/asking/askingQuestion.html?title='+title+'&categoryName='+categoryName+'&topicID='+topicID+'&categoryID='+categoryID+'&id='+id,{transition :'none'});
                        },
                        error: function(args){
                         $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                            return false;
                        },
                        complete: function(xhr){
                
                        }
                    });

                });
                $mainView.delegate('.traceQet','click',function(){
                 $.mobile.changePage('../../view/asking/askingQuestion.html?againAsk=ok&categoryName='+categoryName+'&topicID='+topicID+'&categoryID='+categoryID,{transition :'none'});
                });
                cb && cb();
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
    $('#askingAnswer').on('pagebeforeshow',function(){
        loadAnswerData();
    });
   /*问题已解决*/
   $mainView.delegate('.resolve','click',function(){
        var _this=$(this);
        commentDialog(_this);
   });
 function commentDialog(obj)
 {
    obj.simpledialog({
                        'mode' : 'blank',
                        'prompt' : false,
                        'transition':'pop',
                        'cleanOnClose':false,
                        'allowReopen':true,
                        'useDialogForceFalse':true,
                        'forceInput':false,
                        'fullHTML':"<div class='praiseBox'><p class='praiseTitle'>请对HR&nbsp;MM的服务打分</p><p class='praiseTips'>评价后该话题将会结束哦</p><div class='zbz'><div class='zyg'><div><span class='zan'></span></div><span>赞一个</span></div><div class='bgz'><div><span class='bZan'></span></div><span>不给赞</span></div></div><span id='simpleclose' rel='close'></span></div>",
                         'onCreated':function(d){
                            d.pickerContent.addClass('confirm-dialog');
                            d.pickerContent.find('.zyg').click(function()
                            {
                                yesOrNo('.zyg','disabled',1)

                            }); 
                            d.pickerContent.find('.bgz').click(function()
                            {
                                yesOrNo('.bgz','disabled',0)

                            });
                        }
                    });
 };
 //赞不赞
 function yesOrNo(className,disClass,isSupportValue)
 {
        var $target=$(this);
        if($target.hasClass(disClass)) return;
        $target.addClass(disClass);
        var paramData = $.duLife.fns.getUrlParam();
        var id = paramData.id;
        var json={'questionID':id,'isSupport':isSupportValue}
        $.jsonp({
            type: 'post',
            url: window.duLife.URLS.suppory,
            callbackParameter: 'callback',
            timeout:5000,
            data: json,
            beforeSend: function(){
                //validSession('../../login.html',this);
            },
            success: function (data) {
                if (data.success) {
                    $.duLife.fns.tips(data.message);
                    setTimeout(function () {
                        $.mobile.activePage.find(className).removeClass(disClass);
                        window.location.href='../../view/asking/index.html';
                    }, 1000)
                } else {
                    $.duLife.fns.tips(data.message);
                    $.mobile.activePage.find(className).removeClass(disClass);
                }
            },
            error: function (args) {
                $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                $.mobile.activePage.find(className).removeClass(disClass);
                return false;
            }
        })
 }
 //不问了
   $mainView.delegate('.noAsk','click',function()
    {
        var paramData = $.duLife.fns.getUrlParam();
        var id = paramData.id;
        var $target=$(this);
        if($target.hasClass('disabled')) return;
        $target.addClass('disabled');
        setTimeout(sureOrCancle({message:'是否删除该提问？',
                                    json:{id:id},
                               className:'.noAsk',
                                disClass:'disabled',
                                     url:window.duLife.URLS.noAsking,
                                      cb: delDom
        }),500);
    });
   function delDom()
    {
        $('#askingContent').html('');
        $.mobile.changePage('../../view/asking/index.html',{transition :'none'});
    };
    function handleBars(target,template,json){
       var tpl= template.html();
       var template = Handlebars.compile(tpl);
       target.html(template(json));
    };
    function sureOrCancle(options)
    {
        var options = options || {};
        var message = options.message;
        var json = options.json;
        var msSuccess = options.msSuccess;
        var msFaild = options.msFaild;
        var className = options.className;
        var disClass = options.disClass || 'disabled';
        var cb = options.cb || function(){};
        var url = options.url;
        $.duLife.fns.confirm(message, function () {
            $.jsonp({
                type: 'post',
                url: url,
                callbackParameter: 'callback',
                timeout:5000,
                data: json,
                beforeSend: function(){
                   
                },
                success: function (data) {
                    if (data.success) {
                        $.duLife.fns.tips(data.message);
                        setTimeout(function () {
                            $.mobile.activePage.find(className).removeClass(disClass);
                            cb && cb();
                        }, 500)
                    } else {
                        $.duLife.fns.tips(data.message);
                        $.mobile.activePage.find(className).removeClass(disClass);
                    }
                },
                error: function (args) {
                    $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                    $.mobile.activePage.find(className).removeClass(disClass);
                    return false;
                }
            })
        },function(){
            $.mobile.activePage.find(className).removeClass(disClass);
        });
    };
})(jQuery,window);
