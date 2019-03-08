const calculateStyleforCateRender = function (BrandList) {
    BrandList = BrandList.filter(item => item.sonCategorys && item.sonCategorys.length)
    BrandList.sort(function (a, b) {
        return b.sonCategorys.length - a.sonCategorys.length
    })
    let H = null;
    for (var i = 0, len = BrandList.length; i < len; i++) {
        for (var j = 0; j < 10; j++) {
            if (3 * j == i) {
                if (BrandList[i].sonCategorys.length > 6) {
                    H = { height: '95px' }
                } else if (BrandList[i].sonCategorys.length > 3) {
                    H = { height: '71px' }
                } else {
                    H = { height: '47px' }
                }
                BrandList[i].style = H
                if (BrandList[i + 1]) {
                    BrandList[i + 1].style = H
                }
                if (BrandList[i + 2]) {
                    BrandList[i + 2].style = H
                }
            }
        }
    }
    return BrandList;
}
//@ params  {currentCategory} array  
//新增  column.vue  category.vue  右侧品牌混入firstCategoryId 
export const uniqBrandList = function (currentCategory) {
    let result = [], distinct = {};
    for (let item of currentCategory) {
        for (let son of item.sonCategorys || []) {
            for (let brand of son.brandList || []) {
                if (!distinct[brand.brandId]) {
                    distinct[brand.brandId] = true;
                    brand.firstCategoryId = item.categoryId;
                    result.push(brand);
                }
            }
        }
    }
    return result;
}

//@ params  {currentCategory} array   
export const getChildrenCategoryList = function (currentCategory = []) {
    let result = [];
    //一级标识 &&  并转化为二级的参数  
    for (let item of currentCategory) {
        const { name, categoryId } = item;
        result.push({
            name, categoryId,
            sonId: categoryId, sonName: name
        })
    }
    return result;
}

//白酒进货只关联了白酒（1个一级类目），左侧类目展示全国名酒、区域名酒（二级）；
//饮料进货关联了饮料、牛奶乳品、冲调保健（多个一级类目），左侧就展示这些一级类目即可；
export const getSideCategoryList = function (currentCategory = []) {
    if (currentCategory.length == 1) {
        return currentCategory[0].sonCategorys || []
    }
    let result = [];
    //一级标识 &&  并转化为二级的参数  
    for (let item of currentCategory) {
        const { name, categoryId, sequenceNo } = item;
        result.push({
            name, categoryId, sequenceNo,
            sonId: categoryId, sonName: name
        })
    }
    result.sort((a, b)=>(a.sequenceNo - b.sequenceNo))
    return result;

}

//uniq品牌   从某个大类目的 SonCategorys   currentSonCategorys 
export const _getBrandList = function (currentSonCategorys) {
    let Result = [],
        uniq = {};
    for (let son of currentSonCategorys || []) {
        for (let brand of son.brandList || []) {
            if (!uniq[brand.brandId]) {
                uniq[brand.brandId] = 1;
                Result.push(brand);
            }
        }
    }
    return Result;
}
//反推 
/**
 * @param {originList} array  原始categoryList 
 */
export function backwardInference(originList, firstCategoryId, sonCategoryId, brandId) {

    for (let item of originList) {//兼容 sonId 
        for (let son of item.sonCategorys || []) {
            if (!son.sonId) {
                son.sonId = son.categoryId;
                son.sonName = son.categoryName;
                son.imageUrl = son.imgUrl;
            }
            if (!son.categoryId) {
                son.categoryId = son.sonId;
                son.categoryName = son.sonName;
                son.imgUrl = son.imageUrl;
            }
        }
    }

    let currentCategoryObj = { name: '', categoryId: '' };
    let unshiftItem = { sonId: '', sonName: '全部', brandList: [] };
    let currentSonCategorys = [], currentBrands = [], momentsonCategoryList = [], momentBrandList = [];

    if (firstCategoryId) {
        const matchFisrt = originList.find(item => item.categoryId == firstCategoryId)
        Object.assign(currentCategoryObj, matchFisrt)
        unshiftItem.sonId = currentCategoryObj.categoryId;
        unshiftItem.brandList = _getBrandList(matchFisrt.sonCategorys);
        currentSonCategorys = [unshiftItem, ...matchFisrt.sonCategorys];
        currentBrands = unshiftItem.brandList || [];
    }
    if (sonCategoryId) {
        for (let item of originList) {
            for (let son of item.sonCategorys || []) {
                if (sonCategoryId == son.sonId) {
                    //item  ==> matchFisrt 
                    Object.assign(currentCategoryObj, item)
                    unshiftItem.sonId = currentCategoryObj.categoryId;
                    unshiftItem.brandList = _getBrandList(item.sonCategorys)
                    currentSonCategorys = [unshiftItem, ...item.sonCategorys];
                    currentBrands = son.brandList || [];
                    momentsonCategoryList = [son];
                }
            }
        }
    }
    if (brandId) {
        for (let son of currentSonCategorys || []) {
            for (let brand of son.brandList || []) {
                if (brand.brandId == brandId) {
                    momentsonCategoryList = [currentSonCategorys[0] || son];
                    momentBrandList = [brand];
                }
            }
        }
    }
    if (firstCategoryId || sonCategoryId || brandId)
        return { currentCategoryObj, currentSonCategorys, currentBrands, momentsonCategoryList, momentBrandList }
}
/*
 * @param {originList} array  原始categoryList 
*/
export function getCurrentSonCategorysInSearchKey(originList) {

    let result = [];
    for (let item of originList) {
        for (let son of item.sonCategorys || []) {
            result.push(son)
        }
    }
    result = result.map(item => {
        item.sonId = item.categoryId || item.sonId
        item.sonName = item.categoryName || item.sonName
        return item
    })
    return result;
}

//jumpList   specialAreaId作废 
export function jumpList(specialAreaId, type, value = "", firstCategoryId = "") {
    // type [1, 2, 3] ['firstCategoryId','sonCategoryId','brandId'] 
    if (this.$route.path == '/index/home') {
        const enumer = ['', '白酒进货', '饮料进货', '休食食品', '粮油副食'];
        let CategoryId = '', BrandId = '';
        let AreaId = enumer.findIndex(item => item == specialAreaId)
        AreaId = AreaId > 0 ? AreaId : '';
        if (type == 3) {
            CategoryId = firstCategoryId;
            BrandId = value;
        } else {
            CategoryId = value;
        }
        this.$createTalkingData('index', 'Index_Channel', { AreaId, CategoryId, BrandId })
    }
    let params = null;
    switch (type) {
        case 1:
            params = {
                path: "list",
                query: {
                    firstCategoryId: value,
                    specialAreaId: ''
                }
            }
            break;
        case 2:
            params = {
                path: "list",
                query: { sonCategoryId: value, specialAreaId: '' }
            }
            break;
        case 3:
            params = {
                path: "list",
                query: {
                    brandId: value,
                    specialAreaId: '',
                    firstCategoryId: firstCategoryId
                }
            }
            break;
    }
    if (this.$route.path == "/index/list") {
        this.openNewWindow(params)
    } else {
        this.$router.push(params)
    }
}

//@ params  {originList} CommonCategoryList  首页banner区域类目 
export const transformCommonCategoryList = function (originList) {
    let columnList = []; // {columnName:' ', categorys : [{},{}], navicategorys:[{}] }
    let uniq = {};
    for (let item of originList) {
        for (let son of item.sonCategorys || []) {
            if (!son.sonId) {
                son.sonId = son.categoryId;
                son.sonName = son.categoryName;
                son.imageUrl = son.imgUrl;
            }
            if (!son.categoryId) {
                son.categoryId = son.sonId;
                son.categoryName = son.sonName;
                son.imgUrl = son.imageUrl;
            }
        }
        if (!uniq[item.groupName]) {
            uniq[item.groupName] = [item];
        } else {
            uniq[item.groupName].push(item)
        }
    }
    for (var property in uniq) {
        // 排序 计算style 首页类目展示需要
        if (uniq[property].length > 5) {
            uniq[property] = calculateStyleforCateRender(uniq[property])
        }
        let temporary = { columnName: property, categorys: uniq[property] };
        temporary.brandList = uniqBrandList(uniq[property]).slice(0, 30)
        temporary.naviCategoryList = getChildrenCategoryList(uniq[property]).slice(0, 4)
        columnList.push(temporary);
    }
    return columnList;
}



