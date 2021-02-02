<template>
    <view class='content'>
        <scroll-view class='images' scroll-y="true" scroll-x="true" style="height:100%;width:100%" bindtouchmove="touchmoveCallback" bindtouchstart="touchstartCallback">
            <image mode='aspectFit' :src="dataimg" :style="{width:scaleWidth,height:scaleHeight}" @bindload="imgload"></image>
        </scroll-view>
    </view>
</template>

<script>
    export default {
        name: "look-image",
        data(){
            return{
                dataimg: '',//图片地址
                distance: 0,//手指移动的距离
                scale: 1,//图片的比例
                baseWidth: null,//图片真实宽度
                baseHeight: null,//图片真实高度
                scaleWidth: '',//图片设显示宽度
                scaleHeight: '',//图片设显示高度
            }
        },
        onLoad(par){
            this.dataimg = par.image
        },
        methods:{
            imgload(e) {
                this.baseWidth = e.detail.width; //获取图片真实宽度
                this.baseHeight = e.detail.height; //获取图片真实高度
                this.scaleWidth = '100%'; //给图片设置宽度
                this.scaleHeight = '100%' //给图片设置高度
            },
            /**
             * 双手指触发开始 计算开始触发两个手指坐标的距离
             */
            touchstartCallback(e) {
                // 单手指缩放开始，不做任何处理
                if (e.touches.length === 1) return;
                // 当两根手指放上去的时候，将距离(distance)初始化。
                let xMove = e.touches[1].clientX - e.touches[0].clientX;
                let yMove = e.touches[1].clientY - e.touches[0].clientY;
                //计算开始触发两个手指坐标的距离
                this.distance = Math.sqrt(xMove * xMove + yMove * yMove);
            },
            /**
             * 双手指移动   计算两个手指坐标和距离
             */
            touchmoveCallback(e) {
                // 单手指缩放不做任何操作
                if (e.touches.length === 1) return;
                //双手指运动 x移动后的坐标和y移动后的坐标
                let xMove = e.touches[1].clientX - e.touches[0].clientX;
                let yMove = e.touches[1].clientY - e.touches[0].clientY;
                //双手指运动新的 ditance
                let distance = Math.sqrt(xMove * xMove + yMove * yMove);
                //计算移动的过程中实际移动了多少的距离
                let distanceDiff = distance - this.data.distance;
                let newScale = this.data.scale + 0.005 * distanceDiff
                // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
                if (newScale >= 1) {
                    newScale = 1
                    this.scaleWidth = newScale * this.data.baseWidth + 'px'
                    this.scaleHeight = newScale * this.data.baseHeight + 'px'
                    this.distance = distance;
                    this.scale = newScale;
                    this.diff = distanceDiff
                }
                //为了防止缩放得太小，所以scale需要限制
                if (newScale <= 0.3) {
                    newScale = 0.3
                    this.scaleWidth = '100%';
                    this.scaleHeight = '100%';
                    this.distance = distance;
                    this.scale = newScale;
                    this.diff = distanceDiff;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .content {
        height: 100vh;
        font-size: 0;
    }

    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }

    .images image {
        text-align: center;
    }
</style>