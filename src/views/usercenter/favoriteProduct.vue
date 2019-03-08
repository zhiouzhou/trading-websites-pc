<template>
<div class="jiupi-center">
    <div class="userinfo clearfix pre">
      <p class="favorite-info-title">商品关注</p>
      <div class="favorite-info-title fapro-clear frt">
        <span class="fz16" v-if="productList.length" @click="clean">清空商品关注</span>
      </div>
      <div class="cleafix">
        <productFavorite
          v-for="item in productList"
          @changeList="changeList"
          :key="item.productSkuId"
          :product-item="item"
          :favorite-product="favoriteProduct"
          :list="list"
          :currentPage="currentPage"
          :totalCount="totalCount"
        ></productFavorite>
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
          <img src="../../assets/images/noFav.png">
        </div>
        <div class="history-empty-word flt">
          <p>您还没有关注</p>
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
  name: "favoriteProduct",
  data() {
    return {
      productList: [],
      favoriteProduct: true,
      list: [],
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
    usercenter.getFavoriteProduct(data).then(res => {
      this.productList = transformFavoriteProductList(res.data);
      this.totalCount = res.totalCount;
      this.firstShow = false;
    });
  },
  methods: {
    //取消关注重新获取商品列表
    changeList(list) {
      let productList = list.productList;
      this.productList = transformFavoriteProductList(productList);
      this.currentPage = list.currentPage;
      this.totalCount = this.totalCount - 1;
    },
    //清空关注商品
    clean() {
      this.$confirm({content:'确定清空所有关注商品吗？'})
        .then(() => {
          usercenter.cleanProduct().then(res => {
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
      this.currentPage = e;
      let data = {
        currentPage: e,
        pageSize: this.pageSize
      };
      usercenter.getFavoriteProduct(data).then(res => {
        this.productList = transformFavoriteProductList(res.data);
        this.totalCount = res.totalCount;
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.w-100 {
    width 100%
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
  mb(20)
}

.fapro-clear {
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
      width 108px

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
