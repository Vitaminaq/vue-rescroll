import Vue from 'vue';

/**
 * re-scroll指令封装，它是一个管理整个项目所有滚动状态的智能化指令，
 * 拥有了它，你可以为所欲为。
 */
export interface Options {
    dom: any,
    name: string,
    path: string,
    vnode: any
}
class RestoreScroll extends Vue {
    opt: Options;
    watchScroll: Function;
    app: any;
    store: any;
    timer: any;
    scrollTimer: any;
    constructor (options: Options) {
        super();
        this.opt = options;
        this.timer = {};
        this.scrollTimer= {};
        this.store = options.vnode.context.$store;
        this.openScrollStore();
        this.getPosition();
        this.watchScroll = () => {};
        this.scrollTo();
    }
    update (): this {
        this.scrollTo();
        return this;
    }
    openScrollStore ():this {
        const { path, name } = this.opt;
        this.store.commit(`${path}/$openScrollStore`, name);
        return this;
    }
    getPosition ():this {
        if (this.watchScroll) return this;
        const { dom, path, name } = this.opt;
        this.watchScroll = () => {
            if (name === nowName) {
                const key = `timer-${path}-${name}`;
                clearTimeout(this.timer[key]);
                this.timer[key] = setTimeout(() => {
                    let position = {
                        x: dom.scrollLeft,
                        y: dom.scrollTop
                    };
                    this.store.commit(`${path}/$saveScrollStore`, {name, position});
                    delete this.timer[key];
                }, 1000/60);
            }
        };
        dom.addEventListener('scroll', this.watchScroll, false);
        return this;
    }
    scrollTo ():this {
        const { dom, name, path } = this.opt;
        let a = this.store.getters[`${path}/_scrollStore`];
        this.$nextTick(() => {
            if (a[name]) {
                dom.scrollLeft = a[name].position.x;
                dom.scrollTop = a[name].position.y;
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

let restoreScroll:any = {};
let nowName: string = '';
const directive = {
    inserted: function (el: any, binding: any, vnode: any) {
        nowName = binding.value.name;
        let options: Options = {
            dom: el,
            name: binding.value.name,
            path: binding.value.path,
            vnode: vnode
        };
        if (restoreScroll[options.name]) {
            return restoreScroll[options.name].update(options);
        }
        restoreScroll[options.name] = new RestoreScroll(options);
    },
    componentUpdated: function (el: any, binding: any, vnode: any) {
        nowName = binding.value.name;
        let options: Options = {
            dom: el,
            name: binding.value.name,
            path: binding.value.path,
            vnode: vnode
        };
        if (restoreScroll[options.name]) {
            return restoreScroll[options.name].update(options);
        }
        restoreScroll[options.name] = new RestoreScroll(options);
    },
    unbind (el: any, binding: any) {
        restoreScroll[binding.value.name].destroy();
        delete restoreScroll[binding.value.name];
    }
};
export default {
    install (Vue: any) {
        Vue.directive('rescroll', directive);
    }
};
