;(function ($, window) {
    var photoscroll, wrapperScroll;
    var $photoList, $photoscroller, $photoWrapper, $wrapperscroller;
    var defaultProv = '北京',
        defaultCity = '海淀';
    //发布页面加载数据并初始化
    var loaddata = function (json) {
        var json = json || {};
        $.jsonp({ //获取数据
            url: window.duLife.URLS.createHouse,
            callbackParameter: 'callback',
            timeout:5000,
            data: {},
            beforeSend: function(){
                // validSession('../../login.html',this);
            },
            success: function (data) {
                if (json.editForm) {
                    $.each(data.facilities, function (i, item) {
                        
                        for (var i = 0; i < json.house.facilitieses.length; i++) {
                            if (item.value == json.house.facilitieses[i]) {
                                data.facilities[i].selected = true;
                            }
                        }
                    })
                }
                
                $wrapperscroller = $('#createHousePage #wrapper');
                var src_facilities = $('#tpl_facilities').html(),
                    tpl_facilities = Handlebars.compile(src_facilities);
                $('#facilitiesWrapper select').html(tpl_facilities(data)).selectmenu('refresh');
                if (!json.editForm) {
                    setTimeout(function () {

                        // $wrapperscroller.css('height', Math.min(parseInt($(window).height()), parseInt(window.screen.height)) - parseInt($wrapperscroller.offset().top));
                        // wrapperScroll = new iScroll($wrapperscroller[0]);
                        $('select#prov').selectmenu('refresh');
                        $('select#city').selectmenu('refresh');
                    }, 500);
                }
            },
            error: function (xOptions,textstatus) {
                $.duLife.fns.tips('亲，网络环境不稳定，请刷新重试');
                return false;
            }
        })
    }

    //编辑页面加载数据并初始化
    var editLoadData = function (json) {
        var loadRefresh = function () {
            $photoList = $('#createHousePage #photoList'),
            $photoscroller = $('#createHousePage #photoScroller');
            $wrapperscroller = $('#createHousePage #wrapper');
            $photoWrapper = $('#createHousePage #photosWrapper');
            if($photoList.children('li').size()>=6){
                $('#addPhoto').hide();
                $('#addPhotoSpan').show();
            };
            setTimeout(function () {
                // $wrapperscroller.css('height', Math.min(parseInt($(window).height()), parseInt(window.screen.height)) - parseInt($wrapperscroller.offset().top));
                // wrapperScroll = new iScroll($wrapperscroller[0]);
                $('select#prov').selectmenu('refresh');
                $('select#city').selectmenu('refresh');
                if ($photoList.find('li').size() > 0) {
                    $photoscroller.removeClass('noPhoto');
                    $photoscroller.css('width', $photoList.width() + 96);
                    if (!photoscroll) {
                        photoscroll = new iScroll($photoWrapper[0])
                    }
                    photoscroll.refresh();
                    $photoList.imageflip();
                }
            }, 500);
        }
        $.jsonp({
            url: window.duLife.URLS.houseDetail,
            callbackParameter: 'callback',
            timeout:5000,
            data: {
                articleId: json.articleid
            },
            beforeSend: function(){
                // validSession('../../login.html',this);
            },
            success: function (data) {
                json = $.extend({}, json, data);
                var src_editHouseForm = $('#tpl_editHouseForm').html(),
                    tpl_editHouseForm = Handlebars.compile(src_editHouseForm);
                $('#createHouse').html(tpl_editHouseForm(data.house)).trigger('create');
                defaultProv = data.house.prov;
                defaultCity = data.house.city;
                initPage();
                loaddata(json);
                loadRefresh();
            },
            error: function (xOptions,textstatus) {
                $.duLife.fns.alert('亲，网络环境不稳定，请刷新重试');
                return false;
            }
        })
        // var src_editHouseForm = $('#tpl_editHouseForm').html(),
        // 	tpl_editHouseForm = Handlebars.compile(src_editHouseForm);
        // $('#createHouse').html(tpl_editHouseForm(window.duLife.feData.editHouseForm));
        // //$('#createHouse').trigger('create');
        // loadRefresh();
    }

    var initPage = function () {
        //位置选择下拉
        var cityJSON = {"citylist": [
            {"p": "北京", "c": [
                {"n": "海淀"},
                {"n": "朝阳"},
                {"n": "东城"},
                {"n": "崇文"},
                {"n": "宣武"},
                {"n": "西城"},
                {"n": "昌平"},
                {"n": "其他"}
            ]},
            {"p": "上海", "c": [
                {"n": "长宁"},
                {"n": "徐汇"},
                {"n": "静安"},
                {"n": "匣北"},
                {"n": "黄浦"},
                {"n": "虹口"},
                {"n": "杨浦"},
                {"n": "浦东新区"},
                {"n": "普陀"},
                {"n": "其他"}
            ]},
            {"p": "广州", "c": [
                {"n": "天河"},
                {"n": "白云"},
                {"n": "越秀"},
                {"n": "荔湾"},
                {"n": "海珠"},
                {"n": "黄埔"},
                {"n": "萝岗"},
                {"n": "其他"}
             ]},
             {"p": "深圳", "c": [
                {"n": "南山"},
                {"n": "宝安"},
                {"n": "福田"},
                {"n": "罗湖"},
                {"n": "其他"}
             ]},
             {"p": "东莞", "c": [
                {"n": "莞城"},
                {"n": "东城"},
                {"n": "南城"},
                {"n": "万江"},
                {"n": "其他"},
              ]}
         ]};
        $("#cityWrapper").citySelect({
            url: cityJSON,
            prov: defaultProv,
            city: defaultCity
        });

        $photoWrapper = $('#createHousePage #photosWrapper');
        $photoList = $('#createHousePage #photoList');
        $photoscroller = $('#createHousePage #photoScroller');
        $photoList.delegate('.delete', 'click', function (event) {
            $(this).parent().remove();
            $photoscroller.css('width', $('#addPhoto').width() + 96 * $photoList.children('li').size());
            photoscroll.refresh();
            $photoList.imageflip();
            if ($photoList.children('li').size() == 0) {
                $photoscroller.addClass('noPhoto');
            }
            if($photoList.children('li').size()<6){
                $('#addPhoto').show();
                $('#addPhotoSpan').hide();
            }
        })

        //根据租或售改变租赁方式状态
        $('input[name="type"]').bind('click', function () {
            if ((this.defaultValue == '招租') || (this.defaultValue == '求租')) {
                $('#houseMethod .ui-radio').removeClass('ui-disabled');
                $('#houseMethod input').attr('disabled', false);
            } else {
                $('#houseMethod .ui-radio').addClass('ui-disabled');
                $('#houseMethod input[checked]').attr('checked', false);
                $('#houseMethod .ui-btn-active').removeClass('ui-btn-active')
            }
        })
        //限制在字符
        $('input[name="title"]').textLimit(80);
        $('#content').textLimit(300);
     }
    $('#createHousePage').delegate('select#prov', 'change', function () {
        $('select#city').selectmenu('refresh');
    })
    
    //生成标题
    $('#createHousePage').delegate('#createTitle', 'click', function () {
        var method = $('input[name="method"]:checked').val(),
            type = $('input[name="type"]:checked').val(),
            prov = $('select[name="prov"]').val(),
            city = $('select[name="city"]').val(),
            street = $('input[name="street"]').val();
        if (method == undefined ||type=='出售' ||type=='求购') {
            method = '';
        }
        var title = '【 ' + method + type + '】【' + prov + city + '】【' + street + '】';
        $('input[name="title"]').val(title);
    });

    //暂存
    $('#createHousePage').delegate('#save', 'click', function () {
        var $target=$(this);
        if($target.hasClass('disabled')) return;
        if(!$.trim($('[name="title"]').val())){
            $('#createTitle').trigger('click');
        }
        var json = $('#createHouse').serialize() + "&status=暂存";
        $target.addClass('disabled');
        setTimeout(function(){
            $.jsonp({
                type: 'post',
                url: window.duLife.URLS.submitHouse,
                callbackParameter: 'callback',
                timeout:5000,
                data: json,
                success: function (data) {
                    $.mobile.activePage.find('#save').removeClass('disabled');
                    if (data.success) {
                        $.duLife.fns.tips(data.message);
                        if ($('#createHouse').find('input[name="id"]').size() == 0) {
                            $('#createHouse').append('<input type="hidden" name="id" value="' + data.id + '" />');
                        }
                    } else {
                        $.duLife.fns.alert(data.message);
                    }
                },
                error: function (xOptions,textstatus) {
                    $.mobile.activePage.find('#save').removeClass('disabled');
                    $.duLife.fns.alert('亲，网络环境不稳定，请刷新重试');
                    return false;
                }
            })
        },500)
    });
    var changeEvent;
    if(typeof $('input[name="area"]').change == 'function'){
        changeEvent = 'change';
    }else if(typeof $('input[name="area"]').input == 'function'){
        changeEvent = 'input';
    }else{
        changeEvent = 'keyup';
    }
    $('input[name="room"],input[name="hall"],input[name="price"],input[name="phone"]').on(changeEvent,function(){
        $(this).val($(this).val().replace(/\D/g,''));
    });
     $('input[name="area"]').on(changeEvent,function(){
        $(this).val($(this).val().replace(/[^0-9\.]/g,''));
    });
    //发布
    $('#createHousePage').delegate('#submit', 'click', function () {
        var $target=$(this);
        if($target.hasClass('disabled')) return;
        $('.error').removeClass('error');
        var $requiredlist = $('[required]');
        var i = 0,
            len = $requiredlist.length;
        for (i; i < len; i++) {
            var $this = $requiredlist.eq(i)
            if (!$.trim($this.val())) {
                $.duLife.fns.tips('请填写所有项!');
                $this.parent().addClass('error');
            }
        }
        if ($('#createHouse .error').size() > 0) {
            $('#createHouse .error').eq(0).focus();
            return false;
        }
        var room=document.getElementsByName('room')[0];
        var area=document.getElementsByName('area')[0];
        var price=document.getElementsByName('price')[0];
        var hall=parseInt(document.getElementsByName('hall')[0].value);
        var roomValue=parseInt(room.value);
        var areaValue=parseFloat(area.value);
        var priceValue=parseInt(price.value);
        room.value=roomValue;
        area.value=areaValue;
        document.getElementsByName('hall')[0].value=hall;
        price.value=priceValue;
        if(roomValue==0)
        {
            $.duLife.fns.tips('填写类型有误!');
            $(room).parent().addClass('error');
            return false;
        };   
        if(areaValue==0)
        {
            $.duLife.fns.tips('填写类型有误!');
            $(area).parent().addClass('error');
            return false;
        };
        if(priceValue==0)
        {
            $.duLife.fns.tips('填写类型有误!');
            $(price).parent().addClass('error');
            return false;
        };
        $target.addClass('disabled');
        document.activeElement.blur();
        window.scrollTo(0,0);
        setTimeout(function(){
            $.duLife.fns.confirm('是否确认发布？', function () {
                var json = $('#createHouse').serialize() + "&status=待审核";
                $.jsonp({
                    type: 'post',
                    url: window.duLife.URLS.submitHouse,
                    callbackParameter: 'callback',
                    timeout:5000,
                    data: json,
                    beforeSend: function(){
                        //validSession('../../login.html',this);
                    },
                    success: function (data) {
                        if (data.success) {
                            $.duLife.fns.tips('发布成功');
                            setTimeout(function () {
                                $.mobile.activePage.find('#submit').removeClass('disabled');
                                if(window.is40){
                                    window.params = {id:data.id};
                                    $.mobile.changePage('../../view/house/detail.html',{transition :'none'});
                                }else{
                                    $.mobile.changePage('../../view/house/detail.html?id=' + data.id,{transition :'none'})
                                }
                            }, 1500)
                        } else {
                            $.duLife.fns.alert('发布失败');
                            $.mobile.activePage.find('#submit').removeClass('disabled');
                        }
                    },
                    error: function (args) {
                        $.duLife.fns.alert('亲，网络环境不稳定，请刷新重试');
                        $.mobile.activePage.find('#submit').removeClass('disabled');
                        return false;
                    }
                })
            },function(){
                $.mobile.activePage.find('#submit').removeClass('disabled');
            });
        },500)
    });

    //调用相机或相册选择图片
    window.onMediaPickSuccess = function (uri) {
        var localuri = encodeURIComponent(uri);
        var uploadurl = encodeURIComponent(window.duLife.URLS.uploadpic);
        location.href = 'life://api/filetransfer?localuri=' + localuri + '&uploadurl=' + uploadurl;
    }
    //上传图片
    window.onFileTransfered = function (status, data) {
        data = decodeURIComponent(atob(data.toString()));
        data = JSON.parse(data);
        if ((parseInt(status) >= 400) && (parseInt(status) < 500)) {
            $.duLife.fns.alert('请求出错~');
            return false;
        }
        if (parseInt(status) >= 500) {
            $.duLife.fns.alert('服务器出错~');
            return false;
        }
        if (parseInt(status) == 0) {
            $.duLife.fns.alert('网络错误~');
            return false;
        }
        if (data.success) {
            var $img = '<li><a data-href="' + data.url + '" class="ui-link"><img src="' + data.url + '"></a><span class="delete"></span><input type="hidden" name="pics" value="' + data.url + '"></li>';
            $photoscroller.removeClass('noPhoto');
            $photoList.append($img);
            if($photoList.children('li').size()>=6){
                $('#addPhoto').hide();
                $('#addPhotoSpan').show();
            }
            $photoscroller.css('width', $('#addPhoto').width() + 96 * $photoList.children('li').size());
            if (!photoscroll) {
                photoscroll = new iScroll($photoWrapper[0])
            }
            photoscroll.refresh();
            $photoList.imageflip();
        } else {
            $.duLife.fns.alert('上传失败')
        }
    }

    //编辑
    var firstOpen = true;

    function handleBeforeChange(e, data) {
        if ((typeof data.toPage != "string") && firstOpen) {
            firstOpen = false;
            var json = $.duLife.fns.getUrlParam();
            if (json.editForm) {
                editLoadData(json);
            } else {
                loaddata();
                initPage();
            }
        }
    }

    $(document).bind("pagebeforechange", handleBeforeChange);

    $('#createHousePage').on('pagebeforeshow', function () {
        if(Device.os.ios&&(parseInt(Device.os.version)<7)){
            $('#createHousePage').css('padding-bottom','10rem');
        }
        var json = $.duLife.fns.getUrlParam();
        if (json.editForm) {
            $('#createHouse').trigger('create')
        }
    });
    if(parseInt(Device.os.version)>6 || Device.os.android)
    {
        var wh=$(window).height();
        $(window).on('resize',function(){
            var sh=$(window).height();
            if(wh==sh)
            {
             $(window).scrollTop(0);
            }
        });
    };
    $('#facilities').on('click',function()
    {
        $(window).scrollTop(0);; 
    });
})(jQuery, window);
