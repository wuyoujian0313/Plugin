// imageflip. Lightweight JQuery Mobile Image Gallery 
// Saman W Jayasekara : sam@cflove.org : www.cflove.org
// 15 Sap 2012 - Ver 0.1 - MIT License 
(function ($) {
    $.fn.imageflip = function () {
        var loadingimg = '../../../images/loading.gif';
        var i   = $("<img />").attr('src',loadingimg).load() //pre load the loading image
        var g = $(this);
        var length = $(this).children().length;

        //标识有几张图片的圆点
        var sliderBtnHtml = '';
        // var i = 0;
        // for(i; i<length; i++){
        //     sliderBtnHtml += '<li></li>';            
        // }
        //sliderBtnHtml = '<div  id="imageFlipIcon"><ul>'+sliderBtnHtml+'</ul></div>';

        $(this).children().each(function (index, element) { // remove href from the list
            var $t = $(this).find('a');
            $t.attr('data-href', $t.attr('href')).removeAttr('href');
            sliderBtnHtml += '<li></li>';
        }).click(function (e) {
            if(e.target.tagName=='SPAN'){
                return ;
            }
            $(g).children('[showing]').removeAttr('showing'); //remove the marker form previous selector
            $(this).attr('showing', 'yes'); //mark this one
            var bimg = $(this).find('a').attr('data-href');
            var title = $(this).find('a').attr('title');

            if (bimg !== '') {
                // create a layer for big image 
                if (!$('#imageflippage').length) {
                    var pagehtml = '<div data-role="page" id="imageflippage" data-theme="c" data-title="">'+
                                        '<div data-role="content" id="tadcontent">'+
                                            '<div id="imageflipimg"></div>'+
                                            '<div id="imagefliper"></div>'+
                                            '<div id="tadinfo"></div>'+
                                            '<div id="tadnavi" data-role="navbar">'+
                                                '<ul>'+
                                                    '<li><a href="" data-iconpos="notext" data-role="button" data-icon="delete" id="tadclose"></a></li>'+
                                                    '<li><a href="" data-iconpos="notext" data-role="button" data-icon="arrow-l" id="tadbk"></a></li>'+
                                                    '<li><a href="" data-iconpos="notext" data-role="button" data-icon="arrow-r" id="tadnxt"></a></li>'+
                                                '</ul>'+
                                            '</div>'+
                                            '<div  id="imageFlipIcon"><ul>'+sliderBtnHtml+'</ul></div>' + 
                                        '</div>'+
                                    '</div>'
                    $('body').append(pagehtml);

                    $('#imageFlipIcon>ul').children('li').eq($(this).index()).addClass('current');
                    //$.mobile.initializePage();
                    $('body').delegate('#imageflippage','pagehide', function () {
                        $(this).remove()
                    }); //distroy the page on exits
                    $('#tadclose').click(function (e) {
                        history.back();
                    });
                    $('#imagefliper').click(function (e) { //show hide the navi bar/image info
                        if ($('#tadnavi').is(':visible')) {
                            $('#tadnavi').slideUp('slow');
                            $('#tadinfo:visible').slideUp('slow')
                        } else {
                            $('#tadnavi').slideDown('slow');
                            if ($('#tadinfo').html() !== '') {
                                $('#tadinfo').slideDown('slow')
                            }
                        };
                    }).swipeleft(function () {
                        $('#tadnxt').click()
                    }).swiperight(function () {
                        $('#tadbk').click()
                    })
                    var $iconList = $('#imageFlipIcon>ul').children('li');
                    // go to next
                    $('#tadnxt').click(function (e) {
                        var $next = $(g).children('[showing]').next();

                        if ($next.length) {
                            $next.click();
                            $iconList.removeClass('current');
                            $iconList.eq($next.index()).addClass('current');
                        } 
                        // else {
                        //     $(g).children(':first-child').click()
                        // }
                    });
                    // previous image
                    $('#tadbk').click(function (e) {
                        var $prev = $(g).children('[showing]').prev();
                        if ($prev.length) {
                            $prev.click()
                            $iconList.removeClass('current');
                            $iconList.eq($prev.index()).addClass('current');
                        } 
                        // else {
                        //     $(g).children(':last-child').click()
                        // }
                    });
                }else{
                    $('#imageflippage #imageFlipIcon>ul').html(sliderBtnHtml);
                    $('#imageFlipIcon>ul').children('li').eq($(this).index()).addClass('current');
                }

                $('#imageflipimg').fadeOut('fast', function () { //fade the current image
                    $('#imageflippage .ui-btn-active').removeClass("ui-btn-active"); //remove button active status
                    $('#imageflipimg').html('<img src="' + loadingimg + '" style="margin-top:120px">') // show loading image
                    $("<img />").attr('src', bimg).load(function (e) { // image lading
                        if (typeof title !== 'undefined' && title !== false && title !== '') { // handle image title info
                            $('#tadinfo').html(title).slideDown('slow', function () {
                                $('#tadinfo:visible').delay('4000').slideUp('slow')
                            })
                        } else {
                            $('#tadinfo').html('');
                        };
                        $('#imageflipimg').css({
                            'background-image': 'url(' + bimg + ')'
                        }).html('').fadeIn('slow') //add image, clear loading image
                    });
                });
                if (!$("#imageflippage").is(':visible')) {
                    $.mobile.changePage("#imageflippage")
                } // move to the imageflip page

            }
        })
    }
})(jQuery);