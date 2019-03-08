import * as settingApi from 'api/setting/setting'
import * as $cache from "common/cache";
import * as productApi from "api/product/product";
export function jumpBannerLink(banner) {

    //广告(0), 活动(1), 产品(2), 类目(3), 链接(4), 领优惠券(5),实名认证(6),专区(7)
    const $state = this.$router;
    let url = location.href, urlResolve;
    switch (banner.bannerType) {
        case 1:
            urlResolve = $state.resolve({
                name: 'activityDetail', query: this.encodeUrlQuery({
                    activityId: banner.targetId,
                    promotionType: banner.promotionType
                })
            })
            if (banner.promotionType == 5) {
                urlResolve = $state.resolve({
                    name: 'groupProductDetail', query: this.encodeUrlQuery({
                        activityId: banner.targetId,
                        promotionType: 5
                    })
                })
            }
            break;
        case 2:
            urlResolve = $state.resolve({
                name: 'productDetail', query: this.encodeUrlQuery({
                    skuId: banner.targetId
                })
            })
            break;
        case 3:
            urlResolve = $state.resolve({
                name: 'list', query: {
                    sonCategoryId: banner.targetId,
                    specialAreaId: ''
                }
            })
            break;
        case 4:
            url = banner.skipUrl;
            window.open(url, '_blank')
            break;
        default:
            break;
    }
    if (urlResolve) {
        url = urlResolve.href
        window.open(url, '_blank')
    }
}

//缓存专区类目
const saveSecondPageCategory = function (columnList) {

    let conut = 0;
    for (let item of columnList) {
        settingApi.SecondPageCategory(item.columnId).then(res => {
            if (res.success) {
                conut += 1;
                let SecondPageCategory = $cache.getCache('SecondPageCategory') || {};
                SecondPageCategory[item.columnId] = res.data
                $cache.setCache('SecondPageCategory', SecondPageCategory)
            }
        }).catch(res => { })
    }
}

//专栏信息
export const fetchColumnListInfo = function () {
    const purchaseColumnList = $cache.getCache('purchaseColumnList')
    const SecondPageCategory = $cache.getCache('SecondPageCategory')
    if (purchaseColumnList && SecondPageCategory) {
        return false;
    }
    settingApi.purchaseColumnList().then(res => {
        if (res.success) {
            const columnList = res.data
            $cache.setCache('purchaseColumnList', columnList)
            saveSecondPageCategory(columnList);
        }
    }).catch(res => { })
}

//首页预处理快捷进货数据
//某些地方增加关注后传入 refresh
export const CacheMyProductBriefList = function (refresh) {
    if ($cache.getCache("MyProductBrief") && !refresh) {
        return false;
    }
    productApi
        .listMyProductBrief()
        .then(res => {
            if (res.success) {
                $cache.setCache("MyProductBrief", res.data);
            }
        })
        .catch(res => { });
}
