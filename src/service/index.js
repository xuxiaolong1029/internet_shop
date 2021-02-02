import Request from 'luch-request'
import {showModal,debounce,throttle} from "@/utils";
import store from '@/store'
import getURL from './host'
import {refreshToken} from './refreshToken'
const http = new Request({
    baseURL:getURL(),
    dataType: 'json',
});

let loadingTimes = 0,timer=null
/***
 * @param params 参数
 * @param options 配置项
 * showErrModal 是否显示报错模态框
 * isShowLoading 是否loading
 * loadingText 是否loading文本
 * showSuccessModal 是否返回成功弹窗
 * successModalText 成功弹窗文本
 * isResponseBody 业务code码非200的情况下是否返回业务数据
 * @returns {Promise<unknown>}
 */
export default function request(params={},options={}){
    let {showErrModal=true,isShowLoading=true,loadingText,showSuccessModal,successModalText='success',isResponseBody=false}=options;
    return new Promise((resolve,reject)=>{
        if(isShowLoading && !timer) {
            timer = setTimeout(() => {
                showLoadingFn(loadingText);
                timer = null;
            }, 800);
        }
        http.request({
            method: params.method || 'POST', // 请求方法必须大写
            url: params.url,
            data: params.data,
            timeout: 20000, // 仅微信小程序（2.10.0）、支付宝小程序支持
            custom: params.custom, // 自定义参数
        }).then(res=> {
            if(isShowLoading){
                hideLoadingFn()
                clearTimeout(timer);
                timer = null;
            }
            let body = res.data || {};
            if (Number(body.code) === 200 || isResponseBody) {
                resolve(body)
                if(showSuccessModal) showModal(body.code, successModalText)
            } else {
                if(Number(body.code) === 401){
                    refreshToken()
                }else{
                    responErr(body);
                    reject(body)
                }
            }
        }).catch(err=>{
            if(isShowLoading){
                clearTimeout(timer)
                timer = null;
                hideLoadingFn()
            }
            if(showErrModal) showModal(500)
            reject(err)
        })
    });
    //接口响应报错
    function responErr(body){
        ///错误码为12200201  表示账号异常  需要重启应用
        if([12200201].includes(Number(body.code))){
            uni.showModal({
                title: '更新提示',
                content: body.message || body.msg+',是否重启应用?',
                cancelColor: '#eeeeee',
                confirmColor: '#FF0000',
                success:(res)=>{
                    if (res.confirm) {
                        uni.clearStorageSync();
                        uni.reLaunch({
                            url: '/pages/tabBar/home/index'
                        });
                    }
                }
            })
        }else{
            if(showErrModal) showModal(body.code, body.message || body.msg)
        }
    }
    function showLoadingFn(msg){
        uni.showLoading({
            title: typeof msg =='string' ? msg : '',
            mask: true,
            duration: 1000
        });
        loadingTimes++
    }

    function hideLoadingFn(){
        loadingTimes--;
        if(loadingTimes <= 0){
            uni.hideLoading()
        }
    }
}

http.interceptors.request.use((config) => { // 可使用async await 做异步操作
    const accessToken = uni.getStorageSync('accessToken').accessToken
    config.header = {
        ...config.header,
        ['User-Token']:accessToken || ''
    };
    /**
     /* 演示
     if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
      return Promise.reject(config)
    }
     **/
    return config
}, config => { // 可使用async await 做异步操作
    return Promise.reject(config)
})

http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
    return response
}, (response) => { /*  对响应错误做点什么 （statusCode !== 200）*/
    const {statusCode,data} = response
    if(statusCode !==200){
        // showModal(500)
    }
    return Promise.reject(response)
})
