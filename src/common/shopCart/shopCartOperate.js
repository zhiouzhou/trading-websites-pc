
//购物车勾选
function operateItem($vue,type,param) {
  switch (type) {
    case `globalSelect`:
      switchGlobalSelect($vue);
      break;
    case `productSelect`:
      switchProductSelect($vue)
      break;
    case `groupSelect`:
      switchGroupSelect($vue,param)
      break;
    case `miniProductSelect`:
      switchMiniProductSelect($vue,param)
      break;
    default:
      break;
  }
}

//勾选产品
function switchProductSelect($vue) {
  if($vue.product.canSelect){
    $vue.product.select = !$vue.product.select
  }
}

//勾选分组
function switchGroupSelect($vue,param) {
  const group = $vue.groupList.find(item => item.shopCartId == param.shopCartId)
  const groupIdx = $vue.groupList.findIndex(item => item.shopCartId == param.shopCartId)
  let currentSelect
  if(group.canSelect){
    currentSelect = !group.select
    $vue.groupList[groupIdx].select = !group.select
  }
  //处理该分组下所有产品的勾选状态
  for(let product of group.productList){
    if (product.canSelect) {
      product.select = currentSelect
    }
  }
}

//勾选全部
function switchGlobalSelect($vue) {
  let currentSelect = !$vue.allSelect
  $vue.allSelect = !$vue.allSelect
  for(let item of $vue.groupList){
    if(item.canSelect){
      item.select = currentSelect
    }
    for(let product of item.productList){
      if(product.canSelect){
        product.select = currentSelect
      }
    }
  }
}

//侧边栏购物车产品勾选
function switchMiniProductSelect($vue,param) {
  if(param.product.canSelect){
    param.product.select = !param.product.select
  }
}

export {
  operateItem
}
