import utils from '@/utils/index'
import config from '@/config'
const {payOptions,PAY_NAME,AFTER_PAY_NAME} =config.common;
const {H5WeChatPay} =utils;
export default {
    methods:{
        setStorageResultData(data){
            uni.setStorage({
                key:'result-data',
                data
            })
        },
        goResultPage({type}){
            this.$u.route({
                type:'redirect',
                url:'/pages/result/index',
                params:{
                    type
                }
            })
        },
        async pay({orderNo,orgCode,type=PAY_NAME,success,error,cancel}){
            console.log(orderNo, orgCode, type);
            let res={}
            this.h5Pay = new H5WeChatPay()
            let params = {orderNo,payOption:payOptions.WxPay,orgCode}
            if(type === AFTER_PAY_NAME){
                res =await this.h5Pay.afterPay(params)
            }else {
                res =await this.h5Pay.pay(params)
            }
            let result=res.result
            let payParams ={
                appId:result.appId,
                timeStamp:result.timeStamp,
                nonceStr:result.nonceStr,
                packageParams:result.package,
                signType:result.signType,
                paySign:result.paySign
            }
            try {
                let payRes = await this.h5Pay.onBridgeReady(payParams)
                if(this.h5Pay.paySuccessStatus(payRes)){
                    const {status} = await this.h5Pay.queryPay({orderNo,payNo:result.payNo,orgCode})
                    if(this.h5Pay.payQuerySuccess({status})){
                        success && success()
                    }else if(this.h5Pay.payQueryTimeOut({status})) {
                        error && error(status)
                    }
                }else if(this.h5Pay.payCancelStatus(payRes)){
                    cancel && cancel()
                }
            }catch (e) {
                error && error()
                uni.showModal({title:'支付失败',showCancel:false})
            }
        },

    }
}
