;(function($,window) { 
  var timer=null;
  var photoCount= 0;
  $('#mainIndex').on('pagebeforeshow',function(){
    if(Device.os.ios&&(parseInt(Device.os.version)<7)){
      $('#mainIndex #module').css('padding-bottom','10rem');
      }
  });
  
  if(localStorage.getItem('currentUser'))
   {
      loadDataMain();
   }else{
      window.getUsernameCallback =function()
      {
        loadDataMain();
      }
   };
  function loadDataMain()
    {
    var url = window.duLife.BASEURL + '/mobileDuLife/index?appkey=24731fb4d22a49b0a42cd9b12ed0a159&currentUser='+localStorage.getItem('currentUser')+'&version='+window.duLife.VERSION;
    //var url= window.duLife.URLS.mainIndex;
    $.jsonp({
      type: 'GET',
      url: url,
      timeout:8000,
      beforeSend: function(xhr){
        
      },
      success: function(json){
        var slider=new iSlider({
            dom: document.getElementById('scrollBox'),
            data: json.flashAlbum,
            duration: 4000,
            isPoint:true,
            isVertical: false,
            isLooping: true,
            isDebug: true,
            isAutoplay: true,
            animateType: 'default',
            tapHandler:function(index)
            {
              var dataId=json.flashAlbum;
              window.location.href='view/life/life_detail.html?articleid='+dataId[index].id;

            }
          });
        scrollPhoto(json);
      },
      callbackParameter: 'callback',//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
      error:function(xOptions,textstatus){
              $('#mainIndexWrapper').html('<div class="noWifi"><p><a>重新加载</a></p></div>');
              $('#mainIndexWrapper').delegate($('.noWifi>a'),'touchstart',function()
              {
                $(this).addClass('hover');
              });      
              $('#mainIndexWrapper').delegate($('.noWifi>a'),'touchend',function()
              {
                $(this).removeClass('hover');
                window.location.reload();
              });      
      },
      complete:function(xhr){
        setTimeout($.duLife.fns.getVersionCheckedInfo(false),500);
      }
      });
    };
    function handleBars(target,template,json){
       var tpl= template.html();
       var template = Handlebars.compile(tpl);
       target.html(template(json));
    }
    function scrollPhoto(json){
        handleBars($('#module'),$("#moduleList"),json);
    }
    
})(jQuery,window);


