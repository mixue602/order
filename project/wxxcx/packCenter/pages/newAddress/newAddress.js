var app = getApp();
var goHeader = app.goHeader;
var websiteUrl = ''; //不同站点请求的接口地址，有一个字段不一样，用以拼接地址
var regionUrl = app.ssUrl + '/item/v1/region/';//4级区域接口
var provinceJson = [
    {code:"11000000",label:"北京"},
    {code:"12000000",label:"天津"},
    {code:"13000000",label:"河北省"},
    {code:"14000000",label:"山西省"},
    {code:"15000000",label:"内蒙古"},
    {code:"21000000",label:"上海"},
    {code:"22000000",label:"浙江省"},
    {code:"23000000",label:"江苏省"},
    {code:"24000000",label:"安徽省"},
    {code:"25000000",label:"福建省"},
    {code:"26000000",label:"山东省"},
    {code:"31000000",label:"广东省"},
    {code:"32000000",label:"广西"},
    {code:"33000000",label:"海南省"},
    {code:"41000000",label:"湖北省"},
    {code:"42000000",label:"湖南省"},
    {code:"43000000",label:"河南省"},
    {code:"44000000",label:"江西省"},
    {code:"51000000",label:"黑龙江省"},
    {code:"52000000",label:"吉林省"},
    {code:"53000000",label:"辽宁省"},
    {code:"61000000",label:"宁夏"},
    {code:"62000000",label:"新疆"},
    {code:"63000000",label:"青海省"},
    {code:"64000000",label:"陕西省"},
    {code:"65000000",label:"甘肃省"},
    {code:"71000000",label:"四川省"},
    {code:"72000000",label:"云南省"},
    {code:"73000000",label:"贵州省"},
    {code:"74000000",label:"重庆"},
    {code:"75000000",label:"西藏"},
    {code:"81000000",label:"台湾省"},
    {code:"82000000",label:"香港"},
    {code:"83000000",label:"澳门"},
    {code:"84000000",label:"钓鱼岛"}
],province = [];//省级容器

var cityJson = [],city = [];//市级容器

var countryJson = [],country = [];//区县级容器

var streetJson = [],street = [];//乡镇级容器

Page({
    data: {
        province: [],//省
        provinceJson: [],
        provinceIndex: 0,
        provinceFlag:true,

        city: [],//市
        cityJson: [],
        cityIndex: 0,
        cityFlag:false,

        country: [],//区
        countryJson: [],
        countryIndex: 0,
        countryFlag:false,

        street: [],//乡镇
        streetJson: [],
        streetIndex: 0,
        streetFlag:false,

        name:"",//名字
        number:"",//手机号
        address:"",//详细地址
        provinceCode:"",//省code
        cityCode:"",//市code
        countyCode:"",//区、县code
        townCode:"",//乡、镇code

        checked:0, //是否为默认地址 默认为不是默认地址

        loading: true

    },
    
    _ourHost: app.ourHostCart,

     _scn:'',
    onLoad: function(options) {
        var that = this;
        websiteUrl = app.getCartWebsite(this._ourHost);
        that.init();
    },

    /**
     * @description 初事化数据<br />
     * @method init
     * @since 2017-01-20
     * @author liusuling
     */
    init: function() {
        var that = this;
        that._scn = app.getScn();
        this.setData({
            province: ["北京", "天津", "河北省", "山西省","内蒙古","上海","浙江省","江苏省","安徽省","福建省","山东省","广东省","广西","海南省","湖北省","湖南省","河南省","江西省","黑龙江省","吉林省","辽宁省","宁夏","新疆","青海省","陕西省","甘肃省","四川省","云南省","贵州省","重庆","西藏","台湾省","香港","澳门","钓鱼岛"],
            provinceJson:[{code:"",label:"-- 请选择 --"}],
            city: [],
            cityJson:[],
            country: [],
            countryJson:[],
            street: [],
            streetJson:[],
            loading:false
        });
    },
    bindPickerProvince: function(e) {
        var that = this;

        this.setData({
            city: [],
            country:[],
            street:[],
            provinceJson: provinceJson,
            provinceIndex: e.detail.value
        });
        //请求市级
        wx.request({
            url: regionUrl+that.data.provinceJson[that.data.provinceIndex].code+"/2/flag/item_web/",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader
            },
            complete: function(res) {
                cityJson = res.data.result.division;
                city = [];//清空
                for(var i=0 ;i<cityJson.length; i++){
                    city.push(cityJson[i].label);
                }
                that.setData({
                    city: city,
                    cityJson:[{code:"",label:"-- 请选择 --"}],
                    cityIndex:0,
                    countryJson:[],
                    streetJson:[],
                    cityFlag:true,
                    countryFlag:false,
                    streetFlag:false
                });

            }
        });
    },
    bindPickerCity: function(e) {
        var that = this;
        this.setData({
            country:[],
            street:[],
            city: city,
            cityJson: cityJson,
            cityIndex: e.detail.value
        });
        //请求区/县级
        wx.request({
            url: regionUrl+that.data.cityJson[that.data.cityIndex].code+"/3/flag/item_web/",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader
            },
            complete: function(res) {
                countryJson = res.data.result.division;
                country = [];
                for(var i=0 ;i<countryJson.length; i++){
                    country.push(countryJson[i].label);
                }
                that.setData({
                    country: country,
                    countryJson:[{code:"",label:"-- 请选择 --"}],
                    countryIndex:0,
                    streetJson:[],
                    countryFlag:true,
                    streetFlag:false
                });
            }
        });
    },
    bindPickerCountry: function(e) {
        var that = this;
        this.setData({
            street:[],
            country: country,
            countryJson: countryJson,
            countryIndex: e.detail.value
        });
        //请求乡镇级
        wx.request({
            url: regionUrl+that.data.countryJson[that.data.countryIndex].code+"/4/flag/item_web/",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader
            },
            complete: function(res) {
                streetJson = res.data.result.division;
                street = [];
                for(var i=0 ;i<streetJson.length; i++){
                    street.push(streetJson[i].label);
                }
                that.setData({
                    street: street,
                    streetJson:[{code:"",label:"-- 请选择 --"}],
                    streetIndex:0,
                    streetFlag:true
                });
            }
        });
    },
    bindPickerStreet: function(e) {
        var that = this;
        this.setData({
            street: street,
            streetJson: streetJson,
            streetIndex: e.detail.value
        });

    },
    checkName: function(e){
        this.setData({
            name:e.detail.value
        });
    },
    checkNumber: function(e){
        this.setData({
            number:e.detail.value
        });
    },
    getAddress: function(e){
        this.setData({
            address:e.detail.value
        });
    },
    //是否为默认
    checkRadio:function(e){
        if(this.data.checked == 0){
            this.setData({
                checked : 1
            });
        }else{
            this.setData({
                checked : 0
            });
        }
    },

    //确认添加地址
    confirmCheck:function(){
        var that = this;//只允许输入只能中英文，数字，下划线，减号 不能空格
        if(this.data.name == "" || !(/^[\u4e00-\u9fa5A-Za-z0-9-_]*$/.test(this.data.name))){
            wx.showToast({
                title: '请输入正确的收货人姓名',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(!(/^1[3456789]\d{9}$/.test(this.data.number))){//验证手机号
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(this.data.provinceJson[0].code == ""){
            wx.showToast({
                title: '请选择正确的省份',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(this.data.cityJson[0].code == ""){
            wx.showToast({
                title: '请选择正确的市',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(this.data.countryJson[0].code == ""){
            wx.showToast({
                title: '请选择正确的区/县',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(this.data.streetJson[0].code == ""){
            wx.showToast({
                title: '请选择正确的乡/镇',
                icon: 'loading',
                duration: 2000
            });
            return false;
        }else if(this.data.address == "" || !(/^[\u4E00-\u9FFF|0-9\-|a-z|A-Z|\s|#\{\}\(\)\[\],\.。，（）｛｝【】\|]+$/.test(this.data.address))){
            wx.showToast({
                title: '请填写符合格式的详细地址',
                icon: 'loading',
                duration: 2000
            });
            return false;
        }
        var checkName = that.data.name,
            checkAddress = that.data.address,
            checkMobile = that.data.number,
            checkProvince = that.data.provinceJson[that.data.provinceIndex].code,
            checkCity = that.data.cityJson[that.data.cityIndex].code,
            checkCounty = that.data.countryJson[that.data.countryIndex].code,
            checkTown = that.data.streetJson[that.data.streetIndex].code,
            checkType = that.data.checked
        wx.request({
            url:websiteUrl+"/api/consignee/addAddress",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader,
                'Cookie':'SCN='+that._scn
            },
            data:{
                name:checkName,
                address:checkAddress,
                mobile:checkMobile,
                province:checkProvince,
                city:checkCity,
                county:checkCounty,
                town:checkTown,
                type:checkType
            },
            method:'GET',
            success:function(res){
                if(res.data.errCode && res.data.errCode == "007002007"){//地址已存在
                    wx.showToast({
                        title: res.data.errMsg,
                        icon: 'loading',
                        duration: 1000
                    });
                    return false;
                }else{
                    wx.navigateBack({
                        delta: 1
                    });
                }
            }
        });
    }
})