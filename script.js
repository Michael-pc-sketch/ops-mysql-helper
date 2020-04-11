

// ==UserScript==
// @name         OPS-mysql小助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  OPS-mysql小助手
// @author       Michael.tang
// @match        http://ops.jyblife.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://greasyfork.org/scripts/391006-weight/code/weight.js?version=739789
// @run-at       document-idle
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @license      GPL-3.0-only
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var reg= /^http?:\/\/ops\.jyblife\.com\/#\/querypage*$/;
    if(!reg.test(location.href)){
        return false;
    }

    var default_selected_database = "db_jyb";












    var $ = $ || window.$;


    //组装树形数据
    var joinTreeData = function (){
        var keyList = [];
        $('.ivu-table-wrapper table thead tr th span').each(function (){
            keyList.push($(this).html());
        });
        var valList = [];

        $('.ivu-table-body.ivu-table-overflowX table tbody tr').each(function (){
            var tmpArr = [];
            $(this).find('td span').each(function(sub){
                tmpArr.push($(this).html());
            });
            valList.push(tmpArr);
        });
        var fullArr = [];

        for (var i = 0; i < valList.length; i++) {
            var tmpList = valList[i];
            var tmpMap = {};
            for (var j = 0; j < tmpList.length; j++) {
                tmpMap[keyList[j]] = tmpList[j];
            }
            fullArr.push(tmpMap);
        }
        return fullArr;
    };

    //展示树形结构数据
    var showTreeFunc = function (){
        //$('.ivu-table-wrapper').html('<pre id="out_pre"></pre>');
        try{$("#out_pre").remove();}catch(e){};
        $('.ivu-table-wrapper').css({display:"none"});
        $('.ivu-table-wrapper').after('<pre id="out_pre"></pre>');

        var fullArr = joinTreeData();
        $('#out_pre').text(JSON.stringify(fullArr, null, 2));
    };

    //展示普通结构数据
    var showNormalFunc = function (){
        try{$("#out_pre").remove();}catch(e){};
        $('.ivu-table-wrapper').css({display:"block"});
    };

    //是否树形展示
    var treeShowBol = false;

    window.onload = function (){
        //事件触发
        $('.ivu-card-body button').last().after('<button style="margin-left:5px;" type="button" class="ivu-btn ivu-btn-primary tree-show"><!----> <i class="ivu-icon ivu-icon-md-backspace"></i> <span>JSON展示&查询</span></button>');
        //事件触发
        $('.ivu-card-body button').last().after('<button style="margin-left:5px;" type="button" class="ivu-btn ivu-btn-primary reset-row-show"><!----> <i class="ivu-icon ivu-icon-md-backspace"></i> <span>重置为行展示&查询</span></button>');

        //事件触发
        $('.ivu-card-body button').last().after('<button style="margin-left:5px;" type="button" class="ivu-btn ivu-btn-primary full-screen"><!----> <i class="ivu-icon ivu-icon-md-backspace"></i> <span>全屏</span></button>');

        //点击分页按钮也触发JSON展示
        $('body').delegate('.ivu-page li' , 'click' , function (){
            if(treeShowBol) {
                showNormalFunc();
                setTimeout(function (){showTreeFunc();},500);
            }
        });

        $('body').delegate('.tree-show' , 'click' , function (){
            treeShowBol = true;

            $('.ivu-card-body .ivu-btn.ivu-btn-success').trigger('click');
            if(treeShowBol) {
                //setTimeout(function (){showTreeFunc();},1500);
                $(".ivu-table-wrapper").unbind('DOMNodeInserted').one("DOMNodeInserted", function (e){
                    e.stopPropagation();
                    //showTreeFunc();
                    setTimeout(function (){showTreeFunc();},500);
                });
            }
        });

        //普通展示
        $('body').delegate('.ivu-card-body .ivu-btn.ivu-btn-success' , 'click' , function (){
            try{$("#out_pre").remove();}catch(e){};
            $('.ivu-table-wrapper').css({display:"block"});
        });
       $('body').delegate('.reset-row-show' , 'click' , function (){
            treeShowBol = false;
           $('.ivu-card-body .ivu-btn.ivu-btn-success').trigger('click');
        });


        //全屏展示
        $('body').delegate('.full-screen' , 'click' , function (){
            if($(this).find('span').text() == '全屏') {
                /*setTimeout(function (){
                    $('.ivu-tree-title').each(function (){
                        if($(this).html() == default_selected_database) {
                            $(this).trigger('click');
                        }
                    });
                } , 1500);*/

                $('.main-header-con').css('display','none');
                $('.sidebar-menu-con').css('display','none');
                $('.ivu-col.ivu-col-span-6').css({display:"none"});
                //隐藏数据库树菜单
                $('.edittable-test-con').css({display:"none"});

                $('.single-page-con').css({"padding":"0px"});
                $('.main-header').css({"padding":"0px"});


                $('.ivu-card.ivu-card-bordered').css({width:"2080px"});


                $(this).find('span').text('取消全屏');
            }else{
                $('.main-header-con').css('display','block');
                $('.sidebar-menu-con').css('display','block');
                $('.ivu-col.ivu-col-span-6').css({display:"block"});
                $('.edittable-test-con').css({display:"block"});
                $('.single-page-con').css({"padding":""});
                $('.single-page-con').css({"padding-left":"200px"});
                $('.main-header').css({"padding":""});
                $('.ivu-card.ivu-card-bordered').css({width:""});
                $(this).find('span').text('全屏');
            }
        });
    }

    // Your code here...
})();
