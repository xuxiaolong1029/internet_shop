import api from './http.api'
import {debounce} from "@/utils";

export const refreshToken = debounce(function(){
    const userInfo = uni.getStorageSync('userInfo');
    let params={
        thdAppId:userInfo.thdAppId,
        refreshToken:userInfo.refreshToken
    };
    api.user_login_refresh_token(params).then(res=> {
        let $page = getCurrentPages();
         let {fullPath} = $page[$page.length-1].$page;
         if(Number(res.code) === 200) {
             uni.setStorage({
                 key: 'accessToken',
                 data: {
                     accessToken:res.accessToken
                 }
             });
             uni.setStorage({
                 key: 'userInfo',
                 data:{
                     ...userInfo,
                     refreshToken:res.refreshToken
                 },
             });
             //this.onLoad();
             uni.navigateTo({
                 url:fullPath
             });
         }else{
             uni.showModal({
                 title: '温馨提示',
                 content: '您的授权已失效，是否去重新授权登录?',
                 cancelColor: '#eeeeee',
                 confirmColor: '#FF0000',
                 success:(res)=>{
                     if(res.confirm){
                         uni.clearStorageSync();
                         uni.navigateTo({
                             url: '/pages/auth/index?from='+encodeURIComponent(fullPath)
                         });
                     }
                 }
             })
         }
     }).catch(err=>{
         console.log(err);
     })
},1000);