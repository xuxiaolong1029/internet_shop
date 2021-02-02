import request from "@/service";
import {watchEnvHost} from '../common'

const baseUrl = watchEnvHost('http://192.168.50.129:3002');

const IHOSP_PAYMENT_QUERY = `/ihosp-payment/payment/paymentQuery` //支付单查询

const ihosp_payment_query =  (params,options) =>  request({
    url:baseUrl + IHOSP_PAYMENT_QUERY,
    data:params
}, options);

export default {
    ihosp_payment_query
}
