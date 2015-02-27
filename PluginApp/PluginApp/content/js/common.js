;(function($,window){
  	//输入字数限制
	$.fn.textLimit = function(num){
		if(typeof $(this).change == 'function'){
			$(this).bind({
				change:function(){
					var strReg=/[^\x00-\xff]/g;
					var val = $.trim($(this).val());
					var str=val.replace(strReg,'**');
					var len=str.length;
					if(len>num)
					{
						var newLen=Math.floor(num/2);
						var strLen=str.length;
						for(var i=newLen;i<strLen;i++)
						{
							var newStr=val.substr(0,i).replace(strReg,"**");
							if(newStr.length>=num)
							{
								$(this).val(val.substr(0,i));
								break;
							}
						}
					}else{
						$(this).val(val);
					}
				}
			})
		}else if(typeof $(this).input == 'function'){
			$(this).bind({
				input:function(){
					var strReg=/[^\x00-\xff]/g;
					var val = $.trim($(this).val());
					var str=val.replace(strReg,'**');
					var len=str.length;
					if(len>num)
					{
						var newLen=Math.floor(num/2);
						var strLen=str.length;
						for(var i=newLen;i<strLen;i++)
						{
							var newStr=val.substr(0,i).replace(strReg,"**");
							if(newStr.length>=num)
							{
								$(this).val(val.substr(0,i));
								break;
							}
						}
					}else{
						$(this).val(val);
					}
				}
			})
		}else{
			$(this).bind({
				keyup:function(){
					var strReg=/[^\x00-\xff]/g;
					var val = $.trim($(this).val());
					var str=val.replace(strReg,'**');
					var len=str.length;
					if(len>num)
					{
						var newLen=Math.floor(num/2);
						var strLen=str.length;
						for(var i=newLen;i<strLen;i++)
						{
							var newStr=val.substr(0,i).replace(strReg,"**");
							if(newStr.length>=num)
							{
								$(this).val(val.substr(0,i));
								break;
							}
						}
					}else{
						$(this).val(val);
					}
				}
			})
		}

		
	};
	//Dialog二次封装
	$.duLife = $.duLife || {};
	$.duLife.fns = $.duLife.fns || {};

	$.duLife.fns = {
		'alert':function(msg){
					$('.ui-page-active #duLife_Fns_alert').simpledialog({
					    'mode' : 'bool',
					    'prompt' : msg,
					    'transition':'pop',
					    'pickPageTheme':'b',
					    'useDialogForceFalse':true, 
					    'cleanOnClose':true,
					    'allowReopen':false,
					    'forceInput':false,
					    'buttons' : {
					      '确定': {
					        click: function () {
					          //$('#dialogoutput').text('OK');
					        },
					        icon:'none'
					      }
					    },
					    'onCreated':function(d){
			    			d.pickerContent.addClass('alert-dialog');
			    		}						
					})
				},
		'confirm':function(msg,cbSure,cbCancel){
					$('.ui-page-active #duLife_Fns_confirm').simpledialog({
					    'mode' : 'bool',
					    'prompt' : msg,
					    'transition':'pop',
					    'pickPageTheme':'b',
					    'cleanOnClose':true,
					    'allowReopen':false,
					    'useDialogForceFalse':true,
					    'forceInput':false,
					    'cancelCallback':cbCancel,
					    'buttons' : {
					      '确定': {
					        click: function () {
					          if(typeof cbSure == 'function'){
					        	  cbSure();
					          }
					        },
					        icon: "none"
					      },
					      '取消': {
					        click: function () {
					          if(typeof cbCancel == 'function') cbCancel();
					        },
					        icon: "none",
					        theme:'c'
					      }
					    },
					    'onCreated':function(d){
			    			d.pickerContent.addClass('confirm-dialog');
			    		}
					})
				},
		'tips': function(msg){
				$('.ui-page-active #duLife_Fns_tips').simpledialog({
				    'mode' : 'bool',
				    'prompt' : msg,
				    'transition':'pop',
				    'useModal':false,
				    'width':'200px',
				    'pickPageTheme':'b',
				    'useDialogForceFalse':true,
				    'buttons' : {},
				    'animate':true,
				    'onCreated':function(d){
				    	d.pickerContent.addClass('tips-dialog');
				    },
				    'onOpened':function(d){
				    	setTimeout(function(){
				    		d.close()
				    	},1000)
				    }
				    // 'onShown':function(d){
				    // 	setTimeout(function(){
				    // 		alert(1)
				    // 		alert($('.tips-dialog').size())
				    // 		//d.close();
				    // 		$('.tips-dialog').next('.ui-simpledialog-screen').remove();
				    // 		$('.tips-dialog').remove();
				    // 	},1000);
				    // }
				})
		},
		getUrlParam: function(options){
			if(Device.os.android && parseFloat(Device.os.version)<4.1){
				if(window.params){
					var obj = window.params;
				}else{
					var obj = $.parseJSON(prompt("life:getQueryParameters"));
				} 
			}else{
				var options=options || {};
				var string =options.str || $.mobile.path.parseUrl($.mobile.path.getLocation()).search;
				var obj =  {};  
				if (string.indexOf("?") != -1) { 
					var string = decodeURIComponent(string).substr(string.indexOf("?") + 1); 
					var strs = string.split("&");  
					for(var i = 0; i < strs.length; i ++) {  
						var tempArr = strs[i].split("=");  
						obj[tempArr[0]] = tempArr[1];
					}  
				}
			}
			return obj;
			
		},
		getUrlHash: function(){
			var string = $.mobile.path.parseUrl($.mobile.path.getLocation()).hash;
			var hash;  
			if (string.indexOf("#") != -1) { 
				hash = decodeURIComponent(string).substr(string.indexOf("#")); 		  
			}  
			return hash;
		},
		dateFormat: function(today,date,format,alwaysDiff){
			var date = parseInt(date);
			var today=today || new Date().getTime();
			var diffTime = today - date;

			var minute = 60*1000,
				hour = 60*minute,
				day = 24*hour,
				format = format || 'YYYY年MM月DD日',
				alwaysDiff = alwaysDiff || false;

			var formatArr = ['YYYY','MM','DD','H','M','S'];

			if(((parseInt(diffTime/day) >= 1) && !alwaysDiff) || diffTime<0){
			var date = new Date(date),
				year = date.getFullYear(),
				month = date.getMonth()+1,
				month = (month>9) ? month : '0'+month,
				day = (date.getDate()>9) ? date.getDate() : '0'+ date.getDate(),
				hour = (date.getHours()>9) ? date.getHours() : '0'+ date.getHours(),
				minute = (date.getMinutes()>9) ? date.getMinutes() : '0'+date.getMinutes(),
				second = (date.getSeconds()>9) ? date.getSeconds() : '0'+date.getSeconds(),
				dateArr = [year,month,day,hour,':'+minute,':'+ second];
				for(var i=0; i < formatArr.length; i++){
					format = format.replace(formatArr[i],dateArr[i]);
				}
				return format;
			}else if(parseInt(diffTime/day) >= 1){
				return parseInt(diffTime/day) + '天';
			};
			if(parseInt(diffTime/hour) >= 1){
				return parseInt(diffTime/hour) +'小时';
			}
			if(parseInt(diffTime/minute) >= 1){
				return parseInt(diffTime/minute) +'分钟';
			}
			if((parseInt(diffTime/minute) < 1)&&(diffTime!=0)){
				return parseInt(diffTime/1000) +'秒';
			}
			if(parseInt(diffTime)==0){
				return '刚刚';
			}
		},
			
		getVersionCheckedInfo:function(isConfig,updatedHandler,tipsHandler){
			var url = window.duLife.URLS.versionChecked;
			
			var mobileDuLifeAppKey;
			if(Device.os.ios){
				mobileDuLifeAppKey = window.duLife.IOS_APPKEY;
			}else{
				mobileDuLifeAppKey = window.duLife.ANDROID_APPKEY;
			}
			
			$.jsonp({
				url : url,
			    callbackParameter: 'callback',
			    data:{
			    	mobileDuLifeAppKey:mobileDuLifeAppKey
			    },
			    timeout:5000,
				success : function(data) {
					if(data && data.success){
						updatedCheck(isConfig,data,updatedHandler,tipsHandler);
					}else{
						$.duLife.fns.tips('检测更新失败！');
					}
				},
				error : function(args) {
					$.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
					return false;
				}
			});
			
			function updatedCheck(isConfig,jsonObj,updatedHandler,tipsHandler) {
				var currentVersionNum = window.duLife.VERSION;//1.0.1
//				var currentVersionNum = "1.3.0";//test

				var versionNum = jsonObj.versionInfo.data.version || "";//1.0.2
				var updatedVersionNum = localStorage.getItem("updatedVersion");//null
				
				if (versionNum && versionNum != currentVersionNum) {
					localStorage.setItem("updatedEnabled",1);
					
					var updateURL = jsonObj.versionInfo.data.url || "";
					var message = '更新版本: V' + versionNum;
					
					if(isConfig || !updatedVersionNum || updatedVersionNum != versionNum){
						localStorage.setItem("updatedVersion",versionNum);
						$.duLife.fns.confirm(message, function(){
							window.open(updateURL);
						});
					}

					console.log("版本更新内容： " + jsonObj.versionInfo.data.release_note);
					if(typeof updatedHandler == 'function') updatedHandler();
				} else{
					localStorage.setItem("updatedEnabled",0);
					if(typeof tipsHandler == 'function') tipsHandler();
				}
			};
			
		}
	};

	$(document).on('pageshow',function(){
		var dialogElements = '<span style="display:none;" id="duLife_Fns_alert"></span>'+
							 '<span style="display:none;" id="duLife_Fns_confirm"></span>'+
							 '<span style="display:none;" id="duLife_Fns_tips"></span>';
		/*body>div[data-role="page"]*/
		if($('.ui-page-active').find('#duLife_Fns_alert').size()==0){
			$('.ui-page-active').append(dialogElements);
		}
		
	});
	window.statusHeight = (Device.os.ios&&(parseInt(Device.os.version)<7))?20:0;
	window.is40 = (Device.os.android && parseFloat(Device.os.version)<4.1)?true:false;


})(jQuery,window);