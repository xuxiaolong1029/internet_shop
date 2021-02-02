<template>
    <view class="jd-form-mask" @tap.stop="onClick">.</view>
</template>

<script>
    /***
     * form-item 点击输入框弹起模态框时 防止获取焦点；
     * 在form-item上层加遮罩层
     */
    export default {
        name: 'mask',
        methods:{
            onClick(){
                this.$emit('onClick')
            }
        }
    }
</script>

<style scoped>
    .jd-form-mask{
        color:#fff;position: absolute;width:100%;left: 0;right:0;z-index: 10070;
    }
</style>
