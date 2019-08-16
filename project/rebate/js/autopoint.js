/**
 * Refactor code about liuzhengwu
 * @Change   Midday
 * @QQ       598535774
 * @Mail     liuzhengwu@yolo24.com
 * @DateTime 2016-09-01
 */
;(function($, window, document, undefined) {
    "use strict";

    var pluginName = 'autopoint', //插件名称
        defaults = { //插件默认参数
            url: '',
            environment: '',
            targetType: '',
            contentLabels: '',
            language: '',
            listHoverCSS: 'hover',
            topoffset: 10
        },
        $searchTips = $('#searchTips'), //搜索提示面板
        $searchTipsList = $('#searchTipsList'), //搜索提示列表
        cid = $.cookie("__clickidc"), //cookieID
        uid = ''; //用户的loginId

    function Plugin(elem, options) {
        this.$elem = $(elem);
        this.options = $.extend({}, defaults, options);
        this.highlightIndex = null; //搜索提示列表中高亮项索引
        this.lastKeyword = !1; //最后输入的关键字，用于检测定时器内文字是否变化
        this.continueInputTimer = !1; //可连续输入定时器，防止连续输入时，频繁请求后台(节流优化)
        this.leaveFocusDivTimer = !1; //鼠标移除焦点区定时器，防止移出立即隐藏(用户体验优化)
        this.isOnFocusDiv = !1; //是否在焦点区(输入框区域+搜索提示面板区域)
        this.init();
    }

    $.extend(Plugin.prototype, {
        //插件初始化
        init: function() {
            this.$elem.attr('alt', $.trim(this.$elem.val())); //同步alt属性内容
            this.create();
            $('#his_title').remove(); //移除DOM。海外购搜索也用到此DOM，暂时不做ftl删除
            this.bind();
        },
        //初始化创建DOM
        create: function() {
            $searchTipsList.html(
                '<li class="related-search related-shop-search">'+
                '    <a href="javascript:void(0);">'+
                '        <i></i><span>找“</span><em class="related-keyword"></em><span>”相关店铺</span></a>'+
                '    </a>'+
                '</li>'
            );
            $searchTips.append('<div class="closeSearch" id="closeSearch"><span>关闭</span></div>'); //增加关闭按钮
        },
        //绑定事件
        bind: function() {
            var self = this;

            //点击焦点区外内容隐藏搜索提示面板
            $(document)
                .on('click', function() {
                    if (!self.isOnFocusDiv) {
                        self.hideSearchTips();
                    }
                });

            //为当前元素绑定事件
            self.$elem
                .on('mouseenter', function() {
                    self.mouseenterFocusDiv();
                }).on('mouseleave', function() {
                    self.mouseleaveFocusDiv();
                }).on('keyup', function(evt) {
                    self.handleKeyup(evt);
                }).on('focus', function() {
                    var keyword = $.trim(self.$elem.val());
                    self.toggleRelatedSearchItem(keyword);
                    $searchTipsList.find('.related-keyword').text(keyword);
                    self.fetchDataEntryForSearch(keyword);
                });

            //为搜索提示面板及关闭按钮绑定事件
            $searchTips
                .on('mouseenter', function() {
                    self.mouseenterFocusDiv();
                }).on('mouseleave', function() {
                    self.mouseleaveFocusDiv();
                }).on('click', '#closeSearch', function() {
                    self.hideSearchTips();
                });

            //为搜索提示面板列表项及"删除"按钮绑定事件
            $searchTipsList
                .on('click', '.his_del', function(evt) {
                    evt.stopPropagation();
                    self.deleteTipItem($(this));
                }).on('click', 'li', function() {
                    self.submitSearchData($(this));
                }).on('mouseenter', 'li', function() {
                    self.mouseenterTipItem($(this));
                }).on('mouseleave', 'li', function() {
                    self.mouseleaveTipItem($(this));
                });
        },
        //处理搜索框keyup事件
        handleKeyup: function(evt) {
            var self = this,
                keyCode = evt.keyCode,
                isShow = $searchTips.css('display') !== 'none' ? true : false;

            switch (keyCode) {
                case 38: //"↑"键
                    if (isShow) self.selectTipItem('KEY_UP');
                    break;
                case 40: //"↓"键
                    if (isShow) self.selectTipItem('KEY_DOWN');
                    break;
                case 13: //"enter"键
                    var $li = null;
                    if(self.highlightIndex !== null){
                        $searchTipsList.find('li').eq(self.highlightIndex);
                    }
                    if (isShow) self.submitSearchData($li);
                    break;
                case 27: //"Esc"键
                    if (isShow) self.hideSearchTips();
                    break;
                case 37: //"←"键
                    break;
                case 39: //"→"键
                    break;
                default:
                    self.handleKeywordInput();
            }
        },
        //处理搜索框关键字输入
        handleKeywordInput: function() {
            var self = this,
                keyword = $.trim(self.$elem.val());

            if (keyword === self.$elem.attr('alt')) { //输入项无变化
                return false;
            }

            $searchTipsList.find('.related-keyword').text(keyword);

            self.toggleRelatedSearchItem(keyword);

            self.$elem.attr('alt', keyword); //为alt属性赋值，以便比较输入值差异

            if (self.continueInputTimer) clearTimeout(self.continueInputTimer);
            self.continueInputTimer = setTimeout(function() {
                if (keyword === self.lastKeyword) {
                    return false;
                }
                self.lastKeyword = keyword;

                self.fetchDataEntryForSearch(keyword);
            }, 80);
        },
        //获取搜索数据入口
        fetchDataEntryForSearch: function(keyword) {
            var self = this;

            if (window.loginData.loginId) {
                self.fetchDataForSearch(keyword);
            } else { //拉取用户，确保loginId存在
                window.signData.login({}, function(data) {
                    window.signData.setLoginStyle(data);
                    self.fetchDataForSearch(keyword);
                });
            }
        },
        //获取搜索数据
        fetchDataForSearch: function(keyword) {
            keyword.replace(/[()'";,{}~!@#$%^&*(){}?\|<>.]/g, "");
            uid = window.loginData.loginId;
            var self = this,
                //searchURL = self.options.url + "&module=searchSuggest" + "&query=" + encodeURI(keyword) + "&jp=true&user=" + uid;
                //searchURL = self.options.url + "&query=" + encodeURI(keyword) + "&user=" + uid;
                searchURL = self.options.url + "&query=" + encodeURI(keyword) + "&user=18170584658";

            $.ajax({
                type: "get",
                url: searchURL,
                dataType: "jsonp",
                jsonpName: "suggest",
                success: function(data) {
                    self.renderDataForSearch(data, keyword);
                }
            });
        },
        //渲染搜索数据
        renderDataForSearch: function(data, keyword) {
            var length = data.length,
                element,
                searchTipElemTag,
                searchTipElemTagArray = [],
                historyCounter = 0, //历史条数计数器
                historyCountMaxLimit = (keyword === '' ? 10 : 2); //最大历史条数：关键字为空时，最大10条，不为空时，最大2条

            this.highlightIndex = null;//重置索引

            if (data && data.length > 0) {
                for (var i = 0; i < length; i++) {
                    element = data[i];
                    if (element.length >= 4) {
                        searchTipElemTag ="";
                        //分类暂时隐藏
                            /*'<li class="search-item" category="' + element[3].cat[1] + '" keyword="' + element[0] + '">' +
                            '   <span class="fs" style="float:left;">在<b>' + element[3].cat[3] + '</b><i>&gt;</i><a class="akeyword" href="javascript:void(0);">' + element[3].cat[0] + '</a>分类中搜索</span>' +
                            '   <span class="fr color-b">约' + element[3].cat[2] + '条</span>' +
                            '</li>';*/
                    } else {
                        if (element[2] === -1) { //搜索历史结果项
                            var exceedHistoryStyle = historyCounter >= historyCountMaxLimit ? 'style="display:none;"' : '';
                            searchTipElemTag =
                                '<li class="J-history-item" '+exceedHistoryStyle+'>' +
                                '   <a class="hisakeyword" href="javascript:void(0);">' +
                                '       <span class="fl">' + element[0] + '</span>' +
                                '       <span class="fr color-b his_txt" style="display:block">搜索历史</span>' +
                                '       <span class="fr color-b his_del" style="display:none">删除</span>' +
                                '   </a>' +
                                '</li>';
                            historyCounter++;
                        } else { //搜索结果项
                            searchTipElemTag =
                                '<li>' +
                                '   <a class="akeyword" href="javascript:void(0);">' +
                                '   <span class="fl">' + element[0] + '</span><span class="fr color-b">约' + element[1] + '条</span>' +
                                '   </a>' +
                                '</li>';
                        }
                    }
                    searchTipElemTagArray.push(searchTipElemTag);
                }
              
                $searchTipsList.find('li:not(.related-search)').remove();
                $searchTipsList.prepend(searchTipElemTagArray.join(''));
                $searchTipsList.find('li.search-item:last').css('border-bottom', '1px solid #EEEEEE');
                $searchTips.show();
            } else {
                if(keyword === ''){
                    this.hideSearchTips();    
                }else{
                    $searchTipsList.find('li:not(.related-search)').remove();
                    $searchTips.show();
                }
            }
        },
        //隐藏搜索提示面板
        hideSearchTips: function() {
            $searchTipsList.find('li:not(.related-search)').remove();
            $searchTips.hide();
        },
        //mouseenter提示条目
        mouseenterTipItem: function($this) {
            var self = this;
            self.removeAllTipsHoverCss();
            $this
                .addClass(self.options.listHoverCSS)
                .find('a:first').addClass(self.options.listHoverCSS);
            if ($this.hasClass('J-history-item')) {
                $this
                    .find('.his_txt').hide().end()
                    .find('.his_del').show();
            }
            self.highlightIndex = $this.index();
        },
        //mouseleave提示条目
        mouseleaveTipItem: function($this) {
            var self = this;

            $this
                .removeClass(self.options.listHoverCSS)
                .find('a:first').removeClass(self.options.listHoverCSS);
            if ($this.hasClass('J-history-item')) {
                $this
                    .find('.his_txt').show().end()
                    .find('.his_del').hide();
            }
        },
        //mouseenter焦点区域(输入区域+搜索提示区域)
        mouseenterFocusDiv: function() {
            var self = this;

            self.isOnFocusDiv = true;
            if (self.leaveFocusDivTimer) clearTimeout(self.leaveFocusDivTimer);
        },
        //mouseleave焦点区域(输入区域+搜索提示区域)
        mouseleaveFocusDiv: function() {
            var self = this;

            self.isOnFocusDiv = false;
            self.leaveFocusDivTimer = setTimeout(function() {
                self.hideSearchTips();
            }, 300);
        },
        //移除所有提示条目的hoverCss
        removeAllTipsHoverCss: function() {
            $searchTipsList
                .find('li').removeClass(this.options.listHoverCSS)
                .find('a:first').removeClass(this.options.listHoverCSS);
        },
        //提交搜索数据
        submitSearchData: function($this) {
            var self = this;
            var url = '';

            if($this !== null){
                //分类条目
                if($this.hasClass('search-item')){
                    var category = $this.attr('category');
                    url = '//search' + cookieDomain + '/search?question=' + encodeURI(self.getPointWord($this)) + '&catId=' + category;
                    location.href = url;
                    return false;
                }
                //相关话题搜索条目
                // if($this.hasClass('related-topic-search')){
                //     url = "api&keyword=" + $this.find('.related-keyword').text();
                //     location.href = url;
                //     return false;
                // }
                // //相关圈子搜索条目
                // if($this.hasClass('related-circle-search')){
                //     url = "api&keyword=" + $this.find('.related-keyword').text();
                //     location.href = url;
                //     return false;
                // }
                //相关商店搜索条目
                if($this.hasClass('related-shop-search')){
                    var keyword = $this.find('.related-keyword').text();
                    url = "//search.gome.com.cn/search?shop=" + keyword;
                    location.href = url;
                    return false;
                }

                //点击或回车触发搜索条目
                self.$elem.val(self.getPointWord($this));
            }

            //点击/回车搜索条目，输入内容后直接回车提交
            if ($('.search-input-bot').attr('autoPoint') === 'point') {
                doSearchbot();
            } else {
                doSearch();
            }
        },
        //选择提示条目(按上下键)
        selectTipItem: function(keyFlag) {
            var self = this,
                $searchTipItems = $searchTipsList.find('li:visible'),
                length = $searchTipItems.length,
                $nextLi,
                keyword;

            if (keyFlag === 'KEY_UP') {
                if(self.highlightIndex === null){
                    self.highlightIndex = -1;
                }
                if (self.highlightIndex !== -1) {
                    self.highlightIndex--;
                } else {
                    self.highlightIndex = length - 1;
                }
            }

            if (keyFlag === 'KEY_DOWN') {
                if(self.highlightIndex === null){
                    self.highlightIndex = -1;
                }
                self.highlightIndex++;
                if (self.highlightIndex === length) {
                    self.highlightIndex = 0;
                }
            }

            $nextLi = $searchTipItems.eq(self.highlightIndex);

            if(!$nextLi.hasClass('related-search')){
                keyword = self.getPointWord($nextLi);
                $searchTipsList.find('.related-keyword').text(keyword);
                self.toggleRelatedSearchItem(keyword);
                self.$elem.val(keyword);
                self.$elem.attr('alt', keyword); //为alt属性赋值，以便比较输入值差异
            }
            self.mouseenterTipItem($nextLi);
        },
        //删除提示条目
        deleteTipItem: function($this) {
            var self = this,
                keyword = $this.siblings('.fl').text(),
               // delURL = self.options.url + "&module=searchSuggest" + "&query=" + encodeURI(keyword) + "&jp=true" + "&user=" + uid + "&hisDel=1";
                delURL = self.options.url + "&query=" + encodeURI(keyword) + "&user=" + uid + "&hisDel=1";

            var $firstHiddenHistory = $this.closest('li').siblings('.J-history-item:hidden:first');
            $this.closest('li').remove();
            $firstHiddenHistory.show();//显示第一个隐藏项
            if ($searchTipsList.find('li:visible').length === 0) {
                self.hideSearchTips();
            }

            //由于删除历史时触发了blur事件，keyLabel自动显示，故动态显示相关搜索
            if($("#keyLabel").css('display') === 'block'){
                var $relatedSearch = $searchTipsList.find('.related-search');
                $relatedSearch.find('.related-keyword').text($("#keyLabel").text());
                $relatedSearch.show();
            }

            $.ajax({
                type: "get",
                url: delURL,
                cache: false,
                dataType: "jsonp",
                jsonpName: "suggest",
                success: function(data) {}
            });
        },
        //在提示框中取得当前选中的提示关键字
        getPointWord: function($li) {
            return $li.attr('keyword') ? $li.attr('keyword') : $li.find('span:first').text();
        },
        //隐藏/显示相关搜索
        toggleRelatedSearchItem: function(keyword){
            if(keyword === ''){
                $searchTipsList.find('.related-search').hide();
            }else{
                $searchTipsList.find('.related-search').show();
            }
        }
    });

    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
        return this;
    };
})(jQuery, window, document);

//ginputfocus
;(function($) {
    $.fn.ginputfocus = function(o) {
        var def = {
            curClass: "cur" /*当前class*/
        };
        var o = $.extend(def, o),
            cur = o.curClass;
        return this.each(function() {
            var tip = $(this).siblings("label");
            $(tip).click(function() {
                $(this).hide();
                $(this).siblings("input").focus();
            });
            $(this).focus(function() {
                $(this).parent().addClass(cur);
                $(this).siblings("label").hide();
            });
            $(this).blur(function() {
                $(this).parent().removeClass(cur);
                if (this.value == "") {
                    $(this).siblings("label").show();
                };
            });
        });
    };
})(jQuery);
