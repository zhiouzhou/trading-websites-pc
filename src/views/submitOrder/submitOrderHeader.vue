<template>
<div>
    <app-header></app-header>
    <div class="w">
    <div class="order-header-title">
        <img src="../../assets/images/logo.png" alt="北京易酒批电子商务有限公司">
        <div></div>
        <span>收银台</span>
    </div>
    <router-view/>
    </div>
    <app-footer></app-footer>
</div>
</template>
<script>
import AppHeader from "@/views/AppHeader.vue";
import AppFooter from "@/views/AppFooter.vue";
export default {
    name: "submitOrderHeader",
    components: {
        AppHeader,
        AppFooter
    }
}
</script>
<style lang="stylus">
.order-header-title {
    padding: 34px 0 39px;
    flex()
    align-items: center;

    img {
        inline()
        width: 140px;
        height: 55px;
        margin 0
    }

    div {
        inline()
        width 1px
        height 34px
        margin: 0 16px;
        bg(#EDEDED)
    }

    span {
        ft(20)
        c(#333333)
    }
}
</style>

