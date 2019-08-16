<template>
  <div class="usercreat">
    <div>{{attribute}}</div>
    <input name="baseinfo.site" v-validate="'required'" :class="{'error': errors.has('baseinfo.site')}"/>
    <div class="m_left m_fl">
      <div class="attr_one" v-if="memberattrselect || registerselect || timeselect || vipLevelselect || grawselect || emailselect || phoneselect || bindcardselect || inmebselect || sexselect || birthselect || ageselect || zhiyeselect || cityselect">
        <!-- tittle -->
        <div class="M_tittle">
          <div class="clearfix">
            <h3 class="m_fl">基本属性筛选</h3>
          </div>
        </div>
        <!-- 基本属性筛选 -->
        <div class="base_attr">
          <div class="form-group" v-if="memberattrselect" v-bind:class="{'show':memberattrselect==true}">
            <span class="attr_left">人群属性</span>
            <label class="pos-rel mr15"  >
                <input type="radio" disabled class="ace" name="baseinfo.isVip" value="1" v-model="attribute.baseinfo.isVip" v-validate="'required'" :class="{'error': errors.has('baseinfo.isVip')}">
                <span class="lbl"></span>
                会员
            </label>
            <label class="pos-rel mr15">
                <input type="radio" disabled class="ace" name="baseinfo.isVip" value="2" v-model="attribute.baseinfo.isVip">
                <span class="lbl"></span>
                访客
            </label>
            <span class="m_fr mr10 del_btn" @click="delmemberchange">×</span>
            <div class="error_on" v-show="errors.has('baseinfo.isVip')">请完善用户信息</div>
          </div>
          <div class="form-group" v-if="registerselect" v-bind:class="{'show':registerselect==true}">
            <span class="attr_left">注册站点</span>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="PC" name="baseinfo.site" v-model="attribute.baseinfo.site" v-validate="'required'" :class="{'error': errors.has('baseinfo.site')}">
                <span class="lbl"></span>
                PC
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="WAP" v-model="attribute.baseinfo.site">
                <span class="lbl"></span>
                WAP
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="APP" v-model="attribute.baseinfo.site">
                <span class="lbl"></span>
                APP
            </label>
            <span class="m_fr mr10 del_btn" @click="delregisterchange">×</span>
            <div class="error_on" v-show="errors.has('baseinfo.site')">请完善用户站点信息</div>
          </div>
          <div class="form-group clearfix" v-if="timeselect"> <!-- v-show="timeselect" -->
            <span class="attr_left m_fl line_height">注册时间</span>
            <uselect v-on:changetypedata="registerdata" :selecttype="attribute.baseinfo.registerDaysCondition" :Vrelative="attribute.baseinfo.registerDaysRelative" :intime ="attribute.baseinfo.registerDays"></uselect>
            <!-- <input v-show="attribute.baseinfo.registerDaysCondition === '1'" v-model="attribute.baseinfo.registerDays" name="baseinfo.registerDays" v-validate="'required'" :class="{'error': errors.has('baseinfo.registerDays')}"/> -->
            <!-- <div name="baseinfo.registerDays" v-validate="'required'" :class="{'error': errors.has('baseinfo.registerDays')}"></div> -->
            <div class="error_on nopdleft" name="baseinfo.registerDays" v-validate="'required'" v-show="errors.has('baseinfo.registerDays')">请填写绝对时间111111111</div>
            <span class="m_fr mr10 del_btn" @click="deltimechange">×</span>
          </div>
          <div class="form-group" v-if="vipLevelselect">
              <span class="attr_left">会员等级</span>
              <label class="pos-rel mr15">
                  <input type="checkbox" class="ace" value="G1" name="baseinfo.vipLevel" v-model="attribute.baseinfo.vipLevel" v-validate="'required'" :class="{'error': errors.has('baseinfo.vipLevel')}">
                  <span class="lbl"></span>
                  G1
              </label>
              <label class="pos-rel mr15">
                  <input type="checkbox" class="ace" value="G2" v-model="attribute.baseinfo.vipLevel">
                  <span class="lbl"></span>
                  G2
              </label>
              <label class="pos-rel mr15">
                  <input type="checkbox" class="ace" value="G3" v-model="attribute.baseinfo.vipLevel">
                  <span class="lbl"></span>
                  G3
              </label>
              <label class="pos-rel mr15">
                  <input type="checkbox" class="ace" value="G4" v-model="attribute.baseinfo.vipLevel">
                  <span class="lbl"></span>
                  G4
              </label>
              <label class="pos-rel mr15">
                  <input type="checkbox" class="ace" value="G5" v-model="attribute.baseinfo.vipLevel">
                  <span class="lbl"></span>
                  G5
              </label>
              <!-- <label class="pos-rel mr15">
                  <input type="checkbox" class="ace" value="G6" v-model="attribute.baseinfo.vipLevel">
                  <span class="lbl"></span>
                  G6
              </label> -->
              <span class="m_fr mr10 del_btn" @click="delvipLevelchange">×</span>
              <div class="error_on" v-show="errors.has('baseinfo.vipLevel')">请完善会员等级信息</div>
          </div>
          <div class="form-group clearfix" v-if="grawselect">
            <span class="attr_left m_fl line_height">成长值</span>
            <Sectionselect v-on:qujiandata="grawdata" :qujian="attribute.baseinfo.grawCondition" :data1="attribute.baseinfo.graw1" :data2="attribute.baseinfo.graw2"></Sectionselect>
            <span class="m_fr mr10 del_btn" @click="delgrawchange">×</span>
          </div>
          <div class="form-group" v-if="emailselect">
            <span class="attr_left">邮箱验证</span>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.isEmailValid" value="1" v-model="attribute.baseinfo.isEmailValid" v-validate="'required'" :class="{'error': errors.has('baseinfo.isEmailValid')}">
                <span class="lbl"></span>
                是
            </label>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.isEmailValid" value="0" v-model="attribute.baseinfo.isEmailValid">
                <span class="lbl"></span>
                否
            </label>
            <span class="m_fr mr10 del_btn" @click="delemailchange">×</span>
            <div class="error_on" v-show="errors.has('baseinfo.isEmailValid')">请完善用户邮箱验证信息</div>
          </div>
          <div class="form-group" v-if="phoneselect">
            <span class="attr_left">手机验证</span>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.isPhoneValid" value="1" v-model="attribute.baseinfo.isPhoneValid" v-validate="'required'" :class="{'error': errors.has('baseinfo.isPhoneValid')}">
                <span class="lbl"></span>
                是
            </label>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.isPhoneValid" value="0" v-model="attribute.baseinfo.isPhoneValid">
                <span class="lbl"></span>否
            </label>
            <span class="m_fr mr10 del_btn" @click="delphonechange">×</span>
            <div class="error_on" v-show="errors.has('baseinfo.isPhoneValid')">请完善用户手机验证信息</div>
          </div>
          <div class="form-group" v-if="bindcardselect">
            <span class="attr_left">已绑卡用户</span>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.isBindCard" value="1" v-model="attribute.baseinfo.isBindCard" v-validate="'required'" :class="{'error': errors.has('baseinfo.isBindCard')}">
                <span class="lbl"></span>
                是
            </label>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.isBindCard" value="0" v-model="attribute.baseinfo.isBindCard">
                <span class="lbl"></span>
                否
            </label>
            <span class="m_fr mr10 del_btn" @click="delbindcardchange">×</span>
            <div class="error_on" v-show="errors.has('baseinfo.isBindCard')">请完善用户绑定银行卡信息</div>
          </div>
          <div class="form-group" v-if="inmebselect">
            <span class="attr_left">内部员工</span>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.isInnerStaff" value="1" v-model="attribute.baseinfo.isInnerStaff" v-validate="'required'" :class="{'error': errors.has('baseinfo.isInnerStaff')}">
                <span class="lbl"></span>
                是
            </label>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.isInnerStaff" value="0" v-model="attribute.baseinfo.isInnerStaff">
                <span class="lbl"></span>
                否
            </label>
            <span class="m_fr mr10 del_btn" @click="delinmebchange">×</span>
            <div class="error_on" v-show="errors.has('baseinfo.isInnerStaff')">请选择是否为内部员工</div>
          </div>
          <div class="form-group" v-if="sexselect ">
            <span class="attr_left">性别</span>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.sex" value="1" v-model="attribute.baseinfo.sex" v-validate="'required'" :class="{'error': errors.has('baseinfo.sex')}">
                <span class="lbl"></span>
                男
            </label>
            <label class="pos-rel mr15">
                <input type="radio" class="ace" name="baseinfo.sex" value="0" v-model="attribute.baseinfo.sex">
                <span class="lbl"></span>
                女
            </label>
            <span class="m_fr mr10 del_btn" @click="delsexchange">×</span>
            <div class="error_on" v-show="errors.has('baseinfo.sex')">请完善用户性别信息</div>
          </div>
           <div class="form-group clearfix" v-if="birthselect">
            <span class="attr_left m_fl line_height">生日</span>
            <uselect v-on:changetypedata="birthdata" :selecttype="attribute.baseinfo.birthdayCondition" :Vrelative="attribute.baseinfo.birthdayRelative" :intime ="attribute.baseinfo.birthdayAbsolute"></uselect>
            <span class="m_fr mr10 del_btn" @click="delbirthchange">×</span>
          </div>
          <div class="form-group clearfix" v-if="ageselect">
            <span class="attr_left m_fl line_height">年龄</span>
            <Sectionselect :data1="attribute.baseinfo.age1" :data2="attribute.baseinfo.age2" :qujian="attribute.baseinfo.ageCondition"  v-on:qujiandata="agedata" ></Sectionselect>
            <span class="m_fr mr10 del_btn" @click="delagechange">×</span>
          </div>
          <div class="form-group cl clearfix" v-if="zhiyeselect">
            <span class="attr_left m_fl">职业</span>
            <div class="m_fl" style="width:486px;">
            <label class="pos-rel mr15">
              <input type="checkbox" class="ace" value="1" name="baseinfo.profession" v-model="attribute.baseinfo.profession"  v-validate="'required'" :class="{'error': errors.has('baseinfo.profession')}">
              <span class="lbl"></span>
              不限
            </label>
            <label class="pos-rel mr15">
              <input type="checkbox" class="ace" value="2" v-model="attribute.baseinfo.profession">
              <span class="lbl"></span>
              企业雇主/企业经营者
            </label>
            <label class="pos-rel mr15">
              <input type="checkbox" class="ace" value="3" v-model="attribute.baseinfo.profession">
              <span class="lbl"></span>
              高级行政人员
            </label>
            <label class="pos-rel mr15">
              <input type="checkbox" class="ace" value="4" v-model="attribute.baseinfo.profession">
              <span class="lbl"></span>
              中层管理人员
            </label>
            <label class="pos-rel mr15">
              <input type="checkbox" class="ace" value="5" v-model="attribute.baseinfo.profession">
              <span class="lbl"></span>
              专业人士
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="6" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                办公人员
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="7" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                工人/蓝领
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="8" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                公务员/事业单位员工
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="9" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                自由职业者
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="10" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                军人
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="11" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                学生
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="12" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                退休
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="13" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                家庭主妇
            </label>
            <label class="pos-rel mr15">
                <input type="checkbox" class="ace" value="14" v-model="attribute.baseinfo.profession">
                <span class="lbl"></span>
                其他
            </label>
            <span class="m_fr mr10 del_btn" @click="delzhiyechange">×</span>
            <div class="error_on" style="padding-left:0;" v-show="errors.has('baseinfo.profession')">请完善用户职业信息</div>
          </div>
          </div>
          <div class="form-group clearfix" v-if="cityselect">
            <span class="attr_left m_fl">省市地域</span>
            <region-picker multiple :data="citylist" placeholder="请选择省市地域" name="baseinfo.city" v-model="attribute.baseinfo.city" v-validate="'required'" :class="{'error': errors.has('baseinfo.city')}"></region-picker>
            <!-- <span class="clearBtn" @click="clearBtn">清空</span> -->
            <span class="m_fr mr10 del_btn" @click="delcitychange">×</span>
            <div class="error_on" v-show="errors.has('baseinfo.city')">请完善会员地域信息</div>
          </div>
        </div>
      </div>
      <div class="attr_two" v-if="actionselect">
        <!-- tittle -->
        <div class="M_tittle">
          <div class="clearfix">
            <h3 class="m_fl">行为属性</h3>
          </div>
        </div>
        <!-- 行为属性 -->
        <div class="clearfix base_attr">
          <div>
            <div class="form-group">
              <span class="attr_left">行为关系</span>
              <label class="pos-rel mr15">
                  <input type="radio" class="ace" name="jihe" value="or" v-model="attribute.behavior.composite">
                  <span class="lbl"></span>
                  并集
              </label>
              <label class="pos-rel mr15">
                  <input type="radio" class="ace" name="jihe" value="and" v-model="attribute.behavior.composite">
                  <span class="lbl"></span>
                  交集
              </label>
            </div>
            <div class="form-group"   v-for="(val, index) in attribute.behavior.list" :key="index">
              <span class="attr_left">用户行为</span><i class="">近</i>
              <el-select name="days" v-model="val.days" v-validate="'required'" :class="{'error': errors.has('days')}" style="width:100px; height:30px; padding:0 0 0 5px;">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="error_on" v-show="errors.has('days')">请完善用户行为信息</div>
              <div class="select_action clearfix">
                <div class="m_fl">行为：</div>
                <div class="m_fl select_action_list">
                <label class="pos-rel mr15">
                    <input type="checkbox" class="ace" value="0" name="userAction" v-model="val.userAction" v-validate="'required'" :class="{'error': errors.has('userAction')}">
                    <span class="lbl"></span>
                    加购
                </label>
                <label class="pos-rel mr15">
                    <input type="checkbox" class="ace" value="1" name="userAction" v-model="val.userAction">
                    <span class="lbl"></span>
                    浏览
                </label>
                <label class="pos-rel mr15">
                    <input type="checkbox" class="ace" value="2" name="userAction" v-model="val.userAction">
                    <span class="lbl"></span>
                    搜索
                </label>
                <label class="pos-rel mr15">
                    <input type="checkbox" class="ace" value="3" name="userAction" v-model="val.userAction">
                    <span class="lbl"></span>
                    购买
                </label>
                <label class="pos-rel mr15">
                    <input type="checkbox" class="ace" value="4" name="userAction" v-model="val.userAction">
                    <span class="lbl"></span>
                    活跃
                </label>
                <label class="pos-rel mr15">
                    <input type="checkbox" class="ace" value="5" name="userAction" v-model="val.userAction">
                    <span class="lbl"></span>
                    过滤已购买
                </label>
                </div>
                <div class="error_on nopdleft" v-show="errors.has('userAction')">请完善会员行为信息</div>
              </div>
              <div class="brad_out clearfix">
                <span class="m_fl brand">品类</span>
                <region-picker multiple placeholder="请选择品类名称" :data="catIdlist" name="cat1Id" v-model="val.cat1Id"></region-picker>
              </div>
              <!-- <div class="error_on" v-show="errors.has('cat1Id')">请完善品类信息</div> -->
              <div class="brad_out clearfix">
                <span class="m_fl brand">品牌</span>
                <region-picker multiple placeholder="请选择品牌名称" :max-level="1" :data="brandlist" name="brandId" v-model="val.brandId" ></region-picker> <!-- v-validate="'required'" :class="{'error': errors.has('brandId')}" -->
              </div>
              <div class="error_on" v-show="chooseOneState">请至少选择一个品牌或品类信息</div>
              <span class="m_fr mr10 del_btn" @click="delactionchange(index)">×</span>
            </div>
            <div v-show="actionselect">
              <a href="#"><span class="add_btn_attr">+</span><span class="text_c" @click="addcomponent">添加</span></a>
              <a href="#"><span class="del_btn_attr">-</span><span class="text_c" @click="delcomponent(attribute.behavior.list.length)">删除</span></a>
            </div>
          </div>
        </div>
      </div>
      <div class="attr_three" v-if="firstorderselect || lastorderselect || ordervalueselect || ordernumselect || cycleselect || cuspriceselect || singlepriceselect">
        <!-- tittle -->
        <div class="M_tittle">
          <div class="clearfix">
            <h3 class="m_fl">RFM模型属性</h3>
          </div>
        </div>
        <!-- RFM模型属性 -->
        <div class="clearfix base_attr">
          <div class="form-group clearfix" v-if="firstorderselect">
            <span class="attr_left m_fl line_height">首次下单时间</span>
            <uselect v-on:changetypedata="firstorderdata" :selecttype="attribute.rfm.firstBuyCondition" :Vrelative="attribute.rfm.firstBuyRelative" :intime ="attribute.rfm.firstBuyAbsolute"></uselect>
            <span class="m_fr mr10 del_btn" @click="delfirstorderchange">×</span>
          </div>
           <div class="form-group clearfix" v-if="lastorderselect">
            <span class="attr_left m_fl line_height">最后下单时间</span>
            <uselect v-on:changetypedata="lastorderdata" :selecttype="attribute.rfm.lastBuyCondition" :Vrelative="attribute.rfm.lastBuyRelative" :intime ="attribute.rfm.lastBuyDate"></uselect>
            <span class="m_fr mr10 del_btn" @click="dellastorderchange">×</span>
          </div>
          <div class="form-group clearfix" v-if="ordervalueselect">
            <span class="attr_left m_fl line_height">下单金额</span>
            <Sectionselect v-on:qujiandata="ordervaluedata" :data1="attribute.rfm.buyAmt" :data2="attribute.rfm.buyAmt2" :qujian="attribute.rfm.buyAmtCondition"></Sectionselect>
            <span class="m_fr mr10 del_btn" @click="delordervaluechange">×</span>
          </div>
          <div class="form-group clearfix" v-if="ordernumselect">
            <span class="attr_left m_fl line_height">下单次数</span>
            <Sectionselect v-on:qujiandata="ordernumdata" :data1="attribute.rfm.buyTimes" :data2="attribute.rfm.buyTimes2" :qujian="attribute.rfm.buyTimesCondition"></Sectionselect>
            <span class="m_fr mr10 del_btn" @click="delordernumchange">×</span>
          </div>
          <div class="form-group clearfix" v-if="cycleselect">
            <span class="attr_left m_fl line_height">客户回购周期</span>
            <Sectionselect v-on:qujiandata="cycledata" :data1="attribute.rfm.buyCycle1" :data2="attribute.rfm.buyCycle2" :qujian="attribute.rfm.buyCycleCondition"></Sectionselect>
            <span class="m_fr mr10 del_btn" @click="delcyclechange">×</span>
          </div>
          <div class="form-group clearfix" v-if="cuspriceselect">
            <span class="attr_left m_fl line_height">客单价</span>
            <Sectionselect v-on:qujiandata="cuspricedata" :data1="attribute.rfm.perAmt" :data2="attribute.rfm.perAmt2" :qujian="attribute.rfm.perAmtCondition"></Sectionselect>
            <span class="m_fr mr10 del_btn" @click="delcuspricechange">×</span>
          </div>
          <div class="form-group clearfix" v-if="singlepriceselect">
            <span class="attr_left m_fl line_height">件单价</span>
            <Sectionselect v-on:qujiandata="singlepricedata" :data1="attribute.rfm.perPrice1" :data2="attribute.rfm.perPrice2" :qujian="attribute.rfm.perPriceCondition"></Sectionselect>
            <span class="m_fr mr10 del_btn" @click="delsinglepricechange">×</span>
          </div>
        </div>
      </div>
      <div class="attr_four" v-show="gomebeanselect">
        <!-- tittle -->
        <div class="M_tittle">
          <div class="clearfix">
            <h3 class="m_fl">用户资产</h3>
          </div>
        </div>
        <!-- 用户资产 -->
        <div class="base_attr">
          <div class="form-group clearfix" v-if="gomebeanselect">
            <span class="attr_left m_fl line_height">美豆</span>
            <Sectionselect v-on:qujiandata="gomebeandata" :qujian="attribute.userAsset.gomeBeanCondition" :data1="attribute.userAsset.gomeBean1" :data2="attribute.userAsset.gomeBean2"></Sectionselect>
            <span class="m_fr mr10 del_btn" @click="delgomebeanchange">×</span>
          </div>
        </div>
      </div>
      <div class="attr_five">
        <!-- tittle -->
        <div class="M_tittle">
          <div class="clearfix">
            <h3 class="m_fl">人群信息</h3>
          </div>
        </div>
        <!-- 人群信息 -->
        <div class="base_attr">
          <div class="form-group">
            <span class="attr_left">人群名称</span>
            <input type="text" name="crowdinfo.name" v-model="attribute.crowdinfo.name" v-on:blur="userNameCheck" v-validate="'required|min:4|max:24'" :class="{'el-icon-check': sameOk,'error': errors.has('crowdinfo.name')}">
          </div>
          <div class="error_on" v-show="errors.has('crowdinfo.name')">人群名称长度只能在4-20个字符之间</div>
          <div class="error_on" v-show="sameName">人群名称已存在</div>
          <div class="form-group">
            <span class="attr_left">覆盖人数</span>
            <input class="none_input" type="text" readonly="true" name="crowdinfo.userCount" v-model="attribute.crowdinfo.userCount" ><span class="ml10" >人</span>
            <input class="none_input" type="text" readonly="true" name="crowdinfo.totalCount" v-model="attribute.crowdinfo.percent"><span class="ml10" >%</span>
            <a class="btn btn-primary green ml10" type="button" v-if="authorizedData.mms_group_count_newgroup" @click="calculate" :disabled="calculateState">计算</a>
          </div>
          <div class="error_on"><span v-show="usercountErr">请先计算覆盖人数</span></div>
        </div>
      </div>
      <div class="from_bottom">
        <a class="btn btn-primary" type="button" @click="saveBtn"  v-if="authorizedData.mms_group_save_newgroup">保存</a>
        <a class="btn btn-primary clear_btn" type="button" @click="resetBtn"  v-if="authorizedData.mms_group_reset_newgroup">重置</a>
        <a class="btn btn-primary goback_btn" type="button" @click="backBtn"  v-if="authorizedData.mms_group_back_newgroup">返回</a>
      </div>
    </div>
    <div class="m_right m_fl">
      <el-collapse>
        <el-collapse-item title="基本属性" name="1">
          <ul class="attr_select clearfix">
            <li class="m_fl" @click="memberchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="包含会员及访客;会员：已注册且有用户ID的会员,访客：没有用户ID的（未登录）访客">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':memberattrselect==true}">人群属性</el-button> <!-- v-bind:class="{'is-active':isA==1}" -->
            </li>
            <li class="m_fl" @click="registerchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户注册站点">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':registerselect==true}">注册站点</el-button>
            </li>
            <li class="m_fl" @click="timechange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户注册时间">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':timeselect==true}">注册时间</el-button>
            </li>
            <li class="m_fl" @click="vipLevelchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="当前的会员等级">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':vipLevelselect==true}">会员等级</el-button>
            </li>
            <li class="m_fl" @click="grawchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="当前的会员成长值">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':grawselect==true}">成长值</el-button>
            </li>
            <li class="m_fl" @click="emailchange" >
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户邮箱激活状态">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':emailselect==true}">邮箱验证</el-button>
            </li>
            <li class="m_fl" @click="phonechange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户手机激活状态">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':phoneselect==true}">手机验证</el-button>
            </li>
            <li class="m_fl" @click="bindcardchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户门店会员卡绑定状态">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':bindcardselect==true}">已绑卡用户</el-button>
            </li>
            <li class="m_fl" @click="inmebchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户是否为内部员工">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':inmebselect==true}">内部员工</el-button>
            </li>
            <li class="m_fl" @click="sexchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户性别，以用户在我的国美-基本资料中填写的性别信息为准">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':sexselect==true}">性别</el-button>
            </li>
            <li class="m_fl" @click="birthchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户生日，以用户在我的国美-基本资料中填写的生日信息为准">
              </el-popover>
              <el-button v-popover:popover1  v-bind:class="{'is-active':birthselect==true}">生日</el-button>
            </li>
            <li class="m_fl" @click="agechange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户年龄，根据用户在我的国美-基本资料中填写的生日信息进行推算结果">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':ageselect==true}">年龄</el-button>
            </li>
            <li class="m_fl"  @click="zhiyechange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户职业，以用户在我的国美-基本资料填写的职业信息为准">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':zhiyeselect==true}">职业</el-button>
            </li>
            <li class="m_fl" @click="citychange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户所在省市地域，以用户有效订单中（已支付和货到付款）最后一次收货地址为准，若无订单信息，则以用户登录最近一次IP地址为准">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':cityselect==true}">省市地域</el-button>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="行为属性" name="2">
          <ul class="attr_select clearfix">
            <li class="m_fl" @click="actionchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户近期产生浏览、搜索、加购、购买、活跃行为分析">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':actionselect==true}">用户行为</el-button>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="RFM模型" name="3">
          <ul class="attr_select clearfix">
            <li class="m_fl" @click="firstorderchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户实物订单中的有效订单中（已支付和货到付款），第一笔订单的时间">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':firstorderselect==true}">首次下单时间</el-button>
            </li>
            <li class="m_fl" @click="lastorderchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户实物订单中的有效订单中（已支付和货到付款）最后一笔订单的时间">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':lastorderselect==true}">最后下单时间</el-button>
            </li>
            <li class="m_fl" @click="ordervaluechange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户实物订单中的有效订单中所有订单的累计订单金额">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':ordervalueselect==true}">下单金额</el-button>
            </li>
            <li class="m_fl" @click="ordernumchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户实物订单中的有效订单中所有订单的累计订单笔数">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':ordernumselect==true}">下单次数</el-button>
            </li>
            <li class="m_fl" @click="cyclechange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户最后一笔有效订单时间减去倒数第二笔有效订单时间的天数差值">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':cycleselect==true}">客户回购周期</el-button>
            </li>
            <li class="m_fl"  @click="cuspricechange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户有效订单中客单价,客单价=用户购买的所有订单总金额 / 用户所有订单总数">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':cuspriceselect==true}">客单价</el-button>
            </li>
            <li class="m_fl" @click="singlepricechange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户有效订单中件单价,件单价=用户购买的所有订单总金额 / 用户所有购买的商品件数">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':singlepriceselect==true}">件单价</el-button>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="用户资产" name="4">
          <ul class="attr_select clearfix">
            <li class="m_fl" @click="gomebeanchange">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户当前可用美豆余额">
              </el-popover>
              <el-button v-popover:popover1 v-bind:class="{'is-active':gomebeanselect==true}">美豆</el-button>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
/* brandall-全部品牌 、 nomaleditList-数据回显、 userinfoList-保存、normalusercountList-计算、usernamecheckList-用户名验证、 cityList-全部城市 */
import { brandList, catIdList, nomaleditList, userinfoList, normalusercountList, usernamecheckList, cityList, userpageAuthorized } from 'api/serviceuser'
import uselect from 'common/uselect'
import Sectionselect from 'common/Sectionselect'
import userbrand from 'common/userbrand'
import { mapGetters } from 'vuex'
// import dataArr from 'region-picker/src/components/data.json'
export default {
  components: {
    'uselect': uselect,
    'Sectionselect': Sectionselect,
    'userbrand': userbrand
  },
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      chooseOneState: false,
      normalgEditId: '', // 回显id
      isfirstAction: true,
      arrstate: false,
      citylist: {}, // 城市选择
      catIdlist: {}, // 品类选择
      brandlist: {}, // 品牌选择
      sameName: false,
      sameOk: false,
      calculateState: false,
      attribute: { // 整体form表单
        baseinfo: {
          isVip: '',
          site: [],
          registerDaysCondition: '',
          registerDaysRelative: '',
          registerDays: '',
          vipLevel: [],
          grawCondition: '',
          graw1: '',
          graw2: '',
          isEmailValid: '',
          isPhoneValid: '1',
          isBindCard: '',
          isInnerStaff: '',
          sex: '',
          birthdayCondition: '',
          birthdayAbsolute: '',
          birthdayRelative: '',
          ageCondition: '',
          age1: '',
          age2: '',
          profession: [],
          city: ''
        },
        behavior: {
          composite: 'add', // 行为属性
          list: [{
            days: '30',
            userAction: [],
            cat1Id: '', // 全部品牌
            brandId: '',
            relative: ''
          }]
        },
        rfm: {
          firstBuyCondition: '', // RFM模型
          firstBuyRelative: '',
          firstBuyAbsolute: '',
          lastBuyCondition: '',
          lastBuyDate: '',
          lastBuyRelative: '',
          buyAmtCondition: '',
          buyAmt: '',
          buyAmt2: '',
          buyTimesCondition: '',
          buyTimes: '',
          buyTimes2: '',
          buyCycleCondition: '',
          buyCycle1: '',
          buyCycle2: '',
          perAmtCondition: '',
          perAmt: '',
          perAmt2: '',
          perPriceCondition: '',
          perPrice1: '',
          perPrice2: ''
        },
        userAsset: {
          gomeBeanCondition: '', // 用户资产
          gomeBean1: '',
          gomeBean2: ''
        },
        crowdinfo: {
          name: '',
          userCount: '',
          totalCount: '',
          percent: ''
        }
      },
      usercountErr: false,
      memberattrselect: false, // 行为属性
      registerselect: false,
      timeselect: false,
      vipLevelselect: false,
      grawselect: false,
      emailselect: false,
      phoneselect: true, // phone 默认显示
      bindcardselect: false,
      inmebselect: false,
      sexselect: false,
      birthselect: false,
      ageselect: false,
      zhiyeselect: false,
      cityselect: false,
      actionselect: false, // 用户行为
      firstorderselect: false,
      lastorderselect: false,
      ordervalueselect: false,
      ordernumselect: false,
      cycleselect: false,
      cuspriceselect: false,
      singlepriceselect: false,
      gomebeanselect: false, // 用户资产
      options2: [{
        value: '1',
        label: '大于等于'
      }, {
        value: '2',
        label: '小于等于'
      }, {
        value: '3',
        label: '区间'
      }],
      options1: [{
        value: '3',
        label: '3天'
      }, {
        value: '7',
        label: '7天'
      }, {
        value: '15',
        label: '15天'
      }, {
        value: '30',
        label: '30天'
      }, {
        value: '60',
        label: '60天'
      }, {
        value: '90',
        label: '90天'
      }, {
        value: '180',
        label: '180天'
      }, {
        value: '365',
        label: '365天'
      }],
      pickerOptions0: {
        disabledDate: (time) => { // 判断前一个日历的日期不能大于后面的日历日期  且没有到的日期  不能选择
          if (this.value2 !== '') {
            return time.getTime() > Date.now() || time.getTime() > this.value2
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptions1: { // 没有到的日期  不能选择
        disabledDate: (time) => {
          return time.getTime() < this.value1 || time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'NormalGEditId'
    ])
  },
  created: function () {
    var _this = this
    userpageAuthorized({
      code: 'mms_user_group_create'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_user_group_create
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
        } else {
          // 跳转到REM首页
        }
      }
    })
  },
  mounted: function () {
    this.catall()
    this.brandall()
    this.cityall()
    this.normalgEditId = this.NormalGEditId
    this.databack()
  },
  methods: {
    choosecheck: function () {
    },
    clearBtn: function () {
      this.attribute.baseinfo.city = ''
    },
    addcomponent: function () { // 增加品类
      this.attribute.behavior.list.push({
        days: '',
        userAction: [],
        place: '',
        cat1Id: '',
        brandId: ''
      })
      // if (this.attribute.behavior.list.length > 1) {
      //   this.attribute.behavior.composite = add
      // }
    },
    delcomponent: function (len) { // 删除品类
      this.attribute.behavior.list.splice(len - 1, 1)
      if (len <= 1) {
        this.actionselect = false
      }
    },
    memberchange: function () { // 行为属性
      this.memberattrselect = true
    },
    delmemberchange: function () {
      this.memberattrselect = false
      this.attribute.baseinfo.isVip = ''
    },
    registerchange: function () {
      this.registerselect = true
    },
    delregisterchange: function () {
      this.registerselect = false
      this.attribute.baseinfo.site = []
    },
    timechange: function () {
      this.timeselect = true
    },
    deltimechange: function () {
      this.timeselect = false
      this.attribute.baseinfo.registerDaysCondition = ''
      this.attribute.baseinfo.registerDaysRelative = ''
      this.attribute.baseinfo.registerDays = ''
    },
    vipLevelchange: function () {
      this.vipLevelselect = true
    },
    delvipLevelchange: function () {
      this.vipLevelselect = false
      this.attribute.baseinfo.vipLevel = []
    },
    grawchange: function () {
      this.grawselect = true
    },
    delgrawchange: function () {
      this.grawselect = false
      this.attribute.baseinfo.grawCondition = ''
      this.attribute.baseinfo.graw1 = ''
      this.attribute.baseinfo.graw2 = ''
    },
    emailchange: function () {
      this.emailselect = true
    },
    delemailchange: function () {
      this.emailselect = false
      this.attribute.baseinfo.isEmailValid = ''
    },
    phonechange: function () {
      this.phoneselect = true
    },
    delphonechange: function () {
      this.phoneselect = false
      this.attribute.baseinfo.isPhoneValid = ''
    },
    bindcardchange: function () {
      this.bindcardselect = true
    },
    delbindcardchange: function () {
      this.bindcardselect = false
      this.attribute.baseinfo.isBindCard = ''
    },
    inmebchange: function () {
      this.inmebselect = true
    },
    delinmebchange: function () {
      this.inmebselect = false
      this.attribute.baseinfo.isInnerStaff = ''
    },
    sexchange: function () {
      this.sexselect = true
    },
    delsexchange: function () {
      this.sexselect = false
      this.attribute.baseinfo.sex = ''
    },
    birthchange: function () {
      this.birthselect = true
    },
    delbirthchange: function () {
      this.birthselect = false
      this.attribute.baseinfo.birthdayCondition = ''
      this.attribute.baseinfo.birthdayAbsolute = ''
      this.attribute.baseinfo.birthdayRelative = ''
    },
    agechange: function () {
      this.ageselect = true
    },
    delagechange: function () {
      this.ageselect = false
      this.attribute.baseinfo.ageCondition = ''
      this.attribute.baseinfo.age1 = ''
      this.attribute.baseinfo.age2 = ''
    },
    zhiyechange: function () {
      this.zhiyeselect = true
    },
    delzhiyechange: function () {
      this.zhiyeselect = false
      this.attribute.baseinfo.profession = []
    },
    citychange: function () {
      this.cityselect = true
    },
    delcitychange: function () {
      this.cityselect = false
      this.attribute.baseinfo.city = ''
    },
    actionchange: function () { // 用户行为
      this.actionselect = true
      if (this.attribute.behavior.list.length <= 0) {
        this.addcomponent()
      }
    },
    delactionchange: function (index) {
      console.log(this.attribute.behavior, this.attribute.behavior.list, this.attribute.behavior.list.length, 999)
      this.attribute.behavior.list.splice(index, 1)
    },
    firstorderchange: function () { // 模型属性
      this.firstorderselect = true
    },
    delfirstorderchange: function () {
      this.firstorderselect = false
      this.attribute.rfm.firstBuyCondition = ''
      this.attribute.rfm.firstBuyRelative = ''
      this.attribute.rfm.firstBuyAbsolute = ''
    },
    lastorderchange: function () {
      this.lastorderselect = true
    },
    dellastorderchange: function () {
      this.lastorderselect = false
      this.attribute.rfm.lastBuyCondition = ''
      this.attribute.rfm.lastBuyDate = ''
      this.attribute.rfm.lastBuyRelative = ''
    },
    ordervaluechange: function () {
      this.ordervalueselect = true
    },
    delordervaluechange: function () {
      this.ordervalueselect = false
      this.attribute.rfm.buyAmtCondition = ''
      this.attribute.rfm.buyAmt = ''
      this.attribute.rfm.buyAmt2 = ''
    },
    ordernumchange: function () {
      this.ordernumselect = true
    },
    delordernumchange: function () {
      this.ordernumselect = false
      this.attribute.rfm.buyTimesCondition = ''
      this.attribute.rfm.buyTimes = ''
      this.attribute.rfm.buyTimes2 = ''
    },
    cyclechange: function () {
      this.cycleselect = true
    },
    delcyclechange: function () {
      this.cycleselect = false
      this.attribute.rfm.buyCycleCondition = ''
      this.attribute.rfm.buyCycle1 = ''
      this.attribute.rfm.buyCycle2 = ''
    },
    cuspricechange: function () {
      this.cuspriceselect = true
    },
    delcuspricechange: function () {
      this.cuspriceselect = false
      this.attribute.rfm.perAmtCondition = ''
      this.attribute.rfm.perAmt = ''
      this.attribute.rfm.perAmt2 = ''
    },
    singlepricechange: function () {
      this.singlepriceselect = true
    },
    delsinglepricechange: function () {
      this.singlepriceselect = false
      this.attribute.rfm.perPriceCondition = ''
      this.attribute.rfm.perPrice1 = ''
      this.attribute.rfm.perPrice2 = ''
    },
    gomebeanchange: function () { // 美豆资产
      this.gomebeanselect = true
    },
    delgomebeanchange: function () {
      this.gomebeanselect = false
      this.attribute.userAsset.gomeBeanCondition = ''
      this.attribute.userAsset.gomeBean1 = ''
      this.attribute.userAsset.gomeBean2 = ''
    },
    /* 获取组件数据 */
    registerdata: function (data) { // 基础属性
      this.attribute.baseinfo.registerDaysCondition = data.type
      this.attribute.baseinfo.registerDaysRelative = data.valuerelative
      this.attribute.baseinfo.registerDays = data.value1 + ',' + data.value2
    },
    birthdata: function (data) {
      this.attribute.baseinfo.birthdayCondition = data.type
      this.attribute.baseinfo.birthdayRelative = data.valuerelative
      this.attribute.baseinfo.birthdayAbsolute = data.value1 + ',' + data.value2
    },
    grawdata: function (data) {
      this.attribute.baseinfo.grawCondition = data.type
      this.attribute.baseinfo.graw1 = data.value1
      this.attribute.baseinfo.graw2 = data.value2
    },
    agedata: function (data) {
      this.attribute.baseinfo.ageCondition = data.type
      this.attribute.baseinfo.age1 = data.value1
      this.attribute.baseinfo.age2 = data.value2
    },
    firstorderdata: function (data) { // RFM模型
      this.attribute.rfm.firstBuyCondition = data.type
      this.attribute.rfm.firstBuyRelative = data.valuerelative
      this.attribute.rfm.firstBuyAbsolute = data.value1 + ',' + data.value2
    },
    lastorderdata: function (data) {
      this.attribute.rfm.lastBuyCondition = data.type
      this.attribute.rfm.lastBuyRelative = data.valuerelative
      this.attribute.rfm.lastBuyDate = data.value1 + ',' + data.value2
    },
    ordervaluedata: function (data) {
      this.attribute.rfm.buyAmtCondition = data.type
      this.attribute.rfm.buyAmt = data.value1
      this.attribute.rfm.buyAmt2 = data.value2
    },
    ordernumdata: function (data) {
      this.attribute.rfm.buyTimesCondition = data.type
      this.attribute.rfm.buyTimes = data.value1
      this.attribute.rfm.buyTimes2 = data.value2
    },
    cycledata: function (data) {
      this.attribute.rfm.buyCycleCondition = data.type
      this.attribute.rfm.buyCycle1 = data.value1
      this.attribute.rfm.buyCycle2 = data.value2
    },
    cuspricedata: function (data) {
      this.attribute.rfm.perAmtCondition = data.type
      this.attribute.rfm.perAmt = data.value1
      this.attribute.rfm.perAmt2 = data.value2
    },
    singlepricedata: function (data) {
      this.attribute.rfm.perPriceCondition = data.type
      this.attribute.rfm.perPrice1 = data.value1
      this.attribute.rfm.perPrice2 = data.value2
    },
    gomebeandata: function (data) { // 用户资产
      this.attribute.userAsset.gomeBeanCondition = data.type
      this.attribute.userAsset.gomeBean1 = data.value1
      this.attribute.userAsset.gomeBean2 = data.value2
    },
    catall: function () {
      var _this = this
      catIdList({}, (data) => {
        _this.catIdlist = data
      })
    },
    brandall: function () {
      var _this = this
      brandList({}, (data) => {
        _this.brandlist = data
      })
    },
    cityall: function () {
      var _this = this
      cityList({}, (data) => {
        _this.citylist = data
      })
    },
    databack: function () { // 回显
      var _this = this
      _this.attribute.behavior.list.forEach(function (item) {
        item.brand = []
        item.days = ''
      })
      nomaleditList({'id': _this.normalgEditId}, (data) => {
        if (data.success === true) {
          _this.attribute = JSON.parse(data.data.userCondition)
          // _this.attribute.baseinfo.registerDaysCondition = '0'
          _this.stateinit() // 调用回显状态
        }
      })
    },
    stateinit: function () {
      var _this = this
      /* 回显状态init */
      if (_this.attribute.baseinfo.isVip !== '') { // 基础属性
        _this.memberattrselect = true
      }
      if (_this.attribute.baseinfo.site === []) {
        _this.registerselect = false
      } else {
        _this.registerselect = true
      }
      if (_this.attribute.baseinfo.registerDaysCondition !== '') {
        _this.timeselect = true
      }
      if (_this.attribute.baseinfo.vipLevel === []) {
        _this.vipLevelselect = false
      } else {
        _this.vipLevelselect = true
      }
      if (_this.attribute.baseinfo.grawCondition !== '') {
        _this.grawselect = true
      }
      if (_this.attribute.baseinfo.isEmailValid !== '') {
        _this.emailselect = true
      }
      if (_this.attribute.baseinfo.isPhoneValid !== '') {
        _this.phoneselect = true
      }
      if (_this.attribute.baseinfo.isBindCard !== '') {
        _this.bindcardselect = true
      }
      if (_this.attribute.baseinfo.isInnerStaff !== '') {
        _this.inmebselect = true
      }
      if (_this.attribute.baseinfo.sex !== '') {
        _this.sexselect = true
      }
      if (_this.attribute.baseinfo.birthdayCondition !== '') {
        _this.birthselect = true
      }
      if (_this.attribute.baseinfo.ageCondition !== '') {
        _this.ageselect = true
      }
      if (_this.attribute.baseinfo.profession === []) {
        _this.zhiyeselect = false
      } else {
        _this.zhiyeselect = true
      }
      if (_this.attribute.baseinfo.city !== '') {
        _this.cityselect = true
      }
      if (_this.attribute.behavior.list.length > 0) { // 用户行为
        _this.actionselect = true
      }
      if (_this.attribute.rfm.firstBuyCondition !== '') { // RFM属性
        _this.firstorderselect = true
      }
      if (_this.attribute.rfm.lastBuyCondition !== '') {
        _this.lastorderselect = true
      }
      if (_this.attribute.rfm.buyAmtCondition !== '') {
        _this.ordervalueselect = true
      }
      if (_this.attribute.rfm.buyTimesCondition !== '') {
        _this.ordernumselect = true
      }
      if (_this.attribute.rfm.buyCycleCondition !== '') {
        _this.cycleselect = true
      }
      if (_this.attribute.rfm.perAmtCondition !== '') {
        _this.cuspriceselect = true
      }
      if (_this.attribute.rfm.perPriceCondition !== '') {
        _this.singlepriceselect = true
      }
      if (_this.attribute.rfm.gomeBeanCondition !== '') { // 国美豆
        _this.gomebeanselect = true
      }
    },
    calculate: function () { // 计算
      this.$validator.validateAll().then((result) => {
        if (result === true) {
          this.calculateState = true
          const loading = this.$loading({ // loading
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          normalusercountList({'condition': JSON.stringify(this.attribute)}, (data) => {
            if (data.success === true) {
              this.usercountErr = false
              this.calculateState = false
              loading.close()
              var percent = ((data.data.userCount / data.data.totalCount) * 100).toFixed(2)
              this.attribute.crowdinfo.userCount = data.data.userCount
              this.attribute.crowdinfo.totalCount = data.data.totalCount
              this.attribute.crowdinfo.percent = percent
            } else {
              loading.close()
              this.calculateState = false
              this.$message({
                message: '计算失败，请重新计算！',
                type: 'info'
              })
            }
          })
        }
      })
    },
    saveBtn: function () {
      this.$validator.validateAll().then((result) => {
        if (result === true && this.attribute.crowdinfo.userCount !== '') {
          if (this.arrstate === true) {
            this.$message({
              message: '请重新计算覆盖人数！',
              type: 'info'
            })
          } else {
            userinfoList(
              { 'id': this.normalgEditId ? this.normalgEditId : -1,
                'condition': JSON.stringify(this.attribute),
                'name': this.attribute.crowdinfo.name,
                'userCount': this.attribute.crowdinfo.userCount,
                'totalCount': this.attribute.crowdinfo.totalCount,
                'percent': this.attribute.crowdinfo.percent
              }, (data) => {
                if (data.success === true) {
                  // alert(result, data.remark)
                  // const loading = this.$loading({ // loading
                  //   lock: false,
                  //   text: '正在提交',
                  //   background: 'rgba(0, 0, 0, 0.7)'
                  // })
                  // setTimeout(() => {
                  //   loading.close()
                  // }, 2000)
                  this.$confirm('提交成功', '提示', {
                    showCancelButton: false,
                    // showClose: false,
                    type: 'info'
                  }).then(() => {
                    this.$router.push('/usermanage') // 页面跳转
                  })
                } else {
                  alert(result, data.remark)
                }
              }
            )
          }
        } else {
          this.usercountErr = true
        }
      })
    },
    resetBtn: function () { // 表单重置
      this.$confirm('表单重置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
        Object.assign(this.$data, this.$options.data())
        this.catall()
        this.brandall()
        this.cityall()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    backBtn: function () { // 返回按钮
      this.$router.push('/usermanage') // 页面跳转
    },
    userNameCheck: function () { // 用户名验证
      if (this.attribute.crowdinfo.name !== '') {
        usernamecheckList({'id': -1, 'name': this.attribute.crowdinfo.name}, (data) => {
          if (data.success === true) {
            this.sameOk = true
            this.sameName = false
          } else {
            this.sameName = true
          }
        })
      }
    }
  },
  watch: {
    'attribute': {
      handler (infoAll) {
        if (!this.isfirstAction && this.normalgEditId !== '') {
          this.arrstate = true
          console.log(this.isfirstAction, this.arrstate, 22)
        }
        this.isfirstAction = false
      },
      deep: true
    },
    'attribute.crowdinfo': {
      handler (crowdinfo) {
        if (!this.isfirstAction && this.normalgEditId !== '' && this.attribute.crowdinfo.totalCount !== 0) {
          this.arrstate = false
        }
        this.isfirstAction = false
      },
      deep: true
    },
    'attribute.baseinfo': {
      handler (info) {
        this.attribute.baseinfo = info
      },
      deep: true
    },
    'attribute.behavior.list': {
      handler (list) {
        this.attribute.behavior.list = list
      },
      deep: true
    },
    'attribute.rfm': {
      handler (rfm) {
        this.attribute.rfm = rfm
        console.log(this.attribute.rfm, 131313)
      },
      deep: true
    }
    // 'attribute.userAsset': {
    //   handler (userAsset) {
    //     this.attribute.userAsset = userAsset
    //     console.log(this.attribute.userAsset, 141414)
    //   },
    //   deep: true
    // }
  }
}
</script>

<style src="assets/css/reset.styl" lang="stylus"></style>
<style scoped>
ol,
ul,
li {
  list-style: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
}
strong,
var,
em,
i {
  font-style: normal;
  font-weight: normal;
}
a {
  text-decoration: none;
  color: #333;
}
img {
  display: block;
  width: 100%;
}
.green {
  color: #71bd56;
}
.clearfix:after,
.wbox:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix,
.wbox {
  *zoom: 1;
}
.usercreat .w120 {
  width: 120px;
}
.usercreat .text_c {
  color: #2875cc;
}
.usercreat .el-input__inner{ width: 120px;}
.usercreat .add_btn_attr,
.del_btn_attr {
  margin-top: 10px;
  width: 15px;
  height: 15px;
  text-align: center;
  line-height: 15px;
  border: 1px solid #9fc2e6;
  color: #9fc2e6;
  display: inline-block;
  cursor: pointer;
}
.usercreat .add_btn_attr{ margin-left: 119px; }
.usercreat .from_bottom {
  text-align: center;
}
.usercreat a.goback_btn,
.usercreat a.clear_btn {
  background: #fff !important;
  border: 1px solid #4d92df;
  color: #4d92df !important;
  margin-left: 10px;
}
.usercreat .ml10 {
  margin-left: 10px;
}
.usercreat .mr10 {
  margin-right: 10px;
}
.usercreat .mr5 {
  margin-right: 5px;
}
.usercreat .mr15 {
  margin-top: 0;
}
.usercreat .m_fr {
  float: right;
}
.usercreat .m_fl {
  float: left;
}
.usercreat .form-group {
  padding: 5px 0;
}
.usercreat .del_btn {
  font-family: Simsun;
  cursor: pointer;
  color: #599ae1;
  visibility: hidden;
}
.usercreat .form-group:hover .del_btn{ visibility: visible;}
.usercreat .form-group:hover {
  background: #f5faff;
}
.usercreat .M_tittle {
  height: 37px;
  border: 1px solid #ccc;
  padding-left: 10px;
  background: #eef6ff;
}
.usercreat .M_tittle h3 {
  font-size: 14px;
  line-height: 36px;
}
.usercreat .m_left {
  width: 608px;
}
.usercreat .base_attr {
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 10px 0;
}
.usercreat .attr_left {
  width: 110px;
  text-align: right;
  display: inline-block;
  margin-right: 10px;
  height: 20px;
}
.usercreat .line {
  border-bottom: 1px solid #ccc;
}
.usercreat .m_right {
  width: 308px;
  margin-left: 20px;
}
.attr_one,
.attr_two,
.attr_three,
.attr_four,
.attr_five {
  margin-bottom: 20px;
}
.usercreat .line_height{ line-height: 30px;}
/* 行为属性 */
.usercreat .up .sl {
  height: 30px;
  line-height: 30px;
  padding: 5px 10px;
  background: #ccc;
  margin-left: 10px;
  cursor: pointer;
}
.usercreat .select_action{ margin:10px 0 0 121px;width:486px;}
.usercreat .select_action_list{ width: 442px;}
.usercreat .brad_out{ margin: 10px 0 10px 0;}
.usercreat .brand{ width: 110px; margin-right: 10px; text-align: right}
/*  */
.usercreat .bg {
  padding: 6px;
  background: #ccc;
  display: inline-block;
}
/* 右侧筛选 */
.usercreat .attr_select li {
  margin-right: 10px;
}
.usercreat .el-button {
  margin-top: 10px;
  padding: 11px 0px;
  border: 1px solid #e6e6e6;
  border-radius: 0;
  width: 94px;
  text-align: center;
}
.usercreat .m_fl .active {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.usercreat .el-collapse-item__header {
  border-bottom: 1px solid #ccc;
  border-top: none;
}

.usercreat .el-collapse-item__wrap {
  border-bottom: none;
  padding-bottom: 10px;
}
.usercreat .el-collapse {
  border-top: none;
}
.usercreat .el-collapse-item.is-active .el-collapse-item__header {
  border-bottom: 1px solid #ccc;
  color: #606266;
}
/* .el-button.is-active { background:url(assets/images/is.png) no-repeat;} */
.usercreat .el-collapse-item__wrap {
  width: 318px;
}
.usercreat .attr_select{ width: 315px !important;}
.usercreat .el-select>.el-input,.usercreat .el-input--suffix .el-input__inner{ width: 90px; font-size: 12px;  height: 30px;margin-right: 10px;}
.usercreat input[readonly][type=text]{color: #000;padding-left: 8px; text-align: center;}
.usercreat .el-select-dropdown{ margin-top: 0px;  box-shadow: none; border-radius: none;}
.usercreat .el-popper[x-placement^=bottom]{ margin-top: 0px; min-width:0px !important;}
.usercreat .el-select-dropdown__item span{ width:49px; text-align: center;}
.usercreat .el-select-dropdown__item{font-size: 12px; font-weight: normal;}
.usercreat .el-collapse-item__header{ height: 40px; line-height: 40px;}
.usercreat .el-collapse-item__arrow{ line-height: 40px;}
.usercreat .el-select-dropdown__list{ padding: 0;}
.usercreat .clear_btn:hover,.usercreat .goback_btn:hover{ background: #fff !important;}
.usercreat .btn-primary{text-shadow: none;}
.usercreat .region-picker{ width: 350px! important;}
.usercreat .error_on{ color:red; padding-left: 124px; clear: both; margin-top: 10px;}
.usercreat .nopdleft{ padding-left: 0;}
.usercreat .marginleft{ margin-left: 124px;}
.usercreat input[readonly][type=text].none_input{ cursor: not-allowed;ime-mode: disabled; width: 120px; background: #eaeaea !important;}
.usercreat .region-picker{ float: left;}
.usercreat .form-group .el-select input.el-input__inner{ width: 100px !important;  height: 30px !important; padding: 0}
.usercreat .el-collapse-item is-active{ padding-bottom: 20px;}
.usercreat .attr_two .form-group{ position: relative;}
.usercreat .attr_two .form-group .del_btn { position: absolute; top: 10px; right: 0;}
.usercreat .clearBtn{ border-radius: 2px; width: 40px; height: 30px; margin-left: 5px; line-height: 30px; text-align:center; background: #4990e2; color: #fff;  display: inline-block; cursor: pointer}

</style>
