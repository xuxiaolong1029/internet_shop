import request from "@/service";
import {watchEnvHost} from '../common'

const baseUrl = watchEnvHost('http://192.168.50.129:3002');

export const IHOSP_OUT_PATIENT_CARD_URL = `/ihosp-regist/regist/myOutPatientCard`; // 我的就诊卡
export const IHOSP_DOCTOR_URL = `/ihosp-regist/regist/myDoctor`;// 我的医生
export const IHOSP_My_DEPT = `/ihosp-regist/regist/myDept`;// 曾就诊科室

export const IHOSP_DEPT_HAS_NUM = `/ihosp-regist/schedule/deptHasNum`; // 科室所有日期有无号查询
export const IHOSP_DEPT_HAS_NUM_LATE = `/ihosp-regist/schedule/deptHasNumLate`; // 科室所有医生最近有号查询
export const IHOSP_DEPT_SUP_NUM_DAY = `/ihosp-regist/schedule/deptSupNumDay`; // 科室指定日期所有医生余号查询
export const IHOSP_DOCTOR_SUP_NUM = `/ihosp-regist/schedule/doctorSupNum`; // 医生所有日期余号查询
export const IHOSP_DOCTOR_SUP_NUM_DAY = `/ihosp-regist/schedule/doctorSupNumDay`; // 医生指定日期余号查询
export const IHOSP_DOCTOR_NUM_DAY = `/ihosp-regist/schedule/doctorSeqNumDay`; // 医生指定日期号源查询
export const IHOSP_DOCTOR_SCH_DATE_LIST = `/ihosp-regist/schedule/doctor/schDateList`; // 搜索医生排班日期列表
export const IHOSP_REGIST_QUERY = '/ihosp-regist/regist/myRegist';//我的挂号查询

export const IHOSP_REGIST_BUDGET = `/ihosp-regist/regist/registBudget`; // 挂号医保预结算
export const IHOSP_REGIST_CREATE = `/ihosp-regist/regist/registCreate`;// 提交挂号单
export const IHOSP_REGIST_PAY = `/ihosp-regist/regist/registPay`;// 挂号单支付
export const IHOSP_REGIST_QUERY_DETAIL = `/ihosp-regist/regist/registQuery`;// 挂号单查询
export const IHOSP_REGIST_CLOSE = `/ihosp-regist/regist/registClose`;// 挂号关闭
export const IHOSP_REGIST_CANCEL = `/ihosp-regist/regist/registCancel`;// 挂号取消

const ihosp_my_patient_card =  (params,options) =>  request({
    url: baseUrl + IHOSP_OUT_PATIENT_CARD_URL,
    data:params
},options);

const ihosp_my_doctor =  (params,options) =>  request({
    url: baseUrl + IHOSP_DOCTOR_URL,
    data:params
},options);

const ihosp_my_dept =  (params,options) =>  request({
    url: baseUrl + IHOSP_My_DEPT,
    data:params
},options);

const ihosp_dept_has_num = (params,options) =>  request({
    url:baseUrl + IHOSP_DEPT_HAS_NUM,
    data:params
},options);

const ihosp_dept_has_num_late = (params,options) =>  request({
    url:baseUrl + IHOSP_DEPT_HAS_NUM_LATE,
    data:params
},options);

const ihosp_dept_has_num_day = (params,options) =>  request({
    url:baseUrl + IHOSP_DEPT_SUP_NUM_DAY,
    data:params
},options);

const ihosp_doctor_sup_num = (params,options) =>  request({
    url:baseUrl + IHOSP_DOCTOR_SUP_NUM,
    data:params
},options);

const ihosp_doctor_sup_num_day = (params,options) =>  request({
    url:baseUrl + IHOSP_DOCTOR_SUP_NUM_DAY,
    data:params
},options);

const ihosp_doctor_num_day = (params,options) =>  request({
    url:baseUrl + IHOSP_DOCTOR_NUM_DAY,
    data:params
},options);

const ihosp_doctor_sch_date_list = (params,options) =>  request({
    url:baseUrl + IHOSP_DOCTOR_SCH_DATE_LIST,
    data:params
},options);

const ihosp_regist_query =  (params,options) =>  request({
    url:baseUrl + IHOSP_REGIST_QUERY,
    data:params
},options);

const ihosp_regist_budget =  (params,options) =>  request({
    url: baseUrl + IHOSP_REGIST_BUDGET,
    data:params
},options);

const ihosp_regist_create =  (params,options) =>  request({
    url: baseUrl + IHOSP_REGIST_CREATE,
    data:params
},options);

const ihosp_regist_pay =  (params,options) =>  request({
    url: baseUrl + IHOSP_REGIST_PAY,
    data:params
},options);

const ihosp_regist_query_detail =  (params,options) =>  request({
    url: baseUrl + IHOSP_REGIST_QUERY_DETAIL,
    data:params
},options);

const ihosp_regist_close =  (params,options) =>  request({
    url: baseUrl + IHOSP_REGIST_CLOSE,
    data:params
},options);

const ihosp_regist_cancel =  (params,options) =>  request({
    url: baseUrl + IHOSP_REGIST_CANCEL,
    data:params
},options);

export default {
    ihosp_my_patient_card,
    ihosp_my_doctor,
	ihosp_my_dept,
	ihosp_dept_has_num,
	ihosp_dept_has_num_late,
	ihosp_dept_has_num_day,
	ihosp_doctor_sup_num,
	ihosp_doctor_sup_num_day,
	ihosp_doctor_num_day,
    ihosp_doctor_sch_date_list,
    ihosp_regist_query,
	ihosp_regist_budget,
	ihosp_regist_create,
	ihosp_regist_pay,
	ihosp_regist_query_detail,
	ihosp_regist_close,
	ihosp_regist_cancel,
}
