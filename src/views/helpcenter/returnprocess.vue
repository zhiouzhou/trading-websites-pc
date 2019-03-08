<template>
    <div class="help-content ">
        <div class="title">退货流程</div>
        <p>退换货时间：从下单起2周内可以退换货</p>
        <p>退换货流程：</p>
        <p>提交申请——易久批订单详情内有“退货申请”按钮，可以根据实际情况选择需要退换货商品，提交申请。</p>
        <p>受理/取货——公司收到提醒会安排人员上门取货，符合标准的产品予以取回。</p>
        <p>退款——符合标准的产品取回后，财务安排退款到您的银行账号。</p>
    </div>
</template>
<script>
export default {
    name: "returnprocess"
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
</style>
