import config from '@/config/index'
const {common,http} = config

//#ifndef H5
    export default function () {
        const VUE_APP_ENV = common.VUE_APP_ENV
        let ctx = http.API_URL[VUE_APP_ENV]
        return ctx
    }
//#endif

//#ifdef H5
import vConsole from 'vconsole'
let vconsole = null
export default function(){
    let host;
    if (window && typeof window=='object' && window.location) {
        console.log(window.location.host);
        let location=window.location || {};
        if(location.host.match(/localhost\:/i) || location.host.match(/(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/)){
            host = ''
            // vconsole = new vConsole()
        }
        // 开发环境
        else if(location.host.indexOf('convwx.clear-sz.com') > -1) {
            host = ``
            vconsole = new vConsole()
        }
        // 测试
        else if(location.host.indexOf('convwx-test.clear-sz.com') > -1){
            host = '';
            vconsole = new vConsole()
        }
        else {

        }
    }
    else{
        host=''
    }
    return host
}
//#endif

