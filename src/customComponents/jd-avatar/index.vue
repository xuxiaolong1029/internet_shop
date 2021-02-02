<template>
    <image :src="src" :mode="mode" alt="" :style="{height:height,width:width,borderRadius:borderRadius}" @click="handel"></image>
</template>

<script>
    export default {
        name: "index",
        props:{
            src:{
                type:String,
                default:''
            },
            mode:{
                type:String,
                default:'scaleToFill'
            },
            size:{
                type:String|Number,
                default:'60'
            },
            shape:{
                type:String,
                default:'circle'
            }
        },
        computed:{
            width(){
                return this.size+'rpx'
            },
            height(){
                return this.size+'rpx'
            },
            borderRadius(){
                if(this.shape==='circle'){
                    return '50%'
                }else if(this.shape==='square'){
                    return '10%'
                }else{
                    return '1px'
                }
            }
        },
        methods:{
            handel(){
                this.$emit('click')
            }
        }
    }
</script>

<style scoped lang="scss">
    image {
        border:1rpx solid rgba(255, 255, 255, 0.2);box-sizing: border-box;
    }
</style>