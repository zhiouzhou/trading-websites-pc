<template>
     <div class="bg-w member">
    <div class="member-title">
      <router-link to="/myOrderEntry/memberDetail" class="c-3 fz14">会员俱乐部</router-link>&nbsp;>&nbsp;
      <span class="c-9 fz14">升级规则</span>
    </div>
    <div class="level-introduce">
        <div class="level-introduce-head">如何提升会员等级</div>
        <div class="level-introduce-content gouwu-img">
            <p>
                <span>购物</span>
                <i></i>
            </p>
            <div>
                <span>购买指定商品:</span>
                <p>近12个月有效购买送酒币的单品，送指定数量的酒币数。</p>
                <span>有效购买频次:</span>
                <p>近12个月，按自然月，每月分上（前10天）、中（中间10天）、下旬（剩下天数），在每个旬期内，有完成购买就送1个酒币。</p>
                <span>有效购买金额:</span>
                <p>近12个月，按自然月，月订单累计实付(订单完成金额－退货完成金额)每满2000元送1酒币；不足2000时不计算，也不会累计到下月计算。注：累计实付订单金额不含合作商和入驻商订单金额。</p>
            </div>
        </div>
        <div class="level-introduce-content huoyuan-img">
            <p>
                <span>货源爆料</span>
                <i></i>
            </p>
            <div>
                <p>您提交的低价或独家货源爆料，易久批确认爆料有效后，会根据您的爆料价值，奖励指定数量的酒币数。</p>
            </div>
        </div>
        <div class="level-introduce-content jiage-img">
            <p>
                <span>价格举报</span>
                <i></i>
            </p>
            <div>
                <p>您提交的价格举报，易久批确认有效后，会奖励您指定数量的酒币数。</p>
            </div>
        </div>
        <div class="level-introduce-content qiandao-img">
            <p>
                <span>上传个人资料</span>
                <i></i>
            </p>
            <div>
                <p>上传营业执照，送1个酒币，仅送一次；实名认证送1个酒币，仅送一次。</p>
            </div>
        </div>
        <div class="level-introduce-head">影响会员等级下降的因素</div>
        <div class="rule-member-level">
            <span>退货</span>
            <p>每退货成功1次，扣2个酒币，依次累计。</p>
        </div>
        <div class="rule-member-level">
            <span>长时间未购买</span>
            <p>近12个月内，按自然月，无已完成的订单，每月扣5个酒币。</p>
        </div>
     </div>
     </div>
</template>
<script>
export default {
    name: 'ruleMember'
}
</script>
<style lang="stylus">
.member {
  width: 100%;
  pl(20)
  pr(20)
  pb(38)
}

.member-title {
  height: 50px;
  lh(50);
  c(#333);
  ml(10);
}

.level-introduce {
    width 100%
    mt(20)
    border: 1px solid #ffc3c3;
}

.level-introduce-head {
    inline()
    padding 0 50px
    height 44px
    background url('../../assets/images/icon-cut.jpg') no-repeat top right #ffc3c3
    ft(18)
    text-c()
    lh(44)
    mb(27)
}

.level-introduce-content {
    padding 15px 90px 0
    lh(28)
    mb(35)

    p {
        position relative
        padding 0 10px

        span {
            position absolute 
            z-index 20
            padding 0 10px 0 36px
            lh(28)
            ft(16)
            background-color #fff
        }

        i {
            inline()
            width 100%
            height 2px
            bg(#ffc3c3)
            position relative
            top -3px
            z-index 10
        }
    }

    div {
        ft(14)
        lh(22)
        pt(14)
        pl(40)

        span {
            padding 0 10px
            ft(14)
            c(#333)
        }

        p {
            padding 0 10px
            mb(20)
            ft(14)
            c(#666)
        }
    }
}

.rule-member-level {
    ft(14)
    lh(22)
    pl(40)

    span {
        padding 0 10px
        ft(16)
        c(#000)
    }

    p {
        padding 14px 10px 0
        mb(20)
        ft(14)
        c(#666)
    }
}

.gouwu-img {
    background: url('../../assets/images/icon_gouwu.png') no-repeat 40px 19px #fff;
}

.huoyuan-img {
    background: url('../../assets/images/icon-huoyuanbaoliao.png') no-repeat 40px 19px #fff;
}
.jiage-img {
    background: url('../../assets/images/icon_jiagejubao.png') no-repeat 40px 19px #fff;
}
.qiandao-img {
    background: url('../../assets/images/icon_qiandao.png') no-repeat 40px 19px #fff;
}
</style>
