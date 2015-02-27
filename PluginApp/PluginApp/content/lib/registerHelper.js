Handlebars.registerHelper('dateFormat',function(today,date,format,alwaysDiff,showTime){
	var date = parseInt(date);
	var today=today || new Date().getTime();
	var	diffTime = today - date;
	var displayTip = displayTip || false;
	var showTime = showTime || false;
	var ds=1;
	var minute = 60*1000,
		hour = 60*minute,
		day = 24*hour,
		format = format || 'YYYY年MM月DD日',
		alwaysDiff = alwaysDiff || false;

	var formatArr = ['YYYY','MM','DD','H','M','S'];
	if(showTime)
	{
		ds=0;
	}
	if(((parseInt(diffTime/day) >= ds) && !alwaysDiff) || diffTime<0 || (alwaysDiff=='never')){
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
		return parseInt(diffTime/day) + '天前';
	};
	if(parseInt(diffTime/hour) >= 1){
		return parseInt(diffTime/hour) +'小时前';
	}
	if(parseInt(diffTime/minute) >= 1){
		return parseInt(diffTime/minute) +'分钟前';
	}
	if((parseInt(diffTime/minute) <=1)&&(diffTime!=0)){
		return parseInt(diffTime/1000) +'秒前';
	}
	if(parseInt(diffTime)==0){
		return '刚刚';
	}
});

Handlebars.registerHelper('readoutValue', function(key,value){
	if(key==value)
	{
		return true;
	}
	return false;
});

Handlebars.registerHelper('jsonStringify', function(obj){
	return JSON.stringify(obj)
});

Handlebars.registerHelper('compare', function(v1,op,v2,options){
	var v1 = v1;
	var v2 = v2;
	if(eval('v1'+op+'v2')){
		return options.fn(this)
	}else{
		return options.inverse(this);
	}
});

Handlebars.registerHelper('isPhone',function(phone,options){
	var isPhone = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/.test(phone);
	if(isPhone){
		return options.fn(this);
	}else{
		return options.inverse(this);
	}
});
Handlebars.registerHelper('hEval',function(expression){
	console.log(expression)
	return eval(expression);
});
Handlebars.registerHelper('storey',function(total,pageNum,pageSize,index){
	return parseInt(total-(pageNum-1)*pageSize-index);
});
