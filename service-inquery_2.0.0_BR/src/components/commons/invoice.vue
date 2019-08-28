<template>
  <div class="invoice">
    <!-- 判断不是联营门店 -->
    <!-- 联营门店不支持发票 -->
    <template v-if="poolFlag=='1'">
      <span style="margin-right:10px;">发票：</span>
      <span style="color:#909399;">联营门店不开具发票，请到收银台索取发票;</span>
    </template>
    <template v-else-if="poolFlag=='2'">
      <span style="margin-right:10px;">发票：</span>
      <span style="color:#909399;">发票由加盟店开具</span>
    </template>
    <!-- 导购车内只选中了彩票/实体运营商类商品 -->
    <template v-else>
      <template v-if="isAllUnSupportInvoice==true">
        <span style="margin-right:10px;">发票：</span>
        <span style="color:#909399">所选商品不支持开具发票</span>
      </template>
      <template v-else>
        <span style="margin-right:10px;margin-left:-7px;">
          <span class="red">*</span>发票：
        </span>
        <el-button
          type="text"
          v-if="invoice && invoice.headType=='' && invoice.invoiceType==''"
          @click="InvoiceInformatione=true"
        >请输入发票信息</el-button>
        <span>
          <!-- 显示个人发票 -->
          <el-tag
            type="danger"
            style="margin-right:5px;"
            v-if="invoice && invoice.headType=='' && invoice.invoiceType=='2'"
          >增票</el-tag>
          <span class="mr20" v-if="mobile && head">{{head}}</span>
          <span
            class="mr20"
            v-if="head && mobile && invoice.headType=='0' && invoice.invoiceType!='2' "
          >{{mobile}}</span>
          <!-- <span style="margin-right:20px;line-height:25px" class="invoiceHead">{{head}}</span> -->
          <!-- <span style="margin-right:20px;line-height:25px" v-if="mobile && invoice.headType=='0' && invoice.invoiceType!='2' ">{{mobile}}</span> -->
          <el-button
            type="text"
            v-if="invoice && invoice.headType!='' || invoice.invoiceType=='2'"
            @click="InvoiceInformatione=true"
          >修改</el-button>
        </span>
        <div style="margin:-5px 0 5px 55px;color:#909399" v-if="isFrontmoney">发货后可生成发票</div>
        <div
          v-if="incrementAmount!='0.00' && ((headType2=='0' && email=='') || (headType2=='1' && email==''))"
          role="tooltip"
          id="el-tooltip-9526"
          aria-hidden="false"
          class="el-tooltip__popper is-light"
          style="top: -2px;display:inline-block"
          x-placement="right"
        >
          请输入邮箱接收延保协议
          <div x-arrow class="popper__arrow" style="top: 12px;"></div>
        </div>
        <el-dialog
          class="billInfo"
          title="发票信息"
          ref="subjectChild"
          v-if="InvoiceInformatione && invoice"
          :visible.sync="InvoiceInformatione"
          width="780px"
          top="50px"
          max-height="500px"
          align="left"
          @close="close()"
        >
          <el-form label-width="130px" v-if="invoice">
            <el-form-item label="发票类型：" class="is-required">
              <span
                class="span-info self-select-box"
                nstyle="margin-right:12px;"
                @click="invoiceType='1',headType='0'"
                :class="invoiceType!='2'?'active':''"
              >
                电子发票
                <em data-v-5cd5f4e7 class="select-icon"></em>
              </span>
              <span
                class="span-info self-select-box"
                v-if="billingUsedParam.temporaryCardFlag!='1' && invoiceValueAdded"
                @click="invoiceType='2',headType=''"
                :class="invoiceType=='2'?'active':''"
              >
                增值税发票
                <em data-v-5cd5f4e7 class="select-icon"></em>
              </span>
            </el-form-item>
            <div v-show="invoiceType!='2'">
              <el-form-item>
                <div class="div-danger">
                  电子发票是增值税电子普通发票的简称，是国家税务总局认可的有效凭证。
                  <br>其法律效力、基本用途、基本使用规定等与普通纸质发票相同，可用于用户报销、维权、保修。
                  <br>如您本次购买的商品暂未实现电子发票开具，我们将为您更换纸质发票。
                </div>
              </el-form-item>
              <el-form-item label="发票抬头：" class="is-required">
                <span
                  class="span-info self-select-box"
                  @click="headType='0'"
                  :class="headType!='1'?'active':''"
                  style="margin-right:12px;"
                >
                  个人
                  <em data-v-5cd5f4e7 class="select-icon"></em>
                </span>
                <span
                  v-if="invoiceValueAdded"
                  class="span-info self-select-box"
                  @click="headType='1'"
                  :class="headType=='1'?'active':''"
                >
                  单位
                  <em data-v-5cd5f4e7 class="select-icon"></em>
                </span>
              </el-form-item>
              <!-- ''表示还没有填过发票信息，'0'表示默认发票信息是个人 '1'表示默认发票是单位 -->
              <div v-show="headType!='1' && invoice">
                <el-form
                  :model="invoicePersonal"
                  :rules="rules"
                  ref="invoicePersonal"
                  label-width="130px"
                >
                  <el-form-item label="抬头内容：" prop="head" class="mt15">
                    <span v-if="invoiceHeadEdit == '0'">{{invoicePersonal.head}}</span>
                    <el-input
                      v-if="invoiceHeadEdit == '1'"
                      v-model.trim="invoicePersonal.head"
                      placeholder="请输入抬头内容"
                      style="width:400px;"
                      maxlength="60"
                      :disabled="invoiceUnit? false : true"
                    ></el-input>
                    <i class="el-icon-question head-question" v-popover:headAlert></i>
                    <el-popover ref="headAlert" placement="top" title width="300" trigger="click">
                      <p>1.每个会员个人电子发票名称只允许修改三次；</p>
                      <p>2.超过三次以上，需门店服务台维护会员信息后可重新开单；</p>
                      <p>3.临时卡、单位发票抬头不受次数上限。</p>
                    </el-popover>
                  </el-form-item>
                  <el-form-item label="收票手机：" prop="mobile" class="mt15">
                    <el-input
                      type="tel"
                      v-model.trim="invoicePersonal.mobile"
                      placeholder="请输入手机号码"
                      style="width:400px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="收票邮箱：" prop="email" class="mt15">
                    <el-input
                      v-model.trim="invoicePersonal.email"
                      placeholder="用于接收电子发票及延保协议邮件"
                      style="width:400px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveInvoice('invoicePersonal')">保存发票信息</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="headType=='1' && invoice">
                <el-form
                  v-if="invoiceUnit"
                  :model="invoiceUnit"
                  :rules="rules"
                  ref="invoiceUnit"
                  label-width="130px"
                >
                  <el-form-item label="抬头内容：" prop="head" class="mt15">
                    <el-input
                      v-model.trim="invoiceUnit.head"
                      placeholder="请输入单位名称"
                      style="width:400px;"
                      maxlength="40"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="单位税号：" prop="taxpayerNo" class="mt15">
                    <el-input
                      v-model.trim="invoiceUnit.taxpayerNo"
                      placeholder="请输入单位税号"
                      style="width:400px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="收票手机：" prop="mobile" class="mt15">
                    <el-input
                      v-model.trim="invoiceUnit.mobile"
                      placeholder="请输入手机号码"
                      style="width:400px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="收票邮箱：" prop="email" class="mt15">
                    <el-input
                      v-model.trim="invoiceUnit.email"
                      placeholder="用于接收电子发票及延保协议邮件"
                      style="width:400px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveInvoice('invoiceUnit')">保存发票信息</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div v-show="invoiceType=='2'">
              <el-form
                v-if="invoiceValueAdded"
                :model="invoiceValueAdded"
                :rules="rules"
                ref="invoiceValueAdded"
                label-width="130px"
              >
                <div style="margin-top:-13px;width:100%;height:30px;">
                  <div class="div-danger2">增票资质需审核，审核成功后可开具增票</div>
                </div>
                <div style="width:100%;height:30px;">
                  <div style="margin-left:48px;float:left;line-height:27px;font-weight:600">增票资质</div>
                </div>
                <el-form-item label="单位名称：" prop="unitHead" class="mt15">
                  <el-input
                    placeholder="请输入单位名称"
                    v-model.trim="invoiceValueAdded.unitHead"
                    style="width:400px;"
                    maxlength="40"
                  ></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号：" prop="vatTaxpayerNo" class="mt15">
                  <el-input
                    placeholder="请输入纳税人识别号"
                    v-model.trim="invoiceValueAdded.vatTaxpayerNo"
                    style="width:400px;"
                  ></el-input>
                </el-form-item>
                <el-form-item label="注册地址：" prop="registeredAddress" class="mt15">
                  <el-input
                    placeholder="请输入注册地址"
                    v-model.trim="invoiceValueAdded.registeredAddress"
                    style="width:400px;"
                    maxlength="80"
                  ></el-input>
                </el-form-item>
                <el-form-item label="注册电话：" prop="registeredPhone" class="mt15">
                  <el-input
                    placeholder="请输入注册电话"
                    v-model.trim="invoiceValueAdded.registeredPhone"
                    style="width:400px;"
                    maxlength="16"
                  ></el-input>
                </el-form-item>
                <el-form-item label="开户银行：" prop="taxpayerBank" class="mt15">
                  <el-input
                    placeholder="请输入开户银行"
                    v-model.trim="invoiceValueAdded.taxpayerBank"
                    style="width:400px;"
                    maxlength="40"
                  ></el-input>
                </el-form-item>
                <el-form-item label="银行账户：" prop="bankAccount" class="mt15">
                  <el-input
                    placeholder="请输入银行账户"
                    v-model.trim="invoiceValueAdded.bankAccount"
                    style="width:400px;"
                    maxlength="32"
                  ></el-input>
                </el-form-item>
                <div style="width:100%;height:30px;">
                  <div
                    style="margin-left:36px;float:left;line-height:27px;font-size：16px;font-weight:600"
                  >收票人信息</div>
                </div>
                <el-form-item label="收票人姓名：" prop="name" class="mt15">
                  <el-input
                    placeholder="请输入收票人姓名"
                    v-model.trim="invoiceValueAdded.name"
                    style="width:400px;"
                    maxlength="50"
                  ></el-input>
                </el-form-item>
                <el-form-item label="收票人手机：" prop="vatMobile" class="mt15">
                  <el-input
                    placeholder="请输入手机号码"
                    v-model.trim="invoiceValueAdded.vatMobile"
                    style="width:400px;"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item label="收票人手机：" prop="mobile" class="mt15">
                            <el-input  placeholder="请输入手机号码" v-model.trim="invoiceValueAdded.mobile" style="width:400px;" ></el-input>
                </el-form-item>-->
                <div ref="billingAddress">
                  <el-form-item label="所住地址：" class="mt15">
                    <g-city
                      :class="{'g-city-border-color': addressIsError}"
                      v-model="cityobj"
                      @changeend="bindChangeCity"
                      :isShowcity="true"
                    ></g-city>
                  </el-form-item>
                </div>
                <el-form-item label="详细地址：" prop="address" class="mt15">
                  <el-input
                    placeholder="请输入详细地址"
                    v-model.trim="invoiceValueAdded.address"
                    style="width:400px;"
                    maxlength="25"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveInvoice('invoiceValueAdded')">保存发票信息</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-form>
        </el-dialog>
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import API from "@/api/billingPurchase/billingPurchase";
export default {
  props: {
    invoiceP: {},
    isFrontmoney: false,
    incrementAmount: "", //判断是否选中延保
    poolFlag: "", //判断是否是联营
    isAllUnSupportInvoice: ""
  },
  data() {
    //检查抬头内容
    // 1） 长度：40个字符以内（一个汉字算一个字符）（前后空格不算）
    // 2） 规则：可以为汉字、英文（大小写）、数字
    // 3） 支持各种格式小括号（）和 “空格”的输入（不限中英文格式、不限全角/半角，均可），以及“.”、“·”的输入
    // 4） 不能输入“个人”这两个字 和 emoji表情
    var checkHead = (rule, value, callback) => {
      //  alert(value)
      var that = this;
      if (value == "" || value == null) {
        return callback(new Error("请输入抬头内容"));
      } else if (value == "个人") {
        return callback(new Error("发票抬头不能是个人"));
      } else {
        // var notSpecialChat=/^[\u4e00-\u9fa5（）()a-zA-Z<>《》]*$/; //汉字（）()大小写字母<>《》
        var notSpecialChat = new RegExp(
          "^[\\uFF10-\\uFF19\\uFF41-\\uFF5A\\uFF21-\\uFF3A\\u4e00-\\u9fa5a-zA-Z0-9\\(\\)（）.·  ]+$",
          "gi"
        );
        if (!notSpecialChat.test(value)) {
          return callback(new Error("请输入正确的抬头内容"));
        } else {
          return callback();
        }
      }
    };
    //检查单位名称
    var checkUnitHead = (rule, value, callback) => {
      //alert(value)
      var that = this;
      if (value == "" || value == null) {
        return callback(new Error("请输入单位名称"));
      } else {
        var notSpecialChat = /^[\u4e00-\u9fa5（）()a-zA-Z<>《》]*$/; //汉字（）()大小写字母<>《》
        if (value.indexOf(" ") != -1 || !notSpecialChat.test(value)) {
          return callback(new Error("请输入正确的单位名称"));
        } else {
          return callback();
        }
      }
    };
    //检查单位税号
    var checkTaxpayerNo = (rule, value, callback) => {
      var that = this;
      //非数字大写英文字母
      var notUpenNum = /^[0-9|A-Z]+$/;
      var checkTax = /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/; //验证税号* 15或者18或者20位大写字母、数字组成
      if (value == "") {
        callback(new Error("请输入单位税号"));
      } else {
        if (!notUpenNum.test(value)) {
          callback(new Error("单位税号为数字和大写英文字母"));
        } else if (!checkTax.test(value)) {
          callback(new Error("单位税号为15位、18位、20位数字和大写英文字母"));
        } else {
          callback();
        }
      }
    };
    //检查纳税人识别号
    var checkvatTaxpayerNo = (rule, value, callback) => {
      var that = this;
      //非数字大写英文字母
      var notUpenNum = /^[0-9|A-Z]+$/;
      var checkTax = /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/; //验证税号* 15或者18或者20位大写字母、数字组成
      if (value == "") {
        callback(new Error("请输入纳税人识别号"));
      } else {
        if (!notUpenNum.test(value)) {
          callback(new Error("纳税人识别号为数字和大写英文字母"));
        } else if (!checkTax.test(value)) {
          callback(
            new Error("纳税人识别号为15位、18位、20位数字和大写英文字母")
          );
        } else {
          callback();
        }
      }
    };

    //检查手机号
    var checkMobile = (rule, value, callback) => {
      var that = this;
      if (value == "" || value == null) {
        callback(new Error("请输入手机号码"));
      } else {
        var reg = /^1[3,4,5,6,7,8,9]\d{9}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的手机号码"));
        } else {
          callback();
        }
      }
    };
    var checkvatMobile = (rule, value, callback) => {
      var that = this;
      if (value == "" || value == null) {
        callback();
      } else {
        var reg = /^1[3,4,5,6,7,8,9]\d{9}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的手机号码"));
        } else {
          callback();
        }
      }
    };
    //检查邮箱
    var checkEmail = (rule, value, callback) => {
      var that = this;
      if (value == "" || value == null) {
        callback(); //不加回调会报错
      } else {
        var reg = /^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的邮箱地址"));
        } else {
          callback();
        }
      }
    };
    //检查注册电话
    var checkRegisteredPhone = (rule, value, callback) => {
      var that = this;
      if (value == "" || value == null) {
        callback(new Error("请输入注册电话"));
      } else {
        var reg = /[\u4e00-\u9fa5]/; //中文
        var reg2 = /[a-zA-Z]/; //英文
        if (reg.test(value) || reg2.test(value)) {
          callback(new Error("请输入正确的注册电话"));
        } else {
          callback();
        }
      }
    };
    //检查银行账户
    var checkBankAccount = (rule, value, callback) => {
      var that = this;
      if (value == "" || value == null) {
        callback(new Error("请输入银行账户"));
      } else {
        var reg = /^[0-9]*$/;
        if (!reg.test(value) || value.indexOf(" ") != -1) {
          callback(new Error("请输入正确的银行账户"));
        } else {
          return callback();
        }
      }
    };
    return {
      rules: {
        head: [{ required: true, validator: checkHead, trigger: "blur" }],
        unitHead: [
          { required: true, validator: checkUnitHead, trigger: "blur" }
        ],
        mobile: [{ required: true, validator: checkMobile, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        taxpayerNo: [
          { required: true, validator: checkTaxpayerNo, trigger: "blur" }
        ],
        vatTaxpayerNo: [
          { required: true, validator: checkvatTaxpayerNo, trigger: "blur" }
        ],
        registeredAddress: [
          { required: true, message: "请输入注册地址", trigger: "blur" }
        ],
        registeredPhone: [
          { required: true, validator: checkRegisteredPhone, trigger: "blur" }
        ],
        taxpayerBank: [
          { required: true, message: "请输入开户银行", trigger: "blur" }
        ],
        bankAccount: [
          { required: true, validator: checkBankAccount, trigger: "blur" }
        ],
        name: [{ message: "请输入收票人姓名", trigger: "blur" }],
        vatMobile: [{ validator: checkvatMobile, trigger: "blur" }],
        address: [{ message: "请输入详细地址", trigger: "blur" }]
      },
      rulesPersonal: {},
      rulesUnit: {},
      rulesValueAdded: {},
      invoicePersonal: {},
      invoiceUnit: {},
      invoiceValueAdded: {},

      cityobj: {
        //四级区域
        aeracode1: {
          label: "",
          code: "",
          disable: false
        },
        aeracode2: {
          label: "",
          code: "",
          disable: false
        },
        aeracode3: {
          label: "",
          code: "",
          disable: false
        },
        aeracode4: {
          label: "",
          code: "",
          disable: false
        }
      },
      areaAddress: [], //四级地址 {}
      InvoiceInformatione: false,
      headType: "",
      headType2: "",
      head: "",
      mobile: "",
      email: "",
      invoiceType: "",
      invoiceType2: "",
      addressIsError: false,
      invoiceHeadEdit: "1", //控制发票抬头是个人的抬头内容修改次数， 0：不能编辑 1：可以编辑
      invoice: {}
    };
  },
  computed: {
    ...mapState([
      "billingpurchase", //大接口数据
      "billingUsedParam" //会员信息
    ])
  },
  watch: {
    invoiceP: {
      handler: function() {
        this.init();
      },
      deep: true
    }
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(["billingpurchaseInit"]),
    //保存发票
    init() {
      if (this.invoiceP) {
        this.invoice = JSON.parse(JSON.stringify(this.invoiceP)) || {};
        this.invoiceValueAdded = this.invoice.vat;
        this.invoicePersonal = this.invoice.personal;
        this.invoiceUnit = this.invoice.unit;
        this.headType = this.invoice.headType;
        this.headType2 = this.invoice.headType;
        this.invoiceType = this.invoice.invoiceType;
        if (this.invoiceType != "2") {
          if (this.headType != "1" && this.invoicePersonal) {
            this.head = this.invoicePersonal.head;
            this.mobile = this.invoicePersonal.mobile;
            this.email = this.invoicePersonal.email;
            this.invoiceHeadEdit = this.invoice.invoiceHeadEdit;
          } else if (this.headType == "1" && this.invoiceUnit) {
            this.head = this.invoiceUnit.head;
            this.email = this.invoiceUnit.email;
            this.mobile = this.invoiceUnit.mobile;
          }
        } else if (this.invoiceType == "2" && this.invoiceValueAdded) {
          this.head = this.invoiceValueAdded.unitHead;
        }

        if (this.invoice && this.invoice.vat) {
          //回显地址
          this.cityobj = {
            //四级区域
            aeracode1: {
              label: this.invoice.vat.stateName,
              code: this.invoice.vat.stateCode,
              disable: false
            },
            aeracode2: {
              label: this.invoice.vat.cityName,
              code: this.invoice.vat.cityCode,
              disable: false
            },
            aeracode3: {
              label: this.invoice.vat.countyName,
              code: this.invoice.vat.countyCode,
              disable: false
            },
            aeracode4: {
              label: this.invoice.vat.townName,
              code: this.invoice.vat.townCode,
              disable: false
            }
          };
        }
      }
    },
    saveInvoice(formName) {
      //console.log(this.invoice)
      this.$refs[formName].validate(valid => {
        var that = this;
        //处理地区错误的边框颜色的变化
        that.dealAddressBorderColor();
        if (valid) {
          var head = ""; //参数初始化为空，再根据当前是个人 还是单位 获取对应的参数
          var taxpayerNo = "";
          var mobile = "";
          var headType = "";
          var email = "";
          var registeredAddr = "";
          var registeredPhone = "";
          var taxpayerBank = "";
          var bankAccount = "";
          var vName = "";
          var vTownCode = this.invoice.vat ? this.invoice.vat.townCode : ""; //默认四级地址 this.invoice.vat.townCode ||
          var vAddress = "";
          if (that.invoiceType != "2") {
            if (that.headType != "1") {
              //判断发票是个人
              headType = "0";
              head = that.invoicePersonal.head;
              taxpayerNo = null; //因为个人发票没有单位税号 给个0的字符串为了让校验通过
              mobile = that.invoicePersonal.mobile;
              email = that.invoicePersonal.email;
            } else if (that.headType == "1") {
              //发票是单位
              headType = "1";
              head = that.invoiceUnit.head;
              taxpayerNo = that.invoiceUnit.taxpayerNo;
              mobile = that.invoiceUnit.mobile;
              email = that.invoiceUnit.email;
            }
            that.invoiceType = "1";
          } else if (that.invoiceType == "2") {
            //发票是增票
            headType = "";
            that.invoiceType = "2";
            head = that.invoiceValueAdded.unitHead;
            taxpayerNo = that.invoiceValueAdded.vatTaxpayerNo;
            mobile = that.invoiceValueAdded.vatMobile;
            email = "";
            registeredAddr = that.invoiceValueAdded.registeredAddress;
            registeredPhone = that.invoiceValueAdded.registeredPhone;
            taxpayerBank = that.invoiceValueAdded.taxpayerBank;
            bankAccount = that.invoiceValueAdded.bankAccount;
            vName = that.invoiceValueAdded.name;
            vAddress = that.invoiceValueAdded.address;
            if (that.areaAddress[3]) {
              vTownCode = that.areaAddress[3].code;
            }
          }

          //参数
          var data = {
            memberId: that.billingUsedParam.memberId, //会员卡ID
            memberCard: that.billingUsedParam.memberCard, //会员卡号
            temporaryCardFlag: that.billingUsedParam.temporaryCardFlag, //是否是临时卡
            sellerNum: that.billingUsedParam.sellerNum, //导购员编号
            storeCode: that.billingUsedParam.storeCode, //门店编码
            email: email, //电子邮箱
            invoiceMobile: mobile, //发票手机号
            taxpayerNo: taxpayerNo, //纳税人识别号
            head: head, //抬头内容
            headType: headType, //抬头类型
            siteType: that.billingUsedParam.siteType, //站点类型
            invoiceType: that.invoiceType, //发票类型
            registeredAddr: registeredAddr,
            registeredPhone: registeredPhone,
            taxpayerBank: taxpayerBank,
            bankAccount: bankAccount,
            vName: vName,
            vAddress: vAddress,
            vTownCode: vTownCode
          };
          //报存发票接口
          API.saveInvoiceToCart(data).then(data => {
            if (data.success) {
              //更新页面发票信息
              this.InvoiceInformatione = false;
              this.billingpurchaseInit(this);
              // this.init();
            } else {
              this.$message({
                message: data.respMsg,
                type: "warning"
              });
            }
          });
        }
      });
    },
    bindChangeCity(address) {
      //console.log(address)
      this.areaAddress = address;
      //console.log(address)
      var billingAddress = this.$refs.billingAddress;
      var content = billingAddress.querySelector(".el-form-item__content");
      var error = billingAddress.querySelector(".el-form-item__error");
      this.dealAddressBorderColor();
      if (content && error) {
        content.removeChild(error);
      }
    },
    dealAddressBorderColor() {
      this.addressIsError = !this.areaAddress ? true : false;
    },
    close() {
      this.InvoiceInformatione = false;
      this.billingpurchaseInit(this);
    }
  }
};
</script>
<style>
.mt {
  margin-top: 20px;
}
.mr {
  margin-right: 20px;
}
.mt20 {
  margin-top: 20px;
}
.mr10 {
  margin-right: 10px;
}
.mr20 {
  margin-right: 20px;
}
.mt15 {
  margin-top: 15px;
}
.mb10 {
  margin-bottom: 10px;
}
.font_f {
  font-family: "微软雅黑";
}
.red {
  color: #f56c6c;
}
.fl {
  float: left;
}
.span-info {
  border-color: hsla(220, 4%, 58%, 0.2);
  width: 100px;
  height: 33px;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  border: 1px solid #dcdfe6;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.div-danger {
  background-color: hsla(0, 87%, 69%, 0.1);
  border-color: hsla(0, 87%, 69%, 0.2);
  color: #606266;
  border: 1px solid rgba(64, 158, 255, 0.2);
  padding: 15px;
  margin: 0 15px 0 0;
  width: 550px;
  font-size: 13px;
  line-height: 22px;
}
.div-danger2 {
  width: 240px;
  background-color: hsla(0, 87%, 69%, 0.1);
  border-color: hsla(0, 87%, 69%, 0.2);
  color: #606266;
  border: 1px solid rgba(64, 158, 255, 0.2);
  padding: 15px;
  margin-left: 130px;
  font-size: 13px;
  line-height: 0;
}
.billInfo .el-input__inner {
  border-radius: 0;
}
.invoiceHead {
  margin-right: 20px;
  display: inline-block;
  max-width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-height: 24px;
  vertical-align: middle;
}
.head-question {
  margin-left: 5px;
  cursor: pointer;
  font-size: 20px;
}
</style>
