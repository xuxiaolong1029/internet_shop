import config from '@/config/index'
const {common,http} = config
import {debounce} from "./util";

export const showModal = debounce((code, msg) => {
  let title
  switch (code) {
    case 500:
      title = '服务器异常,请稍候重试'
    default:
      title = msg || '服务器异常,请稍候重试'
  }
  uni.showModal({
    showCancel: false,
    title
  })
},700)

export const goHome = () => {
  uni.reLaunch({ url: '/pages/tarbar/home/index' })
}

export const goAuthAndTarget = (url) => {
  uni.showModal({
    title: '温馨提示',
    content: '您还未授权，是否去授权?',
    cancelColor: '#eeeeee',
    confirmColor: '#FF0000',
    success(res) {
      if(res.confirm){
        uni.navigateTo({
          url: '/pages/auth/index?from='+encodeURIComponent(url)
        });
      }
    }
  })
}
/**
 * 返回页面传参 更新返回页面data的数据
 * @param delta Number 返回页面数量
 * @param params Object 参数
 * @param success Function 成功
 * @param error Function 失败
 */
export const navigateBack = ({delta=1,params={},success,error})=>{
// export const navigateBack = ({delta=1,params,fnName,success,error})=>{
  try {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - (delta+1)]; //上一个页面
    for(let key in params){
      let value = params[key]
      prevPage.$vm[key] = value
    }
    // prevPage.$vm[fnName](params)
    uni.navigateBack({
      delta
    });
    success && success()
  }catch (e) {
    console.log(e)
    error && error(e)
    new Error(e)
  }
}
export const getImgHost = ()=>{
  const VUE_APP_ENV = common.VUE_APP_ENV
  let ctx = http.IMG_HOST[VUE_APP_ENV]
  return ctx
}
