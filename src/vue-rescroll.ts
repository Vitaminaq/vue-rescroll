import Vue, { VNode, VueConstructor } from 'vue';
import { DirectiveBinding, DirectiveOptions } from 'vue/types/options';

/**
 * re-scroll指令封装，它是一个管理整个项目所有滚动状态的智能化指令，
 * 拥有了它，你可以为所欲为。
 */

/**
 * 每个滚动条的位置存放类
 */
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

/**
 * 指令类
 */
export interface Options {
    dom: HTMLElement;
    name: string;
    rescroll: any;
    vnode: VNode;
}
class RestoreScroll {
    opt: Options;
    watchScroll?: () => void;
    timer: any;
    constructor (options: Options) {
        this.opt = options;
        this.timer = {};
        this.openScrollStore();
        this.getPosition();
        this.scrollTo();
    }
    update (): this {
        this.scrollTo();
        return this;
    }
    openScrollStore ():this {
        const { rescroll, name } = this.opt;
        if (!rescroll[name]) {
            rescroll[name] = new ScrollPosition();
        }
        return this;
    }
    getPosition ():this {
        const { dom, name, rescroll } = this.opt;
        this.watchScroll = () => {
            if (name === nowName) {
                const key = `timer-${name}`;
                clearTimeout(this.timer[key]);
                this.timer[key] = setTimeout(() => {
                    const position = {
                        x: dom.scrollLeft,
                        y: dom.scrollTop
                    };
                    rescroll[name].$savePosition(position);
                    delete this.timer[key];
                }, 1000/60);
            }
        };
        dom.addEventListener('scroll', this.watchScroll, false);
        return this;
    }
    scrollTo (): this {
        const { dom, name, rescroll, vnode } = this.opt;
        const { x, y } = rescroll[name].position;
        if (!rescroll[name] || dom.scrollHeight < y || dom.scrollWidth < x) {
            dom.scrollLeft = 0;
            dom.scrollTop = 0;
            return this;
        }
        if (!vnode.context) return this;
        vnode.context.$nextTick(() => {
            dom.scrollLeft = x;
            dom.scrollTop = y;
        });
        return this;
    }
    destroy ():this {
        const { dom } = this.opt;
        if (this.watchScroll) {
            dom.removeEventListener('scroll', this.watchScroll, false);
        }
        return this;
    }
}

interface DirectiveHTMLElement extends HTMLElement {
    restoreScroll?: any
}

interface VueRoot extends Vue {
    $rescroll?: any
}

let nowName: string = '';
const directive:DirectiveOptions = {
    inserted: function (el: DirectiveHTMLElement, binding: DirectiveBinding, vnode: VNode) {
        nowName = binding.value.name;
        if (!vnode.context) return this;
        if (!vnode.context.$root) return this;
        const root: VueRoot = vnode.context.$root;
        if (!root.$rescroll) {
            root.$rescroll = {};
        }
        const options: Options = {
            dom: el,
            name: binding.value.name,
            rescroll: root.$rescroll,
            vnode
        };
        if (!el.restoreScroll) {
            el.restoreScroll = {};
        }
        if (!el.restoreScroll[nowName]) {
            el.restoreScroll[nowName] = new RestoreScroll(options);
            return this;
        } else {
            el.restoreScroll[nowName].update(options);
            return this;
        }
    },
    componentUpdated: function (el: DirectiveHTMLElement, binding: DirectiveBinding, vnode: VNode) {
        nowName = binding.value.name;
        if (!vnode.context) return this;
        if (!vnode.context.$root) return this;
        const root: VueRoot = vnode.context.$root;
        if (!root.$rescroll) {
            root.$rescroll = {};
        }
        const options: Options = {
            dom: el,
            name: binding.value.name,
            rescroll: root.$rescroll,
            vnode
        };
        if (!el.restoreScroll) {
            el.restoreScroll = {};
        }
        if (!el.restoreScroll[nowName]) {
            el.restoreScroll[nowName] = new RestoreScroll(options);
            return this;
        } else {
            el.restoreScroll[nowName].update(options);
            return this;
        }
    },
    unbind (el: DirectiveHTMLElement) {
        if (!el.restoreScroll || !el.restoreScroll[nowName]) return;
        el.restoreScroll[nowName].destroy();
        delete el.restoreScroll;
    }
};

const plugin = {
    install (Vue: VueConstructor) {
        Vue.directive('rescroll', directive);
    }
}

export default plugin;

if (typeof window !== 'undefined' && !!window.Vue) {
  window.Vue.use(plugin);
} 

/**
 * 在window对象中添加app对象
 */
declare global {
	interface Window {
		Vue: VueConstructor;
	}
}
