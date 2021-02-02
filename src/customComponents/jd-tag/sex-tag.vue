<template>
    <view class="sex-wrapper flex-r-sb-center">
        <jd-tag @onClick="onChange('M')"
                text="男"
                mode="light"
                :type="value === 'M' ? 'primary' : 'info'"
                border-color="transparent"/>
        <jd-tag @onClick="onChange('F')"
                text="女"
                mode="light"
                :type="value === 'F' ? 'error' : 'info'"
                border-color="transparent"/>
    </view>
</template>

<script>
    import jdTag from './index'
    export default {
        name: 'sexTag',
        components:{jdTag},
        props:{
            value:{
                type:String,
                default:'M'
            },
        },
        methods:{
            onChange(res){
                // this.$emit('onSexChange',res)
                this.$emit('input',res)
            }
        }
    }
</script>

<style scoped>
    .sex-wrapper {
        padding: 10rpx;
        width: 150rpx;
    }
</style>
