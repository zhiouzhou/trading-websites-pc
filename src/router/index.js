import Vue from 'vue'
import Router from 'vue-router'

import main from './main'//主要页面
import author from './author'//登录注册密码
import userinfo from './userInfo'//个人信息 修改密码
import shopCart from './shopCart'//订单预查询等
import settlement from './settlement'//订单预查询等
import profile from './profile' //我的酒批
import helpcenter from './helpCenter'//帮助中心
import authentication from './authentication'//实名认证
import dealer from './dealer'//经销商相关


const routes = [
    ...author, ...main, ...profile, ...settlement, ...authentication, ...helpcenter, ...userinfo, ...shopCart, ...dealer
]

Vue.use(Router)

export default new Router({
//	mode: 'history',
    routes
})
