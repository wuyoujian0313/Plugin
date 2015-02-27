/*运动*/
function move(obj, json, options)
{
	options=options||{};
	options.type=options.type||'buffer';
	options.time=options.time||700;
	var count=parseInt(options.time/30);
	var n=0;
	var start={};
	var dis={};
	for(var name in json)
	{
		if(name=='opacity')
		{
			start[name]=Math.round(parseFloat(getComputedStyle(obj, false)[name])*100);
		}
		else
		{
			start[name]=parseInt(getComputedStyle(obj, false)[name]);
		}
		dis[name]=json[name]-start[name];
	}
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		n++;
		
		for(var name in json)
		{
			switch(options.type)
			{
				case 'linear':		//匀速
					var cur=start[name]+dis[name]*n/count;
					break;
				case 'buffer':		//缓冲
					var a=1-n/count;
					var cur=start[name]+dis[name]*(1-a*a*a);
					break;
				case 'ease-in':		//加速
					var a=n/count;
					var cur=start[name]+dis[name]*(a*a*a);
					break;
			}
			
			if(name=='opacity')
			{
				obj.style.filter='alpha(opacity:'+cur+')';
				obj.style.opacity=cur/100;
			}
			else
			{
				obj.style[name]=cur+'px';
			}
		}
		if(n==count)
		{
			clearInterval(obj.timer);
			options.end && options.end();
		}
	}, 30);
};
//找到最低的那个
function min (heightAarry) {
	heightAarry.sort(function(j1,j2){
		return j1.height-j2.height;
	});
	return heightAarry;
};
function createDiv(id){
		var oDiv = document.createElement('div');
		oDiv.style.height = '165px';//parseInt(Math.random()*100+150)+'px';
		oDiv.className= 'imgShow';
		oDiv.innerHTML= '<a href="image/66.png"><img src="../../images/test/pic02.png" width="100%" /></a>'
		+'<h2>【员工关怀&nbsp;&#8226;&nbsp;团购】'+id+'东方时尚驾校团购优惠1</h2>'
		+'<div class="aboutInfo"><span>两天前</span><span class="tar">36</span></div>';
		return oDiv;
};
window.onload=function(){
	var oCon = document.getElementsByClassName('container')[0];
	var aDiv = oCon.children;
	var height= $('aDiv[0]').height;
	
	function getElement(){
		for (var i = 0; i < 10; i++) {
			var oDiv= createDiv(i);
			var arr= [];
			for (var  j= 0; j < aDiv.length; j++) {
				arr[j]= aDiv[j];
			};
			arr.sort(function(left,right){
				return left.offsetHeight-right.offsetHeight;
			})
			//move(oDiv,{'opacity':0},{time:1000});
			arr[0].appendChild(oDiv);
		};
	}

	getElement();
	window.onscroll =function(){
		var scrollTop= document.documentElement.scrollTop||document.body.scrollTop;
		var scrollBottom= scrollTop+document.documentElement.clientHeight;
		if(document.body.scrollHeight-180 <= scrollBottom  ){
			
			getElement();
		}
	}
}
