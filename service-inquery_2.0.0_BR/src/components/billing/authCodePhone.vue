<template>
	<div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
				<el-form-item v-if="from == 2">
					<p>会员手机号：{{this.peratorPhoneCheckData.phone}}</p>
					<p>卡内余额：¥{{this.peratorPhoneCheckData.surplusAmount ? this.peratorPhoneCheckData.surplusAmount.toFixed(2) : 0.00}}</p>
				</el-form-item>
				<el-form-item v-if="from == 1" label="" prop="phone">
					<el-input  placeholder="请输入会员手机号码" maxlength="11" style="width:240px;" v-model="ruleForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="" prop="code">
					<el-input  placeholder="请输入手机短信验证" style="width:240px;" class="mr10" v-model="ruleForm.code" ></el-input>
					<el-button plain round v-if="isShowCountdown" class="count">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{count}} s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
					<el-button plain round v-if="!isShowCountdown" @click="getIdentifyingCode()">获取验证码</el-button>
				</el-form-item>
				<el-form-item  style="text-align: center; margin-top: 20px;">
						<el-button type="primary" @click="bindConfirm('ruleForm')">确定</el-button>
						<el-button @click="bindClose">取消</el-button>
				</el-form-item>
			</el-form>
  </div>
</template>

<script>
	import { mapActions, mapState, mapMutations } from 'vuex';
	import API from '@/api/billing/billing';  
  export default {
    props: {
			from: {//来自哪个组件的调用，1表示绑定运营商手机号，2表示校验使用运营商
				default: 1,
				type: Number
			},
			peratorPhoneCheckData: {
				default: null,
				type: Object
			},
			pBindMobile: {
				default: '',
				type: String
			}
    },
    components:{
    },
    computed:{
			...mapState([
        'billingUsedParam'
			]),
			useParams() {
				return  {
							...this.billingUsedParam,
							customerType: this.billingUsedParam.temporaryCardFlag ? 2 : 1,
							customerId: this.billingUsedParam.memberId,
							smsSource: this.from,
							businessType: this.billingUsedParam.siteType
					}
			}
    },
    data() {
			var checkPhone = function(rule, value, callback) {
				var reg = /^(1[34578]\d{9})|(19[89]\d{8})|(166\d{8})$/;
				if(!(reg.test(value))) {
					callback(new Error('请输入正确的手机号码'));
				}else {
					 callback();
				}
			}

			var checkCode = function(rule, value, callback) {
				var reg = /^[\dA-Za-z]+$/;
				if(!(reg.test(value))) {
					callback(new Error('请输入正确的验证码'));
				}else {
					 callback();
				}
			}
      return {
          isShowCountdown: false,
					count: 0,
					timeCount: 60,
					timer: 0,
					ruleForm: {
						phone: this.pBindMobile || '',
						code: '',
					},
					rules: {
						phone: [
							{ required: true, message: '手机号不能为空', trigger: 'blur' },
							{ validator: checkPhone, trigger: 'blur' }
						],
						code: [
							{ required: true, message: '验证码不能为空', trigger: 'blur' },
							{ validator: checkCode, trigger: 'blur' }
						]
					}
      };
    },
    methods: {
			...mapActions([
        'initOrder', 
      ]),
      bindClose() {
				this.$emit('deal-protoco-phone',{
					isConfirm: false
				});
      },
      bindConfirm(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
          if (valid) {
						that.dealValidMsg();
          } 
        });
			},
			
			dealValidMsg() {
				let that = this;
				let params = {
						...this.useParams,
						mobile: that.ruleForm.phone,
						msg: that.ruleForm.code
				};
				API.validMsg(params).then((data) => {
					if(data.success) {
						return params;
					}else {
						that.ajaxMessageTip(data.respMsg);
						return false;
					}
				}).then(data => {
						if(!data) {
							return false;
						}
						if(this.from == 2) {
							that.$emit('deal-protoco-phone', {
								isConfirm: true
							});
						}else {//处理绑卡
							that.dealBindMobile(data);
						}
				})
			},





			dealBindMobile(params) {
				let that = this;
				
				params.invokeFrom = 'pc_cart';
				API.bindMobile(params).then((data) => {
					if(data.success) {
						that.initOrder(that);
						that.$emit('deal-protoco-phone', {
							isConfirm: true
						});
					}else {
						that.ajaxMessageTip(data.respMsg);
					}
				})
				
			},
			
			// 获取短信验证码
      getIdentifyingCode() {
				let that = this,
						cardType = '';
				if(this.from == 1) {
					var reg = /^(1[34578]\d{9})|(19[89]\d{8})|(166\d{8})$/;
					if(!(reg.test(that.ruleForm.phone))) {
						this.$refs.ruleForm.validateField('phone');
						return false;
					}
				}
				if(this.timer) {
					return false;
				}
				if(this.from == 2) {
					this.ruleForm.phone = this.peratorPhoneCheckData.phone;
					cardType = this.peratorPhoneCheckData.cardType;
				}
				let params = {
					...this.useParams,
					mobile: that.ruleForm.phone,
					cardType: cardType
				};
				
				API.sendMsg( params).then((data) => {
          if(data.success) {
            
						that.isShowCountdown = true;
						that.count = that.timeCount;
						that.timer = setInterval(() => {
							that.count--;
							if(that.count <=0) {
								that.isShowCountdown = false;
								clearInterval(that.timer);
								that.timer = 0;
							}
						}, 1000)
          }else {
            that.ajaxMessageTip(data.respMsg);
          }
        })
				
				
			},
			//接口错误提示
      ajaxMessageTip(str) {
        this.$message({
          showClose: true,
          message: str,
          type: 'warning'
        });
      }

		},
		watch: {
			pBindMobile: {
        handler: function () {
					this.ruleForm.phone = this.pBindMobile || '';
        },
        deep: true
      }
		}
  };
</script>
<style>
	.billing-container .protoco-phone-box .el-input {
		margin-bottom: 0;
	}
</style>
<style lang="stylus"  scoped>
    .mb10 {
        margin-bottom: 20px;
    }
    .mr10 {
        margin-right: 10px;
    }
    .protoco-phone-box {

    }
    
</style>
