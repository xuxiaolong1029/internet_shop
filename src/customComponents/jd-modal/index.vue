<template>
    <u-modal :value="value"
             @confirm="confirm"
             :show-cancel-button="showCancelButton"
             :show-confirm-button="showConfirmButton"
             :confirm-text="info.confirmText"
             :cancel-text="info.cancelText"
             ref="uModal"
             :show-title="false"
             @cancel="cancel"
             border-radius="10">
        <view class="jd-content flex-c-center">
            <u-icon :name="getIconType(info.type)" :color="getIconColor(info.type)" :size="iconSize" />
            <view class="title">{{info.title}}</view>
            <view class="content">
                <rich-text :nodes="_htmlParser(info.content)" />
            </view>
        </view>
    </u-modal>
</template>

<script>
    import htmlParser from '@/utils/html-parser'
    const SUCCESS ='success',WARNING = 'warning',LOADING='loading',DANDER='danger'
    export default {
        name: 'index',
        props:{
            iconSize:{
                type:Number,
                default:90
            }
        },
        data(){
            return{
                value:false,
                info:{
                    type:'',
                    title:'温馨提示',
                    content:'',
                    showCancel:false,
                    showConfirm:true,
                    confirmText:'确定',
                    cancelText:'取消',
                    success:null
                }
            }
        },
        computed:{
            getIconType(){
                return function (type) {
                    let iconObj ={
                        [SUCCESS]:'checkmark-circle-fill',
                        [WARNING]:'error-circle-fill',
                        [DANDER]:'error-circle-fill',
                        [LOADING]:'clock-fill',
                    }
                    return iconObj[type]
                }
            },
            getIconColor(){
                return function (type) {
                    let iconObj ={
                        [SUCCESS]:'#3071EA',
                        [WARNING]:'#FF9C00',
                        [LOADING]:'#02AEFF',
                        [DANDER]:'#FF4949',
                    }
                    return iconObj[type]
                }
            },
            showCancelButton(){
                if(this.info.type === LOADING) return false
                else return this.info.showCancel
            },
            showConfirmButton(){
                if(this.info.type === LOADING) return false
                else return this.info.showConfirm
            }
        },
        methods:{
            _htmlParser(str){
                return htmlParser(str)
            },
            confirm(){
                this.value = false
                if(this.info.success){
                    this.info.success({confirm:true})
                }
            },
            cancel(){
                this.value = false
                if(this.info.cancel){
                    this.info.cancel({cancel:true})
                }
            },
            _warning(params){
                params.type = WARNING
                params.showCancel = typeof params.showCancel === 'boolean' ? params.showCancel : true
                this._showModal(params)
            },
            _danger(params){
                params.type = DANDER
                this._showModal(params)
            },
            _success(params){
                params.type = SUCCESS
                this._showModal(params)
            },
            _loading(params){
                params.type = LOADING
                this._showModal(params)
            },
            /**
             * type：类型 success warning loading
             * title: 标题
             * content 内容
             * success 成功回调
             * showCancel: 显示取消
             * showConfirm: 显示确认
             * confirmText：确认文案
             * cancelText：取消文案
             * confirmColor：确认文字颜色
             * cancelColor: 取消文字颜色
             * */
            _showModal({ title,type,content,success,cancel,showCancel,showConfirm ,confirmText,cancelText,confirmColor,cancelColor}){
                this.value = true
                this.info.title = title
                this.info.content = content || ''
                this.info.type = type || SUCCESS
                this.info.showCancel = showCancel || false
                this.info.showConfirm = showConfirm || true
                this.info.confirmText = confirmText || '确定'
                this.info.cancelText = cancelText || '取消'
                this.info.confirmColor = confirmColor || '#3071EA'
                this.info.cancelColor = cancelColor || '#333'
                if(success && typeof success !== 'function'){
                    new Error('success must be a function type')
                    return
                }
                this.info.success = success;
                if(cancel && typeof cancel !== 'function'){
                    new Error('cancel must be a function type')
                    return
                }
                this.info.cancel = cancel;
            },
        }
    }
</script>

<style scoped lang="scss">
    .jd-content{
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 500;
        padding-top: 20px;
        padding-bottom: 20px;
        .title{
            font-size: $font-s-llg;
            line-height: 36rpx;
            color: $text-color;
            margin: 15px 0 10px 0;
        }
        .content{
            font-size: $font-s-base;
            line-height: 28rpx;
            color: $text-color-grey;
        }
        ::v-deep.primary{
            color: $primary;
        }
        ::v-deep.warning{
            color: $warning;
        }
    }
</style>
