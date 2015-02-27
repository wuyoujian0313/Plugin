;(function($,window){
	
	$(document).on("pageinit","#settingPage",function(){
		initVersionInfo();
		initVersionVisible();
	});
	
	function initVersionInfo(){
		var versionInfo = "当前版本：V" + window.duLife.VERSION;
		$('#currentVersion').text(versionInfo.toString());
	};
	
	function initVersionVisible(){
		if(parseInt(localStorage.getItem("updatedEnabled"))){
			setVersionVisible();
		}
	};
	
	function setVersionVisible(){
		$('#detectionUpdates .divVersion').css("display","inline-block");
	};
	
	function tipsHandler(){
		$.duLife.fns.tips('您已经是最新版本');
	};
	
    $('#detectionUpdates').on('click', function(){
		$.duLife.fns.getVersionCheckedInfo(true,setVersionVisible,tipsHandler);
    });
    
    $('#settingPage #feedback').on('click', function(){
        $.mobile.changePage('../../view/personal/feedback.html',{transition :'none'});
    });
})(jQuery,window);