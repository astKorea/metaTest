// 초기 설정 =====================================================================================	

var ua = navigator.userAgent;
var isAndroid = ua.match(/Android/);
var is_ie = navigator.userAgent.toLowerCase().indexOf("msie") != -1;
var s_top_margin;

window.addEventListener('load', function() {
    setTimeout(scrollTo, 0, 0, 1);
}, false);

// 브라우저별 설정 =====================================================================================

var Browser = { version: navigator.userAgent.toLowerCase() }

Browser = {
    ie: /*@cc_on true || @*/ false,
    ie6: Browser.version.indexOf('msie 6') != -1,
    ie7: Browser.version.indexOf('msie 7') != -1,
    ie8: Browser.version.indexOf('msie 8') != -1,
    ie9: Browser.version.indexOf('msie 9') != -1,
    ie10: Browser.version.indexOf('msie 10') != -1,
    ie11: Browser.version.indexOf('trident/7.0') != -1,
    opera: !!window.opera,
    safari: Browser.version.indexOf('safari') != -1,
    safari3: Browser.version.indexOf('applewebkit/5') != -1,
    mac: Browser.version.indexOf('mac') != -1,
    chrome: Browser.version.indexOf('chrome') != -1,
    firefox: Browser.version.indexOf('firefox') != -1
}

// 브라우저별 설정 =====================================================================================	
$(document).ready(function() {


    if (window.innerWidth <= 740) {
        $(".main_img").attr("src", "images/highlights-m.png");
        $(".main_img").next(".model").addClass("m-img");
    } else {
        $(".main_img").attr("src", "images/highlights-pc.png");
        $(".main_img").next(".model").removeClass("m-img");
    }

    $(window).resize(function() {
        if (window.innerWidth <= 740) {
            $(".main_img").attr("src", "images/highlights-m.png");
            $(".main_img").next(".model").addClass("m-img");
        } else {
            $(".main_img").attr("src", "images/highlights-pc.png");
            $(".main_img").next(".model").removeClass("m-img");
        }
    });

    var start_url = location.href.indexOf("index.html");
    if (start_url !== -1) {
        $.cookie("chap", null, { expires: -1, path: '/' });
        $.cookie("this_page_name", null, { expires: -1, path: '/' });
        $.cookie('this_page_num', null, { expires: -1, path: '/' });
        $.cookie("from_search", null, { expires: -1, path: '/' });
        $(window).on("orientationchange", function() {
            //alert($(document).height());
            location.reload();
        });
    }

    // 메인 페이지 마우스 오버시 챕터 이미지 흰색으로 변경
    $('.cover_list li').find('a').on("mouseenter touchstart", function() {
        $(this).children("img").attr("src", $(this).children("img").attr("src").replace(/.png/, '_on.png'));
        $(this).closest("li").addClass("hover");
    });
    $('.cover_list li').find('a').on("mouseleave touchend", function() {
        $(this).children("img").attr("src", $(this).children("img").attr("src").replace(/_on.png/, '.png'));
        $(this).closest("li").removeClass("hover");
    });
    $('.cover_list li:first-child').remove();


    //toc1.html applications, settings 아이콘, sub title 목자 제목 정보 불러옴
    var toc2 = "data/cross2.xml";
    var c_url = location.href;
    var parts = c_url.split("#");

    $("body").prepend("<div id='close_bt_div'></div>");
    if (location.href.indexOf("search/search.html") == -1) {
        $("#view_container").load("toc1.html #con_list");
        setTimeout(function() {
            toc_init();
        }, 300);
    } else {
        $("#view_container").load("../toc1.html #con_list");
        setTimeout(function() {
            toc_init();
        }, 300);
    }
    /*
        $("#view_container").load("toc1.html #con_list");
        setTimeout(function() {
            toc_init();
        }, 300);
    */
    text_lang_insert();
    meta_img();



    // gototop
    $("#gototop").click(function() {
        $(".Heading2").scrollTop(0);
        $(window).scrollTop(0);
    });

    $(".Heading2").scroll(function() {
        if ($(this).scrollTop() >= 100) {
            $("#gototop").css("display", "block");
        } else {
            $("#gototop").css("display", "none");
        }
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() >= 100) {
            $("#gototop").css("display", "block");
        } else {
            $("#gototop").css("display", "none");
        }
    });

}); // DOM - ready
// meta 태그에 들어가는 이미지 경로 넣기
function meta_img() {
    var imgUrl = location.href.split("/").reverse();
    // console.log(imgUrl);
    var lastUrl = imgUrl[0].slice();
    var changeUrl = location.href.replace(lastUrl, 'images/M-hyundai_symbol.png');
    console.log(changeUrl);
    $('meta[property="og:image"]').attr('content', changeUrl);
    $('meta[name="twitter:image"]').attr('content', changeUrl);
};

function text_lang_insert() {
    var language = $("html").attr("data-language");
    // meta tag에 들어가는 언어별 콘텐츠 
    // $('meta[property="og:site_name"]').attr('content', message[language].html_title);
    $('meta[property="og:title"]').attr('content', message[language].html_title);
    // $('meta[property="og:url"]').attr('content', location.href);
    $('meta[property="og:description"]').attr('content', message[language].title);
    $('meta[name="twitter:title"]').attr('content', message[language].html_title);
    $('meta[name="twitter:description"]').attr('content', message[language].title);

    // 도큐먼트 안의 text
    document.title = message[language].html_title;
    $("header h1").text(message[language].title);
    // $("#top .head_tit").text(message[language].title);
    $("span.model").text(message[language].title);
    $("span.model_name").html(message[language].model);
    nosearch = message[language].keyword;
    $("#userManual").text(message[language].title);
    $("#id_search").attr("placeholder", message[language].keyword);
    $("#id_main_search").attr("placeholder", message[language].keyword);
    $("#keyword_text").text(message[language].recent_key);
    $(".video_wrap .chapter_text2").text(message[language].other_link);
    noresult = message[language].reslut;

    if (location.href.indexOf("search/search.html") !== -1) {
        $("#chapter").text(message[language].search);
        $("#chapter_text").text(message[language].search);
        $("#no_results .no_results_text").text(message[language].result);
    }

    setTimeout(function() {
        $("footer .line1").html(message[language].footer_line1);
        $("footer .line2").text(message[language].footer_line2);
    }, 200);
}



function toc_init() {
    //목차 초기 세팅
    $("#id_toc1 .toc-sect li ul").removeAttr("class");

    var topMenuLi = $('#id_toc1 .toc-sect>li'); //2dep li
    var tum = $('#id_toc1 ul.toc-sect li>ul'); //3dep wraper

    setTimeout(scrollTo, 0, 0, 1);
    $('ul.toc-sect').addClass('hidden');
    //$(topMenuLi).has('ul').addClass('child');
    $(tum).css("display", "none");

    //페이지 높이 설정
    $("#close_bt_div").css("height", $(document).height());

    //toc 목차버튼 클릭
    var first_url2 = location.href;
    var deep_check = first_url2.indexOf("#app");

    //toc 위치값 초기 설정
    var po_view_toc = $("#view_toc").width() * (-1);
    var po_view_toc2 = $("#view_toc").width();


    $("#top_kind_toc").css("right", po_view_toc);
    $("#view_toc").css("right", po_view_toc);
    $("#view_toc").css("display", "none");



    $(document).on("mousedown", function(event) {
        $("#value").html(event.pageX);
    });
    $(document).on("mousemove", function(event) {
        $("#value_c").html(event.pageX);
    });
    $(document).on("mouseup", function(event) {
        $("#value2").html(event.pageX);
    });

    // 본문 내용에서 메뉴 클릭시
    $("#toolbar").click(function() {
        var w_li = $(this).index() - 1;
        //alert(w_li);
        //첫번째 li 제외
        setTimeout(function() {
            if ($("#view_toc").css("display") == "none") {
                //TOC 열림 로직
                $("#top_kind_toc").css("display", "block");
                $("#top_kind_toc").animate({ right: 0 }, 500);
                $("#view_toc").css("display", "block");
                $("#view_toc").animate({ right: 0 }, 500);

                //클릭한 li 목차 순서에 해당하는 toc h1을 클릭
                //setTimeout(function(){
                //	$("#id_toc1 h1").eq(0).trigger("click");
                //},200);

                $("#close_bt_div").css("display", "block");
            }
        }, 200);
    });

    // 메뉴가 열린상태에서 검은화면 클릭시 메뉴 닫힘
    $("#close_bt_div").click(function() {
        $(".toc_close").trigger("click");
    });

    //toc 목차버튼 닫히는 이벤트 (외부영역 터치시)
    $(".toc_close").click(function() {
        if (location.href.indexOf("index.html") !== -1 || location.href.indexOf("search/search.html") !== -1) {
            $("body").css("overflow-y", "scroll");
        }

        // index.html 페이지 .wrap 기본값으로 변경하기
        $(".wrap").css("position", "static");

        $("#wrapper").css("position", "fixed");

        //TOC 닫힘 로직
        $("#top_kind_toc").animate({ right: po_view_toc }, 500, function() {
            $("#top_kind_toc").css("display", "none");
        });
        $("#view_toc").animate({ right: po_view_toc }, 500, function() {
            $("#view_toc").css("display", "none");
        });
        $("#close_bt_div").css("display", "none");

        //목차 닫힐 때, TOC 초기화
        $("#id_toc1 .toc-chap").each(function() {
            var thissect = $(this).next('.toc-sect');
            if ($(this).next("ul").attr('class')) {
                if ($(this).next("ul").hasClass("hidden")) {
                    changeBackImg($(this), 1);
                    $(".toc-chap").find(".chapter_text2").css("color", "#333");
                } else {
                    changeBackImg($(this), 1);
                    $(".toc-chap").find(".chapter_text2").css("color", "#333");
                    thissect.addClass('hidden');
                }
            }
        });
    });

    // 검색 돋보기 클릭시 검색 페이지로 이동
    $(".toc_search").click(function() {
        if (location.href.indexOf("search/search.html") !== -1) {
            location.href = "search.html";
        } else {
            location.href = "./search/search.html";
        }
    });


    //본문 TOC 동작
    var chapter_title = $.trim($("#chapter").text());

    // 상단 로고 클릭시 아무동작안함
    $("header .logo").click(function(e) {
        e.preventDefault();
    });

    // start_here 와 본문에서 메뉴 클릭시
    $("header .btn_nav, #toolbar").click(function(e) {
        e.preventDefault();
        if ($("#view_toc").css("display") == "none") {
            $("#view_container").scrollTop(0);
            $("body").css("overflow-y", "hidden");
            $("#wrapper").css("position", "static");

            $("#close_bt_div").css("display", "block");
            $("#top_kind_toc").css("display", "block");
            $("#top_kind_toc").animate({ right: 0 }, 500);
            $("#view_toc").css("display", "block");
            $("#view_toc").animate({ right: 0 }, 500);

            if (chapter_title.length > 0) {
                if ($(".toc-chap:contains(" + chapter_title + ")").next("ul").hasClass("hidden")) {
                    $(".toc-chap:contains(" + chapter_title + ")").trigger("click");
                    $(".toc-chap:contains(" + chapter_title + ")").next("ul").children("li").each(function(j) {
                        link = location.href.split('#');
                        h1_chk = link[0].indexOf($(this).children("a").attr("href"));
                        if (h1_chk !== -1) {
                            $(this).children("a").css({ 'color': '#a36b4f' });
                        }
                    });
                }
            }
        }
    });

    changeBackImg($('.toc-chap'), 1);
    $(".toc-chap").find(".chapter_text2").css("color", "#333");

    //toc chapter 클릭
    $('.toc-chap').click(function() {
        var thissect = $(this).next('.toc-sect');

        // index.html 페이지 .wrap 고정값으로 변경하기
        $(".wrap").css("position", "fixed");

        // search.html 페이지의 목차 링크 주소 바꾸기
        if (location.href.indexOf("search/search.html") !== -1) {
            thissect.each(function() {
                var sect_link = thissect.children("li").children("a").attr("href");
                sect_link = "../" + sect_link;
                thissect.children("li").children("a").attr("href", sect_link);
            });
        }

        $('.toc-sect').removeAttr('style');

        if (thissect.css('display') != 'none') {
            thissect.addClass('hidden');
            changeBackImg($(this), 1);
            $(".toc-chap").find(".chapter_text2").css("color", "#333");
        } else {
            $('.toc-sect').addClass('hidden');
            thissect.removeClass('hidden');

            changeBackImg($('.toc-chap'), 1);
            $(".toc-chap").find(".chapter_text2").css("color", "#333");
            $(".toc-chap").css("background-color", "#fff");
            changeBackImg($(this), 2);
            $(this).find(".chapter_text2").css("color", "#00aad2");
        }

        /*if($(this).hasClass("no-sect")){
        	$(this).css("background-image", 'none');	
        }*/

        s_top_margin = 77;
        $(this).ScrollTo(0, 500);
    });

    function changeBackImg(target, num) { //toc 열림/닫힘 버튼 이미지
        if (location.href.indexOf("search/search.html") == -1) {
            var img_path = 'url(images/but' + num + '.png)';
        } else {
            var img_path = 'url(../images/but' + num + '.png)';
        }
        $(target).css("background-image", img_path);
    };

    //목차 하위 sect 클릭
    //	$('.child>a').click(function(e) {
    //		e.preventDefault();
    //		var tobj=$(this).next();
    //		var pobj=$(this).parent();
    //		
    //		if(tobj.css('display') != 'none'){
    //			tobj.hide();
    //			pobj.removeClass("open");
    //		}else{
    //		$('ul.toc-sect li ul').hide();
    //		$('ul.toc-sect li').removeClass("open");
    //			tobj.show();
    //			pobj.addClass("open");
    //		}
    //	});

    $('.child > ul > li >a').click(function(e) {
        $(".toc_close").trigger("click");
    });


    // read me first 챕터 링크로 변경
    $("#id_toc1 .toc-chap").each(function() {
        $(this).children("a").removeAttr("href");
        /*if($(this).next().children("li").size() == 1) {
        	var toc_link = $(this).next().children("li").children("a").attr("href");
        	$(this).addClass('no-sect ');
        	$(this).children("a").attr("href", toc_link);
        	$(this).next().remove();
        }else{
        	$(this).children("a").removeAttr("href");
        }*/
    });

    var toc_chap_total = $("#id_toc1 .toc-chap").length;
    $("#id_toc1 .toc-chap").eq(toc_chap_total - 1).css("border-bottom", "1px solid #f6f3f2");


    $(".toc-chap").next().children("li").children("ul").children("li").children("ul").remove();

    /*$(".toc-chap").each(function() {
    	if($(this).next().children("li").size() == 1) {
    		var toc_link = $(this).next().children("li").children("a").attr("href");
    		$(this).addClass('no-sect ');
    		$(this).children(".chapter_text").wrap("<a href='" + toc_link + "'></a>");
    		$(this).next().remove();
    	}
    });*/

    var language_t = $("html").attr("data-language");

    $(".choice_f li").each(function() {
        var choice = $(this).children("a").attr("href");
        $(this).children("a").attr("href", choice + "#");
    });


    $("#id_toc1 .toc-chap").each(function() {
        if ($(this).next().attr("class") !== "toc-sect") {
            //$(this).addClass("no-sect");
        }
    });

    $("#id_toc2 .toc-chap").each(function() {
        if ($(this).next().attr("class") !== "toc-sect") {
            //$(this).addClass("no-sect");
        }
    });
    //마지막 toc-chap은 화살표 제거

    quick_init();
}

// // 플로팅 메뉴 =======================================================================
function quick_init() {

    var scrollmask = $('#scrollmask').parent("div");

    scrollmask.append('<div class="select_wrap"><select name="sources" id="sources" class="custom-select sources" placeholder="Quick Link"></div>');
    var floatSelect = scrollmask.find('select');


    $('#id_toc1 h1').parents().children('ul').children('.toc-sect li.float').each(function() {
        var floatoption = $(this).children('a');
        if (location.href.indexOf("search/search.html") !== -1) {
            floatSelect.append('<option ' + 'class="' + $(this).attr('class') + '" value="../' + floatoption.attr('href') + '">' + floatoption.text() + '</option>');
        } else {
            floatSelect.append('<option ' + 'class="' + $(this).attr('class') + '" value="' + floatoption.attr('href') + '">' + floatoption.text() + '</option>');
        }

    });

    //console.log($('#id_toc1 h1').length);



    // 플로팅 메뉴 꾸며주기(가짜 플로팅)
    $(".custom-select").each(function() {
        var classes = $(this).attr("class"),
            id = $(this).attr("id"),
            name = $(this).attr("name");
        var template = '<div class="' + classes + '">';
        template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
        template += '<div class="custom-options">';
        //template += '<a href="#">';

        $(this).find("option").each(function() {
            template += '<a href="' + $(this).attr("value") + '"><span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
        });
        template += '</div></div>';

        $(this).wrap('<div class="custom-select-wrapper"></div>');
        $(this).hide();
        $(this).after(template);
    });
    $(".custom-option:first-of-type").hover(function() {
        $(this).parents(".custom-options").addClass("option-hover");
    }, function() {
        $(this).parents(".custom-options").removeClass("option-hover");
    });
    $(".custom-select-trigger").on("click", function() {
        $('html').one('click', function() {
            $(".custom-select").removeClass("opened");
        });
        $(this).parents(".custom-select").toggleClass("opened");
        event.stopPropagation();
    });
    $(".custom-option").on("click", function() {
        $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
        $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
        $(this).addClass("selection");
        $(this).parents(".custom-select").removeClass("opened");
        $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
    });


    // class에 float이 있으면 목록이 나오고 없으면 숨기기
    $('.custom-options a').each(function() {

        var optionClass = $(this).find('span').attr('class') == 'custom-option float';
        //console.log(optionClass);
        $(this).hide();
        if (optionClass == true) {
            $(this).show();
        }
    });

    // 햄버거버튼안에 서치버라인 headbox 라인에 맞추기
    var headerH = $("header").outerHeight(true);
    var headerTopH = $("#top").outerHeight(true);
    var searchH = $("#top_kind_toc");
    var viewContainerTop = $("#view_container");
    console.log(headerH);
    searchH.css({ "height": headerH + "px" });
    searchH.css({ "height": headerTopH + "px" })
    viewContainerTop.css({ "top": headerH + "px" });
    viewContainerTop.css({ "top": headerTopH + "px" });
    $(".header_wrap").css({ "height": $("header").height() + "px" });
    $(".top_wrap").css({ "height": $("#top").height() + "px" });

    // 언어버튼
    var language_list = $(".language_list");
    $(".language_btn").on("click", function() {
        language_list.fadeToggle();
        $(this).toggleClass("active");

    });
    var hrefUrl = location.href;
    language_list.find("li").each(function() {
        var language_href = $(this).find("a").attr("href");
        if (language_href == hrefUrl) {
            $(this).addClass("active");
        }

    });

}
// // 플로팅 메뉴 끝=======================================================================

//function doSearch(){
//	var value=$("#id_main_search").val();
//	//$("#id_main_search").blur();
//	if($("#id_main_search").val().length==0){
//		location.href="./search/search.html";
//	}else{
//		location.href="./search/search.html?StrSearch="+value;
//	}
//}

/* scroll to plugin
	2012. 10. 26일 추가
/**
 * @depends jquery
 * @name jquery.scrollto
 * @package jquery-scrollto {@link http://balupton.com/projects/jquery-scrollto}
 */

/**
 * jQuery Aliaser
 */
(function(window, undefined) {
    // Prepare
    var jQuery, $, ScrollTo;
    jQuery = $ = window.jQuery;

    ScrollTo = $.ScrollTo = $.ScrollTo || {
        /**
         * The Default Configuration
         */
        config: {
            //duration: 400,
            duration: 0,
            easing: 'swing',
            callback: undefined,
            durationMode: 'each',
            offsetTop: 0,
            offsetLeft: 0
        },

        /**
         * Configure ScrollTo
         */
        configure: function(options) {
            // Apply Options to Config
            $.extend(ScrollTo.config, options || {});

            // Chain
            return this;
        },

        /**
         * Perform the Scroll Animation for the Collections
         * We use $inline here, so we can determine the actual offset start for each overflow:scroll item
         * Each collection is for each overflow:scroll item
         */
        scroll: function(collections, config) {
            // Prepare
            var collection, $container, container, $target, $inline, position,
                containerScrollTop, containerScrollLeft,
                containerScrollTopEnd, containerScrollLeftEnd,
                startOffsetTop, targetOffsetTop, targetOffsetTopAdjusted,
                startOffsetLeft, targetOffsetLeft, targetOffsetLeftAdjusted,
                scrollOptions,
                callback;

            // Determine the Scroll
            collection = collections.pop();
            $container = collection.$container;
            container = $container.get(0);
            $target = collection.$target;

            // Prepare the Inline Element of the Container
            $inline = $('<span/>').css({
                'position': 'absolute',
                'top': '0px',
                'left': '0px'
            });
            position = $container.css('position');

            // Insert the Inline Element of the Container
            $container.css('position', 'relative');
            $inline.appendTo($container);

            // Determine the top offset
            startOffsetTop = $inline.offset().top;
            targetOffsetTop = $target.offset().top;
            targetOffsetTopAdjusted = targetOffsetTop - startOffsetTop - parseInt(config.offsetTop, 10) - s_top_margin; //맨 뒤에 42는 상단에 고정된 #top 때문에 추가.

            // Determine the left offset
            startOffsetLeft = $inline.offset().left;
            targetOffsetLeft = $target.offset().left;
            targetOffsetLeftAdjusted = targetOffsetLeft - startOffsetLeft - parseInt(config.offsetLeft, 10);

            // Determine current scroll positions
            containerScrollTop = container.scrollTop;
            containerScrollLeft = container.scrollLeft;

            // Reset the Inline Element of the Container
            $inline.remove();
            $container.css('position', position);

            // Prepare the scroll options
            scrollOptions = {};

            // Prepare the callback
            callback = function(event) {
                // Check
                if (collections.length === 0) {
                    // Callback
                    if (typeof config.callback === 'function') {
                        config.callback.apply(this, [event]);
                    }
                } else {
                    // Recurse
                    ScrollTo.scroll(collections, config);
                }
                // Return true
                return true;
            };

            // Handle if we only want to scroll if we are outside the viewport
            if (config.onlyIfOutside) {
                // Determine current scroll positions
                containerScrollTopEnd = containerScrollTop + $container.height();
                containerScrollLeftEnd = containerScrollLeft + $container.width();

                // Check if we are in the range of the visible area of the container
                if (containerScrollTop < targetOffsetTopAdjusted && targetOffsetTopAdjusted < containerScrollTopEnd) {
                    targetOffsetTopAdjusted = containerScrollTop;
                }
                if (containerScrollLeft < targetOffsetLeftAdjusted && targetOffsetLeftAdjusted < containerScrollLeftEnd) {
                    targetOffsetLeftAdjusted = containerScrollLeft;
                }
            }

            // Determine the scroll options
            if (targetOffsetTopAdjusted !== containerScrollTop) {
                scrollOptions.scrollTop = targetOffsetTopAdjusted;
            }
            if (targetOffsetLeftAdjusted !== containerScrollLeft) {
                scrollOptions.scrollLeft = targetOffsetLeftAdjusted;
            }

            // Perform the scroll
            if ($.browser.safari && container === document.body) {
                $container.animate(scrollOptions, config.duration, config.easing, callback);
                //window.scrollTo(scrollOptions.scrollLeft, scrollOptions.scrollTop);
                //callback();
            } else if (scrollOptions.scrollTop || scrollOptions.scrollLeft) {
                $container.animate(scrollOptions, config.duration, config.easing, callback);
            } else {
                callback();
            }

            // Return true
            return true;
        },

        /**
         * ScrollTo the Element using the Options
         */
        fn: function(options) {
            // Prepare
            var collections, config, $container, container;
            collections = [];

            // Prepare
            var $target = $(this);
            if ($target.length === 0) {
                // Chain
                return this;
            }

            // Handle Options
            config = $.extend({}, ScrollTo.config, options);

            // Fetch
            $container = $target.parent();
            container = $container.get(0);

            // Cycle through the containers
            while (($container.length === 1) && (container !== document.body) && (container !== document)) {
                // Check Container for scroll differences
                var scrollTop, scrollLeft;
                scrollTop = $container.css('overflow-y') !== 'visible' && container.scrollHeight !== container.clientHeight;
                scrollLeft = $container.css('overflow-x') !== 'visible' && container.scrollWidth !== container.clientWidth;
                if (scrollTop || scrollLeft) {
                    // Push the Collection
                    collections.push({
                        '$container': $container,
                        '$target': $target
                    });
                    // Update the Target
                    $target = $container;
                }
                // Update the Container
                $container = $container.parent();
                container = $container.get(0);
            }

            // Add the final collection
            collections.push({
                '$container': $(
                    ($.browser.msie || $.browser.mozilla) ? 'html' : 'body'
                ),
                '$target': $target
            });

            // Adjust the Config
            if (config.durationMode === 'all') {
                config.duration /= collections.length;
            }

            // Handle
            ScrollTo.scroll(collections, config);

            // Chain
            return this;
        }
    };

    // Apply our jQuery Prototype Function
    $.fn.ScrollTo = $.ScrollTo.fn;


})(window);
/* scrollTo plugin end */