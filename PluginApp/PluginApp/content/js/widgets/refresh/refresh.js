/*
* 上下拉动自动刷新内容
*/
$.fn.refresh = function(opt){
    var myScroll,
        pullDownEl, pullDownOffset,
        pullDownLabel,pullUpLabel,
        pullUpEl, pullUpOffset,
        generatedCount = 0;

    var refreshTime;

    var opt = opt || {},
        wrapper = opt.wrapper || 'wrapper',
        pullDownAction = (typeof opt.pullDownAction == 'function') ? opt.pullDownAction : function(){myScroll.refresh();},
        pullUpAction = (typeof opt.pullUpAction == 'function') ? opt.pullUpAction : function(){myScroll.refresh();};

    /**
     * 初始化iScroll控件
     */
    pullDownEl = $(typeof wrapper == 'object' ? wrapper : document.getElementById(wrapper)).children().eq(0).children('#pullDown')[0];
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = $(typeof wrapper == 'object' ? wrapper : document.getElementById(wrapper)).children().eq(0).children('#pullUp')[0];   
    pullUpOffset = pullUpEl.offsetHeight;
    pullDownLabel = pullDownEl.querySelector('.pullDownLabel');
    pullUpLabel = pullUpEl.querySelector('.pullUpLabel');

    myScroll = new iScroll(opt.wrapper, {
        useTransition: false, /*设置为false后iscroll会使用js的动画 */
        //useTransform:false,
        topOffset: pullDownOffset,
        onRefresh: function () {
            $(pullUpEl).show();
            $('#newestData').remove();
            var that = this;
            if(refreshTime){
                clearTimeout(refreshTime);
            }
            if (pullDownEl.className.match('loading')) {
                pullDownEl.style['visibility'] = 'hidden';
                pullDownLabel.innerHTML = '';
                pullDownEl.className = '';  
            }
            if (pullUpEl.className.match('loading')) {
                pullUpEl.style['visibility'] = 'hidden';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
                pullUpEl.className = '';  
            }
            
            refreshTime = setTimeout(function(){
                if(that.maxScrollY<0){
                    pullUpEl.style['visibility'] = 'visible';
                }else{
                    pullUpEl.style['visibility'] = 'hidden';
                    
                }
            },1000)
        },

        onScrollMove: function () {
            //console.log('this.y', this.dirY, this.pointY, this.scrollerH, this.absDistY, this.absStartY);
            if (this.dirY === -1 && this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.style['visibility'] = 'visible';
                pullDownLabel.innerHTML = '';
                pullDownEl.className = 'flip';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownLabel.innerHTML = '';
                pullDownEl.className = '';
                this.minScrollY = -pullDownOffset;
            } else if (this.dirY === 1 && this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.style['visibility'] = 'visible';
                pullUpLabel.innerHTML = '';
                pullUpEl.className = 'flip';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpLabel.innerHTML = '';
                pullUpEl.className = '';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            var self = this;
            var downfresh = function(data){
                myScroll.refresh();
                myScroll.enable();
                $('.loading-screen').remove();
            };
            var upfresh = function(data){
                myScroll.enable();
                $('.loading-screen').remove();
                if(typeof data =='string'){
                    data = $.trim(data);
                }
                if(!data){
                    $(pullUpEl).hide();
                    if($(pullUpEl).next('#newestData').size()==0){
                        $(pullUpEl).after('<p id="newestData" style="background:#fff;height:40px;line-height:40px;font-weight:bold;font-size:14px;color:#888;text-align:center;">没有更多数据啦~</p>')
                    }else{
                        $('#newestData').show();
                    }  
                }else{
                    myScroll.refresh();
                    $(pullUpEl).show();
                    $('#newestData').remove();
                }
            };
            if (pullDownEl.className.match('flip')) {
                pullDownLabel.innerHTML = '';
                pullDownEl.className = 'loading';
                myScroll.disable();
                $("body").append('<div class="loading-screen"></div>');
                pullDownAction(downfresh);   // Execute custom function (ajax call?)
            }
            if(pullUpEl.className.match('flip')) {
                pullUpLabel.innerHTML = '';
                pullUpEl.className = 'loading';
                if($('#newestData').size()==0){
                    myScroll.disable();
                    $("body").append('<div class="loading-screen"></div>');
                    pullUpAction(upfresh);
                }
                
                 // Execute custom function (ajax call?)
            }
        }
    });
    
    return myScroll;
}
    
    
