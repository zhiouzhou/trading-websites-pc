<template>
  <div id="changeCities">
    <div class="current-city">
      <span class="c-9">所在城市：</span>
      <span class="c-3 cs" @click="_selectCity">{{nativeCity.cityName}}</span>
    </div>
    <div class="hotCities">
      <span class="c-9 fz14">热门城市：</span>
      <ul class="hotCitiesArr clearfix">
        <li v-for="city in hotCityList" :key="city.cityId">
          <a href="javascript:;" @click="_selectCity(city)">{{city.cityName}}</a>
        </li>
      </ul>
    </div>
    <div class="switch-wrap pre">
      <ul class="letter-options clearfix">
        <li v-for="item in letterOptions" :key="item" @mouseenter="currentLetters = item">
          <a href="javascript:;" :class="{'active':currentLetters==item}">{{item}}</a>
        </li>
      </ul>
      <div class="city-groups-wrap">
        <div
          class="city-list-wrap clearfix"
          v-for="group in currentCityGroup"
          :key="group.groupName"
        >
          <span>{{group.groupName}}</span>
          <ul class="city-list-content clearfix">
            <li v-for="city in group.citys" :key="city.cityId">
              <a
                href="javascript:;"
                class="city-list-item"
                @click="_selectCity(city)"
              >{{city.cityName}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "common/storage";
import * as assetsCenter from "api/assetsCenter/assetsCenter";
export default {
  name: "changeCities",
  data() {
    return {
      nativeCity: { cityId: "", cityName: "" },
      allCityGroup: {},
      letterOptions: ["ABCDE", "FGHJ", "KLMNP", "QRSTW", "XYZ"],
      hotCityList: [
        { cityId: "404", cityName: "上海市" },
        { cityId: "701", cityName: "北京市" },
        { cityId: "108", cityName: "深圳市" },
        { cityId: "102", cityName: "广州市" }
      ], //default value
      currentLetters: "ABCDE"
    };
  },
  computed: {
    currentCityGroup() {
      const allCityGroup = this.allCityGroup;
      if (!Object.keys(allCityGroup).length) {
        return {};
      }
      let temporary = [];
      for (let letter of this.currentLetters) {
        for (let group in allCityGroup) {
          if (group == letter) {
            temporary.push({
              groupName: group,
              citys: allCityGroup[group].citys
            });
          }
        }
      }
      return temporary;
    }
  },
  created() {
    this.nativeCity.cityId = storage.get("NATIVE_CITY_ID", "");
    this.nativeCity.cityName = storage.get("NATIVE_CITY_NAME", "");
    if(this.isVisitor){
       this.getAllCityList();
    }
  },
  methods: {
    getAllCityList() {
      assetsCenter.GetJiupiCity().then(data => {
        this.allCityGroup = data;
        this.getHotCityList(data);
      });
    },
    getHotCityList(allCityGroup) {
      assetsCenter.GetHotCity().then(res => {
        if (res.success) {
          this.hotCityList = this.formatHotCityList(allCityGroup, res.data);
        }
      });
    },
    formatHotCityList(allCityGroup, hotCityList) {
      if (!Object.keys(allCityGroup).length || !hotCityList.length) {
        return [];
      }
      let temporary = [];
      for (let property in allCityGroup) {
        for (let city of allCityGroup[property].citys) {
          if (hotCityList.find(item => item == city.cityName)) {
            temporary.push(city);
          }
        }
      }
      return temporary;
    },
    //切换城市
    _selectCity(city) {
      if(city.currentTarget){
        city = this.nativeCity
      }
      localStorage.setItem('CITY_ID', city.cityId)
      localStorage.setItem('CITY_NAME', city.cityName)
      window.location.reload();
    }
  }
};
</script>

<style lang="stylus">
#changeCities {
  width: 480px;
  position: absolute;
  background: #fff;
  z-index: 99;
  top: 37px;
  left: 0;
  b1($color-base-hr);
  cursor: default;
}

.current-city {
  padding: 24px 0;
  margin: 0 24px;
  border-bottom: 1px solid #ededed;

  >span {
    ft(14);
  }
}

.hotCities {
  margin: 24px;
}

.hotCitiesArr {
  width: 100%;

  >li {
    flt();

    >a {
      inline();
      w(60);
      ft(14);
      c(#333);
      mt(24);
    }
  }
}

.letter-options {
  mt(24);
  padding: 0px 24px;

  >li {
    flt();

    >a {
      inline();
      h(36);
      lh(36);
      w(86);
      box();
      text-c();
      c(#333);
      ft(14);

      &.active {
        c($color-base-theme);
        b1($color-base-hr);
        border-bottom: 1px solid #fff;
      }
    }
  }
}

.city-groups-wrap {
  mt(-1);
  pb(12);
  pt(24);
  border-top: 1px solid #ededed;
}

.city-list-wrap {
  padding: 0 20px;

  >span {
    inline();
    w(30);
    ft(14);
    flt();
    mr(-30);
    c($color-base-theme);
  }

  .city-list-content {
    flt();
    ml(30);

    >li {
      flt();

      >a {
        inline();
        w(100);
        c(#333);
        mb(18);
        omit();
      }
    }
  }
}
</style>
