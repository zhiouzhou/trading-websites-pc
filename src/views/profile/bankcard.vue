<template>
  <div class="container myBankCard">
    <div class="title">我的银行卡</div>
    <div class="cardList" v-if="cardData && cardData.length">
      <div class="cardContent" v-for="item in cardData" :key="item.bankCardId">
        <div class="bankLogo">
          <p class="bankTitle"><img :src="item.logoSmall"/><span>{{item.bankName}}</span></p>
          <span class="cardType">{{item.cardType==2?'储蓄卡':'信用卡'}}</span>
        </div>
        <p class="cardNumber">{{item.cardNo}}</p>
        <p class="cardUser">{{item.acctName}}<span @click="unlock(item.bankCardId)">解绑</span></p>
      </div>
    </div>
    <div class="empty" v-else>
      <img src="../../assets/images/wuyinhangka.png"/>
      <span>您还没有绑定银行卡哟～</span>
    </div>
  </div>
</template>

<script>
  import * as assetsCenter from "@/api/assetsCenter/assetsCenter";

  export default {
    name: "myBankCard",
    data() {
      return {
        cardData: [],

      }
    },
    created() {
      this.getUserCardList()
    },
    methods: {
      /*获取用户银行卡列表*/
      getUserCardList() {
        assetsCenter.GetCardList().then(data => {
          if (data.success) {
            this.cardData = data.data
            this.cardData.forEach(item => {
              item.cardNo = item.cardNo.substr(0, 6) + '******' + item.cardNo.substr(item.cardNo.length - 4);
              item.acctName = '*' + item.acctName.substr(1, 4)
            })
          }
        })
      },
      /*解锁*/
      unlock(bankCardId) {
        assetsCenter.Unlock({bankCardId}).then(data=>{
          if(data.success){
            this.getUserCardList();
          }else{

          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .myBankCard{
    bg(#fff)
    mb(39)
    position: relative
  }
  .title {
    padding: 28px 20px;
    c(#333);
    ft(28)
  }

  .cardList {
    display: flex;
    flex-wrap: wrap;
    margin: 0 20px;
    bg(#fff);
    radius(4);
    /*justify-content space-between;*/
  }

  .cardContent:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    .cardUser > span {
      visibility: visible;
    }
  }

  .cardContent {
    padding: 20px;
    border: 1px solid rgba(237, 237, 237, 1);
    min-width: 28%;
    mb(20);
    mr(20);
    :hover {

    }
    .bankLogo {
      padding-bottom: 20px;
      display: flex;
      align-items center;
      justify-content space-between;
      .bankTitle{
        flex()
        align-items: center
        img{
          squ(28)
        }
        span{
          ft(16)
          c(#333)
          fb()
          ml(8)
        }
      }
      .cardType {
        padding: 4px;
        display: block;
        bg(#999);
        radius(2);
        c(#fff);
        ft(12)
      }
    }
    .cardNumber {
      ft(16);
      c(#666);
      font-weight: bold;
      padding-bottom: 16px;
    }
    .cardUser {
      display: flex;
      align-items center;
      justify-content: space-between;
      ft(16);
      c(#666)
      span {
        visibility: hidden;
        padding: 4px;
        display: block;
        border: 1px solid #ededed;
        bg(#fff);
      }
    }
  }

  .empty{
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%,-50%);
    >img{
      squ(80)
      mb(20)
    }
    >span{
      ft(16)
      c(#666)
    }
  }


</style>
