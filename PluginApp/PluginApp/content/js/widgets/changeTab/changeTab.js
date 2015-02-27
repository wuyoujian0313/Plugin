// JavaScript Document
//切换标签
function changeTab(options)
{
	 var options = options || {};
	 var obj=options.obj || '#tabTransfer';
	 var curStyle=options.curStyle || '#curStyle';
	 var content=options.content || '.content';
	 var defaultClass=options.defaultClass || 'show';
	 var current=options.current ||'current';
	 var cb=options.cb || function(){};
	 $(obj).find('li').on('click',function(event){
		var $target = $(this);
		var $parent = $target.parent();
		var $curStyle = $(curStyle);
	    var type = $target.attr('type');
		$(content).removeClass(defaultClass);
		$(content).eq($target.index()).addClass(defaultClass);		
		if($target.hasClass(current)) return false;
		$target.siblings().removeClass(current);
		$target.addClass(current);
		window.pageNum = 1;
		//数据加载成功之前加loading图
		$('#loadImg').css('display','block');
		$.mobile.activePage.find('#pullDown,#pullUp').css('visibility','hidden');
		$.mobile.activePage.find('#pullDown').next('div').html('');
		cb && cb(type);
	});
};

