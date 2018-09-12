# vue-rescroll 是一款滚动状态管理指令化的插件。</br>Is a rolling state management instruction plug-in.

## How to use it

### install
```

npm install vue-rescroll --save

```

#use
created a new vuex store modules:</br>
这里用了typescript的语法，你可以换成js来写。</br> Here you use the syntax of typescript, and you can write it in JS.
```
interface Position {
    x: number,
    y: number
}
class ScrollPosition {
    position: Position = {
        x: 0,
        y: 0
    }
    $savePosition (position: Position) {
        return Object.assign(this.position, position);
    }
}
```
###这是我自己在vuex基础上封装的代码，你可以用正常的vuex写法编写</br>This is my own layer wrapped on vuex to support ES6 class, if you use the default vuex, write the getter, actions, mutations attributes directly, just as normal.

```
// module ScrollStore
class ScrollStore {
    // state
    state = {
        scroll: {}
    }
    // getter = {_scrollStore}
    _scrollStore (state: any) {
        return state.scroll;
    }
    // mutations = {$openScrollStore, $saveScrollStore, $getScrollStore}
    $openScrollStore (state: any, name: string): this {
        if (state.scroll[name]) return this;
        state.scroll[name] = new ScrollPosition();
        return this;
    }
    $saveScrollStore (state: any, params: any): this {
        const {name, position} = params;
        state.scroll[name].$savePosition(position);
        return this;
    }
    $getScrollStore (state: any, name: string): this {
        return state.scroll[name].position;
    }
}

export default ScrollStore;
```

###如何用在.vue的文件中（'name' 一定要使用一个不冲突的标志。path即你保存滚动条的vuex module名字）；
```
<div v-rescroll="{name: 'A unique marker', path: 'scrollStore'}"></div>
```
