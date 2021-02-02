import request from "@/service";
import {watchEnvHost} from '../common'

const baseUrl = watchEnvHost('http://192.168.50.129:3002');

export const BASEDATA_HOSPITAL_URL = `/basedata/orginfo/find/one`; // 医院简介
export const BASEDATA_ORGDEPT_FIND_URL = `/basedata/orgdept/find/dept/info`; // 科室简介
export const BASEDATA_ORGDEPT_TREE_URL = `/basedata/orgdept/find/dept/tree`; // 科室树形结构列表
export const BASEDATA_ORGDEPT_LIST_URL = `/basedata/orgdept/find/dept/list`; // 条件查询科室列表
export const BASEDATA_ORGEMP_PAGE_URL = `/basedata/orgemp/find/emp/page`; // 医生列表列表
export const BASEDATA_ORGEMP_EMP_URL = `/basedata/orgemp/find/one/emp`; // 医生简介
export const BASEDATA_SYSDICT_DICT_URL = `/basedata/sysdictdetail/findDictDetailListByType`; // 获取字典

const basedata_hospital =  (params,options) =>  request({
    url:baseUrl + BASEDATA_HOSPITAL_URL,
    data:params,
    method:'GET'
},options);

const basedata_orgdept_info =  (params,options) =>  request({
    url:baseUrl + BASEDATA_ORGDEPT_FIND_URL,
    data:params,
    method:'GET'
},options);

const basedata_orgdept_tree =  (params,options) =>  request({
    url: baseUrl + BASEDATA_ORGDEPT_TREE_URL,
    data:params,
    method:'GET'
},options);

const basedata_orgdept_list =  (params,options) =>  request({
    url:baseUrl + BASEDATA_ORGDEPT_LIST_URL,
    data:params
},options);

const basedata_orgemp_page_list =  (params,options) =>  request({
    url:baseUrl + BASEDATA_ORGEMP_PAGE_URL,
    data:params
},options);

const basedata_orgemp_emp =  (params,options) =>  request({
    url:baseUrl + BASEDATA_ORGEMP_EMP_URL,
    data:params,
    method:'GET'
},options);

const basedata_sysdict_dict =  (params,options) =>  request({
    url:baseUrl + BASEDATA_SYSDICT_DICT_URL,
    data:params,
    method:'GET'
},options);



export default {
    basedata_hospital,
    basedata_orgdept_info,
    basedata_orgdept_tree,
    basedata_orgdept_list,
    basedata_orgemp_page_list,
    basedata_orgemp_emp,
    basedata_sysdict_dict,
}
