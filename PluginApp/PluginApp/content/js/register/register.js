;(function($,window){
	//validSession('../../login.html');
//window.updateTokenFn();

    var registerScroll;
    var familyListScroll;
    var $registerWrapper = $('#register #mainWrapper');
  

    $('#register').on('pagebeforeshow',function()
	{
		var headerTitle= $.duLife.fns.getUrlParam().headerTitle ||'我要预约';
		$.mobile.activePage.find('header').html('<a id="backTo" href="javascript:;" data-rel="back" class="ui-link"></a>'+headerTitle);
		//表单验证
		var changeEvent;
	    if(typeof $('input[name="tel"]').change == 'function'){
	        changeEvent = 'change';
	    }else if(typeof $('input[name="tel"]').input == 'function'){
	        changeEvent = 'input';
	    }else{
	        changeEvent = 'keyup';
	    }
	    $('input[name="tel"]').on(changeEvent,function(){
	    	$(this).val($(this).val().replace(/\D/g,''));
	    });
	    $('input[name="department"]').textLimit(10);
		$('#remark').textLimit(300);
	});
	
    $('#familyList').on('pagebeforeshow',function(){
		$.jsonp({ //获取就诊人列表数据
	        url: window.duLife.URLS.selectPatient,
	        callbackParameter: 'callback',
	        timeout:5000,
	        data: {},
            beforeSend: function(){
                // validSession('../../login.html',this);
            },
	        success: function(data){
	    		var src_familyList = $('#tpl_familyList').html(),
	        		 tpl_familyList = Handlebars.compile(src_familyList);
	    		$('#familyList #listBox').html(tpl_familyList(data)); 
	    		setTimeout(function(){
	 				// var $wrapper = $('#familyList #mainWrapper');
	 				// $wrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()) - parseInt($('#addBtn').height()));
	 				// if(familyListScroll){
						// familyListScroll.refresh();
	 				// }else{
	 				// 	familyListScroll = new iScroll($wrapper[0]);
	 				// }
	 				$('#addBtn').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - $('#addBtn').height() +'px','visibility':'visible'});
	 			},500)
	        },
	        error: function(args){
	            $.duLife.fns.tips("加载数据错误~");
	            return false;
	        }
	    })
	});

    $('#familyList').delegate('#listBox li','click',function(e){
		$(this).siblings().removeClass('current');
		if($(e.target).hasClass('relationName'))
		{
			$(e.target).parent().addClass('current');
		};
		$(this).addClass('current');
		if(e.target.tagName == 'SPAN'){
			var elId = $(e.target).attr('id');
			if(elId == 'delPerson'){
				
				$.duLife.fns.confirm('确定要删除？',function(){
					var $li = $('#listBox .current'),
						jsonInfo = $li.data('info');
					// $li.remove();
					$.jsonp({
						url: window.duLife.URLS.delFamily,
				        callbackParameter: 'callback',
				        timeout:5000,
				        data: {id:jsonInfo.id},
			            beforeSend: function(){
			                //validSession('../../login.html',this);
			            },
				        success: function(data){
				    		 $li.remove(); 
				        },
				        error: function(args){
				            $.duLife.fns.tips("加载数据错误~");
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
				$.mobile.changePage('#editPerson',{changeHash:false});
				$('#addPersonForm input[type="text"]').textinput();
			}
		}else{
			var $li = $('#listBox .current'),
				jsonInfo = $li.data('info');
			var src_selected = $('#tpl_selected').html(),
				tpl_selected = Handlebars.compile(src_selected);	 
			$('#selectPerson>ul').html(tpl_selected(jsonInfo));
			$('#familyList #backTo').trigger('click');
			$('#selectPerson>ul input[name="tel"]').textinput();
			// setTimeout(function(){
 		// 		$registerWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($registerWrapper.offset().top)- parseInt($('#addBtn').height()));
 		// 		if(registerScroll){
 		// 			registerScroll.refresh();
 		// 		}else{
 		// 			registerScroll = new iScroll($registerWrapper[0]);
 		// 		}
 		// 	},500)
		}
	})
	//添加家属
	$('#familyList').delegate('#addBtn span','click',function(e){
		$('#addPerson').find('.error').removeClass('error');
		$.mobile.changePage('#addPerson',{changeHash:false});
	})
	//预约挂号表单提交
	$('#registerForm').delegate('#submitBtn','click',function(){
		if($(this).hasClass('disabled')) return;
		if($('#registerForm').find('input[name="patientName"]').size()==0){
			$.duLife.fns.alert('请选择就诊人~');
			return false;
		}
		$('.error').removeClass('error');
		var $requiredlist = $(this).parents('#registerForm').find('[required]');
		var i = 0,
			len = $requiredlist.length;
		for(i; i<len; i++){
			var $this = $requiredlist.eq(i)
		  	if(!$.trim($this.val())){
				$.duLife.fns.tips('请填写所有项!');
				$this.parent().addClass('error');
			}
		}
		if($('#registerForm .error').size()>0){
			$('#registerForm .error').eq(0).focus();
			return false;
		};
		$(this).addClass('disabled');
		document.activeElement.blur();
		window.scrollTo(0,0);
		setTimeout(function(){
		    	$.duLife.fns.confirm('是否确认发布？',function(){
				$.jsonp({
					type:'post',
	                url: window.duLife.URLS.register,
	                callbackParameter: 'callback',
	                timeout:5000,
	                data: $('#registerForm').serialize(),
		            beforeSend: function(){
		                //validSession('../../login.html',this);
		            },
	                success: function(data){
	                    if(data.success){
							$.duLife.fns.tips('发布成功');
							setTimeout(function(){
								$('#registerForm #submitBtn').removeClass('disabled');
								// history.go(-1);
								location.href='../../view/register/index.html';
						 	},1000)
						}else{
							$('#registerForm #submitBtn').removeClass('disabled');
							$.duLife.fns.alert(data.message);
						}     
	                },
	                error: function(args){
	                	$('#registerForm #submitBtn').removeClass('disabled');
	                    $.duLife.fns.tips("加载数据错误~");
	                    return false;
	                }
	            })
			},function(){
				$('#registerForm #submitBtn').removeClass('disabled');
			})
			
		},500)
		
	});
    $('#editPerson,#addPerson').on('pagebeforeshow',function()
	{
		var changeEvent;
	    if(typeof $('input[name="tel"]').change == 'function'){
	        changeEvent = 'change';
	    }else if(typeof $('input[name="tel"]').input == 'function'){
	        changeEvent = 'input';
	    }else{
	        changeEvent = 'keyup';
	    }
	    $('input[name="patientName"]').textLimit(10);
    	$('input[name="patientRalation"]').textLimit(10);
    	$('input[name="department"]').textLimit(10);
    	$('input[name="tel"]').on(changeEvent,function(){
    		$(this).val($(this).val().replace(/\D/g,''));
        });
    	$('input[name="idCard"]').on(changeEvent,function(){
    		$(this).val($(this).val().replace(/[^0-9X]/gi,''));
    	});
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
							setTimeout(function(){
								$.mobile.activePage.find('input:text').val('');
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
			        	$.mobile.activePage.find('#submitBtn').removeClass('disabled');
			            $.duLife.fns.tips("加载数据错误~");
			            return false;
			        }
				});

			},function(){
				$.mobile.activePage.find('#submitBtn').removeClass('disabled');
			});
		 },500)
	})
	//添加家属表单取消
	$('div#addPerson,div#editPerson').delegate('#cancelBtn','click',function(){
		$target=$(this);
		setTimeout(function(){
			$target.parents('form').find('input').val('');
			$('.ui-page-active #backTo').trigger('click');
		},500);
		
	})
	//输入框高度变化refresh滚动
	// $('#register').delegate('textarea','keydown keyup',function(e){
	// 	if((e.type == 'keydown')&&textareaTime){
	// 		clearTimeout(textareaTime);
	// 	}else{
	// 		var textareaTime = setTimeout(function(){
	// 			$registerWrapper.css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight  - parseInt($registerWrapper.offset().top));
	// 			if(registerScroll){
	// 				registerScroll.refresh();
	// 			}else{
	// 				registerScroll = new iScroll($registerWrapper[0]);
	// 			}
	// 		},1000)
	// 	}
		
	// })
	var firstOpen=true;
	function handleBeforeChange(e, data) {
		if ((typeof data.toPage != "string")&&firstOpen) {
			firstOpen =false;
			var json = $.duLife.fns.getUrlParam();
			if(json.editRegister){
				var src_editResterForm = $('#tpl_editResterForm').html(),
					tpl_editResterForm = Handlebars.compile(src_editResterForm);
				$('#registerForm').html(tpl_editResterForm(json));
			}
			//请求医院列表数据
			$.jsonp({ 
		        url: window.duLife.URLS.hospitalList,
		        callbackParameter: 'callback',
		        timeout:5000,
		        data: {},
	            beforeSend: function(){
	                //validSession('../../login.html',this);
	            },
		        success: function(data){
		        	if(json.editRegister){
		        		$.each(data.hospitals, function(i,item){
		        			if(item.id == json.hospital){
		        				data.hospitals[i].selected = true;
		        				return false;
		        			}
		        		})
		        	}
		    		var src_hospital = $('#tpl_hospital').html(),
						tpl_hospital = Handlebars.compile(src_hospital);
					$('select#hospitalId').html(tpl_hospital(data)).selectmenu('refresh');
					hospitalTips();
					setTimeout(function(){
		 				//$('#register #mainWrapper').css('height',Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight - parseInt($('header').height()));
		 				$('#registerBtn').css({'top':Math.min(parseInt($(window).height()),parseInt(window.screen.height)) - window.statusHeight  - parseInt($('#registerBtn').height()),'visibility':'visible'})
		 				// registerScroll = new iScroll($registerWrapper[0],{
		 				// 	onScrollMove: function(){
		 				// 		//键盘收回
		 				// 		//document.activeElement.blur();
		 				// 	}
		 				// });
		 			},500)
		        },
		        error: function(args){
		            $.duLife.fns.tips("加载数据错误~");
		            return false;
		        }
		    })
			
		}
	}
	$( document ).bind("pagebeforechange", handleBeforeChange);

	$('#register').on('pagebeforeshow', function () {
        if(Device.os.ios&&(parseInt(Device.os.version)<7)){
            $('#registerForm').css('padding-bottom','10rem');
        }
    })

	var hospitalTips = function(){
		var socialCard = $('select#hospitalId').find('option:selected').attr('socialCard');
		var medicalCard = $('select#hospitalId').find('option:selected').attr('medicalCard');
		if(socialCard>0){
			if($('.legend#hospital').find('.tips').size()==0){
				$('.legend#hospital').append('<p class="tips">提示：该医院需要绑定社保卡</p>');
			}else{
				$('.legend#hospital').find('.tips').text('提示：该医院需要绑定社保卡');
			}	
		}else if(medicalCard>0){
			if($('.legend#hospital').find('.tips').size()==0){
				$('.legend#hospital').append('<p class="tips">提示：预约该医院需要就诊卡号，请在备注中提供</p>');
			}else{
				$('.legend#hospital').find('.tips').text('提示：预约该医院需要就诊卡号，请在备注中提供');
			}
		}else{
			$('.legend#hospital').find('.tips').remove();
		}
	}
	window.onload = function(){
		var mpFrom = $( ".min-date" ).mobipick({'minDate':new XDate()});
		var mpTo   = $( ".max-date" ).mobipick({'minDate':new XDate()});
		mpFrom.on( "change", function() {
		    mpTo.mobipick( "option", "minDate", mpFrom.mobipick( "option", "date" ) );
		});
		mpTo.on( "change", function() {
		    mpFrom.mobipick( "option", "maxDate", mpTo.mobipick( "option", "date" ) );
		});

		$('select#hospitalId').on('change',function(){
			hospitalTips();
		})

	}
    if(parseInt(Device.os.version)>6 || Device.os.android)
    {
        var wh=$(window).height();
        $(window).on('resize',function(){
            var sh=$(window).height();
            if(wh==sh)
            {
             $(window).scrollTop(0);
            }
        });
    };
})(jQuery,window);
