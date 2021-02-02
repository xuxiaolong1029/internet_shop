## 项目介绍 
由于涉及到夸平台，本项目使用的是[uni-app](https://uniapp.dcloud.io/README)
请遵循官方语法标准编码 

### 支付宝小程序开发注意
```
1、showLoading 是不透传的，也就是说 loading 显示的时候无法点击页面内容。
2、文件名或文件夹名中不允许出现 @ 符号。
3、网络请求返回的数据会严格按照 dataType 进行处理，如果不符合规范则会抛出错误，而不是按照原格式返回。
4、canvas 组件的标识是 id，而不是 canvas-id。目前还未进行处理，所以需要主动添加 id 属性。
5、目前测试的结果，导航栏只有设置背景颜色为 #FFF(FFF) 时才会变成黑色文字。
6、支付宝小程序的导航栏是支持透明渐变效果的，后面会提供相关的配置。
7、使用伪元素做边框时，高度值不能用 1rpx，需要直接用 1px。
8、不支持 ECharts。
9、支付功能模拟不了，需要真机测试。
```



### 一、跨平台技术选型
   1.Uni-app H5 微信/支付宝/百度/字节/QQ/360等小程序 Android iOS 
### 二、UI框架
   1.uview 按需引入

### 三、CSS编译 sass

### 四、项目结构 
```
   1、components /*插件市场下载的组件可直接使用 无需引用*/
   2、viewComponents /*容器组件*/
   3、costomComponents /*自定义组件*/
   4、config /*配置项*/
   5、filters /*全局过滤器*/
   6、mixins /*混入*/
   7、pages /*页面*/
   8、service /*API服务*/
   9、static /*静态文件*/
   10、store /*vuex*/
   11、style /*公共样式*/
   12、utils /*工具方法*/
```
   
  
### 五、命令行编译打包
```
 // 支付宝为例
 
 npm run dev:mp-alipay // 调试
 
 npm run build:mp-alipay //打包
```
https://uniapp.dcloud.io/quickstart-cli

### 六、生态-官方插件市场
https://ext.dcloud.net.cn/

### 七、代码规范 
```
1、IDE缩进4空格
```
### 八、跨端条件编译
https://uniapp.dcloud.io/platform

### 九、区别于传统 web 开发的注意
https://uniapp.dcloud.io/matter?id=h5-%e5%bc%80%e5%8f%91%e6%b3%a8%e6%84%8f

### 十、部署前端服务跨域通过nginx处理


