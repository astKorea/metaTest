var noresult = "";
var nosearch = "";
var k = "";
var p = 0;
var first_url = location.href;
var language = $("html").attr("data-language");
var cookieList = function(cookieName) {
        var cookie = $.cookie(cookieName);
        var items = cookie ? cookie.split(/$/) : new Array();
        return {
            "add": function(val) {
                items.push(val);
                $.cookie(cookieName, items.join('$'), { expires: 365, path: '/' });
            },
            "clear": function() {
                items = null;
                $.cookie(cookieName, null, { expires: -1, path: '/' });
            },
            "items": function() {
                return items;
            }
        }
    }
    //공백제거
function trim(text) {
    if (text) {
        return text.replace(/(^\s*)|(\s*$)/g, "").replace(/\n/g, "").replace(/\t/g, "");
    }
}

function RightReplace(str, n) {
    if (n <= 0) {
        return "";
    } else if (n > String(str).length) {
        return str;
    } else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
}

//=========================================================================== dom ready 시작 ==============================================================================================//
$(document).ready(function() {

    if ($.cookie('txt_search') != null) {
        var searchTerm = $.cookie('txt_search');

        // remove any old highlighted terms
        $('#root').removeHighlight();

        // disable highlighting if empty
        if (searchTerm) {
            // highlight the new term
            if (searchTerm.indexOf("|") != -1) {
                var searchArray = searchTerm.split("|");
                for (var i = 0, iLen = searchArray.length; i < iLen; i++) {
                    $('#root').highlight(searchArray[i]);
                }
            } else {
                $('#root').highlight(searchTerm);
            }
        }
    }



    /* h2 목차 추가 */
    if ($("h1").attr("class") == "Heading1-APPLINK" || $("h1").attr("class") == "heading1 Heading1-APPLINK" || $("h1").attr("class") == "Heading1-Intro" || $("h1").attr("class") == "heading1") {
        h1_app = "app_link";
        $("h1").next("h2[class*='Heading2']:eq(0)").css("display", "none");
    } else if ($("h1").attr("class") == "Heading1-APPLINK-Nosub-Intro") {
        $("h1").next("h2[class*='Heading2']:eq(0)").css("display", "none");
        h1_app = "";
    } else if ($("h1").attr("class") == "Heading1-Intro-Self") {
        $("h1").css("display", "none");
        h1_app = "";
    } else {
        h1_app = "";
    }

    var time_set = 0;
    var menu_cnt = $("#root > div[class*='Heading2']").size() - 1;
    if (menu_cnt > 10) {
        time_set = 300;
    } else {
        time_set = 100;
    }
    setTimeout(function() {
        $("#nav").css("display", "block");
    }, 100);




    $("li").each(function(index, element) {
        if ($(this).html() == "") {
            $(this).remove();
        }
    });

    // 상단 로고 클릭시 메인화면으로 이동
    //일반페이지에서 뒤로 버튼 눌렀을 경우
    $(".logo").click(function(e) {
        e.preventDefault();
        if (location.href.indexOf("search/search.html") !== -1) {
            location.href = '../index.html';
        } else {
            location.href = "index.html";
        }
    });

    var start_url = location.href.indexOf("index.html");
    if (start_url == -1) {
        //alert($.cookie('safety_txt')+"&"+$.cookie('safety_txt2'));
        var chap_txt = $("#scrollmask span#chapter").html();
        var chap_num = (parseInt($.cookie('chap')));
        $.cookie('chap_name', chap_txt, { path: '/' });
    }
    var search_url = location.href.indexOf("search.html");
    if (search_url == -1) {
        init();
        page_url = location.href.split("#");

        /*20180920
        if (page_url[1] == undefined) {
            window.history.replaceState(null, "", page_url[0] + "#0");
        }
        */
    }

    $("#wrapper").css("height", $(document).height() - 93);
    $("#root").css("height", $(document).height());
    //가로, 세로 전환 시 효과
    //적용 1. jquery-1.8.2_bv.js 내 // 가로, 세로 페이지 기억을 위한 쿠키 생성 (핸드북용) 주석부분
    //적용 2. $("#touchSlider6").touchSlider({ counter내  가로, 세로 페이지 기억을 위한 쿠키 생성
    $(window).on("orientationchange", function() {
        //alert($(document).height());
        setTimeout(function() {
            $("#root").css("height", $(window).height());
        }, 300);
    });




    function init() {
        setTimeout(function() {
            if (h1_app == "app_link") {
                //초기 엘리먼트 생성
                if ($("#root > div[class*='Heading2']").size() > 1) { //Heading2가 1개 이상이고, settings와 같이 페이지 분리 된 것 아닌 경우에만 목차 생성 /0번째 리스트는 안보이게되있어서 포함시켜줘야함
                    $("#root > div[class*='Heading2']:eq(0)>.swipe_inner_wrap").append("<div id='h2_contents'><div id='h2_contents_l'></div></div>");
                }

                //==> H1 첫페이지 하위 목차 표현/////////////////////////////////////////////////////////////////////////////
                var full_tag = "";
                $("#root > div[class*=Heading2]").each(function(j) {
                    //특정 3개 이외 챕터인 경우	
                    //20180920
                    var h2_id = $(this).find('h2:eq(0)').attr('id');

                    //full_tag = full_tag + ('<dl><dt><a href="' + j + '" class="btn_page">' + $(this).find('h2:eq(0)').text() + '</a>');
                    full_tag = full_tag + ('<dl><dt><a href="' + h2_id + '" class="btn_page">' + $(this).find('h2:eq(0)').text() + '</a>');
                    full_tag = full_tag + "</dt></dl>";
                });
                $("#h2_contents_l").html(full_tag); //태그 추가

                //그중 맨 위 리스트 항목 삭제(현재페이지)
                $("#h2_contents_l dl:eq(0)").css("display", "none");

                $("dl dt").children("dl").each(function() {
                    $(this).css("display", "none");
                });

                //첫페이지 목차 갯수에 따라 보여줄 것인지, 숨길 것인지 판단.. 1개 이하이면 숨기기
                if ($("#h2_contents_l").children("dl").size() < 2) {
                    $("#h2_contents").css("display", "none");
                }
                //<== H1 첫페이지 하위 목차 표현/////////////////////////////////////////////////////////////////////////////

                //h1내 하위목차 링크 이동
                $("#h2_contents_l a").live("click", function(e) {
                    var i = $(this).attr("href");
                    var url = location.href.split("#");
                    var i_split = i.split("#");
                    //var i_num = parseInt(i_split[0]);
                    //console.log("목차인덱스:" + i_num);
                    //2180920
                    var i_id = i_split[0];

                    /*
                    var chapterObj = chapterId.find((item, idx) => {
                        return item.chapter_id === i_id;
                    });*/
                    var chapterObj = chapterId.filter(function(item) {
                        return item.chapter_id == i_id
                    });
                    var i_num = parseInt(chapterObj[0].h2_no);

                    window.history.pushState(null, "", url[0] + "#" + i_id)

                    $("#root").get(0).go_page(i_num);
                    return false;
                });
            }
        }, parseInt(time_set));
        /* h2 목차 추가 */


        page_url = location.href.split("#");

        if (page_url[1] != undefined) {
            //20180920

            /* ie X
                        var chapterObj = chapterId.find((item, idx) => {
                            return item.chapter_id === page_url[1];
                        });
            */
            var chapterObj = chapterId.filter(function(item) {
                return item.chapter_id == page_url[1]
            });


            var go_h2 = parseInt(chapterObj[0].h2_no);

            //var go_h2 = parseInt(page_url[1]); // html#0 상호참조가 H2 일 때, 해당 스와이프 페이지로 이동
        } else {
            var go_h2 = null;
        }
        if (page_url[2] != undefined) {
            //20180921
            var objDepth = $("#root > div[class*='Heading2']:eq(" + go_h2 + ") > .swipe_inner_wrap > .heading1 > .heading3");
            var go_h3 = "";
            $(objDepth).each(function(i) {
                console.log($(this));
                if ($(this).attr('id') == page_url[2]) {
                    go_h3 = parseInt(objDepth.index(this));
                }
            });

            //var go_h3 = parseInt(page_url[2]); // html#0#0 상호참조가 H3 일 때, 해당 H3 까지 스크롤 이동
        } else {
            var go_h3 = null;
        }

        if (go_h2 != null) {
            //console.log("링크정보가 있음, go_h2:" + go_h2 + ", go_h3:" + go_h3);
            setTimeout(function() {
                $("#root").get(0).go_page(go_h2);
            }, 30);

            setTimeout(function() {
                $("#wrapper").css("visibility", "visible");
                $("#root").fadeTo("fast", 0.3).fadeTo("fast", 1);
                //$("#count").fadeTo("fast",0.1).fadeTo("fast",1);
            }, time_set);

            if (go_h3 != null) {
                setTimeout(function() {
                    $("#root > div[class*='Heading2']:eq(" + go_h2 + ")").animate({ scrollTop: $("#root > div[class*='Heading2']:eq(" + go_h2 + ") > .swipe_inner_wrap > .heading1 > h3[class*='heading3']:eq(" + go_h3 + ")").offset().top - 165 }, 400);
                }, time_set + 200);

            }
        } else {
            setTimeout(function() {
                $("#wrapper").css("visibility", "visible");
                $("#root").fadeTo("fast", 0.3).fadeTo("fast", 1);
                //$("#count").fadeTo("fast",0.1).fadeTo("fast",1);
            }, time_set);
        }

        $(".C_CrossReference").live("click", function() {
            if (location.href.indexOf($(this).children("a").attr("href")) != -1) {
                $("#root > div[class*='Heading2']:eq(" + go_h2 + ")").animate({ scrollTop: 0 }, 0);
                setTimeout(function() {
                    //$("#count").fadeTo("fast",0.1).fadeTo("fast",1);
                    var h2_top = $("#root > div[class*='Heading2']:eq(" + go_h2 + ") > .swipe_inner_wrap > h2[class*='Heading2']").offset().top;
                    if (h2_top > 200) {
                        $("#root > div[class*='Heading2']:eq(" + go_h2 + ")").animate({ scrollTop: h2_top - 165 }, 400);
                    }
                }, time_set);
                return false;
            } else {
                if ($(this).children("a").attr("href").indexOf("#") != -1) {
                    $.cookie('cross', "h2", { path: '/' });
                } else {
                    $.cookie('cross', "h1", { path: '/' });
                }
            }
        });

        if (!$("#wrapper").attr("data-prev")) {
            btn_display = "none";
        } else {
            btn_display = "block";
        }
        if (!$("#wrapper").attr("data-next")) {
            btn_display2 = "none";
        } else {
            btn_display2 = "block";
        }

        // 좌우 페이지 이동 버튼
        setTimeout(function lt_rt() {
            $(".btn_prev2").css({
                'display': btn_display
            });
            $(".btn_next2").css({
                'display': btn_display2
            });

            setTimeout(function lt_rt_hide() {
                $(".btn_prev2").animate({ left: '-60px' });
                $(".btn_next2").animate({ right: '-60px' });
            }, 700);
        });

        setTimeout(function() {
            //1. 이전페이지 load
            $("body").append("<div id='prev_page'></div>");
            $("#prev_page").css("display", "none");
            var prev_page = $("#wrapper").attr("data-prev");
            if (prev_page != undefined) {
                $("#prev_page").load(prev_page + " #root");

            }
            //1. 다음페이지 load
            $("body").append("<div id='next_page'></div>");
            $("#next_page").css("display", "none");
            var next_page = $("#wrapper").attr("data-next");
            if (next_page != undefined) {
                $("#next_page").load(next_page + " #root");
            } else {
                //$("#root").children(".Heading2").append("<footer><div class='footer_wrap'><div class='footer_img'></div><p><span class='line1'></span> <span class='line2'></span></p></div></footer>");
            }
        }, parseInt(time_set) + 100);

    };

    if ($.cookie('cross') != null) {
        page_url = location.href.split("#");
        if (page_url[2] == undefined) {
            var go_h2 = go_tag = "";
            if ($.cookie('cross') == "h1") {
                go_h2 = 0;
                go_tag = "h1";
            } else {
                //20180920
                /*
                var chapterObj = chapterId.find((item, idx) => {
                    return item.chapter_id === page_url[1];
                });*/
                var chapterObj = chapterId.filter(function(item) {
                    return item.chapter_id == page_url[1]
                });
                go_h2 = parseInt(chapterObj[0].h2_no);

                //go_h2 = parseInt(page_url[1]); // html#0 상호참조가 H2 일 때, 해당 스와이프 페이지로 이동
                go_tag = "h2";
            }
            setTimeout(function() {
                //$("#count").fadeTo("fast",0.1).fadeTo("fast",1);
                $("#root > div[class*='Heading2']:eq(" + go_h2 + ")").animate({ scrollTop: 0 }, 0);
                var h2_top = $("#root > div[class*='Heading2']:eq(" + go_h2 + ") > .swipe_inner_wrap > " + go_tag).offset().top;
                if (h2_top > 200) {
                    $("#root > div[class*='Heading2']:eq(" + go_h2 + ")").animate({ scrollTop: h2_top - 165 }, 400);
                }
            }, time_set + 500);
        }
        $.cookie('cross', null, { path: '/' });
    }



    // Symbol Icon add
    $(".Description-Symbol-Warning, .Description-Symbol-Warning-2line").prepend("<img class='symbol_icon' src='contents/images/M-warning.png' alt='' />");
    $(".Description-Symbol-Caution").prepend("<img class='symbol_icon' src='contents/images/M-caution.png' alt='' />");
    $(".Description-Symbol-Note").prepend("<img class='symbol_icon' src='contents/images/M-note.png' alt='' />");


    //=========================================================================== 슬라이드 기능 시작 ==============================================================================================//
    function swipe_slider() {
        $("#root").swipe_slider({
            roll: false,
            page: 1,
            flexible: true,
            btn_prev: $(".btn_prev2"),
            btn_next: $(".btn_next2"),
            initComplete: function(e) {

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
                //초기 불러들일 페이지의 갯수
                //insert_data(1);
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
            },
            counter: function(e) {
                    var footerH = $("footer").height();
                    var topH = $("#top").outerHeight(true);
                    var scrollNavH = $("#scroll_nav").height();
                    var selectWrap = $(".select_wrap").outerHeight(true);
                    $("#root > div[class*='Heading2']").css("height", $(document).height() - topH - scrollNavH - selectWrap);
                    $("#count").addClass("type_a");
                    //실제 동작
                    //				if(e.total>7){
                    //						$("#count").attr("class","type_b");
                    //				}
                    //check_safty_information
                    if ($("#info_check").html() == "True") {
                        //safty_information인경우 동작하지 않음. safty_information로직 동작
                        $("#count").before("<div id='count2' ></div>");
                        $("#count2").html(e.current + "/" + e.total);
                        $("#count2").css("display", "none");
                    } else {
                        //count 표현 <========================================================================
                        //UM에서는 1/1 카운트로 처음과 끝 구분
                        $("#count").html("");
                        $("#count .btn_page").removeClass("on");

                        //count 갯수만큼 생성
                        $("#wrapper > #root > div[class*='Heading2']").each(function(i) {
                            $(".btn_area #count").append('<a class="btn_page">    </a>');
                        });

                        //카운터 숫자로 표현
                        if ($("#count").prev().attr("id") !== "count2") {
                            $("#count").before("<div id='count2' ></div>");
                        }
                        $("#count2").html(e.current + "/" + e.total);
                        $("#count2").css("display", "none");

                        //count 표현 <========================================================================
                    }

                } //:counter 닫힘 태그		
        });
    }
    //=========================================================================== 슬라이드 기능 끝 ==============================================================================================//
    setTimeout(function() {
        swipe_slider();
    }, 0);


    change_contents();
    language_text_index();
    responsive();

    //검색 결과 닫기 버튼 클릭
    $(".search_close_btn").live("click", function() {
        $("#id_results2").fadeOut(600);
    });

    $(window).hashchange(function() {
        ref_url2 = location.href.split('#');

        if (ref_url2[1] != undefined) {
            //20180920
            /*
                var chapterObj = chapterId.find((item, idx) => {
                    return item.chapter_id === ref_url2[1];
                });*/
            var chapterObj = chapterId.filter(function(item) {
                return item.chapter_id == ref_url2[1]
            });
            var go_h2 = parseInt(chapterObj[0].h2_no);

            //var go_h2 = parseInt(ref_url2[1]);
        } else {
            var go_h2 = 0;
        }

        if (ref_url2[2] != undefined) {
            //20180921
            var objDepth = $("#root > div[class*='Heading2']:eq(" + go_h2 + ") > .swipe_inner_wrap > .heading1 > .heading3");
            var go_h3 = "";
            $(objDepth).each(function(i) {
                console.log($(this));
                if ($(this).attr('id') == ref_url2[2]) {
                    go_h3 = parseInt(objDepth.index(this));
                }
            });


            //var go_h3 = parseInt(ref_url2[2]);
        } else {
            var go_h3 = null;
        }
        //h2_num = $("#count2").text().split("/");
        //alert(ref_url2[1]+"==="+h2_num[0]); 

        var search_url = location.href.indexOf("search/search.html");
        if (search_url == -1) {
            if (ref_url2[2] != undefined) {
                $("#root").get(0).go_page(parseInt(go_h2));
                $("#root > div[class*='Heading2']:eq(" + go_h2 + ")").animate({ scrollTop: 0 }, 0);
                setTimeout(function() {
                    h3_top = $("#root > div[class*='Heading2']:eq(" + go_h2 + ") > .swipe_inner_wrap > .heading1 > h3[class*='heading3']:eq(" + go_h3 + ")").offset().top - 165;
                    $("#root > div[class*='Heading2']:eq(" + go_h2 + ")").animate({ scrollTop: h3_top }, 400);
                }, 200);
            } else {
                setTimeout(function() {
                    $("#root").get(0).go_page(go_h2);
                }, 30);

                $("#root > div[class*='Heading2']:eq(" + go_h2 + ")").animate({ scrollTop: 0 }, 0);
            }
        }

    });


    // window resize
    $(window).resize(function() {
        responsive();
    });

});
//=========================================================================== dom ready 끝 ==============================================================================================//

function responsive() {
    if (window.innerWidth <= 800) {
        // (1) Table_Text 3단 테이블 셀 안에 이미지 있는 경우 모바일일 때 셀 병합 및 이미지 이동
        cell_tmp = $(".Table_Text tr td .Description img[src*='contents/images/E-usb_cable.png']").closest("td").clone().html();
        $(".Table_Text tr td .Description img[src*='contents/images/E-usb_cable.png']").closest("td").prev().attr("colspan", 2).addClass("cell-hap").append(cell_tmp).closest("td").next().remove();
    } else {
        // (1)
        var cloneImg = $(".Table_Text tr td.cell-hap .Description img").closest(".Description").clone().html();
        //console.log(aaa);

        if (cloneImg !== null) {
            $(".Table_Text tr td.cell-hap .Description img").closest(".Description").remove();
            $(".Table_Text tr td.cell-hap").removeAttr("colspan");
            $(".Table_Text tr td.cell-hap").next(".cell-img").remove();
            $(".Table_Text tr td.cell-hap").after('<td class="cell-img"><div class="Description">' + cloneImg + '</div></td>');
        }
    }
}

function language_text_index() {
    setTimeout(function() {
        if (message[language].title != undefined) {
            $("#userManual").html(message[language].title);
        }
		document.title = message[language].html_title;		
        $("#id_search").attr("placeholder", message[language].keyword);
        $("#id_main_search").attr("placeholder", message[language].keyword);
        $("#keyword_text").text(message[language].recent_key);
        noresult = message[language].reslut;
    }, 100);
}

function change_contents() {
    // 상호참조 필요없는 텍스트 삭제 "p." - 다국어에서 p. 가 다른 문자로 들어가는지 확인 필요
    $(".C_CrossReference").each(function() {
        if ($(this).attr("id") == undefined) {
            trim($(this).children("a").text()) == "p." ? $(this).children("a").text("") : true;
        } else {
            delete_text = $(this).children("a").text();
            delete_text = delete_text.replace("p.", "");
            $(this).children("a").text(delete_text);
        }
    });

    // 보류
    /*$(".C_CrossReference-Symbol").each(function(){
    	if( $(this).next(".C_CrossReference").size() == 0) {
    		$(this).remove();
    	}
    });*/

    $("div[class^=OrderList]").each(function() {
        div_id = $(this).attr("class");
        if (div_id.indexOf('-Child') == -1) {
            num = $(this).children("ol").attr("start");
            //alert(num);
            if ($(this).children("ol").size() > 1) {
                ol_html = "";
                i = 0;
                for (i = 0; i < $(this).children("ol").size(); i++) {
                    txt = $(this).children("ol:eq(" + i + ")").children("li").html();
                    num2 = parseInt(num) + i;
                    if (div_id.indexOf("OrderList-Red") != -1 || div_id.indexOf("OrderList-White") != -1) {
                        ol_html += "<div class='circle_wrap'><div class='circle'>" + num2 + "</div></div>" + txt;
                    } else {
                        ol_html += "<span class='num'>" + num2 + "</span><ul><li>" + txt + "</li></ul>";
                    }
                }
                $(this).html(ol_html);
                //console.log("a"+ol_html);
            } else {
                txt = $(this).children("ol").children("li").html();
                //console.log("b"+txt);
                if (txt == null) {
                    $(this).html(num + ".");
                } else {
                    if (div_id.indexOf("OrderList-Red") != -1 || div_id.indexOf("OrderList-White") != -1) {
                        $(this).html("<div class='circle_wrap'><div class='circle'>" + num + "</div></div>" + txt);
                    } else {
                        $(this).html("<span class='num'>" + num + "</span><ul><li>" + txt + "</li></ul>");
                    }
                }
            }
        } else {
            ol_li_txt = $(this).children("ol").children("li").html();
        }
    });


    $("div[class^=OrderList-Color] > .num").each(function() {
        $(this).before("<div class='br_span'></div>");
        $(this).css("font-family", "MobisSymbolENG");
        var CircleNumber = "";
        CircleNumber = $(this).text();
        if (CircleNumber.length > 1) {
            for (j = 0; j <= CircleNumber - 10; j++) {
                $(this).html(String.fromCharCode(parseInt(CircleNumber.charCodeAt(0) + j + 57)));
            }
        } else {
            $(this).html(String.fromCharCode(parseInt(CircleNumber.charCodeAt(0) + 48)));
        }
    });


    $("div[class^=OrderList2_1] > .num").each(function() {
        $(this).before("<div class='br_span'></div>");
    });


    /*$(".Table_Text_Wide").each(function(i){
    	var txt_html = "";
    	$(this).css("visibility","hidden");
    	
    	$(this).after("<ul id='trouble_txt"+i+"' class='acc'></ul>");
    	var tit = new Array();
    	var col_tot = $(this).find("tbody > tr:eq(0) > td ").length;
    	$(this).find("tbody > tr").each(function(j){
    		var rowspan = 1;
    		$(this).find("td").each(function(i){
    			if($(this).parents("table").attr("class")=="Table_Text_Wide"){
    				if(j==0){
    					tit[i] = $(this).find("div > span").text();
    				}else{
    					var rows = $(this).parent("tr").children("td:eq(0)").attr("rowspan");
    					var col_num = $(this).parent("tr").children("td").length;
    					if($(this).html().indexOf("<span></span>")==-1){
    						if(col_tot == col_num){
    							if(j==1 && i == 0){
    								txt_html = txt_html + "<li>";
    							}
    							if(i==0){
    								txt_html = txt_html + "</li><li><h3 class='tit1'>"+tit[i]+":"+ $(this).html()+"</h3>";
    							}else{
    								if(i == 1){
    									txt_html = txt_html + "<div class='acc-section'><div class='acc-content'>";
    									rowspan = rowspan +1;
    								}	
    								if(tit[i]!=undefined){
    									txt_html = txt_html + "<div><b>"+tit[i]+"</b>:"+ $(this).html()+"</div>";
    								}else{
    									txt_html = txt_html + "<div>"+ $(this).html()+"</div>";
    								}
    							}
    						}else{
    							if(tit[i+1]!=undefined){
    								var td_row = $(this).parent("tr").prev("tr").children("td:eq(1)").attr("rowspan");
    								if(td_row==undefined){
    									txt_html = txt_html + "<div><b>"+tit[i+1]+"</b>:"+ $(this).html()+"</div>";
    								}else{
    									txt_html = txt_html + "<div>"+ $(this).html()+"</div>";
    								}
    							}else{
    								if(tit[i-1]!=undefined){
    									txt_html = txt_html + "<div><b>"+tit[i-1]+"</b>:"+ $(this).html()+"</div>";
    								}else{
    									txt_html = txt_html + "<div>"+ $(this).html()+"</div>";
    								}
    							}
    							if(rowspan == parseInt(rows)){
    									txt_html = txt_html + "</div>";
    							}
    						}
    					}else{
    						txt_html = txt_html + "<div class='acc-section'><div class='acc-content'>";
    					}
    				}
    			}
    		});
    	});
    	
    	$("#trouble_txt"+i).html(txt_html).promise().done(function() {
    		$(".Table_Text_Wide").css("display","none");
    //		$(".acc h3").click(function(){
    //			$(".acc-section").css("display","none");
    //			$(this).next(".acc-section").css("display","block");
    //		});
    	});
    });*/
    $("div[class*='Description-Symbol-Warning-2line']").each(function() {
        var txt = $(this).text();
        var img = $(this).children("img").prop('outerHTML');
        $(this).html("<table class='Table_2line'><tr><td>" + img + "</td><td><p class='txt_2line'>" + txt + "</p></td></tr></talbe>");
    });


    $(".Table_Text").each(function() {
        $(this).find("tr").eq(0).children("td").children("div").children("span").children(".C_Important").addClass("cell_heading");
        $(".cell_heading").parents("td").css({ "margin": 0, "padding": "5px 10px", "background": "#002c5f", "color": "#fff", "text-align": "center", "border-bottom": 0, "border-top": 0, "border-right": "2px solid #fff" });
    });


    $(".Table_Text tr").each(function() {
        $(this).children("td").eq(0).text() == "" ? $(this).closest("tr").prev().children("td").css({ "border-bottom": 0, "padding-bottom": "0px" }) : true;
        $(this).children("td").eq(0).text() == "" ? $(this).children("td").next("td").css("padding-top", "0px") : true;
    });


    $(".Table_VR").each(function(i) {
        var p = q = 0;
        var td_line = new Array();
        for (var t = 0; t < 6; t++) {
            $(this).find("tr").each(function(j) {
                if ($(this).children("td").length > 1 && $(this).children("td").attr("rowspan") != undefined) {
                    if ($(this).children("td").index() == 1) {
                        p = p + 1;
                        td_line[p] = $(this).index();
                        q = p - 1;
                        temp1 = $(this).parents("tbody").children("tr:eq(" + td_line[q] + ")").children("td").html();
                        temp2 = $(this).parents("tbody").children("tr:eq(" + td_line[p] + ")").children("td").html();
                        if (temp1 != null) {
                            if (temp1 == temp2) {
                                var row = parseInt($(this).parents("tbody").children("tr:eq(" + td_line[q] + ")").children("td").attr("rowspan")) + parseInt($(this).parents("tbody").children("tr:eq(" + td_line[p] + ")").children("td").attr("rowspan"));
                                $(this).parents("tbody").children("tr:eq(" + td_line[q] + ")").children("td:eq(0)").attr("rowspan", row);
                                $(this).parents("tbody").children("tr:eq(" + td_line[p] + ")").children("td:eq(0)").remove();
                            }
                        }
                    }
                }
            });
        }
    });


    $("div[class*='Heading1']").each(function() {
        if ($(this).children("span").text() == "") {
            $(this).remove();
        }
    });
    /*$("span").each(function(){
    	if($(this).text()==""){
    		$(this).remove();
    	}
    });*/

    //$("table > tbody > tr > td > ul").siblings("span").css({"margin-left":"18px","display":"block"});


    //	$(".C_Symbol-Color").each(function(){
    //		//var img_path = $(this).attr("src").replace("contents/images/","contents/images/number_icon/");
    //		//$(this).attr("src", img_path);
    //		
    //		var CircleNumber = "";
    //		if($(this).text().length>1){
    //			var s = $(this).text();
    //			var num_html = "";
    //			for (var i = 0 ; i < s.length; i++){
    //				CircleNumber = s.charAt(i);
    //				num_html = num_html+ "<img src='contents/images/number_icon/CircleNumber" + String.fromCharCode(parseInt(CircleNumber.charCodeAt(0)-48)) + ".png' /> ";
    //			}
    //			$(this).html(num_html);
    //		}else{
    //			CircleNumber = $(this).text();
    //			$(this).html("<img src='contents/images/number_icon/CircleNumber" + String.fromCharCode(parseInt(CircleNumber.charCodeAt(0)-48)) + ".png' />");			
    //		}
    //	});




    //$(".C_Symbol:contains('/')").html("▶");
    $(".C_Symbol:contains('/')").html(">");
    //$(".C_Symbol:contains('^')").html("▼");
    //$(".C_CrossReference-Symbol:contains('/')").html("▶");
    $(".C_CrossReference-Symbol:contains('/')").html(">");
    $(".C_SingleStep:contains('▶')").html("&nbsp;<img src='contents/images/I_next.png'>");

    // 014_appendix - Heading4 텍스트 앞에 기호 추가하기
    if (location.href.indexOf("_appendix") !== -1) {
        $(".Heading4").each(function() {
            //console.log($(this).children("span").eq(0).text());
            $(this).children("span").eq(0).prepend("<span class='C_Symbol'># </span>");
        });
    }

    $("#Table_Button").each(function() {
        var td_leng = parseInt($(this).find("tbody > tr > td").length);
        var tr_leng = parseInt($(this).find("tbody > tr ").length);
        var leng = Math.ceil(td_leng / tr_leng);
        var leng_html = "";
        leng_html = "<colgroup>";
        for (i = 0; i < leng; i++) {
            leng_html += "<col class='c" + leng + "-col" + parseInt(i + 1) + "' />";
        }
        leng_html += "</colgroup>";
        if (leng == 2) {
            $(this).find("td:nth-child(2)").css("background-color", "#f9f9f9");
        }
        $("tbody").before(leng_html);
    });

    $(".Table_Symbol-Indent span > span.br_span").each(function() {
        if ($(this).parents("div").html().indexOf('src="contents/images/M-') != -1) {
            $(this).parent("span").css("margin-bottom", "0px");
        }
    });

    $("div[class^=Description-Symbol]").each(function() {
        if ($(this).html().indexOf("span") == -1) {
            $(this).append('<span class="br_span"><br/></span>');
        }
    });




    ////////////////////////////////이미지 확대 아이콘 추가////////////////////////////////////////////////
    $("div.magnifier").each(function() {
        var img_id = $(this).attr('src');
        //alert(img_id);
        // $(this).append("<div id='bvv'><img src='contents/images/template/image_size_icon2.png' rel='" + img_id + "' /></div>");

        $('body').find('img').each(function() {
            var this_img = $(this).attr("src");
            var strArray = this_img.split('/'); //strArray[1] : 이미지 이름	
            strArray.reverse();
            try {
                for (var i = 0, iLen = alt_img[language].length; i < iLen; i++) {
                    if (strArray[0] == alt_img[language][i].name) {
                        $(this).attr("alt", alt_img[language][i].alt);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });

    });
    ////////////////////////////////이미지 확대 아이콘 추가 끝////////////////////////////////////////////////

    // 이미지 확대 버튼=========================================================

    //콜아웃 확대 대상 이미지 클릭 시, 레이어 창 보여주기
    // .magnifier
    $("#bvv").live("click", function() {
        $('.popup_img').css("display", "block");
        if ($(this).attr("src") !== "contents/images/template/image_size_icon2.png" && $(this).attr("src") !== "contents/images/template/image_size_icon2.png") {
            $(".popup_img .image_area").html($(this).parents('.magnifier').clone());
        } else {
            if ($(this).parent().prev().children("img").attr("src") != undefined) {
                $(".popup_img .image_area").html($(this).parent().prev().children("img").clone());
            } else {
                var img_name = "<img src='" + $(this).attr("rel") + "'>";
                $(".popup_img .image_area").html(img_name);
            }
        }

        if ($.cookie('img_size_cookie') != null) {
            $("#zoom_sd").val($.cookie('img_size_cookie'));
            img_size_change($.cookie('img_size_cookie'));
        } else {
            img_size_change('100');
            $.cookie('img_size_cookie', null);
        }
    });
    //콜아웃 확대 대상 이미지 닫기 아이콘 클릭 시, 레이어 창 감추기
    $(".popup_img .pop_close").click(function() {
        $('.popup_img').css("display", "none");
        $.cookie('img_size_cookie', null);
        $("#zoom_sd").val('100');
        img_size_change('100');
    });

    $(".zoom_icon1").live("click", function() {
        if ($.cookie('img_size_cookie') == null) {
            var plus_size = "100";
        } else {
            if (parseInt($.cookie('img_size_cookie')) < 110) {
                var plus_size = "100";
            } else {
                var plus_size = parseInt($.cookie('img_size_cookie')) - 10;
            }
        }
        $("#zoom_sd").val(plus_size);
        img_size_change(plus_size);
    });

    $(".zoom_icon2").live("click", function() {
        if ($.cookie('img_size_cookie') == null) {
            var plus_size = "110";
        } else {
            if (parseInt($.cookie('img_size_cookie')) < 190) {
                var plus_size = parseInt($.cookie('img_size_cookie')) + 10;
            } else {
                var plus_size = "200";
            }
        }
        $("#zoom_sd").val(plus_size);
        img_size_change(plus_size);
    });



    // 메인버튼 메뉴들 마진값 주기
    var sect = $('.sect');
    var topH = $('#top').height();
    var chapH = $('.chap').height();
    sect.wrap('<div id="wrapperToc"></div>');

    //쿠키값에 따라 이미지 확대 비율 로딩
    if ($.cookie('img_size_cookie') != null) {
        $("#zoom_sd").val($.cookie('img_size_cookie'));
        img_size_change($.cookie('img_size_cookie'));
    }

    $('.magnifier').each(function() {
        var magnifierImg = $(this).children('img');
        var magnifierImgW = magnifierImg.width();
        console.log(magnifierImgW);
        magnifierImg.siblings('#bvv').width(magnifierImgW + '%');
    })


}

/////////////////////이미지팝업////////////////////////////////
function img_size_change(value) {
    //값 저장을 위한 쿠키 생성
    $.cookie('img_size_cookie', value);
    $(".popup_img .image_area img").css("width", value + "%");
};
/////////////////////////////////이미지 팝업 끝///////////////////////////