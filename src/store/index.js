import Vue from 'vue'
import Vuex from 'vuex'
import api from '../service/http.api'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import register from './modules/register'
import {SET_ORG_CODE,SET_APPID,SET_SHOW_VERIFY_FLAG,SET_OAUTH,SET_PAYMENT_PROVIDER} from './type'
import getters from './getters.js'
Vue.use(Vuex)

const vuexPersisted = createPersistedState({
		storage: {
			getItem: key => uni.getStorageSync(key),
			setItem: (key, value) => uni.setStorageSync(key, value),
			removeItem: key => uni.removeStorageSync(key)
		}
	});

const store = new Vuex.Store({
	plugins:[vuexPersisted],
	modules:{
		user,register
	},
	state: {
		appId:'',
		orgCode: "",
		showVerifyFlag:'0',
		oauth:'',
		paymentProvider: '',	//支付服务提供商
	},
	getters,
	mutations: {
		[SET_ORG_CODE](state, orgCode) {
			state.orgCode = orgCode
		},
		[SET_APPID](state, appId) {
			state.appId = appId
		},
		[SET_SHOW_VERIFY_FLAG](state, showVerifyFlag) {
			state.showVerifyFlag = showVerifyFlag
		},
		[SET_OAUTH](state, oauth) {
			state.oauth = oauth
		},
		[SET_PAYMENT_PROVIDER](state, paymentProvider) {
			state.paymentProvider = paymentProvider
		}
	},
	actions: {
	}
})

export default store
