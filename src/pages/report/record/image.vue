<template>
    <view class="imagecontent">
        <movable-area scale-area class="movable-area">
            <movable-view
                    class="movable-view"
                    direction="all"
                    :scale="true"
                    scale-min="1"
                    scale-max="6"
                    :scale-value="scale"
                    @dblclick="dblclick"
            >
                <image
                        class="lookimg"
                        :src="dataimg"
                        mode="widthFix"
                ></image>
            </movable-view>
        </movable-area>
    </view>
</template>

<script>
    export default {
        name: "look-image",
        data(){
            return{
                dataimg: '',//图片地址
                scale: 1
            }
        },
        onLoad(par){
            this.dataimg = par.image||'http://hisp-dev128.clear-sz.com/files/6366464313064340450643.jpg'
        },
        methods:{
            dblclick() {
                if (this.scale === 10) {
                    this.scale = 1;
                } else {
                    this.scale = 10;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .movable-view {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        text-align: center;
    }

    .movable-area {
        height: 100%;
        width: 100%;
        position: fixed;
        overflow: hidden;
    }

    .movable-view image {
        width: 100%;
    }
    .lookimg {
        display: block;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    .imagecontent {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 1);
        top: 0;
        position: fixed;
    }
    </style>
</style>