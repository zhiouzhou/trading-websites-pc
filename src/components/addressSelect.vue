<template>
  <div class="address address-m">
    <select
      class="select select-m"
      v-bind:class="{addressDisabled: provinceOpen, addressCursor: provinceOpen}"
      @change="selectProvince"
      v-model="userInfo.province"
      v-bind:disabled="provinceOpen"
      @input="handleChange"
    >
      <option style="display: none"></option>
      <option v-for="item in provinceList">{{item}}</option>
    </select>
    <select
      class="select select-m"
      v-bind:class="{addressDisabled: cityOpen, addressCursor: cityOpen}"
      @change="selectCity"
      v-model="userInfo.city"
      v-bind:disabled="cityOpen"
      @input="handleChange"
    >
      <option style="display: none"></option>
      <option v-for="item in cityList">{{item}}</option>
    </select>
    <select
      class="select select-m"
      v-bind:class="{addressDisabled: countyOpen, addressCursor: countyOpen}"
      @change="selectCounty"
      v-model="userInfo.county"
      v-bind:disabled="countyOpen"
      @input="handleChange"
    >
      <option style="display: none"></option>
      <option v-for="item in countyList">{{item}}</option>
    </select>
    <select
      class="select select-m"
      v-bind:class="{addressDisabled: streetOpen, addressCursor: streetOpen}"
      v-model="userInfo.street"
      v-bind:disabled="streetOpen"
      @input="handleChange"
    >
      <option style="display: none"></option>
      <option v-for="item in streetList">{{item}}</option>
    </select>
  </div>
</template>
<script>
import * as author from "@/api/author/author.js";
import * as usercenter from "@/api/usercenter/usercenter";
export default {
  name: "addressSelect",
  data() {
    return {
      addressList: [],
      countyStreet: [],
      provinceList: [],
      cityList: [],
      countyList: [],
      streetList: [],
      provinceOpen: false,
      cityOpen: true,
      countyOpen: true,
      streetOpen: true
    };
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          province: "",
          city: "",
          county: "",
          street: ""
        };
      }
    }
  },
  computed: {
    change() {
      if (this.userInfo.county) {
        let street = this.userInfo.street;
        this.selectCounty();
        this.userInfo.street = street;
      }
    }
  },
  created() {
    if (this.$parent.userInfo || this.$parent.$parent.userInfo) {
      //修改个人信息
      this.provinceOpen = true;
      //获取省份列表
      author.getCityList().then(res => {
        if (res.success) {
          let provinceList = [];
          this.addressList = res.data;
          res.data.forEach(item => {
            if (provinceList.indexOf(item.province) < 0) {
              provinceList.push(item.province);
            }
          });
          this.provinceList = provinceList.sort(function(item1, item2) {
            return item1.localeCompare(item2, "zh-CN");
          });
          if (!this.userInfo.province) {
            usercenter.getUserInfo().then(res => {
              if (res.data) {
                const {province,city, county, street} = res.data;
                this.userInfo.province =province;
                this.userInfo.city = city;
                this.userInfo.county = county;
                this.userInfo.street = street;
                this.getAddressInfo();
              }
            });
          }else {
            this.getAddressInfo();
          }
        }
      });
    } else {
      //注册
      author.getCityList().then(res => {
        if (res.success) {
          let provinceList = [];
          this.addressList = res.data;
          res.data.forEach(item => {
            if (provinceList.indexOf(item.province) < 0) {
              provinceList.push(item.province);
            }
          });
          this.provinceList = provinceList.sort(function(item1, item2) {
            return item1.localeCompare(item2, "zh-CN");
          });
        }
      });
    }
  },
  methods: {
    //修改个人信息和收货地址
    getAddressInfo() {
      //获取城市列表
      this.filterCity(this.userInfo.province);
      //获取区域列表
      author
        .getStreetList({
          province: this.userInfo.province,
          city: this.userInfo.city
        })
        .then(res => {
          let list = res.data;
          let countyStreet = [];
          let countyList = [];
          list.forEach(item => {
            countyList.push(item.countyName);
            countyStreet.push({
              countyName: item.countyName,
              streets: item.streets
            });
          });
          this.countyStreet = countyStreet;
          this.countyList = countyList.sort(function(item1, item2) {
            return item1.localeCompare(item2, "zh-CN");
          });
          this.countyOpen = false;
          //获取街道列表
          list = this.countyStreet;
          let streetList = [];
          list.forEach(item => {
            if (item.countyName === this.userInfo.county) {
              for (let i in item.streets) {
                streetList.push(item.streets[i]);
              }
            }
          });
          this.streetList = streetList;
          this.streetOpen = false;
        });
    },
    //根据省份筛选城市
    filterCity(province) {
      let list = [];
      let addressList = this.addressList;
      addressList.forEach(item => {
        if (item.province === province) {
          list.push(item.city);
        }
      });
      this.cityList = list;
    },
    //选择省份
    selectProvince() {
      this.filterCity(this.userInfo.province);
      this.userInfo.city = "";
      this.userInfo.county = "";
      this.userInfo.street = "";
      this.cityOpen = false;
      this.countyOpen = true;
      this.streetOpen = true;
    },
    //选择城市
    selectCity() {
      this.countyList = [];
      this.countyStreet = [];
      author
        .getStreetList({
          province: this.userInfo.province,
          city: this.userInfo.city
        })
        .then(res => {
          let list = res.data;
          let countyStreet = [];
          let countyList = [];
          list.forEach(item => {
            countyList.push(item.countyName);
            countyStreet.push({
              countyName: item.countyName,
              streets: item.streets
            });
          });
          this.countyStreet = countyStreet;
          this.countyList = countyList.sort(function(item1, item2) {
            return item1.localeCompare(item2, "zh-CN");
          });
        });
      this.userInfo.county = "";
      this.userInfo.street = "";
      this.countyOpen = false;
      this.streetOpen = true;
    },
    //选择区域
    selectCounty() {
      let list = this.countyStreet;
      let streetList = [];
      list.forEach(item => {
        if (item.countyName === this.userInfo.county) {
          for (let i in item.streets) {
            streetList.push(item.streets[i]);
          }
        }
      });
      this.streetList = streetList;
      this.userInfo.street = "";
      this.streetOpen = false;
    },
    //选取地址
    handleChange() {
      let list = this.userInfo;
      this.$emit("changeAddress", list);
    }
  }
};
</script>
<style lang="stylus">
.address-select {
  flex();
}

.select {
  width: 25%;
  box();
  radius(0);
  padding: 6px 12px;
  pr(19);
  border: 1px solid #EDEDED;
  c(#333);
  font-size: 14px;
  background: url('../assets/images/ic_jiantouxia.png') no-repeat scroll transparent;
  background-size: 9px 5px;
  appearance: none;
}

.addressDisabled {
  background-color: #EDEDED;
}
</style>

