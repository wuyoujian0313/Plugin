(function(){
	var introOne = document.getElementsByClassName("intro-one")[0];
	var introTwo = document.getElementsByClassName("intro-two")[0];
	var introThree = document.getElementsByClassName("intro-three")[0];
	var introOneBg = introOne.getElementsByClassName("intro-one-bg")[0];
	var introOneBubble = introOne.getElementsByClassName("intro-one-bubble")[0];
	var introTwoBubble = introTwo.getElementsByClassName("intro-two-bubble")[0];
	var introTwoTitle = introTwo.getElementsByClassName("intro-two-title")[0];
	var introThreeBubble = introThree.getElementsByClassName("intro-three-bubble")[0];
	var introThreeTitle = introThree.getElementsByClassName("intro-three-title")[0];
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	var factor = 1920/1080;
	var screenFactor = screenWidth/1080;
	var shouldHeight = factor*screenWidth + 'px';
	introOne.style.height = shouldHeight;
	introTwo.style.height = shouldHeight;
	introThree.style.height = shouldHeight;
	var thresHold = 60;
	var startX;
	var offset;
	function offsetToIntro(offset) {
		if (offset>0) {
			return 0;
		}
		return offset;
	};
    function start(evt,cb)
    {
    	var cb = cb || function(){};
    	evt.preventDefault();
		startX = evt.touches[0].pageX;
		offsetX = 0;
		cb && cb();
    };
    /*场景变化*/
	function change(options)
	{
		var options = options ||{};
		var obj = options.obj || '';
		var hideClass = options.hideClass;
		var showClass = options.showClass;
		var times = options.times || 200;
		var cb = options.cb || function(){};
		var startHandler = options.startHandler || '';
		var moveHandler = options.moveHandler || '';
		var endHandler = options.endHandler || '';
		obj.removeEventListener('touchstart', startHandler);
		obj.removeEventListener('touchmove', moveHandler);
		obj.removeEventListener('touchend', endHandler);
		setTimeout(function(){
			showClass.style.display = 'block';
			hideClass.style.display = 'none';
			cb && cb();
		},times);	
	};
	function addBind(options)
	{
		var options = options ||{};
		var obj = options.obj;
		var startHandler = options.startHandler || '';
		var moveHandler = options.moveHandler || '';
		var endHandler = options.endHandler || '';
		obj.addEventListener('touchstart', startHandler);
		obj.addEventListener('touchmove', moveHandler);
		obj.addEventListener('touchend', endHandler);
	};
	/*场景一*/
	var bindIntroOne = function() {
		introOneBubble.style.webkitAnimation = "popup-bubble 0.5s linear forwards";
		introOneBubble.style.webkitTransform = 'translate3d(0, 0, 0)';
		var startHandler = function(evt) {
			start(evt,function()
			{
				introOneBubble.style.opacity = 1;
				introOneBubble.style.webkitAnimation = '';
			});
		};
		var moveHandler = function(evt) {
			evt.preventDefault();
			offset = evt.targetTouches[0].pageX - startX;
			var localOffset = offsetToIntro(offset);
			introOneBubble.style.webkitAnimation = '';
			introOneBubble.style.webkitTransform = 'translate3d(' + localOffset + 'px, 0, 0)';
		};
		var endHandler = function(evt) {
			evt.preventDefault();
			var localOffset;
			if (offset<-thresHold) {
				localOffset = offsetToIntro(-screenWidth);
				change({'obj':introOne,'startHandler':startHandler,'moveHandler':moveHandler,'endHandler':endHandler,'hideClass':introOne,'showClass':introTwo,'cb':bindIntroTwo});
			} else
			{
				localOffset = 0;
			}
			return;
		};
		addBind({'obj':introOne,'startHandler':startHandler,'moveHandler':moveHandler,'endHandler':endHandler});
	};
	bindIntroOne();
	/*场景二*/
	var bindIntroTwo = function() {
		introTwoBubble.style.webkitAnimation = "popup-bubble 0.5s linear forwards";
		introTwoBubble.style.webkitTransform = 'translate3d(0, 0, 0)';
		introTwoTitle.style.webkitTransform = 'translate3d(0, 0, 0)';
		var startHandler = function(evt) {
			start(evt,function()
			{
				introTwoBubble.style.opacity = 1;
				introTwoBubble.style.webkitAnimation = '';	
				introTwoBubble.style.webkitTransition = '-webkit-transform 0s ease';
			});
		};
		var moveHandler = function(evt) {
			evt.preventDefault();
			offset = evt.targetTouches[0].pageX - startX;
			var localOffset =offset;
			introTwoBubble.style.webkitAnimation = '';
			introTwoBubble.style.webkitTransform = 'translate3d(' + localOffset + 'px, 0, 0)';
		};
		var endHandler = function(evt) {
			evt.preventDefault();
			introTwoBubble.style.webkitTransition = '-webkit-transform 300ms ease';
			if (offset<-thresHold) {
				/*向右*/
				introTwoBubble.style.webkitTransform = 'translate3d(' + (-screenWidth) + 'px, 0, 0)';
				change({'obj':introTwo,'startHandler':startHandler,'moveHandler':moveHandler,'endHandler':endHandler,'hideClass':introTwo,'showClass':introThree,'cb':bindIntroThree});
			}else if(offset>thresHold){
				/*向左*/
				introTwoBubble.style.webkitTransform = 'translate3d(' + screenWidth + 'px, 0, 0)';
				change({'obj':introTwo,'startHandler':startHandler,'moveHandler':moveHandler,'endHandler':endHandler,'hideClass':introTwo,'showClass':introOne,'cb':bindIntroOne});
			}else {
				introTwoBubble.style.webkitTransform = 'translate3d(0, 0, 0)';
			};
			return;
		};
		addBind({'obj':introTwo,'startHandler':startHandler,'moveHandler':moveHandler,'endHandler':endHandler});
	};
	bindIntroTwo();
	/*场景三*/
	var bindIntroThree = function() {
		introThreeBubble.style.webkitAnimation = "popup-bubble 0.5s linear forwards";
		introThreeBubble.style.webkitTransform = 'translate3d(0, 0, 0)';
		var startHandler = function(evt) {
			start(evt,function()
			{
				introThreeBubble.style.opacity = 1;
				introThreeBubble.style.webkitAnimation='';
				introThreeBubble.style.webkitTransition = '-webkit-transform 0s ease';
			});
		};
		var moveHandler = function(evt) {
			evt.preventDefault();
			offset = evt.targetTouches[0].pageX - startX;
			if(offset<0)
			{
				offset=0;
			}
			var localOffset =offset;
			introThreeBubble.style.webkitAnimation='';
			introThreeBubble.style.webkitTransform = 'translate3d(' + localOffset + 'px, 0, 0)';
		};
		var endHandler = function(evt) {
			evt.preventDefault();
			introThreeBubble.style.webkitTransition = '-webkit-transform 300ms ease';
			if(offset>thresHold){
				change({'obj':introTwo,'startHandler':startHandler,'moveHandler':moveHandler,'endHandler':endHandler,'hideClass':introThree,'showClass':introTwo,'cb':bindIntroTwo});
			}else {
				introThreeBubble.style.webkitTransform = 'translate3d(0, 0, 0)';
			};
			return;
		};
		addBind({'obj':introThree,'startHandler':startHandler,'moveHandler':moveHandler,'endHandler':endHandler});
	};
	bindIntroThree();
	var sHeight=Math.min(parseInt(document.body.clientHeight),parseInt(window.screen.height));
	if(sHeight<=480)
	{
		var as=document.getElementsByTagName('section');
		for(var i=0;i<as.length;i++)
		{
			as[i].style.bottom='88px';
		}
	}
})();