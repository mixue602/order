// pages/joinInGome/joinInGome.js
var app = getApp();
var goHeader = app.goHeader;
var websiteUrl = ''; //不同站点请求的接口地址，有一个字段不一样，用以拼接地址
var regionUrl = app.ssUrl + '/item/v1/region/';//4级区域接口
var provinceJson = [
    { code: "11000000", label: "北京" },
    { code: "12000000", label: "天津" },
    { code: "13000000", label: "河北省" },
    { code: "14000000", label: "山西省" },
    { code: "15000000", label: "内蒙古" },
    { code: "21000000", label: "上海" },
    { code: "22000000", label: "浙江省" },
    { code: "23000000", label: "江苏省" },
    { code: "24000000", label: "安徽省" },
    { code: "25000000", label: "福建省" },
    { code: "26000000", label: "山东省" },
    { code: "31000000", label: "广东省" },
    { code: "32000000", label: "广西" },
    { code: "33000000", label: "海南省" },
    { code: "41000000", label: "湖北省" },
    { code: "42000000", label: "湖南省" },
    { code: "43000000", label: "河南省" },
    { code: "44000000", label: "江西省" },
    { code: "51000000", label: "黑龙江省" },
    { code: "52000000", label: "吉林省" },
    { code: "53000000", label: "辽宁省" },
    { code: "61000000", label: "宁夏" },
    { code: "62000000", label: "新疆" },
    { code: "63000000", label: "青海省" },
    { code: "64000000", label: "陕西省" },
    { code: "65000000", label: "甘肃省" },
    { code: "71000000", label: "四川省" },
    { code: "72000000", label: "云南省" },
    { code: "73000000", label: "贵州省" },
    { code: "74000000", label: "重庆" },
    { code: "75000000", label: "西藏" },
    { code: "81000000", label: "台湾省" },
    { code: "82000000", label: "香港" },
    { code: "83000000", label: "澳门" },
    { code: "84000000", label: "钓鱼岛" }
], province = [];//省级容器

var cityJson = [], city = [];//市级容器

var countryJson = [], country = [];//区县级容器

var streetJson = [], street = [];//乡镇级容器

var globalData = {
    loading: false,
    currentTab: 0,
    name: '',
    phoneNum: '',
    email: '',
    shopname: '',
    shoparea: '',
    shopSales: '',
    shopaddress: '',
    shopintroduce: '',
    emailErrorTipShow: false,
    nameErrorTipShow: false,
    phoneErrorTipShow: false,
    shopnameErrorTipShow: false,
    shopareaErrorTipShow: false,
    shopSalesErrorTipShow: false,
    shopaddressErrorTipShow: false,
    shopProvinceErrorTip: false,
    shopCityErrorTip:false,
    shopStreetErrorTip:false,
    shopCountryErrorTip:false,
    phoneError:0,
    emailError:0,
    emailErrorTip: "*请输入电子邮箱",
    nameErrorTip: "*请输入您的姓名",
    phoneErrorTip: "*请输入手机号码",
    shopnameErrorTip: "*请输入店铺名称",
    shopareaErrorTip: "*请输入店铺面积（平米）",
    shopSalesErrorTip: "*请输入年均销售额度（万元）",
    shopaddressErrorTip: "*店铺详细地址",
    shopIntroduceTip: "简要说明",
    province: ["北京", "天津", "河北省", "山西省", "内蒙古", "上海", "浙江省", "江苏省", "安徽省", "福建省", "山东省", "广东省", "广西", "海南省", "湖北省", "湖南省", "河南省", "江西省", "黑龙江省", "吉林省", "辽宁省", "宁夏", "新疆", "青海省", "陕西省", "甘肃省", "四川省", "云南省", "贵州省", "重庆", "西藏", "台湾省", "香港", "澳门", "钓鱼岛"],
    provinceJson: [{ code: "", label: "*店铺所属省份地区" }],
    provinceIndex: 0,
    provinceFlag: true,

    city: [],//市
    cityJson: [{ code: "", label: "*店铺所属市辖地区" }],
    cityIndex: 0,
    cityFlag: false,

    country: [],//区
    countryJson: [{ code: "", label: "*店铺所在地区" }],
    countryIndex: 0,
    countryFlag: false,

    street: [],//乡镇
    streetJson: [{ code: "", label: "*店铺所在街道" }],
    streetIndex: 0,
    streetFlag: false,
    provinceCode: "",//省code
    cityCode: "",//市code
    countyCode: "",//区、县code
    townCode: "",//乡、镇code
};

Page({
    data: { 
        ...globalData
    },
    onLoad:function(){
        var that = this;
        that.setData(globalData); 
    },
    clickTab: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current,
            })
        }
    },
    // 校验姓名
    checkname:function(e){
        var that = this;
        if (!e.detail.value || (e.detail.value.split(" ").join("").length === 0)){
            that.setData({
                nameErrorTipShow: true,
                name: ''
            })
            
        }else{
            this.setData({
                name: e.detail.value.replace(/ /g, '')
            });
        }
    },
    // 校验邮箱
    checkemail:function(e){
        var that = this;
        var reg = /^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/;
        if (!e.detail.value) {
            that.setData({
                emailErrorTipShow: true,
                email: '',
            });
        }else if (!reg.test(e.detail.value)) {
            wx.showToast({
                title: '请输入正确的邮箱格式，如 usename@163.com',
                icon: 'none',
                duration: 1000,
                success: function () {
                    that.setData({
                        emailError: 1,
                        email: e.detail.value,
                    });
                }
            })
        }else{
            this.setData({
                email: e.detail.value,
                emailError: 0,
            });   
        }
    },
    // 校验手机
    checkphone:function(e){
        var that = this;
        var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (!e.detail.value){
            that.setData({
                phoneErrorTipShow: true,
                phoneNum: '',
                phoneError: 0,
            });
        }else if (!reg.test(e.detail.value)) {
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 1000,
                success: function () {
                    that.setData({
                        phoneError: 1,
                        phoneNum: e.detail.value,
                    });
                }
            })
            

        }else {
            this.setData({
                phoneNum: e.detail.value,
                phoneError: 0,
            });
        } 
    },
    // 校验店铺名称
    checkShopname: function (e) {
        var that = this;
        if (!e.detail.value || (e.detail.value.split(" ").join("").length === 0)) {
            that.setData({
                shopnameErrorTipShow: true,
                shopname: ''
            })
        }else {
            this.setData({
                shopname: e.detail.value
            });
        } 
    },
    // 校验店铺面积
    checkShoparea: function (e) {
        var that = this;
        var reg = /^[0-9]+(.[0-9]+)?$/;
        if (!e.detail.value){
            that.setData({
                shopareaErrorTipShow: true,
                shoparea: ''
            })
        } else if (!reg.test(e.detail.value)){
            that.setData({
                shopareaErrorTipShow: true,
                shoparea: '',
                shopareaErrorTip:"*请输入数字",
            })
        } else {
            this.setData({
                shoparea: e.detail.value
            });
        }
    },
    // 校验销售额
    checkShopSales: function (e) {
        var that = this;
        var reg = /^[0-9]+(.[0-9]+)?$/;//shopSalesErrorTip
        if (!e.detail.value){
            that.setData({
                shopSalesErrorTipShow: true,
                shopSales: ''
            })
        } else if (!reg.test(e.detail.value)) {
            that.setData({
                shopSalesErrorTipShow: true,
                shopSales: '',
                shopSalesErrorTip: "*请输入数字",
            })
        } else {
            this.setData({
                shopSales: e.detail.value
            });
        }
    },
    // 校验详细地址
    checkShopaddress: function (e) {
        var that = this;
        if (!e.detail.value || (e.detail.value.split(" ").join("").length === 0)) {
            that.setData({
                shopaddressErrorTipShow: true,
                shopaddress: ''
            })
        } else {
            this.setData({
                shopaddress: e.detail.value
            });
        }
    },
    //简要说明
    checkIntroduce:function(e){
        this.setData({
            shopintroduce: e.detail.value
        });
    },
    bindPickerProvince: function (e) {
        var that = this;
        this.setData({
            city: [],
            country: [],
            street: [],
            provinceJson: provinceJson,
            provinceIndex: e.detail.value,
            shopProvinceErrorTip: false,
        });

        //请求市级
        wx.request({
            url: regionUrl + that.data.provinceJson[that.data.provinceIndex].code + "/2/flag/item_web/",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            complete: function (res) {
                cityJson = res.data.result.division;
                city = [];//清空
                for (var i = 0; i < cityJson.length; i++) {
                    city.push(cityJson[i].label);
                }
                that.setData({
                    city: city,
                    cityJson: [{ code: "", label: "*店铺所属市辖地区" }],
                    cityIndex: 0,
                    countryJson: [],
                    streetJson: [],
                    cityFlag: true,
                    countryFlag: false,
                    streetFlag: false
                });
            }
        });
    },
    bindPickerCity: function (e) {
        var that = this;
        this.setData({
            country: [],
            street: [],
            city: city,
            cityJson: cityJson,
            cityIndex: e.detail.value,
            shopCityErrorTip: false,
        });
        //请求区/县级
        wx.request({
            url: regionUrl + that.data.cityJson[that.data.cityIndex].code + "/3/flag/item_web/",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            complete: function (res) {
                countryJson = res.data.result.division;
                country = [];
                for (var i = 0; i < countryJson.length; i++) {
                    country.push(countryJson[i].label);
                }
                that.setData({
                    country: country,
                    countryJson: [{ code: "", label: "*店铺所在地区" }],
                    countryIndex: 0,
                    streetJson: [],
                    countryFlag: true,
                    streetFlag: false
                });
            }
        });
    },
    bindPickerCountry: function (e) {
        var that = this;
        this.setData({
            street: [],
            country: country,
            countryJson: countryJson,
            countryIndex: e.detail.value,
            shopCountryErrorTip: false,
        });
        //请求乡镇级
        wx.request({
            url: regionUrl + that.data.countryJson[that.data.countryIndex].code + "/4/flag/item_web/",
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            complete: function (res) {
                streetJson = res.data.result.division;
                street = [];
                for (var i = 0; i < streetJson.length; i++) {
                    street.push(streetJson[i].label);
                }
                that.setData({
                    street: street,
                    streetJson: [{ code: "", label: "*店铺所在街道" }],
                    streetIndex: 0,
                    streetFlag: true
                });
            }
        });
    },
    bindPickerStreet: function (e) {
        var that = this;
        this.setData({
            street: street,
            streetJson: streetJson,
            streetIndex: e.detail.value,
            shopStreetErrorTip: false,
        });

    },
    //提交信息
    confirmCheck: function () {
        var that = this;
        wx.hideToast();      
        if (this.data.name == "" || !(/^[\u4e00-\u9fa5A-Za-z0-9-_]*$/.test(this.data.name))) {
            wx.showModal({
                content: "请输入您的姓名",
                showCancel:false,
                confirmText:"关闭",
                confirmColor:"#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            nameErrorTipShow: true,
                            name: ''
                        })
                    }
                }
            });
            return false;
        }else if (this.data.phoneNum == "" || !(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.data.phoneNum)) ) {//验证手机号
            if (this.data.phoneNum == ""){
                var newData = {
                    phoneErrorTipShow: true,
                    phoneNum: '',
                };
            }else{
                var newData = {
                    phoneError: 1,
                    phoneNum: this.data.phoneNum,
                };
            }
            wx.showModal({
                content: '请输入正确的手机号',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({...newData});
                    }
                }
            });
            return false;
        }else if (this.data.email == "" || !(/^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/.test(this.data.email))) {//验证邮箱
            if (this.data.email == "") {
                var newData = {
                    emailErrorTipShow: true,
                    email: '',
                };
            } else {
                var newData = {
                    emailError: 1,
                    email: this.data.email,
                };
            }
            wx.showModal({
                content: '请输入正确的邮箱格式，如 usename@163.com',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            ...newData
                        });
                    }
                }
            });
            return false;
        } else if (this.data.shopname == "") {//验证店铺名称
            wx.showModal({
                content: '请输入店铺名称',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if(res.confirm) {
                        that.setData({
                            shopnameErrorTipShow: true,
                            shopname: '',
                        });
                    }
                }
            });
            return false;//email
        }else if (this.data.shoparea == "" || !(/^[0-9]+(.[0-9]+)?$/.test(this.data.shoparea))) {//验证店铺面积
            wx.showModal({
                content: '请输入店铺面积',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            shopareaErrorTipShow: true,
                            shoparea: '',
                        });
                    }
                }
            });
            return false;//email
        }else if (this.data.shopSales == "" || !(/^[0-9]+(.[0-9]+)?$/.test(this.data.shopSales))) {//验证销售额
            wx.showModal({
                content: '请输入年均销售额度（万元）',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            shopSalesErrorTipShow: true,
                            shopSales: '',
                        });
                    }
                }
            });
            return false;
        }else if (this.data.provinceJson[0].code == "") {
            wx.showModal({
                content: '请选择店铺所属省份地区',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            shopProvinceErrorTip: '1',
                        });
                    }
                }
            });
            return false;
        }else if (this.data.cityJson[0].code == "") {
            wx.showModal({
                content: '请选择店铺所属市辖地区',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            shopCityErrorTip: '1',
                        });
                    }
                }
            });
            return false;
        }else if (this.data.countryJson[0].code == "") {
            wx.showModal({
                content: '请选择店铺所在地区',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            shopCountryErrorTip: '1',
                        });
                    }
                }
            });
            return false;
        }else if (this.data.streetJson[0].code == "") {
            wx.showModal({
                content: '请选择店铺所在街道',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            shopStreetErrorTip: '1',
                        });
                    }
                }
            });
            return false;
        }else if (this.data.shopaddress == "" || !(/^[\u4E00-\u9FFF|0-9\-|a-z|A-Z|\s|#\{\}\(\)\[\],\.。，（）｛｝【】\|]+$/.test(this.data.shopaddress))) {
            wx.showModal({//只允许：非英文、数字、汉字、井号（#）、大中小括弧、逗号、句号、分隔符（|）、点
                content: '请填写符合格式的详细地址',
                showCancel: false,
                confirmText: "关闭",
                confirmColor: "#02BB00",
                success(res) {
                    if (res.confirm) {
                        that.setData({
                            shopaddressErrorTipShow: true,
                            shopaddress: '',
                        });
                    }
                }
            });
            return false;
        }
        var data ={
            name : that.data.name,
            phone : that.data.phoneNum,
            email : that.data.email,
            shop_name : that.data.shopname,
            shop_area : that.data.shoparea,
            sales_volume : that.data.shopSales,
            provinces: that.data.provinceJson[that.data.provinceIndex].label,
            city: that.data.cityJson[that.data.cityIndex].label,
            area: that.data.countryJson[that.data.countryIndex].label,
            county: that.data.streetJson[that.data.streetIndex].label,
            address : that.data.shopaddress,
            introduce : that.data.shopintroduce,
            source : 3
        };
        wx.request({
            url: app.joinusUrl,
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            method: 'POST',
            data: data,
            complete: function (res) {
                if (res.data.code == "200") {//成功
                    wx.showModal({
                        content: '提交成功，期待与您合作',
                        showCancel: false,
                        confirmText: "关闭",
                        confirmColor: "#02BB00",
                        success(res) {
                            if (res.confirm) {
                                that.onLoad();
                            }
                        }
                    });
                    return false;
                }
            }
        });
    },
})