
/*
 * 使用优惠券,跳转产品列表
 * 通用券跳转普通产品列表
 * 专区券跳转专区类目
 * 其他券跳转优惠券适用产品列表
 */
function couponSkip(e,type){
  let params = { searchKey: ``,isCouponList: true,gatherType: 4 }
  if(type == `couponCenter`){
    const {couponUseType,speacialAreaId,couponTemplateId} = e
    params.couponTemplateId = couponTemplateId
    if(couponUseType == 2){

    }else if(couponUseType == 3){
      params.specialAreaId = speacialAreaId
    }else{
      const obj = {
        // isCouponList: true,
        // couponTemplateId:couponTemplateId,
        canUseCoupon: true,
        specialAreaId: speacialAreaId?speacialAreaId: ''
      }
      params = Object.assign(params,obj)
    }
  }else{
    const {useDescription} = e;
    const {couponUseType,specialAreaIds,templateId} = e.couponTemplate
    params.couponTemplateId = templateId
    params.couponUseDesc = useDescription
    if(couponUseType == 2){

    }else if(couponUseType == 3){
      params.specialAreaId = specialAreaIds[0]
    }else{
      const obj = {
        // isCouponList: true,
        couponTemplateId:templateId,
        // canUseCoupon: true,
        specialAreaId: specialAreaIds?specialAreaIds[0]: ''
      }
      params = Object.assign(params,obj)
    }
  }
  this.$router.push({
    path: "/index/list",
    query: params
  });
}

export {
  couponSkip
}
