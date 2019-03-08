<template>
  <div id="help" class="clearfix">
    <div class="help flt">
      <div class="help-list">
        <div class="help-title">账户设置</div>
        <div>
          <router-link to="/myOrderEntry/userinfo" :class="{'selectedColor' : titleColor == 'userinfo'||titleColor == 'editUserinfo'||titleColor == 'changeMobile'||titleColor == 'changeMobileCode'}">个人信息</router-link>
          <router-link to="/myOrderEntry/receiveAddress" :class="{'selectedColor' : titleColor == 'receiveAddress'}">收货地址</router-link>
          <router-link to="/myOrderEntry/changepwd" :class="{'selectedColor' : titleColor == 'changepwd'}">修改密码</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "myOrderLeftNav_1",
    data(){
      return {
        titleColor: ''
      }
    },
    created(){
      this.titleColor = this.$route.name;
    },
    methods:{
    },
    watch: {
      "$route": function (to, from) {
        this.titleColor = to.name
      }
    }
  }
</script>

<style scoped lang="stylus">
  #help {
    mb(38);
    mr(20);
    float left
  }

  .help {
    width: 200px;
    bg(#fff)

  }

  .help-list {
    border-bottom: 1px solid #ededed;
    padding: 24px

    a {
      block();
      c(#666);
      ft(14);
      padding-bottom: 16px
      font-family: MicrosoftYaHei;
      &:last-child {
        padding-bottom: 0
      }

      &:hover {
        c(#53935)
      }
    }

    .selectedColor {
    c(#E53935)
  }
  }

  .help-title {
    box();
    width: 100%;
    ft(16);
    c(#333);
    padding-bottom: 24px;
    font-family: MicrosoftYaHei;
  }
</style>
