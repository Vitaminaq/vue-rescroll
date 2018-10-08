import Vue, { VNode } from 'vue';

/**
 * re-scroll指令封装，它是一个管理整个项目所有滚动状态的智能化指令，
 * 拥有了它，你可以为所欲为。
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

export interface Options {
    dom: HTMLElement,
    name: string,
    rescroll: any
}
class RestoreScroll extends Vue {
    opt: Options;
    watchScroll: any;
    app: any;
    timer: any;
    scrollTimer: any;
    constructor (options: Options) {
        super();
        this.opt = options;
        this.timer = {};
        this.scrollTimer= {};
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
                    let position = {
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
    scrollTo ():this {
        const { dom, name, rescroll } = this.opt;
        const a = rescroll[name];
        this.$nextTick(() => {
            if (a) {
                dom.scrollLeft = a.position.x;
                dom.scrollTop = a.position.y;
            } else {
                dom.scrollLeft = 0;
                dom.scrollTop = 0;
            }
        });
        return this;
    }
    destroy ():this {
        const { dom } = this.opt;
        dom.removeEventListener('scroll', this.watchScroll, false);
        return this;
    }
}

// interface Ele extends
interface Binding {
    value: object
}

interface MyHTMLElement extends HTMLElement {
    restoreScroll?: any
}

interface VueRoot extends Vue {
    $rescroll?: object
}

let nowName: string = '';
const directive = {
    inserted: function (el: MyHTMLElement, binding: any, vnode: VNode) {
        if (!vnode.context) return;
        const root: VueRoot = vnode.context.$root;
        if (!root.$rescroll) {
            root.$rescroll = {};
        }
        nowName = binding.value.name;
        let options: Options = {
            dom: el,
            name: binding.value.name,
            rescroll: root.$rescroll
        };
        if (el.restoreScroll) {
            return el.restoreScroll.update(options);
        }
        el.restoreScroll = new RestoreScroll(options);
    },
    componentUpdated: function (el: MyHTMLElement, binding: any, vnode: VNode) {
        nowName = binding.value.name;
        if (!vnode.context) return;
        const root: VueRoot = vnode.context.$root;
        if (!root.$rescroll) {
            root.$rescroll = {};
        }
        let options: Options = {
            dom: el,
            name: binding.value.name,
            rescroll: root.$rescroll
        };
        if (el.restoreScroll) {
            return el.restoreScroll.update(options);
        }
        el.restoreScroll = new RestoreScroll(options);
    },
    unbind (el: MyHTMLElement) {
        el.restoreScroll.destroy();
        delete el.restoreScroll;
    }
};
export default {
    install (Vue: any) {
        Vue.directive('rescroll', directive);
    }
};
