<div id="gm_main" class="gm_main">
    <!-- <div class="news_out">
        <div class="news_bg"></div>
        <span class="news_text news_text_size">广告</span>
    </div> -->
    <#--焦点图-->
    <div class="focus">
        <#--节日氛围左右氛围图-->
        <#if (temps.temp.children.background.children)??>
            <#assign bgbox = temps.temp.children.background.children>
            <div class="focus_img_bg">
                <#if (bgbox.leftFocus.imgList[0])??>
                <div class="focus_img_l">
                    <a class="edit-mode <#if (bgbox.leftFocus.imgList[0].href)??><#else>nolink</#if>" data-code="${(bgbox.leftFocus.modelId)!}-1" modelId="${(temps.temp.children.background.modelId)!}" modelType="" <#if (bgbox.leftFocus.imgList[0].href)??> target="_blank" href="${(bgbox.leftFocus.imgList[0].href)!}"<#else>href="javascript:;"</#if> >
                        <img class="" data-lazy-img="0" src="${(gomeImgLoad)!}" data-lazy-init="${(bgbox.leftFocus.imgList[0].src)!}" width="300" height="450" <#if (bgbox.leftFocus.imgList[0].alt)??>alt="${(bgbox.leftFocus.imgList[0].alt)!}"</#if> title=""/>
                    </a>
                    <#if (bgbox.leftFocus.imgList[0].imgOtherAttr.extend)??>
                    <div class="focuslayer">
                        <a <#if (bgbox.leftFocus.imgList[0].href)??> target="_blank" href="${(bgbox.leftFocus.imgList[0].href)!}"<#else>href="javascript:;"</#if> data-code="${(bgbox.leftFocus.modelId)!}-1">
                            <img class="focuslayer_img" src="${(bgbox.leftFocus.imgList[0].imgOtherAttr.extend)!}" width="949" height="448"/>
                        </a>
                        <span class="layer_btn index_pabs">×</span>
                    </div>
                    </#if>
                </div>
                </#if>
                <#if (bgbox.rightFocus.imgList[0])??>
                    <a class="focus_img_r edit-mode <#if (bgbox.rightFocus.imgList[0].href)??><#else>nolink</#if>" data-code="${(bgbox.rightFocus.modelId)!}-2" modelId="${(temps.temp.children.background.modelId)!}" modelType="" <#if (bgbox.rightFocus.imgList[0].href)??> target="_blank" href="${(bgbox.rightFocus.imgList[0].href)!}"<#else> href="javascript:;"</#if>>
                        <img class="" data-lazy-img="0" src="${(gomeImgLoad)!}" data-lazy-init="${(bgbox.rightFocus.imgList[0].src)!}" width="300" height="450" <#if (bgbox.rightFocus.imgList[0].alt)??>alt="${(bgbox.rightFocus.imgList[0].alt)!}"</#if> title=""/>
                    </a>
                </#if>
            </div>
        </#if>
        <#--节日氛围左右氛围图-结束-->
        <#if (temps.temp.children.indexFirst)??>
            <div>
                <div class="main_data">
                    <script type="text/javascript">
                        <#if (temps.temp.children.indexFirst.children.indexFocusGroup.templates)?? && ((temps.temp.children.indexFirst.children.indexFocusGroup.templates)?size>0)>
                        var main_data = [<#list (temps.temp.children.indexFirst.children.indexFocusGroup.templates) as list>[<#if (list.children.indexFocusPic.imgList)?? && ((list.children.indexFocusPic.imgList)?size>0)>
                        <#list (list.children.indexFocusPic.imgList) as item>{background:"${(item.imgOtherAttr.extend)!}", href: "${item.href!}",alt:"${item.alt!}",src:"${item.src!}",code:"${(item.modelId)!}-${item_index+1!}",chance:"${item.urlParam!1}"}<#if item_has_next>,</#if></#list></#if>]<#if list_has_next>,</#if></#list>];
                        </#if>
                        var saleflag;
                        <#if (temps.temp.children.indexFirst.children.saleflag.imgList[0])?? && ((temps.temp.children.indexFirst.children.saleflag.imgList[0])?size>0)>
                            saleflag = [{src:"${(temps.temp.children.indexFirst.children.saleflag.imgList[0].src)!}"}];
                        </#if>
                    </script>
                </div>
                <ul  class="focus_box"></ul>
                <ol class="nav edit-mode" modelId="${(temps.temp.children.indexFirst.modelId)!}" modelType ="">
                    <#--<#if (temps.temp.children.indexFirst.children.indexFocusGroup.templates)?? && ((temps.temp.children.indexFirst.children.indexFocusGroup.templates)?size>0)>
                        <#list (temps.temp.children.indexFirst.children.indexFocusGroup.templates) as list><li <#if list_index==0>class="cur"</#if>><a></a></li></#list>
                    </#if>-->
                   <#-- <li class="cur"></li>-->
                </ol>
                <div class="slider-extra">
                    <div class="btn pre" onselectstart="return false" style="-moz-user-select:none;"><span class='btnbg'></span><p class='go_l' id="go_l"></p></div>
                    <div class="btn nex" onselectstart="return false" style="-moz-user-select:none;"><span class='btnbg'></span><p class="go_r" id="go_r"></p></div>
                </div>
                <#if (temps.temp.children.indexFirst.children.saleflag.imgList[0].imgOtherAttr.extend)?? && (temps.temp.children.indexFirst.children.saleflag.imgList[0].imgOtherAttr.extend)=="top">
                    <input type="hidden" id="saleflagextend" />
                </#if>
            </div>
        </#if>
    </div>
    <#--焦点图结束-->
    <#--快讯-->
    <div class="wbox">
        <div class="gm_sever_wrap" id="gm_sever_wrap">
            <span class="guan"></span>
            <div class="gm_sever_bg"></div>
            <div class='gm_sever <#if (temps.temp.children.circle.imgList[0])??>gm_kuaixun4</#if>'>
                <div class="gm_kuaixun edit-mode" modelId="${(temps.temp.children.quicklylist.modelId)!}" modelType="">
                    <div class="gome_news">
                        <h2 class="gome_news_title">快讯</h2>
                        <a href="//news.gome.com.cn/?intcmp=sy-D-0-0-0" target="_blank" data-code="indexsever001">更多<span></span></a>
                    </div>
                    <div class="gome_news_content">
                    <#if (temps.temp.children.quicklylist.children.quicklyNews.templates)?? && ((temps.temp.children.quicklylist.children.quicklyNews.templates)?size>0)>
                        <#assign item=(temps.temp.children.quicklylist.children.quicklyNews.templates)>
                        <#list (temps.temp.children.quicklylist.children.quicklyNews.templates) as it>
                            <span>
                                <#if (it.children.quicklyNewsType.linkList[0])??>
                                    <#assign type=(it.children.quicklyNewsType.linkList[0])>
                                    <#if (type.title!)?? &&  (type.title!)=="公益">
                                        <a class="gome_news_sort edit-mode" href="${type.href!}?tzm=shanghaigongshangju"  target="_blank" data-code="${(it.children.quicklyNewsType.modelId)!}" modelId="${(it.children.quicklyNewsType.modelId)!}" modelType="${(it.children.quicklyNewsType.modelType)!}">${type.title!}</a>
                                    <#else>
                                        <a class="gome_news_sort edit-mode" href="${type.href!}"  target="_blank" data-code="${(it.children.quicklyNewsType.modelId)!}" modelId="${(it.children.quicklyNewsType.modelId)!}" modelType="${(it.children.quicklyNewsType.modelType)!}">${type.title!}</a>
                                    </#if>
                                </#if>
                                <#if (it.children.quicklyNewsContent.linkList[0])??>
                                    <#assign list=(it.children.quicklyNewsContent.linkList[0])>
                                    <#assign red="" >
                                    <#if (list.textOtherAttr.extend)?? && (list.textOtherAttr.extend)=='red'><#assign red='red'></#if>
                                    <#if (it.children.quicklyNewsType.linkList[0].title!)?? &&  (it.children.quicklyNewsType.linkList[0].title!)=="公益">
                                        <a class="gome_news_text ${red!} edit-mode" href="${list.href!}?tzm=shanghaigongshangju" target="_blank" data-code="${(it.children.quicklyNewsContent.modelId)!}" modelId="${(it.children.quicklyNewsContent.modelId)!}" modelType="${(it.children.quicklyNewsContent.modelType)!}">${list.title!}</a>
                                    <#else>
                                        <a class="gome_news_text ${red!} edit-mode" href="${list.href!}" target="_blank" data-code="${(it.children.quicklyNewsContent.modelId)!}" modelId="${(it.children.quicklyNewsContent.modelId)!}" modelType="${(it.children.quicklyNewsContent.modelType)!}">${list.title!}</a>
                                    </#if>
                                </#if>
                                </span>
                        </#list>
                    </#if>
                    </div>
                </div>
                <#if  (temps.temp.children.lifeService.children.lifeIframe.templates)?? && ((temps.temp.children.lifeService.children.lifeIframe.templates)?size>0)>
                    <div class="icon_server_box edit-mode" modelId="${(temps.temp.children.lifeService.modelId)!}" modelType="">
                        <div class="icon_box" id="icon_box">
                            <ul class="icon_server" id="icon_server">
                                <#list (temps.temp.children.lifeService.children.lifeIframe.templates) as list>
                                    <#if list_index &lt; 9>
                                        <li class ="<#if ((list_index)<2)>icon_server_li_bottom</#if> edit-mode" modelId="${(list.children.picLogo.modelId)!}" modelType="${(list.children.picLogo.modelType)!}">
                                            <#if (list.children.picLogo.imgList[0])??>
                                                <#assign tmp=(list.children.picLogo.imgList[0])>
                                                <a class="icon_server_a" href="${tmp.href!}" target="_blank" data-code="${(list.modelId)!}-${list_index+1}">
                                                    <i class="gm-icon">${tmp.imgOtherAttr.extend!}</i>
                                                    <i class="icon_server_li_titile">${tmp.title!}</i>
                                                    <#if (list_index < 2)>
                                                    <i class="icon_server_li_triangle"></i>
                                                    </#if>
                                                </a>
                                            </#if>
                                        </li>
                                    </#if>
                                </#list>
                            </ul>
                        </div>
                        <div class="icon_tab_wrap">
                            <span class="ser_cur"></span>
                            <ul class="icon_tab_content_ul">
                                <#list (temps.temp.children.lifeService.children.lifeIframe.templates) as list>
                                    <#if list_index<3>
                                        <#if (list.children.iframeLink.linkList[0])??>
                                        <li><a gome-src="${(list.children.iframeLink.linkList[0].href!)}" gome=0></a></li>
                                        </#if>
                                    </#if>
                                </#list>
                            </ul>
                            <a class="close_icon"><i></i></a>
                        </div>
                    </div>
                </#if>
                <#if (temps.temp.children.circle.imgList[0])??>
                    <#assign roundbox = temps.temp.children.circle>
                    <div class="round edit-mode" modelId="${(roundbox.modelId)!}" modelType="">
                        <a class="round_out clearfix" <#if (roundbox.imgList[0].href)??>href="${(roundbox.imgList[0].href)!}" target="_blank"<#else>href="javascript:;"</#if> data-code="${(roundbox.modelId)!}-1">
                            <img class="lazyloading" src="${(roundbox.imgList[0].src)!}" width="250" height="130">
                            <div class="round_tittle">
                                <p class="tittle_up"><span>[</span><span class="txt">${(roundbox.imgList[0].imgOtherAttr.elemenlName )!}</span><span>]</span></p>
                                <p class="tittle_down">${(roundbox.imgList[0].title)!}</p>
                            </div>
                        </a>
                    </div>
                </#if>
            </div>
        </div>
        <div class="fang" id="fang">
            <span class="kai"></span>
            <p class="p1">快讯</p>
            <p class="p2">生活服务</p>
        </div>
    </div>
    <#--快讯结束-->
    <#--区域-->
    <#if (temps.temp.children.activity)??>
    <#assign ac=(temps.temp.children.activity)>
        <div class="area edit-mode" style="background:${ac.children.image.state!}" modelId="${ac.modelId!}" modelType="">
            <#if (ac.children.image)??>
                <div class="wbox extra_img">
                    <#if (ac.children.image.children.topimage.imgList[0])??>
                        <#assign t=(ac.children.image.children.topimage.imgList[0])>
                        <a class="area_t bc_imgt" <#if (ac.href)??>href="${t.href!}" data-code="${t.modelId!}"</#if> target="_blank"><img src="${t.src!}" <#if (t.alt)??>alt="${t.alt!}"</#if> title=""/></a>
                    </#if>
                    <#if (ac.children.image.children.leftimage.imgList[0])??>
                        <#assign l=(ac.children.image.children.leftimage.imgList[0])>
                        <a <#if (l.href)??>href="${l.href!}" data-code="${l.modelId!}"</#if> target="_blank"><img class="area_l  bc_imgl"  src="${l.src!}" <#if (l.alt)??>alt="${l.alt!}"</#if> title=""/></a>
                    </#if>
                    <#if (ac.children.image.children.rightimage.imgList[0])??>
                        <#assign r=(ac.children.image.children.rightimage.imgList[0])>
                        <a <#if (r.href)??>href="${r.href!}" data-code="${r.modelId!}"</#if> target="_blank"><img class="area_r  bc_imgr" src="${r.src!}" <#if (r.alt)??>alt="${r.alt!}"</#if> title="" /></a>
                    </#if>
                </div>
            </#if>
            <ul class="wbox ar_main">
                <#if (ac.children.activityimage.imgList)?? && ((ac.children.activityimage.imgList)?size>0)>
                    <#list (ac.children.activityimage.imgList) as list>
                        <li><a href="${list.href!}" data-code="${list.modelId!}-${(list_index!)+1}" target="_blank"><img class="lazyloading" src="${list.src!}" <#if (list.alt)??>alt="${list.alt!}"</#if> title="" width="240" height="200"/></a></li>
                    </#list>
                </#if>
                <li class="area1">
                    <#if (ac.children.areaOne.imgList)?? && ((ac.children.areaOne.imgList)?size>0)>
                        <script>var area1={"data":[<#list (ac.children.areaOne.imgList) as list>{"href":"${list.href!}","src":"${list.src!}","code":"${(list.modelId)!}-${list_index+1!}","alt":"${list.alt!}",areaid:"${list.imgOtherAttr.extend!}"}<#if list_has_next>,</#if></#list>]}</script>
                        <#if (ac.children.areaOne.imgList[0])??>
                        <#assign one=(ac.children.areaOne.imgList[0])>
                        <a href="${one.href!}" data-code="${one.modelId!}-1" target="_blank"><img class="lazyloading" src="${one.src!}"  <#if (one.alt)??>alt="${one.alt!}"</#if> title="" width="240" height="200"/></a>
                        </#if>
                    </#if>
                </li>
                <li class="area2">
                    <#if (ac.children.areaTwo.imgList)?? && ((ac.children.areaTwo.imgList)?size>0)>
                        <script>var area2={"data":[<#list (ac.children.areaTwo.imgList) as list>{"href":"${list.href!}","src":"${list.src!}","code":"${(list.modelId)!}-${list_index+1!}","alt":"${list.alt!}",areaid:"${list.imgOtherAttr.extend!}"}<#if list_has_next>,</#if></#list>]}</script>
                        <#if (ac.children.areaTwo.imgList[0])??>
                            <#assign two=(ac.children.areaTwo.imgList[0])>
                            <a href="${two.href!}" data-code="${two.modelId!}-1" target="_blank"><img class="lazyloading" src="${two.src!}" <#if (two.alt)??>alt="${two.alt!}"</#if>  title="" width="240" height="200"/></a>
                        </#if>
                    </#if>
                </li>
            </ul>
        </div>
    </#if>
    <#--倒计时-->
    <#if (temps.temp.children.panicbuying)??>
        <#assign ac=(temps.temp.children.panicbuying)>
        <div class="wbox countdown_js">
            <div class="loading-sync"></div>
        </div>
        <div class="countdown edit-mode" style="background:${ac.state!}" modelId="${ac.modelId!}" modelType ="">
            <#if (ac.children.topimage.imgList[0])?? || (ac.children.backgroundleft.imgList[0])?? || (ac.children.backgroundright.imgList[0])??>
                <div class="wbox extra_img">
                    <#if (ac.children.topimage.imgList[0])??>
                        <#assign t=(ac.children.topimage.imgList[0])>
                        <a class="countdown_t bc_imgt edit-mode" modelId="${ac.children.topimage.modelId!}" modelType="${ac.children.topimage.modelType!}" <#if (ac.href)??>href="${t.href!}" data-code="${t.modelId!}"</#if> target="_blank"><img src="${t.src!}" <#if (t.alt)??>alt="${t.alt!}"</#if> title=""/></a>
                    </#if>
                    <#if (ac.children.backgroundleft.imgList[0])??>
                        <#assign l=(ac.children.backgroundleft.imgList[0])>
                        <a class="edit-mode" modelId="${ac.children.backgroundleft.modelId!}" modelType="${ac.children.backgroundleft.modelType!}" <#if (l.href)??>href="${l.href!}" data-code="${l.modelId!}"</#if> target="_blank"><img class="countdown_l  bc_imgl"  src="${l.src!}" <#if (l.alt)??>alt="${l.alt!}"</#if> title=""/></a>
                    </#if>
                    <#if (ac.children.backgroundright.imgList[0])??>
                        <#assign r=(ac.children.backgroundright.imgList[0])>
                        <a class="edit-mode" modelId="${ac.children.backgroundright.modelId!}" modelType="${ac.children.backgroundright.modelType!}" <#if (r.href)??>href="${r.href!}" data-code="${r.modelId!}"</#if> target="_blank"><img class="countdown_r  bc_imgr" src="${r.src!}" <#if (r.alt)??>alt="${r.alt!}"</#if> title="" /></a>
                    </#if>
                </div>
            </#if>
            <div class="wbox countdown_main">
                <div class="count_l">
                    <div class="countdown_l_t">
                        <div class="time_box"></div>
                        <div class="click_box">
                            <#if (ac.children.titleImage.imgList[0])??>
                                <img src="${(ac.children.titleImage.imgList[0].src)!}" width="40" height="40" />
                                <h3>${(ac.children.titleImage.imgList[0].title)!}</h3>
                            </#if>
                        </div>
                        <div class="line"></div>
                    </div>
                    <div class="countdown_l_b">
                         <div class="countdown_lists"></div>
                    </div>
                    <div class="countdown_btn index_pabs">
                        <div class="j_btn prebtn" onselectstart="return false" style="-moz-user-select:none;"><span class="btnbg"></span><p class="go_icon btn_l"></p></div>
                        <div class="j_btn nexbtn" onselectstart="return false" style="-moz-user-select:none;"><span class="btnbg"></span><p class="go_icon btn_r"></p></div>
                    </div>
                </div>
                <div class="count_r edit-mode" modelId="${ac.children.activityImage.modelId!}" modelType="${ac.children.activityImage.modelType!}" style="background:url(${(ac.children.activityImage.imgList[0].imgOtherAttr.extend)!}) no-repeat">
                    <#if (ac.children.activityImage.imgList[0])??>
                        <#assign img=(ac.children.activityImage.imgList[0])>
                        <a <#if img.href??>href="${img.href!}" target="_blank"</#if> title="${img.title!}" data-code="${(ac.children.activityImage.modelId)!}">
                            <img class="lazyloading" src="${img.src!}" <#if (img.alt)??>alt="${img.alt!}"</#if> title="" width="240" height="252"/>
                        </a>
                    </#if>
                </div>
            </div>
        </div>
    </#if>
</div>