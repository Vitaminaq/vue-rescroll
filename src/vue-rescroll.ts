import Vue, { VNode, VueConstructor, VNodeDirective } from 'vue';

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
class RestoreScroll extends Vue {
	opt: Options;
	watchScroll?: () => void;
	vnode: VNode = {} as VNode;
	constructor(options: Options) {
		super();
		this.opt = options;
		this.openScrollStore();
		this.getPosition();
		this.scrollTo();
	}
	init(options): this {
		this.opt = options;
		const { vnode = null } = options;
		if (!vnode || !vnode.context) throw Error('it is not vonde');
		this.vnode = vnode;
		return this;
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
		this.watchScroll = () => {
			if (name === nowName) {
				requestAnimationFrame(() => {
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
						localStorage.setItem(`${key}`, position);
					} else {
						rescroll[name].$savePosition(position);
					}
				});
			}
		};
		dom.addEventListener('scroll', this.watchScroll, false);
		return this;
	}
	scrollTo(): this {
		const { dom, name, rescroll, type, storageMode, key } = this.opt;
		let position;
		if (storageMode && storageMode === 'localstorage') {
			position = localStorage.getItem(`${key}`);
		} else {
			position = rescroll[name].position;
		}
		if (!position) return this;
		const { x = 0, y = 0 } = position;
		this.vnode.context.$nextTick(() => {
			if (type && type === 'window') {
				if (window.scrollX < x || window.scrollY < y) {
					window.scrollTo(0, 0);
				} else {
					window.scrollTo(x, y);
				}
			} else {
				if (
					!rescroll[name] ||
					dom.scrollHeight < y ||
					dom.scrollWidth < x
				) {
					dom.scrollLeft = 0;
					dom.scrollTop = 0;
					return this;
				}
			}
			this.$nextTick(() => {
				dom.scrollLeft = x;
				dom.scrollTop = y;
			});
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
	type: string;
	storageMode: string;
	key: string | number;
}
interface Binding extends VNodeDirective {
	value: Value;
}

interface DirectiveHTMLElement extends HTMLElement {
	restoreScroll?: any;
}

interface VueRoot extends Vue {
	$rescroll?: any;
}

let nowName: string = '';
const fun = (el: DirectiveHTMLElement, binding: Binding, vnode: VNode) => {
	nowName = binding.value.name;
	if (!vnode.context) return;
	if (!vnode.context.$root) return;
	const root: VueRoot = vnode.context.$root;
	let options: Options;
	const { name, type = '', storageMode = '', key = '' } = binding.value;
	if (!name) throw Error('please set name');
	if (binding.value.type === 'localstorage') {
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
		el.restoreScroll[nowName].update(options);
		return;
	}
};
const directive: any = {
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

const plugin = {
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
