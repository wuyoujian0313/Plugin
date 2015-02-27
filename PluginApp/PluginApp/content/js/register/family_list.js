;(function($,window){
	$('#familyList').on('pagebeforeshow',function(){
		 $.jsonp({ //获取数据
	         url: window.duLife.URLS.selectPatient,
	         callbackParameter: 'callback',
	         timeout:5000,
	         data: {},
             beforeSend: function(){
             },
	         success: function(data){
	     		var src_familyList = $('#tpl_familyList').html(),
	         		 tpl_familyList = Handlebars.compile(src_familyList);
	     			$('#familyList #listBox').html(tpl_familyList(data)); 
	     		setTimeout(function(){
	 				var $wrapper = $('#familyList #mainWrapper');
	 				$wrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight  - parseInt($('header').height())-parseInt($("#addBtn").height()));
	 				registerIndexScroll = new iScroll($wrapper[0]);
	 				$('#addBtn').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - $('#addBtn').height() +'px','visibility':'visible'});
	 			},500)
	         },
	         error: function(args){
	             $.duLife.fns.tips("加载数据错误~");
	             return false;
	         }
	     })
	});
	var changeEvent;
    if(typeof $('input[name="idCard"]').change == 'function'){
        changeEvent = 'change';
    }else if(typeof $('input[name="idCard"]').input == 'function'){
        changeEvent = 'input';
    }else{
        changeEvent = 'keyup';
    }
    $('input[name="idCard"]').on(changeEvent,function(){
    	$(this).val($(this).val().replace(/[^0-9X]/gi,''));
    });
    //添加家属验证
	$('input[name="patientName"]').textLimit(10);
    $('input[name="patientRalation"]').textLimit(10);
    $('#editPerson').on('pagebeforeshow',function(){
	    $('input[name="patientName"]').textLimit(10);
	    $('input[name="patientRalation"]').textLimit(10);
    });
	$('#familyList').delegate('#listBox li','click',function(e){
		$(this).siblings().removeClass('current');
		$(this).addClass('current');
		if(e.target.tagName == 'SPAN'){
			var elId = $(e.target).attr('id');
			if(elId == 'delPerson'){
				
				$.duLife.fns.confirm('确定要删除？',function(){
					var $li = $('#listBox .current'),
						jsonInfo = $li.data('info');
					$.jsonp({
						url: window.duLife.URLS.delFamily,
				        callbackParameter: 'callback',
				        data: {id:jsonInfo.id},
				        timeout:5000,
			            beforeSend: function(){
			                //validSession('../../login.html',this);
			            },
				        success: function(data){
				    		 $li.remove(); 
				        },
				        error: function(args){
				            console.log('error:' + args);
				            return false;
				        }
					});
				})
			}else if(elId == 'editPerson'){
				var $li = $('#listBox .current'),
					jsonInfo = $li.data('info');
				var src_editPerson = $('#tpl_editPerson').html(),
					tpl_editPerson = Handlebars.compile(src_editPerson);
				$('#editPerson>#addPersonForm').html(tpl_editPerson(jsonInfo));
				$.mobile.changePage('#editPerson');
				$('#addPersonForm input[type="text"]').textinput();
			}
		}
	})
	//添加家属
	$('#familyList').delegate('#addBtn span','click',function(e){
		$('#addPerson').find('.error').removeClass('error');
		$.mobile.changePage('#addPerson')
	});

	//添加家属表单提交
	$('#addPerson,#editPerson').delegate('#submitBtn','click',function(){
		    var $target=$(this);
			if($target.hasClass('disabled')) return;
			$('.error').removeClass('error');
			var $form = $target.parents('#addPersonForm');
			var $requiredlist = $form.find('input');
			var i = 0,
				len = $requiredlist.length;
			for(i; i<len; i++){
				var $this = $requiredlist.eq(i)
				if(!$.trim($this.val())){
					$.duLife.fns.tips('请填写所有项!');
					$this.parent().addClass('error');
				};
			}
			if($form.find('.error').size()>0){
				$form.find('.error').eq(0).focus();
				return false;
			}
			$target.addClass('disabled');
			window.scrollTo(0,0);
			setTimeout(function(){
			$.duLife.fns.confirm('是否确认提交？',function(){
				$.jsonp({
					url: window.duLife.URLS.addFamily,
			        callbackParameter: 'callback',
			        timeout:5000,
			        data: $.mobile.activePage.find('#addPersonForm').serialize(),
		            beforeSend: function(){
		                //validSession('../../login.html',this);
		            },
			        success: function(data){
			    		if(data.success){
							$.duLife.fns.tips('提交成功');
							$.mobile.activePage.find('input:text').val('');
							setTimeout(function(){
								$.mobile.activePage.find('#submitBtn').removeClass('disabled');
								$.mobile.changePage('#familyList',{changeHash:false});
							},1000)		
						}else{
							var msg = data.message || '提交失败';
							$.mobile.activePage.find('#submitBtn').removeClass('disabled');
							$.duLife.fns.tips(msg);
						} 
			        },
			        error: function(args){
			            $.duLife.fns.tips("加载数据错误~");
			            $.mobile.activePage.find('#submitBtn').removeClass('disabled');
			            return false;
			        }
				});
			},function(){
				$.mobile.activePage.find('#submitBtn').removeClass('disabled');
			});
		},500)
	})
	//添加家属表单取消
	$('#addPerson,#editPerson').delegate('#cancelBtn','click',function(){
		$target=$(this);
		setTimeout(function(){
			$target.parents('form').find('input').val('');
			$('.ui-page-active #backTo').trigger('click');
		},500);
		
	})
	
})(jQuery,window);
