<template>
    <view class="jd-icon-btn flex-c-center" hover-class="hover-style" :class="[type]" @click="onclick">
        <uni-icons v-if="name==='trash'" :color="setColor" :size="Math.floor(size /2)" :type="name"/>
        <u-icon v-else :name="name" :color="setColor" :size="size"/>
    </view>
</template>

<script>
    export default {
        name: 'jd-icon-btn',
        props: {
            name: {
                type: String,
                default: ''
            },
            color: {
                type: String,
                default: ''
            },
            size: {
                type: [String, Number],
                default: 26
            },
            // primary info
            type: {
                type: String,
                default: ''
            },

        },
        computed:{
            setColor(){
                const typeArr = ['info','primary']
                if(typeArr.includes(this.type)){
                    return '#FFF'
                }else {
                    return this.color
                }
            }
        },
        methods:{
            onclick(){
                this.$emit('onClick')
            }
        }
    }
</script>

<style scoped lang="scss">
    .jd-icon-btn {
        width: 26px;
        height: 26px;
        border: 1px solid #D9D9D9;
        box-sizing: border-box;
        border-radius: 50%;

        &.primary {
            border: none;
            background: $primary;
        }

        &.info {
            border: none;
            background: rgba(255,255,255,.2);
        }
    }
</style>
