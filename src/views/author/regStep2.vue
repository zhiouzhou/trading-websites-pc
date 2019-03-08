<template>
  <div class="reg">
    <div class="step clearfix">
      <dl class="step1">
        <dt class="s-num fz12">1</dt>
        <dd class="s-text">验证手机号码</dd>
      </dl>
      <dl class="doing">
        <dt class="s-num fz12">2</dt>
        <dd class="s-text">填写店铺信息</dd>
      </dl>
    </div>
    <form class="reg-form fz14" novalidate="novalidate">
      <div class="form-list">
        <div class="form-list-f1">
          <input type="text" class="form-control" :class="{'input-error': error.shopError}" placeholder="请输入您的店铺名称" v-model="info.shopName" @focus="inputError('shopError')">
          <div class="form-label">店铺名称</div>
          <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.shopError">
          <div class="error">
            <span>{{error.shopError}}</span>
          </div>
        </div>
      </div>
      <div class="form-list">
        <div class="form-list-f1">
          <input type="text" class="form-control" :class="{'input-error': error.userError}" placeholder="请输入您的真实姓名" v-model="info.userName" @focus="inputError('userError')">
          <div class="form-label">联系人</div>
          <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.userError">
          <div class="error">
            <span>{{error.userError}}</span>
          </div>
        </div>
      </div>
      <div class="ads">
        <div class="ads-title">所在地区</div>
        <div class="reg-ads-select" @click="inputError('addressError')">
          <addressSelect @changeAddress="changeAddress" :user-info="info"></addressSelect>
          <div class="error">
            <span>{{error.addressError}}</span>
          </div>
        </div>
      </div>
      <div class="ads">
        <div class="ads-title">详细地址</div>
        <div class="pre">
          <textarea
            type="text"
            class="form-control"
            :class="{'input-error': error.addressDetailError}"
            placeholder="请输入您的详细地址"
            maxlength="200"
            v-model="info.addressDetail"
            @focus="inputError('addressDetailError')"
          ></textarea>
          <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.addressDetailError">
          <div class="error">
            <span>{{error.addressDetailError}}</span>
          </div>
        </div>
      </div>
      <div class="ads">
        <div class="ads-title">我是</div>
        <div class="shop-type">
          <span v-bind:class="item.class" v-for="item in shopTypes" :key="item.userClassId" @click="changeShopType" v-bind:data-id="item.userClassId">{{item.userClassName}}</span>
        </div>
        <div class="error">
          <span>{{error.serviceError}}</span>
        </div>
      </div>
      <br>
      <div>
        <button type="button" class="next-step fz18 c-w" :class="{'no-nextstep': !info.shopName||!info.userName||!info.province||!info.city||!info.county||!info.addressDetail}" @click="nextStep">完成</button>
      </div>
    </form>
  </div>
</template>
<script>
  import addressSelect from "@/components/addressSelect";
  import * as author from "@/api/author/author.js"
  export default {
    name: "regStep2",
    data() {
      return {
        shopTypes: [],
        info: {
          shopName: "",
          userName: "",
          province: "",
          city: "",
          county: "",
          street: "",
          addressDetail: "",
          shopType: 0
        },
        error: {
          shopError: "",
          userError: "",
          addressError: "",
          addressDetailError: "",
          serviceError: ""
        },
        goNextRoute: false
      };
    },
    components: {
      addressSelect
    },
    created(){
      // if(!this.$route.params.mobileNo||!this.$route.params.password){
      //   this.$router.push("/reg/step1");
      // }
      author.getShopType().then(res => {
        let shopTypes = res.data;
        shopTypes.forEach( item => {
          item.class="";
        })
        shopTypes[0].class="shop-select";
        this.shopTypes=shopTypes;
      })
      this.info.mobileNo = this.$route.params.mobileNo;
      this.info.password = this.$route.params.password;
      this.info.validateCode = this.$route.params.validateCode;
    },
    beforeRouteLeave(to,from,next){
      if(this.goNextRoute){
        next(true)
      }else {
        this.$confirm({content:'您填写的内容还没有提交，现在返回所填写内容将被清空'})
          .then(() => {
            next(true)
          })
          .catch(() => {
            next(false)
          });
      }
    },
    methods: {
      //选择店铺类型
      changeShopType(e){
        this.info.shopType = e.target.dataset.id;
        let shopTypes= this.shopTypes;
        shopTypes.forEach( item => {
          item.class="";
        })
        shopTypes.forEach( item => {
          if(item.userClassId == e.target.dataset.id){
            item.class="shop-select";
          }
        })
      },
      //检查店铺名称
      checkShopName() {
        if (!this.info.shopName) {
          this.error.shopError = "店铺名称不能为空！";
        } else if (this.info.shopName.length > 30) {
          this.error.shopError = "店铺名称不能超过30个字符！";
        } else {
          this.error.shopError = "";
        }
      },
      //检查姓名
      checkUserName() {
        if (!this.info.userName) {
          this.error.userError = "姓名不能为空！";
        } else if (this.info.userName.length > 8) {
          this.error.userError = "姓名不能超过8个字符！";
        } else {
          this.error.userError = "";
        }
      },
      //检查地址
      checkAddress() {
        if (!this.info.county) {
          this.error.addressError = "所在区域未填完整！";
        } else {
          this.error.addressError = "";
        }
      },
      //检查详细地址
      checkAddressDetail() {
        if (!this.info.addressDetail) {
          this.error.addressDetailError = "详细地址不能为空！";
        } else {
          this.error.addressDetailError = "";
        }
      },
      //完成
      nextStep() {
        this.checkShopName();
        this.checkUserName();
        this.checkAddress();
        this.checkAddressDetail();
        if (
          this.error.shopError ||
          this.error.userError ||
          this.error.addressError ||
          this.error.addressDetailError
        ) {
          return;
        }
        let data = {
          mobileNo : this.info.mobileNo,
          password : this.info.password,
          companyName : this.info.shopName,
          userName : this.info.userName,
          province : this.info.province,
          city : this.info.city,
          county : this.info.county,
          street : this.info.street,
          detailAddress : this.info.addressDetail,
          userDisplayClass : parseInt(this.info.shopType)
        }
        author.Register(data).then(res => {
          if(res.success){
            this.goNextRoute = true;
            this.$router.push("/reg/step3");
          }else{
            this.error.serviceError = res.desc;
          }
        })
      },
      //修改所在地区
      changeAddress(list){
        this.info=list;
      },
      inputError(e){
        this.error[e] = '';
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .reg {
    pb(64);
    lh(20);
    overflow: hidden;
  }

  .step {
    text-c();
    margin: 55px auto 0;
    width: 460px;

    dl {
      float: left;
      position: relative;
      width: 230px;
      top: -5px;
      border-top: 5px solid #ccc;
    }
  }

  dl.doing {
    border-top-color: #7abd54;

    .s-text {
      c(#7abd54);
    }

    .s-num {
      background-position: -23px 0;
    }
  }

  .s-num {
    margin: -15px auto 0;
    c(#fff);
    fb();
    width: 23px;
    background-image: url('../../assets/images/step2013.png');
    lh(23);
  }

  .s-text {
    mt(8);
    font-size: 14px;
    c(#ccc);
  }

  dl.step1 {
    border-top-color: #caecb6;

    .s-num {
      background-position-x: -47px;
    }

    .s-text {
      c(#caecb6);
    }
  }

  .step3 .s-num {
    background-position-x: -68px;
  }

  .reg-form {
    width: 460px;
    margin: 0 auto;
    c(#333);
  }

  .form-list {
    display: -moz-box;
    display: -webkit-box;
    mt(30);

    input {
      text-indent: 70px;
      lh(46)

      &::placeholder {
        c(#999);
      }
    }
  }

  .form-list-f1 {
    position: relative;
    box-flex: 1;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
  }

  .form-list-f2 {
    box();
    height: 46px;
    border: 1px solid #ddd;
    bg(#FAFAFA);
    c(#333);
    ml(15);
    lh(46);
    padding: 0 20px;

    &:hover {
      cursor: pointer;
      bg(#ddd);
    }
  }

  .form-control {
    box();
    radius(0);
    border-color: #ddd;
    width: 100%;
    height: 46px;
    padding: 6px 12px;
    border: 1px solid #ccc;
    c(#333);
    font-size: 14px;
  }

  .form-label {
    position: absolute;
    left: 15px;
    top: 0;
    height: 46px;
    lh(46);
  }

  .protopol {
    margin: 20px 0 30px;
    fb();
  }

  .next-step {
    pt(0);
    pb(0);
    mt(15);
    height: 46px;
    lh(46);
    border: 1px solid #e43834;
    radius(4px);
    cursor: pointer;
    touch-action: manipulation;
    bg(#e43834);
    width: 100%;

    &:hover {
      bg(#ef5350);
      border-color: #ef5350;
    }
  }

  .no-nextstep {
    bg(#bdbdbd)
    border-color: #bdbdbd;

    &:hover {
      bg(#bdbdbd)
      border-color: #bdbdbd;
    }
  }

  .ads {
    mt(30);

    .ads-title {
      mb(5);
    }

    textarea {
      resize: none;
      min-width: 70px;
      font-family: Microsoft YaHei,tahoma,arial,Hiragino Sans GB,sans-serif

      &::placeholder {
        c(#999);
      }
    }
  }

  .shop-type {
    content: '';
    display: table;
    width: 100%;

    span {
      box();
      width: 31%;
      float: left;
      pl(8);
      pr(8);
      text-c();
      lh(40);
      border: 1px solid #e5e5e5;
      cursor: pointer;
    }

    .shop-select {
      border: 1px solid #E53935;
      c(#E53935)
      position: relative;

      &::after {
        content: "";
        width: 12px;
        height: 12px;
        background-image: url('../../assets/images/jiaogou-ic@3x.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }

  .shop-type span:nth-of-type(2) {
    margin: 0 3.5%;
  }

  .error {
    c(#e43834)
  }
</style>
<style lang="stylus">
  .address-m{
    width: 100%;
  }
  .select-m{
    width: 24%;
    height: 34px;
    background-position: right 8px top 17px;
    margin-right: 1.333%;

    &:nth-of-type(4) {
      mr(0)
    }
  }
  .icon-error {
    inline()
    squ(14)
    position absolute
    right 10px
    lh(46)
    top 16px
  }
  .input-error {
    color #E53935!important
    border-color #E53935!important
  }
</style>
