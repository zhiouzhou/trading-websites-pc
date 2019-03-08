<template>
  <div class="jiupi-center">
    <div class="userinfo clearfix pre">
      <p class="favorite-info-title">我的足迹</p>
      <p class="favorite-info-title history-clear frt">
        <span class="fz16" @click="clear" v-if="productList.length">清空我的足迹</span>
      </p>
      <div>
        <productFavorite v-for="item in productList" :key="item.productSkuId" :product-item="item"></productFavorite>
      </div>
      <div class="pagination">
      <el-pagination
        class="frt"
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next,total, jumper"
        :total="totalCount"
        prev-text="<上一页"
        next-text="下一页>"
        v-if="totalCount"
      ></el-pagination>
      </div>
      <div class="empty-list clearfix" v-if="!productList.length&&!firstShow">
        <div class="empty-img flt">
          <img src="../../assets/images/cart-empty.png">
        </div>
        <div class="history-empty-word flt">
          <p>您还没有留下足迹呦~</p>
          <p>
            <router-link to="/index/home">去首页逛逛~</router-link>
          </p>
        </div>
      </div>
    </div>
    <dealer-pop></dealer-pop>
  </div>
</template>
<script>
import * as usercenter from "@/api/usercenter/usercenter.js";
import productFavorite from "@/components/usercenter/product-favorite.vue";
import { transformFavoriteProductList } from "common/productUtil/list";
import dealerPop from "components/dealer/dealerPop.vue";
export default {
  name: "history",
  data() {
    return {
      productList: [],
      currentPage: 1,
      pageSize: 9,
      totalCount: 1,
      firstShow: true
    };
  },
  components: {
    productFavorite,
    dealerPop
  },
  created() {
    let data = {
      currentPage: this.currentPage,
      pageSize: this.pageSize
    };
    usercenter.getHistory(data).then(res => {
      if (res.data) {
        let list = res.data;
        this.totalCount = res.totalCount;
        let productList = [];
        list.forEach(item => {
          productList.push(item.productSku);
        });
        this.productList = transformFavoriteProductList(productList);
      }
      this.firstShow = false;
    });
  },
  methods: {
    clear() {
      this.$confirm({ content: "确定清空我的足迹所有商品吗？" })
        .then(() => {
          usercenter.cleanHistory().then(res => {
            if (res.success) {
              this.productList = [];
              this.totalCount = 0;
            }
          });
        })
        .catch(() => {});
    },
    //改变分页
    handleCurrentChange(e) {
      let data = {
        currentPage: e,
        pageSize: this.pageSize
      };
      usercenter.getHistory(data).then(res => {
        if (res.data) {
          let list = res.data;
          this.totalCount = res.totalCount;
          let productList = [];
          list.forEach(item => {
            productList.push(item.productSku);
          });
          this.productList = transformFavoriteProductList(productList);
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.w-100 {
  width: 100%;
}

.userinfo {
  box()
  bg(#fff)
  mb(38);
  pl(20);
  pr(20);
  pb(60)
  min-height: 682px;
}

.favorite-info-title {
  inline();
  height: 84px;
  ft(28);
  c(#333);
  lh(84);
  mb(20);
}

.history-clear {
  c(#666);
  ft(16);

  span {
    cursor: pointer;

    &:hover {
      c(red);
    }
  }
}

.empty-list {
  margin: 100px auto;
  height: 150px;
  padding-left: 50%;

  .history-empty-word {
    padding-left: 5%;

    p {
      pt(50);
      ft(18);
      c(#757575);
      width 176px

      &:nth-of-type(2) {
        pt(8);
        c(#666);
      }

      a {
        ft(14);
      }
    }
  }
}

.empty-img {
  width: 150px;
  height: 150px;
  ml(-150);
  position: relative;

  img {
    inline();
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.pagination {
  width 100%
  position absolute
  right 14px
  bottom 0
  display: flex;
  justify-content: flex-end;
  pt(24);
  pb(24);
}
</style>
