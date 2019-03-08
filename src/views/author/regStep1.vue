<template>
  <div class="reg w">
    <div class="step clearfix">
      <dl class="step1 doing">
        <dt class="s-num fz12">1</dt>
        <dd class="s-text">验证手机号码</dd>
      </dl>
      <dl>
        <dt class="s-num fz12">2</dt>
        <dd class="s-text">填写店铺信息</dd>
      </dl>
    </div>
    <form class="reg-form fz14" novalidate="novalidate">
      <div class="form-list">
        <div class="form-list-f1">
          <input
            type="text"
            class="form-control"
            :class="{'input-error': error.mobileError}"
            placeholder="请输入您的手机号"
            v-model="info.mobileNo"
            @input="inputMobile"
            maxlength="11"
            required
            @focus="focusInput('mobileError')"
          >
          <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.mobileError">
          <img src="../../assets/images/zhengque@2x.png" alt="" class="icon-error" v-if="mobileCheck&&!error.mobileError">
          <div class="form-label">手机号</div>
          <div class="error">
            <span>{{error.mobileError}}</span>
          </div>
        </div>
      </div>
      <div class="form-list">
        <div class="form-list-f1">
          <input
            type="text"
            class="form-control"
            :class="{'input-error': error.validateError}"
            placeholder="请输入验证码"
            v-model="info.validateCode"
            maxlength="6"
            required
            @focus="focusInput('validateError')"
          >
          <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.validateError">
          <div class="form-label">验证码</div>
          <div class="error">
            <span>{{error.validateError}}</span>
          </div>
        </div>
        <div class="form-list-f2" :class="{'reg-validateCode': validateCodeTime == 0 && info.mobileNo.length==11}" @click="getValidateCode">{{validateCodeTime>0?`${validateCodeTime}秒后重新获取`:'获取验证码'}}</div>
      </div>
      <div class="form-list">
        <div class="form-list-f1">
          <input
            :type="pwdState?'text':'password'"
            class="form-control"
            :class="{'input-error': error.passwordError}"
            placeholder="限6-18位"
            v-model="info.password"
            maxlength="18"
            data-type="password"
            @input="checkPwd"
            required
            @focus="focusInput('passwordError')"
          >
          <div class="form-label">密码</div>
          <img src="../../assets/images/zhengyan@2x.png" class="password-close cs" @click="changePwdState" v-if="pwdState">
          <img src="../../assets/images/biyan@2x.png" class="password-close cs" @click="changePwdState" v-if="!pwdState">
          <div class="error">
            <span>{{error.passwordError}}</span>
          </div>
        </div>
      </div>
      <div class="form-list">
        <div class="form-list-f1">
          <input
            :type="repwdState?'text':'password'"
            class="form-control"
            :class="{'input-error': error.rePasswordError}"
            placeholder="请再次输入密码"
            v-model="info.rePassword"
            maxlength="18"
            data-type="rePassword"
            @input="checkPwd"
            required
            @focus="focusInput('rePasswordError')"
          >
          <div class="form-label">确认密码</div>
          <img src="../../assets/images/zhengyan@2x.png" class="password-close cs" @click="changerePwdState" v-if="repwdState">
          <img src="../../assets/images/biyan@2x.png" class="password-close cs" @click="changerePwdState" v-if="!repwdState">
          <div class="error">
            <span>{{error.rePasswordError}}</span>
          </div>
        </div>
      </div>
      <div class="protopol">
        <input type="checkbox" @click="agreePro" v-model="isAgreePro">
        我已阅读并同意
        <span class="cs" @click="readPro = true">《易久批用户协议》</span>
        <div class="error">
          <span>{{error.protopolError}}</span>
        </div>
      </div>
      <div>
        <button type="button" class="next-step fz18 c-w" :class="{'no-nextstep': info.mobileNo.length!=11||info.validateCode.length!=6||info.password.length<6||info.rePassword.length<6||!isAgreePro}" @click="nextStep">下一步</button>
      </div>
    </form>
    <el-dialog width="951px" title="易久批平台服务协议书" center :visible.sync="readPro">
      <div class="reg-pro-title">
        <div>
          本协议是用户与北京易酒批电子商务平台（简称"本平台"）所有者北京易酒批电子商务有限公司（以下简称“北京易酒批”）之间就本平台服务等相关事宜所订立的契约，请用户仔细阅读本协议，用户签署或点击"同意并继续"按钮后，本协议即构成对双方有约束力的法律文件。
        </div>
        <div>一、用户注册</div>
        <p>1.1用户签署或在本平台点击同意本协议的，即视为用户确认自己具有相应的营业资质（包括但不限于营业执照、食品流通许可和就酒类流通许可等），能够独立承担法律责任，并且用户将对其在订单中提供的所有信息的真实性负责。</p>
        <div>二、服务简介 </div>
        <p>2.1本平台通过互联网依法为用户提供互联网信息等服务，用户在完全同意本协议及本平台规定的情况下，方有权使用本平台的相关服务。</p>
        <p>2.2本平台运用自己的操作系统通过国际互联网络为用户提供网络平台服务。同时，用户必须： </p>
        <p>a.自行配备上网的所需设备，包括个人电脑、手机或其他必备上网装置，将本平台下载并安装至个人电脑或手机。</p>
        <p>b.自行负担个人上网所支付的与此服务有关的电话费用、网络费用。 </p>
        <p>c. 所有发给用户的通告都通过重要页面的公告或电子邮件或常规的信件传送。用户协议条款的修改、服务变更、或其它重要事件的通告都会以此形式进行。</p>
        <div>三、用户信息 </div>
        <p>3.1用户应自行诚信向本平台提供注册资料，用户保证其提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果。 </p>
        <p>3.2用户在本平台进行浏览、下单购物等活动时，涉及用户真实姓名/名称、通信地址、联系电话、电子邮箱等隐私信息的，本平台将予以严格保密，除非得到用户的授权或法律另有规定，本平台不会向外界披露用户隐私信息。 </p>
        <p>3.3用户注册成功后，可以根据本平台规定改变密码。用户应谨慎合理的保存、使用其用户名和密码，不得提供给其他任何人。用户若发现任何非法使用用户账号或存在安全漏洞的情况，请立即通知本平台并向公安机关报案。 </p>
        <p>3.4用户同意，北京易酒批各子公司拥有通过邮件、短信电话等形式，向在本平台用户、收货人发送订单信息、促销活动等告知信息的权利。 </p>
        <p>3.5用户不得将在本平台注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。 </p>
        <p>3.6本平台尊重并保护用户的个人隐私权。本平台将以高度的勤勉、审慎义务对待用户的资料信息，除在如下情况下，不会将这些信息对外披露或向第三方提供： </p>
        <p>a. 根据法律的有关规定，或者行政司法机构的要求，向第三方或者行政、司法机构披露； </p>
        <p>b.为提供用户所要求的产品和服务，而必须向第三方分享用户的个人信息； </p>
        <p>3.7用户需对本平台所显示的信息保密，不得向第三方透漏。</p>
        <div>四、商品信息 </div>
        <p>本平台上的商品价格、数量、是否有货等商品信息随时都有可能发生变动，本平台不作特别通知。由于网站上商品信息的数量极其庞大，虽然本平台会尽最大努力保证用户所浏览商品信息的准确性，但由于众所周知的互联网技术因素等客观原因存在，本平台网页显示的信息可能会有一定的滞后性或差错，对此情形用户知悉并理解。为表述便利，商品和服务简称为"商品"或"货物"。</p>
        <div>五、订单 </div>
        <p>1、在用户下订单时，请用户仔细确认所购商品的名称、价格、数量、型号、联系地址、电话等信息。 </p>
        <p>2、除法律另有强制性规定外，双方约定如下：本平台上销售方展示的商品和价格等信息仅仅是要约邀请，用户下单时须填写用户希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址等内容；系统生成的订单信息是计算机信息系统根据用户填写的内容自动生成的数据，仅是用户向销售方发出的合同要约；销售方收到用户的订单信息后，只有在销售方将用户在订单中订购的商品从仓库实际向用户发出时（以商品出库为标志），方视为用户与销售方之间就实际向用户发出的商品交易成立；如果用户在一份订单里订购了多种商品并且销售方只给用户发出了部分商品时，用户与销售方之间仅就实际向用户发出的商品交易成立；只有在销售方实际向用户发出了订单中订购的其他商品时，用户和销售方之间就订单中该其他已实际向用户发出的商品交易才成立。用户可以随时登录用户在本平台注册的帐户，查询用户的订单状态。</p>
        <div>六、配送 </div>
        <p>1、 订单签订时，用户应确认收货人、收货地址及联系方式。 </p>
        <p>2、 本平台将会把商品（货物）送到用户所指定的收货地址交给指定收货人签收。 </p>
        <p>3、因如下情况造成订单延迟或无法配送等，销售方不承担延迟配送的责任： </p>
        <p>（1）用户提供的信息错误、地址不详细等原因导致的； </p>
        <p>（2）货物送达后无人签收，导致无法配送或延迟配送的； </p>
        <p>（3）不可抗力因素导致的，例如：自然灾害、交通戒严、突发战争等。 </p>
        <p>4、用户办理自提业务的应完善自提手续。</p>
        <div>七、订单数据显示 </div>
        <p>本平台提供用户在平台下单的订单数据，用户可在本平台进行相关查询，最终货款金额以用户与销售方实际结算为准。</p>
        <div>八、货款结算及相关优惠券的使用 </div>
        <p>1、商品配送至用户指定地方后，用户与销售方进行结算，具体结算金额以实际交付商品数量为准。 </p>
        <p>2、用户在本平台操作时，可选择抵用券和红包冲抵相关费用使用。用户使用费用的数据记录将保存于系统，该记录作为对账有效依据。若用户发现系统提供数据有误，请及时联系平台。</p>
        <div>九、所有权及知识产权条款 </div>
        <p>1、北京易酒批是本平台的所有者,拥有此网站内容及资源的版权等合法权利,受法律保护,有权不时地对本协议及本平台的内容进行修改和公示，无须另行通知用户。在法律允许的最大限度范围内，北京易酒批对本协议及本平台内容拥有解释权。 </p>
        <p>2、除法律另有强制性规定外，未经北京易酒批的特别书面许可,任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用本平台的信息内容，否则，北京易酒批有权追究其法律责任。 </p>
        <p>3、本平台所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段、数字下载、数据编辑和软件），均是北京易酒批或其内容提供者的财产，受中国和国际版权法的保护。本平台上所有内容的汇编是北京易酒批的排他财产，受中国和国际版权法的保护。本平台上所有软件都是北京易酒批或其关联公司或其软件供应商的财产，受中国和国际版权法的保护。</p>
        <div>十、责任限制 </div>
        <p>除非另有明确的书面说明,本平台及其所包含的或以其它方式通过本平台提供给用户的全部信息、内容、材料、产品（包括软件）和服务，均是在"按现状"和"按现有"的基础上提供的。 如因不可抗力或其它本平台无法控制的原因使本平台销售系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等，北京易酒批会合理地尽力协助处理善后事宜。</p>
        <div>十一、 协议更新及用户关注义务 </div>
        <p>根据国家法律法规变化及网站运营需要，北京易酒批有权对本协议条款不时地进行修改，修改后的协议一旦被签署或张贴在本平台上即生效，并代替原来的协议。用户可随时登录查阅最新协议；用户有义务不时关注并阅读最新版的协议及网站公告。如用户不同意更新后的协议，应立即停止接受依据本协议提供的本平台服务。北京易酒批提示用户在使用本平台之前阅读本协议及本平台的公告。 如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。 本协议内容中以黑体、加粗、下划线、斜体等方式显著标识的条款，请用户着重阅读。</p>
        <div>十二、终止服务 </div>
        <p>在下列情况下，本平台可以终止服务，同时保留对用户的违法和/或违约行为追究法律责任的权利： </p>
        <p>1.用户违反法律法规及本协议相关条款规定； </p>
        <p>2.本协议条款更新时，用户明示不愿接受新的条款； </p>
        <p>3.用户对本平台实施欺诈、胁迫、恶意攻击等行为；</p>
        <p>4.本平台认为需要终止服务的其他情况。</p>
        <div>十三、法律管辖和适用 </div>
        <p>本协议的订立、履行和解释及争议的解决均应适用在中华人民共和国（不包括港澳台地区）适用之有效法律（但不包括其冲突法规则）。 如发生本协议与适用之法律相抵触时，则这些条款将完全按法律规定重新解释，而其它有效条款继续有效。 如各方就本协议内容或其履行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向北京易酒批住所地法院提起诉讼。</p>
        <div>十四、其他 </div>
        <p>用户签署或点击"同意并继续"按钮即视为用户完全接受本协议，在点击之前请用户再次确认已知悉并完全理解本协议的全部内容。</p>
      </div>
      <div class="reg-pro-button">
          <p @click="readPro = false">取消</p>
          <p @click="readPro = false;isAgreePro = true;">同意并继续</p>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import * as author from "@/api/author/author.js"
export default {
  name: "regStep1",
  data() {
    return {
      error: {
        mobileError: "",
        validateError: "",
        passwordError: "",
        rePasswordError: "",
        protopolError: ""
      },
      isAgreePro: false,
      info: {
        mobileNo: "",
        validateCode: "",
        validateCodeId: "",
        password: "",
        rePassword: ""
      },
      showText: false,
      validateCodeTime: 0,
      isRequest: false,
      pwdState: false,
      repwdState: false,
      readPro: false,
      mobileCheck: false,
      validateCheck: false,
      goNextRoute: false
    };
  },
  created() {},
  beforeRouteLeave(to,from,next){
    if(this.goNextRoute){
      next(true)
    }else {
      let {mobileNo,password,rePassword} = this.info;
      if(mobileNo||password||rePassword){
        this.$confirm({content:'您填写的内容还没有提交，现在返回所填写内容将被清空'})
        .then(() => {
          next(true)
        })
        .catch(() => {
          next(false)
        });
      }else {
        next(true)
      }
    }
  },
  methods: {
    //同意协议
    agreePro(){
      this.readPro = false;
      this.isAgreePro = true;
    },
    //显示和隐藏密码
    changePwdState(){
      this.pwdState = !this.pwdState;
    },
    changerePwdState(){
      this.repwdState = !this.repwdState;
    },
    //检查输入手机号
    inputMobile(e){
      let mobileNo = '';
      let value = e.target.value;
      let partter = /[^\d]/g;
      mobileNo = value.replace(partter,'');
      this.info.mobileNo = mobileNo;
    },
    //检查密码
    checkPwd(e) {
      let value = e.target.value;
      let partter = /\s/g;
      value = value.replace(partter, "");
      if (e.target.dataset.type == "password") {
        this.info.password = value;
      } else if (e.target.dataset.type == "rePassword") {
        this.info.rePassword = value;
      }
    },
    //检查账号格式
    checkMobileNo(){
      let partter = /^0?1[3|4|5|6|8|7|9][0-9]\d{8}$/;
      let exp = new RegExp(partter);
      if (!this.info.mobileNo) {
        this.error.mobileError = "手机号不能为空!";
        this.mobileCheck = false;
        return;
      }
      if (!exp.test(this.info.mobileNo)) {
        this.error.mobileError = "手机号格式不正确!";
        this.mobileCheck = false;
        return;
      }
      this.error.mobileError = "";
    },
    //检查验证码
    checkValidateCode(){
      if (!this.info.validateCode) {
        this.error.validateError = "请输入验证码";
        return;
      } else {
        this.error.validateError = "";
      }
    },
    //检查密码
    checkPassword(){
      let {password, rePassword} = this.info;
      if(!password){
        this.error.passwordError="密码不能为空!"
        return;
      }
      if(password.length<6){
        this.error.passwordError="密码格式不正确"
        return;
      }
      if(password!==rePassword){
        this.error.rePasswordError="两次密码输入不一致"
        return;
      }
      this.error.passwordError="";
      this.error.rePasswordError="";
    },
    //倒计时
    reduceTime(seconds) {
      this.validateCodeTime = seconds;
      let validateCodeInterval = setInterval(() => {
        this.validateCodeTime=this.validateCodeTime-1;
        if (this.validateCodeTime <= 0) {
          this.validateCodeTime = 0;
          window.clearInterval(validateCodeInterval);
        }
      }, 1000);
    },
    //获取验证码
    getValidateCode() {
      if (this.validateCodeTime>0||this.isRequest) {
        return;
      }
      this.isRequest = true;
      let partter = /^0?1[3|4|5|6|8|7|9][0-9]\d{8}$/;
      let reg = new RegExp(partter);
      if (!this.info.mobileNo) {
        this.error.mobileError = "手机号不能为空!";
        this.isRequest = false;
        return;
      } else if (!reg.test(this.info.mobileNo)) {
        this.error.mobileError = "手机号格式不正确!";
        this.isRequest = false;
        return;
      }
      author.isUserExist(this.info.mobileNo).then(
        res => {
          if(!res.data){
            this.error.mobileError="";
            author.getCode(this.info.mobileNo).then(
              res => {
                if(res.success){
                  this.mobileCheck = true;
                  this.info.validateCodeId = res.data.identifyingCodeId;
                  this.reduceTime(60);
                }else{
                  if(res.message=="获取验证码频率太快，请稍后重试"){
                    this.reduceTime(60);
                  }
                  this.error.validateError=res.msg
                }
                this.isRequest = false;
              }
            )
          }else {
            this.error.mobileError="该手机号已存在";
            this.isRequest = false;
          }
        },
        error => {
          this.error.mobileError = error.msg;
          this.isRequest = false;
        }
      );
    },
    agreePro(){
      this.isAgreePro = !this.isAgreePro;
    },
    //下一步
    nextStep(){
      this.checkMobileNo();
      this.checkPassword();
      if(this.error.mobileError||this.error.passwordError||this.error.rePasswordError){
        return;
      }
      if(!this.isAgreePro){
        this.error.protopolError= "您还没有同意易久批用户协议!"
        return;
      }else{
        this.error.protopolError="";
      }
      this.checkValidateCode();
      if(this.error.validateError){
        return;
      }
      var data = {
        mobileNo: this.info.mobileNo,
        code: this.info.validateCode,
        codeId: this.info.validateCodeId
      }
      author.checkValidate(data).then(res => {
        if (res.data) {
            this.goNextRoute = true;
            this.$router.push({ name: `regStep2`, params: this.info });
          } else {
            this.error.validateError = "请输入正确的验证码";
          }
      },error => {
        this.error.validateError = "请输入正确的验证码";
      })
    },
    focusInput(e){
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

.step1 {
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
  width 102px
  height: 46px;
  border: 1px solid #ddd;
  bg(#FAFAFA);
  c(#333);
  ml(15);
  lh(46);
  radius(4)
  text-c()
  cursor: pointer;
}

.reg-validateCode {
  bg(#e53935)
  c(#fff)
}

.form-control {
  box();
  radius(0);
  border-color: #ddd;
  width: 100%;
  height: 46px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  c(#555);
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

  >span {
    c(#4A90E2)
  }
}

.next-step {
  pt(0);
  pb(0);
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

.password-close {
  inline()
  width 18px
  height 18px
  position absolute
  right 10px
  top 15px
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
  c(#E53935)
  border-color #E53935
}

.error {
  color: #e43834;
}

.reg-pro-title {
  overflow auto
  height 413px

  div {
    mt(16)
    mb(16)
    ft(14)
    c(#333)

    &:nth-of-type(1) {
      mt(0)
    }
  }

  p {
    ft(14)
    c(#666)
  }
}

.reg-pro-button {
    text-c()
    mt(24)

    p {
      inline()
      width 120px
      height 36px
      text-c()
      lh(36)
      ft(14)
      radius(2)
      cursor pointer

      &:nth-of-type(1) {
        bg(#EDEDED)
        c(#333333)
        border 1px solid #E5E5E5
        mr(12)
      }

      &:nth-of-type(2) {
        bg(#E53935)
        c(#FFFFFF)
        border 1px solid #E53935
      }
    }
  }
</style>
