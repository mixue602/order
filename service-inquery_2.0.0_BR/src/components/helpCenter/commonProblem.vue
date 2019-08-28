<template>
<el-container id="top">
  <el-main class="pro-box">
    <div class="pro-menu">
      <table class="table">
        <tr>
          <td><a href="#top">全部</a></td>
          <td><a href="#jurisdiction">权限问题</a></td>
          <td><a href="#appSet">手机&电脑设置</a></td>
          <td><a href="#appStore">价格&库存</a></td>
          <td><a href="#appPromotion">促销</a></td>
          <td><a href="#vipPro">会员相关问题</a></td>
        </tr>
        <tr>
          <td><a href="#billingProcess">开单流程问题</a></td>
          <td><a href="#appPay">收银</a></td>
          <td><a href="#orderPro">订单相关问题</a></td>
          <td><a href="#AfterSalePro">售后</a></td>
          <td><a href="#achievementPro">业绩问题</a></td>
          <td><a href="#appOther">其他问题</a></td>
        </tr>
      </table>
    </div>
    <div class="pro-list">
      <div id="jurisdiction" class="appItem">
        <div class="pro-title">一、权限问题</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp; 登录权限 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>使用PC电脑在ERM系统（访问地址：<a href="http://erm.ds.gome.com.cn" target="_blank">http://erm.ds.gome.com.cn</a>)进行账号激活操作，并设置登录密码</p>
            <p>第一步：请输入您的应用系统账号，如：LMP1112233；点击“获取密码”，会给入职时提供给人资的手机号发送短信验证码（若变更手机号了，请联系人资变更，次日生效）</p>
            <p>第二步：输入手机号接收到的短信初始密码，登录</p>
            <p>第三步：修改密码</p>
            <p>第四步  :就可以在PC ERM或者来购APP中登录</p>
            <p>第五步：首次使用的哪部手机登录的来购APP，后续继续使用哪部手机（包括smi卡）</p>
            <p>注：之前登录过ERM系统的门店员工，可使用应用系统账号密码直接登录APP</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;访问 PC ERM权限 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>无法访问地址：<a href="http://erm.ds.gome.com.cn" target="_blank">http://erm.ds.gome.com.cn</a></p>
            <p>请联系分部IT服务台，询问是否分配了权限。</p>
          </dd>
        </dl>
      </div>
      <div id="appSet" class="appItem">
        <div class="pro-title">二、手机&电脑设置</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;来购App不能正常使用，包括页面不能正常跳转，不能正常登录等 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>请按如下步骤排查设置</p>
            <p>第一，请检查来购App的设置，相关设置如下：</p>
            <p>苹果手机：进入“设置 → 来购 → 无线数据 →‘WLAN与蜂窝移动网’”</p>
            <p>安卓手机：进入“应用管理 → 来购 → 权限管理”，将“获取手机识别码”设为允许，同时开启“Wi-Fi”。</p>
            <p>注意：魅蓝3S手机必须要手动开启“手机识别码”</p>
            <p>第二，检查网络是否通畅</p>
            <p>第三，联系权限组，检查账号是否有权限</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;安卓版来购，下载完更新包，安装新版本失败 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>找到应用管理，找到国美App应用，然后点开，找到里面的清除默认设置，点击清除。重新打开来购App点击安装时别选择国美App，选择系统安装程序。</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;手机设备无法联网或者无法安装APP <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>可在PC端操作，访问地址：<a href="http://erm.ds.gome.com.cn" target="_blank">http://erm.ds.gome.com.cn</a>登陆账号权限和APP一致</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;无法登陆ERM进行操作 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>需要在浏览器输入正确的ERM地址，<a href="http://erm.ds.gome.com.cn" target="_blank">http://erm.ds.gome.com.cn</a>（错误地址：http://erm.gome.com.cn）</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;输入正确的地址但无法访问ERM <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.请检查浏览器版本，支持访问ERM的浏览器包括IE（IE9以上版本）、谷歌浏览器、火狐浏览器。如果门店里的电脑系统是WindowsXP系统，请联系分部IT解决安装浏览器的问题。</p>
            <p>2.若还是无法登陆，请联系分部IT服务台，询问是否分配了权限。</p>
          </dd>
        </dl>
      </div>
      <div id="appStore" class="appItem">
        <div class="pro-title">三、价格&库存</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;在各个界面看到的价格分别是什么价格 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>目前价格一共两种，价签价和活动价</p>
            <p>1、根据商品编码、商品名称搜索，价签二维码扫码出来的价格均为价签价；</p>
            <p>2、开单和扫码商品价格：根据供应商与业务机型显示价格，有活动优先显示活动价，无活动价显示价签价</p>
            <p>3、 如价签处为空白，为多个供应商或者多个业务机型，应再次进入二级页面进行查询及选择确认价格</p>
            <p>4、 如仍出现问题，首先查是不是样机，当前版本的来购无法售卖样机，如是样机请使用金力开单；如不是根据提示，联系业务处理后方可售卖。</p>
          </dd>
        </dl>
      </div>
      <div id="appPromotion" class="appItem">
        <div class="pro-title">四、促销</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;促销政策可查看多久的促销 <i class="el-icon-arrow-up"></i></dt>
          <dd>店长可查看未来7天内公司举办的即将开始的促销活动，普通员工可查看当前进行中的促销。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;有多品赠活动时，员工无法明确知道所选商品符合的多品赠活动 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>当加入导购车里的商品符合多品赠条件时，导购车上方有悬浮条提醒多品赠，点击可根据所选商品的商品编码查看多品赠促销活动。</p>
            <p>例如：导购车有商品1、商品2、商品3。当其中有任一商品符合多品赠活动，导购车上方有悬浮条。勾选商品1、商品2点击悬浮条，会筛选出来商品1、商品2同时满足的多品赠活动。</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;赠品分摊的规则是怎么样的？ <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1、赠品按售价参与主品分摊；</p>
            <p>
              <img src="../../assets/images/promotionImg01.png" alt="">
            </p>
            <p>计算公式：赠品折扣=赠品销售金额*（A/B/C/d销售净额1/（A销售净额1+B销售净额1+C销售净额1+d销售净额1））</p>
            <p>示例：上图各商品折扣计算过程：</p>
            <p>商品A：600*（1000/(1000+2000+3000+600)）=90.91元</p>
            <p>商品B：600*（2000/(1000+2000+3000+600)）=181.82元</p>
            <p>商品C：600*（3000/(1000+2000+3000+600)）=272.73元</p>
            <p>赠品d：600*（600/(1000+2000+3000+600)）=54.55元</p>
            <p>2、下表为该订单详情页中涉及的赠品分摊明细示例，其中本单分摊赠品金额预计=所有商品分摊赠品金额之和</p>
            <p>
              <img src="../../assets/images/promotionImg02.png" alt="">
            </p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;赠送美豆分摊的规则是怎么样的？ <i class="el-icon-arrow-up"></i></dt>
          <dd>各商品赠送美豆将按照商品价格比例进行分摊。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;美豆分为随机美豆和促销美豆 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>随机美豆购物即可获得，促销美豆为业务部配置促销活动</p>
            <p>注意：</p>
            <p>1、退货时，获赠美豆需同时退回</p>
            <p>2、购A商品获赠1000美豆，用于购买B商品，</p>
            <p>1）退A商品时，需退回1000美豆，如美豆数量不够，需从退款金额中扣减等值金额。</p>
            <p>2）退B商品时，退还顾客1000美豆。</p>
          </dd>
        </dl>
      </div>
      <div id="vipPro" class="appItem">
        <div class="pro-title">五、会员相关问题</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;员工app开卡失败 <i class="el-icon-arrow-up"></i></dt>
          <dd>开卡失败-针对会员用户的账号被冻结，被拉黑，老用户以及手机号被占用等数据异常的，页面上会有相应的提示语提示导购员，让顾客去服务台解决</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;顾客需要变更手机号 <i class="el-icon-arrow-up"></i></dt>
          <dd>ERM  pc端会员管理，根据顾客手机号或者卡号，查出顾客会员卡，点击“查看详情”按钮进入详情页面，首先验证顾客的原手机号后，输入一个可用的新手机号，完成变更。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;员工APP地址达到上限后，怎么办？ <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.	到服务台修改和删除</p>
            <p>2.	顾客自己到国美业务平台系统上操作收货地址，如国美app、pc、公众账号等</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;顾客需要新增、修改、删除收货地址 <i class="el-icon-arrow-up"></i></dt>
          <dd>ERM  pc端会员管理，根据顾客手机号或者卡号，查出顾客会员卡，点击“查看详情”按钮进入详情页面，点击“地址管理”按钮，只有门店店长、门店客服主管、门店客服专员权限可以对地址进行新增、修改和删除操作（app不可修改和删除）</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;需要查看顾客的资产信息 <i class="el-icon-arrow-up"></i></dt>
          <dd>ERM  pc端会员管理，根据顾客手机号或者卡号，查出顾客会员卡，点击“查看详情”按钮进入详情页面，可查看顾客信息以及资产（美豆和优惠券）情况</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;顾客会员卡已冻结，需要进行解冻操作 <i class="el-icon-arrow-up"></i></dt>
          <dd>ERM  pc端会员管理，根据顾客手机号或者卡号，查出顾客会员卡，选择已冻结的会员卡，点击“解冻/申请解冻”按钮，进行解冻操作。若是客服专员申请解冻的，需要客服主任审核。而客服主任可直接解冻操作</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;需要对顾客会员卡进行冻结操作 <i class="el-icon-arrow-up"></i></dt>
          <dd>ERM  pc端会员管理，根据顾客手机号或者卡号，查出顾客会员卡，选择需要冻结的会员卡，点击“冻结/申请冻结”按钮，进行冻结操作。若是客服专员申请冻结的，需要客服主任审核。而客服主任可直接冻结操作</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;需要用户升级操作 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>ERM  pc端会员管理，输入顾客手机号或者卡号，查出顾客会员卡，让用户选择一个会员卡，点击“升级”按钮，给用户手机号发送验证码，输入顾客给的验证码，做升级。</p>
            <p>升级后，该手机号对应的线上账号和线下会员卡资产进行合并。</p>
            <p>同时其他卡不在该系统中使用，只能走金立系统。</p>
            <p>升级的过程中，可遇到以下问题：</p>
            <p class="inden2">（1）	会员卡冻结了，先进行解冻，再做升级</p>
            <p class="inden2">（2）	门店老用户（融合以前使用线上账号登录过国美app）：使用新手机/激活手机号升级或者预留手机号升级</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;手机号在线渠道多账号有冲突 <i class="el-icon-arrow-up"></i></dt>
          <dd>ERM  pc端会员管理，输入手机号或者卡号查询，选择会员卡升级，需要店长和客服主管点击弹框中的“去操作”按钮，进入ERM会员查询页面，删除手机号只剩一个</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;手机号被用户名占用 <i class="el-icon-arrow-up"></i></dt>
          <dd>ERM  pc端会员管理，输入手机号或者卡号查询，选择会员卡升级，点击弹框中的“去操作”按钮，进入ERM会员详情页面，需要修改冲突的用户名</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;输入手机号或者卡号查询出会员卡，会员卡上的预留手机号非手机号格式 <i class="el-icon-arrow-up"></i></dt>
          <dd>ERM  pc端会员管理，点击页面右上角“完善手机号”，只有店长、主任、客服主管和客服专员有权限。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;提示：系统忙疯了，请稍后重试 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>联系相关技术人员</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;查询会员卡状态，根据状态展示相应的按钮汇总 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p><img src="../../assets/images/vipImg01.jpg" alt=""></p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;临时卡会员注意事项 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.	临时卡去款台交钱需告知用户订单号（手抄）</p>
            <p>2.	不支持赠券/赠豆、不支持预售</p>
            <p>3.	提货码：由导购员线下告知顾客提货码，无电子码。</p>
            <p>4.	临时卡不能二次购物</p>
          </dd>
        </dl>
      </div>
      <div id="billingProcess" class="appItem">
        <div class="pro-title">六、开单流程问题</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;商品获取方式 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.	来购APP扫商品标签上的二维码</p>
            <p>2.	输入商品名称或者编码搜索</p>
            <p>3.	导购页面选择</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;发票到哪里查看 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>员工和顾客均可以查看发票</p>
            <p>1、员工查看：登录来购App在导购单中详情查看</p>
            <p>2、顾客查看：用下单的会员卡登录国美App或手机网站（地址<a href="https://m.gome.com.cn" target="_blank">https://m.gome.com.cn</a>），在订单中可以查看订单的详细信息、发票和提货码。</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;下载发票方式 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.	订单详情中让顾客用微信扫发票二维码，信息同步到微信中</p>
            <p>2.	订单详情中，点击查看电子发票，下载prd文件</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;多品开单 <i class="el-icon-arrow-up"></i></dt>
          <dd>A、B、C导购员为同一个顾客开的不同导购单， A、B、C导购员都可以看到并且可以提交，但每个导购员只能编辑和删除自己开的导购单</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;预售相关问题 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.预售商品不参与任何优惠促销活动</p>
            <p>2.带货安装的商品不参与预售</p>
            <p>3.预售商品不锁库存的在待收定金订单详情页不显示改档入口</p>
            <p>4.预售商品锁库存的在待收定金订单详情页显示改档入口</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;售后带安的商品只能选安装时间，不能选送货时间，无法确定什么时候给顾客安装 <i class="el-icon-arrow-up"></i></dt>
          <dd>售后带安的商品，选择安装时间，同时就选择了送货时间，具体时间段以界面可选择的为准。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;三星、海尔400L以上冰箱，没有配送自提选项，无法来购销售 <i class="el-icon-arrow-up"></i></dt>
          <dd>目前的来购系统暂时不支持自提安装，三星、海尔400L不能配送自提，8月30日支持，8月30日以前在原金力系统里操作开单。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;建档时查询运能失败 <i class="el-icon-arrow-up"></i></dt>
          <dd>可能是物流业务没有维护门店的所属主DC，请联系物流业务查询门店所属的主DC是否配置。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;彩电送装一体，出现不安装处理方法 <i class="el-icon-arrow-up"></i></dt>
          <dd>需要物流会给顾客打电话进行安装确认。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;空调建档时出现不安装处理方法 <i class="el-icon-arrow-up"></i></dt>
          <dd>请联系当地售后，由当地售后上报总部售后进行四级地址缺失维护。</dd>
        </dl>
      </div>
      <div id="appPay" class="appItem">
        <div class="pro-title">七、收银</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;使用国美App扫描来购付款二维码失败 <i class="el-icon-arrow-up"></i></dt>
          <dd>来购APP里的支付码，是顾客使用自己的微信与支付宝扫码付款；不支持国美App扫码支付；</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;收款方式 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1. 来购支持支付宝和微信支付</p>
            <p>2．同一个会员多个订单合并支付需要在款台操作</p>
            <p>3．同一个支付，多种支付方式组合支付需要在款台操作</p>
            <p>4 .现金、银行卡、分期付款、商户卡、美通卡、商银卡支付需要到款台操作</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;预售尾款如何缴纳 <i class="el-icon-arrow-up"></i></dt>
          <dd>预售定金在哪里缴，尾款就在哪里缴。如在来购开单，使用微信、支付宝支付定金，则需使用微信、支付宝支付尾款；如果在款台交定金，则需在款台支付尾款。</dd>
        </dl>
      </div>
      <div id="orderPro" class="appItem">
        <div class="pro-title">八、订单相关问题</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;订单列表可查看多久的订单 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.	列表中展示近3个月的订单</p>
            <p>2.	通过手机号、订单号或者配送单号查询可查到全部时间的订单</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;无法取消订单，在来购中操作了取消订单，但物流仍然发货 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1、请先检查取消订单时服务台是否做了处理操作；</p>
            <p>2、检查服务台做了处理后店长是否做了审核操作；</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;导购员开单后，顾客何地可以查找该订单 <i class="el-icon-arrow-up"></i></dt>
          <dd>顾客在国美APP、WAP、网站上，使用开单的会员进行快速登录（短信验证码形式），我的订单中可找到该订单，可查看跟踪以及评价售后</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;来购开单后，顾客从国美App查不到订单 <i class="el-icon-arrow-up"></i></dt>
          <dd>请查看国美App版本，查看方式为打开国美App，点击“我的 → 设置 → 关于我们”，国美App需升级至5.3.1版本以上方可查看来购订单</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;提货码/签收码的叫法规则 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.	配送方式是门店自提方式时，名字为“提货码”，按钮名字为《查看提货码》</p>
            <p>2.	配送方式是国美配送+厂家带货安装时，名字为“签收码”，按钮名字为《查看签收码》</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;提货码在哪里查看 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>提货码查看有两处，一是顾客自己可通过收短信、登录国美App或者WAP站(<a href="https://m.gome.com.cn" target="_blank">https://m.gome.com.cn</a>)，在订单中查看；二是员工在来购APP-订单中查看，同样临时卡的顾客提货码都可以在一来购APP上查看</p>
            <p>提货码分为会员卡和临时卡，查看方式有所不同</p>
            <p>第一，会员卡顾客订单，提货码可以通过如下方式查询：</p>
            <p>1、发送到顾客手机的提货码短信;</p>
            <p>2、登录国美App或者WAP站(<a href="https://m.gome.com.cn" target="_blank">https://m.gome.com.cn</a>)，在订单中查看</p>
            <p>3、提货码可以在员工App和PC查看，并且在员工PC重新发送提货码。</p>
            <p>第二、临时卡顾客订单，可以在员工App查看</p>
          </dd>
        </dl>
      </div>
      <div id="AfterSalePro" class="appItem">
        <div class="pro-title">九、售后</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;所有彩电商品和挂架均无法支持选择安装 <i class="el-icon-arrow-up"></i></dt>
          <dd>开单时选择安装方式为“不安装”，正常开单售卖，物流公司会在送货时联系客户是坐装还是挂装进行做安装处理。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;厂家带安的配送单显示进入厂商配送中心，但厂家在ECP查不到订单，无法发货。 <i class="el-icon-arrow-up"></i></dt>
          <dd>厂商需要在ECP系统中查询微店订单，用27开头的订单号就可以下账发货。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;退换货如何办理以及审核 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>（1）顾客发起：国美主站（WAP、APP、PC）顾客登录-我的-退款/售后-申请售后里申请退换货。需服务台审核后再由店长二次进行审核后方可退货</p>
            <p>（2）门店员工发起：在来购APP-我的-退换货-申请退换货操作，店长一级审核即可。</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;退款相关环节如何提示 <i class="el-icon-arrow-up"></i></dt>
          <dd>顾客可通过国美主站（WAP、APP、PC）查看退款进度，同进可收到退款短信；在顾客收到的短信通知中查看，发货、赠豆、已支付、退货四个环节都有短信通知。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;订单中赠送的美豆、美券信息如何核对？ <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>具体操作及计算规则如下：</p>
            <p class="inden2">①	所赠美豆：如赠送，则展示该部分。默认系统自动扣除所赠美豆，如账户内剩余美豆不足，则默认扣款。如顾客不同意扣款，则可以手动勾选不同意扣款选项；</p>
            <p class="inden2">②	所赠美券：如赠送，则展示该部分。默认系统自动扣除所赠美券，如账户内所赠美券未被使用，则默认扣除；如账户内所赠美券被使用，则系统默认扣款；如账户内所赠美券存在其他种异常情况，则显示为已冻结状态，需要联系客服处理；如顾客不同意扣券或者扣款，则可以手动勾选不同意扣款选项；</p>
            <p class="inden2">③	实扣款总金额：系统通过美豆、美券的具体扣款情况计算得出；</p>
            <p class="inden2">④	实退款总金额=订单实付款总金额-实扣款总金额；</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;退换货商品所赠送的美豆、美券信息如何核对？ <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>具体操作及计算规则如下：</p>
            <p class="inden2">①	订单赠美豆或者美券，则展示该部分，不赠则不展示（该场景仅退货时存在，换货时不需要退美豆、美券）；</p>
            <p class="inden2">②	所赠美豆：默认系统自动扣除所赠美豆，如账户内剩余美豆不足，则默认扣款。如顾客不同意扣款，则可以手动勾选不同意扣款选项；</p>
            <p class="inden2">③	所赠美券：默认系统自动扣除所赠美券，如账户内所赠美券未被使用，则默认扣除；如账户内所赠美券被使用，则系统默认扣款；如账户内所赠美券存在其他种异常情况，则显示为已冻结状态，需要联系客服处理；如顾客不同意扣券或者扣款，则可以手动勾选不同意扣款选项；</p>
            <p class="inden2">④	实扣款总金额：系统通过美豆、美券的具体扣款情况计算得出；</p>
            <p class="inden2">⑤	实退款总金额=订单实付款总金额-实扣款总金额；</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;退货方式的展示规则是什么？ <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>根据原配送方式，系统自动匹配展示，具体规则如下：</p>
            <p class="inden2">①	当申请退货时，如原配送方式为门店自提，这里展示为：退回门店；</p>
            <p class="inden2">②	当申请退货时，如原配送方式为国美配送，这里展示为：物流上门取货；（备注：商品为大件，按照以上规则展示，3C小件则展示：退回门店）；</p>
            <p class="inden2">③	当申请换货时，如原配送方式为门店自提，这里展示为：退回门店；</p>
            <p class="inden2">④	当申请换货时，如原配送方式为国美配送，这里展示为：物流上门取货；（备注：商品为大件，按照以上规则展示，3C小件则展示：退回门店）；</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;赠品支持退换货吗？ <i class="el-icon-arrow-up"></i></dt>
          <dd>如果订单中包含赠品，系统会根据相应计算规则，对订单中的所有商品进行金额分摊，其中赠品也会分摊部分金额。因此，赠品跟普通商品一样，享受退换货的权益。</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;顾客要求退货时系统状态展示以及相应的操作 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>
              <img src="../../assets/images/promotionImg03.jpg" alt="">
            </p>
            <p>
              <img src="../../assets/images/promotionImg04.jpg" alt="">
            </p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;申请退换货后，未看到待审核的退款单 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>申请退换货后或者拒收之后，不是马上能在待审核列表看见待审核的退款单，必须是货物已经退回到仓库，并且仓库人员维护了退货入库状态后（可在物流履历里面进行查看，当状态变为RT时代表货物已经入库），PC服务台才能查询到待审核的退款单，进行审核退款。</p>
          </dd>
        </dl>
      </div>
      <div id="achievementPro" class="appItem">
        <div class="pro-title">十、业绩问题</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;提奖预告金额何处查看 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.	商品提奖金额：来购APP导购页商品列表—按住左滑可查看提奖限价和提奖金额；PC ERM端商品列表，将鼠标浮钱袋上可查看提奖限价和提奖金额</p>
            <p>2.	延保提奖金额：来购APP开单或者补够延保页面右上角点击“显示全部延保TJ”或者左滑；PC ERM端，开单或者补够延保页面勾选上“显示TJ”</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;如何查看销售业绩 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>目前店长、主任和促销员，可以在来购中查看到销售业绩，其中：</p>
            <p>来购App：在来购App中，从“我—销售分析”进入可以查看来购<span class="red">开单、金力开单和自有员工分享的销售记录</span>，可以查看到销售总额、台数，以及各品类、品牌的销售总额台数。</p>
            <p class="inden2">•	能查询的时间范围：2017年1月1日到头一天的销售记录，单次最长查询时间不能超过三个月。默认是当月1日到昨天的销售记录统计。</p>
            <p class="inden2">•	查询的数据权限：店长、副店长看门店所有销售，主任查看所管辖的品类所有销售，营业员、促销员查看自己开单的所有销售。</p>
            <p>来购PC：店长、主任可以在电脑登录ERM，点击左侧的“来购管理系统报表查询销售报表”，即可查看当天的来购销售情况。</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;促销费在哪里查看？ <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>来购中可以查看促销费，从“我—我的提奖“可以查看个人的促销费合计及明细。其中，店长、主任查看到的都是按照公司制定的促销费规则分摊到个人的部分。如发现促销费与别的渠道查到的有出入，请检查：</p>
            <p>1、促销费规则是否在有效期，比如同一商品，其他渠道查到的促销费为51，在查询结果中只查到了26。</p>
            <p>2、查看促销费的人员岗位，不同的岗位，实时通知的促销费，分成比例不一样。</p>
          </dd>
        </dl>
      </div>
      <div id="appOther" class="appItem">
        <div class="pro-title">十一、其他问题</div>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;需要更改岗位 <i class="el-icon-arrow-up"></i></dt>
          <dd>若需要切换岗位，需退出登录</dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;哪些功能在App上，哪些功能在PC上操作 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>来购App功能有：开卡、开单（一单一品、一单多品）、促销优惠（买即赠、多品赠、赠豆、预售）、建档、二维码扫码支付（微信、支付宝）、消息推送、订单查看、提货码查看、申请退换货；</p>
            <p>ERM-pc系统功能有：开卡、开单（一单一品、一单多品）、促销优惠（买即赠、多品赠、赠豆、预售）、建档/改档、库存查询、会员信息维护、订单查询、订单删单/导购单册单、PC款台支付、退换货处理操作审核等操作。</p>
            <p>运营商、彩票、样机、对公、赠送美券仍旧需要在金力操作</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;使用来购碰到问题需要帮助怎么办？ <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>将碰到的问题上报值ITSM运维平台，会有专人跟进处理，上报ITSM运维平台有两种登录方式：</p>
            <p>1.登录网址：<a href="http://itsm.gome.inc/ess.do" target="_blank">http://itsm.gome.inc/ess.do</a>&gt;</p>
            <p>2.登录&lt;国美企业门户：<a href="http://oa.gome.inc" target="_blank">http://oa.gome.inc</a>&gt;</p>
            <p class="inden2">（1）点击左边菜单栏“ITSM运维平台”</p>
            <p class="inden2">（2）选择ITSM运维平台_自服务入口(见操作手册)</p>
          </dd>
        </dl>
        <dl class="pro-name height28">
          <dt title="点击折叠和展开">·&nbsp;&nbsp;若以上问题无法解答，反馈问题途径 <i class="el-icon-arrow-up"></i></dt>
          <dd>
            <p>1.员工在门店微信群中反馈当天所遇问题，店长负责归纳汇总上报至分部解决群，由大区培训讲师负责解答。</p>
            <p>2.如大区讲师遇到无法解决的问题，需由大区培训讲师将问题汇总后反馈至大区中台上线指挥微信群中，由相关技术人员负责解答。</p>
          </dd>
        </dl>
      </div>
    </div>
    <div class="gotop" v-show="gotopShow">
      <a href="javascript:;" @click="gotop"><i class="order-btn-ico"></i>返回顶部</a>
    </div>
  </el-main>
</el-container>
</template>
<script>
export default {
  data(){
    return {
      topSh:0,
      gotopShow:false
    }
  },
  created:function(){

  },
  mounted:function(){
    let _this = this
    window.onscroll = function(){
      let t = document.documentElement.scrollTop || document.body.scrollTop
      _this.topSh = t
      if(t > 500){
        _this.gotopShow = true
      }else{
        _this.gotopShow = false
      }
    }
    let proNames = document.querySelectorAll('.pro-name')
    proNames.forEach(function(value, index, array){
      let dt = array[index].getElementsByTagName('dt')[0]
      let dd = array[index].getElementsByTagName('dd')[0]
      dt.onclick = function(){
        for(let i = 0; i<proNames.length; i++){
          if(index !== i){
            proNames[i].className = "pro-name height28"
            proNames[i].className = "pro-name height28"
            proNames[i].getElementsByTagName('i')[0].className = "el-icon-arrow-up"
          }
        }
        if(array[index].className.indexOf("height28") == "-1"){
          array[index].className += " height28"
          array[index].getElementsByTagName('i')[0].className = "el-icon-arrow-up"
        }else{
          array[index].className = "pro-name"
          array[index].getElementsByTagName('i')[0].className = "el-icon-arrow-down"
        }
      }
    })
  },
  methods:{
    gotop(){
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this.gotopShow = false
      this.topSh = 0
    }
  }
}
</script>
<style lang="stylus" scoped>
.order-btn-ico
  display inline-block
  width 0
  height 0
  border-left 4px solid transparent
  border-right 4px solid transparent
  border-top 8px solid #333
  transition all ease .3s
  transform scale(1.3)
.red
  color red
.small
  font-size 12px
  line-height 1em !important
  color #069
.inden2
  text-indent 3em
.height28
  height 28px !important
  overflow hidden !important
.pro-box
  border 1px solid #ccc
  .gotop
    position fixed
    right 30px
    bottom 30px
    cursor pointer
    font-size 14px
    width 18px
    text-align center
    a
      color #409eff
    .order-btn-ico
      border-top 8px solid #409eff
      transform rotate(180deg)
  .pro-menu
    margin-bottom 15px
    table
      border-collapse collapse
      width 70%
      text-align center
      color #069
      tr
        margin-bottom 15px
        td
          border 1px solid #ccc
          height 2em
          background #f2f2f2
          a
            color #069
            text-decoration none
            &:hover
              color red
  .pro-list
    .appItem
      margin-bottom 25px
    .pro-title
      font-weight bold
      font-size 18px
      margin-bottom 20px
    .pro-name
      height auto
      overflow auto
      transition all ease .3s
    dl
      margin-bottom 15px
      text-indent 2em
      dt
        font-weight bold
        line-height 2em
        margin-bottom 10px
        cursor pointer
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        .el-icon-arrow-up,.el-icon-arrow-down
          font-weight bold
        &:hover
          color #409eff
      dd
        line-height 1.5em
        margin-left 20px
        padding-left 10px
        background rgb(242, 242, 242)
        text-indent 1em
        p
          line-height 1.5em
          padding 0 10px
          text-indent 1em
          padding-bottom .5em
        .itsm
          width 20%
          cursor pointer
          transition all ease .3s
        .itsmJpgBig
          width 80%
</style>
