import request from "@/service";
import {watchEnvHost} from '../common'

const baseUrl = watchEnvHost('http://192.168.50.129:3002');


export const OUTPATIENT_USER_QUERY_URL = `/outpatient/user/query`; // 我的就诊人
export const OUTPATIENT_INFO_QUERY_URL = `/outpatient/info/query`; // 就诊人信息
export const OUTPATIENT_INFO_UPDATE_URL = `/outpatient/info/update`; // 修改就诊人信息
export const OUTPATIENT_INFO_REMOVE_URL = `/outpatient/info/remove`; // 删除就诊人
export const OUTPATIENT_INFO_CREATE_URL = `/outpatient/user/create`; // 添加就诊人

const outpatient_user_query =  (params,options) =>  request({
    url:baseUrl+OUTPATIENT_USER_QUERY_URL,
    data:params
},options);

const outpatient_info_query =  (params,options) =>  request({
    url:baseUrl+OUTPATIENT_INFO_QUERY_URL,
    data:params
},options);

const outpatient_info_update =  (params,options) =>  request({
    url:baseUrl+OUTPATIENT_INFO_UPDATE_URL,
    data:params
},options);

const outpatient_info_remove =  (params,options) =>  request({
    url:baseUrl+OUTPATIENT_INFO_REMOVE_URL,
    data:params
},options);

const outpatient_info_create =  (params,options) =>  request({
    url:baseUrl+OUTPATIENT_INFO_CREATE_URL,
    data:params
},options);



export default {
    outpatient_user_query,
    outpatient_info_query,
    outpatient_info_update,
    outpatient_info_remove,
    outpatient_info_create,
}
