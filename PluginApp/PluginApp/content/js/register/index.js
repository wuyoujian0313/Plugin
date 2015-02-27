;(function($,window){
	$('#registerIndex').on('pagebeforeshow',function(){
		 $.jsonp({ //获取数据
	         url: window.duLife.URLS.registerIndex,
	         callbackParameter: 'callback',
	         timeout:5000,
             beforeSend: function(){
                // validSession('../../login.html',this);
             },
	         success: function(data){
	              var src_situation = $('#tpl_situation').html(),
	         		 tpl_situation = Handlebars.compile(src_situation);
	         	  var src_applyCount = $('#tpl_applyCount').html(),
	         		 tpl_applyCount = Handlebars.compile(src_applyCount);
	     			$('#situationWrapper').html(tpl_situation(data));
	     			$('#registerIndexScroller .title').html(tpl_applyCount(data));
		 			setTimeout(function(){
		 				var $wrapper = $('#registerIndex #mainWrapper');
		 				$wrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()) - parseInt($('#registerBtn').height()));
		 				registerIndexScroll = new iScroll($wrapper[0],{'useTransform':false});
		 				if(data.myApply.applyCount<1){
			 				$('#registerBtn').addClass('disabled');
			 				$('#registerBtn>a').attr('href','#');
			 			}else{
			 				$('#registerBtn').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight  - parseInt($('#registerBtn').height()),'visibility':'visible'});
			 			}		 				
		 			},500);	
	         },
	         error: function(args){
	         	$.duLife.fns.tips("加载数据错误~");
	             //return false;
	         },
	         complete:function(XMLHttpRequest){
	         	console.log(XMLHttpRequest)
	         }
	     })
    });
     //取消‘等待受理’的预约, 编辑预约和重新预约
     $('#situationWrapper').delegate('.cancle, .modify, .afresh','click',function(e){
     	$('#situationWrapper .currentOpt').removeClass('currentOpt')
     	$(this).addClass('currentOpt');
     	var headerTitle=$(this).text();
      	if($(this).hasClass('cancle')){
     		$.duLife.fns.confirm('现阶段取消预约不会减少可用预约数量，是否取消该预约？',function(){
     			$.jsonp({ //获取数据
			        url: window.duLife.URLS.cancelRegister,
			        callbackParameter: 'callback',
			        timeout:5000,
		            beforeSend: function(){
		                //validSession('../../login.html',this);
		            },
			        data: {
			        	id:$('#situationWrapper .currentOpt').data('id')
			        },
			        success: function(data){
			             if(data.success){
			             	$.duLife.fns.tips('预约已取消');
			             	$('.currentOpt').closest('.situation').remove();
			             	$('#applyCount').text(parseInt($('#applyCount').text())+1);
			             	$('#registerBtn').removeClass('disabled');
			             }else{
			             	$.duLife.fns.alert('预约取消失败');
			             }			
			        },
			        error: function(args){
			            $.duLife.fns.tips("加载数据错误~");
			            return false;
			        }
			    })
     		})
     	}else if($(this).hasClass('modify')||$(this).hasClass('afresh')){
     		var data = $('#situationWrapper .currentOpt').data('info');
     		var param = '';

     		for(var key in data){
     			param += '&' + key + '=' + data[key];
     		}
     		location.href = 'register.html?headerTitle='+headerTitle+'&editRegister=true' + param;
     	}
     });
	
})(jQuery,window);
