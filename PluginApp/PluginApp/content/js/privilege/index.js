 ;(function($,window){
    //validSession('../../login.html');
//window.updateTokenFn();

    var lifeScroll;
    var timer;
    var flag=false;
    var category;
    var defaultImg;
    var priJsonpAjax;
    var privilegeIndex = {
        CONSTANT: {
            $page:$('#privilegeIndex'),
            $viewList:$('#privilegeIndex #viewList'),
            pageNum:1,
            $mainWrapper:$('#privilegeIndex #privilegeContent'),
            $tabTransfer: $('#privilegeIndex #tabTransfer'),
            $tpl_articlelist: $('#privilegeIndex #tpl_articlelist')
        },
        //self.loadData({'type':type, 'cb':fresh,'dataHandle':function(data){$('#lifeIndex #viewList.'+type).append(data);}})
        loadData: function(opt){  
            var self = privilegeIndex;  
            var opt = opt || {},
                pageNum = ((opt.pageNum==0) || opt.pageNum)? opt.pageNum : self.CONSTANT.pageNum,
                dataHandle = opt.dataHandle ? opt.dataHandle : function(data){self.CONSTANT.$viewList.html(data)},
                cb = opt.cb || function(){},
                category= opt.category || '';
            if(opt.id){
                var params = {pageNum:pageNum,id:opt.id};
            }else{
                var params = {pageNum:pageNum};
            }
            priJsonpAjax = $.jsonp({
                url: (category=='爱折扣')?window.duLife.URLS.discount:window.duLife.URLS.brand,
                callbackParameter: 'callback',
                data: params,
                timeout:5000,
                beforeSend: function(xhr){
                    $("body").append('<div class="loading-screen"></div>');
                   // alert('beforeSend:'+xhr)
                },
                success: function(data){
                    $('.loading-screen').remove();
                    self.CONSTANT.pageNum = pageNum;
                    flag=false;
                    defaultImg=data.articleList.logoImgSrc;
                    //console.log(defaultImg);
                     var tabData = {
                        'category':category,
                        'obj':data.articleList
                    };
                    var defaultElement = $('#flowBox > ul:nth-child(1) > li:nth-child(1)')[0].className;
                    if(pageNum==1&&category=='爱折扣'&&defaultElement=='defaultImg'){
                        $('#flowBox')[0].innerHTML= '<ul><li class="defaultImg"><img src="'+defaultImg+'" width="100%" /></li></ul><ul style="margin:0;"></ul>';
                    }else if(pageNum==1&&category=='品牌专区'&&defaultElement=='defaultImg'){
                        $('#flowBox')[0].innerHTML= '<ul><li class="defaultImg"><img src="'+defaultImg+'" width="100%" /></li></ul><ul style="margin:0;"></ul>'; 
                    }
                    if(data.articleList.data.length>0 && pageNum<=data.articleList.totalPageNum){
                      self.add(tabData);
                    }
                    var flag = (data.articleList.data.length>0)?true:false;
                    cb(flag);
                     //setTimeout(function(){cb();},500);
                },
                error: function(args){
                    $('.loading-screen').remove();
                    $.duLife.fns.tips('加载数据错误~');
                    cb();
                    return false;
                }
            })
            
        },
        init:function(category,cb){
            var self = this;
            var category=category?"品牌专区":"爱折扣";
            var cb = cb || self.initScroll;
            //初始化加载数据
            self.loadData({'cb':cb,'category':category});

        },
       
        /**
          * 下拉刷新 （自定义实现此方法）
          * myScroll.refresh();     // 数据加载完成后，调用界面更新方法
       */
        pullDownAction: function(fresh) { 
            var self = privilegeIndex;
            var type = self.CONSTANT.$tabTransfer.find('.current').attr('type');
            setTimeout(function () {
                self.loadData({'type':type, 'pageNum':1, 'category':category, 'cb':function(){
                        var i = 1;
                        var freshInterval = setInterval(function(){
                            if(i>=4){
                                clearInterval(freshInterval);
                            }
                            fresh();
                            i++;
                        },500);
                }, 'dataHandle':function(data){$('#privilegeIndex #viewList.'+type).html(data);}})
            }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
        },

        /**
         * 滚动翻页 （自定义实现此方法）
         * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
         */
        pullUpAction: function(fresh) {
            var self = privilegeIndex;
            var type = self.CONSTANT.$tabTransfer.find('.current').attr('type');
            setTimeout(function () {    // <-- Simulate network congestion, remove setTimeout from production!
                self.loadData({'type':type,'pageNum':self.CONSTANT.pageNum+1, 'category':category, 'cb':function(data){
                        var i = 1;
                        var freshInterval = setInterval(function(){
                            if(i>=4){
                                clearInterval(freshInterval);
                            }
                            fresh(data);
                            i++;
                        },500);
                },'dataHandle':function(data){$('#privilegeIndex #viewList.'+type).append(data);}})
            }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
        },

        //上下拉动自动刷新内容
        initScroll: function(){
            var self = privilegeIndex;
            setTimeout(function(){
                self.CONSTANT.$mainWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt(self.CONSTANT.$mainWrapper.offset().top));
                lifeScroll = self.CONSTANT.$mainWrapper.refresh({'wrapper':self.CONSTANT.$mainWrapper[0],'pullDownAction':self.pullDownAction,'pullUpAction':self.pullUpAction});
            },200);
            var i = 1;
            var freshInterval = setInterval(function(){
                if(i>=4){
                    clearInterval(freshInterval);
                }
                lifeScroll.refresh();
                i++;
            },500);
            
        },
        loadCouponData: function(options){
            $.jsonp({
                url: window.duLife.URLS.brand,
                callbackParameter: 'callback',
                timeout:5000,
                data: {},
                beforeSend: function(){
                    // validSession('../../login.html',this);
                },
                success: function(data){
                    //console.log(data);
                    // var src_privilege = $('#tpl_privilege').html();
                    // var tpl_privilege = Handlebars.compile(src_privilege);
                    // dataHandle(tpl_privilege(data));
                    // cb && cb();
                },
                error: function(args){
                    $.duLife.fns.tips("加载数据错误~");
                    return false;
                }
            });
        },
        tab:function(){
            var self= privilegeIndex;
            var $wrap = $('#privilegeIndex #wrap');
            if(window.is40)
            {
                var paramData = $.duLife.fns.getUrlParam();
                var zkIndex=paramData.zkIndex || 0;
            }
            else
            {
              var zkIndex=location.hash.substring(1)-0 || 0;
            }
            if(zkIndex==0)
            {
                 $wrap.addClass('box');
            }
            $('#tabTransfer li').eq(zkIndex).addClass('current');
            $('.privilegeContent').eq(zkIndex).addClass('show');
             setTimeout(function()
            {
               $('#tabTransfer li').eq(zkIndex).click();
            },30);
            $('#tabTransfer li').on('click',function()
            {
                if(priJsonpAjax && priJsonpAjax.abort){
                    priJsonpAjax.abort();
                }
                $.mobile.activePage.find('#loadImg').css('display','none');
                $('#privilegeIndex #pullUp').css("visibility",'hidden');
                if(lifeScroll){
                    if(!lifeScroll.enabled) return; // data loading
                    var cb = function(){
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
                self.CONSTANT.pageNum = 1;
                $wrap.removeClass('box');
                $target=$(this);
                var index = $target.index();
                $(this).siblings().removeClass('current');
                $(this).addClass('current');
                $('.privilegeContent').removeClass('show');
                $('.privilegeContent').eq(index).addClass('show');
                if(index==0)
                 {
                    $target.closest('.wrap').addClass('box');
                    //self.loadCouponData();
                    //alert($target.index()); 
                    location.hash=0;   
                 }else if(index==1)
                 {
                    if($("#flowBox").html(''))
                    {
                        $.mobile.activePage.find('#loadImg').css('display','block');
                    };
                     self.init(0,cb);
                     category='爱折扣';
                     location.hash=1;
                     // alert(category);
                    // $('#flowBox')[0].innerHTML= '<ul><li class="defaultImg"><img src="'+defaultImg+'" width="100%" /></li></ul><ul style="margin:0;"></ul>';
                    // alert($target.index());
                 }else{
                    if($("#flowBox").html(''))
                    {
                        $.mobile.activePage.find('#loadImg').css('display','block');
                    };
                    $('.privilegeContent').removeClass('show');
                    $('.privilegeContent').eq(index-1).addClass('show');
                    category='品牌专区';
                    location.hash=2;
                    self.init(1,cb);
                }
             });   
        },
        add:function(obj){
                    var category=obj.category;
                    var obj=obj.obj;
                    var aUl=document.getElementById('flowBox').children;
                    var arr=[];
                    for(var i=0;i<aUl.length;i++){
                        arr.push(aUl[i]);
                    };
                    clearInterval(timer);
                    var num=0;
                    timer=setInterval(function(){
                        $.mobile.activePage.find('#loadImg').css('display','none');
                        var oLi=document.createElement('li');
                        if(category=='爱折扣'){
                            // console.log(obj.data[num].id);
                            // console.log("state:"+obj.data[num].status);
                            // console.log(obj.data[num]);
                            oLi.setAttribute("articleid",obj.data[num].id);
                            oLi.setAttribute("detailtype",category);//oLi.setAttribute("detailtype","爱折扣");
                            var detailUrl='<a data-ajax="false" href="../../view/life/life_detail.html?detailtype='
                            +category+'&state='+obj.data[num].status
                            +'&type=ACTIVITY'
                            +'&articleid=';
                            var state='';
                            state=(obj.data[num].status=='进行中'?"background-color:rgba(245,94,113,0.8)":"background-color:rgba(198,206,208,0.8)");
                            var time= parseInt(obj.data[num].pubDate);
                            var localTime= (obj.data[num].today)||(new Date().getTime());
                            var seconds=parseInt((localTime-time)/1000);
                            var day=parseInt(seconds/86400);
                            seconds%=86400;
                            var hours=parseInt(seconds/3600);
                            seconds%=3600;
                            var min=parseInt(seconds/60);
                            seconds%=60;
                            if(min<=0)
                            {
                                var showTime= seconds+"秒前";
                               
                            }else if(hours<=0){
                                var showTime= min+"分前";
                            }else if(day<=0){
                                var showTime=hours+"天前";
                            }else if(day>0){
                                var others= new Date(time);
                                var showTime= (others.getMonth()+1)+'-'+others.getDate();//parseInt(hours/24)+"天前";
                            };
                            obj.data[num].imgSrc = obj.data[num].imgSrc || '../../images/jiazai.png';
                            oLi.innerHTML=detailUrl//'<a href="../../view/life/life_detail.html?id='
                            +obj.data[num].id
                            +'" ><span class="flowState" style="'
                            +state+'">'
                            +obj.data[num].status
                            +'</span><img src="' 
                            + obj.data[num].imgSrc + '" width="100%" onerror="this.src=\'../../images/jiazai.png\'" /></a><h2>'
                            +detailUrl+obj.data[num].id
                            +'" >'
                            +obj.data[num].title+'</a></h2>'
                            +'<div class="aboutInfo"><span>'
                            +showTime
                            +'</span><span class="tar"><b>'
                            +obj.data[num].joinCount
                            +'</b></span></div>';
                        }else{
                            //console.log(num+"----"+obj.data[num].value);
                             oLi.innerHTML='<a href="'+obj.data[num].value+'" rel="external" ><img src="' 
                            + obj.data[num].imgSrc + '" width="100%" onerror="this.src=\'../../images/jiazai.png\'" /></a><h2 style="padding:0.4rem 0.5rem 0.5rem"><a href="'+obj.data[num].value+'" rel="external" >'
                            +obj.data[num].title+'</a></h2>';
                        };


                        arr.sort(function(obj1,obj2){
                            return obj1.offsetHeight-obj2.offsetHeight;
                        });
                        arr[0].appendChild(oLi);
                        num++;
                        if(num==obj.data.length){//obj.pageSize
                            clearInterval(timer);
                            flag=true;
                            //console.log("num:"+num);
                            //console.log("flag:"+flag);
                        };
                    },100);
        },
    } 

    privilegeIndex.tab();
    
})(jQuery,window);
