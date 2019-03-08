<template>
<div class="jiupi-center">
    <div class="userinfo">
      <p class="info-title">个人信息</p>
      <form class="info-content">
        <div class="info-group">
          <label>店铺名称：</label>
          <div class="w-52 inline pre">
            <input class="input" type="text" :class="{'input-error': error.companyError}" v-model="userInfo.companyName" @focus="inputError('companyError')">
            <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.companyError">
          </div>
          <div class="userinfo-error">
              <span>{{error.companyError}}</span>
            </div>
        </div>
        <div class="info-group">
          <label>手机号码：</label>
          <div class="w-52 inline">
            <div class="mobileNo clearfix">
              <p>{{mobileNo}}</p>
              <router-link to="/myOrderEntry/changeMobile" class="frt">修改</router-link>
            </div>
          </div>
        </div>
        <div class="info-group">
          <label>真实姓名：</label>
          <div class="w-52 inline pre">
            <input class="input" type="text" :class="{'input-error': error.nameError}" v-model="userInfo.userName" @focus="inputError('nameError')">
            <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.nameError">
          </div>
          <div class="userinfo-error">
              <span>{{error.nameError}}</span>
            </div>
        </div>
        <div class="info-group">
          <label>性别：</label>
          <div class="w-52 inline relative">
            <div v-for="(item,index) in radioList" :key="item.name" class="inline">
              <span
                class="radio"
                :class="{'radio-select': item.check}"
                @click="selectSex(index)"
              >
                <div></div>
              </span>
              <span class="radio-name">{{item.name}}</span>
            </div>
          </div>
        </div>
        <!-- <div class="info-group">
          <label>出生日期：</label>
          <div class="w-52 inline">
            <input class="input" type="date" v-model="userInfo.birthday">
          </div>
        </div> -->
        <div class="info-group">
          <label>出生日期：</label>
          <div class="w-52 inline">
            <el-date-picker 
            class="select-birthday"
            type="date"
            placeholder="选择日期"
            v-model="userInfo.birthday"
            :editable="false"
            :clearable="false"></el-date-picker>
          </div>
        </div>
        <!-- <div class="info-group">
          <label>所在地区：</label>
          <div class="w-52 inline info-address">
            <addressSelect @changeAddress="changeAddress" :user-info="userInfo"></addressSelect>
          </div>
        </div> -->
        <div class="info-group">
          <label>地址：</label>
          <div class="w-50 w-52 inline pre">
            <input class="input address-disabled" type="text" :class="{'input-error': error.detailAddressError}" v-model="address" disabled="true" @focus="inputError('detailAddressError')">
            <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.detailAddressError">
          </div>
          <div class="userinfo-error">
            <span>{{error.detailAddressError}}</span>
          </div>
        </div>
        <div class="info-group">
          <div>
            <label>营业执照号码：</label>
            <div class="w-50 w-52 inline pre">
              <input class="input" type="text" :class="{'input-error': error.businessLicenseError}" v-model="userInfo.businessLicense" @focus="inputError('businessLicenseError')">
              <img class="businessLicense-img cs" src="../../assets/images/canotUse.png" alt="" @click="businessWarning = true">
            </div>
            <div class="userinfo-error">
              <span>{{error.businessLicenseError}}</span>
            </div>
          </div>
          <div>
            <label></label>
            <div class="w-52 inline relative">
              <img
                src="../../assets/images/icon_clear.png"
                class="business-clear"
                v-if="userInfo.licenseImgUrl"
                @click="clearImg"
              >
              <img
                :src="userInfo.licenseImgUrl"
                class="business-img"
                v-if="userInfo.licenseImgUrl"
              >
              <div class="business-select" v-if="!userInfo.licenseImgUrl">
                <el-upload ref="upload"
                  :class="{disabled:fileList.length>0}"
                  action=""
                  :auto-upload="false"
                  accept="image/png,image/gif,image/jpg,image/jpeg"
                  list-type="picture-card"
                  :limit="1"
                  :on-change = "fileChange"
                  :before-upload="beforeupload">
                  <i class="el-icon-plus"></i>
                  <div slot="tip" class="el-upload__tip">&nbsp;</div>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
        <div class="info-group">
          <label></label>
          <a href="javascript:;" class="info-change" @click="submitInfo">保存</a>
          <router-link to="/myOrderEntry/userInfo" class="info-change cancel">取消</router-link>
        </div>
      </form>
      <el-dialog title="营业执照号说明" width="480px" center :visible.sync="businessWarning">
        <div class="business-warning">
        <p class="c-3 fz16">什么是营业执照号/统一社会信用代码？</p>
        <p class="c-3 fz14">营业执照是工商行政管理机关发给工商企业、个体经营者的准许从事某项生产经营活动的凭证。</p>
        <p class="c-3 fz14">统一社会信用代码，是一组长度为18位的用于法人和其他组织身份识别的代码。统一社会信用代码由国家标准委发布。2015年10月1日起，国家启动将企业依次申请的工商营业执照、组织机构代码和税务登记证三证合为一证，并将三证号码合并为统一社会信用代码。目前大部分企业均已完成合并，另有少部分企业其营业执照仍然有效。</p>
        <div class="cs" @click="businessWarning = false">我知道了</div>
        </div>
    </el-dialog>
    </div>
</div>
</template>
<script>
import addressSelect from "@/components/addressSelect";
import * as usercenter from "@/api/usercenter/usercenter";
import * as FindService from "@/api/complainSuggestion/complainSuggestion";
export default {
  name: "editUserinfo",
  components: {
    addressSelect,
  },
  data() {
    return {
      userInfo: {
        userName: "",
        gender: "",
        birthday: "",
        companyName: "",
        detailAddress: "",
        province: "",
        city: "",
        county: "",
        street: "",
        businessLicense: "",
        licenseImgUrl: ""
      },
      mobileNo: "",
      address: "",
      fileList: [],
      error: {
        nameError: "",
        companyError: "",
        detailAddressError: "",
        businessLicenseError: ""
      },
      checkVisibles: false,
      editUserinfo: true,
      businessWarning: false,
      radioList: [
        {
          name: "男",
          check: false
        },
        {
          name: "女",
          check: false
        },
        {
          name: "保密",
          check: false
        }
      ]
    };
  },
  created() {
    usercenter.getUserInfo().then(res => {
      let data = res.data;
      this.userInfo.userName = data.userName;
      this.mobileNo = data.mobileNo;
      if (data.gender) {
        this.radioList.forEach( item => {
          if(item.name == data.gender){
            item.check=true;
          }
        })
      }else {
        this.radioList[2].check = true;
      }
      this.userInfo.birthday = data.birthday;
      this.userInfo.companyName = data.companyName;
      this.userInfo.gender = data.gender;
      this.userInfo.detailAddress = data.detailAddress;
      this.userInfo.province = data.province;
      this.userInfo.city = data.city;
      this.userInfo.county = data.county;
      this.userInfo.street = data.street;
      this.userInfo.businessLicense = data.businessLicense;
      this.userInfo.licenseImgUrl = data.businessLicenseUrl;
      this.userInfo.userDisplayClassId = data.userDisplayClassId;
      this.address = data.province+data.city+data.county+data.street+data.detailAddress;
    });
  },
  methods: {
    fileChange(file,fileList){
      this.fileList = fileList;
    },
  	beforeupload(file) {
				// 如果file不是File对象的实例，则不需要处理Md5
				if(file.size == undefined) {
					success("");
					return;
        }
        console.log(this.fileList)
				var that = this;
				that.sliceSize = 1024 * 1024
				that.slice = File.prototype.slice
				var fileReader = new FileReader();
				var spark = new SparkMD5.ArrayBuffer();
				var chunks = Math.ceil(file.size / this.sliceSize);
				var currentChunk = 0;
				// 每块文件读取完毕之后的处理
				fileReader.onload = function(e) {
					// 每块交由sparkMD5进行计算
					spark.append(e.target.result);
					that.contentMd5 = spark.end();
					that.upLoadImg(that.contentMd5, file)

				};
				// 处理单片文件的上传
				function loadNext() {
					var start = currentChunk * that.sliceSize;
					var end = start + that.sliceSize >= file.size ? file.size : start + that.sliceSize;

					fileReader.readAsArrayBuffer(that.slice.call(file, start, end));
				}
				loadNext();
			},
			//上传文件
			upLoadImg(md5File, file) {
				let arr = file.name.split('.')
				let name = md5File + "." + arr[arr.length-1]
				let params = {
					contentMd5: md5File,
					contentType: file.type,
					key: name,
					date: '',
					putPolicy: '',
					method: 'PUT',
					fileType: 0
				}
				FindService.getAuthorization(params).then(res => {
					if(res.success) {
					this.userInfo.licenseImgUrl = res.data.fileUrl
					this.postUrl =  res.data.folderName + '/' + res.data.fileName;
						res.data.contentMd5 = md5File
            res.data.file = file
						FindService.upLoadImg(res.data)
						this.updateUserData()
					}
				})
			},

    //选择性别
    selectSex(index) {
      let list = this.radioList;
      list.forEach(item => {
        item.check = false;
      });
      list[index].check = true;
      this.radioList = list;
      this.userInfo.gender = list[index].name;
    },
    //清除图片
    clearImg() {
      this.userInfo.licenseImgUrl = "";
    },
    //检查用户信息
    checkUserInfo() {
      let result = true;
      if (!this.userInfo.userName) {
        this.error.nameError = "姓名不能为空！";
        result = false;
      } else if (this.userInfo.userName.length > 8) {
        this.error.nameError = "姓名不能超过8个字符！";
        result = false;
      } else {
        this.error.nameError = "";
      }

      if (!this.userInfo.companyName) {
        this.error.companyError = "店铺名称不能为空！";
        result = false;
      } else if (this.userInfo.companyName.length > 30) {
        this.error.companyError = "店铺名称不能超过30个字符！";
        result = false;
      } else {
        this.error.companyError = "";
      }

      if (!this.userInfo.detailAddress) {
        this.error.detailAddressError = "详细地址不能为空！";
        result = false;
      } else {
        this.error.detailAddressError = "";
      }

      let pattern = /^[A-Za-z0-9]{15,18}$/;
      if(!this.userInfo.businessLicense){
        this.error.businessLicenseError = "";
      }else if(!pattern.exec(this.userInfo.businessLicense)){
        this.error.businessLicenseError = "营业执照格式不正确!";
        result = false;
      }else {
        this.error.businessLicenseError = "";
      }
      return result;
    },
    //提交修改
    submitInfo() {
    	let result = this.checkUserInfo();
	      if (result) {
     		 if(this.fileList.length>0){
            this.$refs.upload.submit()
          }else {
            this.updateUserData();
          }
	      }
    },
    updateUserData(){
    	 let userInfo = Object.assign({},this.userInfo);
        userInfo.birthday = Date.parse(userInfo.birthday);
        if(userInfo.gender == "保密"){
          userInfo.gender = "";
        }
        usercenter.updataUserInfo(userInfo).then(res => {
          if (res.success) {
            this.$router.push({name: `userinfo`,params: {
              editSuccess: true
            }});
            this.checkVisibles = true;
          }
        });

    },
    //修改所在地区
    changeAddress(list){
      this.userInfo=list;
    },
    inputError(e){
      this.error[e] = '';
    }
  }
};
</script>
<style lang="stylus">
.w-100 {
    width 100%
}

.userinfo {
  pb(1)
  mb(38)
  bg(#fff)
}

.info-title {
  width: 100%;
  height: 84px;
  pl(20);
  ft(28);
  c(#333);
  lh(84);
}

.info-content {
  margin: 20px 0;
  margin-right: 5%;
  c(#666);

  .el-input__inner {
    border-color #ededed
    height 34px
    lh(34)
    radius(0)
    cursor default
    padding 0 12px
  }

  .el-input__inner:hover {
    border-color #ededed
  }

  .el-input__inner:focus {
    border-color #ededed
  }

  .el-input__icon {
    lh(34)
  }

  .el-input__prefix {
    display: none;
  }
}

.info-group {
  mb(24);

  .inline {
    inline();
  }

  .w-52 {
    width: 52%;
    box();
    padding: 0 12px;
  }

  label {
    inline();
    ft(14);
    width: 138px;
    text-align: right;
  }

  .input {
    width: 100%;
    box();
    padding: 0 12px;
    border: 1px solid #EDEDED;
    height: 34px;
    ft(14);
    c(#333);
  }

  .select-birthday {
    width: 100%
  }

  .address-disabled {
    background-color: #EDEDED;
    cursor: not-allowed;
  }

  .radio {
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid #E5E5E5;
    border-radius: 50%;
    mr(12);
  }

  .radio-select {
    border-color: #4A90E2;

    div {
      width: 10px;
      height: 10px;
      bg(#4A90E2);
      border-radius: 50%;
      margin: 2px auto;
    }
  }

  .radio-name {
    inline();
    mr(32);
    ft(14);
  }

  .mobileNo {
    inline();
    box();
    width: 100%;
    pl(12);

    p {
      inline();
      ft(14);
      c(#333);
    }

    a {
      ft(14);
      c(#4A90E2);
    }
  }

  .sex {
    box();
    width: 21%;
    height: 34px;
    padding: 6px 12px;
    ft(14);
    c(#555);
    border: 1px solid #ddd;
  }

  .business-img {
    pt(16);
    width: 120px;
    height: 120px;
    margin: 0;
  }

  .businessLicense-img {
    position absolute 
    right 24px
    top 50%
    transform translateY(-50%)
    squ(16)
  }

  .business-select {
    pt(16);
    width: 148px;
    height: 148px;
    margin: 0;
  }

  .business-clear {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 123px;
    top: 8px;
  }
}

.red {
  c(#e43834);
}

.info-change {
  inline();
  ml(16);
  mr(24);
  ft(18);
  c(#fff);
  bg(#e43834);
  border: 1px solid #e43834;
  padding: 13px 42px;

  &:hover {
    bg(#ef5350);
    border-color: #ef5350;
  }
}

.cancel {
  ml(0);
  bg(#EDEDED);
  c(#333);
  border-color: #E5E5E5;

  &:hover {
    bg(#ddd);
    border-color: #ddd;
  }
}

.userinfo-error {
  c(#e43834);
  margin-left: 16.6%;
}

.edit-dialog {
  inline();
  ml(15);
  mr(30);
}

.business-input {
  background: url('../../assets/images/canotUse.png') no-repeat scroll right 12px top 9px transparent;
  background-size: 16px 16px;
}

.relative {
  position: relative;
}
</style>
<style lang="stylus">
.address-m {
  ml(0)
  flex-center()
  justify-content: space-between;
  width 100%
}
.select-m {
  width 24%
  height: 34px;
  background-position: right 10px top 14px;
}
.addressCursor {
  cursor: not-allowed;
}
.business-warning {
  p {
    font-weight 500
    mb(16)
    lh(20)
  }

  div {
    margin 44px auto 0
    width 120px
    height 36px
    background #E53935
    ft(14)
    c(#fff)
    text-c()
    lh(36)
    radius(2)
  }
}
.el-dialog__header {
  border-bottom: 1px solid #ededed;
}
.disabled {
  bg(#fff)
}
.disabled .el-upload--picture-card,.disabled .el-upload__tip {
    display: none;
}
.input-error {
  color #E53935!important
  border-color #E53935!important
}
.icon-error {
  inline()
  squ(14)
  position absolute
  right 22px
  lh(46)
  top 50%
  transform translateY(-50%)
}
</style>


