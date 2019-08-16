<template>
  <div class="mm-wrapper" v-if="authorizedPage">
    <div class="widget-box clearfix">
      <div class="widget-header n-widget-header">
        <h5 class="widget-title">检索条件</h5>
      </div>
      <div class="widget-main">
        <el-form ref="ruleForm" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务ID/主题：">
                <el-input v-model.trim="searchData.idNameContent" placeholder="请输入任务ID、任务主题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="短信内容：">
                <el-input v-model.trim="searchData.content" placeholder="请输入短信内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发送通道：">
                <el-select v-model="searchData.channels" placeholder="请选择" clearable>
                  <el-option v-for="(item, key, index) in initBase.channels" :key="index" :value="key" :label="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动类型：">
                <el-select v-model="searchData.activityType" placeholder="请选择" clearable>
                  <el-option v-for="(item, key) in initBase.activityType" :key="key" :value="key" :label="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动状态：">
                <el-select v-model="searchData.status" clearable>
                  <el-option value="0" label="发布"></el-option>
                  <el-option value="1" label="草稿"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div class="el-form-item__label" :style="'padding-left:10px; width:150px'">
                <el-select v-model="searchData.dateType" clearable >
                  <el-option value="0" label="创建时间"></el-option>
                  <el-option value="1" label="发送时间"></el-option>
                </el-select>
              </div>
              <div class="el-form-item__content" :style="'margin-left: 150px'">
                <el-date-picker :style="'float:left; width:49%'"
                  v-model="searchData.createDatStart"
                  type="date"
                  size="small"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerStart">
                </el-date-picker>
                <el-date-picker :style="'float:right; width:49%'"
                  v-model="searchData.createDatEnd"
                  type="date"
                  size="small"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerEnd">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
          <el-row :style="'padding-bottom:15px'">
            <el-col :span="12" :offset="12">
              <el-button class="btn btn-primary" :style="'margin-left:150px'" v-if="authorizedData.mms_marketing_search_note" @click="searchInit">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="mt15 clearfix">
      <el-button class="btn btn-green" v-if="authorizedData.mms_marketing_newnote_note" @click="$router.push('/messagecreat')">新建短信任务</el-button>
    </div>
    <div class="mt10 clearfix">
      <table class="table task-table">
        <thead>
          <tr>
            <th>任务ID</th>
            <th>任务主题</th>
            <th>活动类型</th>
            <th>任务类型</th>
            <th>创建时间</th>
            <th>计划发送时间</th>
            <th>操作人</th>
            <th>活动状态</th>
            <th>执行状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-if="msgManageData.length" v-for="(item, index) in msgManageData" :key="index">
          <tr>
            <td>
              <i class="el-icon-minus subtask" v-if="item.taskId == subtaskData.taskId" @click="subtaskData = {}"></i>
              <i class="el-icon-plus subtask" v-else @click="subtaskList(item.taskId)"></i>
              {{ item.taskId }}
            </td>
            <td>{{ item.name }}</td>
            <td>{{ initBase.activityType[item.activityType] }}</td>
            <td>{{ item.taskType | taskFilter }}</td>
            <td>{{ item.operatorDate | mmtime }}</td>
            <td>{{ item.sendTime | mmtime }}</td>
            <td>{{ item.operator }}</td>
            <td>{{ item.activityStatus | activityFilter }}</td>
            <td>
              <span v-if="item.execStatue == 3">
                失败
              </span>
              <span v-if="item.execStatue == 2">
                发送中<br/>
                <i class="red">(每十分钟更新)</i>
              </span>
              <span v-if="!(item.execStatue == 3 || item.execStatue == 2)">{{ item.execStatue | stateFilter }}</span>
            </td>
            <td>
              <!-- 0:创建中;1:待发送;2:发送中;3:失败;4:已完成 -->
              <!-- 所有发送状态可被复制 -->
              <a class="mm-btn" v-if="authorizedData.mms_marketing_copy_note" @click="copyTask(item.taskId)">复制</a>
              <!-- 仅待发送任务可被编辑、删除、发送 -->
              <a class="mm-btn" v-if="authorizedData.mms_marketing_edit_note && item.execStatue == '1'"  @click="editTask(item.taskId)">编辑</a>
              <a class="mm-btn" v-if="authorizedData.mms_marketing_del_note && item.execStatue == '1'" @click="deleteTask(item.taskId)">删除</a>
              <a class="mm-btn red" v-if="authorizedData.mms_marketing_send_note && item.execStatue == '1'" @click="sendTask(item.taskId, item.activityStatus)">立即发送</a>
              <a class="mm-btn" v-if="authorizedData.mms_marketing_del_note && item.execStatue == '2'" @click="stopTask(item.taskId)">终止</a>
            </td>
          </tr>
          <tr v-if="item.taskId == subtaskData.taskId">
            <td colspan="10" class="subtask-area">
              <table class="table subtaskTable">
                <thead>
                  <tr>
                    <th width="100">子任务ID</th>
                    <th width="40%">短信内容</th>
                    <th width="90">发送通道</th>
                    <th width="90">会员数组</th>
                    <th width="90">预发人次</th>
                    <th width="90">实发人次</th>
                    <th width="90">发送时间</th>
                    <th width="90">短信发送量</th>
                    <th width="90">执行状态</th>
                    <th width="60">操作</th>
                  </tr>
                </thead>
                <tbody v-if="subtaskData.list.length > 0">
                  <tr v-for="subItem in subtaskData.list" :key="subItem.subTaskId">
                    <td>{{subItem.subTaskId}}</td>
                    <td>{{subItem.shortMsgContent}}<i class="red" v-if="subItem.aorB">[{{subItem.aorB}}]</i></td>
                    <td>{{initBase.channels[subItem.channelNo]}}</td>
                    <!-- <td>{{subItem.sourceGroupId}}</td> -->
                    <!--20180730 修改 增加数据筛选逻辑展示，群组创建明细-->
                    <td class="mm-group-name">
                      <span>{{subItem.sourceGroupName}}</span>
                      <el-popover
                        placement="right"
                        width="400"
                        trigger="click">
                        <!-- 普通 -->
                        <slot>
                          <div class="layer" v-show="nomalgroupType==0">
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
                                        <span class="fl">{{citylist}}</span>
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
                                      <div class="clearfix">
                                        <div :class="{'nowshow_hidden':!index, 'nowshow_hidden_2':index}" >
                                          <div v-show="catIdlist !== ''">
                                            <p class="brand td fl" style="margin-left:61px;">品类：</p>
                                            <span class="fl">{{catIdlist}}</span>
                                          </div>
                                          <div v-show="brandlist !==''">
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
                          <div class="layer" v-show="nomalgroupType==1">
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
                        <a href="###" slot="reference" class="bd_btn" v-show="item.groupType == 0" @click="arrowhoverTask(subItem.sourceGroupId)"></a>
                      </el-popover>
                    </td>
                    <!--20180730 修改 增加数据筛选逻辑展示，群组创建明细 end-->
                    <td>{{subItem.taskUserNum}}</td>
                    <td>{{subItem.realUserNum}}</td>
                    <td>{{subItem.realSendtime | mmtime}}</td>
                    <td>{{subItem.successUserNum}}</td>
                    <td>
                      <span v-if="subItem.execStatus == 2 || subItem.execStatus == 6 || subItem.execStatus == 8">
                        失败<br/>
                        <i class="red">({{subItem.failueMessage}})</i>
                      </span>
                      <span v-if="subItem.execStatus == 4">
                        发送中<br/>
                        <i class="red">(每十分钟更新)</i>
                      </span>
                      <span v-if="!(subItem.execStatus == 2 || subItem.execStatus == 4 || subItem.execStatus == 6 || subItem.execStatus == 8)">{{ subItem.execStatus | subStateFilter }}</span>
                    </td>
                    <td><a class="mm-btn" v-if="authorizedData.mms_marketing_count_note && (subItem.execStatus == 1 || subItem.execStatus == 5)" @click="statistics(subItem.subTaskId)">统计</a></td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="10" class="text-center">没有搜索到相关结果！</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
        <tbody v-if="!msgManageData.length">
          <tr class="bgf">
            <td class="text-center no-search" colspan="10">没有搜索到相关结果！</td>
          </tr>
        </tbody>
      </table>
      <div class="clearfix">
        <pager :total="total" :pages="pages" :pageNum="searchData.pageNum" isTotalTxt="true" v-on:pageinfo="pageInit"></pager>
        <div class="result" :style="'margin-top:25px'" v-if="msgManageData.length > 0">
          共为您找到<i class="red">{{total}}</i>条结果，<a @click="getManaggeAll">返回查看全部</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { getTask, getTaskList, getsubTaskList, delTaskCase, sendTaskCase, pageAuthorized, stopTaskCase } from 'api/msgService'
import { nomaleditList, targetGroupList } from 'api/serviceuser'
import { mapMutations, mapActions } from 'vuex'
import pager from 'common/pager'
export default {
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      isErrorTxt: false,
      initBase: {},
      msgManageData: {},
      subtaskData: {},
      copySearchData: {},
      searchData: {
        idNameContent: '',
        content: '',
        channels: '',
        activityType: '',
        status: '',
        dateType: '',
        createDatStart: '',
        createDatEnd: '',
        pageNum: 1,
        pageSize: 10
      },
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
      userListState: false,
      typeErr: false,
      sameName: false, // 用户名验证
      exportsameName: false, // 导入用户群名称验证
      seen: false, // 箭头浮层
      seen2: false, // 箭头浮层
      nomalgroupType: '',
      addgrouplayer: { // 添加复合群组
        id: '',
        OriginName: '',
        composite: 1,
        targetGroup: '',
        originGroup: [],
        userCount: ''
      },
      pages: 0,
      total: 0,
      /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.createDatEnd !== '' && this.searchData.createDatEnd) {
            var d = new Date(this.searchData.createDatEnd).getTime()
            return time.getTime() > Date.now() || time.getTime() > d
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      /** 今日以前日期，后面日期不可选择 */
      pickerEnd: {
        disabledDate: (time) => {
          if (this.searchData.createDatStart !== '' && this.searchData.createDatStart) {
            var d = new Date(this.searchData.createDatStart).getTime()
            return time.getTime() < d - 86400000 || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  components: {
    'pager': pager
  },
  /** 渲染发送状态过滤器，0:创建中;1:待发送;2:发送中;3:失败;4:已完成 */
  filters: {
    stateFilter: function (n) {
      var value = ''
      var type = n + ''
      switch (type) {
        case '0':
          value = '创建中'
          break
        case '1':
          value = '待发送'
          break
        case '2':
          value = '发送中'
          break
        case '3':
          value = '失败'
          break
        case '4':
          value = '已完成'
          break
        case '5':
          value = '已终止'
          break
      }
      return value
    },
    compositeType: function (val) { // 非''
      if (val === 1) {
        return '交集'
      } else if (val === 2) {
        return '并集'
      } else if (val === 3) {
        return '差集'
      }
    },
    subStateFilter: function (n) {
      /** 创建中（7）、待发送（0、3）、发送中（4）、已完成（1、5）、失败（2、8、6） */
      var value = ''
      var type = n + ''
      switch (type) {
        case '7':
          value = '创建中'
          break
        case '0':
        case '3':
          value = '待发送'
          break
        case '4':
          value = '发送中'
          break
        case '2':
        case '6':
        case '8':
          value = '失败'
          break
        case '1':
        case '5':
          value = '已完成'
          break
        case '9':
          value = '无用户'
          break
        case '10':
          value = '已终止'
          break
      }
      return value
    },
    taskFilter: function (value) {
      return (value === 1 || value === '1') ? '一次性' : '周期性'
    },
    activityFilter: function (value) {
      return (value === 0 || value === '0') ? '发布' : '草稿'
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
    }
  },
  mounted: function () {
    var _this = this
    pageAuthorized({
      code: 'mms_sms_task_mngr'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_sms_task_mngr
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.initTaskBase()
            _this.manageInit(_this.searchData)
          }
        } else {
          window.location.href = mmsDomain.ermHome
        }
      }
    })
  },
  created () {
    this.targetGroup()
  },
  methods: {
    targetGroup: function () {
      var _this = this
      targetGroupList({}, (data) => {
        data.data.forEach(element => {
          _this.copyTargetUserData[element.id] = element.name // 明细数据回显)
        })
      })
    },
    coerce: function (val) { // 转json
      return JSON.parse(val)
    },
    initTaskBase: function () {
      var _this = this
      getTask((data) => {
        if (data.success === true || data.success === 'true') {
          _this.initBase = data.data
        }
      })
    },
    getManaggeAll: function () {
      this.manageInit({
        idNameContent: '',
        content: '',
        channels: '',
        activityType: '',
        status: '',
        dateType: '',
        createDatStart: '',
        createDatEnd: '',
        pageNum: 1,
        pageSize: this.searchData.pageSize
      })
    },
    manageInit: function (searchData) {
      var _this = this
      if (((this.searchData.createDatStart || this.searchData.createDatEnd) && this.searchData.dateType) || (!this.searchData.createDatStart && !this.searchData.createDatEnd && !this.searchData.dateType)) {
        getTaskList(searchData, (data) => {
          if (data.success === true || data.success === 'true') {
            if (data.data) {
              var sendCount = 0
              _this.msgManageData = data.data && data.data.list ? data.data.list : []
              _this.pages = data.data.pages
              _this.total = data.data.total
              _this.searchData.pageNum = data.data.pageNum
              _this.searchData.pageSize = data.data.pageSize

              _this.msgManageData.forEach(element => {
                sendCount++
              })
              if (sendCount > 0) {
                setTimeout(function () {
                  _this.manageInit()
                }, 600000)
              }
            } else {
              _this.msgManageData = []
            }
          }
        })
      } else {
        this.$message('搜索时间与时间类型为匹配搜索条件')
      }
    },
    subtaskList: function (id) {
      var _this = this
      getsubTaskList({
        'taskId': id
      }, (data) => {
        if (data.success === true || data.success === 'true') {
          _this.subtaskData = data.data ? data.data : []
        }
      })
    },
    searchInit: function () {
      var _this = this
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.searchData.pageNum = 1
      _this.manageInit(_this.searchData)
    },
    arrowhoverTask: function (id, type) { // 点击群组查看详情小图标 弹窗内容
      var _this = this
      nomaleditList({
        'id': id
      }, (data) => {
        if (data.success === true) {
          _this.nomalgroupType = data.data.groupType
          if (_this.nomalgroupType === 0) {
            _this.nomallist = _this.coerce(data.data.userCondition)
            _this.nomallistUserCount = data.data.userCount
            _this.nomallistpercent = data.data.percent
            _this.behavior = _this.nomallist.behavior
            _this.citylist = data.data.cityName
            _this.catIdlist = data.data.categoryName
            _this.brandlist = data.data.brandName
            _this.seen = true
            var listEach = _this.nomallist.behavior.list
            listEach.forEach(element => {
              if (element.userAction.length > 0 || element.cat1Id.length > 0 || element.brandId.length > 0) {
                _this.userListState = true
              }
            })
          }
          if (_this.nomalgroupType === 1) {
            _this.seen2 = true
            _this.addgrouplayer = data.data
            _this.addgrouplayer.OriginName = data.data.name // 区分导入群名称
          }
        } else {
          console.log('请求失败')
        }
      })
    },
    /** 分页跳转渲染 */
    pageInit: function (data) {
      this.copySearchData.pageNum = data.pageindex
      this.copySearchData.pageSize = data.pagecount
      this.searchData = this.copySearchData
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.manageInit(this.searchData)
    },
    deleteTask: function (id) {
      var _this = this
      _this.$confirm('确定要删除该短信任务么?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delTaskCase({
          'taskId': id
        }, function (data) {
          if (data.success === true || data.success === 'true') {
            _this.manageInit(_this.searchData)
          }
        })
      }).catch(() => {})
    },
    stopTask: function (id) {
      var _this = this
      _this.$confirm('确定要终止该短信任务么?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        stopTaskCase({
          'taskId': id
        }, function (data) {
          if (data.success === true || data.success === 'true') {
            _this.manageInit(_this.searchData)
          } else {
            _this.$message(data.remark)
          }
        })
      }).catch(() => {})
    },
    editTask: function (id) {
      this.editMsg(id)
      this.$router.push('/messagecreat')
    },
    copyTask: function (id) {
      this.copyMsg(id)
      this.$router.push('/messagecreat')
    },
    sendTask: function (id, activityStatus) {
      var _this = this
      _this.$confirm('确定要立刻发送该任务吗?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        sendTaskCase({
          'taskId': id,
          'activeStatus': activityStatus
        }, function (data) {
          if (data.success === true || data.success === 'true') {
            _this.manageInit(_this.searchData)
          }
        })
      }).catch(() => {})
    },
    statistics: function (id) {
      this.statisticsId(id)
      this.$router.push('/effectstatissingle')
    },
    ...mapMutations({
      statisticsId: 'SET_TID'
    }),
    ...mapActions([
      'copyMsg',
      'editMsg'
    ])
  }
}
</script>

<style>
.el-date-editor.el-input, .el-date-editor.el-input__inner{ width: 180px;}
.subtask{ margin-right:5px; font-size:12px; border-radius:2px; cursor:pointer;}
.subtask.el-icon-plus{padding:1px; border: 1px solid #4990e2; color:#4990e2;}
.subtask.el-icon-minus{ padding:2px; background:#4990e2; color:#fff;}

.task-table>tbody:nth-of-type(odd){ background-color:#f6f6f6;}
.table>tbody>tr>td.subtask-area{ background:#edf2f8; padding:15px 20px 0 45px; border-top:2px solid #ccc;
  border-bottom:2px solid #ccc;}
.subtaskTable.table{ border:none;}
.subtaskTable.table>thead>tr>th{ background-color:#edf2f8; border-bottom:2px solid #ccc; font-size:12px; font-weight:bold; color: #555;}
.subtaskTable.table>tbody>tr>td{ background-color:transparent;}
.subtaskTable.table td{ padding:15px 10px; border-top:1px solid #ccc;}
.subtaskTable.table>tbody>tr{ background-color:#edf2f8; cursor:pointer;}
.subtaskTable.table>tbody>tr:hover{ background:#f6f9fe;}
.subtaskTable>tbody>tr>td{ color:#555;}
.mm-wrapper .el-select{ width: 100%;}
.mm-wrapper input[readonly][type=text].none_input{ background: #eaeaea !important;}
.mm-wrapper .el-select__input {
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
.mm-wrapper .el-input__inner[readonly]{
  background: #fff!important;
  min-height: 30px;
  height: auto;
  padding-right: 40px;
  text-align: left;
}
.mm-wrapper .el-date-editor .el-input__inner[readonly]{
  padding: 0 6px 0 26px;
}
.mm-wrapper .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
.mm-wrapper .el-input--small .el-input__inner{
  background: #fff!important;
}
.mm-wrapper .mm-btn{ margin-right:12px;}
.mm-wrapper .mm-group-name{position: relative;}
.mm-wrapper .bd_btn{ margin-left: 6px;border-radius: 20px; width: 30px; height: 30px; text-align: center; line-height: 30px; padding: 0; font-family: Simsun;position: absolute; right: 0; top:8px; z-index: 1;}
.mm-wrapper .bd_btn:hover{ text-decoration: none;}
.mm-wrapper .bd_btn::before{content: "\E63F"; font-family: element-icons !important;}
.layer{ height: 310px; overflow-y :auto}
.layer .ul_h h4{ font-size: 14px; padding: 10px 0; color:#000; }
.layer .ul_h .td{ margin: 0 2px 0 5px;}
.layer .ul_h li div{ padding: 2px 0;}
.region-picker-multiple .selected-labels .selected-label:first-child{ margin-left: 3px;}
.region-picker .picker-toggle{ margin-left: 62px; }
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
.usercreat .region-picker .picker-toggle{margin-left: 0}
</style>
