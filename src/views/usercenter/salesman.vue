<template>
<div class="jiupi-center jiupi-center">
    <div class="changepwd">
      <p class="info-title">联系业务员</p>
      <p class="fz14">业务员电话：{{mobileNo}}</p>
    </div>
</div>
</template>
<script>
import * as usercenter from "@/api/usercenter/usercenter.js";
export default {
  name: "salesman",
  data(){
      return {
          mobileNo: ''
      }
  },
  created(){
      usercenter.getUserInfo().then(res => {
          this.mobileNo = res.data.saleUserMobileNo;
      })
  }
};
</script>
<style lang="stylus" scoped>
.w-100 {
    width 100%
}

.changepwd {
  pl(20)
  bg(#fff)
  min-height: 682px;
}

.info-title {
  box();
  width: 100%;
  height: 84px;
  ft(28);
  c(#333);
  lh(84);
  mb(20);
}
</style>
