$(function(){
	var url = window.duLife.URLS.ucIndex; 
	$.jsonp({
		type:'get',
		url:url,
		callbackParameter: 'callback',
		timeout:5000,
		beforeSend: function(){
		},
		success:function(json){
			convertTemplete(json);
			checkVersion();
		},
		error:function(){
			$.duLife.fns.tips('亲，网络环境不稳定，请刷新重试')
		},
		complete:function(){}
	});
	
	function handleBars(target,template,json){
       var tpl= template.html();
       var template = Handlebars.compile(tpl);
       target.html(template(json));
    };
    function convertTemplete(json){
		handleBars($('#personalInfo'),$('#personalInfoList'),json);
		handleBars($('#countBox'),$('#messageCount'),json);
	};	
    $('#personalCenter').delegate('#publish','click', function(){
        $.mobile.changePage('../../view/personal/publish.html',{transition :'none'});
	});
	
    $('#personalCenter').delegate('#information','click', function(){
        $.mobile.changePage('../../view/personal/information.html',{transition :'none'});
	});
	
    $('#personalCenter').delegate('#setting','click', function(){
    	setTimeout(function(){
		  $.mobile.changePage('../../view/personal/setting.html',{transition :'none'});
		},30);
	});
     
	$(document).on("pagebeforeshow","#personalCenter",function(){
		checkVersion();
	});
    $('#logoutBtn').on('click',function()
	{ 
		$target=$(this);
		if($target.hasClass('disable'))return;
		$target.addClass('disable');
		setTimeout(function(){
			$.duLife.fns.confirm('是否确认退出？',function()
			{
				location.replace('life://api/logout');
				localStorage.setItem('currentUser','');
				$target.removeClass('disable');
			},function()
			{
				$('#logoutBtn').removeClass('disable');
			});

		},500);
	});
	function checkVersion(){
		if(parseInt(localStorage.getItem("updatedEnabled"))){
			$('#setting .divVersion').css("display","inline-block");
		}
	};
});