<template>
<!-- 用户群管理 -->
  <div class="userManage">
    <div class="widget-box clearfix">
        <div class="widget-header n-widget-header">
            <h5 class="widget-title">检索条件</h5>
        </div>
      <div class="widget-main clearfix">
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <label class="col-xs-4 col-sm-4 control-label text-right">群组名称/编号</label>
            <div class="col-xs-8 col-sm-8">
                <input type="text" class="form-control" name="" value="" v-model="searchData.name" placeholder="请输入编号或者群组名称"/>
            </div>
        </div>
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <label class="col-xs-4 col-sm-4 control-label text-right">更新人</label>
            <div class="col-xs-8 col-sm-8">
                <input type="text" class="form-control" name="" value="" v-model="searchData.updateUser" placeholder="请输入更新人名称"/>
            </div>
        </div>
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <label class="col-xs-4 col-sm-4 control-label text-right">群组类型</label>
          <div class="col-sm-8 col-sm-8 changeWidth">
            <el-select clearable v-model="searchData.groupType" placeholder="群组类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <div class="col-xs-4 col-sm-4 pr0">
            <el-select v-model="searchData.dateType" style="width:105px; float: right;" >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="col-xs-4 col-sm-4">
            <el-date-picker
                  v-model="searchData.startDate"
                  type="date"
                  placeholder=""
                  size="small"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerStart" >
            </el-date-picker>
          </div>
          <div class="col-xs-4 col-sm-4">
            <el-date-picker
                  v-model="searchData.endDate"
                  type="date"
                  size="small"
                  placeholder=""
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerEnd" >
            </el-date-picker>
          </div>
        </div>
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <label class="col-xs-4 col-sm-4 control-label text-right"></label>
            <div class="col-xs-4 col-sm-4">
                <el-button type="primary" class="btn btn-primary primary—btn" @click="rearch" v-if="authorizedData.mms_group_search_usergroup">搜索</el-button>
            </div>
        </div>
      </div>
    </div>
    <div class="m_jj">
      <!-- 新增用户群 -->
      <el-button class="btn-primary" type="text" @click="addNormalGroup" v-if="authorizedData.mms_group_new_usergroup">新增用户群</el-button>
       <!-- 新建复合群 -->
      <el-button class="btn-primary ml8 text-white" type="text" @click="addNewOriginGroup('addgrouplayer')" v-if="authorizedData.mms_group_new_fuhegroup">+新建复合群</el-button>
      <el-dialog title="新建复合群" :visible.sync="dialogFormVisible" >
        <el-form ref="addgrouplayer" :model="addgrouplayer" :rules="rules" label-width="120px">
          <el-form-item label="复合群名称" prop="OriginName" :label-width="formLabelWidth">
            <el-input v-model="addgrouplayer.OriginName" :disabled = "disabledInput" v-on:blur="adduserNameCheck('1', addgrouplayer.OriginName)"></el-input>
            <div class="el-form-item__error" v-show="sameName">用户名已存在</div>
          </el-form-item>
          <el-form-item label="复合群组类型">
            <el-radio-group v-model="addgrouplayer.composite" :disabled="disabledInput">
              <el-radio :label="1">交集</el-radio>
              <el-radio :label="2">并集</el-radio>
              <el-radio :label="3">差集</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="目标群组" :label-width="formLabelWidth"  prop="targetGroup">
            <el-select clearable filterable size="medium"  v-model="addgrouplayer.targetGroup" placeholder="请选择目标群组"  @focus="targeinit"  @change="addNewOption">
              <el-option v-for="(item, index) in targetArr" :key="index" :value="item.id" :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="源群组" :label-width="formLabelWidth" prop="originGroup">
            <user-group :type="'3'" :choses="addgrouplayer.originGroup" v-on:choseUsers="choseUserGroup" userPlaceholder="请选择源群组名称" :msgoriginGroup="targetGroupOption" ></user-group>
            <!-- <user-group :type="msgRuleForm.groupType" :isradio="msgRuleForm.groupType" :choses="msgRuleForm.goupItems"
            v-on:choseUsers="choseGroup" userPlaceholder="请输入用户群组名称"></user-group> -->
          </el-form-item>
          <el-form-item class="dis_inline count countbtn" label="覆盖人数" :label-width="formLabelWidth">
            <el-input class="w200 none_input" v-model="addgrouplayer.userCount" placeholder="用户ID数量" readonly></el-input>
            <el-button style="margin-left:6px;" class="el-button btn btn-primary" type="primary" @click="addcountAll" :disabled="disabledInput" :loading="loading">{{btntext}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="el-button btn btn-primary" type="primary"  @click="submitForm('addgrouplayer')">确 定</el-button>
          <el-button class="el-button btn btn-primary btn-white primary—btn" @click="cellbtn('addgrouplayer')">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 导入用户群 -->
      <el-button class="btn-primary ml8" type="text" @click="handaddBtn('importgrouplayer')" v-if="authorizedData.mms_group_import_usergroup">+导入用户群</el-button>
      <el-dialog title="导入用户群" width="600px" :visible.sync="dialogFormVisible2">
        <el-form  class="importFile" ref="importgrouplayer" :model="importgrouplayer" :rules="rules" label-width="120px">
          <el-form-item label="群组名称" prop="name" :label-width="formLabelWidth">
            <el-input v-model="importgrouplayer.name" v-on:blur="adduserNameCheck('2', importgrouplayer.name)"></el-input>
            <div class="el-form-item__error" v-show="exportsameName">用户名已存在</div>
          </el-form-item>
          <!-- 导入 -->
          <el-form-item label="导入文件:" class="add-file" enctype="multipart/form-data" ref="up">
            <el-input disabled class="up-input" v-model="importgrouplayer.upLoadName"></el-input>
            <el-button type="primary"  class="el-button btn btn-primary" style="margin:1px 0 0 5px;">选择</el-button>
            <input type="file" name="file" @change="getFile($event)" multiple="multiple" class="file" ref="clearfile"/>
            <div class="el-form-item__error" v-show="uploadState">请选择上传文件</div>
            <!-- <el-upload
              class="ensure ensureButt up-button"
              ref="upload222"
              :limit='1'
              action="http://mmsc.atguat.com.cn/mms/userGroup/saveImportUserGroup.do"
              :on-change="handleChange"
              :beforeUpload="beforeAvatarUpload"
              :file-list="importgrouplayer.fileList"
              :show-file-list="false"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选择</el-button>
            </el-upload> -->
          </el-form-item>
          <div style="margin:-18px 0 0 121px">请先下载 <a :href="mmscUrl+'/static/template/UserGroupTemplate.xlsx'">导入用户群模版</a></div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary"  class="el-button btn btn-primary" @click="handadd('importgrouplayer')">确 定</el-button>
          <el-button class="el-button btn btn-primary btn-white primary—btn" @click="celhandadd('importgrouplayer')">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <table class="table dataTable table-striped no-margin">
        <thead>
          <tr role="row">
            <th>群组名称</th>
            <th>群组类型</th>
            <th>人群数量</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作人</th>
            <th>群组状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-if="!isFirst && ugroupmanage.list">
        <tr v-for="(itemlist ,index) in ugroupmanage.list" :key="itemlist.id">
          <td class="pasb">
            <span style="width:60%;">{{itemlist.name}}</span>
            <div class="test_color">({{itemlist.id}})</div>
            <el-popover
              placement="right"
              width="400"
              trigger="click">
              <!-- 普通 -->
              <slot>
                <div class="layer" v-show="itemlist.type==0">
                  <div v-if="seen">
                    <ul class="ul_h">
                      <li>
                        <h4>基本属性</h4>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.isVip !==''">
                          <span class="td title">人群属性：</span>
                          <span class="detail" v-if="nomallist.baseinfo.registerDaysCondition==0">访客</span>
                          <span class="detail" v-if="nomallist.baseinfo.registerDaysCondition==1">会员</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.registerDaysCondition !==''">
                          <span class="td title">注册时间：</span>
                          <span class="detail" v-if="nomallist.baseinfo.registerDaysCondition == 0">近{{nomallist.baseinfo.registerDaysRelative}}天</span>
                          <span class="detail" v-if="nomallist.baseinfo.registerDaysCondition == 1">{{nomallist.baseinfo.registerDays.value1}} 至 {{nomallist.baseinfo.registerDays.value2}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.site.length > 0">
                          <span class="td title">注册站点：</span>
                          <span class="detail"  v-for="(item, index) in nomallist.baseinfo.site" :key="index">{{item}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.vipLevel.length > 0">
                          <span class="td title">会员等级：</span>
                          <span class="detail">{{nomallist.baseinfo.vipLevel}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.grawCondition !==''">
                          <span class="td title">成长值：</span>
                          <span class="detail" v-show="nomallist.baseinfo.grawCondition === 'gt'">大于{{nomallist.baseinfo.graw1}}</span>
                          <span class="detail" v-show="nomallist.baseinfo.grawCondition === 'lt'">小于{{nomallist.baseinfo.graw2}}</span>
                          <span class="detail" v-show="nomallist.baseinfo.grawCondition === 'eq'">区间{{nomallist.baseinfo.graw1}}-{{nomallist.baseinfo.graw2}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.isEmailValid !==''">
                          <span class="td title">邮箱验证：</span>
                          <span class="detail">{{nomallist.baseinfo.isEmailValid | choose_only}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.isPhoneValid !==''">
                          <span class="td title">手机验证：</span>
                          <span class="detail">{{nomallist.baseinfo.isPhoneValid | choose_only}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.isBindCard !==''">
                          <span class="td title">已绑卡用户：</span>
                          <span class="detail">{{nomallist.baseinfo.isBindCard | choose_only}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.isInnerStaff !==''">
                          <span class="td title">内部员工：</span>
                          <span class="detail">{{nomallist.baseinfo.isInnerStaff | choose_only}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.sex !==''">
                          <span class="td title">性别：</span>
                          <span class="detail">{{nomallist.baseinfo.sex | sex}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.birthdayCondition !==''">
                          <span class="td title">生日：</span>
                          <span class="detail" v-show="nomallist.baseinfo.birthdayCondition == 0">近{{nomallist.baseinfo.birthdayRelative}}</span>
                          <span class="detail" v-show="nomallist.baseinfo.birthdayCondition == 1">区间{{nomallist.baseinfo.birthdayAbsolute}}</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.ageCondition !==''">
                          <span class="td title">年龄：</span>
                          <span class="detail" v-show="nomallist.baseinfo.ageCondition === 'gt'">大于{{nomallist.baseinfo.age1}}</span>
                          <span class="detail" v-show="nomallist.baseinfo.ageCondition === 'lt'">小于{{nomallist.baseinfo.age2}}</span>
                          <span class="detail" v-show="nomallist.baseinfo.ageCondition === 'eq'">区间{{nomallist.baseinfo.age1}}-{{nomallist.baseinfo.age2}}岁</span>
                        </div>
                        <div class="pd clearfix" v-show="nomallist.baseinfo.profession.length > 0">
                          <span class="td title">职业：</span>
                          <span class="detail"  v-for="(item, index) in nomallist.baseinfo.profession" :key="index">{{item | job}}、</span>
                        </div>
                        <div class="pd clearfix" v-show="citylist !==''">
                          <span class="td title">省市地域：</span>
                          <div class="detail">
                              <p class="actionright">
                                <span>{{citylist}}</span>
                              </p>
                          </div>
                        </div>
                      </li>
                      <li v-show="userListState">
                        <h4>用户行为</h4>
                        <div class="pd clearfix" v-show="nomallist.behavior.composite == 'and'">
                          <span class="td title">类型：</span>交集
                        </div>
                        <div class="pd clearfix" v-show="nomallist.behavior.composite == 'or'">
                          <span class="td title">类型：</span>交集
                        </div>
                        <div class="action_out" v-for="(item, index) in nomallist.behavior.list" :key="index">
                          <div class="pd showout clearfix" :class="{'nowshow_out':index, 'nowshow_out_2':!index}">
                            <div class="pd clearfix">
                              <span class="td title">天数：</span>
                              <span>近{{item.days}}天</span>
                            </div>
                            <div class="clearfix" v-show="item.userAction.length > 0">
                              <span class="td title">操作：</span>
                              <p class="actionright">
                                <span v-for="(itemAyy, index) in item.userAction" :key="index">{{itemAyy | useraction}}、</span>
                              </p>
                            </div>
                            <div class="clearfix"> <!-- v-for="(val, index) in behavior.list" :key="index" -->
                              <div :class="{'nowshow_hidden':!index, 'nowshow_hidden_2':index}" >
                                <div v-show="catIdlist !== ''"> <!-- v-show="catIdlist_state"-->
                                  <p class="brand td" style="margin-left:61px;">品类：</p>
                                  <p class="actionright">
                                    <span>{{catIdlist}}</span>
                                  </p>
                                </div>
                                <div v-show="brandlist !== ''"> <!-- v-show="brandlist_state" -->
                                  <span class="td title">品牌：</span>
                                  <p class="actionright">
                                    <span>{{brandlist}}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li v-show="nomallist.rfm.firstBuyCondition || nomallist.rfm.lastBuyCondition || nomallist.rfm.buyAmtCondition || nomallist.rfm.buyTimesCondition || nomallist.rfm.buyCycleCondition || nomallist.rfm.perAmtCondition || nomallist.rfm.perPriceCondition">
                        <h4>FRM模型</h4>
                        <div class="pd">
                          <div v-show="nomallist.rfm.firstBuyCondition !==''">
                            <span class="td title">首次下单时间：</span>
                            <span class="detail" v-show="nomallist.rfm.firstBuyCondition == 0">近{{nomallist.rfm.firstBuyRelative}}</span>
                            <span class="detail" v-show="nomallist.rfm.firstBuyCondition == 1">{{nomallist.rfm.firstBuyAbsolute.value1}} 至 {{nomallist.rfm.firstBuyAbsolute.value2}}</span>
                          </div>
                          <div v-show="nomallist.rfm.lastBuyCondition !==''">
                            <span class="td title">最后下单时间：</span>
                            <span class="detail" v-show="nomallist.rfm.lastBuyCondition == 0">近{{nomallist.rfm.lastBuyRelative}}</span>
                            <span class="detail" v-show="nomallist.rfm.lastBuyCondition == 1">{{nomallist.rfm.lastBuyDate.value1}} 至 {{nomallist.rfm.lastBuyDate.value2}}</span>
                          </div>
                          <div v-show="nomallist.rfm.buyAmtCondition !==''">
                            <span class="td title">下单金额：</span>
                            <span class="detail" v-show="nomallist.rfm.buyAmtCondition === 'gt'">大于{{nomallist.rfm.buyAmt}}</span>
                            <span class="detail" v-show="nomallist.rfm.buyAmtCondition === 'lt'">小于{{nomallist.rfm.buyAmt}}</span>
                            <span class="detail" v-show="nomallist.rfm.buyAmtCondition === 'eq'">区间{{nomallist.rfm.buyAmt}}-{{nomallist.rfm.buyAmt2}}元</span>
                          </div>
                          <div v-show="nomallist.rfm.buyTimesCondition !==''">
                            <span class="td title">下单次数：</span>
                            <span class="detail" v-show="nomallist.rfm.buyTimesCondition === 'gt'">大于{{nomallist.rfm.buyTimes}}</span>
                            <span class="detail" v-show="nomallist.rfm.buyTimesCondition === 'lt'">小于{{nomallist.rfm.buyTimes2}}</span>
                            <span class="detail" v-show="nomallist.rfm.buyTimesCondition === 'eq'">区间{{nomallist.rfm.buyTimes}}-{{nomallist.rfm.buyTimes2}}次</span>
                          </div>
                          <div v-show="nomallist.rfm.buyCycleCondition !==''">
                            <span class="td title">客户回购周期：</span>
                            <span class="detail" v-show="nomallist.rfm.buyCycleCondition === 'gt'">大于{{nomallist.rfm.buyCycle1}}</span>
                            <span class="detail" v-show="nomallist.rfm.buyCycleCondition === 'lt'">小于{{nomallist.rfm.buyCycle2}}</span>
                            <span class="detail" v-show="nomallist.rfm.buyCycleCondition === 'eq'">区间{{nomallist.rfm.buyCycle1}}-{{nomallist.rfm.buyCycle2}}</span>
                          </div>
                          <div v-show="nomallist.rfm.perAmtCondition !==''">
                            <span class="td title">客单价：</span>
                            <span class="detail" v-show="nomallist.rfm.perAmtCondition === 'gt'">大于{{nomallist.rfm.perAmt}}</span>
                            <span class="detail" v-show="nomallist.rfm.perAmtCondition === 'lt'">小于{{nomallist.rfm.perAmt2}}</span>
                            <span class="detail" v-show="nomallist.rfm.perAmtCondition === 'eq'">区间{{nomallist.rfm.perAmt}}-{{nomallist.rfm.perAmt2}}</span>
                          </div>
                          <div v-show="nomallist.rfm.perPriceCondition !==''">
                            <span class="td title">价单价：</span>
                            <span class="detail" v-show="nomallist.rfm.perPriceCondition === 'gt'">大于{{nomallist.rfm.perPrice1}}</span>
                            <span class="detail" v-show="nomallist.rfm.perPriceCondition === 'lt'">小于{{nomallist.rfm.perPrice2}}</span>
                            <span class="detail" v-show="nomallist.rfm.perPriceCondition === 'eq'">区间{{nomallist.rfm.perPrice1}}-{{nomallist.rfm.perPrice2}}</span>
                          </div>
                        </div>
                      </li>
                      <li v-show="nomallist.userAsset.gomeBeanCondition !==''">
                        <h4>用户资产</h4>
                        <div class="pd">
                          <span class="td title">美豆：</span>
                          <span class="detail" v-show="nomallist.userAsset.gomeBeanCondition === 'gt'">大于{{nomallist.userAsset.gomeBean1}}</span>
                          <span class="detail" v-show="nomallist.userAsset.gomeBeanCondition === 'lt'">小于{{nomallist.userAsset.gomeBean2}}</span>
                          <span class="detail" v-show="nomallist.userAsset.gomeBeanCondition === 'eq'">区间{{nomallist.userAsset.gomeBean1}}-{{nomallist.userAsset.gomeBean2}}</span>
                        </div>
                      </li>
                      <li>
                        <h4>人群信息</h4>
                        <div class="pd">
                          <div><span class="td title">人群名称：</span><span>{{nomallist.crowdinfo.name}}</span></div>
                          <div><span class="td title">覆盖人数：</span><span>{{nomallistUserCount}}</span>人 <span>{{nomallistpercent}}</span>%</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </slot>
              <!-- 复合 -->
              <slot>
                <div class="layer" v-show="itemlist.type==1">
                  <div v-show="typeErr">请求失败，操作异常，无数据</div>
                  <div v-if="seen2">
                    <ul class="ul_h">
                      <li>
                        <h4>复合群组明细</h4>
                        <div class="clearfix">
                          <div class="td title2">活动名称:</div>
                          <div class="detail2">{{ addgrouplayer.name }}</div>
                        </div>
                        <div class="clearfix">
                          <div class="td title2">复合群类型:</div>
                          <div class="detail2">{{addgrouplayer.composite | compositeType}}</div>
                        </div>
                        <div class="clearfix">
                          <div class="td title2">目标群组:</div>
                          <div class="detail2">{{copyTargetUserData[addgrouplayer.targetGroup]}}</div>
                        </div>
                        <div class="clearfix">
                          <div class="td title2">源群组:</div>
                          <div class="detail2">
                            <p v-for="(item, key) in addgrouplayer.originGroup" :key="key">{{copyTargetUserData[item]}}</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </slot>
              <a href="###" slot="reference" class="bd_btn" @click="arrowhover(itemlist.id, itemlist.type, 0, nomallist)" v-show="itemlist.type==0 || itemlist.type==1"></a>
            </el-popover>
          </td>
          <td v-show="itemlist.type==0">普通</td>
          <td v-show="itemlist.type==1">复合</td>
          <td v-show="itemlist.type==2">导入</td>
          <td>{{itemlist.userCount}}</td>
          <td>{{itemlist.createDate | time}}</td>
          <td>{{itemlist.updateDate | time}}</td>
          <td class="">{{itemlist.updateUser}}</td>
          <td>{{itemlist.datasetState | datasetState}}</td>
          <td>
            <a class="btn-s1" type="text" ref="menuItem" @click="sendMessage(itemlist.id, itemlist.type)" :disabled="itemlist.datasetState === 1 ? true : false" v-if="authorizedData.mms_group_macking_sms">短信营销</a>
            <!-- <el-button class="btn-s btn-primary" type="primary" :disabled="true">邮件营销</el-button> -->
            <a class="btn-s1" type="text" v-if="authorizedData.mms_group_edit_usergroup && itemlist.type==1" @click="arrowhover(itemlist.id, itemlist.type, 1)">编辑</a>
            <a class="btn-s1" type="text" v-if="authorizedData.mms_group_edit_usergroup && itemlist.type==0" @click="NomalBtnEdit(itemlist.id)">编辑</a>
            <a class="btn-s1" type="text" v-if="authorizedData.mms_group_update_usergroup && (itemlist.type==0 || itemlist.type==1)" @click="updatserch(itemlist, index, itemlist.id)">更新</a>
            <!-- 导出成功 -->
            <a class="btn-s1" type="text" v-if="authorizedData.mms_group_export_success_usergroup && (itemlist.datasetState==2 || itemlist.datasetState==4)" @click="exportOk(itemlist.id)">导出成功</a>
            <span v-if="authorizedData.mms_group_export_failure_usergroup && itemlist.datasetState==4">
              <a class="btn-s1" type="text" @click="exportErr(itemlist.id)">导出失败</a>
            </span>
            <a class="btn-s1" type="text" @click="delBoxBtn(index,itemlist.id)" v-if="authorizedData.mms_group_delete_usergroup">删除</a>
          </td>
        </tr>
        </tbody>
        <tbody v-if="listState">
          <tr class="bgf">
            <td class="text-center no-search" colspan="7">没有搜索到相关结果！</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!isFirst && ugroupmanage.list">
        <pager :total="total" :pages="pages" v-on:pageinfo="pageInit" :pageNum="searchData.pageNum"></pager>
      </div>
      <div class="result" v-if="!isFirst && ugroupmanage.list">
        共为您找到<i class="red">{{total}}</i>条结果，<a @click="getManaggeAll">返回查看全部</a>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
/* exportGroupList-导入用户群 */
import { mmsDomain } from 'api/config'
import { getUserManageList, targetGroupList, usercountList, btnokList, unnormalList, nomaleditList, updataserchList, deletemanageList, exportOkList, exportErrList, usernamecheckList, userpageAuthorized } from 'api/serviceuser'
import pager from 'common/pager'
import usergroup from 'common/usergroup'
import { mapActions } from 'vuex'

export default {
  props: [ 'msgoriginGroup' ], // 源群组传参
  data () {
    return {
      mmscUrl: mmsDomain.mmsc,
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      userListState: false,
      editOrigingroupstate: false,
      behavior_list_state: false,
      catIdlist_state: false,
      brandlist_state: false,
      listState: '',
      ugroupmanage: '', // 表单列表数据
      nomallist: {},
      nomallistUserCount: '',
      nomallistpercent: '',
      citylist: '', // 城市选择
      catIdlist: '', // 品类选择
      brandlist: '', // 品牌选择
      copyTargetUserData: {},
      behavior: {
        composite: '', // 行为属性
        list: [{
          days: '30',
          userAction: [],
          cat1Id: '', // 全部品牌
          brandId: '',
          relative: ''
        }]
      },
      sameName: false, // 用户名验证
      exportsameName: false, // 导入用户群名称验证
      seen: false, // 箭头浮层
      seen2: false, // 箭头浮层
      typeErr: false,
      showindex: null,
      isFirst: true,
      pages: '',
      total: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      searchData: {
        name: '',
        updateUser: '',
        groupType: '',
        dateType: '1',
        startDate: '',
        endDate: '',
        pageNum: '1',
        pageSize: '10'
      },
      copySearchData: {
        name: '',
        updateUser: '',
        groupType: '',
        dateType: '1',
        startDate: '',
        endDate: '',
        pageNum: '1',
        pageSize: '10'
      },
      targetArr: [],
      loading: false,
      disabledInput: false,
      disabledBtn: false,
      btntext: '计算',
      updatabtntext: '更新',
      loadingState: false,
      editcopyid: '',
      targetGroupOption: '',
      DataChangeOriginGroup: false,
      iscalculateState: false,
      addgrouplayer: { // 添加复合群组
        id: '',
        OriginName: '',
        composite: 1,
        targetGroup: '',
        originGroup: [],
        userCount: ''
      },
      copyaddgrouplayer: { // copy复合群组
        id: '',
        OriginName: '',
        composite: 1,
        targetGroup: '',
        originGroup: [],
        userCount: ''
      },
      importgrouplayer: { // 导入
        name: '',
        upLoadName: '',
        upath: '',
        file: '',
        fileList: []
      },
      uploadState: false,
      formdata: '',
      importFileUrl: '//10.144.36.12:8081/api/usergroupmanagedata?122',
      upLoadData: {
        cpyId: '123456',
        occurTime: '2017-08'
      },
      rules: { // input输入框验证
        OriginName: [
          { required: true, message: '请输入复合群组名称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入群组名称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        targetGroup: [
          { required: true, message: '请先选择目标群组', trigger: 'change' }
        ],
        fileList: [
          {required: true, message: '请上传图片或视频', trigger: 'blur'}
        ],
        originGroup: [
          {required: true, message: '源群组不能为空', trigger: 'blur'}
        ]
      },
      formLabelWidth: '120px',
      typeOptions: [{
        value: '0',
        label: '普通'
      }, {
        value: '1',
        label: '复合'
      }, {
        value: '2',
        label: '导入'
      }],
      options: [{
        value: '0',
        label: '创建时间'
      }, {
        value: '1',
        label: '更新时间'
      }],
      /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.endDate !== '' && this.searchData.endDate) {
            var d = new Date(this.searchData.endDate).getTime()
            return time.getTime() > Date.now() || time.getTime() > d
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      /** 今日以前日期，后面日期不可选择 */
      pickerEnd: {
        disabledDate: (time) => {
          if (this.searchData.startDate !== '' && this.searchData.startDate) {
            var d = new Date(this.searchData.startDate).getTime() - 86400000
            d = d > 0 ? d : 0
            return time.getTime() < d || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  components: {
    'pager': pager,
    'userGroup': usergroup
  },
  filters: { // 过滤器
    compositeType: function (val) { // 非''
      if (val === 1) {
        return '交集'
      } else if (val === 2) {
        return '并集'
      } else if (val === 3) {
        return '差集'
      }
    },
    choose_only: function (val) {
      if (val === '0' || val === 0) {
        return '否'
      } else if (val === '1' || val === 1) {
        return '是'
      }
    },
    sex: function (val) {
      if (val === '0') {
        return '女'
      } else if (val === '1') {
        return '男'
      }
    },
    useraction: function (val) {
      if (val === '0') {
        return '加购'
      } else if (val === '1') {
        return '浏览'
      } else if (val === '2') {
        return '搜索'
      } else if (val === '3') {
        return '购买'
      } else if (val === '4') {
        return '活跃'
      } else if (val === '5') {
        return '过滤已购买'
      }
    },
    job: function (val) {
      if (val === '1') {
        return '不限'
      } else if (val === '2') {
        return '企业雇主/企业经营者'
      } else if (val === '3') {
        return '高级行政人员'
      } else if (val === '4') {
        return '中层管理人员活跃'
      } else if (val === '5') {
        return '专业人士'
      } else if (val === '6') {
        return '办公人员'
      } else if (val === '7') {
        return '工人/蓝领'
      } else if (val === '8') {
        return '公务员/事业单位员工'
      } else if (val === '9') {
        return '自由职业者'
      } else if (val === '10') {
        return '军人'
      } else if (val === '11') {
        return '学生'
      } else if (val === '12') {
        return '退休'
      } else if (val === '13') {
        return '家庭主妇'
      } else if (val === '14') {
        return '其他'
      }
    },
    datasetState: function (val) {
      if (val === 0) {
        return '数据未处理'
      } else if (val === 1) {
        return '数据正在处理……'
      } else if (val === 2) {
        return '已完成'
      } else if (val === 3) {
        return '数据处理失败'
      } else if (val === 4) {
        return '数据处理部分成功'
      }
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.tablelist(this.searchData)
    }, 10000)
  },
  destroyed: function () {
    clearInterval(this.timer)
  },
  mounted: function () {
    var _this = this
    userpageAuthorized({
      code: 'mms_user_group_mngr'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_user_group_mngr
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.tablelist({})
          }
        } else {
          // 跳转到REM首页
          window.location.href(mmsDomain.ermHome)
        }
      }
    })
  },
  methods: {
    coerce: function (val) { // 转json
      return JSON.parse(val)
    },
    getManaggeAll: function () { // 返回初始化
      this.tablelist({
        name: '',
        updateUser: '',
        groupType: '',
        dateType: '',
        startDate: '',
        endDate: '',
        pageNum: '1',
        pageSize: this.searchData.pageSize
      })
      // 搜索数据重置
      this.searchData.name = ''
      this.searchData.updateUser = ''
      this.searchData.groupType = ''
      this.searchData.dateType = ''
      this.searchData.startDate = ''
      this.searchData.endDate = ''
      this.searchData.pageNum = '1'
      this.searchData.pageSize = '10'
      // 搜索数据重置
      this.copySearchData.name = ''
      this.copySearchData.updateUser = ''
      this.copySearchData.groupType = ''
      this.copySearchData.dateType = ''
      this.copySearchData.startDate = ''
      this.copySearchData.endDate = ''
      this.copySearchData.pageNum = '1'
      this.copySearchData.pageSize = '10'
    },
    adduserNameCheck: function (number, name) { // 用户名验证
      usernamecheckList({'id': -1, 'name': name}, (data) => {
        if (data.success === true) {
          if (name !== '') {
            if (number === '1') {
              this.sameName = false
            } else if (number === '2') {
              this.exportsameName = false
            }
          }
        } else {
          if (name !== '') {
            if (number === '1') {
              this.sameName = true
            } else if (number === '2') {
              this.exportsameName = true
            }
          }
        }
      })
    },
    NomalBtnEdit: function (id) { // 普通群编辑
      this.normalGpEdit(id) // 编辑传进id
      this.$router.push('usercreat')
    },
    sendMessage: function (id, type) {
      this.normalGpEdit(id) // 短信传进id
      this.normalGpEditType(type) // 导入类型短信传进type
      this.$router.push('messagecreat')
    },
    ...mapActions([
      'normalGpEdit',
      'normalGpEditType'
    ]),
    arrowhover: function (id, type, detailed, nomallist) { // 明细
      var _this = this
      _this.brandlist = {}
      if (detailed === 1 && type === 1) {
        _this.dialogFormVisible = true
      }
      if (type === 0) { // 普通
        nomaleditList({'id': id}, (data) => {
          if (data.success === true) {
            _this.nomallist = _this.coerce(data.data.userCondition)
            _this.nomallistUserCount = data.data.userCount
            _this.nomallistpercent = data.data.percent
            _this.behavior = _this.nomallist.behavior
            _this.seen = true
            _this.citylist = data.data.cityName
            _this.catIdlist = data.data.categoryName
            _this.brandlist = data.data.brandName
            var listEach = _this.nomallist.behavior.list
            listEach.forEach(element => {
              if (element.userAction.length > 0 || element.cat1Id.length > 0 || element.brandId.length > 0) {
                _this.userListState = true
              }
            })
          } else {
            console.log('请求失败')
          }
        })
      } else if (type === 1) { // 复合群
        _this.editcopyid = id
        unnormalList({'id': id}, (data) => { // 复合群
          if (data.success === true) {
            _this.seen2 = true
            _this.addgrouplayer = data.data
            _this.addgrouplayer.OriginName = data.data.name // 区分导入群名称
            if (detailed === 1) {
              _this.copyaddgrouplayer = data.data // 存储copydata
            }
          } else {
            _this.typeErr = true
          }
        })
        targetGroupList({}, (data) => {
          data.data.forEach(element => {
            _this.copyTargetUserData[element.id] = element.name // 明细数据回显
          })
          _this.targetArr = data.data
        })
      }
    },
    targeinit: function () { // 目标群组
      var _this = this
      targetGroupList({}, (data) => {
        _this.targetArr = data.data
      })
    },
    addNewOption: function () { // 源群组传参
      var _this = this
      if (_this.addgrouplayer.targetGroup !== '') {
        _this.targetGroupOption = _this.addgrouplayer.targetGroup
      } else {
        _this.targetOption = ''
        _this.$message({
          message: '请先选择目标群组',
          type: 'info'
        })
      }
    },
    choseUserGroup: function (data) { // 源群组--调用公用组件
      this.addgrouplayer.originGroup = data.data
    },
    addcountAll: function () { // 计算
      var _this = this
      if (_this.$refs.addgrouplayer.validate()) {
        if (_this.addgrouplayer.OriginName !== '' && _this.addgrouplayer.composite !== '' && _this.addgrouplayer.targetGroup !== '') { //  && _this.addgrouplayer.originGroup !== ''
          _this.disabledInput = true
          _this.loading = true
          _this.btntext = '计算中'
          var originGroupArr = _this.addgrouplayer.originGroup
          if (_this.addgrouplayer.originGroup !== '') { // 源群组--拼接参数
            for (var i = 0; i < originGroupArr.length; i++) {
              var originGroupStr = originGroupArr.join(',')
            }
          }
          usercountList(
            {
              'composite': _this.addgrouplayer.composite,
              'targetGroupId': _this.addgrouplayer.targetGroup,
              'originGroupId': originGroupStr
            }, (data) => {
              if (data.success === true) {
                _this.addgrouplayer.userCount = data.data.userCount
                _this.disabledInput = false
                _this.loading = false
                _this.btntext = '计算'
                this.iscalculateState = !this.iscalculateState
              } else {
                this.iscalculateState = !this.iscalculateState
                _this.disabledInput = false
                _this.loading = false
                _this.btntext = '计算'
                // _this.$message({
                //   message: '计算失败',
                //   type: 'info'
                // })
                if (data.data === '-1') {
                  _this.$message({
                    message: '记录在整理数据……，请再次点击计算！',
                    type: 'info'
                  })
                } else if (data.data === '-2') {
                  _this.$message({
                    message: '计算失败，请再次点击计算按钮！',
                    type: 'error'
                  })
                }
                // _this.disabledInput = false
                // _this.loading = false
                // _this.btntext = '计算'
              }
            }
          )
        } else if (_this.addgrouplayer.userCount !== '') {
          _this.disabledInput = false
          _this.loading = false
          _this.btntext = '计算'
        }
      }
    },
    addNewOriginGroup: function (formName) {
      this.dialogFormVisible = true
      this.addgrouplayer.userCount = ''
      if (this.addgrouplayer.OriginName === '') { // 再次编辑时更新id
        this.editcopyid = -1
      } else {
        this.$refs[formName].resetFields()
      }
    },
    submitForm (formName) { // 创建按钮--新建复合群添加数据
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.DataChangeOriginGroup) { // 重新编辑
            _this.$message({
              message: '请重新计算覆盖人数',
              type: 'error'
            })
          } else { // 未编辑
            _this.addgrouplayerList(formName)
          }
        }
      })
    },
    addgrouplayerList: function (formName) {
      var _this = this
      btnokList(
        {
          'id': _this.editcopyid,
          'name': _this.addgrouplayer.OriginName,
          'composite': _this.addgrouplayer.composite,
          'targetGroupId': _this.addgrouplayer.targetGroup,
          'originGroupId': _this.addgrouplayer.originGroup,
          'userCount': _this.addgrouplayer.userCount
        }, (data) => {
          if (data.success === true) {
            _this.$message({
              message: '创建成功',
              type: 'info'
            })
            _this.$refs[formName].resetFields()
            _this.addgrouplayer.userCount = ''
            _this.dialogFormVisible = false
            _this.tablelist(_this.copySearchData) // 再次调用搜索
          } else {
            _this.$message({
              message: data.remark,
              type: 'error'
            })
          }
        }
      )
    },
    cellbtn: function (formName) { // 取消置空
      // this.addlayerinit(formName)
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    addlayerinit: function (formName) {
      var _this = this
      _this.dialogFormVisible = false
      _this.$refs[formName].resetFields()
      _this.addgrouplayer.originGroup = ''
      _this.addgrouplayer.userCount = ''
      _this.disabledInput = false
      _this.loading = false
      _this.btntext = '计算'
    },
    exportOk: function (id) { // 导出成功
      exportOkList({'id': id, 'type': 0}, (data) => {
      })
    },
    exportErr: function (id) { // 导出失败
      exportErrList({'id': id, 'type': 1}, (data) => {
      })
    },
    delBoxBtn (index, id) { // 删除按钮
      this.$confirm('确定要删除该用户群组吗？?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dellist(index, id) // 调用删除
      }).catch(() => {
      })
    },
    dellist: function (index, id) { // 删除
      var _this = this
      deletemanageList({ 'id': id }, (data) => {
        if (data.success === true) {
          _this.$message({
            message: '该用户群组删除成功',
            type: 'success'
          })
          _this.ugroupmanage.list.splice(index, 1)
        } else {
          _this.$message({
            message: '该用户群组正在使用中，无法删除。',
            type: 'warning'
          })
        }
      })
    },
    updatserch: function (itemlist, index, id) { // 更新
      this.updatabtntext = '更新中'
      this.loadingState = true
      if (itemlist.datasetState === 1) {
        this.disabledBtn = true
      }
      updataserchList({ 'id': id }, (data) => {
        if (data.success === true) {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.tablelist(this.searchData) // 再次调用搜索
          this.updatabtntext = '更新'
          this.loadingState = false
        } else {
          this.$message(data.remark)
          this.updatabtntext = '更新'
          this.loadingState = false
        }
      })
    },
    rearch: function () { // 搜索
      this.rearchlist(this.searchData)
    },
    rearchlist: function (data) {
      var _this = this
      if (data.name !== '' || data.updateUser !== '' || data.groupType !== '' || data.dateType !== '' || data.startDate !== '' || data.endDate !== '') {
        _this.copySearchData = JSON.parse(JSON.stringify(data))
        _this.searchData.pageNum = 1
        _this.tablelist(data)
      } else {
        _this.$message({
          message: '搜索条件不能为空！',
          type: 'warning'
        })
      }
    },
    tablelist: function (data) {
      var _this = this
      getUserManageList(data, (data) => {
        if (data.success === true) {
          if (data.data.list.length > 0) {
            _this.isFirst = false
            _this.listState = false
            _this.ugroupmanage = data.data
            _this.pages = data.data.pages
            _this.total = data.data.total
            _this.searchData.pageNum = data.data.pageNum
            _this.searchData.pageSize = data.data.pageSize
          } else {
            _this.listState = true
            _this.ugroupmanage = data.data
          }
        }
      })
    },
    /** 分页跳转渲染 */
    pageInit: function (data) {
      var _this = this
      _this.copySearchData.pageNum = data.pageindex
      _this.copySearchData.pageSize = data.pagecount
      _this.searchData = _this.copySearchData
      _this.copySearchData = JSON.parse(JSON.stringify(_this.searchData))
      _this.tablelist(this.copySearchData)
    },
    getFile: function ($event) {
      var _this = this
      // var et = even ? event : window.event
      // var file = event.srcElement.files[0] ? event.srcElement.files[0] : event.target.files[0]
      // var obj = event.target
      let file = $event.target.files[0]
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 25
      if (!extension && !extension2) {
        _this.$message({
          message: '上传模板只能是 xls、xlsx 格式!',
          type: 'warning'
        })
      } else if (!isLt2M) {
        _this.$message({
          message: '上传模板大小不能超过 25MB!',
          type: 'warning'
        })
      } else {
        _this.importgrouplayer.file = file
        _this.importgrouplayer.upLoadName = file.name
        _this.uploadState = false
      }
      return (extension || extension2) && isLt2M
    },
    // handleChange (file, fileList) {
    //   let _this = this
    //   const extension = file.name.split('.')[1] === 'xls'
    //   const extension2 = file.name.split('.')[1] === 'xlsx'
    //   const isLt2M = (file.size) / 1024 / 1024 < 5
    //   if (!extension && !extension2) {
    //     _this.$message({
    //       type: 'info',
    //       message: '上传模板只能是 xls、xlsx 格式!'
    //     })
    //     return false
    //   } else if (!isLt2M) {
    //     _this.$message({
    //       type: 'info',
    //       message: '上传模板大小不能超过 5MB!'
    //     })
    //     return false
    //   } else {
    //     _this.importgrouplayer.upLoadName = file.name
    //     _this.importgrouplayer.file = file
    //   }
    //   return (extension || extension2) && isLt2M
    // },
    handaddBtn: function () {
      this.dialogFormVisible2 = true
    },
    handadd (formName) { // 导入用户群
      var _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.importgrouplayer.upLoadName !== '') {
            // exportGroupList({'name': _this.importgrouplayer.upLoadName, 'id': -1, 'file': _this.importgrouplayer.file}, (data) => {
            //   console.log(data, 10101010)
            //   if (data.success === true) {
            //     _this.dialogFormVisible2 = false
            //     _this.$message({
            //       type: 'info',
            //       message: '导入成功'
            //     })
            //   } else {
            //     _this.$message({
            //       type: 'info',
            //       message: '导入失败'
            //     })
            //   }
            // })
            // _this.$refs.upload222.submit()
            var zipFormData = new FormData()
            zipFormData.append('id', -1)
            zipFormData.append('name', _this.importgrouplayer.name)
            zipFormData.append('file', _this.importgrouplayer.file)
          } else {
            _this.uploadState = true
          }
          this.$http.post(mmsDomain.mms + '/userGroup/saveImportUserGroup.do', zipFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            if (res.body.success === true) {
              _this.open = false
              _this.$message({
                message: '导入成功！,成功导入' + res.body.data + '条记录！',
                type: 'success'
              })
              _this.tablelist({})
              _this.dialogFormVisible2 = false
              _this.$refs[formName].resetFields()
              _this.importgrouplayer.upLoadName = ''
              _this.importgrouplayer.file = ''
              _this.$refs.clearfile.value = ''
            } else {
              if (res.body.code === 109) {
                _this.$message({
                  message: '没有有效记录！',
                  type: 'error'
                })
              } else {
                _this.$message({
                  message: '导入失败',
                  type: 'error'
                })
              }
            }
          }, res => {
            console.log('获取失败！')
          })
        } else {
          _this.uploadState = true
          // this.$message({
          //   type: 'info',
          //   message: '请完整填写信息'
          // })
          // return false
        }
      })
    },
    celhandadd (formName) {
      this.$refs[formName].resetFields()
      this.importgrouplayer.upLoadName = ''
      this.importgrouplayer.file = ''
      this.$refs.clearfile.value = ''
      this.dialogFormVisible2 = false
    },
    addNormalGroup: function () {
      this.$router.push('/UserCreat')
    }
  },
  watch: {
    'addgrouplayer': { // 监测
      handler (value, oldValue) {
        if (!this.editOrigingroupstate) {
          if (this.addgrouplayer.userCount !== '') {
            this.DataChangeOriginGroup = true
          } else {
            this.DataChangeOriginGroup = false
          }
        }
        this.editOrigingroupstate = false
      },
      deep: true
    },
    'addgrouplayer.userCount': {
      handler (value, oldValue) {
        if (!this.editOrigingroupstate) {
          if (this.addgrouplayer.userCount !== '') {
            this.DataChangeOriginGroup = true
          } else {
            this.DataChangeOriginGroup = false
          }
        }
        this.editOrigingroupstate = false
      },
      deep: true
    },
    'iscalculateState': {
      handler (val, oldVal) {
        if (this.addgrouplayer.userCount !== '') {
          this.DataChangeOriginGroup = false
        }
        this.editOrigingroupstate = false
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.fl{float: left;}
.userManage .test_color{ color: #ccc;}
.userManage .w200{ width: 200px;}
.userManage .dis_inline{ display: inline-block;}
.userManage .margin_left{ margin-left: 20px;}
.userManage .el-message-box {
  border: none;
}
.userManage .el-message-box__header {
  background: #4990e2;
  color: #fff;
}
.userManage .m_jj{ margin: 10px 0;}
.userManage .serch_done{ text-align: center; padding: 50px 0;}
.userManage .data_input{ margin-left: 10px;}
.userManage .el-pagination{ float: right; margin-top: 10px;}
.userManage .el-range-editor.el-input__inner{
  padding: 0;
  height: 30px;
}
.userManage .el-date-editor .el-range-input{
  height: 22px;
  overflow: hidden;
}
.userManage .primary—btn{
  height: 30px;
  padding: 0 15px;
}
.userManage .el-button--text{ color:#fff;}
.userManage .el-button--text:hover{color:#fff;}
.userManage .el-dialog__header {
    background: #4990e2;
}
.userManage .el-dialog__title{
    color: #fff;
}
.userManage .el-select__input {
    border: none;
    outline: none;
    padding: 0;
    margin-left: 15px;
    color: #666;
    font-size: 14px;
    vertical-align: middle;
    appearance: none;
    height: 28px;
    background-color: transparent;
    border: none;
}
.userManage .el-input__inner[readonly]{
  background: #fff!important;
  min-height: 30px;
  height: auto;
  padding-right: 40px;
  text-align: left;
}
.userManage .el-date-editor .el-input__inner[readonly]{
  padding: 0 6px 0 26px;
}
.userManage .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
.userManage .el-input--small .el-input__inner{
  background: #fff!important;
}
.userManage .bd_btn{ margin-left: 6px;border-radius: 20px; width: 30px; height: 30px; text-align: center; line-height: 30px; padding: 0; font-family: Simsun;position: absolute; right: 0; top:3px; z-index: 1;}
.userManage .bd_btn:hover{ text-decoration: none;}
.userManage .bd_btn::before{content: "\E63F"; font-family: element-icons !important;}
.userManage .pasb{ position: relative;z-index: 0;}
.userManage .ul_h{height: 200px; max-height: 400px; overflow: auto; padding: 10px;}
.userManage .ul_h li{ margin-bottom: 15px;}
.userManage .ul_h li h4{ font-size: 14px; margin-bottom: 10px; color: #000;}
.userManage .el-select__tags input[type=text]{ border: none;}
.userManage .ug-checkbox{ height: 20px; line-height: 20px;}
.userManage .userManage .mod-search:after{ top: -6px;}
.userManage .count .el-input__inner[readonly]{ text-align: left; padding-left: 10px;}
.userManage .countbtn .el-form-item__content{ margin-left: 10px !important;}
.userManage .layer .td{ height: 30px; line-height: 30px;}
.userManage .layer .detail{ color: #bbb;}
.userManage .el-upload .el-upload__input{ display: none}
.userManage .pd{ padding-left: 10px;}
.region-picker{ padding-left: 62px !important; }
.region-picker-multiple .selected-labels .selected-label{ color: #333 !important;}
.region-picker-multiple .selected-labels .selected-label{ border: 1px solid #ccc  !important; background: #f8f8f8  !important;}
.disabledBtn{ cursor: not-allowed; background: #ccc;}

.userManage input[readonly][type=text].none_input{ background: #eaeaea !important;}
.userManage .up-input  {width: 60%;}
.userManage .up-button {display: inline-block!important;}
.userManage .result{ margin-top: 20px;}
.result a{ cursor: pointer;}
.userManage .importFile .file { display: inline-block;  margin-left: -68px; opacity: 0; width: 72px;} /*position: absolute; top: 0px; right: 112px;*/
.userManage .importFile .el-form-item__content{ width: 50%}
.layer{ height: 310px; overflow-y :auto}
.layer .ul_h h4{ font-size: 14px; padding: 10px 0; color:#000; }
.layer .ul_h .td{ margin: 0 2px 0 5px;}
.layer .ul_h li div{ padding: 2px 0;}
.region-picker-multiple .selected-labels .selected-label:first-child{ margin-left: 3px;}
.region-picker .picker-toggle{margin-left: 62px}
.userManage .btn-s{ cursor: pointer; display: inline-block;}
.btn-s1{ padding: 0 5px;}
.title{ color: #555555; display: inline-block; float: left; width: 99px; text-align: right;}
.detail{ color: #333333; text-align: right; display: inline-block;}
.detail2,.title2,.actionright{ float: left;}
.title2{ width: 75px; text-align: right;}
.detail2{ width: 267px;}
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
.userManage .region-picker,.userManage .region-picker-multiple .selected-labels{width: 70% !important; margin-left: 58px !important;}
</style>
