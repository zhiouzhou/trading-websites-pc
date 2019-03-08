<template>
	<div class="container">
		<!--收货地址-->
		<div class="delivery-wrap">
			<h5 class="sc-title">请选择收货地址</h5>
			<div class="d-w-box">
				<!--收货地址列表-->
				<ul class="d-w-list" :class="{'all-show-address':showAllAddress}">
					<li class="address-box" @click="switchAddress(item)" :class="{'address-selected':item.addressId==currentAddress.addressId}" v-for="(item,i) in filterUserAddress">
						<div class="consignee">
							<span>{{item.province}}</span>
							<span>{{item.city}}</span>
							<span class="contact">({{item.contact}} 收)</span>
						</div>
						<div class="ads">
							<p>{{item.county+item.street+item.detailAddress}}</p>
							<div>{{item.mobileNo}}</div>
						</div>
						<div class="default-tag" v-if="item.defaultAddress">默认地址</div>
						<div class="default-btn" v-if="!item.defaultAddress" @click="setDefaultAddress(item.addressId)">设为默认地址</div>
					</li>
				</ul>
				<!--收货地址展开收缩栏-->
				<div v-if="filterUserAddress.length>=2" class="d-w-btn" @click="toggleAllAddress">{{showAllAddress?`
					<< 收起收货地址`:`更多收货地址>>`}}</div>
				<!--新增收货地址-->
				<div class="add-new-ads" @click="addAddress">新增收货地址</div>
			</div>
		</div>
		<!--配送方式-->
		<div class="distribution-wrap" v-if="!isSup&&!isDealer">
			<h5 class="sc-title">请选择配送方式</h5>
			<div class="d-w-type">
				<span @click="onSelectDeliveryType(0)" :class="{'active':currentDeliveryMode==0}">易久批配送</span>
				<span v-if="canSelfPickUp&&deliveryModeShowType!=1" @click="onSelectDeliveryType(4)" :class="{'active':currentDeliveryMode==4}">仓库自提</span>
				<i v-if="canSelfPickUp&&selfPickUpReduceAmount&&currentDeliveryMode==4">(自提已节省{{selfPickUpReduceAmount.toFixed(2)}}元)</i>
				<i v-if="canSelfPickUp&&selfPickUpReduceAmount&&currentDeliveryMode!=4">(自提可节省{{selfPickUpReduceAmount.toFixed(2)}}元)</i>
			</div>
			<!--自提地址-->
			<div class="d-w-content" v-if="currentDeliveryMode==4">
				<div class="c-column">
					<span>自提地点</span>
					<p>{{currentWareHouse.province+currentWareHouse.city+currentWareHouse.detailAddress+currentWareHouse.warehouseName}}</p>
					<div class="c-column-btn" @click="selectSelfPick">修改</div>
				</div>
				<div class="c-column">
					<span>自提时间</span>
					<p>{{selfPickTimeNotice}}</p>
				</div>
			</div>
		</div>
		<!--支付方式-->
		<div class="payment-wrap">
			<h5 class="sc-title">请选择支付方式</h5>
			<div class="p-w-type">
				<span class="active">货到付款</span>
				<!--        <span class="active">银行卡支付</span>
--></div>
		</div>
		<!--送货清单-->
		<div class="goods-wrap">
			<h5 class="sc-title">
        请确认送货清单
        <router-link class="sc-t-shopcart" to="/cartIndex/shopCart"><<返回购物车</router-link>
      </h5>
			<div class="g-w-box">
				<div class="box-title-column">
					<span>商品</span>
					<span>价格(元)</span>
					<span>数量</span>
				</div>
				<div class="group-wrap">
					<ul v-if="orders.length>0">
						<li class="group-wrap-list" v-for="item in orders[0].itemGroups">
							<!--TODO:订单清单列表-->
							<div class="g-w-l-name">{{item.groupName}}</div>
							<listing-product v-for="ii in item.productDetailItem" v-bind:product="ii"></listing-product>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--z赠品清单-->
		<div class="goods-wrap" v-if="orders.length&&fullGiftProducts.length">
			<h5 class="sc-title">赠品</h5>
			<div class="g-w-box">
				<div class="box-title-column">
					<span>商品</span>
					<span>价格(元)</span>
					<span>数量</span>
				</div>
				<div class="group-wrap">
					<ul v-if="orders.length>0">
						<li class="group-wrap-list">
							<!--TODO:订单清单列表-->
							<div v-for="item in fullGiftProducts">
								<listing-product v-bind:product="item" :gift=true></listing-product>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--优惠信息-->
		<div class="preferential-wrap mb-32" v-if="orders.length">
			<h5 class="sc-title">优惠信息</h5>
			<!--红包-->
			<div class="paper" v-if="orders[0].bonusList.length">
				<div class="paper-t">
					<i @click="togglePreferential(`paper`)" :class="{'shrink':preferentialShow.paper}"></i>
					<span class="p-t-title">使用红包</span>
					<span class="p-t-use" v-if="!selectBonusList.length">已使用{{selectBonusList.length}}个红包</span>
					<span class="p-t-use" v-if="selectBonusList.length">已使用{{selectBonusList.length}}个红包,共抵扣{{bonusReduce.toFixed(2)}}元</span>
					<span class="p-t-total">本订单红包最多可抵扣：￥{{$options.filters.priceToFixed(maxAmount)}}</span>
				</div>
				<div class="paper-b" v-show="preferentialShow.paper">
					<ul class="p-b-list">
						<li v-for="item in orders[0].bonusList">
							<i class="checker checked" @click="bonusSelect(item)" v-if="item.select"></i>
							<i class="checker" @click="bonusSelect(item)" v-if="!item.select"></i>
							<span class="amount">{{item.amount}}元红包</span>
							<p class="date">使用日期：{{item.effectiveTime}}~{{item.expiredTime}}</p>
						</li>
					</ul>

				</div>
			</div>
			<!--优惠券-->
			<div class="coupon" v-if="orders[0].canUseCoupon.length||orders[0].unusableCoupons.length">
				<div class="coupon-t">
					<i @click="togglePreferential(`coupon`)" :class="{'shrink':preferentialShow.coupon&!couponLock}"></i>
					<span class="c-t-title">使用优惠券</span>
					<span v-if="couponReduceNotice.reduceStr&&couponReduceNotice.reduceNum" class="c-t-use">已选择{{selectCouponList.length}}张优惠券,共抵扣{{couponReduceNotice.reduceNum.toFixed(2)}}元,{{couponReduceNotice.reduceStr}}</span>
					<span v-if="couponReduceNotice.reduceStr&&!couponReduceNotice.reduceNum" class="c-t-use">已选择{{selectCouponList.length}}张优惠券,{{couponReduceNotice.reduceStr}}</span>
					<span v-if="!couponReduceNotice.reduceStr" class="c-t-use">已选择{{selectCouponList.length}}张优惠券,共抵扣{{couponReduceNotice.reduceNum.toFixed(2)}}元</span>
					<span class="c-t-total" @click="goToPromotioncode(`coupon`)"><i></i> 优惠券使用规则</span>
				</div>
				<div class="coupon-b" v-show="preferentialShow.coupon&&!couponLock">
					<div class="c-b-coupons">
						<div class="coupons-column">
							<span :class="{'active':toggleCoupon}" @click="toggleCouponChange">可用优惠券（{{orders[0].canUseCoupon.length}}）</span>
							<span :class="{'active':!toggleCoupon}" @click="toggleCouponChange">不可用优惠券（{{orders[0].unusableCoupons.length}}）</span>
						</div>
						<!--优惠券循环-->
						<div class="coupons-list">
							<div class="coupons-list-box" v-if="toggleCoupon" v-for="orderItem in orders[0].canUseCoupon">
								<div class="item-coupon">
									<div class="i-c-t">
										<div class="coupon-amount">
											<h4 v-if="orderItem.couponTemplate.couponType!=2">¥{{orderItem.amount}}</h4>
											<h5 v-else>赠品券</h5>
											<span>{{orderItem.useDescription}}</span>
										</div>
										<!--赠品券-->
										<div class="zp-view" v-if="orderItem.couponTemplate.couponType==2">
											查看赠品>>
											<!--赠品券查看赠品-->
											<div class="coupon-gifts-box">
												<ul class="gifts-list" v-for="it in orderItem.giftCouponProductList">
													<li>
														<img :src="it.imgUrl" />
														<div class="g-l-info">
															<p>
																<i class="fz10">赠品</i>
																<span>{{it.productName}}</span>
															</p>
															<div style="flex: 1;"></div>
															<div class="g-l-info-spec">
																<span>规格：{{it.specName}}</span>
																<span v-if="it.productPrice&&it.productPrice.price<=0||!it.productPrice">{{'X'+it.buyCount}}{{it.unit}}</span>
																<span v-if="it.productPrice&&it.productPrice.price>0&&it.productSkuId == it.productSaleSpecId">{{'X'+it.buyCount}}{{it.saleUnit}}</span>
																<span v-if="it.productPrice&&it.productPrice.price>0&&it.productSkuId != it.productSaleSpecId">{{'X'+it.buyCount*it.saleSpecQuantity}}{{it.minUnit}}</span>
															</div>
														</div>
													</li>
												</ul>
											</div>
										</div>
										<div style="flex: 1;"></div>
										<div class="limit-date">有限期至：{{orderItem.timeExpired}}</div>
									</div>
									<div class="i-c-b">{{orderItem.couponTemplate.name}}</div>
									<!--优惠券勾选按钮-->
									<div @click="couponSelect(orderItem)" v-if="!orderItem.disable" :class="orderItem.select?'checker checked':'checker'"></div>
									<div v-if="orderItem.disable" class=" checker not-choose"></div>
								</div>
							</div>
							<div class="coupons-list-box canot-use-coupons" v-if="!toggleCoupon" v-for="orderItem in orders[0].unusableCoupons">
								<!--不可用券-->
								<div class="item-coupon">
									<div class="i-c-t">
										<div class="coupon-amount">
											<h4 v-if="orderItem.couponTemplate.couponType!=2">¥{{orderItem.amount}}</h4>
											<h5 v-else>赠品券</h5>
											<span>{{orderItem.useDescription}}</span>
										</div>
										<!--赠品券-->
										<div class="zp-view" v-if="orderItem.couponTemplate.couponType==2">
											查看赠品>>
											<!--赠品券查看赠品-->
											<div class="coupon-gifts-box">
												<ul class="gifts-list" v-for="it in orderItem.giftCouponProductList">
													<li>
														<img :src="it.imgUrl" />
														<div class="g-l-info">
															<p>
																<i class="fz10">赠品</i>
																<span>{{it.productName}}</span>
															</p>
															<div style="flex: 1;"></div>
															<div class="g-l-info-spec">
																<span>规格：{{it.specName}}</span>
																<span v-if="it.productPrice&&it.productPrice.price<=0||!it.productPrice">{{'X'+it.buyCount}}{{it.unit}}</span>
																<span v-if="it.productPrice&&it.productPrice.price>0&&it.productSkuId == it.productSaleSpecId">{{'X'+it.buyCount}}{{it.saleUnit}}</span>
																<span v-if="it.productPrice&&it.productPrice.price>0&&it.productSkuId != it.productSaleSpecId">{{'X'+it.buyCount*it.saleSpecQuantity}}{{it.minUnit}}</span>
															</div>
														</div>
													</li>
												</ul>
											</div>

										</div>
										<div style="flex: 1;"></div>
										<div class="limit-date">有限期至：{{orderItem.timeExpired}}</div>
									</div>
									<div class="i-c-b">{{orderItem.couponTemplate.name}}</div>
								</div>
								<!--优惠券不可用原因-->
								<div class="canot-use-reason" v-if="orderItem.canNotUseReason">
									<i></i>
									<span>{{orderItem.canNotUseReason}}</span>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
			<!--优惠码-->
			<div class="coupon-code" v-if="isCouponCodeValid">
				<div class="coupon-code-t">
					<i @click="togglePreferential(`couponCode`)" :class="{'shrink':preferentialShow.couponCode}"></i>
					<span class="c-t-title">使用优惠码</span>
					<span class="rules" @click="goToPromotioncode(`code`)"><i></i>使用说明</span>
				</div>
				<div class="coupon-code-b" v-show="preferentialShow.couponCode">
					<div class="coupon-code-frame">
						<input v-if="!couponCodeReadonly" class="ccf-input" maxlength="6" type="text" v-model="couponCode" @input="inputCouponCode" placeholder="请输入6位优惠码兑换码">
						<input v-if="couponCodeReadonly" readonly="readonly" class="ccf-input" v-model="couponCode">
						<div class="ccf-use-btn" :class="{'ccf-use-btn-active':couponCode.length==6}" @click="useCouponCode">使用</div>
						<div class="order-coupon-code-reset" v-if="couponCodeReadonly" @click="resetCouponCode">重新输入</div>
						<div class="coupon-code-notice">兑换码限字母A-Z、数字0-9</div>
					</div>
					<div class="coupon-code-desc ccd-faild" v-if="codeFaildDesc"><i class="faild-close" @click="closeCouponCodeFaildDesc"></i>{{codeFaildDesc}}</div>
					<div class="coupon-code-desc ccd-success" v-if="codeSuccessDesc">
						{{codeSuccessDesc}}
						<span v-if="orders[0].couponCodeReduceAmount">已为您节省{{orders[0].couponCodeReduceAmount}}元。</span>
					</div>
				</div>
			</div>
		</div>
		<!--促销信息-->
		<div class="promotion-wrap" v-if="orders[0]&&(orders[0].giveWineScore||orders[0].giveBonusAmount||orders[0].giveCouponAmount)">
			<h5 class="sc-title">促销信息</h5>
			<div class="p-w-box">
				<ul class="promotion-list">
					<li v-if="orders[0].giveWineScore">
						<span>送酒币</span>
						<p>本次交易赠送{{orders[0].giveWineScore}}个酒币</p>
					</li>
					<li v-if="orders[0].giveBonusAmount">
						<span>送红包</span>
						<p>本次交易赠送{{orders[0].giveBonusAmount}}元红包</p>
					</li>
					<li v-if="orders[0].giveCouponAmount">
						<span>送优惠券</span>
						<p>本次交易赠送{{orders[0].giveCouponAmount}}元优惠劵</p>
					</li>
				</ul>
			</div>
		</div>
		<!--留言备注-->
		<div class="remark-wrap">
			<h5 class="sc-title">给卖家留言</h5>
			<div class="r-w-box">
				<textarea v-model="remark" placeholder="选填：对本次交易的说明"></textarea>
			</div>
		</div>
		<!--结算信息-->
		<div class="settlement-wrap" v-if="orders.length">
			<ul class="subfield-column">
				<li>
					<span class='red'>{{totalCount+giftTotalCount}} </span>
					<span>商品，总商品总额：</span>
					<span v-if="orders[0].orderAmount" class="amount">￥{{orders[0].orderAmount.toFixed(2)}}</span>
				</li>
				<li v-if="orders[0].productReduceAmount">
					<span>产品立减：</span>
					<span class="amount">-￥{{orders[0].productReduceAmount.toFixed(2)}}</span>
				</li>
				<li v-if="orders[0].reduceAmount">
					<span>订单满减：</span>
					<span class="amount">-￥{{orders[0].reduceAmount.toFixed(2)}}</span>
				</li>
				<li v-if="selfPickUpReduceAmount&&currentDeliveryMode==4">
					<span>自提优惠：</span>
					<span class="amount">-￥{{selfPickUpReduceAmount.toFixed(2)}}</span>
				</li>
				<li v-if="couponReduceNotice.reduceNum">
					<span>使用优惠券：</span>
					<span class="amount">-￥{{couponReduceNotice.reduceNum.toFixed(2)}}</span>
				</li>
				<li v-if="bonusReduce">
					<span>使用红包：</span>
					<span class="amount">-￥{{bonusReduce.toFixed(2)}}</span>
				</li>
				<li v-if="orders[0].couponCodeReduceAmount">
					<span>使用优惠码：</span>
					<span class="amount">-￥{{orders[0].couponCodeReduceAmount.toFixed(2)}}</span>
				</li>
				<li v-if="!isSup&&!isDealer&&orders[0].lastOddBalanceAmount">
					<span>历次未收：</span>
					<span class="amount">-￥{{orders[0].lastOddBalanceAmount.toFixed(2)}}</span>
				</li>
				<li v-if="!isSup&&!isDealer&&oddBalanceMode==0&&(orders[0].lastOddBalanceAmount!=0||oddBalanceAmount)">
					<span>本次零头：</span>
					<span class="amount">-￥{{oddBalanceAmount.toFixed(2)}}</span>
				</li>

			</ul>
			<div class="summary-column">
				<div class="s-c-item" v-if="discountAmount">
					<span>优惠：</span>
					<span class="total-reduce">￥{{discountAmount.toFixed(2)}}</span>
				</div>
				<div class="s-c-item">
					<span>实付款：</span>
					<span class="total-amount">￥{{payAmount.toFixed(2)}}</span>
				</div>
			</div>
			<div class="confirm-order" @click="debounceConfirmSubmit"><span>提交订单</span></div>
		</div>

		<!--切换收货地址弹窗-->
		<el-dialog title="请选择自提地址" :visible.sync="showSelfPickDialog" width="50%" center>
			<div class="limit-pay-box">
				<ul>
					<li class="self-pick-ads-list" v-for="item in wareHouseList">
						<i class="checker" :class="{'checked':item.warehouseId==currentWareHouse.warehouseId}" @click="selectSelf(item)"></i>
						<p>{{item.province+item.city+item.detailAddress+item.warehouseName}}</p>
					</li>
				</ul>
				<!--底部确认取消-->
				<!--<div class="lpb-bottom">
					<span class="confirm" @click="selectSelfPickOperate(`confirm`)">确定</span>
					<span class="cancel" @click="selectSelfPickOperate(`cancel`)">取消</span>
				</div>-->
			</div>
		</el-dialog>

		<!--切换地址购买限制弹窗-->
		<el-dialog title="温馨提示" :visible.sync="showLimitPayDialog" width="50%" center>
			<div class="limit-pay-box">
				<div class="lpb-tips">
					<i></i>
					<p>切换地址后，您选购的以下商品超出购买限制；您可以返回购物车重新添加商品， 也可以取消该操作</p>
				</div>
				<div class="lpb-content">
					<ul class="group-list" v-if="invalidObj.qsInvalid&&invalidObj.qsInvalid.length" v-for="item in invalidObj.qsInvalid">
						<li>
							<h5>{{item.zoneName}}</h5>
							<p>{{item.invalidReason}}</p>
						</li>
					</ul>
					<div class="limit-box" v-if="invalidObj.areaInvalidProduct&&invalidObj.areaInvalidProduct.length" v-for="item in invalidObj.areaInvalidProduct">
						<h5>以下商品超出购买限制：</h5>
						<ul class="product-list">
							<li>
								<img v-lazy="item.product.imgUrl" />
								<!--不能购买原因-->
								<div class="no-can-buy-tag">{{item.invalidReason}}</div>
							</li>
						</ul>
					</div>
				</div>
				<!--底部确认取消-->
				<div class="lpb-bottom">
					<span class="confirm" @click="limitPayOperate(`confirm`)">返回添加</span>
					<span class="cancel" @click="limitPayOperate(`cancel`)">取消</span>
				</div>
			</div>
		</el-dialog>

		<!--优惠码提示弹窗-->
		<el-dialog title="温馨提示" :visible.sync="couponCodeDialog.show" width="50%" center :close-on-click-modal=false>
			<div class="limit-pay-box">
				<div class="dialog-content-wrap" v-html="couponCodeDialog.content"></div>
				<!--底部确认取消-->
				<div class="lpb-bottom" v-if="couponCodeDialog.type==0">
					<span class="cancel" @click="couponCodeOperate(`cancel`)">放弃使用</span>
					<span class="confirm" @click="couponCodeOperate(`confirm`)">确认使用</span>
				</div>
				<div class="lpb-bottom" v-else-if="couponCodeDialog.type==1">
					<span class="cancel" @click="couponCodeOperate(`cancel`)">取消</span>
					<span class="confirm" @click="couponCodeOperate(`confirm`)">添加商品</span>
				</div>
			</div>
		</el-dialog>

		<!--优惠码添加商品弹窗-->
		<el-dialog title="添加商品" :visible.sync="couponCodeAddDialog" width="50%" center :close-on-click-modal=false>
			<div class="limit-pay-box">
				<div>
					<coupon-code-directional v-bind:product="couponCodeTransData.product" v-bind:code-obj="couponCodeTransData"></coupon-code-directional>
				</div>
				<!--底部确认-->
				<div class="lpb-bottom">
					<span class="confirm" @click="confirmCouponCode">添加商品</span>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<style lang="stylus" scoped>
	@import "./stylus/settlement.styl"
</style>

<style type="text/css">
	.coupons-list-box {
		float: left\9\0;
	}
</style>

<script>
	import { mapGetters, mapActions } from "vuex";
	import * as $cache from "common/cache";
	import ListingProduct from './../../components/settlement/listingProduct.vue'
	import CouponCodeDirectional from './../../components/settlement/couponCodeDirectional.vue'
	import * as orderSubmitApi from "api/orderSubmit/orderSubmit"
	import * as CouponCodeUtil from "common/orderSubmit/couponCodeUtil"
	import * as CouponSelectUtil from "common/orderSubmit/couponSelectUtil"
	import * as DateUtil from "common/DateUtil"
	import * as SwitchAddressJs from "common/switchAddress"
	import { getPrepareParams, getOrderSubmitParams } from "common/orderSubmit/orderSubmit"
	import { SetDefaultAddress, GetAddressList, QueryWarehouseList } from "api/assetsCenter/assetsCenter"
	import bus from "common/bus";
	import { debounce } from "common/lodash";

	export default {
		data() {
			return {
				couponCodeReadonly: false,
				codeFaildDesc: '',
				codeSuccessDesc: '',
				showAllAddress: false,
				showSelfPickDialog: false, //切换自提地点弹窗
				showLimitPayDialog: false, //切换地址购买限制弹窗

				couponCodeDialog: { //优惠码提示弹窗
					show: false,
					type: 0, //优惠码提示弹窗类型，0:优惠码与优惠券不能同时使用；1:不满足优惠码使用条件
					content: ''
				},
				couponCodeTransData: { //优惠码提示信息
					product: {}
				},
				couponCodeAddDialog: false, //优惠码添加商品弹窗
				defaultAddressIdx: 0,
				preferentialShow: {
					paper: true, //红包选择框是否显示
					coupon: true, //优惠券择框是否显示
					couponCode: true //优惠码择框是否显示
				},
				toggleCoupon: true, //可用优惠券不可用切换
				orders: [],
				selfPickTimeNotice: '下单后24小时内有效，逾期将自动取消订单(预售商品到货后短信通知)',
				productList: [], //购买商品列表
				originalProductList: [], //原始商品列表，用于取消使用优惠码时
				customGiftProducts: [], //合作商自定义赠品列表
				wareHouseList: [], //自提仓库列表
				userAddress: [], //用户收货地址列表
				useBonusIds: [], //使用的红包列表
				useCouponIds: [], //使用的优惠券列表
				selectCouponList: [], //已选的优惠券列表
				selectBonusList: [], //已选的优惠券列表
				couponLock: false,
				couponReduceNotice: {
					reduceNum: 0,
					reduceStr: ``
				}, //使用优惠券
				couponCodeDetail: {}, //优惠码详情
				codeFaildDesc: ``, //优惠码不能使用的原因
				codeSuccessDesc: ``,
				noRefreshProducs: false,
				resetCouponCodeShow: false,
				couponCodeReadonly: false,
				bonusReduce: 0, //使用红包
				couponCode: ``, //优惠码
				hadAutoSelectCoupon: false, //是否已经自动选择过优惠券了
				couponCodeReduceAmount: 0, //优惠码优惠金额
				remark: ``, //防止多次预查询，保存remark
				currentWareHouse: undefined, //当前自提仓库
				currentAddress: undefined, //当前送货地址
				canSelfPickUp: false, //是否能够自提
				deliveryModeShowType: 0, //展示易久批配送和仓库自提(0),仅展示易久批配送(1),仅展示仓库自提(2)
				currentDeliveryMode: 0, //选中的配送方式,酒批配送(0),合作商配送(1),配送商配送(2),第三方配送(3),客户自提(4),总部物流(5),区域代配送(6),
				currentPayType: 0, //选中的支付方式,货到付款(0),微信支付(1),支付宝支付(2),银联支付(3),连连支付(5),易酒贷(6),已在线支付(10),线下转账(11),经销商收款(12),
				couponGiftCount: 0, //赠品券的赠品数量
				needCheckAddress: false, //是否需要校正地址
				currentLocation: null, //当前定位的地址
				isSuggestAddress: false,
				specialAreaId: '',
				selfPickUpReduceAmount: 0,
				orderGoodsSpecIdArr: [], //订单商品skuid数组
				prepareParams: {}, //订单预查询参数
				originalPrepareParams: {}, //原始订单预查询参数，用于取消使用优惠码时
				//异常信息
				invalidObj: {},
				//自提优惠金额
				selfPickUpReduceAmount: 0,
				//赠品列表（包含赠品券）
				fullGiftProducts: [],
				//赠品数量
				giftTotalCount: 0,
				isCouponCodeValid: false,
				prepareTypeObj: {},
			}
		},
		computed: {
			//获取启用的地址
			filterUserAddress: function() {
				let showAddress = this.userAddress.filter(function(item) {
					return item.state == 1
				})
				//默认地址放第一
				return showAddress.sort(this.ascend("defaultAddress"))
			}
		},
		components: {
			ListingProduct,
			CouponCodeDirectional
		},
		beforeCreate: function() {

		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$createTalkingData("OrderSettle", "", {}, 1)
			})
		},
		beforeRouteLeave(to, from, next) {
			this.$createTalkingData("OrderSettle", "", {}, 2)
			next()
		},
		created: function() {
			this.initSubmitParams()
			this.prepareOrder()
		},
		mounted() {
			bus.$on("needCountChange", (data) => {
				this.couponCodeTransData.lastNeedCount = data
			});
			bus.$on("initCondition", (data) => {
				this.couponCodeTransData.conditionTxt = data
			});
			this.debounceConfirmSubmit = debounce(this.confirmSubmit, 300, false)
		},
		methods: {
			...mapActions(["initUserDefaultAddress", "saveCartCount"]),
			//初始化购物车中传来的数据
			initSubmitParams() {
				this.productList = JSON.parse($cache.getCache("prepareProductList"))
				this.userAddress = JSON.parse(localStorage.getItem("USER_ADDRESS"))
				let productList = this.productList
				//
				this.originalProductList = this.productList
				//优惠码，需要计算数量，防止为空
				for(let product of productList) {
					//马上进货组件加减框没有buycount属性
					product.buyNum = product.buyNum || product.buyCount
					product.buyCount = product.buyNum
					if(product.imgsUrl && product.imgsUrl.length == 0) {
						product.imgsUrl[0] = '/assets/images/defaul_product.png'
					}
					//限时惠不可用券
					if(product && product.enjoyPromotions && product.enjoyPromotions[0] &&
						product.enjoyPromotions[0].promotionType == 4) {
						product.isUseCoupon = false
						product.unCouponText = '不可用优惠券'
						product.couponText = ''
					}
					this.orderGoodsSpecIdArr.push(product.productSkuId)
				}
				//TODO是否从购物车添加进来的
				this.fromShoppingCar = false
				//合作商
				this.isSup = productList[0].saleMode == 2
				//经销商
				this.isDealer = productList[0].saleMode == 6
				//隐藏优惠码
				this.isCouponCodeValid = productList.some(item => item.productType != 4 && item.productType != 2) && !this.isDealer
				//TODO:是否通过自提下单进来的
				this.isSelfPickUp = false
				//TODO:零头结余相关
				this.oddBalanceMode = JSON.parse(localStorage.getItem("APP_SETTING")).oddBalanceMode
				//TODO专区id
				this.specialAreaId = ''
				this.currentAddress = this.userAddress.find(item => item.addressId == localStorage.getItem("defaultAddressId")) || this.userAddress[0]
				this.getWareHouseList()
			},
			/*
			 * 订单预查询
			 * prepareType：预查询类型。0：添加商品预查询；1：取消使用优惠码预查询；2：优惠码验证成功满足使用条件预查询
			 */
			prepareOrder(type) {
				//获取预查询的参数
				let prepareParams
				if(type && (type.prepareType == 0 || type.prepareType == 1 || type.prepareType == 2)) {
					prepareParams = this.prepareParams
				} else {
					prepareParams = getPrepareParams.call(this, type)
					this.prepareParams = prepareParams
					this.originalPrepareParams = prepareParams
				}
				//调用预查询
				orderSubmitApi.PrepareQuery(prepareParams).then(data => {
					if(data.success) {
						/*
						 * 优惠码添加产品需要更新商品数据
						 * 优惠码添加产品后，需要判断订单商品orderGoodsSpecIdArr数组中是否包含改优惠码产品skuid，没有则添加
						 */
						if(type && (type.prepareType == 0 || type.prepareType == 2)) {
							this.updateProductList()
						}
						let invalidItems = data.data[0].invalidItems
						//如果预查询成功，但是商品起送配送方式有异常
						if(invalidItems && invalidItems.length > 0) {
							let invalidObj = {
								areaInvalidProduct: [],
								qsInvalid: []
							}
							for(let it of invalidItems) {
								it.product = this.productList.find(item => item.productSkuId == it.productSkuId &&
									item.productSaleSpecId == it.productSaleSpecId)
								if(it.invalidType == 1) {
									invalidObj.qsInvalid.push(it)
								} else {
									invalidObj.areaInvalidProduct.push(it)
								}
							}
							this.showLimitPayDialog = true
							this.invalidObj = invalidObj
						} else {
							this.getDeliveryModeShowType(data.data[0].choiceDeliveryMode)
							//重新构造订单数据
							this.orders = this.reuildOrders(data.data)
							this.reCalcPrice(this.currentPayType)
							//初始化
							this.initSelectState()
							if(type) {
								if(type.prepareType == 0 || type.prepareType == 1) {
									this.couponCode = ``
									this.codeSuccessDesc = ``
									this.couponCodeReadonly = false
								} else if(type.prepareType == 2) {
									const {
										couponCodeData,
										conditionTxt
									} = this.couponCodeTransData
									console.log(this.couponCodeTransData)
									let codeSuccessDesc = "该优惠码定向产品【" + couponCodeData.productName + "】" + [conditionTxt] + ",将于" + DateUtil.getDateStr(couponCodeData.expireTime) + "过期。"
									this.codeSuccessDesc = codeSuccessDesc
									this.couponCodeReadonly = true
									this.couponLock = true
								} else {
									//如果是切换地址后的预查询到这里,此时说明切换地址成功
									this.currentAddress = this.userAddress.find(item => item.addressId == type) || this.userAddress[0]
									localStorage.setItem("defaultAddressId", this.currentAddress.addressId)
									const {
										province,
										city,
										county,
										street,
										detailAddress
									} = this.currentAddress
									let currentAds = province + city + county + street + detailAddress
									localStorage.setItem("USER_DEFAULT_ADDRESS", currentAds)
                  this.initUserDefaultAddress({
                    userDefaultAddress: currentAds,
                    refresh: true})
									//重新请求购物车角标数量
									this.saveCartCount()
								}
							}
						}
					} else {
						//TODO : 给出提示，返回上一页
						this.$alert(data.desc);
					}
				})
			},
			//处理预查询返回的订单
			reuildOrders(data) {
				let {
					isSup,
					isDealer,
					productList
				} = this
				if(!data || !data.length) {
					return []
				} else if(isSup) {
					return this.processSupPrepareOrders(data)
				} else {
					return this.processJiupiPrepareOrders(data)
				}
			},
			//凑单商品部分凑单时，会出现2个一样的sku，这里需要特殊处理
			dealGatherProduct(prepareDataItem) {
				let finalReturnData = []
				//参与凑单的商品
				let gatherItemList = []
				//其他(包含部分凑单的商品)
				let other = []
				for(let item of prepareDataItem) {
					if(item.sourceType == 7) {
						gatherItemList.push(item)
					} else {
						other.push(item)
					}
				}
				//计算交集为部分参与凑单的商品
				let jiaoji = []
				for(let item of other) {
					let contain = this.productItemContain(gatherItemList, item)
					if(contain) {
						jiaoji.push(item)
					}
				}
				//除去交集
				if(jiaoji.length) {
					for(let it of prepareDataItem) {
						let allContain = this.productItemAllContain(jiaoji, it)
						if(!allContain) {
							finalReturnData.push(it)
						}
					}
					return finalReturnData
				} else {
					return prepareDataItem
				}
			},
			//list是否完全包含it
			productItemAllContain(list, it) {
				let contain = false
				for(let item of list) {
					if(item.productSkuId == it.productSkuId && item.productSaleSpecId == it.productSaleSpecId && item.sourceId == it.sourceId &&
						item.sourceType == it.sourceType) {
						contain = true
					}
				}
				return contain
			},
			//list是否包含it
			productItemContain(list, it) {
				let contain = false
				for(let item of list) {
					if(item.productSkuId == it.productSkuId && item.productSaleSpecId == it.productSaleSpecId) {
						contain = true
					}
				}
				return contain
			},
			//用原来传入的产品的原始数据与预查询返回的数据结合
			dealItemGroupsData(prepareData, productList) {
				for(var i = 0; i < prepareData.length; i++) {
					let areaTotalCount = 0
					let prepareDataItem = prepareData[i].productItems
					//TODO:凑单商品部分凑单时，会出现2个一样的sku，这里需要特殊处理
					prepareDataItem = this.dealGatherProduct(prepareDataItem)
					//商品的详细信息
					let productDetailItem = []
					for(let prepare of prepareDataItem) {
						//考虑组合活动,凑单(不比较sourceId),
						let product = productList.find(item => item.productSkuId == prepare.productSkuId &&
							item.productSaleSpecId == prepare.productSaleSpecId)
						//如果是打折促销或者限时惠
						if(prepare.sourceType == 3 || prepare.sourceType == 4) {
							product = productList.find(item => item.productSkuId == prepare.productSkuId &&
								item.productSaleSpecId == prepare.productSaleSpecId && item.sourceId == prepare.sourceId)
						}
						if(product) {
							//TODO :价格等信息以预查询的为主,但是预查询给出数据的信息不全，这里做个补充
							product.price = prepare.sellingPrice
							if(product.productPrice) {
								product.productPrice.price = prepare.sellingPrice
							}
						} else {
							product = prepare
						}
						productDetailItem.push(product)
						//计算单个分区的总数
						areaTotalCount += (prepare.productSkuId == prepare.productSaleSpecId ? prepare.buyCount : prepare.buyCount * prepare.saleSpecQuantity)
					}
					prepareData[i].productDetailItem = productDetailItem
					prepareData[i].areaTotalCount = areaTotalCount
				}
				return prepareData
			},
			//处理酒批预查询订单
			processJiupiPrepareOrders(orders) {
				let {
					productList,
					remark,
					currentPayType
				} = this
				let order = orders[0]
				//用原来传入的产品的原始数据与预查询返回的数据结合
				order.itemGroups = this.dealItemGroupsData(order.itemGroups, productList)
				order.totalCount = 0
				//总数量
				for(let product of productList) {
					order.totalCount += (product.productSkuId == product.productSaleSpecId ? product.buyCount : product.buyCount * product.saleSpecQuantity)
				}
				//赠品总数量
				order.giftTotalCount = 0
				for(let gift of order.fullGiftProducts) {
					order.giftTotalCount += gift.buyCount
				}
				order.payTypes = [0]
				//获取保存的remark
				order.remark = remark

				this.totalCount = order.totalCount
				//当前所有可选的优惠券
				order.canUseCoupon = []
				//当前预查询的所有商品
				let usableCouponGroups = order.usableCouponGroups
				for(let item of usableCouponGroups) {
					for(let it of item.coupons) {
						it.usableSkuIds = item.usableSkuIds
						if(it.suggested) {
							it.select = true
						}
						order.canUseCoupon.push(it)
					}
				}
				//查询优惠券中的所有赠品信息,同时自动选券
				//				this.queryGiftProductInfo(order,autoSelectCoupons)
				//如果包含优惠码，不需要走后面的自动选券
				if(!this.couponCode) {
					this.autoSelectCoupons(order)
				} else {
					this.fullGiftProducts = []
					for(let gift of order.fullGiftProducts) {
						this.fullGiftProducts.push(gift)
					}
				}
				return [order]
			},
			//处理合作商预查询订单
			processSupPrepareOrders(orders) {
				let productList = this.productList
				let totalCount = 0
				let supTotalPayableAmount = 0
				for(let order of orders) {
					//把产品的原始数据放到分别放到相应的order里面
					order.itemGroups = this.dealItemGroupsData(order.itemGroups, productList)
					order.totalCount = 0
					order.giftTotalCount = 0
					for(let item of productList) {
						if(item.companyId == order.companyId) {
							order.totalCount += item.buyCount
						}
					}
					//处理合作商的赠品，分为普通赠品和自定义赠品，区分方式是自定义赠品没有skuId
					if(order.fullGiftProducts && order.fullGiftProducts.length) {
						order.customGiftProducts = []
						for(let gift of order.fullGiftProducts) {
							if(!gift.productSkuId) {
								order.customGiftProducts.push(gift)
							}
						}
						//从fullGiftProducts中移除自定义赠品
						order.fullGiftProducts = order.fullGiftProducts.filter(item => item.productSkuId != null && item.productSkuId != undefined && item.productSkuId != ``)
					}
					//单个订单赠品总数量
					for(let gift of order.fullGiftProducts) {
						order.giftTotalCount += gift.buyCount
					}
					//总数量
					for(let product of order.itemGroups) {
						for(let it of product.productItems) {
							totalCount += it.buyCount
						}
					}
					//总金额
					supTotalPayableAmount += order.payableAmount
					//当前所有可选的优惠券
					order.canUseCoupon = []
				}

				//设置预查询的总金额和总数量
				this.totalCount = totalCount
				this.supTotalPayableAmount = supTotalPayableAmount
				return orders
			},
			//获取已经自动选中的优惠券
			autoSelectCoupons(order) {
				let usableCouponGroups = order.usableCouponGroups
				//当前建议选中的优惠券
				let selectCouponList = []
				//当前预查询的所有商品
				let productList = []
				for(let item of usableCouponGroups) {
					for(let it of item.coupons) {
						if(it.suggested) {
							it.usableSkuIds = item.usableSkuIds
							selectCouponList.push(it)
						}
					}
				}
				for(let item of order.itemGroups) {
					for(let it of item.productItems) {
						productList.push(it)
					}
				}
				//当前所有商品的金额相关
				this.couponProductList = productList
				let couponReduceNotice = CouponSelectUtil.getSelectCouponReduce(selectCouponList, productList)
				//判断选中的是否有赠品券
				let selectGiftCoupon = selectCouponList.filter(item => item.couponTemplate.couponType == 2)
				//				if(selectGiftCoupon && selectGiftCoupon.length > 0) {
				//查询优惠券中的所有赠品信息,同时处理选择的赠品券
				this.queryGiftProductInfo(order, selectGiftCoupon)
				//				}
				this.couponReduceNotice.reduceNum = couponReduceNotice.reduceNum
				this.selectCouponList = selectCouponList
			},

			//计算价格(传这个值的原因是切换支付方式会导致是否要抹零变化)
			reCalcPrice(currentPayType) {
				let {
					orders,
					productList,
					couponReduceNotice,
					bonusReduce,
					currentDeliveryMode,
					isDealer,
					isSup,
					oddBalanceMode
				} = this
				//订单总价
				let orderAmount = orders[0].orderAmount
				//产品立减
				let productReduceAmount = orders[0].productReduceAmount
				//订单满减
				let reduceAmount = orders[0].reduceAmount
				//使用优惠券
				let couponReduce = parseFloat(couponReduceNotice.reduceNum)
				//使用优惠码
				let couponCodeReduceAmount = orders[0].couponCodeReduceAmount
				//自提优惠
				let selfPickUpReduceAmount = 0
				//历次未收
				let lastOddBalanceAmount = orders[0].lastOddBalanceAmount || 0
				//计算自提优惠金额
				for(let product of productList) {
					selfPickUpReduceAmount += (product.productPrice.selfPickUpReduceAmount || 0) * (product.saleSpecQuantity || 1) * product.buyCount
				}
				//赠品数量
				let giftTotalCount = 0
				if(this.fullGiftProducts.length) {
					for(let gift of this.fullGiftProducts) {
						giftTotalCount += gift.buyCount
					}
				}
				//优惠金额
				let discountAmount = productReduceAmount + reduceAmount + (currentDeliveryMode == 4 ? selfPickUpReduceAmount : 0) + couponReduce + bonusReduce + couponCodeReduceAmount
				//最大可用红包金额(红包金额必须放在计算零头之前，不然会有影响)
				let totalBonusAmount = 0
				if(orders[0].bonusList && orders[0].bonusList.length) {
					for(let bonus of orders[0].bonusList) {
						totalBonusAmount += bonus.amount
					}
				}
				let maxAmount = Math.min(totalBonusAmount, orderAmount - discountAmount + bonusReduce, orders[0].useableBonusAmount)
				//计算零头结余
				let oddBalanceAmount = 0
				//实付款
				let payAmount = 0
				if(oddBalanceMode == 0 && !isDealer && currentPayType != 1 && !isSup) {
					//开启了零头结余
					let tempAmount = parseFloat((orderAmount - discountAmount + lastOddBalanceAmount).toFixed(2))
					oddBalanceAmount = tempAmount % 1
					payAmount = tempAmount - oddBalanceAmount
				} else {
					//不开启零头结余，即使返回了历次未收也不要参与计算
					payAmount = orderAmount - discountAmount
				}
				//防止支付金额小于0
				payAmount = payAmount < 0 ? 0 : payAmount

				this.selfPickUpReduceAmount = selfPickUpReduceAmount
				this.oddBalanceAmount = oddBalanceAmount
				this.discountAmount = discountAmount
				this.payAmount = payAmount
				this.totalPayableAmount = payAmount
				this.maxAmount = maxAmount
				this.lastOddBalanceAmount = lastOddBalanceAmount
				this.giftTotalCount = giftTotalCount

			},
			//重新选择配送方式，当选择的地址是仅配送或者仅自提的话，配送方式也要相应的变化
			getDeliveryModeShowType(data) {
				let {
					isSelfPickUp,
					isDealer,
					productList,
					currentDeliveryMode,
					deliveryModeShowType,
					canSelfPickUp
				} = this
				//是否可以自提
				// deliveryModeShowType 0 - 可配送可自提， 1 - 可配送 ，2 - 可自提
				if(data.indexOf(0) > -1) {
					deliveryModeShowType = 1
				}
				if(data.indexOf(1) > -1) {
					deliveryModeShowType = 2
					canSelfPickUp = true
				}
				if(data.indexOf(0) > -1 && data.indexOf(1) > -1) {
					deliveryModeShowType = 0
					canSelfPickUp = true
				}

				//自提，非经销商，可自提
				if(isSelfPickUp && !isDealer && data.indexOf(1) > -1) {
					currentDeliveryMode = 4
				} else {
					currentDeliveryMode = 0
				}
				this.deliveryModeShowType = deliveryModeShowType
				this.currentDeliveryMode = currentDeliveryMode
				this.canSelfPickUp = canSelfPickUp
			},
			ascend(defaultAddress) {
				return function(a, b) {
					let value1 = a[defaultAddress]
					let value2 = b[defaultAddress]
					return value2 - value1
				}
			},
			//设置默认地址data是地址 id
			setDefaultAddress(addressId) {
				let data = addressId
				SetDefaultAddress({
					data
				}).then(data => {
					if(data.success) {
						let userAddress = this.userAddress
						for(let item of userAddress) {
							if(item.addressId == addressId) {
								item.defaultAddress = true
							} else {
								item.defaultAddress = false
							}
						}
						this.userAddress = userAddress
					}
				});
				this.$createTalkingData("OrderSettle", "Address_List_SetDefault", {Address_List_SetDefault:addressId})
			},
			//获取收货地址列表
			//	    getAddressList() {
			//	      let datas = [0, 1, 2, 3]
			//	      GetAddressList({ datas }).then(data => {
			//	        if (data.success) {
			//	          this.userAddress = data.data;
			//	        }
			//	      });
			//	    },
			//自提仓库列表
			getWareHouseList() {
				QueryWarehouseList().then(data => {
					if(data.data && data.data.length) {
						this.currentWareHouse = data.data.find(item => item.defaultWarehouse == true) || data.data[0]
						this.wareHouseList = data.data
					}
				})
				//全预售商品
				let allPresaleOrder = this.productList.every(item => item.stockState == 4)
				//全部不预售
				let allNotPresaleOrder = this.productList.every(item => item.stockState != 4)
				this.selfPickTimeNotice = allPresaleOrder ? `预售商品到货后短信通知` : allNotPresaleOrder ? `下单后24小时内有效，逾期将自动取消订单` : `下单后24小时内有效，逾期将自动取消订单(预售商品到货后短信通知)`
			},
			//选择自提地点
			selectSelfPick() {
				this.showSelfPickDialog = true
			},
			selectSelfPickOperate(type) {
				this.showSelfPickDialog = false
			},
			//切换自提地址
			selectSelf(it) {
				this.currentWareHouse = it
				this.showSelfPickDialog = false
			},
			//展开所有收货地址
			toggleAllAddress() {
				this.showAllAddress = !this.showAllAddress
			},
			//新增收货地址
			addAddress() {
				let routeData = this.$router.resolve({
					name: 'receiveAddress'
				});
				window.open(routeData.href, '_black');

				this.$createTalkingData("OrderSettle", "", {}, 2)
				//新增收货地址点击埋点
				this.$createTalkingData("OrderSettle", "Address_List", {IsSuccess:true})

			},
			//选择配送方式
			onSelectDeliveryType(type) {
				this.currentDeliveryMode = parseInt(type)
				this.reCalcPrice(this.currentDeliveryMode)
			},
			limitPayOperate(type) {
				if(type == `confirm`) {
					//返回添加去购物车
					this.$router.push("/cartIndex/shopCart");
				}
				this.showLimitPayDialog = false
			},
			//红包，优惠券，优惠码展开收起
			togglePreferential(type) {
				this.preferentialShow[type] = !this.preferentialShow[type]
				//优惠券锁定
				if(type == `coupon` && this.couponLock) {
					this.$alert("优惠码优惠券不能同时使用");
				}
			},
			toggleCouponChange() {
				this.toggleCoupon = !this.toggleCoupon
			},
			//查看优惠码,优惠券使用说明
			goToPromotioncode(type) {
				let name = type == `coupon` ? `faq` : `promotioncode`
				let routeData = this.$router.resolve({
					name: name
				});
				window.open(routeData.href, '_black');
				this.$createTalkingData("OrderSettle", "", {}, 2)
			},
			//输入优惠码
			inputCouponCode(e) {
				CouponCodeUtil.changeCouponCode.call(this, e)
			},
			//使用优惠码
			useCouponCode() {
				CouponCodeUtil.confrimCouponCode.call(this)
			},
			//关闭优惠码错误提示
			closeCouponCodeFaildDesc() {
				this.codeFaildDesc = ""
			},
			//优惠码弹窗操作
			couponCodeOperate(type) {
				if(type == `cancel`) {
					this.couponCodeDialog.show = false
					//放弃使用优惠码，清空优惠码输入框
					if(this.couponCodeDialog.type == 0) {
						this.couponCode = ''
					}
				} else {
					//不满足优惠码使用条件添加商品
					if(this.couponCodeDialog.type == 1) {
						this.couponCodeDialog.show = false
						//获取优惠码定向产品详情
						CouponCodeUtil.getCouponCodeProduct.call(this)
					}
					//优惠码优惠券不能同时使用
					if(this.couponCodeDialog.type == 0) {
						this.couponCodeDialog.show = false
						CouponCodeUtil.preferentialCheck.call(this, `confrimCouponCode`)
					}
				}
			},
			//确认添加优惠码商品
			confirmCouponCode() {
				this.couponCodeAddDialog = false
				CouponCodeUtil.addComfirm.call(this)
			},
			//优惠码更新商品数据
			updateProductList() {
				CouponCodeUtil.couponCodeUptae.call(this)
			},
			//重置优惠码
			resetCouponCode() {
				CouponCodeUtil.resetCode.call(this)
			},
			//订单提交防抖动
			debounceConfirmSubmit() {
				this.debounceConfirmSubmit()
			},
			confirmSubmit() {

				let {
					totalPayableAmount,
					supTotalPayableAmount,
					currentDeliveryMode,
					currentPayType,
					bonusReduce,
					couponReduceNotice,
					isSup,
					canBackShopCart
				} = this
				let amount = isSup ? supTotalPayableAmount : totalPayableAmount
				//易酒批订单
				let isYjpOrder = false
				//构造订单提交的参数
				let submitParams = getOrderSubmitParams.call(this)
				if(submitParams[0].orderType == 0) {
					isYjpOrder = true
				}
				orderSubmitApi.OrderSubmit({
					datas: submitParams
				}).then(data => {
					let placeOrderTime = data.serviceTime
					if(data.success && data.data.length) {
						let orderNOs = JSON.stringify(data.data)
						this.outOrderPolling(data.data).then(data => {
							//TODO:订单提交成功
							this.$router.push({
								path: "/submitOrderHeader/submitOrderSuccess",
								query: {
									totalPayableAmount: amount,
									currentDeliveryMode,
									orderNOs,
									currentPayType,
									placeOrderTime,
									canBackShopCart,
									isYjpOrder
								}
							});
						}).catch(e => {
							//TODO:订单提交失败
							this.$router.push({
								path: "/submitOrderHeader/submitOrderFail",
								query: {
									data: e,
									totalPayableAmount: amount,
									currentDeliveryMode,
									currentPayType,
									submitParams: JSON.stringify(submitParams),
									placeOrderTime,
									canBackShopCart
								}
							});
						})
					} else {
						this.$router.push({
							path: "/submitOrderHeader/submitOrderFail",
							query: {
								data: data.desc,
								totalPayableAmount: amount,
								currentDeliveryMode,
								currentPayType,
								submitParams: JSON.stringify(submitParams),
								placeOrderTime,
								canBackShopCart
							}
						});
					}
				})
				//添加订单提交埋点
				this.$createTalkingData("OrderSettle", "OrderSettle_OrderSubmit", {
					IsUseCoupon: couponReduceNotice.reduceNum > 0 ? true : false,
					IsUseBonus: bonusReduce > 0 ? true : false,
					DeliveryChoice: isSup ? 2 : 1,
					PayType: 0
				})
			},
			outOrderPolling(orderNOs) {
				//轮询次数
				let retryTimes = 0
				if(retryTimes >= 20) {
					return Promise.reject(`订单轮询失败`)
				}
				return orderSubmitApi.orderPolling({
					datas: orderNOs
				}).then(data => {
					if(data.data.every(item => item.hasSuccess == true)) {
						return data
					} else {
						retryTimes++
						return this.outOrderPolling(orderNOs)
					}
				}).catch(e => {
					return Promise.reject(`订单轮询失败`)
				})
			},
			//红包选择
			bonusSelect(bonus) {
				bonus.select = !bonus.select
				let index = this.orders[0].bonusList.findIndex(item => item.bonusId == bonus.bonusId)
				this.$set(this.orders[0].bonusList, index, bonus);
				//已选
				this.selectBonusList = this.orders[0].bonusList.filter(item => item.select)
				this.bonusReduce = 0
				for(let it of this.selectBonusList) {
					if(it.select) {
						this.bonusReduce = this.bonusReduce + it.amount
					}
				}
				//已经使用的优惠券
				let couponReduce = parseFloat(this.couponReduceNotice.reduceNum)
				//优先使用优惠券，红包最大可用金额为商品总额-优惠券金额
				this.bonusReduce = Math.min(this.bonusReduce, this.orders[0].useableBonusAmount - couponReduce)
				this.reCalcPrice(this.currentPayType)

				//是否重选了红包埋点
				this.$createTalkingData("OrderSettle", "OrderSettle_SelectBonusResult", {IsReselect:true})
			},
			//优惠券选择
			couponSelect(coupon) {
				coupon.select = !coupon.select
				let index = this.orders[0].canUseCoupon.findIndex(item => item.couponId == coupon.couponId)
				this.$set(this.orders[0].canUseCoupon, index, coupon);
				//计算立减相关金额
				let selectCouponList = []
				for(let it of this.orders[0].canUseCoupon) {
					if(it.select) {
						selectCouponList.push(it)
					}
				}
				this.selectCouponList = selectCouponList
				this.couponReduceNotice = CouponSelectUtil.getSelectCouponReduce(selectCouponList, this.couponProductList)
				this.dealCouponDisable(selectCouponList)

				//处理赠品券相关信息
				let selectGiftCoupon = this.selectCouponList.filter(item => item.couponTemplate.couponType == 2)
				this.onAddCouponGift(selectGiftCoupon)
				this.reCalcPrice(this.currentPayType)
				//是否重选了优惠券埋点
				this.$createTalkingData("OrderSettle", "OrderSettle_SelectCouponResult", {IsReselect:true})
			},
			//选中一直券时，判断其他的券是否可选
			dealCouponDisable(selectCouponList) {
				let canUseCoupon = this.orders[0].canUseCoupon
				for(let item of canUseCoupon) {
					if(item.select) {
						item.disable = false
					} else {
						let canSelectResult = CouponSelectUtil.checkCanSelect(item, this.couponProductList, selectCouponList)
						item.disable = !canSelectResult.success
					}
				}
				//赠品个数
				this.getGiftLength(selectCouponList)
			},
			getGiftLength(selectCouponList) {
				//赠品格式
				let datas = []
				let couponGiftProductCount = 0
				for(let item of selectCouponList) {
					if(item.couponTemplate.couponType == 2) {
						let templateId = item.couponTemplate.templateId
						//赠品券的个数以及赠品的个数
						datas.push(templateId)
						if(this.giftCouponProduct) {
							for(let product of this.giftCouponProduct[templateId]) {
								couponGiftProductCount += product.buyCount
							}
						}
					}
				}
				this.couponGiftProductCount = couponGiftProductCount
				this.couponGiftCount = datas.length

			},
			//查询所有赠品券的详细信息
			queryGiftProductInfo(order, autoSelectCoupons) {
				//合并所有优惠券
				let usableCouponGroups = order.usableCouponGroups
				let couponList = []

				for(let it of order.unusableCoupons) {
					couponList.push(it)
				}
				for(let item of usableCouponGroups) {
					for(let it of item.coupons) {
						couponList.push(it)
					}
				}
				//过滤出赠品券
				couponList = couponList.filter(item => item.couponTemplate.couponType == 2)
				if(couponList && couponList.length) {
					let datas = []
					for(let ii of couponList) {
						datas.push(ii.couponTemplate.templateId)
					}
					orderSubmitApi.queryGiftProducts({
						addressId: this.currentAddress.addressId,
						datas
					}).then(data => {
						this.giftCouponProduct = data.data
						//处理自动选择的赠品券
						this.onAddCouponGift(autoSelectCoupons)
						//给所有赠品券添加详细信息
						this.createGiftCoupon()
					})
				} else {
					this.dealCouponGift(order)
				}
			},
			//此时this.order还未设置值
			dealCouponGift(order) {
				let fullGiftProducts = []
				let giftTotalCount = 0
				if(order && order.fullGiftProducts) {
					for(let ii of order.fullGiftProducts) {
						fullGiftProducts.push(ii)
						giftTotalCount += ii.buyCount
					}
				}
				this.fullGiftProducts = fullGiftProducts
				this.giftTotalCount = giftTotalCount
			},
			//添加赠品券赠品 ,不判断库存
			onAddCouponGift(coupon) {
				let {
					currentAddress,
					couponReduceNotice,
					orders
				} = this
				let order = orders[0]
				let fullGiftProducts = []
				let giftTotalCount = 0
				if(order && order.fullGiftProducts) {
					for(let ii of order.fullGiftProducts) {
						fullGiftProducts.push(ii)
					}
				}
				//赠品显示
				let reduceStr = couponReduceNotice && couponReduceNotice.reduceStr
				//赠品券相关信息
				let couponGiftCount = 0
				for(let ii of coupon) {
					//当前赠品券对应的赠品
					let list = this.giftCouponProduct[ii.couponTemplate.templateId]
					for(let product of list) {
						product.isFromCoupon = true
						product.sourceDesc = `赠品来源于赠品券`
						couponGiftCount += product.buyCount
						//兼容赠品清单
						product.productPrice = {}
						product.productPrice.price = 0
						fullGiftProducts.push(product)
					}
				}
				if(couponGiftCount) {
					reduceStr = '获得赠品，共' + couponGiftCount
				}
				for(let gift of fullGiftProducts) {
					giftTotalCount += gift.buyCount
				}
				this.fullGiftProducts = fullGiftProducts
				this.giftTotalCount = giftTotalCount
				this.couponGiftCount = couponGiftCount
				this.couponReduceNotice.reduceStr = reduceStr
			},
			//构造赠品券上的显示赠品
			createGiftCoupon() {
				//可用券和不可用券的赠品信息
				let unusableCoupons = this.orders[0].unusableCoupons
				let canUseCoupon = this.orders[0].canUseCoupon
				//										this.$set(this.orders[0].canUseCoupon, index, coupon);
				for(let item of this.orders[0].unusableCoupons) {
					if(item.couponTemplate.couponType == 2) {
						item.giftCouponProductList = this.giftCouponProduct[item.couponTemplate.templateId]
					}
				}
				for(let item of this.orders[0].canUseCoupon) {
					if(item.couponTemplate.couponType == 2) {
						item.giftCouponProductList = this.giftCouponProduct[item.couponTemplate.templateId]
					}
				}
			},
			//设置优惠券的已选中状态
			initSelectState() {
				let canUseCoupon = this.orders[0].canUseCoupon || []
				for(let it of canUseCoupon) {
					it.select = this.selectCouponList.findIndex(item => item.couponId == it.couponId) != -1
					//将选中的数据显示
					if(it.select) {
						it.disable = false
					} else {
						//将不能选中disable的数据展示
						let canSelectResult = CouponSelectUtil.checkCanSelect(it, this.couponProductList, this.selectCouponList)
						it.disable = !canSelectResult.success
					}
				}
			},
			//切换地址
			switchAddress(item) {
				if(item.addressId != this.currentAddress.addressId) {
					this.prepareOrder(item.addressId)
					//切换地址埋点
					this.$createTalkingData("OrderSettle", "OrderSettle_SwitchAdderssResult", {IsSuccess:true})
				}
			}
		}
	}
</script>
