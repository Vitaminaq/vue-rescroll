# vue-rescroll 是一款滚动状态管理指令化的插件。</br>Is a rolling state management instruction plug-in.

![https://img.shields.io/npm/v/vue-rescroll.svg?label=vue-rescroll](https://www.npmjs.com/package/vue-rescroll)  ![总下载量](https://img.shields.io/npm/dt/vue-rescroll.svg)

## How to use it

### install
```bash
npm install vue-rescroll --save
```
目前只做了局部滚动的，所以请设置滚动区域的高度，后面会添加window全局滚动条。  
At present, only partial scrolling has been done, so please set the height of the scrolling area, and then add the windows global scroll bar.
### use
#### v1.0.13以上 v1.0.13 or above
为了使插件在所有的vue项目中兼容，所以把状态管理从vuex中抽离，自己定义了一套滚动状态存储的规则，从而也简化了该插件的使用。</br>
In order to make plug-ins compatible in all Vue projects, state management is removed from vuex, and a set of rules for rolling state storage is defined, thus simplifying the use of the plug-in.</br>
main.js
``` 
import VueRescroll from 'vue-rescroll'
Vue.use(VueRescroll);
```
如何用在.vue的文件中（'name' 一定要使用一个不冲突的标志）；</br>
How to use it in.Vue files ('name'must use a non conflicting flag). 
```javascript
<div v-rescroll="{name: 'A unique marker'}"></div>
```
页面不要使用keep-alive缓存，那样的话，钩子函数不会触发，如果你的页面没必要每次刷新，第一次加载可以用vuex把数据保存起来，每次进入页面时不请求ajax直接去store里面拿，这样页面就没有跳动的状况。如果每次都要刷新，可以在进入页面时加上loading动画把这个跳动的瞬间遮盖掉，或者加上路由动画也能达到同样的效果。</br>
Don't use keep-alive caching for your pages. In that case, the hook function won't trigger. If your pages don't need to be refreshed every time, you can save the data with vuex for the first load. You don't ask Ajax to go directly to store every time you enter the page, so the page won't jump. If you need to refresh each time, you can add a loading animation to the page to mask the jump, or add a routing animation to the page to achieve the same effect. for example：</br>

使用vuex缓存数据/use vuex
```javascript
async created () {
    if (hasData) return hasData;
    return await this.getData();
}
```
必须要每次刷新的页面/must refreshed
```javascript
async created () {
    openLoading();
    await this.getData();
    closeLoading();
}
```
[详细描述各种现象博客地址](https://blog.csdn.net/theoneEmperor/article/details/82669022)
