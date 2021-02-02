import request from "@/service";
import {watchEnvHost} from '../common'

const baseUrl = watchEnvHost('http://192.168.50.129:3002');

const WFEE_QUERY_LIST_URL = '/ihosp-fee/wfee/queryList' //待缴费列表
export const IHOSP_FEE_QUERY_LIST = `/ihosp-fee/fee/queryList`;// 缴费列表
export const IHOSP_FEE_QUERY_Detail = `/ihosp-fee/fee/queryDetail`;// 缴费列表详情

export const IHOSP_FEE_FEE_BUDGET = `/ihosp-fee/fee/feeBudget`;// 缴费预结算
export const IHOSP_FEE_FEE_CREATE = `/ihosp-fee/fee/feeCreate`;// 缴费下单
export const IHOSP_FEE_FEE_PAY = `/ihosp-fee/fee/feePay`;// 缴费支付
export const IHOSP_FEE_FEE_CLOSE = `/ihosp-fee/fee/feeClose`;// 缴费关闭

const ihosp_fee_query_list =  (params,options) =>  request({
    url:baseUrl + WFEE_QUERY_LIST_URL,
    data:params
}, options);
const fee_query_list =  (params,options) =>  request({
    url:baseUrl + IHOSP_FEE_QUERY_LIST,
    data:params
}, options);
const fee_query_detail =  (params,options) =>  request({
    url:baseUrl + IHOSP_FEE_QUERY_Detail,
    data:params
}, options);

const ihosp_fee_fee_budget =  (params,options) =>  request({
    url:baseUrl + IHOSP_FEE_FEE_BUDGET,
    data:params
}, options);
const ihosp_fee_fee_create =  (params,options) =>  request({
    url:baseUrl + IHOSP_FEE_FEE_CREATE,
    data:params
}, options);
const ihosp_fee_fee_pay =  (params,options) =>  request({
    url:baseUrl + IHOSP_FEE_FEE_PAY,
    data:params
}, options);
const ihosp_fee_fee_close =  (params,options) =>  request({
    url:baseUrl + IHOSP_FEE_FEE_CLOSE,
    data:params
}, options);


export default {
    ihosp_fee_query_list,
    fee_query_list,
    fee_query_detail,
    ihosp_fee_fee_budget,
    ihosp_fee_fee_create,
    ihosp_fee_fee_pay,
	ihosp_fee_fee_close
}
