// Debug
// console = new Object();
// console.log = function(log) {
//   var iframe = document.createElement("IFRAME");
//   iframe.setAttribute("src", "ios-log:#iOS#" + log);
//   document.documentElement.appendChild(iframe);
//   iframe.parentNode.removeChild(iframe);
//   iframe = null;    
// };
// console.debug = console.log;
// console.info = console.log;
// console.warn = console.log;
// console.error = console.log;
window.duLife = window.duLife || {};
window.getUsernameCallback=null;
window.getUserName = function(name)
{
   localStorage.setItem('currentUser',name);
   getUsernameCallback && getUsernameCallback();
};
//Test
// window.duLife.BASEURL = 'http://m1-art-devapp2.vm.baidu.com:8336/api/3.0/uuapTestKey/liujimin.mobileDuLife';
// window.duLife.REGISTERURL = 'http://m1-art-devapp2.vm.baidu.com:8336/api/3.0/uuapTestKey/liujimin.registerAPI';
// //图片上传，必须用特定地址
// var uploadPicURL = "http://m1-art-devapp2.vm.baidu.com:8336/api/2.0?callback=jsonpCallBack";
// var portalParams="?appkey=24731fb4d22a49b0a42cd9b12ed0a159&currentUser="+localStorage.getItem('currentUser');
// var oaParams="?appkey=24731fb4d22a49b0a42cd9b12ed0a159&userName="+localStorage.getItem('currentUser');
//release
window.duLife.BASEURL = 'http://mop.baidu.com/api/3.0/uuapclient-38-HRosXKR3qhfeXSlqniKr/liujimin.mobileDuLife';
window.duLife.REGISTERURL = 'http://mop.baidu.com/api/3.0/uuapclient-38-HRosXKR3qhfeXSlqniKr/liujimin.registerAPI';
//图片上传，必须用特定地址
var uploadPicURL="http://mop.baidu.com/api/2.0?callback=jsonpCallBack";
var portalParams="?appkey=24731fb4d22a49b0a42cd9b12ed0a159&currentUser="+localStorage.getItem('currentUser');
var oaParams="?appkey=24731fb4d22a49b0a42cd9b12ed0a159&userName="+localStorage.getItem('currentUser');

window.duLife.EMPLOYEEURL = window.duLife.REGISTERURL;
window.duLife.VERSION = "1.2.1"; //You must change the number by yourself everytime when we have to update a version!
window.duLife.VERSION_FLAG = false;

window.duLife.IOS_APPKEY = "B8B7F6745F5B224D683A3E37954C79C4";
window.duLife.ANDROID_APPKEY = "131AC6A1181C2DC39C331DB2EBEB6833";
window.duLife.URLS = {
	//首页
	mainIndex: window.duLife.BASEURL + '/mobileDuLife/index'+portalParams+'&version='+window.duLife.VERSION,
	//生活站首页列表请求
	lifeIndex: window.duLife.BASEURL + '/mobileDuLife/lifeAll'+portalParams,
	//生活站详情页
	lifeDetail: window.duLife.BASEURL + '/mobileDuLife/lifeDetail'+portalParams,
	//详情页‘点赞’
	support: window.duLife.BASEURL + '/mobileDuLife/lifeSupport'+portalParams,
	//详情页‘参与’
	isJoin: window.duLife.BASEURL + '/mobileDuLife/lifeJoin'+portalParams,
	//发布评论
	submitCommnets: window.duLife.BASEURL + '/mobileDuLife/addComment'+portalParams,
	//社团汇
	teamIndex: window.duLife.BASEURL + '/mobileDuLife/teamList'+portalParams,
	//社团详情
	teamDetail: window.duLife.BASEURL + '/mobileDuLife/teamDetail'+portalParams,
	//精彩活动
	activity: window.duLife.BASEURL + '/mobileDuLife/teamActivity'+portalParams,
	//度优惠
	couponIndex: window.duLife.BASEURL + '/mobileDuLife/coupon'+portalParams,
	//优惠列表
	couponList: window.duLife.BASEURL + '/mobileDuLife/couponList'+portalParams,
	//爱折扣
	discount: window.duLife.BASEURL + '/mobileDuLife/discountList'+portalParams,
	//品牌区
	brand: window.duLife.BASEURL + '/mobileDuLife/brandList'+portalParams,
	//安居坊
	houseList: window.duLife.BASEURL + '/mobileDuLife/houseList'+portalParams,
	//安居坊详情
	houseDetail: window.duLife.BASEURL + '/mobileDuLife/houseDetail'+portalParams,
	//跳蚤街列表
	goodsList: window.duLife.BASEURL + '/mobileDuLife/goodsList'+portalParams,
	//跳蚤街物品详情
	goodsDetail: window.duLife.BASEURL + '/mobileDuLife/goodsDetail'+portalParams,
	//评论列表
	comments: window.duLife.BASEURL + '/mobileDuLife/commentList'+portalParams,
	//发布物品--类型的json数据
	createGoods: window.duLife.BASEURL + '/mobileDuLife/createGoods'+portalParams,
	//编辑发布物品
	editGoods: window.duLife.BASEURL + '/mobileDuLife/editGoods'+portalParams,
	//发布物品--暂存
	saveGoods: window.duLife.BASEURL + '/mobileDuLife/saveGoods'+portalParams,
	//发布物品--发布
	submitGoods: window.duLife.BASEURL + '/mobileDuLife/saveGoods'+portalParams,
	//发布房产--设施的json数据
	createHouse: window.duLife.BASEURL + '/mobileDuLife/createHouse'+portalParams,
	//编辑发布房产
	editHouse: window.duLife.BASEURL + '/mobileDuLife/editHouse'+portalParams,
	//发布房产--暂存
	//发布房产--发布
	submitHouse: window.duLife.BASEURL + '/mobileDuLife/saveHouse'+portalParams,
	//上传图片
	nativeUploadPic: 'life://api/pickmedia?x=640&y=480',
	//个人中心--首页
	ucIndex: window.duLife.BASEURL + '/mobileDuLife/personalCenterIndex'+portalParams,
	//个人中心--发布管理
	managePosts: window.duLife.BASEURL + '/mobileDuLife/mySecondHand'+portalParams,
	//个人中心--发布管理--关闭
	closeGoods: window.duLife.BASEURL + '/mobileDuLife/closeGoods'+portalParams,
	//个人中心--发布管理--开启
	openGoods: window.duLife.BASEURL + '/mobileDuLife/openGoods'+portalParams,
	//个人中心--发布管理--删除
	delGoods: window.duLife.BASEURL + '/mobileDuLife/delGoods'+portalParams,
	//个人中心--发布管理物品编辑
	goodsDetail: window.duLife.BASEURL + '/mobileDuLife/goodsDetail'+portalParams,
	//个人中心--发布管理房屋编辑
	houseDeatil: window.duLife.BASEURL + '/mobileDuLife/houseDeatil'+portalParams,
	//个人中心--信息
	manageMsg: window.duLife.BASEURL + '/mobileDuLife/myMessage'+portalParams,
	//个人中心--信息已读
	updateMsg: window.duLife.BASEURL + '/mobileDuLife/updateMessage'+portalParams,
	//个人中心--设置
	ucSettings: window.duLife.BASEURL + '/mobileDuLife/ucenter/ucSettings',
	//个人中心--版本更新检查
	versionChecked: window.duLife.BASEURL + '/mobileDuLife/versionInfo'+portalParams,
//	versionChecked: window.duLife.BASEURL + '/mobileDuLife/versionInfo?sessionId='+sessionId+'&currentUser='+name,
	
	//个人中心--意见反馈
	submitFeedback: window.duLife.BASEURL + '/mobileDuLife/submitFeedback'+portalParams,
	//挂号通--首页
	registerIndex: window.duLife.REGISTERURL + '/registerAPI/registerIndex.do'+oaParams,
	//挂号通--取消预约
	cancelRegister:window.duLife.REGISTERURL + '/registerAPI/cancelRegister.do'+oaParams,
	//挂号通--预约挂号提交表单
	register: window.duLife.REGISTERURL + '/registerAPI/register.do'+oaParams,
	//挂号通--预约挂号热线电话
	hotline: window.duLife.REGISTERURL + '/registerAPI/hotline.do'+oaParams,
	//挂号通--医院列表
	hospitalList: window.duLife.REGISTERURL + '/registerAPI/selectHospital.do'+oaParams,
	//挂号通--添加家属提交
	addFamily: window.duLife.REGISTERURL + '/registerAPI/addPatient.do'+oaParams,
	//挂号通--删除家属
	delFamily: window.duLife.REGISTERURL + '/registerAPI/delPatient.do'+oaParams,
	//挂号通--选择就诊人
	selectPatient:window.duLife.REGISTERURL + '/registerAPI/selectPatient.do'+oaParams,
	//挂号通--查看帮助
	help: window.duLife.REGISTERURL + '/registerAPI/help.do'+oaParams,
	//上传图片
	uploadpic: uploadPicURL,
	//新员工--导航
	employeeNavigation: window.duLife.EMPLOYEEURL + '/entryApi/searchCategory.do'+oaParams,
	// employeeNavigation: window.duLife.EMPLOYEEURL + '/entryApi/searchCategory.do?userName=liujimin',
	//新员工--分类与内容
	employeeContent: window.duLife.EMPLOYEEURL + '/entryApi/searchContent.do'+oaParams,
	//速查询
	demand:window.duLife.REGISTERURL +'/entryApi/searchFirstCategory.do'+oaParams,
	demandDetail:window.duLife.REGISTERURL +'/entryApi/searchSecondCategory.do'+oaParams,
	demandAnswer:window.duLife.REGISTERURL +'/entryApi/searchQueryContent.do'+oaParams,
	//问HR首页
	askingIndex:window.duLife.REGISTERURL+'/questionApi/questionIndex.do'+oaParams,
	//问HR分类
	askingGenre:window.duLife.REGISTERURL+'/questionApi/selectCategory.do'+oaParams,
	//问HR提问
	askingQuestion:window.duLife.REGISTERURL+'/questionApi/ask.do'+oaParams,
	//问HR回答
	askingAnswer:window.duLife.REGISTERURL+'/questionApi/detail.do'+oaParams,
	//问HR修改
	modifyAsking:window.duLife.REGISTERURL+'/questionApi/update.do'+oaParams,
	//不想问了
	noAsking:window.duLife.REGISTERURL+'/questionApi/delete.do'+oaParams,
	//追问
	againAsk:window.duLife.REGISTERURL+'/questionApi/againAsk.do'+oaParams,
	//评价
	suppory:window.duLife.REGISTERURL+'/questionApi/evaluate.do'+oaParams
};  
//每次请求前验证session
var updateTokenDfd = $.Deferred();
window.updateTokenCount = 1;
window.alreadyTryLogin = false;
window.updateTokenFn = function(){
	location.href = 'life://api/updateToken';
	//return updateTokenDfd;
};
//updateTokenFn的回调函数
window.updateToken = function(code){
	console.log(code+'updateToken');
	switch(code){
		case 1:  //退出登录
			if (alreadyTryLogin===false) {
				alreadyTryLogin = true;
				location.replace('life://api/tryLogin');		
			 }
			break;		
		case 2: //验证成功
			//updateTokenDfd.resolve();
		 	window.updateTokenCount = 1;
		 	//window.location.reload();
			break;
        case -1: case -2: case -3: case -4: case 0:  //网络错误
            $.duLife.fns.tips("请检查网络~");
            break;
        default: //重复请求三次
        	if(window.updateTokenCount>=3){
        		if (alreadyTryLogin===false)
		 			location.replace('life://api/tryLogin');
		 		return;
		 	}
		 	window.updateTokenFn();
		 	window.updateTokenCount++;
            break;
	}
}
window.onLoginSuccess = function(){
    //登录成功回调函数，刷新当前页
    //alert(localStorage.getItem('currentUser'));
    var urlParams = $.duLife.fns.getUrlParam();
    var url = location.href;
    location.replace(url);
};
