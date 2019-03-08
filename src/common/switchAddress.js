
//切换地址
function swtich(e,type){
  let currentAddressId = localStorage.getItem("defaultAddressId")
  //切换收货地址需要重新请求数据
  if(currentAddressId != e.addressId){
    localStorage.setItem("defaultAddressId",e.addressId)
    let currentAddress = e.province+e.city+e.county+e.street+e.detailAddress
    localStorage.setItem("USER_DEFAULT_ADDRESS",currentAddress)
    //商品详情切换地址
    if(type==`productDetail`){
      this.productInfo.deliveryMode = e.deliveryMode
      this.initUserDefaultAddress({
        userDefaultAddress: currentAddress,
        refresh: true})
      //重新请求购物车角标数量
      this.saveCartCount()
      this.getProductInfo({productSkuId: this.$route.query.skuId})
      this.addressBoxShow = !this.addressBoxShow
    }
  }

}

export {
  swtich
}
