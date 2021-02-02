<template>
    <view class="list-item" @click="submit">
        <view class="l-type" v-if="type === 'img'" :style="[itemStyle]">
            <!--			<image :class="'img ' + 'img-size-' + imgSize" :src="imgUrl"></image>-->
            <view class="img" :class="'img ' + 'img-size-' + imgSize">
                <u-image
                        :width="imageSize" :height="imageSize"
                        lazy-load
                        border-radius="4"
                         :src="imgUrl">
                </u-image>
            </view>
            <slot name="content"></slot>
        </view>
        <view class="default-wrapper" :class="[itemType]" v-else :style="[itemStyle]">
            <text class="title-text">{{title}}</text>
            <slot name="content"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            // normal img
            type: {
                type: String,
                default: 'normal'
            },
            // sm md lg
            imgSize: {
                type: [String],
                default: ''
            },
            imgUrl: {
                type: String,
                default: '../../static/home/blg@2x.png'
            },
            itemStyle: {
                type: Object,
                default: () => {
                }
            },
            title:{
                type: String,
                default: ''
            },
          itemType:{
            type: String,
            default: ''
          },
          itemData:{
            type: [Object,Array],
            default: null
          }
        },
        data() {
            return {}
        },
        computed: {
            imageSize() {
                switch (this.imgSize) {
                    case 'md':
                        return 140
                    case 'sm':
                        return 60
                    default:
                        return 120
                }
            }
        },
        methods: {
          submit(){
            if(this.itemData) this.$emit('submit',this.itemData)
          }
        }
    }
</script>

<style lang="scss" scoped>
    .list-item {
        .default-wrapper{
            padding-left:40rpx;
            padding-right: 20rpx;
            display: flex;
          margin-bottom: 5px;
          &.space-between{
            justify-content: space-between;
          }
          .title-text{
              white-space:nowrap;
              display: inline-block;
                margin-right: 28rpx;
                color: $text-color-grey;
            }
        }

        .l-type {
            display: flex;
            /*align-items: center;*/
            .img {
                position: relative;
                width: 120rpx;
                height: 120rpx;
                /*flex:0 0 120rpx;*/
                display: flex;
                margin-right: 20rpx;
                &.img-size-lg {

                }

                &.img-size-md {
                    width: 140rpx;
                    height: 140rpx;
                    /*flex:0 0 140rpx;*/
                }

                &.img-size-sm {
                    width: 60rpx;
                    height: 60rpx;
                    /*flex:0 0 60rpx;*/
                }
            }
        }
    }
</style>
