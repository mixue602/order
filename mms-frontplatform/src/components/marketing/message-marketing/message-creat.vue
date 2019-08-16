<template>
  <div class="widget-box mm-wrapper clearfix" v-if="authorizedPage">
    <div class="widget-header n-widget-header">
      <h5 class="widget-title">新建短信任务</h5>
    </div>
    <div class="widget-main clearfix">
      <el-form :model="msgRuleForm" :rules="rules" ref="msgRuleForm" label-width="100px">
        <el-form-item label="任务主题" prop="name">
          <el-input v-model.trim="msgRuleForm.name" placeholder="请填写任务主题"></el-input>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-form-item class="fl" prop="activityType">
            <el-select v-model="msgRuleForm.activityType" placeholder="请选择" @change="msgRuleForm.category = ''">
              <el-option v-for="(item, key) in initBase.activityType" :key="key" :value="key" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="fl ml10" prop="category">
            <el-select v-model="msgRuleForm.category" placeholder="请选择">
              <el-option v-for="(item, key) in initBase.category" :key="key" :value="key" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="任务类型" required>
          <el-radio v-model="msgRuleForm.taskType" label="1">一次性</el-radio>
          <el-radio v-model="msgRuleForm.taskType" label="0" disabled>周期性</el-radio>
        </el-form-item>
        <el-form-item label="选择群类型" required>
          <el-radio v-model="msgRuleForm.groupType" label="0">用户群组</el-radio>
          <el-radio v-model="msgRuleForm.groupType" label="2">导入群组</el-radio>
        </el-form-item>
        <el-form-item label="任务排重">
          <el-checkbox-group v-model="msgRuleForm.excludeReiterationType">
            <el-form-item class="mb16">
              <el-checkbox value="taskIds" label="taskIds">按任务排重</el-checkbox>
              <el-select class="task-tef ml10" v-model="msgRuleForm.excludeReiterationTask.taskIds" multiple filterable
                default-first-option size="small" placeholder="请选择任务ID或任务主题"
                :disabled="isDisabled(msgRuleForm.excludeReiterationType, 'taskIds')">
                <el-option v-for="(item, key, index) in taskRef" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="fl">
                <el-checkbox value="days" label="days">按天排重</el-checkbox>
              </div>
              <el-select class="c-days fl ml10" v-model="msgRuleForm.excludeReiterationTask.days" size="small" placeholder="请选择"
                :disabled="isDisabled(msgRuleForm.excludeReiterationType, 'days')">
                <el-option v-for="(item, key) in daysData" :key="key" :value="key" :label="item"></el-option>
              </el-select>
            </el-form-item>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择用户群" prop="goupItems">
          <user-group :type="msgRuleForm.groupType" :isradio="msgRuleForm.groupType == '2'" :choses="msgRuleForm.goupItems"
            v-on:choseUsers="choseGroup" userPlaceholder="请输入用户群组名称"></user-group>
          <span class="bottom-desc">
            预计用户量：
            <i v-if="msgRuleForm.taskUserNum >= 0">{{msgRuleForm.taskUserNum}}人</i>
            <i v-if="msgRuleForm.taskUserNum == -1">计算中...</i>
            <i class="error" v-if="msgRuleForm.taskUserNum == -2">计算失败，请重新尝试</i>
          </span>
        </el-form-item>
        <el-form-item label="选择测试群">
          <user-group :type="'1'" :choses="msgRuleForm.testGoupItems" v-on:choseUsers="choseGroup" userPlaceholder="请输入测试群组名称"></user-group>
          <span class="bottom-desc">
            预计用户量：
            <i v-if="msgRuleForm.testTaskUserNum >= 0">{{msgRuleForm.testTaskUserNum}}人</i>
            <i v-if="msgRuleForm.testTaskUserNum == -1">计算中...</i>
            <i class="error" v-if="msgRuleForm.testTaskUserNum == -2">计算失败，请重新尝试</i>
          </span>
        </el-form-item>
        <el-form-item label="短信模板">
          <el-select class="msg-temp" v-model="msgRuleForm.shortMsgTempletId" placeholder="请输入短信模板内容" filterable>
            <el-option class="clearfix" v-for="(item, index) in initTempMsg" :key="index" :label="item.name" :value="item.id">
              <span class="s-temp-info" :style="{width: tempWidth}">{{item.name}}</span>
              <span class="s-temp-btn fr" v-if="msgRuleForm.shortMsgTempletId == item.id" :style="'color:#ccc'">使用</span>
              <span class="s-temp-btn fr" v-else @clcik="msgRuleForm.shortMsgTempletId = item.id">使用</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="埋码短链接" prop="longUrl">
          <el-col :span="20">
            <el-input v-model.trim="msgRuleForm.longUrl" placeholder="请输入长链接网址"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button class="btn btn-primary ml10" v-if="authorizedData.mms_marketing_newurl_note" @click="isUrl.state = (msgRuleForm.longUrl != '')">生成url地址</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="插入字段">
          <!-- <el-popover ref="pcon0" placement="top" width="300" trigger="hover"
            content="用户名按照首个字符+**+最后一个字符的加密规则进行展示，如用户名：a**9（默认按4个字符计算）">
          </el-popover>
          <el-popover ref="pcon1" placement="top" width="300" trigger="hover"
            content="昵称按照首个字符+**+最后一个字符的加密规则进行展示，如昵称：小**飞（默认按4个字符计算）">
          </el-popover>
          <el-popover ref="pcon2" placement="top" width="300" trigger="hover"
            content="根据埋码规则生成合规的短链接，默认去掉http://并前后自动加空格，如：“ gome.cn/xxx ”（默认按13个字符计算）">
          </el-popover>
          <el-popover ref="pcon3" placement="top" width="300" trigger="hover"
            content="导入群组匹配的字段展示，如：“999999” （默认按9个字符计算）">
          </el-popover>
          <el-popover ref="pcon4" placement="top" width="300" trigger="hover"
            content="导入群组匹配的字段展示，如：“9999999999” （默认按6个字符计算）">
          </el-popover>
          <el-popover ref="pcon5" placement="top" width="300" trigger="hover"
            content="默认提示：导入群组匹配的字段展示，如：“100元” （默认按4个字符计算）">
          </el-popover>
          <el-popover ref="pcon6" placement="top" width="300" trigger="hover"
            content="导入群组匹配的字段展示，如：“家电” （默认按10个字符计算）">
          </el-popover> -->
          <span class="msgtip" @click="addAeraTxt('#用户名#')">用户名</span>
          <span class="msgtip" @click="addAeraTxt('#昵称#')">昵称</span>
          <span class="msgtip" v-show="msgRuleForm.longUrl != '' && isUrl.state" @click="addAeraTxt('#Url#')">Url</span>
          <span class="msgtip" v-show="msgRuleForm.groupType === '2'" @click="addAeraTxt('#券号#')">券号</span>
          <span class="msgtip" v-show="msgRuleForm.groupType === '2'" @click="addAeraTxt('#激活码#')">激活码</span>
          <span class="msgtip" v-show="msgRuleForm.groupType === '2'" @click="addAeraTxt('#面值#')">面值</span>
          <span class="msgtip" v-show="msgRuleForm.groupType === '2'" @click="addAeraTxt('#品类#')">品类</span>
        </el-form-item>
        <el-form-item label="短信内容" required>
          <el-row>
            <el-col :span="24">
              <el-checkbox v-model="msgRuleForm.isAB" :disabled="msgRuleForm.groupType == '2' || msgRuleForm.goupItems.length > 1"></el-checkbox>
              短信A/B测试
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :style="'padding-right:8px'">
              <div class="m-textarea-wrap">
                <textarea class="textarea-box" @focus="isArea = 'A'" v-model.trim="msgRuleForm.shortMsgContentA"></textarea>
                <div class="t-tip">退订回T</div>
              </div>
              <span>已输入<i class="red">{{infoContentA.length}}</i>字，预计发送{{infoContentA.size}}条短信，70字/条，最多500字。</span>
              <span v-show="infoContentA.error" class="error" :style="'display:inline; position:static;'">
                {{infoContentA.errorMsg}}
              </span>
              <div class="rate-AB" v-show="msgRuleForm.isAB">
                <el-form-item prop="rateA">
                  <label class="control-label">A测发送占比：</label>
                  <el-input class="w160" v-model.trim="msgRuleForm.rateA" v-on:input="msgRuleForm.rateB = 100 - msgRuleForm.rateA"></el-input>%
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12" :style="'padding-left:8px'">
              <div v-if="msgRuleForm.isAB">
                <div class="m-textarea-wrap">
                  <textarea class="textarea-box" @focus="isArea = 'B'" v-model.trim="msgRuleForm.shortMsgContentB"></textarea>
                  <div class="t-tip">退订回T</div>
                </div>
                <span>已输入<i class="red">{{infoContentB.length}}</i>字，预计发送{{infoContentB.size}}条短信，70字/条，最多500字。</span>
                <span v-show="infoContentB.error" class="error" :style="'display:inline; position:static;'">
                  {{infoContentB.errorMsg}}
                </span>
                <div class="rate-AB" v-show="msgRuleForm.isAB">
                  <label class="control-label">B测发送占比：</label>
                  <el-input class="w160" readonly v-model.trim="msgRuleForm.rateB"></el-input>%
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="通道分配" required>
          <el-radio v-model="msgRuleForm.channelDataType" label="0" :disabled="channelInfo.isPercent">数值</el-radio>
          <el-radio v-model="msgRuleForm.channelDataType" label="1">百分比</el-radio>
        </el-form-item>
        <el-form-item prop="channelConf">
          <el-checkbox-group v-model="msgRuleForm.channelType" v-if="channelInfo.isMoreChose">
            <el-checkbox  v-for="(item, key, index) in initBase.channels" :ref="key" :key="index" :value="key" :label="key">{{item}}
              <el-input class="mm-conf-ipt w160 ml10" v-model="msgRuleForm.channelConf[key]" :disabled="isDisabled(msgRuleForm.channelType, key)"></el-input>
              <i v-show="msgRuleForm.channelDataType == '1'">%</i>
            </el-checkbox>
          </el-checkbox-group>
          <el-radio-group v-model="msgRuleForm.channelType" v-else>
            <el-radio  v-for="(item, key, index) in initBase.channels" :key="index" :label="key">{{item}}
              <el-input class="mm-conf-ipt w160 ml10" :ref="'channelsIpt' + index" :disabled="!(msgRuleForm.channelType === key)" v-model="msgRuleForm.channelConf[key]"></el-input>
              <i v-show="msgRuleForm.channelDataType == '1'">%</i>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送时间" prop="sendTime">
          <el-radio class="fl" v-model="msgRuleForm.sendTimeType" label="1">定时发送</el-radio>
          <el-date-picker class="c-date fl ml10" type="datetime" v-model="msgRuleForm.sendTime" placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss" :disabled="msgRuleForm.sendTimeType !== '1'" :picker-options="pickerEnd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="msgRuleForm.sendTimeType" label="0">立即发送</el-radio>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-radio v-model="msgRuleForm.activityStatus" label="0">发布</el-radio>
          <el-radio v-model="msgRuleForm.activityStatus" label="1">草稿</el-radio>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button class="btn btn-primary" v-if="authorizedData.mms_marketing_onlytest_note && btnGray.testComitBtn" @click="checkTestGroup">仅发送测试群</el-button>
          <el-button class="btn btn-gray" v-if="authorizedData.mms_marketing_onlytest_note && !btnGray.testComitBtn">仅发送测试群</el-button>
          <el-button class="btn btn-gray ml10" v-if="authorizedData.mms_marketing_confirm_note && !btnGray.testComitBtn">保存</el-button>
          <el-button class="btn btn-primary ml10" v-if="authorizedData.mms_marketing_confirm_note && btnGray.testComitBtn" @click="checkGroupComit">保存</el-button>
          <el-button class="btn btn-gray ml10" v-if="authorizedData.mms_marketing_cancel_note && !btnGray.testComitBtn">取消</el-button>
          <el-button class="btn btn-white ml10" v-if="authorizedData.mms_marketing_cancel_note && btnGray.testComitBtn" @click="goBack">取消</el-button>
          <span class="pos-rel ml10">
            <el-checkbox :false-label="'0'" :true-label="'1'" v-model="msgRuleForm.isSaveMsgTemplet"></el-checkbox>
            <span class="lbl"></span>
            将短信内容保存至模板
          </span>
          <el-dialog title="操作提示" class="creat-msg-dialog text-left" :visible.sync="saveMsgDialog">
            <div :style="'padding:0 20px'">
              <p>预计发送
                <span class="red" v-if="msgRuleForm.channelDataType === '0' && msgRuleForm.channelType.length > 0">{{sendUser}}</span>
                <span class="red" v-else>{{msgRuleForm.taskUserNum}}</span>个用户，预计发送
                <span class="red" v-if="msgRuleForm.channelDataType === '0' && msgRuleForm.channelType.length > 0">
                  <span v-if="msgRuleForm.isAB">
                    {{isMsgCount(sendUser)}}
                  </span>
                  <span v-else>{{sendUser * infoContentA.size}}</span>
                </span>
                <span class="red" v-else>
                  <span v-if="msgRuleForm.isAB">
                    {{isMsgCount(msgRuleForm.taskUserNum)}}
                  </span>
                  <span v-else>{{msgRuleForm.taskUserNum * infoContentA.size}}</span>
                </span>条短信
              </p>
              <p v-if="msgRuleForm.channelType.length > 0">
                <span v-if="msgRuleForm.channelDataType == 1 || msgRuleForm.channelDataType == '1'">通道占比为：</span>
                <span v-else>通道数量为：</span>
                <span v-for="(item, key, index) in msgRuleForm.channelConf" :key="index">
                  {{initBase.channels[key]}}:{{item}}<i v-if="msgRuleForm.channelDataType == 1 || msgRuleForm.channelDataType == '1'">%</i>
                </span>&nbsp;
              </p>
              <p>发送时间为：
                <span v-if="msgRuleForm.sendTimeType == '1'">定时发送：{{msgRuleForm.sendTime}}</span>
                <span v-if="msgRuleForm.sendTimeType == '0'">立即发送</span>
              </p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button class="btn btn-white" @click="saveMsgDialog = false">取 消</el-button>
              <el-button class="btn btn-primary" v-if="btnGray.comitBtn" @click="checkWord('save')">确 定</el-button>
              <el-button class="btn btn-gray" v-else>确 定</el-button>
            </div>
          </el-dialog>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import usergroup from 'common/usergroup'
import { getGroupNum, getMsgTemp, getTask, getTaskRef, testSave, msgSave, checkSub, copyMsg, pageAuthorized, checkSensitiveWords } from 'api/msgService'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    var _this = this
    var checkRateA = (rule, value, callback) => {
      if (this.msgRuleForm.isAB) {
        if (/^([1-9]\d*)$/.test(this.msgRuleForm.rateA)) {
          callback()
        } else {
          return callback(new Error('测试发送占比为大于0正整数'))
        }
      } else {
        callback()
      }
    }
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写任务主题'))
      }
      setTimeout(() => {
        if (value.length < 4 || value.length > 20) {
          callback(new Error('任务主题长度只能在4-20个字之间'))
        } else if (!/^([_a-zA-Z0-9\-、\u4e00-\u9fa5]+)$/.test(value)) {
          callback(new Error('任务主题仅可包含汉字、字母、数字及_-、'))
        } else {
          checkSub({
            'subject': _this.msgRuleForm.name,
            'taskId': _this.msgOperate === 'edit' ? _this.taskId : ''
          }, function (data) {
            if (data.success === true || data.success === 'true') {
              if (data.data === true || data.data === 'true') {
                callback(new Error('任务主题已存在'))
              } else {
                callback()
              }
            }
          })
        }
      }, 1000)
    }
    var checkGroup = (rule, value, callback) => {
      setTimeout(() => {
        if (_this.msgRuleForm.goupItems.length <= 0) {
          callback(new Error('请选择用户群组'))
        } else {
          callback()
        }
      }, 2000)
    }
    var checkLongUrl = (rule, value, callback) => {
      if (_this.msgRuleForm.longUrl && !/^(https?:\/\/.*)$/.test(_this.msgRuleForm.longUrl)) {
        callback(new Error('埋码短链接必须以http或是https开头'))
      } else {
        callback()
      }
    }
    var checkSendTime = (rule, value, callback) => {
      if (_this.msgRuleForm.sendTimeType === '1') {
        if (_this.msgRuleForm.sendTime === '') {
          callback(new Error('请选择发送时间'))
        } else if (new Date(_this.msgRuleForm.sendTime).getTime() <= new Date().getTime()) {
          callback(new Error('发送时间需大于当前时间'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var checkChannelConf = (rule, value, callback) => {
      var iptTotal = 0
      setTimeout(() => {
        if (_this.msgRuleForm.channelType.length > 0) {
          if (typeof _this.msgRuleForm.channelType === 'string') {
            var eleValS = _this.msgRuleForm.channelConf[_this.msgRuleForm.channelType]
            if (/^([1-9]\d*)$/.test(eleValS)) {
              iptTotal = parseInt(eleValS)
            } else {
              callback(new Error('通道数值为大于0的正整数'))
            }
          } else {
            var confFlag = false
            _this.msgRuleForm.channelType.forEach(element => {
              var eleVal = _this.msgRuleForm.channelConf[element]
              if (/^([1-9]\d*)$/.test(eleVal)) {
                iptTotal += parseInt(eleVal)
              } else {
                confFlag = true
                callback(new Error('通道数值为大于0的正整数'))
              }
            })
            iptTotal = confFlag ? 0 : iptTotal
          }
          if (iptTotal > 0) {
            if (_this.msgRuleForm.channelDataType === '0') {
              if (iptTotal > _this.msgRuleForm.taskUserNum) {
                callback(new Error('通道数值需小于用户量'))
              } else {
                callback()
              }
            } else {
              if (iptTotal !== 100) {
                callback(new Error('通道百分比需等于100'))
              } else {
                callback()
              }
            }
          }
        } else {
          callback(new Error('通道不可为空'))
        }
      }, 500)
    }
    return {
      tempWidth: 0,
      isFirst: {
        gt: true,
        cj: true,
        tf: true,
        ab: true,
        cc: true,
        js: true
      },
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      /* 焦点于A板还是B板 */
      isArea: 'A',
      sendUser: 0,
      btnGray: {
        comitBtn: true,
        testComitBtn: true
      },
      isUrl: {
        state: false,
        error: false
      },
      saveMsgDialog: false,
      daysData: {
        '1': '近1天',
        '2': '近2天',
        '3': '近3天',
        '4': '近4天',
        '5': '近5天',
        '6': '近6天',
        '7': '近7天'
      },
      initBase: {},
      tempMsgJson: {},
      initTempMsg: [],
      channelVerify: '',
      channelError: '',
      channelInfo: {
        isPercent: null,
        isMoreChose: true
      },
      taskRef: [],
      infoContentA: {
        length: 4,
        size: 1,
        isWarn: false,
        error: false,
        errorMsg: ''
      },
      infoContentB: {
        length: 4,
        size: 1,
        isWarn: false,
        error: false,
        errorMsg: ''
      },
      msgRuleForm: {
        name: '',
        activityType: '',
        category: '',
        taskType: '1',
        groupType: '0',
        goupItems: [],
        taskUserNum: 0,
        testTaskUserNum: 0,
        testGoupItems: [],
        shortMsgTempletId: '',
        longUrl: '',
        isAB: false,
        shortMsgContentA: '',
        shortMsgContentB: '',
        rateA: 70,
        rateB: 30,
        channelDataType: '0',
        channelType: [],
        channelConf: {},
        excludeReiterationType: [],
        excludeReiterationTask: {
          taskIds: [],
          days: ''
        },
        sendTimeType: '1',
        sendTime: '',
        activityStatus: '1',
        isSaveMsgTemplet: '0'
      },
      /** 定时时间今日以前日期不可选择 */
      pickerEnd: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 86400000
        }
      },
      rules: {
        name: [
          { required: true, message: '请填写任务主题', trigger: 'focus' },
          { validator: checkName, trigger: 'blur,change' }
        ],
        activityType: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择品类活动', trigger: 'change' }
        ],
        goupItems: [
          { validator: checkGroup, trigger: 'change' }
        ],
        longUrl: [
          { validator: checkLongUrl, trigger: 'blur,change' }
        ],
        sendTime: [
          { validator: checkSendTime, trigger: 'change' }
        ],
        channelConf: [
          { validator: checkChannelConf, trigger: 'blur,change' }
        ],
        rateA: [
          { validator: checkRateA, trigger: 'blur,change' }
        ]
      }
    }
  },
  components: {
    'userGroup': usergroup
  },
  computed: {
    ...mapGetters([
      'taskId',
      'msgOperate',
      'msgTempletId',
      'NormalGEditId',
      'NormalGEditIdType'
    ])
  },
  destroyed: function () {
    this.emptyAll()
  },
  mounted: function () {
    var _this = this
    pageAuthorized({
      code: 'mms_sms_task_create'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_sms_task_create
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.pageInit()
          }
        } else {
          window.location.href = mmsDomain.ermHome
        }
      }
    })
    this.tempWidth = (parseInt(document.body.offsetWidth) - 182) * 0.9 + 'px'
  },
  methods: {
    isMsgCount: function (groupVal) {
      var aCount = Math.round(groupVal * this.msgRuleForm.rateA / 100)
      var bCount = groupVal - aCount
      return aCount * this.infoContentA.size + bCount * this.infoContentB.size
    },
    pageInit: function () {
      var _this = this
      _this.initTaskBase()
      /** 获取任务排重数据 */
      getTaskRef(function (data) {
        if (data.success === true || data.success === 'true') {
          _this.taskRef = data.data
        }
      })
      /** 获取短信模板数据 */
      getMsgTemp(function (data) {
        if (data.success === true || data.success === 'true') {
          _this.initTempMsg = data.data ? data.data : []
          _this.initTempMsg.forEach((element, index) => {
            _this.tempMsgJson[element.id] = element.name
          })
        }
      })
      /** 用户管理页面跳转新建短信任务 */
      if (_this.NormalGEditId !== '') {
        this.msgRuleForm.goupItems.push(_this.NormalGEditId)
        this.msgRuleForm.groupType = this.NormalGEditIdType === 'Import' ? '2' : '0'
      }
      /** 由复制、编辑跳转过来，渲染原数据 */
      if (_this.taskId !== '') {
        copyMsg({
          'taskId': _this.taskId
        }, function (data) {
          if (data.success === true || data.success === 'true') {
            var copyData = data.data
            copyData.activityStatus = '1' // 点击复制后的编辑页面，状态默认为草稿
            for (var name in copyData) {
              if (name === 'taskId') {
                if (_this.msgOperate === 'edit') {
                  _this.msgRuleForm[name] = copyData[name]
                }
              } else {
                if (name === 'shortMsgContentA' || name === 'shortMsgContentB') {
                  _this.msgRuleForm[name] = copyData[name].replace(/退订回T/g, '')
                } else {
                  _this.msgRuleForm[name] = copyData[name]
                }
              }
            }
            if (_this.msgOperate === 'copy') {
              _this.msgRuleForm.sendTime = ''
              _this.msgRuleForm.sendTimeType = '1'
            }
            _this.isUrl.state = data.data.longUrl && true
          }
        })
      }
      /** 由模板页跳转过来渲染短信模板，开始新建任务 */
      if (_this.msgTempletId !== '') {
        _this.msgRuleForm.shortMsgTempletId = _this.msgTempletId
      }
    },
    msgtipPop: function (state, index) {
      this.popTxt.show = state
      this.popTxt.txt = this.popTxt.list[index]
    },
    initTaskBase: function () {
      var _this = this
      getTask(function (data) {
        if (data.success === true || data.success === 'true') {
          _this.initBase = data.data
        }
      })
    },
    choseGroup: function (data) {
      var flag = this.msgRuleForm.goupItems[0] === data.data[0]
      var taskIds = this.msgRuleForm.excludeReiterationTask.taskIds.length > 0 ? this.msgRuleForm.excludeReiterationTask.taskIds.join(',') : ''
      var dayStr = this.msgRuleForm.excludeReiterationTask.days ? this.msgRuleForm.excludeReiterationTask.days : ''
      if (data.type === '0' || data.type === '2') {
        this.msgRuleForm.goupItems = data.data
        if (flag) {
          this.getUGNum('taskUserNum', data.data, taskIds, dayStr)
        }
      }
      if (data.type === '1') {
        this.msgRuleForm.testGoupItems = data.data
      }
    },
    getUGNum: function (numType, groupData, taskIds, dayStr) {
      var _this = this
      var channelsArr = []
      if (_this.initBase.channels) {
        for (var key in _this.initBase.channels) {
          channelsArr.push(key)
        }
      } else {
        getTask(function (data) {
          if (data.success === true || data.success === 'true') {
            _this.initBase = data.data
            for (var key in _this.initBase.channels) {
              channelsArr.push(key)
            }
          }
        })
      }
      if (groupData && groupData.length > 0) {
        _this.msgRuleForm[numType] = -1
        getGroupNum({
          'UGIds': groupData.join(','),
          'taskIds': taskIds,
          'dayStr': dayStr
        }, function (data) {
          if (data.success === true || data.success === 'true') {
            if (data.data >= 0) {
              _this.msgRuleForm[numType] = data.data
              if (numType === 'taskUserNum') {
                var defaultNum = _this.msgRuleForm.channelDataType === '0' ? (data.data + '') : '100'
                if (_this.msgRuleForm.channelType.length > 0) {
                  var defaultType = _this.msgRuleForm.channelType[0]
                  if (!_this.msgRuleForm.channelConf[defaultType]) {
                    _this.msgRuleForm.channelConf[defaultType] = defaultNum
                  }
                } else {
                  _this.msgRuleForm.channelType.push(channelsArr[0])
                  _this.msgRuleForm.channelConf[channelsArr[0]] = defaultNum
                }
              }
            } else if (data.data === -1 || data.data === '-1') {
              _this.msgRuleForm[numType] = -1
              if (window.groupNumTimeOut) {
                clearTimeout(window.groupNumTimeOut)
              }
              window.groupNumTimeOut = setTimeout(() => {
                _this.getUGNum(numType, groupData, taskIds, dayStr)
              }, 5000)
            } else {
              _this.msgRuleForm[numType] = -2
            }
          }
        })
      } else {
        _this.msgRuleForm[numType] = 0
      }
    },
    addAeraTxt: function (value) {
      this.msgRuleForm['shortMsgContent' + this.isArea] = this.msgRuleForm['shortMsgContent' + this.isArea] + value
    },
    checkTestGroup: function () {
      var _this = this
      this.checkMsgcon(this.msgRuleForm.shortMsgContentA, 'A')
      if (this.msgRuleForm.isAB) {
        this.checkMsgcon(this.msgRuleForm.shortMsgContentA, 'B')
      }
      if (this.msgRuleForm.testGoupItems.length <= 0) {
        this.$message('请选择测试群组')
      } else if (this.msgRuleForm.testTaskUserNum <= 0) {
        this.$message('测试群组用户量需大于0')
      } else {
        this.$refs.msgRuleForm.validate((valid) => {
          if (valid && !_this.infoContentA.error && !_this.infoContentB.error) {
            var conf = _this.msgRuleForm.channelConf
            if (typeof _this.msgRuleForm.channelType === 'string') {
              _this.msgRuleForm.channelConf = {}
              _this.msgRuleForm.channelConf[_this.msgRuleForm.channelType] = conf[_this.msgRuleForm.channelType]
            } else {
              _this.msgRuleForm.channelConf = {}
              _this.msgRuleForm.channelType.forEach((element, index) => {
                if (parseInt(conf[element]) > 0) {
                  if (element !== 'undefined') {
                    _this.msgRuleForm.channelConf[element] = conf[element]
                  } else {
                    _this.msgRuleForm.channelType.splice(index, 1)
                  }
                }
              })
            }
            _this.checkWord('test')
          }
        })
      }
    },
    testGroupComit: function () {
      var _this = this
      this.btnGray.testComitBtn = false
      testSave(_this.msgRuleForm, function (data) {
        if (!(data.success === true || data.success === 'true')) {
          _this.$message('保存失败' + data.remark)
          _this.btnGray.testComitBtn = true
        } else {
          _this.$message('发送成功')
          _this.btnGray.testComitBtn = true
        }
      })
    },
    checkGroupComit: function () {
      var _this = this
      this.checkMsgcon(this.msgRuleForm.shortMsgContentA, 'A')
      if (this.msgRuleForm.isAB) {
        this.checkMsgcon(this.msgRuleForm.shortMsgContentA, 'B')
      }
      this.$refs.msgRuleForm.validate((valid) => {
        if (valid && !_this.infoContentA.error && !_this.infoContentB.error) {
          var conf = _this.msgRuleForm.channelConf
          if (typeof _this.msgRuleForm.channelType === 'string') {
            _this.msgRuleForm.channelConf = {}
            _this.msgRuleForm.channelConf[_this.msgRuleForm.channelType] = conf[_this.msgRuleForm.channelType]
          } else {
            _this.msgRuleForm.channelConf = {}
            _this.msgRuleForm.channelType.forEach((element, index) => {
              if (parseInt(conf[element]) > 0) {
                if (element !== 'undefined') {
                  _this.msgRuleForm.channelConf[element] = conf[element]
                } else {
                  _this.msgRuleForm.channelType.splice(index, 1)
                }
              }
            })
          }

          if (_this.msgRuleForm.taskUserNum <= 0) {
            _this.$message('用户群组用户量需大于0')
          } else {
            _this.saveMsgDialog = true
          }
        }
      })
    },
    checkWord: function (type) {
      var _this = this
      checkSensitiveWords({
        'shortMsgContentA': _this.msgRuleForm.shortMsgContentA,
        'shortMsgContentB': _this.msgRuleForm.shortMsgContentB
      }, function (data) {
        if (data.success === false || data.success === 'false') {
          _this.$confirm(data.data, '敏感词提示', {
            confirmButtonText: '忽略保存',
            cancelButtonText: '取消修改',
            type: 'warning'
          }).then(() => {
            if (type === 'test') {
              _this.testGroupComit()
            } else if (type === 'save') {
              _this.groupComit()
            }
          })
        } else {
          if (type === 'test') {
            _this.testGroupComit()
          } else if (type === 'save') {
            _this.groupComit()
          }
        }
      })
    },
    groupComit: function () {
      var _this = this
      _this.btnGray.comitBtn = false
      msgSave(_this.msgRuleForm, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.emptyAll()
          _this.$router.push('/messagemanage')
          _this.btnGray.comitBtn = false
        } else {
          _this.$message('保存失败' + data.remark)
          _this.btnGray.comitBtn = true
        }
      })
    },
    msgCompute: function (content) {
      var obj = {}
      if (content !== '') {
        var length = content.length + 4
        /** 默认按4个字符计算 */
        var nameReg = /#用户名#/g
        /** 默认按9个字符计算 */
        var voucherReg = /#券号#/g
        /** 默认按6个字符计算 */
        var codeReg = /#激活码#/g
        /** 默认按10个字符计算 */
        var categoryReg = /#品类#/g
        /** 默认按14个字符计算 */
        var urlReg = /#Url#/g
        length += content.match(nameReg) ? -1 * content.match(nameReg).length : 0
        length += content.match(voucherReg) ? content.match(voucherReg).length * 5 : 0
        length += content.match(codeReg) ? content.match(codeReg).length : 0
        length += content.match(categoryReg) ? content.match(categoryReg).length * 6 : 0
        length += content.match(urlReg) ? content.match(urlReg).length * 9 : 0
        obj.length = length
        obj.error = length > 500

        var n = length !== 0 ? length > 70 ? Math.ceil(length / 67) : 1 : 0
        switch (n) {
          case 0:
          case 1:
            obj.size = n
            obj.isWarn = false
            break
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            obj.size = n
            if (!this['infoContent' + this.isArea].isWarn && !(this.msgOperate === 'edit' || this.msgOperate === 'copy')) {
              this.$confirm('短信内容已超 70 个字，已成为多条短信。', '提示', {
                confirmButtonText: '知道了',
                showCancelButton: false,
                type: 'warning'
              })
            }
            obj.isWarn = true
            break
          default:
            obj.size = n
            obj.isWarn = false
        }
        return obj
      } else {
        return {
          length: 4,
          size: 0,
          isWarn: false,
          error: false,
          errorMsg: ''
        }
      }
    },
    checkMsgcon: function (value, type) {
      var _this = this
      var count = value.match(/退订回T/g)
      if ((type === 'B' && _this.msgRuleForm.isAB) || type === 'A') {
        if (value === '') {
          _this['infoContent' + type].error = true
          _this['infoContent' + type].errorMsg = '短信内容不能为空'
        } else if (value.length > 500) {
          _this['infoContent' + type].error = true
          _this['infoContent' + type].errorMsg = '已超过最大字数限制'
        } else if (count && count.length > 0) {
          _this['infoContent' + type].error = true
          _this['infoContent' + type].errorMsg = '短信内容包含多个退订回T'
        } else {
          _this['infoContent' + type].error = false
          _this['infoContent' + type].errorMsg = ''
        }
      }
    },
    channelJudge: function () {
      var state = !(this.msgRuleForm.goupItems.length === 1 && this.msgRuleForm.isAB) // 多选
      this.channelInfo.isPercent = this.msgRuleForm.goupItems.length !== '' && this.msgRuleForm.goupItems.length > 1
      if (this.channelInfo.isPercent) {
        this.msgRuleForm.channelDataType = '1'
      }
      if (this.channelInfo.isMoreChose !== state) {
        this.channelInfo.isMoreChose = state
        if (!this.channelInfo.isPercent) {
          this.msgRuleForm.channelDataType = '0'
        }
        for (var name in this.msgRuleForm.channelConf) {
          this.msgRuleForm.channelConf[name] = ''
        }
      }
      if (this.channelInfo.isMoreChose) {
        this.msgRuleForm.channelType = []
        this.msgRuleForm.channelConf = {}
      } else {
        this.msgRuleForm.channelType = ''
        this.msgRuleForm.channelConf = {}
      }
    },
    isDisabled: function (obj, key) {
      var flag = true
      for (var i = 0; i < obj.length; i++) {
        if (obj[i] === key) {
          flag = false
        }
      }
      return flag
    },
    goBack: function () {
      window.history.back()
    },
    ...mapActions([
      'emptyAll'
    ])
  },
  watch: {
    'msgRuleForm': {
      handler: function (obj, oldObj) {
        this.btnGray.testComitBtn = true
      },
      deep: true
    },
    'msgRuleForm.sendTimeType': function () {
      if (this.msgRuleForm.sendTimeType === '0') {
        this.msgRuleForm.sendTime = ''
      }
    },
    'msgRuleForm.shortMsgTempletId': function () {
      var _this = this
      if (this.msgRuleForm.shortMsgTempletId !== '') {
        if (((this.msgOperate === 'edit' || this.msgOperate === 'copy') && !this.isFirst.tf) || this.msgOperate === '') {
          if (this.initTempMsg.length > 0) {
            var tempTxt = this.tempMsgJson[this.msgRuleForm.shortMsgTempletId]
            if (this.msgRuleForm.isAB) {
              this.msgRuleForm.shortMsgContentA = tempTxt
              this.msgRuleForm.shortMsgContentB = tempTxt
            } else {
              this.msgRuleForm['shortMsgContent' + this.isArea] = tempTxt
            }
          } else {
            getMsgTemp(function (data) {
              if (data.success === true || data.success === 'true') {
                _this.initTempMsg = data.data ? data.data : []
                _this.initTempMsg.forEach((element, index) => {
                  _this.tempMsgJson[element.id] = element.name
                })
                var nTempTxt = _this.tempMsgJson[_this.msgRuleForm.shortMsgTempletId]
                if (_this.msgRuleForm.isAB) {
                  _this.msgRuleForm.shortMsgContentA = nTempTxt
                  _this.msgRuleForm.shortMsgContentB = nTempTxt
                } else {
                  _this.msgRuleForm['shortMsgContent' + _this.isArea] = nTempTxt
                }
              }
            })
          }
        }
      }
      this.isFirst.tf = false
    },
    'msgRuleForm.shortMsgContentA': function (value, oldValue) {
      if (this.msgCompute(this.msgRuleForm.shortMsgContentA)) {
        this.infoContentA = this.msgCompute(this.msgRuleForm.shortMsgContentA)
      }
      this.checkMsgcon(this.msgRuleForm.shortMsgContentA, 'A')
    },
    'msgRuleForm.shortMsgContentB': function (value, oldValue) {
      if (this.msgCompute(this.msgRuleForm.shortMsgContentB)) {
        this.infoContentB = this.msgCompute(this.msgRuleForm.shortMsgContentB)
      }
      this.checkMsgcon(this.msgRuleForm.shortMsgContentB, 'B')
    },
    'msgRuleForm.channelConf': {
      handler: function (obj, oldObj) {
        var totalNum = 0
        if (typeof this.msgRuleForm.channelType === 'string') {
          totalNum += isNaN(parseInt(this.msgRuleForm.channelConf[this.msgRuleForm.channelType])) ? 0 : parseInt(this.msgRuleForm.channelConf[this.msgRuleForm.channelType])
        } else {
          this.msgRuleForm.channelType.forEach(element => {
            totalNum += isNaN(parseInt(this.msgRuleForm.channelConf[element])) ? 0 : parseInt(this.msgRuleForm.channelConf[element])
          })
        }
        this.sendUser = totalNum
        if ((this.msgOperate === 'edit' || this.msgOperate === 'copy') && this.isFirst.cc) {
          this.channelInfo.isMoreChose = !(this.msgRuleForm.goupItems.length === 1 && this.msgRuleForm.isAB) // 多选
          if (!this.channelInfo.isMoreChose) {
            this.msgRuleForm.channelType = this.msgRuleForm.channelType[0]
          }
        }
        this.isFirst.cc = false
      },
      deep: true
    },
    'msgRuleForm.excludeReiterationTask.taskIds': { // 按照任务排重
      handler: function (obj, oldObj) {
        var dayStr = this.msgRuleForm.excludeReiterationTask.days ? this.msgRuleForm.excludeReiterationTask.days : ''
        var taskIds = obj.length > 0 ? obj.join(',') : ''
        if (oldObj && obj.length !== oldObj.length) {
          this.getUGNum('taskUserNum', this.msgRuleForm.goupItems, taskIds, dayStr)
        }
      },
      deep: true
    },
    'msgRuleForm.excludeReiterationTask.days': function () {
      var taskIds = this.msgRuleForm.excludeReiterationTask.taskIds.length > 0 ? this.msgRuleForm.excludeReiterationTask.taskIds.join(',') : ''
      if (this.msgRuleForm.excludeReiterationTask.days) {
        this.getUGNum('taskUserNum', this.msgRuleForm.goupItems, taskIds, this.msgRuleForm.excludeReiterationTask.days)
      }
    },
    'msgRuleForm.goupItems': function () {
      var taskIds = this.msgRuleForm.excludeReiterationTask.taskIds.length > 0 ? this.msgRuleForm.excludeReiterationTask.taskIds.join(',') : ''
      var dayStr = this.msgRuleForm.excludeReiterationTask.days ? this.msgRuleForm.excludeReiterationTask.days : ''
      this.getUGNum('taskUserNum', this.msgRuleForm.goupItems, taskIds, dayStr)
      if (((this.msgOperate === 'edit' || this.msgOperate === 'copy') && !this.isFirst.cj) || this.msgOperate === '') {
        this.channelJudge()
      }
      this.isFirst.cj = false
      if (this.msgRuleForm.groupType === '2' || this.msgRuleForm.goupItems.length > 1) {
        this.msgRuleForm.isAB = false
      }
    },
    'msgRuleForm.testGoupItems': function () {
      var taskIds = this.msgRuleForm.excludeReiterationTask.taskIds.length > 0 ? this.msgRuleForm.excludeReiterationTask.taskIds.join(',') : ''
      var dayStr = this.msgRuleForm.excludeReiterationTask.days ? this.msgRuleForm.excludeReiterationTask.days : ''
      this.getUGNum('testTaskUserNum', this.msgRuleForm.testGoupItems, taskIds, dayStr)
    },
    'msgRuleForm.isAB': function () {
      if (((this.msgOperate === 'edit' || this.msgOperate === 'copy') && !this.isFirst.ab) || this.msgOperate === '') {
        this.channelJudge()
        if (this.msgRuleForm.isAB) {
          this.msgRuleForm.shortMsgContentB = this.msgRuleForm.shortMsgTempletId ? this.msgRuleForm.shortMsgContentA : ''
        } else {
          this.msgRuleForm.shortMsgContentB = ''
        }
      }
      this.isFirst.ab = false
    },
    'msgRuleForm.channelType': function (val, oldVal) {
      let taskUserNum = this.msgRuleForm.taskUserNum // 预计用户总量
      if (typeof this.msgRuleForm.channelType === 'string') {
        this.msgRuleForm.channelConf[oldVal] = ''
      } else {
        if (val.length < oldVal.length) {
          var reg = new RegExp(val.join('|'), 'g')
          var vStr = oldVal.join(',')
          var v = vStr.replace(reg, '').replace(/,/g, '')
          this.msgRuleForm.channelConf[v] = ''
        }
        if (val.length !== oldVal.length && oldVal.length > 0) {
          for (let i = 0; i < val.length; i++) {
            if (this.msgRuleForm.channelDataType === '0') {
              let msgNumber = Math.floor(taskUserNum / (val.length)).toString()
              this.msgRuleForm.channelConf[val[i]] = msgNumber
            } else {
              let msgBFB = Math.floor(100 / (val.length)).toString()
              this.msgRuleForm.channelConf[val[i]] = msgBFB
            }
          }
        }
      }
    },
    'msgRuleForm.channelDataType': function (val) { // 监听通道切换
      let taskUserNum = this.msgRuleForm.taskUserNum
      if (this.msgRuleForm.channelType.length > 0) {
        let channelType = this.msgRuleForm.channelType
        for (let i = 0; i < channelType.length; i++) {
          if (val === '0') {
            this.msgRuleForm.channelConf[channelType[i]] = Math.floor(taskUserNum / (channelType.length)).toString()
          } else {
            this.msgRuleForm.channelConf[channelType[i]] = Math.floor(100 / (channelType.length)).toString()
          }
        }
      }
    },
    'msgRuleForm.excludeReiterationType': function (val) {
      if (val.length < 2) {
        if (val[0] !== 'taskIds') {
          this.msgRuleForm.excludeReiterationTask.taskIds = []
        }
        if (val[0] !== 'days') {
          this.msgRuleForm.excludeReiterationTask.days = ''
        }
      }
    },
    'msgRuleForm.groupType': function () {
      if (!this.NormalGEditId) {
        if (this.msgOperate === 'edit' || this.msgOperate === 'copy') {
          if (!this.isFirst.gt) {
            this.msgRuleForm.goupItems = []
            this.msgRuleForm.taskUserNum = 0
            this.channelJudge()
          }
        } else {
          this.msgRuleForm.goupItems = []
          this.msgRuleForm.taskUserNum = 0
          this.channelJudge()
        }
        this.isFirst.gt = false
      }
      if (this.msgRuleForm.groupType === '2' || this.msgRuleForm.goupItems.length > 1) {
        this.msgRuleForm.isAB = false
      }
    }
  }
}
</script>

<style>
.m-textarea-wrap{ position:relative; width:100%; height:200px; border:1px solid #ccc;}
.m-textarea-wrap .textarea-box{ position: absolute; left:0; top:0; z-index:1; display:block; width:100%; height:175px; line-height:22px; background: #fff; border:none; resize:none;}
.m-textarea-wrap .textarea-box:hover{ border:none;}
.m-textarea-wrap .t-tip{ position:absolute; bottom:5px; left:10px; z-index:5; height:20px; background:#fff;}
.search-t4:after{ top:4px;}
.msgtip{ float:left; display:block; padding:0 10px; margin-right:5px; background:#eee; line-height:30px; cursor:pointer;}
.s-temp-btn{ float:right; color:#2875cc; font-size:13px;}
span.s-temp-info{ float:left; display:block; width:90%; height:30px; overflow:hidden; text-align:left;
  text-overflow:ellipsis; white-space: nowrap;}
.msg-temp{ width:100%;}
.creat-msg-dialog .el-dialog{ width:600px;}
.creat-msg-dialog .el-dialog__body{ padding:20px 20px 0;}
.mm-wrapper .el-form-item .task-tef{ min-width:300px; width:300px;}
.el-form-item.is-error .mm-conf-ipt .el-input__inner:disabled,
.el-form-item.is-error .mm-conf-ipt .el-input__inner:disabled:focus{
  border: 1px solid #ccc
}
.mm-conf-ipt.w160,
.w160.el-input{ width:160px;}
.mm-wrapper .c-date.el-date-editor,
.mm-wrapper .c-days.el-select{ width: 200px;}
.mm-wrapper .el-input--suffix .el-input__inner{ background: #fff!important;}
.mm-wrapper .el-input--suffix .el-input__inner:disabled{ background: #eee!important;}
.el-main .el-button.ml10{ margin-left:10px;}
.el-form-item .el-form-item.mb16{ margin-bottom:16px;}
.mm-wrapper .c-date.el-date-editor.el-input--suffix .el-input__inner,
.mm-wrapper .c-date.el-date-editor.el-input--suffix{ width: 200px;}
</style>
