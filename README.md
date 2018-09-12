# vue-rescroll 是一款滚动状态管理指令化的插件。

## How to use it

``` bash

# install
npm install vue-rescroll --save
#use
created a new vuex store modules:

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
This is my own layer wrapped on vuex to support ES6 class, if you use the default vuex, write the getter, actions, mutations attributes directly, just as normal.
// moudule ScrollStore
class ScrollStore {
    // state
    state = {
        scroll: {}
    }
    // getter
    _scrollStore (state: any) {
        return state.scroll;
    }
    // mutations
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

#.vue file
<div v-rescroll="{name: 'A unique marker', path: 'scrollStore'}"></div>
'name' 一定要使用一个不冲突的标志。
