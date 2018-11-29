/**
 * Copyright 2015. (Hansem EUG or 한샘 EUG) All codes cannot be copied without permission.
 * 용량 최적화를 위해 압축되어 있는 상태입니다.
 * 수정이 필요한 경우, Hansem EUG 에 통보 바랍니다. 
 * System Development Team.  beaver@ezuserguide.com
 **/

$.extend($.expr[":"], {
    "containsNoCase": function(elem, i, match, array) {
        match_txt = match[3].replace(/(\s*)/g, "");
        match_txt2 = new RegExp(match_txt, 'gi');
        return (elem.textContent || elem.innerText || "").replace(/(\s*)/g, "").match(match_txt2) != null;
    }
});

$(document).ready(function() {
    $("#id_search").blur();
    var search_len = search.length; //검색 DB 길이
    var search_tag = ""; //DB -> HTML 태그 코드 영역
    var user_keyword = ""; //입력 값 원본
    var user_keyword_lowcase = ""; //입력 값 소문자로 변경
    var search_result = ""; //최종 결과값 : 챕터기준구분
    //key features
    if (typeof(search2) != 'undefined') {
        var search_len2 = search2.length; //검색 DB 길이
        var search_tag2 = ""; //DB -> HTML 태그 코드 영역
        var user_keyword2 = ""; //입력 값 원본
        var user_keyword_lowcase2 = ""; //입력 값 소문자로 변경
        var search_result2 = ""; //최종 결과값 : 챕터기준구분
    }

    //UI text
    var language = $("html").attr("data-language"); //페이지 언어값 추출
    var recent_key = message[language].recent_key;
    var result_more = message[language].search_more;
    var result_hidden = message[language].search_less;
    var no_result_found = message[language].result;
    var switch_toc = message[language].switch_toc;
    var switch_gen = message[language].switch_gen;
    var result_toc = message[language].result_toc;
    var result_gen = message[language].result_gen;
    var input_keyword = message[language].keyword;
    var search_short = message[language].search_short;
    var search_close = message[language].close;
    var find_err = message[language].find_err;

    $("#id_search").attr("placeholder", input_keyword); //placeholder

    $("#no_results").css("height", $(window).height() - 390);
    if ($(window).width() <= 640) {
        $("#no_results").css("height", $(window).height() - 390);
    }

    $(window).resize(function() {
        $("#no_results").css("height", $(window).height() - 390);
        if ($(window).width() <= 640) {
            $("#no_results").css("height", $(window).height() - 390);
        }
    });

    $("#recent_keywords").html($.cookie('keyword_history')); //쿠키에 저장 된 최근 검색어 값 설정
    //console.log($.cookie('keyword_history'));
    //기본적으로 보여줄 switch 레이어 설정
    if ($.cookie('switch_search') !== null) {
        if ($.cookie('switch_search') == "sw1") {
            $("#id_results2").css("display", "none");
            $("#id_results").css("display", "block");
            $("#no_results").css("display", "block");
            $("#sw1").addClass("switch");
        } else {
            $("#id_results2").css("display", "block");
            $("#id_results").css("display", "none");
            $("#no_results").css("display", "none");
            $("#sw2").addClass("switch");
        };
    } else { //스위치 선택 쿠키값이 없으면 기본적으로 챕터기준 검색결과 보여줌
        //$("#id_results2").css("display","none"); $("#id_results2").css("display","block");
        $("#sw1").addClass("switch");
    }

    function init() { //검색 새롭게 할 경우 초기 실행 할 것.
        //1. 검색DB -> #id_json_results 으로 변환
        search_tag = ""; //태그 초기화
        //search_tag2 = ""; //태그 초기화
        last_chap = parseInt(search[search_len - 1].chapter_i) + 1;

        //key features
        //		for (var i=0; i < search_len2; i++) {			
        //			search_tag2 += "<div id='root'>";
        //			search_tag2 += "<div id='topic_chapter'>" + search2[i].chapter + "</div>";
        //			search_tag2 += "<div id='topic_h1'>" + search2[i].title + "</div>";
        //			if(search2[i].title2!="" || search2[i].title2!=null){
        //				search_tag2 += "<div id='topic_h2'>" + search2[i].title2 + "</div>";
        //			}
        //			search_tag2 += "<div id='topic_body'>" + search2[i].body + "</div>";
        //			search_tag2 += "</div>";
        //			search_tag2 += "<div id='root2'>";
        //			search_tag2 += "<div id='where_chap'>" + last_chap + "</div>";
        //			search_tag2 += "<div id='topic_link'>" + search2[i].toc_id + "</div>";
        //			search_tag2 += "</div>";
        //		}
        //search_tag2 = search_tag2.toLowerCase(); //검색을 위한 소문자 변경
        //		search_tag2 = search_tag2.replace(/”/g, '"'); 
        //		//괄호(parenthesis) 처리를 위한 치환
        //		search_tag2 = search_tag2.replace(/\(/g, '꺆');
        //		search_tag2 = search_tag2.replace(/\)/g, '냒');
        //		search_tag2 = search_tag2.replace(/\+/g, '땪');
        //		search_tag2 = search_tag2.replace(/\\/g, '먂');
        //		search_tag2 = search_tag2.replace(/\&/g, '뺚');
        //		search_tag2 = search_tag2.replace(/\[/g, '샦');
        //		search_tag2 = search_tag2.replace(/\]/g, '앾');
        //		search_tag2 = search_tag2.replace(/\?/g, '쟊');
        //		search_tag2 = search_tag2.replace(/\*/g, '챢');
        //		search_tag2 = search_tag2.replace(/\./g, '캮');
        //		search_tag2 = search_tag2.replace(/\İ/g, '햒');
        //		search_tag2 = search_tag2.replace(/\뺚apos;/g, '&apos;');
        //
        //		$("#id_json_results").html(search_tag2); //#id_json_results로 삽입

        for (var i = 0; i < search_len; i++) {
            search_tag += "<div id='root'>";
            search_tag += "<div id='topic_chapter'>" + search[i].chapter + "</div>";
            search_tag += "<div id='topic_h1'>" + search[i].title + "</div>";
            if (search[i].title2 != "" || search[i].title2 != null) {
                search_tag += "<div id='topic_h2'>" + search[i].title2 + "</div>";
            }
            search_tag += "<div id='topic_body'>" + search[i].body + "</div>";
            search_tag += "</div>";
            search_tag += "<div id='root2'>";
            search_tag += "<div id='where_chap'>" + search[i].chapter_i + "</div>";
            search_tag += "<div id='topic_link'>" + search[i].toc_id + "</div>";
            search_tag += "</div>";
        }

        //search_tag = search_tag.toLowerCase(); //검색을 위한 소문자 변경
        search_tag = search_tag.replace(/”/g, '"');
        //괄호(parenthesis) 처리를 위한 치환
        search_tag = search_tag.replace(/\(/g, '꺆');
        search_tag = search_tag.replace(/\)/g, '냒');
        search_tag = search_tag.replace(/\+/g, '땪');
        search_tag = search_tag.replace(/\\/g, '먂');
        search_tag = search_tag.replace(/\&/g, '뺚');
        search_tag = search_tag.replace(/\[/g, '샦');
        search_tag = search_tag.replace(/\]/g, '앾');
        search_tag = search_tag.replace(/\?/g, '쟊');
        search_tag = search_tag.replace(/\*/g, '챢');
        search_tag = search_tag.replace(/\./g, '캮');
        search_tag = search_tag.replace(/\İ/g, '햒');
        search_tag = search_tag.replace(/\뺚apos;/g, '&apos;');

        $("#id_json_results").html(search_tag); //#id_json_results로 삽입

        //2. 해당 챕터제목 추출
        //eval("w"+last_chap+ "=" + "$('#id_json_results').find('#where_chap:contains('+last_chap+')').parent().prev().children('#topic_chapter').html()"); 
        //실시간 변수 생성, eval

        for (var key = 1; key < last_chap; key++) {
            eval("w" + key + "=" + "$('#id_json_results').find('#where_chap:contains('+key+')').parent().prev().children('#topic_chapter').html()"); //실시간 변수 생성, eval
        }


        //2-1. 제목 추출 후, 제목 태그는 더이상 필요없으므로 삭제
        $("#root #topic_chapter").remove();

        $("#id_json_results_toc").html("");
        $("#id_json_results_kind").html(""); //최종결과 저장공간 초기화

        //#hash 태그 대문자 변환 프로토타입
        String.prototype.capitalize = function() {
            return this.replace(/#\w+-\w+-\w+-\w+-\w+/g, function($1) {
                return $1.toUpperCase();
            });
        };
    };

    init(); //로딩 후, 초기화실행

    //3-1. 검색 동작, 검색 버튼 클릭
    $("#id_search_button").live("click", function() {
        var search_url = location.href.indexOf("search/search.html");
        if ($("#id_search").val().length == 0 && search_url == -1) {
            location.href = "search/search.html";
        } else if ($("#id_search").val().length < 2) {
            $("#id_search").val("");
            $("#id_search").blur();

            setTimeout(function() {
                $("#id_results2").fadeOut(100);
                $("#no_results").fadeIn(100);
                $("#bookmark_area").fadeIn(100);
                $("#keyword_area").fadeIn(100);
                $("#keyword_img").fadeIn(100);
                csscody.error("<p>" + search_short + "<a ref=''></a></p>");
            }, 50);
            window.history.replaceState(null, "", 'search.html');


            return false;
        } else if ($("#id_search").val().length >= 2) {
            window.history.replaceState(null, "", 'search.html?StrSearch=' + $("#id_search").val());
        }

        $("#id_results").html("");
        $("#id_results2").html(""); //초기화
        init();
        setTimeout(function() {
            search_keyword_toc();
        }, 400);
    });

    //3-2. 검색 동작, 입력 폼에서 엔터
    $("#id_search").keydown(function(event) {
        if (event.keyCode == '13') {
            $("#id_search").blur(); //포커스를 해제하여 모바일 키보드 숨김
            $("#id_search_button").trigger("click"); //검색 동작
        }
    });

    /*검색어를 받아 검색어가 있다면 그 값을 이용하여 fncDoSearch를 호출함*/
    var $_GET = {};
    location.search.replace(/([^=&?]+)=([^&]+)/gi, function(a, b, c) {
        $_GET[decodeURIComponent(b)] = decodeURIComponent(c);
    });
    var mainKeyword = $_GET['StrSearch'];
    var search_pos = $_GET['pos'];
    if (mainKeyword != null) {
        document.getElementById("id_search").value = mainKeyword;
        init();
        $("#id_search_button").trigger("click");
    } else {
        $.cookie("txt_search", null, { path: '/', expires: -1 });
    }

    //**********************************************************************************************************************************************************************************************************//	
    //4. 클릭, 엔터 동작 후 검색 실행
    function search_keyword_toc() {
        var user_keyword = $("#id_search").val(); //입력창 실제 값
        var user_keyword_lowcase = $("#id_search").val().replace(/\İ/g, "햒"); //입력창 검색을 위한 소문자 변환 값
        //괄호 검색을 위한 로직	1	
        user_keyword_lowcase = user_keyword_lowcase.replace(/\(/g, "꺆");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\)/g, "냒");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\+/g, "땪");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\\/g, "먂");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\&/g, "뺚");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\[/g, "샦");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\]/g, "앾");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\?/g, "쟊");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\*/g, "챢");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\./g, "캮");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\n/g, " ");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\r/g, " ");
        user_keyword_lowcase = user_keyword_lowcase.replace(/\s+/g, " "); //오른쪽공백
        user_keyword_lowcase = user_keyword_lowcase.replace(/\s+$/g, " "); //오른쪽공백			

        //var user_keyword_lowcase = $("#id_search").val(); //입력창 검색을 위한 소문자 변환 값
        //검색 단어 치환을 위한 설정
        //var regex = new RegExp(user_keyword_lowcase, 'gi');
        //$("#id_json_results").html($("#id_json_results").html().replace(regex, "<span class='red'> "+user_keyword_lowcase+"</span>")); //옮기기 전 검색 단어에 대한 색상 표기				


        //옵션1. chapter별 구분 로직 시작*****************************************************//
        //4-1. #id_json_results_chapter에 초기 챕터별 방을 생성
        var search_html = "";

        for (var key = 1; key < last_chap; key++) {
            search_html += "<div id='chapter" + key + "'><div id='ch'><span>" + eval("w" + key).replace(/꺆/g, "\(").replace(/냒/g, "\)").replace(/땪/g, "\+").replace(/먂/g, "\\").replace(/뺚/g, "\&").replace(/샦/g, "\[").replace(/앾/g, "\]").replace(/쟊/g, "\?").replace(/챢/g, "\*").replace(/캮/g, "\.").replace(/햒/g, "\İ") + "</span></div></div>"
        }

        $("#id_json_results_chapter").html(search_html);

        //4-2. json으로부터 변환 된 태그값이 들어있는 곳에서 키워드 값 검색
        $("#id_json_results #root").each(function() {

            var init_num = 0;

            $(this).find("#topic_body:containsNoCase('" + user_keyword_lowcase + "')").each(function() {
                //console.log($(this).attr("id") + ", " + $(this).parent().next().children("#where_chapter").text());
                //검색 값이 #where_chapter 몇번째 챕터인지 값 가져와, 해당 방으로 넣어줌. insert_result_chapter 연산처리, 현재 챕터와, 선택값 전달.
                var txt_len = user_keyword_lowcase.length;
                var idx1 = $(this).html().toLowerCase().indexOf(user_keyword_lowcase);
                if ($(this).html().toLowerCase().substring(idx1, idx1 + txt_len) == user_keyword_lowcase) {
                    var substr1 = "..." + $(this).html().substring(idx1, idx1 - 50);
                    var substr2 = $(this).html().substring(idx1, idx1 + 50 + txt_len) + "...";
                    var sum_text = substr1 + substr2;
                } else {
                    //검색문자에 공백이 있을 경우
                    var search_regex = "";
                    var trim_keyword = user_keyword_lowcase.replace(/(\s*)/g, "");
                    for (i = 0; i < trim_keyword.length; i++) {
                        if (i == 0) {
                            search_regex = trim_keyword.substr(0, 1) + "+";
                        } else {
                            search_regex = search_regex + "(\\s)?(" + trim_keyword.substr(i, 1) + "){1}";
                        }
                    }
                    search_regex3 = new RegExp(search_regex, 'i');
                    var search_txt = $(this).html().match(search_regex3);
                    var substr1 = "..." + $(this).html().substring(search_txt.index, search_txt.index - 53);
                    var substr2 = $(this).html().substring(search_txt.index, search_txt.index + 53 + txt_len) + "...";
                    var sum_text = substr1 + substr2;
                }
                if (init_num == 0) {
                    for (var key = 1; key < last_chap; key++) {
                        if (key == $(this).parent().next().children("#where_chap").html()) {
                            if (key == last_chap - 1) {
                                insert_result_chapter(last_chap - 1, $(this), sum_text);
                            } else {
                                insert_result_chapter(key, $(this), sum_text);
                            }
                        }
                    }

                    init_num += 1;
                }
                //console.log("바디에서 검색어 위치: " + $(this).html().indexOf(user_keyword_lowcase));				
            });
        });
        search_result = $("#id_json_results_chapter").html(); //4-3. 모든 가공이 된 결과값을 변수에 대입				
        //search_result = search_result.split(user_keyword_lowcase).join(user_keyword); //4-4. 입력 값대로 검색어 변경		
        $("#id_results").html(search_result); //4-5. 사용자에게 보여 줄 레이어로 결과값 전달.		
        search_result = ""; //4-6. 검색 완료 후 동작, 보이지 않는 변수 내, 저장 공간 초기화
        $("#recent_area").fadeOut(); //4-7. 최근검색어 창 숨기기
        //옵션1. chapter별 구분 로직 끝*****************************************************//

        //옵션2. 종류별 구분 로직 시작*****************************************************//	
        //4-1. #id_json_results_kind에 초기 챕터별 방을 생성
        t_html = "";
        t_html = t_html + "<div id='search_box'><div id='search_kind1'><div id='chapter1'><div id='title'></div></div></div><div id='title_line'></div><div id='search_kind1'><div id='view2'></div></div></div>";

        $("#id_json_results_kind").html(t_html);

        //4-2. json으로부터 변환 된 태그값이 들어있는 곳에서 키워드 값 검색
        $("#id_json_results #root").find("div:containsNoCase('" + user_keyword_lowcase + "')").each(function() {
            //검색 값이 H1에 속해있는 것인지, H2에 속해있는 것인지 구분하여 메소드 실행
            //console.log($(this).attr("id")+"=="+$(this).html());
            switch ($(this).attr("id")) {
                case "topic_h1":
                    insert_result_kind("topic_h1", $(this));
                    break;
                case "topic_h2":
                    insert_result_kind("topic_h2", $(this));
                    break;
                    //case "topic_body": insert_result_kind("topic_body", $(this)); break;		
                default:
                    break;
            }
        });

        search_result2 = $("#id_json_results_kind").html(); //4-3. 모든 가공이 된 결과값을 변수에 대입				
        //search_result2 = search_result2.split(user_keyword_lowcase).join(user_keyword); //4-4. 입력 값대로 검색어 변경		
        $("#id_results2").html(search_result2); //4-5. 사용자에게 보여 줄 레이어로 결과값 전달.		


        //검색 단어 치환을 위한 설정
        //var regex = new RegExp(user_keyword_lowcase, 'gi');

        var search_regex = "";
        var trim_keyword = user_keyword_lowcase.replace(/(\s*)/g, "");
        for (i = 0; i < trim_keyword.length; i++) {
            if (i == 0) {
                search_regex = trim_keyword.substr(0, 1) + "+";
            } else {
                search_regex = search_regex + "(\\s)?(" + trim_keyword.substr(i, 1) + "){1}";
            }
        }
        search_regex3 = new RegExp(search_regex, 'gi');
        search_regex = user_keyword_lowcase.replace(/(\s*)/g, "")
        search_regex2 = new RegExp(search_regex, 'gi');
        setTimeout(function() {
            $("#id_results2 #topic_h1").each(function() {
                var new_html = $(this).html().replace(search_regex2, to_color);
                new_html = new_html.replace(search_regex3, to_color).replace(/혂/g, "<span class='red'>").replace(/휶/g, "</span>").replace(/꺆/g, "\(").replace(/냒/g, "\)").replace(/땪/g, "\+").replace(/먂/g, "\\").replace(/뺚/g, "\&").replace(/샦/g, "\[").replace(/앾/g, "\]").replace(/쟊/g, "\?").replace(/챢/g, "\*").replace(/캮/g, "\.").replace(/햒/g, "\İ");
                $(this).html(new_html); //옮기기 전 검색 단어에 대한 색상 표기	
            });
        }, 10);
        setTimeout(function() {
            $("#id_results2 #topic_h2").each(function() {
                var new_html = $(this).html().replace(search_regex2, to_color);
                new_html = new_html.replace(search_regex3, to_color).replace(/혂/g, "<span class='red'>").replace(/휶/g, "</span>").replace(/꺆/g, "\(").replace(/냒/g, "\)").replace(/땪/g, "\+").replace(/먂/g, "\\").replace(/뺚/g, "\&").replace(/샦/g, "\[").replace(/앾/g, "\]").replace(/쟊/g, "\?").replace(/챢/g, "\*").replace(/캮/g, "\.").replace(/햒/g, "\İ");
                $(this).html(new_html); //옮기기 전 검색 단어에 대한 색상 표기
            });
        }, 20);
        setTimeout(function() {
            $("#id_results2 #topic_body").each(function() {
                var new_html = $(this).html().replace(search_regex2, to_color);
                new_html = new_html.replace(search_regex3, to_color).replace(/혂/g, "<span class='red'>").replace(/휶/g, "</span>").replace(/꺆/g, "\(").replace(/냒/g, "\)").replace(/땪/g, "\+").replace(/먂/g, "\\").replace(/뺚/g, "\&").replace(/샦/g, "\[").replace(/앾/g, "\]").replace(/쟊/g, "\?").replace(/챢/g, "\*").replace(/캮/g, "\.").replace(/햒/g, "\İ");
                $(this).html(new_html); //옮기기 전 검색 단어에 대한 색상 표기
            });
        }, 30);

        //위에서 검색 된 단어에 대한 색상 추가
        function to_color(match) {
            return "혂" + match + "휶";
        }

        search_result2 = ""; //4-6. 검색 완료 후 동작, 보이지 않는 변수 내, 저장 공간 초기화

        $("#id_results2 #view2").append($("#id_results").html());

        $("#recent_area").fadeOut(); //4-7. 최근검색어 창 숨기기		
        $("#id_results2 #title:eq(0)").text(result_toc);
        $("#id_results2 #title:eq(1)").text(result_gen); //4-8. insert UI text
        //옵션2. 종류별 구분 로직 끝*****************************************************//

        //각 챕터별 검색결과 갯수이상이면 숨기기
        $("div[id*='chapter']").each(function() {
            if ($(this).children("#package").size() > 5) {
                $(this).children("#package").css("display", "none");
                for (var m_view = 0; m_view < 5; m_view++) {
                    $(this).children("#package").eq(m_view).css("display", "block");
                }
                $(this).append("<div id='show_all'><span>" + result_more + "</span></div>");
            }
        });

        //검색결과가 없는 챕터는 "검색 결과가 없습니다." 알림 글 삽입
        var result_txt = 0;
        $("div[id*='chapter']").each(function() {
            if ($(this).children("#package").size() == 0) {
                $(this).append("<div id='not_found_result'>" + no_result_found + "</div>");
                result_txt = result_txt + 1;
            }
        });
        if (search_pos == "find" && $("div[id*='chapter']").length == result_txt) {
            csscody.alert("<p>" + find_err + "<a ref=''></a></p>");
        }
        //4-8. 검색어 처리 영역
        var maxKeyword = 5; //최대 보여질 최근검색어 수
        var search_cnt = 0;
        $("#recent_keywords li").each(function() {
            if ($(this).text() == $("#id_search").val()) {
                search_cnt = 1;
            }
        });

        //최근검색어 리스트 중복제거, 5개 이상일 경우 오래된 맨 아래 리스트 제거 후, 추가
        if (search_cnt < 1) {
            if ($("#recent_keywords li").size() < 5) {
                $('#recent_keywords').prepend('<li><div id="key_txt">' + user_keyword + '</div></li>');
            } else {
                $("#recent_keywords li").last().remove();
                $('#recent_keywords').prepend('<li><div id="key_txt">' + user_keyword + '</div></li>');
            }
        } else {
            if ($("#recent_keywords li").size() > 5) {
                $("#recent_keywords li").last().remove();
            }
            $("#recent_keywords li").each(function() {
                if ($(this).text() == $("#id_search").val()) {
                    $(this).remove();
                }
            });
            $('#recent_keywords').prepend('<li><div id="key_txt">' + user_keyword + '</div></li>');
        }
        //검색 할 경우, 쿠키값 한번 저장
        $("#recent_keywords li #history_delete").remove();
        var allChildElements00 = $("#recent_keywords").html();
        setTimeout(function() {
            $.cookie('keyword_history', allChildElements00, { expires: 7, path: '/' });
            //console.log($.cookie('keyword_history'));	
        }, 500);
        /*$("#id_results2").css("height",$(document).height()-310);
        $("#search_box").css("height",$(document).height()-310);*/
        $("#id_results2").fadeIn(600);
        $("#no_results").fadeOut(0);
        $("#bookmark_area").fadeOut(0);
        $("#keyword1").fadeOut(0);
        $(".category_layer_2").fadeOut(0);
        $("#keyword_img").fadeOut(0);
        $("#keyword_img > ul > li ").each(function(i) {
            src = $(this).children('a').children('div').children('img').attr("src").replace("_on", "_off");
            $(this).children('a').children('div').children('img').attr("src", src);
        });

    } //end search_keyword_toc()

    //검색결과 3개 이상 더보기, 숨기기 로직
    $("div[id*='chapter'] #show_all").live("click", function() {
        if ($(this).parent().children("#package").last().css("display") == "none") {
            $(this).parent().children("#package").css("display", "block");
            $(this).parent().children("#show_all").html("<span>" + result_hidden + "</span>");
        } else {
            $(this).parent().children("#package").css("display", "none");
            for (var m_view = 0; m_view < 5; m_view++) {
                $(this).parent().children("#package").eq(m_view).css("display", "block");
            }
            $(this).parent().children("#show_all").html("<span>" + result_more + "</span>");
        }
    });
    //**********************************************************************************************************************************************************************************************************//	
    //////////// 제목만 검색 검색 /////////////////////////
    function insert_result_kind(heading, sdom) {
        if (sdom.parent().next().children("#topic_link").html().indexOf("handbook") != -1) {
            var topic_link = sdom.parent().next().children("#topic_link").html().replace(/#/g, '?h2='); //검색 블럭의 링크값 저장
        } else {
            var topic_link = sdom.parent().next().children("#topic_link").html(); //검색 블럭의 링크값 저장
        }
        if (heading == "topic_h1") {
            //topic_h2가 비어있다면 h1 항목임. 비어있는 h1만 검색, 출력, 비어있지 않으면 검색하지 않음.
            if (sdom.next().html() == "" || sdom.next().html() == " ") {
                $("#id_json_results_kind #chapter1").append("<div id='package'><a href='../" + topic_link.capitalize().replace(/캮/g, "\.") + "' id='result_link'></a></div>"); //package 빈방 생성
                $("#id_json_results_kind #chapter1 #package").last().children("a").append("<div id='topic_h1'>" +
                    sdom.parent().children("#topic_h1").html().substring(0, 1) + sdom.parent().children("#topic_h1").html().substring(1) + "</div>"); //헤딩1, 하위 동일
            }
        } else if (heading == "topic_h2") {
            $("#id_json_results_kind #chapter1").append("<div id='package'><a href='../" + topic_link.capitalize().replace(/캮/g, "\.") + "' id='result_link'></a></div>"); //package 빈방 생성
            $("#id_json_results_kind #chapter1 #package").last().children("a").append("<div id='topic_h2'>" +
                sdom.parent().children("#topic_h2").html().substring(0, 1) + sdom.parent().children("#topic_h2").html().substring(1) + "</div>"); //헤딩2, 하위 동일			
        }

    }

    //**********************************************************************************************************************************************************************************************************//

    //**********************************************************************************************************************************************************************************************************//		
    //////////// 하위 챕터별 검색 /////////////////////////
    function insert_result_chapter(chapter_num, sdom, sum_text) { //sdom : id_json_results/root/내부 div들		
        if (sdom.parent().next().children("#topic_link").html().indexOf("handbook") != -1) {
            var topic_link = sdom.parent().next().children("#topic_link").html().replace(/#/g, '?h2='); //검색 블럭의 링크값 저장
        } else {
            var topic_link = sdom.parent().next().children("#topic_link").html(); //검색 블럭의 링크값 저장
        }
        $("#id_json_results_chapter #chapter" + chapter_num).append("<div id='package'><a href='../" + topic_link.capitalize().replace(/캮/g, "\.") + "' id='result_link'></a></div>"); //package 빈방 생성

        $("#id_json_results_chapter #chapter" + chapter_num + " #package").last().children("a").append("<div id='topic_h1'>" +
            sdom.parent().children("#topic_h1").html().substring(0, 1) + sdom.parent().children("#topic_h1").html().substring(1) + "</div>"); //헤딩1, 하위 동일		
        if (sdom.parent().children("#topic_h2").html() !== null) {
            $("#id_json_results_chapter #chapter" + chapter_num + " #package").last().children("a").append("<div id='topic_h2'>" +
                sdom.parent().children("#topic_h2").html().substring(0, 1) + sdom.parent().children("#topic_h2").html().substring(1) + "</div>"); //헤딩2, 하위 동일			
        }
        //$("#id_json_results_chapter #chapter" + chapter_num + " #package").last().children("a").append("<div id='topic_body'>" + sdom.parent().children("#topic_body").html() + "</div>"); //body 영역 추가		
        $("#id_json_results_chapter #chapter" + chapter_num + " #package").last().children("a").append("<div id='topic_body'>" + sum_text + "</div>"); //body 영역 추가		
    }


    //검색결과 switch
    $("#switch_view div").live("click", function() {
        $("#switch_view div").removeClass("switch");
        $(this).addClass("switch");
        $.cookie('switch_search', $(this).attr("id"), { expires: 7, path: '/' });
        if ($(this).attr("id") == "sw1") {
            $("#id_results2").css("display", "none");
            $("#id_results").css("display", "block");
            $("#no_results").css("display", "block");
        } else {
            $("#id_results2").css("display", "block");
            $("#id_results").css("display", "none");
            $("#no_results").css("display", "none");
        }
    });

    //**********************************************************************************************************************************************************************************************************//		
    //최근검색어 로직	
    //$("#recent_area, #id_results2").css("width", $(window).width()-20); //입력창과 너비 맞춤
    $("#keyword_text").text(recent_key); //최근검색어 창 제목 설정

    $(function() { //입력창 클릭 시 동작, 벗어났을 경우 동작
        $('#recent_area').css({ display: "none" });
        $("#id_search").focus(function() {
            $('#recent_keywords li').each(function() {
                if ($(this).children('#history_delete').size() == 0) {
                    $(this).prepend("<div id='history_delete'><img src='../contents/images/template/del_bt.png' alt='' /></div>");
                    var language_t = $("html").attr("data-language");
                    $('body').find('img').each(function() {
                        var this_img = $(this).attr("src");
                        var strArray = this_img.split('/'); //strArray[1] : 이미지 이름	
                        strArray.reverse();
                        try {
                            for (var i = 0, iLen = alt_img[language_t].length; i < iLen; i++) {
                                if (strArray[0] == alt_img[language_t][i].name) {
                                    $(this).attr("alt", alt_img[language_t][i].alt);
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            });
            //불필요한 언어 제거
            var fullt = "";
            $("#recent_keywords li").each(function() {
                fullt = fullt + "<li>" + $(this).html().replace(/\햒/g, "İ") + "</li>";
            });
            $("#recent_keywords").html(fullt);
            $("#recent_area").fadeIn();
        }).blur(function() {
            $("#recent_area").fadeOut();
        }).click(function() {
            $('#recent_keywords li').each(function() {
                if ($(this).children('#history_delete').size() == 0) {
                    $(this).prepend("<div id='history_delete'><img src='../contents/images/template/del_bt.png' alt='' /></div>");
                    var language_t = $("html").attr("data-language");
                    $('body').find('img').each(function() {
                        var this_img = $(this).attr("src");
                        var strArray = this_img.split('/'); //strArray[1] : 이미지 이름	
                        strArray.reverse();
                        try {
                            for (var i = 0, iLen = alt_img[language_t].length; i < iLen; i++) {
                                if (strArray[0] == alt_img[language_t][i].name) {
                                    $(this).attr("alt", alt_img[language_t][i].alt);
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            });
            $("#recent_area").fadeIn();
        });
    });
    //최근 검색어 개별 닫기 누를경우 로직, 버튼 영역 추가
    $("#history_delete").live('click', function() {
        var li_index = $(this).parent("li").index();
        $(this).parent("li").remove();

        $("#recent_keywords li #history_delete").remove();
        var allChildElements = $("#recent_keywords").html();

        $.cookie('keyword_history', allChildElements, { expires: 7, path: '/' }); //개별 삭제 시, 쿠키 저장

        $('#recent_keywords li').each(function() {
            if ($(this).children('#history_delete').size() == 0) {
                $(this).prepend("<div id='history_delete'><img src='../contents/images/template/del_bt.png' alt='' /></div>");
                var language_t = $("html").attr("data-language");
                $('body').find('img').each(function() {
                    var this_img = $(this).attr("src");
                    var strArray = this_img.split('/'); //strArray[1] : 이미지 이름	
                    strArray.reverse();
                    try {
                        for (var i = 0, iLen = alt_img[language_t].length; i < iLen; i++) {
                            if (strArray[0] == alt_img[language_t][i].name) {
                                $(this).attr("alt", alt_img[language_t][i].alt);
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        });
        return false;
    });

    //최근검색어 클릭 시, 검색 동작
    $('#recent_keywords li').live('click', function() {
        $('#id_search').val($(this).text());
        window.history.replaceState(null, "", 'search.html?StrSearch=' + $(this).text());
        $("#id_results").html("");
        $("#id_results2").html(""); //초기화
        init();
        search_keyword_toc();
    });

    //최근 검색어 하단 닫기 버튼 영역 추가
    $("#recent_area").append("<h3 id='recent_area_close'><img src='../contents/images/template/close_bt2.png' /> " + search_close + "</h3>");
    $("#recent_area #recent_area_close").click(function() {
        $("#recent_area").fadeOut();
    });

    //최근검색어 창 닫기 버튼 클릭 시, 닫기
    $('#search-close').live('click', function() {
        $('#recent_area').hide();
    });

    //Setting UI text
    $("#sw2").text(switch_gen);
    $("#sw1").text(switch_toc);


    $("#result_link").live('click', function() {
        var result_value = "";
        $(this).children("div").children(".red").each(function(j) {
            if (j == 0) {
                result_value = $(this).text();
            } else {
                result_value += "|" + $(this).text();
            }
        });

        if (result_value != null && result_value != undefined) {
            $.cookie("txt_search", result_value, { path: '/' });
        }
    });


}); //close [dom ready]