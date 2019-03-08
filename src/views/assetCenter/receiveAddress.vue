<template>
  <div class="bgf receiveAddress jiupi-center">
    <div class="address-header">
      <p class="header-title">收货地址</p>
      <p class="addAddress" @click="addressDialog({type:'add'})">
        <i></i><span class="cs">新增收货地址</span>
      </p>
    </div>
    <div class="addressList" v-for="(item,index) in addressList" :key="item.addressId">
      <p class="user">
        <span class="userInfo fz16 c-3 fw-b">{{item.contact}}</span>
        <span class="fz16 c-3 fw-b">{{item.mobileNo}}</span>
        <span class="default-ad" v-show="item.defaultAddress">默认地址</span>
      </p>
      <div class="address">
        <p
          class="address-text"
        >{{item.province}} {{item.city}} {{item.county}} {{item.street}} {{item.detailAddress}}</p>
        <p class="address-tips" v-show="!item.defaultAddress">
          <span
            class="tips cs"
            v-show="item.state==1"
            @click="setDefaultAddress(item)"
          >设为默认地址</span>
          <span
            class="tips cs"
            v-show="item.canModify"
            @click="addressDialog({type:'edit',addressInfo:item})"
          >编辑</span>
          <span class="pre" v-show="item.canModify">
            <confirm style="top:-140px;" :ref="'confirm'+index" text="您确定要删除该地址吗？" @determine="deleteAddress(item.addressId)"></confirm>
            <span class="tips-delete cs" @click="showDelete(index)">删除</span>
          </span>
        </p>
      </div>
    </div>
    <!--新增弹框-->
    <el-dialog
      :title="dialogType=='add'?'新增收货地址':'编辑收货地址'"
      :visible.sync="addDialog"
      width="666px"
      center
    >
      <p class="tips">
        <span class="tips-line"></span>
        收货地址添加后会进入审核状态，暂时不能提交订单。
      </p>
      <div class="userInfo-add">
        <p class="info-label">收货人：
          <span>*</span>
        </p>
        <div class="pre">
        <input placeholder="请输入收货人姓名" :class="{'input-error': error.contactError}" v-model="userInfo.contact"  @focus="inputError('contactError')">
        <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.contactError">
        </div>
      </div>
      <span class="error-title">{{error.contactError}}</span>
      <div class="userInfo-add">
        <p class="info-label">手机号码：
          <span>*</span>
        </p>
        <div class="pre">
        <input placeholder="请输入收货人手机号码" :class="{'input-error': error.phoneError}" v-model="userInfo.mobileNo" @focus="inputError('phoneError')">
        <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.phoneError">
        </div>
      </div>
      <span class="error-title">{{error.phoneError}}</span>
      <div class="userInfo-add">
        <p class="info-label">所在地区：
          <span>*</span>
        </p>
        <div @click="inputError('addressError')">
        <addressSelect class="ml-20" ref="addressData" @changeAddress="changeAddress" :user-info="userInfo"></addressSelect>
        </div>
      </div>
      <span class="error-title">{{error.addressError}}</span>
      <span class="error-title"></span>
      <div class="userInfo-add">
        <p class="info-label">详细地址：
          <span>*</span>
        </p>
        <div class="pre">
        <input placeholder="请输入详细地址" :class="{'input-error': error.detailError}" v-model="userInfo.detailAddress"  @focus="inputError('detailError')">
        <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.detailError">
        </div>
      </div>
      <span class="error-title">{{error.detailError}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="holdAddress">保存</el-button>
        <el-button @click="addDialog = false" style="background: #E5E5E5;">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as assetsCenter from "@/api/assetsCenter/assetsCenter";
import * as usercenter from "@/api/usercenter/usercenter";
import addressSelect from "@/components/addressSelect";
import confirm from "components/common/confirm";

export default {
  // name: "receiveAddress",
  data() {
    return {
      addressList: [],
      datas: [0, 1, 2, 3],
      addDialog: false, //新增地址弹窗
      cityList: [], //城市列表
      dialogType: "",
      contact: "",
      mobileNo: "",
      detailAddress: "",
      userInfo: {
        contact: "", //收货人
        mobileNo: "", //手机号
        detailAddress: "",
        province: "",
        city: "",
        county: "",
        street: "",
        defaultAddress: false,
        fromLocation: false
        /*houseNumber:'',
          latitude:'',
          locationAddress:'',
          longitude:'',
          telephone:'',
          zipCode:'',*/
      },
      error: {
        contactError: "",
        phoneError: "",
        addressError: "",
        detailError: ""
      }
    };
  },
  components: {
    addressSelect,
    confirm
  },
  created() {
    this.getAddressList();
    this.getUserDefault();
  },
  methods: {
    ...mapActions(["initUserDefaultAddress","saveCartCount"]),
    //获取用户的默认城市
    getUserDefault() {
      usercenter.getUserInfo().then(data => {
        if (data.success) {
          console.log(data);
          this.userInfo.city = data.data.city;
          this.userInfo.province = data.data.province;
        }
      });
    },
    //获取收货地址列表
    getAddressList() {
      let { datas } = this;
      assetsCenter.GetAddressList({ datas }).then(data => {
        if (data.success) {
          console.log(data.data);
          this.addressList = data.data;
        }
      });
    },
    showDelete(index){
      let ref = 'confirm' +index;
      this.$refs[ref][0].showConfirm();
    },
    //删除收货地址
    deleteAddress(data) {
      assetsCenter.DeleteAddress({ data }).then(data => {
        if (data.success) {
          this.getAddressList();
          this.$toast({text: '删除地址成功'})
        }
      });
    },
    //设置默认地址
    //data是地址id
    setDefaultAddress(e) {
      let data = e.addressId
      assetsCenter.SetDefaultAddress({ data }).then(res => {
        if (res.success) {
          this.getAddressList();
          localStorage.setItem("defaultAddressId",data)
          const {province,city,county,street,detailAddress} = e
          let currentAds = province+city+county+street+detailAddress
          localStorage.setItem("USER_DEFAULT_ADDRESS",currentAds)
          this.initUserDefaultAddress({
            userDefaultAddress: currentAds,
            refresh: true})
          //重新请求购物车角标数量
          this.saveCartCount()
        }
      });
    },
    //  新增/编辑收货地址弹框
    addressDialog(obj) {
      this.addDialog = true;
      this.dialogType = obj.type;
      if (obj.type == "edit") {
        let proto=Object.getPrototypeOf(obj.addressInfo);
        this.userInfo=Object.assign({},Object.create(proto),obj.addressInfo);
        // this.userInfo = obj.addressInfo;
          this.$nextTick(() => {
          this.$refs.addressData.selectCounty();
          this.userInfo.street = obj.addressInfo.street;
          })
      } else if (obj.type == "add") {
        this.userInfo = {
          contact: "", //收货人
          mobileNo: "", //手机号
          detailAddress: "",
          province: this.addressList[0].province,
          city: this.addressList[0].city,
          county: "",
          street: "",
          defaultAddress: false,
          fromLocation: false
        };
        this.$nextTick(() => {
            this.$refs.addressData.streetList = [];
          })
      }
      //获取城市列表
      assetsCenter.GetCityList().then(data => {
        if (data.success) {
          this.cityList = data.data;
        }
      });
      this.getUserDefault();
    },
    //  表单验证
    formValidate() {
      let flag = true;
      let reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!this.userInfo.contact) {
        this.error.contactError = "请填写收货人信息";
        flag = false;
      } else {
        this.error.contactError = "";
      }

      if (!this.userInfo.mobileNo) {
        this.error.phoneError = "请填写手机号码";
        flag = false;
      } else if (!reg.test(this.userInfo.mobileNo)) {
        this.error.phoneError = "手机号码格式错误";
        flag = false;
      } else {
        this.error.phoneError = "";
      }

      if(!this.userInfo.street) {
        this.error.addressError = '收货地址的区或县不能为空';
        flag = false;
      } else {
        this.error.addressError = "";
      }

      if (!this.userInfo.detailAddress) {
        this.error.detailError = "详细地址不能为空";
        flag = false;
      } else {
        this.error.detailError = "";
      }
      return flag;
    },

    //保存 ---- 新增收货地址
    holdAddress() {
      let result = this.formValidate();
      if (result) {
        if (this.dialogType == "add") {
          assetsCenter.AddAddress({ data: this.userInfo }).then(data => {
            if (data.success) {
              this.addDialog = false;
              this.getAddressList();
              this.userInfo = {};
              this.$toast({text: '收货地址新增成功'})
            }
          });
        } else {
          assetsCenter.EditAddress({ data: this.userInfo }).then(data => {
            if (data.success) {
              this.addDialog = false;
              this.getAddressList();
              this.userInfo = {};
              this.$toast({text: '收货地址修改成功'})
            }
          });
        }
      }
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
.receiveAddress {
  mb(39);
}

.address-header {
  padding: 28px 20px;
  // flex();
  // align-items: center;
  // justify-content: space-between;

  .header-title {
    inline()
    ft(28);
    c(#333);
  }

  .addAddress {
    frt()
    inline()
    // flex();
    // align-items: center;
    lh(28)

    i {
      squ(16);
      inline();
      background: url('../../assets/images/woyaozhaohuo.png') no-repeat;
      background-size: contain;
      mr(8);
      vertical-align text-bottom
    }

    span {
      ft(16);
      c(#4A90E2);
    }
  }
}

.addressList {
  padding: 20px;

  .user {
    flex();
    align-items: center;
    mb(12);
  }
}

.userInfo {
  mr(24);
}

.default-ad {
  inline();
  padding: 4px;
  border: 1px solid #E53935;
  ft(12);
  c(#E53935);
  radius(2);
  ml(16);
}

.address {
  // flex();
  // justify-content: space-between;
  // align-items: center;
  pos(relative)
  lh(34)

  .address-text {
    inline()
    ft(14);
    c(#333);
  }

  > .address-tips {
    visibility: hidden;
    pos(absolute)
    right 0
    top 0
    // flex();
    // align-items: center;

    > .tips {
      inline()
      ft(14);
      c(#4A90E2);
      ml(20);
    }

    .tips-delete {
      inline()
      ft(14);
      c(#4A90E2);
      ml(20);

      &:hover {
        c(#E53935);
      }
    }
  }
}

.addressList:hover {
  bg(#FFF3F3);

  .address-tips {
    visibility: visible;
  }

  .tips:hover {
    c(#E53935);
  }
}

.tips {
  bg(#FFF3F3);
  ft(14);
  c(#A94442);
  // flex();
  mb(20);
  align-items: center;

  .tips-line {
    inline();
    width: 4px;
    bg(#E4B9C0);
    height: 36px;
    mr(8);
    vertical-align middle
  }
}

.el-dialog__header {
  border-bottom: 1px solid #ededed;
}

.userInfo-add {
  // flex();
  // align-items: center;
  // mb(16);

  .info-label {
    min-width: 80px;
    ft(14);
    c(#333);
    text-align: right;
    flt()
    lh(36)

    span {
      c(#E53935);
    }
  }

  >div {
    ml(100)

    >input {
      box()
      width 100%
      height: 36px;
      border: 1px solid #ededed;
      pl(12);
      ft(14);
    }
  }
}

.el-button {
  padding: 12px 46px !important;
}

.error-title {
  margin-left: 100px;
  margin-bottom: 12px;
  display: block;
  c(#E91F2F);
}

.address-m {
  // flex();
  // align-items: center;
  // justify-content: space-between;
  width: 100%;
}

.select-m {
  width: 24%;
  height: 34px;
  background-position: right 8px top 17px;
  margin-right 1.333%

  &:nth-of-type(4) {
    mr(0)
  }
}

.cursor {
  cursor: not-allowed;
}

.bgf {
  background-color: #fff;
}
.icon-error {
  inline()
  squ(14)
  position absolute
  right 10px
  lh(46)
  top 50%
  transform translateY(-50%)
}
.input-error {
  color #E53935!important
  border-color #E53935!important
}
</style>
