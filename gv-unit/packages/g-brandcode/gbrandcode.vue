<template>
    <div>
		<el-input style="width:200px" :class="{iserror:inputisError}" placeholder="请输入品牌编码" @change="doThis()" v-model.trim="form.brand"></el-input>
		<div class="el-form-item__error" v-if="inputisError">请输入数字或字母</div>
        <el-button type="text" @click="showDialog()">查看品牌编码</el-button>	
		<!--查询品牌编码弹窗 start-->
		<el-dialog title="查询品牌编码" :visible.sync="dialogGetBrandCode" class="gbrandcode-dialog">
			<el-form :inline="true" :model="formBrand" ref="formBrand" :rules="rulesFormBrand" size="mini" @submit.native.prevent>
				<el-form-item label="品牌编码或名称" prop="brandCodeOrName">
					<el-input v-model="formBrand.brandCodeOrName"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" native-type="submit"
							:loading="formBrand.loading"
							@click="getBrandCodeLists('formBrand')">查询
					</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="BrandCodeLists" v-loading="formBrand.loading" @row-click="checkedFormBrand">
				<el-table-column property="brandCode" label="品牌编码" width="200"></el-table-column>
				<el-table-column property="brandName" label="品牌" width="200"></el-table-column>
			</el-table>
			<el-pagination @current-change="handleCurrentChangeByBrandCode"
				background
				:current-page="formBrand.page.currentPage"
				:page-size="formBrand.page.pageSize"
				v-if="formBrand.page.totalPage>1"
				layout="total, prev, pager, next"
				:total="formBrand.page.totalPage">
			</el-pagination>
		</el-dialog>
      <!--查询品牌编码弹窗 end-->
    </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'g-brandcode',
    props:{
	  value: {
        required: true,
      }
    },
    data () {
      return {
				inputisError:false,
				formBrand: {
					page: {
					currentPage: 1,
					pageSize: 10,
					totalPage: 1
					}
				},
						rulesFormBrand: {
							brandCodeOrName: [
								{required: true, message: "请输入", trigger: "blur"}
							]
				},
				form:{
					brand: this.value.value, //品牌
				},
				dialogGetBrandCode:false,
				BrandCodeLists:[],
      }
    },
    created(){
      // 配置环境变量
      var  curhost = location.host;
	  	this.url = "//"+curhost+"/pcatpview";
	  
  },
    mounted () {
    },
    watch: {
			'value':{
				handler(val){
					let that=this;
					if(val.value =="reset"){
						that.form.brand = '';
						that.doThis();
					}
				},
				deep: true 
			} 
    },
    methods: {
		_initFormBrand() {
			this.BrandCodeLists = [];
			this.formBrand.brandCodeOrName = "";
			this.formBrand.loading = false;
			this.formBrand.page = {
				currentPage: 1,
				pageSize: 10,
				totalPage: 1
			};
		},
		brandcoderules(val){
			alert()
		},
		showDialog(type) {
			this._initFormBrand();
			this.dialogGetBrandCode = true;
		},
		//查询品牌编码列表
		getBrandCodeLists(formBrand) {
			this.$refs[formBrand].validate(valid => {
				if (valid) {
					this.formBrand.page.currentPage = 1;
					this.__getBrandCodeLists();
				}
			});
		},

		//查询品牌编码列表
		__getBrandCodeLists() {
			this.formBrand.loading = true;
			const _this = this;
			let	requestPara = {
					brandCodeOrName: this.formBrand.brandCodeOrName,
					currentPage: this.formBrand.page.currentPage,
					pageSize: this.formBrand.page.pageSize
				};
			axios.post(_this.url+'/queryBrandList',requestPara).then(response => {
				_this.formBrand.loading = false;
				if (response.data.success) {
					if (response.data.response) {
						const _res = response.data.response;
						_this.formBrand.page = {
							currentPage: _res.pager.currentPage,
							pageSize: _res.pager.pageSize,
							totalPage: _res.pager.totalSize
						};
						_this.BrandCodeLists = _res.list || [];
					}
				} else {
					_this.formBrand.loading = false;
					_this.BrandCodeLists = [];
				}
			});
      	},
		
		//品牌弹窗的页面点击事件
		handleCurrentChangeByBrandCode(val) {
			this.formBrand.page.currentPage = val;
			this.__getBrandCodeLists();
		},
		//关闭品牌弹窗
		checkedFormBrand(row) {
			this.form.brand = row.brandCode;
			this.dialogGetBrandCode = false;
			this.doThis(); //推给父组件

		},
		doThis() {//推给父组件
			var newRegex = /^[0-9a-zA-Z]*$/g;
			if (!newRegex.test(this.form.brand)) {
				this.inputisError = true;
				this.$emit('input', {value:'',isError:true});
				this.$emit("changeend",{brandCode:''});
				return false;	
			}else{
				this.inputisError = false;
				this.$emit('input', {value:this.form.brand,});
				this.$emit("changeend",{brandCode:this.form.brand});
			}			
		},
    }
  }
</script>
