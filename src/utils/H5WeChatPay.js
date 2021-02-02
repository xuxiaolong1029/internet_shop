import api from '@/service/http.api'
import config from '@/config'
const {PAY_TIMEOUT,PAY_SUCCESS} = config.common

export class H5WeChatPay {
    constructor() {
    }
    /**
     * 调起微信支付
     */
    onBridgeReady({appId,timeStamp,nonceStr,packageParams,signType,paySign}){
        return new Promise((resolve, reject) => {
             const onBridgeReady = ()=>{
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId":appId,     //公众号名称，由商户传入
                        "timeStamp":timeStamp,         //时间戳，自1970年以来的秒数
                        "nonceStr":nonceStr, //随机串
                        "package":packageParams,
                        "signType":signType,         //微信签名方式：
                        "paySign":paySign //微信签名
                    },
                    (res)=>{
                        if(this.paySuccessStatus(res)){
                            // 使用以上方式判断前端返回,微信团队郑重提示：
                            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            resolve(res)
                        }else if(this.payCancelStatus(res)){
                            resolve(res)
                            return uni.showToast({title:'支付已取消'})
                        }else {
                            reject(res)
                        }
                    });
            }
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            }else{
                onBridgeReady();
            }
        })
    }

    /***
     *查询支付状态
     */
    queryPay({orderNo,payNo,orgCode}){
        return new Promise( (resolve, reject) => {
            uni.showLoading({title:'支付中...',mask:true})
            const queryResultFn = async()=> {
                try {
                    const {result={},code} = await api.order_query_pay({orderNo, payNo,orgCode},{isShowLoading:false})
                    if(result.status === 'pay_accepted' || result.status === 'pay_processing'){
                        setTimeout(()=>{
                            queryResultFn()
                        },3000)
                    }else if(this.payQuerySuccess(result)) {
                        uni.hideLoading()
                        resolve(result)
                    }else {
                        if(code === 408){ // 超时
                            result.status = PAY_TIMEOUT
                            resolve(result)
                        }else { // pay_fail
                            reject(result)
                        }
                        uni.hideLoading()
                    }
                }catch (e) {
                    console.log(e);
                    uni.hideLoading()
                    reject(e)
                }
            }
            queryResultFn()
        })
    }
    /**
     * 判断query接口成功状态
     */
    payQuerySuccess({status}){
        return status === PAY_SUCCESS
    }
    /**
     * 判断query接口超时状态
     */
    payQueryTimeOut({status}){
        return status === PAY_TIMEOUT
    }
    /**
     * 微信支付成功状态
     */
    paySuccessStatus({err_msg}){
        return err_msg === "get_brand_wcpay_request:ok"
    }
    /**
     * 微信支付取消状态
     */
    payCancelStatus({err_msg}){
        return err_msg === "get_brand_wcpay_request:cancel"
    }
    /**
     * 支付
     */
    async pay({orderNo,orgCode,payOption,}){
        return await api.order_pay({orderNo,orgCode,payOption})
    }
    /**
     * 补交支付
     */
    async afterPay({orderNo,orgCode,payOption,}){
        return await api.order_after_pay({orderNo,orgCode,payOption})
    }
}
