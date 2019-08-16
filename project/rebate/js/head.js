/**
 * Created by duhongyan on 2017/11/4.
 */
seajs.config({base:stageJsServer});
seajs.use(['/js/autopoint','/js/search','gmlib/ui/curnav/1.0.0/curnav.min.js'],function(){
    ;(function($){
        var brand = function(){
            this.init();
            $(".mainnavbox1").curNav({
                css:"cur" //css目标
            });
        };
        brand.prototype = {
            init:function(){
                this.fliRender();
            },
            fliRender:function(){//搜索关键字
                var searchArry=['空调','手机','笔记本电脑','冰箱','平板电视'];
                var searcrandom = parseInt(Math.random()*searchArry.length);
                $('#keyLabel_a').text(searchArry[searcrandom]);
                $('#keyLabel_a').siblings("input").val('');
                $("#keyLabel_a").click(function(){
                    $(this).hide();
                    $(this).siblings("input").focus();
                })
                $("#searchInput_a").focus(function(){
                    $(this).siblings("label").hide();
                });
                $("#searchInput_a").blur(function(){
                    if(this.value==""){
                        $(this).siblings("label").show();
                    };
                });

                $("#searchInput_a").bind('keydown',function(event){
                    if(event.keyCode==13){
                        var searchVal = $("#searchInput_a").val();
                        if($.trim(searchVal) == ""){
                            $(this).val(searchArry[searcrandom]);
                            setTimeout(function(){
                                window.open('//fanli.gome.com.cn/search?question='+searchArry[searcrandom])
                            },500)
                        }else{
                            window.open('//fanli.gome.com.cn/search?question=' + searchVal)
                        }
                    }
                })
            }
        }
        new brand();
    })(jQuery);
});