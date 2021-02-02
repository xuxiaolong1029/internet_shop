<template>
    <view class="u-swiper-wrap" :style="{borderRadius: `${borderRadius}rpx`}">
        <swiper :current="current" @change="change" :interval="interval" :circular="circular" :duration="duration" :autoplay="autoplay"
                :previous-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'" :next-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
                :style="{height: height + 'rpx',backgroundColor: bgColor}">
            <swiper-item class="u-swiper-item" v-for="(item, index) in list" :key="index">
                <view class="u-list-image-wrap" @tap.stop.prevent="listClick(item)" :class="[uCurrent !== index ?'u-list-scale':'']" :style="{
						borderRadius: `${borderRadius}rpx`,
						transform: effect3d && uCurrent !== index ? 'scaleY(0.9)' : 'scaleY(1)',
						margin: effect3d && uCurrent !== index ? '0 20rpx' : 0,
					}">
                    <slot :item="item"></slot>
                </view>
            </swiper-item>
        </swiper>
        <view class="u-swiper-indicator" style="top:auto;bottom:-30rpx;justify-content:center" :style="{
				padding: `0 ${effect3d ? '74rpx' : '24rpx'}`
			}">
            <view class="u-indicator-item" :class="{ 'u-indicator-item-active': index === uCurrent }" v-for="(item, index) in list"
                  :key="index"></view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "u-swiper",
        props: {
            list: {
                type: Array,
                default () {
                    return [];
                }
            },
            // 圆角值
            borderRadius: {
                type: [Number, String],
                default: 8
            },
            // 隔多久自动切换
            interval: {
                type: [String, Number],
                default: 3000
            },
            // list的高度，单位rpx
            height: {
                type: [Number, String],
                default: 250
            },
            // 是否开启缩放效果
            effect3d: {
                type: Boolean,
                default: false
            },
            //#ifdef H5
            // 3D模式的情况下，激活item与前后item之间的距离，单位rpx
            effect3dPreviousMargin: {
                type: [Number, String],
                default:40
            },
            //#endif
            //#ifndef H5
            effect3dPreviousMargin: {
                type: [Number, String],
                default:20
            },
            // #endif
            // 是否自动播放
            autoplay: {
                type: Boolean,
                default: true
            },
            // 自动轮播时间间隔，单位ms
            duration: {
                type: [Number, String],
                default: 500
            },
            // 是否衔接滑动，即到最后一张时接着滑动，是否自动切换到第一张
            circular: {
                type: Boolean,
                default: true
            },
            // 背景颜色
            bgColor: {
                type: String,
                default: '#fff'
            },
            // 初始化时，默认显示第几项
            current: {
                type: Number,
                default: 0
            }
        },
        watch: {
            // 如果外部的list发生变化，判断长度是否被修改，如果前后长度不一致，重置uCurrent值，避免溢出
            list(nVal, oVal) {
                if(nVal.length !== oVal.length) this.uCurrent = 0;
            },
            // 监听外部current的变化，实时修改内部依赖于此测uCurrent值，如果更新了current，而不是更新uCurrent，
            // 就会错乱，因为指示器是依赖于uCurrent的
            current(n) {
                this.uCurrent = n;
            }
        },
        data() {
            return {
                uCurrent: this.current // 当前活跃的swiper-item的index
            };
        },
        methods: {
            listClick(item) {
                this.$emit('click', item);
            },
            change(e) {
                let current = e.detail.current;
                this.uCurrent = current;
                // 发出change事件，表示当前自动切换的index，从0开始
                this.$emit('change', current);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .u-swiper-wrap {
        position: relative;
        transform: translateY(0);
        .u-swiper-item {
            display: flex;
            flex-direction: row;
            overflow: hidden;
            align-items: center;
            .u-list-image-wrap {
                width: 100%;
                height: 100%;
                flex: 1;
                transition: all 0.5s;
                overflow: hidden;
                position: relative;
            }
            .u-list-scale {
                transform-origin: center center;
            }
        }
        .u-swiper-indicator {
            padding: 0 24rpx;
            position: absolute;
            display: flex;
            flex-direction: row;
            width: 100%;
            z-index: 1;
            .u-indicator-item {
                width: 12rpx;
                height: 12rpx;
                margin: 0 6rpx;
                border-radius: 20rpx;
                transition: all 0.5s;
                background-color:#d9d9d9;
            }
            .u-indicator-item-active {
                width: 34rpx;
                background-color: rgba($color:#3071ea, $alpha: 0.8);
            }
        }
    }
</style>