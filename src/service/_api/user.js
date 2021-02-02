import request from "@/service";
import {watchEnvHost} from '../common'

const baseUrl = watchEnvHost('http://192.168.50.129:3002');

export const USER_REGIST_LOGIN_URL = `/user/login/registLogin`;// 注册登录
export const USER_LOGIN_REFRESH_TOKEN_URL = `/user/login/refreshToken`;// 刷新token
export const USER_ARCHIVES_CREATE_URL = `/user/core/archives/create`;// 在线建档
export const USER_CARD_QUERY_URL = `/user/card/query`;// 查卡
export const USER_CARD_BIND_URL = `/user/card/bind`;// 绑卡
export const USER_CARD_DELETE_URL = `/user/card/delete`;// 查卡
export const USER_CARD_UPDATE_URL = `/user/card/update`;// 更新卡

const user_register_Login =  (params,options) =>  request({
    url:baseUrl + USER_REGIST_LOGIN_URL,
    data:params
}, { isResponseBody:true});

const user_login_refresh_token =  (params,options) =>  request({
    url:baseUrl + USER_LOGIN_REFRESH_TOKEN_URL,
    data:params
}, {isResponseBody:true});

const user_archives_create =  (params,options) =>  request({
    url:baseUrl + USER_ARCHIVES_CREATE_URL,
    data:params
}, options);

const user_card_query =  (params,options) =>  request({
    url:baseUrl + USER_CARD_QUERY_URL,
    data:params
}, options);

const user_card_bind =  (params,options) =>  request({
    url:baseUrl + USER_CARD_BIND_URL,
    data:params
}, options);

const user_card_delete =  (params,options) =>  request({
    url:baseUrl + USER_CARD_DELETE_URL,
    data:params
}, options);

const user_card_update =  (params,options) =>  request({
    url:baseUrl + USER_CARD_UPDATE_URL,
    data:params
}, options);


export default {
    user_register_Login,
    user_login_refresh_token,
    user_archives_create,
    user_card_query,
    user_card_bind,
    user_card_delete,
    user_card_update
}
