<template>
    <div class="help-content ">
        <div class="title">售后服务</div>
        <p>如有任何问题，您都可以拨打<span class="red">4000199197</span>进行反馈。我们会在24小时内响应并处理。 您也可以通过商城内的投诉服务进行投诉。</p>
    </div>
</template>
<script>
export default {
    name: "aftersales"
}
</script>
<style lang="stylus" scoped>
.help-content {
    
    ml(220);

    p {
        ft(14)
        c(#666)
        line-height 2em
        mb(12)
    }
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
.red {
    c(#e43834)
}
</style>
