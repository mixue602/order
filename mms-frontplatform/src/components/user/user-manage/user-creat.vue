<template>
  <div class="usercreat">
    <!-- <div>{{attribute.baseinfo}}</div> <br/>
    <div>{{attribute.behavior}}</div> <br/>
    <div>{{attribute.rfm}}</div> <br/>
    <div>{{attribute.userAsset}}</div> <br/> -->
    <div class="m_left m_fl">
      <el-form :model="attribute" :rules="rules" ref="userCreatForm" label-width="120px">
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
              <el-form-item label="人群属性" prop="baseinfo.isVip">
                <el-radio disabled v-model="attribute.baseinfo.isVip" label="1">会员</el-radio>
                <el-radio disabled v-model="attribute.baseinfo.isVip" label="2">访客</el-radio>
              </el-form-item>
              <span class="mr10 del_btn" @click="delmemberchange">×</span>
            </div>
            <div class="form-group" v-if="registerselect" v-bind:class="{'show':registerselect==true}">
              <el-form-item label="注册站点" prop="baseinfo.site">
                <el-checkbox-group v-model="attribute.baseinfo.site">
                  <el-checkbox label="PC" name="type"></el-checkbox>
                  <el-checkbox label="WAP" name="type"></el-checkbox>
                  <el-checkbox label="APP" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delregisterchange">×</span>
            </div>
            <div class="form-group clearfix" v-if="timeselect"> <!-- v-show="timeselect" -->
              <el-form-item label="注册时间">
                <uselect v-on:changetypedata="registerdata" :selecttype="attribute.baseinfo.registerDaysCondition" :Vrelative="attribute.baseinfo.registerDaysRelative" :intime1 ="attribute.baseinfo.registerDays.value1" :intime2 ="attribute.baseinfo.registerDays.value2"></uselect>
              </el-form-item>
              <el-form-item prop="baseinfo.registerDaysRelative"  v-if="attribute.baseinfo.registerDaysCondition === '0'"  :rules="{ required:true,message:'请输入相对时间', trigger:'change' }">
              </el-form-item>
              <el-form-item prop="baseinfo.registerDays.value1" v-if="attribute.baseinfo.registerDaysCondition === '1'" :rules="{ required:true,message:'请输入绝对时间', trigger:'change' }">
              </el-form-item>
               <el-form-item prop="baseinfo.registerDays.value2" v-if="attribute.baseinfo.registerDaysCondition === '1'" :rules="{ required:true,message:'请输入结束时间', trigger:'change' }">
              </el-form-item>
              <!-- <el-form-item label="注册时间">
                  <el-select v-model="attribute.baseinfo.registerDaysCondition" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label=""  v-if="attribute.baseinfo.registerDaysCondition === '0'" prop="baseinfo.registerDaysRelative">
                <span class="one_time"><i class="mr5">近</i>
                  <el-select v-model="attribute.baseinfo.registerDaysRelative">
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </span>
              </el-form-item>
              <el-form-item required  v-if="attribute.baseinfo.registerDaysCondition === '1'" prop="baseinfo.registerDays">
                <span class="qujian_input qujian_input_time" >
                  <el-date-picker
                        v-model="attribute.baseinfo.registerDays"
                        type="date"
                        placeholder="开始时间"
                        size="small"
                        :editable="false"
                        :clearable="false"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerStart">
                  </el-date-picker>
                  <el-date-picker
                        v-model="select1.value2"
                        type="date"
                        size="small"
                        placeholder="结束时间"
                        :editable="false"
                        :clearable="false"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerEnd">
                  </el-date-picker>
                </span>
              </el-form-item> -->
              <span class="m_fr mr10 del_btn" @click="deltimechange">×</span>
            </div>
            <div class="form-group" v-if="vipLevelselect">
              <el-form-item label="会员等级" prop="baseinfo.vipLevel">
                <el-checkbox-group v-model="attribute.baseinfo.vipLevel">
                  <el-checkbox label="G1" name="type"></el-checkbox>
                  <el-checkbox label="G2" name="type"></el-checkbox>
                  <el-checkbox label="G3" name="type"></el-checkbox>
                  <el-checkbox label="G4" name="type"></el-checkbox>
                  <el-checkbox label="G5" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delvipLevelchange">×</span>
            </div>
            <div class="form-group clearfix" v-if="grawselect">
              <el-form-item label="成长值">
                <Sectionselect v-on:qujiandata="grawdata" :qujian="attribute.baseinfo.grawCondition" :data1="attribute.baseinfo.graw1" :data2="attribute.baseinfo.graw2"></Sectionselect>
              </el-form-item> <!-- ,{pattern: , message: '请输入大于等于0的正整数！', trigger: 'blur'} -->
              <el-form-item prop="baseinfo.graw1"  v-if="attribute.baseinfo.grawCondition === 'eq'" :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="baseinfo.graw2"  v-if="attribute.baseinfo.grawCondition === 'eq'" :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="baseinfo.graw1"  v-if="attribute.baseinfo.grawCondition === 'gt'" :rules="[{ required:true,message:'请输入成长值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="baseinfo.graw1"  v-if="attribute.baseinfo.grawCondition === 'lt'" :rules="[{ required:true,message:'请输入成长值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <span class="m_fr mr10 del_btn" @click="delgrawchange">×</span>
            </div>
            <div class="form-group" v-if="emailselect">
              <el-form-item label="邮箱验证" prop="baseinfo.isEmailValid">
                <el-radio-group v-model="attribute.baseinfo.isEmailValid">
                  <el-radio  :label="1">是</el-radio>
                  <el-radio  :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delemailchange">×</span>
            </div>
            <div class="form-group" v-if="phoneselect">
              <el-form-item label="手机验证" prop="baseinfo.isPhoneValid">
                <el-radio-group v-model="attribute.baseinfo.isPhoneValid">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delphonechange">×</span>
            </div>
            <div class="form-group" v-if="bindcardselect">
              <el-form-item label="已绑卡用户" prop="baseinfo.isBindCard">
                <el-radio-group v-model="attribute.baseinfo.isBindCard">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delbindcardchange">×</span>
            </div>
            <div class="form-group" v-if="inmebselect">
              <el-form-item label="内部员工" prop="baseinfo.isInnerStaff">
                <el-radio-group v-model="attribute.baseinfo.isInnerStaff">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delinmebchange">×</span>
            </div>
            <div class="form-group" v-if="sexselect ">
              <el-form-item label="性别" prop="baseinfo.sex">
                <el-radio-group v-model="attribute.baseinfo.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delsexchange">×</span>
            </div>
            <div class="form-group clearfix" v-if="birthselect">
              <el-form-item label="生日">
                <uselect-Custom v-on:changetypedata="birthdata" :selecttype="attribute.baseinfo.birthdayCondition" :Vrelative="attribute.baseinfo.birthdayRelative" :intime ="attribute.baseinfo.birthdayAbsolute"></uselect-Custom>
              </el-form-item>
              <el-form-item prop="baseinfo.birthdayRelative"  v-if="attribute.baseinfo.birthdayCondition === '0'"  :rules="{ required:true,message:'请输入相对时间', trigger:'change' }">
              </el-form-item>
              <el-form-item prop="baseinfo.birthdayAbsolute.value1" v-if="attribute.baseinfo.birthdayCondition === '1'" :rules="{ required:true,message:'请输入绝对时间', trigger:'change' }">
              </el-form-item>
               <el-form-item prop="baseinfo.birthdayAbsolute.value2" v-if="attribute.baseinfo.birthdayCondition === '1'" :rules="{ required:true,message:'请输入绝对时间', trigger:'change' }">
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delbirthchange">×</span>
            </div>
            <div class="form-group clearfix" v-if="ageselect">
              <el-form-item label="年龄">
                <Sectionselect :data1="attribute.baseinfo.age1" :data2="attribute.baseinfo.age2" :qujian="attribute.baseinfo.ageCondition"  v-on:qujiandata="agedata" ></Sectionselect>
              </el-form-item>
              <el-form-item  prop="baseinfo.age1"  v-if="attribute.baseinfo.ageCondition === 'eq'" :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="baseinfo.age2"  v-if="attribute.baseinfo.ageCondition === 'eq'" :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="baseinfo.age1"  v-if="attribute.baseinfo.ageCondition === 'gt'" :rules="[{ required:true,message:'请输入数值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="baseinfo.age1"  v-if="attribute.baseinfo.ageCondition === 'lt'" :rules="[{ required:true,message:'请输入数值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <span class="m_fr mr10 del_btn" @click="delagechange">×</span>
            </div>
            <div class="form-group cl clearfix" v-if="zhiyeselect">
            <el-form-item class="profession" label="职业" prop="baseinfo.profession">
              <el-checkbox-group v-model="attribute.baseinfo.profession">
                <el-checkbox label="1" name="type" value="1">不限</el-checkbox>
                <el-checkbox label="2" name="type" value="2">企业雇主/企业经营者</el-checkbox>
                <el-checkbox label="3" name="type" value="3">高级行政人员</el-checkbox>
                <el-checkbox label="4" name="type" value="4">中层管理人员</el-checkbox>
                <el-checkbox label="5" name="type" value="5">专业人士</el-checkbox>
                <el-checkbox label="6" name="type" value="6">办公人员</el-checkbox>
                <el-checkbox label="7" name="type" value="7">工人/蓝领</el-checkbox>
                <el-checkbox label="8" name="type" value="8">公务员/事业单位员工</el-checkbox>
                <el-checkbox label="9" name="type" value="9">自由职业者</el-checkbox>
                <el-checkbox label="10" name="type" value="10">军人</el-checkbox>
                <el-checkbox label="11" name="type" value="11">学生</el-checkbox>
                <el-checkbox label="12" name="type" value="12">退休</el-checkbox>
                <el-checkbox label="13" name="type" value="13">家庭主妇</el-checkbox>
                <el-checkbox label="14" name="type" value="14">其他</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <span class="m_fr mr10 del_btn" @click="delzhiyechange">×</span>
            </div>
            <div class="form-group clearfix" v-if="cityselect">
              <el-form-item label="省市地域" prop="baseinfo.city">
                <region-picker multiple :data="citylist" placeholder="请选择省市地域" name="baseinfo.city" v-model="attribute.baseinfo.city" ></region-picker>
              </el-form-item>
              <span class="m_fr mr10 del_btn" @click="delcitychange">×</span>
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
          <div class="clearfix form-group base_attr">
            <div>
              <!-- <div class="form-group" v-for="(val, index) in attribute.behavior.list" :key="index">
                <el-form-item label="行为关系" prop="behavior.list" :rules="{ validator: checkList, trigger: 'change' }">
                  <el-radio v-model="attribute.behavior.composite" label="or">并集</el-radio>
                  <el-radio v-model="attribute.behavior.composite" label="add">交集</el-radio>
                  <el-select name="days" v-model="val.days" style="width:100px; height:30px; padding:0 0 0 5px;">
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-checkbox-group v-model="val.userAction">
                    <el-checkbox label="加购" name="type" value="0"></el-checkbox>
                    <el-checkbox label="浏览" name="type" value="1"></el-checkbox>
                    <el-checkbox label="搜索" name="type" value="2"></el-checkbox>
                    <el-checkbox label="购买" name="type" value="3"></el-checkbox>
                    <el-checkbox label="活跃" name="type" value="4"></el-checkbox>
                    <el-checkbox label="过滤已购买" name="type" value="5"></el-checkbox>
                  </el-checkbox-group>
                  <region-picker multiple placeholder="请选择品类名称" :data="catIdlist" name="cat1Id" v-model="val.cat1Id"></region-picker>
                  <region-picker multiple placeholder="请选择品牌名称" :max-level="1" :data="brandlist" name="brandId" v-model="val.brandId"></region-picker>
                </el-form-item>
              </div> -->
              <el-form-item label="行为关系">
                <el-radio label="or" v-model="attribute.behavior.composite">并集</el-radio>
                <el-radio label="and" v-model="attribute.behavior.composite">交集</el-radio>
              </el-form-item>
              <el-form-item class="list_out" v-for="(val, index) in attribute.behavior.list" :key="index">
                <el-form-item  class="error_pl npmt" label="用户行为" :prop="'behavior.list.' + index + '.days'" :rules="{ required: true, message: '天数不能为空', trigger: 'change' }">
                  <i class="">近</i>
                  <el-select name="days" v-model="val.days" style="width:100px; height:30px; padding:0 0 0 5px;">
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="error_pl" label="行为" :prop="'behavior.list.' + index + '.userAction'" :rules="{ required: true, message: '用户行为不能为空', trigger: 'change' }">
                  <div class="">
                    <el-checkbox-group v-model="val.userAction">
                      <el-checkbox label="0" name="type" value="0">加购</el-checkbox>
                      <el-checkbox label="1" name="type" value="1">浏览</el-checkbox>
                      <el-checkbox label="2" name="type" value="2">搜索</el-checkbox>
                      <el-checkbox label="3" name="type" value="3">购买</el-checkbox>
                      <el-checkbox label="4" name="type" value="4">活跃</el-checkbox>
                      <el-checkbox label="5" name="type" value="5">过滤已购买</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-form-item>
                <el-form-item  label="品类" :prop="'behavior.list.' + index + '.cat1Id'">
                  <region-picker multiple placeholder="请选择品类名称" :data="catIdlist" name="cat1Id" v-model="val.cat1Id"></region-picker>
                   <!-- <div class="el-form-item__error" v-if="!val.isCardOrBrand ">品类和品牌二者必须填一个</div> -->
                </el-form-item>
                <el-form-item label="品牌" class="userbrandId_out">
                  <brandselect :brandId="val.brandId" v-on:brandIdArr="brandIdArr" :brandPanelIndex="index" :brandEdit="normalgEditId"></brandselect>
                  <!-- <region-picker multiple placeholder="请选择品牌名称" :data="brandlist" name="brandId" v-model="val.brandId"></region-picker> -->
                    <div class="el-form-item__error" v-if="!val.isCardOrBrand && isSubmit"> 品类和品牌二者必须选填一个</div>
                </el-form-item>
                <span class="m_fr mr10 del_btn" @click="delactionchange(index)">×</span>
              </el-form-item>
              <div v-show="actionselect" class="btnAll">
                <a href="###" v-show="listNum" @click="addcomponent"><span class="add_btn_attr">+</span><span class="text_c">添加</span></a>
                <a href="###" @click="delcomponent(attribute.behavior.list.length)"><span class="del_btn_attr">-</span><span class="text_c">删除</span></a>
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
            <!-- 首次下单时间 -->
            <div class="form-group clearfix" v-if="firstorderselect">
              <el-form-item label="首次下单时间">
                <uselect v-on:changetypedata="firstorderdata" :selecttype="attribute.rfm.firstBuyCondition" :Vrelative="attribute.rfm.firstBuyRelative" :intime1 ="attribute.rfm.firstBuyAbsolute.value1" :intime2 ="attribute.rfm.firstBuyAbsolute.value2"></uselect>
              </el-form-item>
              <el-form-item prop="rfm.firstBuyRelative"  v-if="attribute.rfm.firstBuyCondition === '0'"  :rules="{ required:true,message:'请输入相对时间', trigger:'change' }"></el-form-item>
              <el-form-item prop="rfm.firstBuyAbsolute.value1"  v-if="attribute.rfm.firstBuyCondition === '1'"  :rules="{ required:true,message:'请输入绝对时间', trigger:'change' }"></el-form-item>
              <el-form-item prop="rfm.firstBuyAbsolute.value2"  v-if="attribute.rfm.firstBuyCondition === '1'"  :rules="{ required:true,message:'请输入绝对时间', trigger:'change' }"></el-form-item>
              <span class="m_fr mr10 del_btn" @click="delfirstorderchange">×</span>
            </div>
            <!-- 最后下单时间 -->
            <div class="form-group clearfix" v-if="lastorderselect">
              <el-form-item label="最后下单时间">
                <uselect v-on:changetypedata="lastorderdata" :selecttype="attribute.rfm.lastBuyCondition" :Vrelative="attribute.rfm.lastBuyRelative" :intime1 ="attribute.rfm.lastBuyDate.value1" :intime2 ="attribute.rfm.lastBuyDate.value2"></uselect>
              </el-form-item>
               <el-form-item prop="rfm.lastBuyRelative"  v-if="attribute.rfm.lastBuyCondition === '0'"  :rules="{ required:true,message:'请输入相对时间', trigger:'change' }"></el-form-item>
              <el-form-item prop="rfm.lastBuyDate.value1"  v-if="attribute.rfm.lastBuyCondition === '1'"  :rules="{ required:true,message:'请输入绝对时间', trigger:'change' }"></el-form-item>
              <el-form-item prop="rfm.lastBuyDate.value2"  v-if="attribute.rfm.lastBuyCondition === '1'"  :rules="{ required:true,message:'请输入绝对时间', trigger:'change' }"></el-form-item>
              <span class="m_fr mr10 del_btn" @click="dellastorderchange">×</span>
            </div>
            <!-- 下单金额 -->
            <div class="form-group clearfix" v-if="ordervalueselect">
              <el-form-item label="下单金额">
                <Sectionselect v-on:qujiandata="ordervaluedata" :data1="attribute.rfm.buyAmt" :data2="attribute.rfm.buyAmt2" :qujian="attribute.rfm.buyAmtCondition"></Sectionselect>
              </el-form-item>
              <el-form-item prop="rfm.buyAmt"  v-if="attribute.rfm.buyAmtCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyAmt2"  v-if="attribute.rfm.buyAmtCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyAmt"  v-if="attribute.rfm.buyAmtCondition === 'gt'"  :rules="[{ required:true,message:'请输入下单金额', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyAmt"  v-if="attribute.rfm.buyAmtCondition === 'lt'"  :rules="[{ required:true,message:'请输入下单金额', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <span class="m_fr mr10 del_btn" @click="delordervaluechange">×</span>
            </div>
            <!-- 下单次数 -->
            <div class="form-group clearfix" v-if="ordernumselect">
              <el-form-item label="下单次数" prop="rfm.buyTimesCondition">
                <Sectionselect v-on:qujiandata="ordernumdata" :data1="attribute.rfm.buyTimes" :data2="attribute.rfm.buyTimes2" :qujian="attribute.rfm.buyTimesCondition"></Sectionselect>
              </el-form-item>
              <el-form-item prop="rfm.buyTimes"  v-if="attribute.rfm.buyTimesCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyTimes2"  v-if="attribute.rfm.buyTimesCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyTimes"  v-if="attribute.rfm.buyTimesCondition === 'gt'"  :rules="[{ required:true,message:'请输入下单次数', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyTimes"  v-if="attribute.rfm.buyTimesCondition === 'lt'"  :rules="[{ required:true,message:'请输入下单次数', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <span class="m_fr mr10 del_btn" @click="delordernumchange">×</span>
            </div>
            <div class="form-group clearfix" v-if="cycleselect">
              <el-form-item label="客户回购周期" prop="rfm.buyCycleCondition">
                <Sectionselect v-on:qujiandata="cycledata" :data1="attribute.rfm.buyCycle1" :data2="attribute.rfm.buyCycle2" :qujian="attribute.rfm.buyCycleCondition"></Sectionselect>
              </el-form-item>
              <el-form-item prop="rfm.buyCycle1"  v-if="attribute.rfm.buyCycleCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyCycle2"  v-if="attribute.rfm.buyCycleCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyCycle1"  v-if="attribute.rfm.buyCycleCondition === 'gt'"  :rules="[{ required:true,message:'请输入客户回购周期', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.buyCycle1"  v-if="attribute.rfm.buyCycleCondition === 'lt'"  :rules="[{ required:true,message:'请输入客户回购周期', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <span class="m_fr mr10 del_btn" @click="delcyclechange">×</span>
            </div>
            <div class="form-group clearfix" v-if="cuspriceselect">
              <el-form-item label="客单价" prop="rfm.perAmtCondition">
                <Sectionselect v-on:qujiandata="cuspricedata" :data1="attribute.rfm.perAmt" :data2="attribute.rfm.perAmt2" :qujian="attribute.rfm.perAmtCondition"></Sectionselect>
              </el-form-item>
              <el-form-item prop="rfm.perAmt" v-if="attribute.rfm.perAmtCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.perAmt2"  v-if="attribute.rfm.perAmtCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.perAmt"  v-if="attribute.rfm.perAmtCondition === 'gt'"  :rules="[{ required:true,message:'请输入客单价', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.perAmt"  v-if="attribute.rfm.perAmtCondition === 'lt'"  :rules="[{ required:true,message:'请输入客单价', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <span class="m_fr mr10 del_btn" @click="delcuspricechange">×</span>
            </div>
            <div class="form-group clearfix" v-if="singlepriceselect">
              <el-form-item label="件单价" prop="rfm.perPriceCondition">
                <Sectionselect v-on:qujiandata="singlepricedata" :data1="attribute.rfm.perPrice1" :data2="attribute.rfm.perPrice2" :qujian="attribute.rfm.perPriceCondition"></Sectionselect>
              </el-form-item>
               <el-form-item prop="rfm.perPrice1"  v-if="attribute.rfm.perPriceCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.perPrice2"  v-if="attribute.rfm.perPriceCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.perPrice1"  v-if="attribute.rfm.perPriceCondition === 'gt'"  :rules="[{ required:true,message:'请输入件单价', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="rfm.perPrice1"  v-if="attribute.rfm.perPriceCondition === 'lt'"  :rules="[{ required:true,message:'请输入件单价', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
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
              <el-form-item label="美豆">
                <Sectionselect v-on:qujiandata="gomebeandata" :qujian="attribute.userAsset.gomeBeanCondition" :data1="attribute.userAsset.gomeBean1" :data2="attribute.userAsset.gomeBean2"></Sectionselect>
              </el-form-item>
              <el-form-item prop="userAsset.gomeBean1"  v-if="attribute.userAsset.gomeBeanCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="userAsset.gomeBean2"  v-if="attribute.userAsset.gomeBeanCondition === 'eq'"  :rules="[{ required:true,message:'请输入区间值', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="userAsset.gomeBean1"  v-if="attribute.userAsset.gomeBeanCondition === 'gt'"  :rules="[{ required:true,message:'请输入美豆数', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
              <el-form-item prop="userAsset.gomeBean1"  v-if="attribute.userAsset.gomeBeanCondition === 'lt'"  :rules="[{ required:true,message:'请输入美豆数', trigger:'change' }, {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于等于0的正整数！', trigger: 'blur'}]"></el-form-item>
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
          <!-- 人群信息 -->  <!-- v-on:blur="userNameCheck" -->
          <div class="base_attr">
            <div class="form-group">
              <el-form-item label="人群名称" prop="crowdinfo.name">
                <el-input style="width:200px" type="text" status-icon v-model.trim="attribute.crowdinfo.name" v-on:blur="userNameCheck"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="">
              <div class="error_on" v-show="sameName">人群名称已存在</div>
            </el-form-item>
            <div class="form-group"> <!-- prop="crowdinfo.userCount" -->
              <el-form-item label="覆盖人数">
                <el-input style="width:150px" class="none_input" type="text" readonly name="crowdinfo.userCount" v-model="attribute.crowdinfo.userCount" ></el-input><span class="ml10" >人</span>
                <el-input style="width:150px" class="none_input" type="text" readonly name="crowdinfo.totalCount" v-model="attribute.crowdinfo.percent"></el-input><span class="ml10" >%</span>
                <a class="calculatebtn btn-primary ml10" type="button" @click="calculate('userCreatForm')" :disabled="calculateState">计算</a>
                <div class="error_on" v-show="usercountErr">请计算覆盖人数</div>
              </el-form-item>
            </div>
          </div>
        </div>
        <el-form-item class="allbtn">
          <div class="from_bottom">
            <el-button class="btn btn-primary" type="button" @click="saveBtn('userCreatForm')" v-if="authorizedData.mms_group_save_newgroup">保存</el-button>
            <el-button class="btn btn-primary clear_btn" type="button"  @click="resetBtn('userCreatForm')" v-if="authorizedData.mms_group_reset_newgroup">重置</el-button>
            <el-button class="btn btn-primary goback_btn" type="button" @click="backBtn" v-if="authorizedData.mms_group_back_newgroup">返回</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="m_right m_fl">
      <el-collapse>
        <el-collapse-item title="基本属性" name="1">
          <ul class="attr_select clearfix">
            <li class="m_fl" @click="memberchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="包含会员及访客;会员：已注册且有用户ID的会员,访客：没有用户ID的（未登录）访客">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':memberattrselect==true}">人群属性</el-button>
            </li>
            <li class="m_fl" @click="registerchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户注册站点">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':registerselect==true}">注册站点</el-button>
            </li>
            <li class="m_fl" @click="timechange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户注册时间">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':timeselect==true}">注册时间</el-button>
            </li>
            <li class="m_fl" @click="vipLevelchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="当前的会员等级">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':vipLevelselect==true}">会员等级</el-button>
            </li>
            <li class="m_fl" @click="grawchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="当前的会员成长值">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':grawselect==true}">成长值</el-button>
            </li>
            <li class="m_fl" @click="emailchange" >
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户邮箱激活状态">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':emailselect==true}">邮箱验证</el-button>
            </li>
            <li class="m_fl" @click="phonechange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户手机激活状态">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':phoneselect==true}">手机验证</el-button>
            </li>
            <li class="m_fl" @click="bindcardchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户门店会员卡绑定状态">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':bindcardselect==true}">已绑卡用户</el-button>
            </li>
            <li class="m_fl" @click="inmebchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户是否为内部员工">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':inmebselect==true}">内部员工</el-button>
            </li>
            <li class="m_fl" @click="sexchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户性别，以用户在我的国美-基本资料中填写的性别信息为准">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':sexselect==true}">性别</el-button>
            </li>
            <li class="m_fl" @click="birthchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户生日，以用户在我的国美-基本资料中填写的生日信息为准">
              </el-popover> -->
              <el-button  v-bind:class="{'is-active':birthselect==true}">生日</el-button>
            </li>
            <li class="m_fl" @click="agechange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户年龄，根据用户在我的国美-基本资料中填写的生日信息进行推算结果">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':ageselect==true}">年龄</el-button>
            </li>
            <li class="m_fl"  @click="zhiyechange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户职业，以用户在我的国美-基本资料填写的职业信息为准">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':zhiyeselect==true}">职业</el-button>
            </li>
            <li class="m_fl" @click="citychange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户所在省市地域，以用户有效订单中（已支付和货到付款）最后一次收货地址为准，若无订单信息，则以用户登录最近一次IP地址为准">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':cityselect==true}">省市地域</el-button>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="行为属性" name="2">
          <ul class="attr_select clearfix">
            <li class="m_fl" @click="actionchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户近期产生浏览、搜索、加购、购买、活跃行为分析">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':actionselect==true}">用户行为</el-button>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="RFM模型" name="3">
          <ul class="attr_select clearfix">
            <li class="m_fl" @click="firstorderchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户实物订单中的有效订单中（已支付和货到付款），第一笔订单的时间">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':firstorderselect==true}">首次下单时间</el-button>
            </li>
            <li class="m_fl" @click="lastorderchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户实物订单中的有效订单中（已支付和货到付款）最后一笔订单的时间">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':lastorderselect==true}">最后下单时间</el-button>
            </li>
            <li class="m_fl" @click="ordervaluechange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户实物订单中的有效订单中所有订单的累计订单金额">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':ordervalueselect==true}">下单金额</el-button>
            </li>
            <li class="m_fl" @click="ordernumchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户实物订单中的有效订单中所有订单的累计订单笔数">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':ordernumselect==true}">下单次数</el-button>
            </li>
            <li class="m_fl" @click="cyclechange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户最后一笔有效订单时间减去倒数第二笔有效订单时间的天数差值">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':cycleselect==true}">客户回购周期</el-button>
            </li>
            <li class="m_fl"  @click="cuspricechange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户有效订单中客单价,客单价=用户购买的所有订单总金额 / 用户所有订单总数">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':cuspriceselect==true}">客单价</el-button>
            </li>
            <li class="m_fl" @click="singlepricechange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户有效订单中件单价,件单价=用户购买的所有订单总金额 / 用户所有购买的商品件数">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':singlepriceselect==true}">件单价</el-button>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item title="用户资产" name="4">
          <ul class="attr_select clearfix">
            <li class="m_fl" @click="gomebeanchange">
              <!-- <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                content="用户当前可用美豆余额">
              </el-popover> -->
              <el-button v-bind:class="{'is-active':gomebeanselect==true}">美豆</el-button>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
    <a href="javaScript:void(0);" id="btn" class="el-icon-arrow-up"></a>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
/* brandall-全部品牌 、 nomaleditList-数据回显、 userinfoList-保存、normalusercountList-计算、usernamecheckList-用户名验证、 cityList-全部城市 */
import { brandList, catIdList, nomaleditList, userinfoList, normalusercountList, usernamecheckList, cityList, userpageAuthorized } from 'api/serviceuser'
import uselect from 'common/uselect'
import Sectionselect from 'common/Sectionselect'
import uselectCustom from 'common/uselectCustom'
import userbrand from 'common/userbrand'
import brandselect from 'common/brand_select'
import { mapGetters, mapMutations } from 'vuex'
// import dataArr from 'region-picker/src/components/data.json'
export default {
  components: {
    'uselect': uselect,
    'Sectionselect': Sectionselect,
    'userbrand': userbrand,
    'uselectCustom': uselectCustom,
    'brandselect': brandselect
  },
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      isSubmit: false,
      chooseOneState: false,
      chooseAllState: true,
      normalgEditId: '', // 回显id
      isfirstAction: true,
      arrstate: false,
      citylist: {}, // 城市选择
      catIdlist: {}, // 品类选择
      brandlist: {}, // 品牌选择
      sameName: false,
      sameOk: false,
      calculateState: false,
      iscalculateState: false,
      listNum: true,
      attribute: { // 整体form表单
        baseinfo: {
          isVip: '',
          site: [],
          registerDaysCondition: '',
          registerDaysRelative: '',
          registerDays: {
            value1: '',
            value2: ''
          },
          vipLevel: [],
          grawCondition: '',
          graw1: '',
          graw2: '',
          isEmailValid: '',
          isPhoneValid: 1,
          isBindCard: '',
          isInnerStaff: '',
          sex: '',
          birthdayCondition: '',
          birthdayAbsolute: {
            value1: '',
            value2: ''
          },
          birthdayRelative: '',
          ageCondition: '',
          age1: '',
          age2: '',
          profession: [],
          city: ''
        },
        behavior: {
          composite: '', // 行为属性
          list: [{
            days: '30',
            userAction: [],
            cat1Id: '', // 全部品牌
            brandId: ''
          }]
        },
        rfm: {
          firstBuyCondition: '', // RFM模型
          firstBuyRelative: '',
          firstBuyAbsolute: {
            value1: '',
            value2: ''
          },
          lastBuyCondition: '',
          lastBuyDate: {
            value1: '',
            value2: ''
          },
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
      },
      rules: {
        'baseinfo.site': [
          { required: true, message: '请输入注册站点', trigger: 'change' }
        ],
        'baseinfo.vipLevel': [
          { required: true, message: '请输入会员等级', trigger: 'change' }
        ],
        'baseinfo.grawCondition': [
          { required: true, message: '请输入会员成长值', trigger: 'change' }
        ],
        'baseinfo.isEmailValid': [
          { required: true, message: '请选择邮箱信息', trigger: 'change' }
        ],
        'baseinfo.isPhoneValid': [
          { required: true, message: '请选择手机信息', trigger: 'change' }
        ],
        'baseinfo.isBindCard': [
          { required: true, message: '请选择绑卡信息', trigger: 'change' }
        ],
        'baseinfo.isInnerStaff': [
          { required: true, message: '请选择是否为内部员工', trigger: 'change' }
        ],
        'baseinfo.sex': [
          { required: true, message: '请选择性别信息', trigger: 'change' }
        ],
        'baseinfo.birthdayCondition': [
          { required: true, message: '请选择生日信息', trigger: 'change' }
        ],
        'baseinfo.ageCondition': [
          { required: true, message: '请选择年龄信息', trigger: 'change' }
        ],
        'baseinfo.profession': [
          { required: true, message: '请选择职业信息', trigger: 'change' }
        ],
        'baseinfo.city': [
          { required: true, message: '请选择地域信息', trigger: 'change' }
        ],
        'rfm.firstBuyCondition': [
          { required: true, message: '请选首次下单时间', trigger: 'change' }
        ],
        'rfm.lastBuyCondition': [
          { required: true, message: '请选最后下单时间', trigger: 'change' }
        ],
        // 'rfm.buyAmtCondition': [
        //   { required: true, message: '请选下单金额', trigger: 'change' },
        //   { validator: activityTypeRR, trigger: 'change' }
        // ],
        // 'rfm.buyTimesCondition': [
        //   { required: true, message: '请选下单次数', trigger: 'change' }
        // ],
        // 'rfm.buyCycleCondition': [
        //   { required: true, message: '请选客户回购周期', trigger: 'change' }
        // ],
        // 'rfm.perAmtCondition': [
        //   { required: true, message: '请选客单价', trigger: 'change' }
        // ],
        // 'rfm.perPriceCondition': [
        //   { required: true, message: '请选件单价', trigger: 'change' }
        // ],
        // 'userAsset.gomeBeanCondition': [
        //   { required: true, message: '请输入美豆数', trigger: 'change' }
        // ],
        'crowdinfo.name': [
          { required: true, message: '请输入人群名称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        'crowdinfo.userCount': [
          { required: true, message: '请计算覆盖人数', trigger: 'change' }
        ]
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
          if (_this.authorizedPage) { // 初始化
            _this.catall()
            // _this.brandall()
            _this.cityall()
            _this.normalgEditId = _this.NormalGEditId
            _this.databack()
          }
        } else {
          // 跳转到REM首页
          window.location.href(mmsDomain.ermHome)
        }
      }
    })
  },
  mounted: function () {
    var obtn = document.getElementById('btn')
    var clientHeight = document.documentElement.clientHeight
    var time = null
    var isTop = true
    var cancelScroll = false
    window.onscroll = function () {
      var osTop = document.documentElement.scrollTop || document.body.scrollTop
      if (osTop >= clientHeight) {
        obtn.style.display = 'block'
      } else {
        obtn.style.display = 'none'
      }
      if (!isTop) {
        clearInterval(time)
      }
      isTop = false
    }
    obtn.onclick = function () { // 点击事件
      if (cancelScroll === false) {
        time = setInterval(function () {
          var osTop = document.documentElement.scrollTop || document.body.scrollTop
          var ispeed = Math.floor(-osTop / 10)
          document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed
          isTop = true
          if (osTop === 0) {
            clearInterval(time)
          }
        }, 30)
      } else {
        clearInterval(time)
        cancelScroll = true
      }
    }
  },
  methods: {
    brandIdArr: function (data) {
      this.attribute.behavior.list[data.index].brandId = data.brandId
    },
    addcomponent: function () { // 增加品类
      this.attribute.behavior.list.push({
        days: '30',
        userAction: ['0', '1', '2'],
        cat1Id: '',
        brandId: '',
        isCardOrBrand: false
      })
    },
    delcomponent: function (len) { // 删除品类
      this.attribute.behavior.list.splice(len - 1, 1)
      if (len <= 1) {
        this.actionselect = false
      }
    },
    memberchange: function () { // 行为属性
      this.memberattrselect = !this.memberattrselect
      if (!this.memberattrselect) {
        this.attribute.baseinfo.isVip = ''
      }
    },
    delmemberchange: function () {
      this.memberattrselect = false
      this.attribute.baseinfo.isVip = ''
    },
    registerchange: function () {
      this.registerselect = !this.registerselect
      if (!this.registerselect) {
        this.attribute.baseinfo.site = []
      }
    },
    delregisterchange: function () {
      this.registerselect = false
      this.attribute.baseinfo.site = []
    },
    timechange: function () {
      this.timeselect = !this.timeselect
      if (!this.timeselect) {
        this.attribute.baseinfo.registerDaysCondition = ''
        this.attribute.baseinfo.registerDaysRelative = ''
        this.attribute.baseinfo.registerDays.value1 = ''
        this.attribute.baseinfo.registerDays.value2 = ''
      }
    },
    deltimechange: function () {
      this.timeselect = false
      this.attribute.baseinfo.registerDaysCondition = ''
      this.attribute.baseinfo.registerDaysRelative = ''
      this.attribute.baseinfo.registerDays.value1 = ''
      this.attribute.baseinfo.registerDays.value2 = ''
    },
    vipLevelchange: function () {
      this.vipLevelselect = !this.vipLevelselect
      if (!this.vipLevelselect) {
        this.attribute.baseinfo.vipLevel = []
      }
    },
    delvipLevelchange: function () {
      this.vipLevelselect = false
      this.attribute.baseinfo.vipLevel = []
    },
    grawchange: function () {
      this.grawselect = !this.grawselect
      if (!this.grawselect) {
        this.attribute.baseinfo.grawCondition = ''
        this.attribute.baseinfo.graw1 = ''
        this.attribute.baseinfo.graw2 = ''
      }
    },
    delgrawchange: function () {
      this.grawselect = false
      this.attribute.baseinfo.grawCondition = ''
      this.attribute.baseinfo.graw1 = ''
      this.attribute.baseinfo.graw2 = ''
    },
    emailchange: function () {
      this.emailselect = !this.emailselect
      this.isEmailValid = 1
      if (!this.emailselect) {
        this.attribute.baseinfo.isEmailValid = ''
      }
    },
    delemailchange: function () {
      this.emailselect = false
      this.attribute.baseinfo.isEmailValid = ''
    },
    phonechange: function () {
      this.phoneselect = !this.phoneselect
      if (!this.phoneselect) {
        this.attribute.baseinfo.isPhoneValid = ''
      }
    },
    delphonechange: function () {
      this.phoneselect = false
      this.attribute.baseinfo.isPhoneValid = ''
    },
    bindcardchange: function () {
      this.bindcardselect = !this.bindcardselect
      if (!this.bindcardselect) {
        this.attribute.baseinfo.isBindCard = ''
      }
    },
    delbindcardchange: function () {
      this.bindcardselect = false
      this.attribute.baseinfo.isBindCard = ''
    },
    inmebchange: function () {
      this.inmebselect = !this.inmebselect
      if (!this.inmebselect) {
        this.attribute.baseinfo.isInnerStaff = ''
      }
    },
    delinmebchange: function () {
      this.inmebselect = false
      this.attribute.baseinfo.isInnerStaff = ''
    },
    sexchange: function () {
      this.sexselect = !this.sexselect
      if (!this.sexselect) {
        this.attribute.baseinfo.sex = ''
      }
    },
    delsexchange: function () {
      this.sexselect = false
      this.attribute.baseinfo.sex = ''
    },
    birthchange: function () {
      this.birthselect = !this.birthselect
      if (!this.birthselect) {
        this.attribute.baseinfo.birthdayCondition = ''
        this.attribute.baseinfo.birthdayAbsolute.value1 = ''
        this.attribute.baseinfo.birthdayAbsolute.value2 = ''
        this.attribute.baseinfo.birthdayRelative = ''
      }
    },
    delbirthchange: function () {
      this.birthselect = false
      this.attribute.baseinfo.birthdayCondition = ''
      this.attribute.baseinfo.birthdayAbsolute.value1 = ''
      this.attribute.baseinfo.birthdayAbsolute.value2 = ''
      this.attribute.baseinfo.birthdayRelative = ''
    },
    agechange: function () {
      this.ageselect = !this.ageselect
      if (!this.ageselect) {
        this.attribute.baseinfo.ageCondition = ''
        this.attribute.baseinfo.age1 = ''
        this.attribute.baseinfo.age2 = ''
      }
    },
    delagechange: function () {
      this.ageselect = false
      this.attribute.baseinfo.ageCondition = ''
      this.attribute.baseinfo.age1 = ''
      this.attribute.baseinfo.age2 = ''
    },
    zhiyechange: function () {
      this.zhiyeselect = !this.zhiyeselect
      if (!this.zhiyeselect) {
        this.attribute.baseinfo.profession = []
      }
    },
    delzhiyechange: function () {
      this.zhiyeselect = false
      this.attribute.baseinfo.profession = []
    },
    citychange: function () {
      this.cityselect = !this.cityselect
      if (!this.cityselect) {
        this.attribute.baseinfo.city = ''
      }
    },
    delcitychange: function () {
      this.cityselect = false
      this.attribute.baseinfo.city = ''
    },
    actionchange: function () { // 用户行为
      this.actionselect = true
      this.attribute.behavior.composite = 'or'
      this.attribute.behavior.list.forEach(function (item) {
        item.userAction = ['0', '1', '2']
      })
      if (this.attribute.behavior.list.length <= 0) {
        this.addcomponent()
      }
    },
    delactionchange: function (index) {
      this.attribute.behavior.list.splice(index, 1)
    },
    firstorderchange: function () { // 模型属性
      this.firstorderselect = !this.firstorderselect
      if (!this.firstorderselect) {
        this.attribute.rfm.firstBuyCondition = ''
        this.attribute.rfm.firstBuyRelative = ''
        this.attribute.rfm.firstBuyAbsolute.value1 = ''
        this.attribute.rfm.firstBuyAbsolute.value2 = ''
      }
    },
    delfirstorderchange: function () {
      this.firstorderselect = false
      this.attribute.rfm.firstBuyCondition = ''
      this.attribute.rfm.firstBuyRelative = ''
      this.attribute.rfm.firstBuyAbsolute.value1 = ''
      this.attribute.rfm.firstBuyAbsolute.value2 = ''
    },
    lastorderchange: function () {
      this.lastorderselect = !this.lastorderselect
      if (!this.lastorderselect) {
        this.attribute.rfm.lastBuyCondition = ''
        this.attribute.rfm.lastBuyDate.value1 = ''
        this.attribute.rfm.lastBuyDate.value2 = ''
        this.attribute.rfm.lastBuyRelative = ''
      }
    },
    dellastorderchange: function () {
      this.lastorderselect = false
      this.attribute.rfm.lastBuyCondition = ''
      this.attribute.rfm.lastBuyDate.value1 = ''
      this.attribute.rfm.lastBuyDate.value2 = ''
      this.attribute.rfm.lastBuyRelative = ''
    },
    ordervaluechange: function () {
      this.ordervalueselect = !this.ordervalueselect
      if (!this.ordervalueselect) {
        this.attribute.rfm.buyAmtCondition = ''
        this.attribute.rfm.buyAmt = ''
        this.attribute.rfm.buyAmt2 = ''
      }
    },
    delordervaluechange: function () {
      this.ordervalueselect = false
      this.attribute.rfm.buyAmtCondition = ''
      this.attribute.rfm.buyAmt = ''
      this.attribute.rfm.buyAmt2 = ''
    },
    ordernumchange: function () {
      this.ordernumselect = !this.ordernumselect
      if (!this.ordernumselect) {
        this.attribute.rfm.buyTimesCondition = ''
        this.attribute.rfm.buyTimes = ''
        this.attribute.rfm.buyTimes2 = ''
      }
    },
    delordernumchange: function () {
      this.ordernumselect = false
      this.attribute.rfm.buyTimesCondition = ''
      this.attribute.rfm.buyTimes = ''
      this.attribute.rfm.buyTimes2 = ''
    },
    cyclechange: function () {
      this.cycleselect = !this.cycleselect
      if (!this.cycleselect) {
        this.attribute.rfm.buyCycleCondition = ''
        this.attribute.rfm.buyCycle1 = ''
        this.attribute.rfm.buyCycle2 = ''
      }
    },
    delcyclechange: function () {
      this.cycleselect = false
      this.attribute.rfm.buyCycleCondition = ''
      this.attribute.rfm.buyCycle1 = ''
      this.attribute.rfm.buyCycle2 = ''
    },
    cuspricechange: function () {
      this.cuspriceselect = !this.cuspriceselect
      if (!this.cuspriceselect) {
        this.attribute.rfm.perAmtCondition = ''
        this.attribute.rfm.perAmt = ''
        this.attribute.rfm.perAmt2 = ''
      }
    },
    delcuspricechange: function () {
      this.cuspriceselect = false
      this.attribute.rfm.perAmtCondition = ''
      this.attribute.rfm.perAmt = ''
      this.attribute.rfm.perAmt2 = ''
    },
    singlepricechange: function () {
      this.singlepriceselect = !this.singlepriceselect
      if (!this.singlepriceselect) {
        this.attribute.rfm.perPriceCondition = ''
        this.attribute.rfm.perPrice1 = ''
        this.attribute.rfm.perPrice2 = ''
      }
    },
    delsinglepricechange: function () {
      this.singlepriceselect = false
      this.attribute.rfm.perPriceCondition = ''
      this.attribute.rfm.perPrice1 = ''
      this.attribute.rfm.perPrice2 = ''
    },
    gomebeanchange: function () { // 美豆资产
      this.gomebeanselect = !this.gomebeanselect
      if (!this.gomebeanselect) {
        this.attribute.userAsset.gomeBeanCondition = ''
        this.attribute.userAsset.gomeBean1 = ''
        this.attribute.userAsset.gomeBean2 = ''
      }
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
      // this.attribute.baseinfo.registerDays = data.value1 + ',' + data.value2
      this.attribute.baseinfo.registerDays.value1 = data.value1
      this.attribute.baseinfo.registerDays.value2 = data.value2
    },
    birthdata: function (data) {
      this.attribute.baseinfo.birthdayCondition = data.type
      this.attribute.baseinfo.birthdayRelative = data.valuerelative
      this.attribute.baseinfo.birthdayAbsolute.value1 = data.value1
      this.attribute.baseinfo.birthdayAbsolute.value2 = data.value2
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
      // this.attribute.rfm.firstBuyAbsolute = data.value1 + ',' + data.value2
      this.attribute.rfm.firstBuyAbsolute.value1 = data.value1
      this.attribute.rfm.firstBuyAbsolute.value2 = data.value2
    },
    lastorderdata: function (data) {
      this.attribute.rfm.lastBuyCondition = data.type
      this.attribute.rfm.lastBuyRelative = data.valuerelative
      // this.attribute.rfm.lastBuyDate = data.value1 + ',' + data.value2
      this.attribute.rfm.lastBuyDate.value1 = data.value1
      this.attribute.rfm.lastBuyDate.value2 = data.value2
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
      brandList({
        'name': '美的'
      }, (data) => {
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
      nomaleditList({'id': _this.normalgEditId}, (data) => {
        if (data.success) {
          _this.attribute = JSON.parse(data.data.userCondition)
          _this.attribute.crowdinfo.userCount = String(data.data.userCount).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
          _this.attribute.crowdinfo.totalCount = data.data.percent
          // 初始化用户行为是否显示
          _this.attribute.behavior.list.forEach(function (item) {
            if (item.userAction.length > 0 || item.cat1Id.length > 0 || item.cat1Id.length > 0) {
              _this.actionselect = true
            }
          })
          _this.stateinit() // 调用回显状态
          _this.emptyTid('')
        }
      })
    },
    stateinit: function () {
      var _this = this
      /* 回显状态init */
      if (_this.attribute.baseinfo.isVip !== '') { // 基础属性
        _this.memberattrselect = true
      }
      if (_this.attribute.baseinfo.site.length > 0) {
        _this.registerselect = true
      }
      if (_this.attribute.baseinfo.registerDaysCondition !== '') {
        _this.timeselect = true
      }
      if (_this.attribute.baseinfo.vipLevel.length > 0) {
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
      if (_this.attribute.baseinfo.profession.length > 0) {
        _this.zhiyeselect = true
      }
      if (_this.attribute.baseinfo.city !== '') {
        _this.cityselect = true
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
      if (_this.attribute.userAsset.gomeBean1 !== '' || _this.attribute.userAsset.gomeBean2 !== '') { // 国美豆
        _this.gomebeanselect = true
      }
    },
    calculate: function (formName) { // 计算
      var _this = this
      _this.isSubmit = true
      _this.$refs[formName].validate((valid) => {
        // todo 校验
        var Lists = _this.attribute.behavior.list
        if (_this.actionselect) {
          if (!_this._validateCardAndBrand(Lists)) {
            return
          }
        }
        if (valid) {
          _this.calculateState = true
          const loading = _this.$loading({ // loading
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          normalusercountList({'condition': JSON.stringify(_this.attribute)}, (data) => {
            if (data.success === true) {
              _this.usercountErr = false
              _this.calculateState = false
              loading.close()
              var percent = ((data.data.userCount / data.data.totalCount) * 100).toFixed(2)
              _this.attribute.crowdinfo.userCount = String(data.data.userCount).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
              _this.attribute.crowdinfo.totalCount = data.data.totalCount
              _this.attribute.crowdinfo.percent = percent
              // 记录计算按钮当前状态
              _this.iscalculateState = !_this.iscalculateState
            } else {
              _this.iscalculateState = !_this.iscalculateState
              loading.close()
              _this.calculateState = false
              _this.$message({
                message: '计算失败，请重新计算！',
                type: 'info'
              })
            }
          })
        }
      })
    },
    saveBtn: function (formName) {
      const self = this
      self.isSubmit = true
      // 计算人数
      if (self.attribute.crowdinfo.userCount === '') {
        self.usercountErr = true
      }
      self.$refs[formName].validate((valid) => {
        // todo 校验
        var Lists = self.attribute.behavior.list
        if (self.actionselect) {
          if (!self._validateCardAndBrand(Lists)) {
            return
          }
        }
        if (valid) {
          if (self.attribute.crowdinfo.userCount !== '') {
            if (self.arrstate) {
              self.$message({
                message: '请重新计算覆盖人数！',
                type: 'info'
              })
            } else {
              userinfoList(
                { 'id': self.normalgEditId ? self.normalgEditId : -1,
                  'condition': JSON.stringify(self.attribute),
                  'name': self.attribute.crowdinfo.name,
                  'userCount': self.attribute.crowdinfo.userCount,
                  'totalCount': self.attribute.crowdinfo.totalCount,
                  'percent': self.attribute.crowdinfo.percent
                }, (data) => {
                  if (data.success) {
                    self.$confirm('提交成功', '提示').then(() => {
                      self.$router.push('/usermanage') // 页面跳转
                    })
                  } else {
                    if (!data.success) {
                      self.$message(data.remark)
                    }
                  }
                }
              )
            }
          } else {
            self.usercountErr = true
          }
        }
      })
    },
    resetBtn: function (formName) { // 表单重置
      var _this = this
      _this.$confirm('表单重置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$message({
          type: 'success',
          message: '重置成功!'
        })
        Object.assign(_this.$data, _this.$options.data())
        _this.$refs[formName].resetFields()
        _this.catall()
        // _this.brandall()
        _this.cityall()
        // 重新获取权限
        userpageAuthorized({
          code: 'mms_user_group_create'
        }, function (data) {
          if (data.success) {
            if (data.data.isLogin) {
              _this.authorizedPage = data.data.authorize.mms_user_group_create
              _this.authorizedData = data.data.authorize ? data.data.authorize : {}
            } else {
              // 跳转到REM首页
              window.location.href(mmsDomain.ermHome)
            }
          }
        })
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
      usernamecheckList({'id': -1, 'name': this.attribute.crowdinfo.name}, (data) => {
        if (this.attribute.crowdinfo.name !== '') {
          if (data.success === true) {
            this.sameOk = true
            this.sameName = false
          } else {
            this.sameName = true
          }
        }
      })
    },
    _validateCardAndBrand: function (lists) { // 品牌品类的校验
      var self = this
      if (!lists && lists.length < 1) {
        return lists
      }
      var isValid = true
      lists.forEach((element, index) => {
        if (self.isSubmit && element.cat1Id.length === 0 && element.brandId.length === 0) {
          element.isCardOrBrand = false
          isValid = false
        } else {
          element.isCardOrBrand = true
        }
      })
      return isValid
    },
    ...mapMutations({
      emptyTid: 'SET_NORMALGEDITID'
    })
  },
  watch: { // 监听状态
    'attribute': {
      handler (infoAll) {
        if (!this.isfirstAction) { // 用户管理页面编辑跳转-过滤第一次编辑
          if (this.attribute.crowdinfo.userCount !== '') {
            this.arrstate = true
          } else {
            this.arrstate = false
          }
        }
        this.isfirstAction = false
      },
      deep: true
    },
    'iscalculateState': {
      handler (val, oldVal) {
        if (this.attribute.crowdinfo.userCount !== '') {
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
        var Lists = this.attribute.behavior.list
        if (this.actionselect) {
          this._validateCardAndBrand(Lists)
        }
        if (this.attribute.behavior.list.length > 10) {
          this.listNum = false
        } else {
          this.listNum = true
        }
      },
      deep: true
    },
    'attribute.rfm': {
      handler (rfm) {
        this.attribute.rfm = rfm
      },
      deep: true
    }
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
.m_left{ padding: 0 0 200px;}
.usercreat .w120 {
  width: 120px;
}
.usercreat .text_c {
  color: #2875cc;
  margin-right: 10px;
}
.usercreat .el-input__inner{ width: 120px;}
.usercreat .add_btn_attr,
.del_btn_attr {
  margin-top: 25px;
  margin-right: 5px;
  width: 15px;
  height: 15px;
  text-align: center;
  line-height: 15px;
  border: 1px solid #9fc2e6;
  color: #9fc2e6;
  display: inline-block;
  cursor: pointer;
}
.usercreat .btnAll{ margin-left: 119px; }
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
.usercreat .form-group{ position: relative;}
.usercreat .del_btn {
  font-family: Simsun;
  cursor: pointer;
  color: #599ae1;
  visibility: hidden;
  position: absolute;
  top: 10px;
  right: 0;
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
  border: 1px solid #e6e6e6;
  border-radius: 0;
  width: 94px;
  text-align: center;
  padding: 8px 3px;
}
.usercreat .m_fl .el-button.is-active {
  color: #333;
  border-color: #4990e2;
  /*background-color: #ecf5ff;*/
  background: url(/static/images/isclick.png) no-repeat right bottom;
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
.usercreat .btn-primary{text-shadow: none; border-radius: 3px;}
.usercreat .region-picker{ width: 350px! important;}
.usercreat .error_on{color: #f56c6c;font-size: 12px; height: 20px; line-height: 20px;}
.usercreat .nopdleft{ padding-left: 0;}
.usercreat .marginleft{ margin-left: 124px;}
.usercreat input[readonly][type=text].none_input{ cursor: not-allowed;ime-mode: disabled; width: 120px; background: #eaeaea !important;}
.usercreat .region-picker{ float: left;}
.usercreat .form-group .el-select input.el-input__inner{ width: 100px !important;  height: 30px !important; padding: 0}
.usercreat .el-collapse-item is-active{ padding-bottom: 20px;}
.usercreat .attr_two .form-group{ position: relative;}
.usercreat .attr_two .form-group .del_btn { position: absolute; top: 10px; right: 0;}
.usercreat .clearBtn{ border-radius: 2px; width: 40px; height: 30px; margin-left: 5px; line-height: 30px; text-align:center; background: #4990e2; color: #fff;  display: inline-block; cursor: pointer}
.usercreat .el-form-item{ padding-bottom: 0; margin-bottom: 0;}
.usercreat .el-form-item__content{ line-height: 30px;}
.usercreat input[type=text]{ padding: 0; line-height: 30px;}
.usercreat .el-checkbox{ line-height: 40px;}
.usercreat .el-form-item__error{ padding-left: 119px !important;}
.usercreat .error_pl { margin-bottom: 10px;}
.usercreat .npmt .el-form-item__error { margin-top: -10px;}
.usercreat .list_out{ margin-top: 30px;}
.calculatebtn{ padding: 5px 10px; color: #fff; cursor: pointer; margin-top: 5px;}
.calculatebtn:hover{color: #fff;}
 #btn {
    display: none;
    width: 40px;
    height: 40px;
    position: fixed;
    right: 50px;
    bottom: 30px;
    background: #648fde;
    font-size: 24px;
    color: #fff;
    text-align: center;
    line-height: 40px;
}
.userbrandId_out .el-form-item__content{ float: left;}
.usercreat .region-picker .picker-toggle{margin-left: 0}
</style>
