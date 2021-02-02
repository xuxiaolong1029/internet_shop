<template>
    <u-modal :value="value" @cancel="cancel" :show-confirm-button="false" confirm-text="登录" title="账号登录" @confirm="confirm">
        <view class="wrap">
            <view class="top"></view>
            <view class="content">
                <u-form :model="form" ref="uForm" :error-type="['toast']">
                    <u-form-item prop="mobile">
                        <u-input placeholder="请输入手机号" v-model="form.mobile"/>
                    </u-form-item>
                    <u-form-item :border-bottom="false">
                        <jdButton @submit="getCode" size="mini" plain type="primary" slot="right" :disabled="!form.mobile" :loading="codeBtnLoading">{{tips}}</jdButton>
                        <u-input maxlength="6" v-model="form.verifyCode" placeholder="请输入验证码"/>
                    </u-form-item>
                </u-form>
            </view>
            <jdButton :disabled="bindBtnDisabled" :loading="btnBindPhoneLoading" @submit="bindPhoneFn" type="primary">绑定</jdButton>
            <u-toast ref="uToast"></u-toast>
            <u-verification-code  :seconds="seconds" ref="uCode"
                                 @change="codeChange"></u-verification-code>
        </view>
    </u-modal>
</template>

<script>
    import jdButton from '@/pages/components/jdButton'
    import rentRules from './config'
    export default {
        name: "bindPhone",
        components:{jdButton},
        mixins:[rentRules],
        props:{
            value:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                tips: '',
                form: {
                    mobile:'',
                    verifyCode:''
                },
                seconds: 60,
                codeBtnDisabled:true,
                btnBindPhoneLoading:false,
                codeBtnLoading:false,
            }
        },
        model: {
            prop: 'value',
            event:'change'
        },
        computed: {
            bindBtnDisabled(){
                return !this.form.mobile || !this.form.verifyCode
            }
        },
        watch:{
            show(val){
                if(typeof val === "boolean"){
                    this.$emit('change',val)
                }
            }
        },
        mounted() {
            setTimeout(()=>{
                console.log(this.$refs.uForm);
                this.$refs.uForm.setRules(this.rules);
            },1000)
        },
        methods: {
            cancel(val) {
                console.log(val);
            },
            confirm() {
                console.log('confirm');
            },
            codeChange(text) {
                this.tips = text;
            },
            async getCode() {
                if(!this.$refs.uCode.canGetCode) return
                this.$refs.uForm.validate(async valid => {
                    if(!valid) return
                    this.codeBtnLoading = true
                    try {
                        await this.$api.goods_send_verify_code({mobile:this.form.mobile})
                        this.$u.toast('验证码已发送');
                        // 通知验证码组件内部开始倒计时
                        this.$refs.uCode.start();
                    }catch (e) {
                        this.$u.toast(e.message);
                    }
                    this.codeBtnLoading = false
                })

            },
            bindPhoneFn(){
                this.$refs.uForm.validate(async valid => {
                    if (valid) {
                        this.btnBindPhoneLoading=true
                        try {
                            await this.$api.goods_update_user_mobile({...this.form})
                            this.btnBindPhoneLoading=false
                            this.$emit('close')
                        }catch (e) {
                            if(e.code === 500){
                                this.$u.toast(e.message);
                                this.btnBindPhoneLoading=false
                            }
                        }
                    }
                })
            },
            async checkCode({mobile,verifyCode}){
                try {
                    const {result} = await this.$api.shops_check_verify_code({mobile,verifyCode})
                    return result
                }catch (e) {
                    if (e.result === false){
                        return false
                    }
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrap {
        font-size: 20rpx;
        padding: 30rpx;

        .content {
            input {
                text-align: left;
                margin-bottom: 10rpx;
                padding-bottom: 6rpx;
            }

            .tips {
                color: $u-type-info;
                margin-bottom: 60rpx;
                margin-top: 8rpx;
            }

            .getCaptcha {
                background-color: rgb(253, 243, 208);
                color: $u-tips-color;
                border: none;
                font-size:$font-s-base;
                padding: 12rpx 0;

                &::after {
                    border: none;
                }
            }
        }
    }
</style>
