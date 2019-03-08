
const storage = window.sessionStorage || window.localStorage

// @ {cacheKey} string
function setCache(cacheKey, data) {
    const cityId = localStorage.getItem('CITY_ID') || ''
    cacheKey = cityId + cacheKey;
    storage.setItem(cacheKey, JSON.stringify(data))
}
// @ {cacheKey} string
function getCache(cacheKey) {
    const cityId = localStorage.getItem('CITY_ID') || ''
    cacheKey = cityId + cacheKey;
    const cacheData = storage.getItem(cacheKey)
    if (cacheData&&cacheData!='undefined') {
        return JSON.parse(cacheData);
    }
    return null
}
export {
    setCache,
    getCache
}
