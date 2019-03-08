//混入对象
import { mapGetters } from "vuex";
import Bus from "common/bus";
import { debounce } from "common/lodash";
import { ListSearchKeyRecommend } from "api/setting/setting";
import storage from "common/storage";
const mixin = {
    data() {
        return {
            focusing: true,
            keyWord: "",
            productSearchLabel: "名酒/葡萄酒/饮料/食品/日货",
            fuzzySearchList: []
        };
    },
    computed: {
        ...mapGetters(["cartCount"])
    },
    mounted() {
        this.inputDebounce = debounce(this.setFuzzyData, 200);
    },
    methods: {
        inputDebounce() {
            this.inputDebounce();
        },
        _doSearch(word) {
            if (typeof word == "string") {
                this.keyWord = word;
            }
            let searchKey = this.keyWord;
            if(searchKey){ //非空
                let searchHistoryList = storage.get('searchHistory', []);
                if(!searchHistoryList.includes(searchKey)){
                    searchHistoryList.push(searchKey)
                    storage.set('searchHistory', searchHistoryList);
                }
            }
            if (this.$route.name == "list") {
                Bus.$emit("doSearch", searchKey);
            } else {
                const params = {
                    path: "/index/list",
                    query: {
                        searchKey
                    }
                };
                this.$router.push(params)
            }
            this.fuzzySearchList = [];
            if (this.HotKeyWords && this.HotKeyWords.indexOf(word) >= 0) {
                this.$createTalkingData('Search', 'Search_Hot_Word', { SearchHotWord: this.keyWord })
            } else {
                this.$createTalkingData('Search', 'Search', { SearchName: this.keyWord })
            }
        },
        _dealerSearch(){
          let searchKey = this.keyWord;
          Bus.$emit("dealerSearch", searchKey);
        },
        setFuzzyData() {
            if (this.keyWord) {
                ListSearchKeyRecommend(this.keyWord)
                    .then(res => {
                        this.fuzzySearchList = res.data;
                    })
                    .catch(res => {
                        this.fuzzySearchList = [];
                    });
            } else {
                this.fuzzySearchList = storage.get('searchHistory', []);
            }
        },
        focusEvt() {
            if (this.fuzzySearchList.length) {
                this.focusing = true;
                return;
            }
            this.focusing = true;
            this.inputDebounce();
            this.$createTalkingData('Search', 'Search_Box', { SearchBox: '' })
        },
        delayBlur() {
            setTimeout(() => {
                this.focusing = false;
            }, 500)
        }
    }
}
export default mixin
