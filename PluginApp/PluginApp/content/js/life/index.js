 ;(function($,window){
    var lifeScroll;
    var lifeJsonpAjax;
    var lifeIndex = {
        CONSTANT: {
            $page:$('#lifeIndex'),
            $viewList:$('#lifeIndex #viewList'),
            pageNum:1,
            $mainWrapper:$('#lifeIndex #mainWrapper'),
            $tabTransfer: $('#lifeIndex #tabTransfer'),
            $tpl_articlelist: $('#lifeIndex #tpl_articlelist')
        },
        init:function(){
            var self = this;
            //初始化加载数据
            self.loadData({'cb':self.initScroll});

            //跳转至详情页
            self.CONSTANT.$viewList.delegate('.articleItem','click',function(){
                var articleid = $(this).attr('articleid');
                if(window.is40){
                    window.params = {articleid:articleid};
                    $.mobile.changePage('../../view/life/life_detail.html',{transition :'none'})
                }else{
                    $.mobile.changePage('../../view/life/life_detail.html',{data:{articleid:articleid},transition :'none'});
                }
            })

            //切换标签
            self.CONSTANT.$tabTransfer.delegate('li','click',function(event){
                if(lifeJsonpAjax && lifeJsonpAjax.abort){
                    lifeJsonpAjax.abort();
                }
                $('#lifeIndex #pullUp').css('visibility','hidden');
                var cb = self.initScroll;
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
                var $target = $(this);
                var $parent = $target.parent();
                var type = $target.attr('type');

                if($target.hasClass('current')) return false;
                $target.siblings().removeClass('current');
                $target.addClass('current');
                self.CONSTANT.$viewList.removeClass().addClass(type);
                //数据加载成功之前加loading图
                $.mobile.activePage.find('#loadImg').css('display','block');
                //$.mobile.activePage.find('#pullDown,#pullUp').css('visibility','hidden');
                $.mobile.activePage.find('#pullDown').next('div').html("");
                //列表分页设置为1
                self.CONSTANT.pageNum = 1;
                self.loadData({'type':type,'cb':cb});
            });
        },
        loadData: function(opt){  
            var self = lifeIndex;  
            var opt = opt || {},
                type = opt.type? opt.type : 'all',
                pageNum = ((opt.pageNum==0) || opt.pageNum)? opt.pageNum : self.CONSTANT.pageNum,
                dataHandle = opt.dataHandle ? opt.dataHandle : function(data){self.CONSTANT.$viewList.html(data)},
                cb = opt.cb || function(){};
            if(opt.id){
                var params = {type:type,pageNum:pageNum,id:opt.id};
            }else{
                var params = {type:type,pageNum:pageNum};
            }

            lifeJsonpAjax = $.jsonp({
                url: window.duLife.URLS.lifeIndex,
                callbackParameter: 'callback',
                data: params,
                timeout:5000,
                beforeSend: function(xhr){
                    // validSession('../../login.html',this);
                    $("body").append('<div class="loading-screen"></div>');
                   // alert('beforeSend:'+xhr)
                },
                success: function(data){
                    $('.loading-screen').remove();
                    self.CONSTANT.pageNum = pageNum;
                    //alert('success:'+data)
                    $.mobile.activePage.find('#loadImg').css('display','none');
                    //$.mobile.activePage.find('#pullDown,#pullUp').css('visibility','visible');
                    var src_articlelist = self.CONSTANT.$tpl_articlelist.html(),
                    tpl_articlelist = Handlebars.compile(src_articlelist);
                    dataHandle(tpl_articlelist(data)); 
                    cb(tpl_articlelist(data));    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    $('.loading-screen').remove();
                    $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                    $.mobile.activePage.find('#loadImg').css('display','none');
                    cb(true);
                    return false;
                },
                complete: function(xhr){
                    $('.loading-screen').remove();
                    //alert('complete:'+xhr)
                }
            })
        },
        /**
          * 下拉刷新 （自定义实现此方法）
          * myScroll.refresh();     // 数据加载完成后，调用界面更新方法
       */
        pullDownAction: function(fresh) { 
            var self = lifeIndex;
            var type = self.CONSTANT.$tabTransfer.find('.current').attr('type');
            setTimeout(function () {
                self.loadData({'type':type, 'pageNum':1, 'cb':function(data){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh(data);
                                        i++;
                                    },500);
                            }, 'dataHandle':function(data){$('#lifeIndex #viewList.'+type).html(data);}})
            }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
        },

        /**
         * 滚动翻页 （自定义实现此方法）
         * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
         */
        pullUpAction: function(fresh) {
            var self = lifeIndex;
            var type = self.CONSTANT.$tabTransfer.find('.current').attr('type');
            setTimeout(function () { 
                self.loadData({'type':type,'pageNum':self.CONSTANT.pageNum+1, 'cb':function(data){
                                    var i = 1;
                                    var freshInterval = setInterval(function(){
                                        if(i>=4){
                                            clearInterval(freshInterval);
                                        }
                                        fresh(data);
                                        i++;
                                    },500);
                            },'dataHandle':function(data){$('#lifeIndex #viewList.'+type).append(data);}})
            }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
        },

        //上下拉动自动刷新内容
        initScroll: function(){
            var self = lifeIndex;
            setTimeout(function(){
                self.CONSTANT.$mainWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('#tabTransfer').height())- parseInt($('header').height()));
                lifeScroll = self.CONSTANT.$mainWrapper.refresh({'wrapper':self.CONSTANT.$mainWrapper[0],'pullDownAction':self.pullDownAction,'pullUpAction':self.pullUpAction});
            },200);
        }
    } 
    $('#lifeIndex').on('pageinit',function(){
        lifeIndex.init();
    })
       
})(jQuery,window);
