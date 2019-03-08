<template>
    <div class="help-content ">
        <div class="title">忘记密码</div>
        <p>可以通过登录页面的忘记密码链接找回密码。</p>
    </div>
</template>
<script>
export default {
    name: "forgetpwd"
}
</script>
<style lang="stylus" scoped>
.help-content {
    
    ml(220);

}
p {
        ft(14)
        c(#666)
        line-height 2em
        mb(12)
    }
.title {
    box();
    width: 100%;
    height: 52px;
    lh(52)
    pl(12)
    mb(8)
    ft(16)
    bg(#f5f5f5)
    c(#333)
}
</style>
