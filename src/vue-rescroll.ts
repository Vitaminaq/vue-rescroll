import Vue, { VNode, VueConstructor, VNodeDirective, PluginObject } from 'vue';
import { DirectiveOptions } from 'vue/types/options';

/**
 * re-scroll指令封装，它是一个管理整个项目所有滚动状态的智能化指令，
 * 拥有了它，你可以为所欲为。
 */

/**
 * 每个滚动条的位置存放类
 */
interface Position {
	x: number;
	y: number;
}
class ScrollPosition {
	position: Position = {
		x: 0,
		y: 0
	};
	$savePosition(position: Position) {
		return Object.assign(this.position, position);
	}
}

/**
 * 指令类
 */
interface Options {
	dom: HTMLElement;
	name: string;
	type: string;
	storageMode: string;
	key: string | number;
	vnode: VNode;
	rescroll?: any;
}
class RestoreScroll {
	opt: Options;
	watchScroll?: () => void;
	vnode: VNode = {} as VNode;
	timer: any;
	constructor(options: Options) {
		this.opt = options;
		this.timer = {};
		this.openScrollStore();
		this.getPosition();
		this.scrollTo();
	}
	update(): this {
		this.scrollTo();
		return this;
	}
	openScrollStore(): this {
		const { rescroll = null, name, storageMode = '' } = this.opt;
		if (!rescroll || storageMode === 'localstorage') return this;
		if (!rescroll[name]) {
			rescroll[name] = new ScrollPosition();
		}
		return this;
	}
	getPosition(): this {
		const { dom, name, rescroll, type, storageMode, key } = this.opt;
		let tag;
		if (type && type === 'window') {
			tag = window;
		} else {
			tag = dom;
		}
		this.watchScroll = () => {
			if (name === nowName) {
				const keys = `timer-${name}`;
				clearTimeout(this.timer[keys]);
				this.timer[keys] = setTimeout(() => {
					let position;
					if (type && type === 'window') {
						position = {
							x: window.scrollX,
							y: window.scrollY
						};
					} else {
						position = {
							x: dom.scrollLeft,
							y: dom.scrollTop
						};
					}
					if (storageMode && storageMode === 'localstorage') {
						localStorage.setItem(
							`${key}`,
							JSON.stringify(position)
						);
					} else {
						rescroll[name].$savePosition(position);
					}
					delete this.timer[key];
				}, 1000 / 60);
			}
		};
		tag.addEventListener('scroll', this.watchScroll, false);
		return this;
	}
	scrollTo(): this {
		const { dom, name, rescroll, type, storageMode, key, vnode } = this.opt;
		let position;
		if (storageMode && storageMode === 'localstorage') {
			const str = localStorage.getItem(`${key}`);
			if (!str) return this;
			position = JSON.parse(str);
		} else {
			position = rescroll[name].position;
		}
		if (!position) return this;
		const { x = 0, y = 0 } = position;
		if (!vnode.context) return this;
		vnode.context.$nextTick(() => {
			if (type && type === 'window') {
				window.scrollTo(x, y);
			} else {
				if (
					!rescroll[name] ||
					dom.scrollHeight < y ||
					dom.scrollWidth < x
				) {
					dom.scrollLeft = 0;
					dom.scrollTop = 0;
					return this;
				} else {
					dom.scrollLeft = x;
					dom.scrollTop = y;
				}
			}
		});
		return this;
	}
	destroy(): this {
		const { dom } = this.opt;
		if (this.watchScroll) {
			dom.removeEventListener('scroll', this.watchScroll, false);
		}
		return this;
	}
}

interface Value {
	name: string;
	type?: 'window' | 'local';
	storageMode?: 'localstorage' | 'default';
	key?: string | number;
	domType?: 'tab' | 'default';
}
interface Binding extends VNodeDirective {
	value?: Value;
}

interface DirectiveHTMLElement extends HTMLElement {
	restoreScroll?: any;
}

interface VueRoot extends Vue {
	$rescroll?: any;
}

let nowName: string = '';
const fun = (el: DirectiveHTMLElement, binding: Binding, vnode: VNode) => {
	if (!binding.value) throw Error('please set required parameters');
	nowName = binding.value.name;
	if (!vnode.context) throw Error('it is not a vnode');
	if (!vnode.context.$root) return;
	const root: VueRoot = vnode.context.$root;
	let options: Options;
	const { name, type = '', storageMode = '', key = '', domType = '' } = binding.value;
	if (!name) throw Error('please set name');
	if (binding.value.storageMode === 'localstorage') {
		options = {
			dom: el,
			name,
			type,
			storageMode,
			key,
			vnode
		};
	} else {
		if (!root.$rescroll) {
			root.$rescroll = {};
		}
		options = {
			dom: el,
			name,
			type,
			storageMode,
			key,
			vnode,
			rescroll: root.$rescroll
		};
	}
	if (!el.restoreScroll) {
		el.restoreScroll = {};
	}
	if (!el.restoreScroll[nowName]) {
		el.restoreScroll[nowName] = new RestoreScroll(options);
		return;
	} else {
		if (domType && domType === 'tab') {
			el.restoreScroll[nowName].update(options);
		}
		return;
	}
};
export const directive: DirectiveOptions = {
	inserted: function(
		el: DirectiveHTMLElement,
		binding: Binding,
		vnode: VNode
	) {
		return fun(el, binding, vnode);
	},
	componentUpdated: function(
		el: DirectiveHTMLElement,
		binding: Binding,
		vnode: VNode
	) {
		return fun(el, binding, vnode);
	},
	unbind(el: DirectiveHTMLElement) {
		if (!el.restoreScroll || !el.restoreScroll[nowName]) return;
		el.restoreScroll[nowName].destroy();
		delete el.restoreScroll;
	}
};

const plugin: PluginObject<any> = {
	install(Vue: VueConstructor) {
		Vue.directive('rescroll', directive);
	}
};

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
