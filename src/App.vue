
<script>
    import {mapMutations} from 'vuex'
    export default {
        onLaunch() {
            this.updateManager();
            //获取小程序平台 支付宝小程序 还是微信小程序等
            uni.getProvider({
                service: 'oauth',
                success:(res)=>{
                    this.setOauth(res.provider[0])
                }
            });
            //获取支付服务提供商
            uni.getProvider({
                service: 'payment',
                success:(res)=>{
                    this.setPaymentProvider(res.provider[0])
                }
            });
        },
        onShow(){
            console.log('App Show')
        },
        onHide(){
            console.log('App Hide')
        },
        methods:{
            ...mapMutations(["setOauth","setPaymentProvider"]),
            //更新版本
            updateManager(){
                // 检查版本更新
                const updateManager = uni.getUpdateManager();
                updateManager.onCheckForUpdate(function(res) {
                    // 请求完新版本信息的回调
                    if (res.hasUpdate) {
                        updateManager.onUpdateReady(function(updateInfo) {
                            uni.showModal({
                                title: '更新提示',
                                content: '发现新版本，是否重启应用?',
                                cancelColor: '#eeeeee',
                                confirmColor: '#FF0000',
                                success(updateInfo) {
                                    if (updateInfo.confirm) {
                                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                        updateManager.applyUpdate()
                                        //清除所有缓存
                                        uni.clearStorageSync();
                                    }
                                }
                            })
                        })
                    }
                })
                updateManager.onUpdateFailed(function(res) {
                    // 新的版本下载失败
                    uni.showModal({
                        title: '提示',
                        content: '检查到有新版本，但下载失败，请检查网络设置',
                        success(res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                updateManager.applyUpdate()
                            }
                        }
                    })
                })
            }
        },
        onError(err){
            // uni.showModal({
            //     title: '报错提示',
            //     content:err,
            //     cancelColor: '#eeeeee',
            //     confirmColor: '#FF0000'
            // });
        },
    }
</script>

<style lang="scss">
    @import 'uview-ui/index.scss';
    @import './style/common.scss';
    @import "./style/components/index.scss";
    /*每个页面公共css */
    page {
        background: $bg-color;
        text {
            font-family: $font-family-M;
            font-size: $font-s-base;
            letter-spacing: 0;
            font-weight: normal;
            font-stretch: normal;
        }
    }
    .cell-hover-class {
        background-color: rgb(235, 237, 238);
    }

</style>

