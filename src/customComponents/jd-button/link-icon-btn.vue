<template>
    <view @click="onclick" class="flex-r">
        <u-icon name="plus" color="#3071EA" size="28" />
        <view class="text">
            <slot />
        </view>
    </view>
</template>

<script>
    export default {
        name: 'icon-link-btn',
        methods:{
            onclick(){
                this.$emit('onClick')
            }
        },

    }
</script>

<style scoped lang="scss">
    .text{
       color: $primary;
        font-size: $font-s-base;
    }
</style>
