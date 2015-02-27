function flow(){
	var newArr=window.duLife.feData.privilege.data;
	console.log(newArr);
	var timer=null;
	function add(){
		var aUl=document.getElementById('flowBox').children;
		var arr=[];
		for(var i=0;i<aUl.length;i++){
			arr.push(aUl[i]);
		};
		clearInterval(timer);
		var num=0;
		timer=setInterval(function(){
			var oLi=document.createElement('li');

			oLi.innerHTML= '<a href="../../view/life/life_detail.html?articleid=11111" rel="external"><span class="flowState" style="background-color:rgba(245,94,113,0.7)">'+'&nbsp;&nbsp;进行中</span><img src="' + newArr[num].imgSrc + '" width="100%" /></a>'+'<h2><a href="../../view/life/life_detail.html">'+newArr[num].title+'</a></h2>'+'<div class="aboutInfo"><span>两天前</span><span class="tar">36</span></div>';
			arr.sort(function(obj1,obj2){
				return obj1.offsetHeight-obj2.offsetHeight;
			});
			arr[0].appendChild(oLi);
			num++;
			if(num==15){
				clearInterval(timer);
			};
		},30);
	};
	add();
	window.onscroll=function(){
		var winH=document.documentElement.clientHeight;
		var scrollT=document.body.scrollTop || document.documentElement.scrollTop;
		if(document.body.scrollHeight<=winH+scrollT+100){
			add();
		}
	};
};
