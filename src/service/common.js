import config from '@/config/index'
const {common,http} = config

/**
 * devHost 开发环境的 hostname
 */

export const watchEnvHost = (devHost)=>{
    return common.VUE_APP_ENV === 'development' ? devHost : http.API_URL[common.VUE_APP_ENV]
}
