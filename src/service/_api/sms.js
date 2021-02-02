import request from "@/service";
import {watchEnvHost} from '../common'

const baseUrl = watchEnvHost('http://192.168.50.129:3002');

export const SMS_CODE_SEND_URL = `/sms/verify-code/send`;// 获取验证码
export const SMS_VERIFY_CODE_CHECK_URL = `/sms/verify-code/check`;// 验证验证码
export const SMS_VERIFY_CODE_CERT_NO_URL = `/sms/verify-code/sendByCertNo`;// 获取验证码 （无需手机号）


const sms_code_send =  (params,options) =>  request({url:baseUrl+SMS_CODE_SEND_URL, data:params},options);
const sms_verify_code_check =  (params,options) =>  request({url:baseUrl+SMS_VERIFY_CODE_CHECK_URL, data:params},options);
const sms_verify_code_cert_no =  (params,options) =>  request({
    url:baseUrl+SMS_VERIFY_CODE_CERT_NO_URL,
    data:params}
,options);

export default {
    sms_code_send,
    sms_verify_code_check,
    sms_verify_code_cert_no
}
