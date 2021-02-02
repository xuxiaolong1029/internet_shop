import request from "@/service";
import {watchEnvHost} from '../common'

const baseUrl = watchEnvHost('http://192.168.50.129:3002');

const REPORT_EXAMINSP_LISR = '/ihosp-report/examinsp/list' //检查检验报告列表查询
export const REPORT_EXAMINE_DETAIL = `/ihosp-report/examine/detail`;//检验报告详细查询
export const REPORT_INSPECTION_DETAIL = `/ihosp-report/inspection/detail`;// 检验报告详细查询

const report_examinsp_list =  (params,options) =>  request({
    url:baseUrl + REPORT_EXAMINSP_LISR,
    data:params
}, options);
const report_examine_detail =  (params,options) =>  request({
    url:baseUrl + REPORT_EXAMINE_DETAIL,
    data:params
}, options);
const report_inspection_detail =  (params,options) =>  request({
    url:baseUrl + REPORT_INSPECTION_DETAIL,
    data:params
}, options);

export default {
    report_examinsp_list,
    report_examine_detail,
    report_inspection_detail
}
