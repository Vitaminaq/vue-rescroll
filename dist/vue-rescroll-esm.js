import Vue from 'vue';

var ScrollPosition = function ScrollPosition() {
    this.position = {
        x: 0,
        y: 0
    };
};
ScrollPosition.prototype.$savePosition = function $savePosition (position) {
    return Object.assign(this.position, position);
};
var RestoreScroll = (function (Vue$$1) {
    function RestoreScroll(options) {
        Vue$$1.call(this);
        this.opt = options;
        this.timer = {};
        this.openScrollStore();
        this.getPosition();
        this.scrollTo();
    }

    if ( Vue$$1 ) RestoreScroll.__proto__ = Vue$$1;
    RestoreScroll.prototype = Object.create( Vue$$1 && Vue$$1.prototype );
    RestoreScroll.prototype.constructor = RestoreScroll;
    RestoreScroll.prototype.update = function update () {
        this.scrollTo();
        return this;
    };
    RestoreScroll.prototype.openScrollStore = function openScrollStore () {
        var ref = this.opt;
        var rescroll = ref.rescroll;
        var name = ref.name;
        if (!rescroll[name]) {
            rescroll[name] = new ScrollPosition();
        }
        return this;
    };
    RestoreScroll.prototype.getPosition = function getPosition () {
        var this$1 = this;

        var ref = this.opt;
        var dom = ref.dom;
        var name = ref.name;
        var rescroll = ref.rescroll;
        this.watchScroll = function () {
            if (name === nowName) {
                var key = "timer-" + name;
                clearTimeout(this$1.timer[key]);
                this$1.timer[key] = setTimeout(function () {
                    var position = {
                        x: dom.scrollLeft,
                        y: dom.scrollTop
                    };
                    rescroll[name].$savePosition(position);
                    delete this$1.timer[key];
                }, 1000 / 60);
            }
        };
        dom.addEventListener('scroll', this.watchScroll, false);
        return this;
    };
    RestoreScroll.prototype.scrollTo = function scrollTo () {
        var ref = this.opt;
        var dom = ref.dom;
        var name = ref.name;
        var rescroll = ref.rescroll;
        var ref$1 = rescroll[name].position;
        var x = ref$1.x;
        var y = ref$1.y;
        if (!rescroll[name] || dom.scrollHeight < y || dom.scrollWidth < x) {
            dom.scrollLeft = 0;
            dom.scrollTop = 0;
            return this;
        }
        this.$nextTick(function () {
            dom.scrollLeft = x;
            dom.scrollTop = y;
        });
        return this;
    };
    RestoreScroll.prototype.destroy = function destroy () {
        var ref = this.opt;
        var dom = ref.dom;
        if (this.watchScroll) {
            dom.removeEventListener('scroll', this.watchScroll, false);
        }
        return this;
    };

    return RestoreScroll;
}(Vue));
var nowName = '';
var directive = {
    inserted: function (el, binding, vnode) {
        nowName = binding.value.name;
        if (!vnode.context)
            { return this; }
        if (!vnode.context.$root)
            { return this; }
        var root = vnode.context.$root;
        if (!root.$rescroll) {
            root.$rescroll = {};
        }
        var options = {
            dom: el,
            name: binding.value.name,
            rescroll: root.$rescroll
        };
        if (!el.restoreScroll) {
            el.restoreScroll = {};
        }
        if (!el.restoreScroll[nowName]) {
            el.restoreScroll[nowName] = new RestoreScroll(options);
            return this;
        }
        else {
            el.restoreScroll[nowName].update(options);
            return this;
        }
    },
    componentUpdated: function (el, binding, vnode) {
        nowName = binding.value.name;
        if (!vnode.context)
            { return this; }
        if (!vnode.context.$root)
            { return this; }
        var root = vnode.context.$root;
        if (!root.$rescroll) {
            root.$rescroll = {};
        }
        var options = {
            dom: el,
            name: binding.value.name,
            rescroll: root.$rescroll
        };
        if (!el.restoreScroll) {
            el.restoreScroll = {};
        }
        if (!el.restoreScroll[nowName]) {
            el.restoreScroll[nowName] = new RestoreScroll(options);
            return this;
        }
        else {
            el.restoreScroll[nowName].update(options);
            return this;
        }
    },
    unbind: function unbind(el) {
        if (!el.restoreScroll || !el.restoreScroll[nowName])
            { return; }
        el.restoreScroll[nowName].destroy();
        delete el.restoreScroll;
    }
};
var plugin = {
    install: function install(Vue$$1) {
        Vue$$1.directive('rescroll', directive);
    }
};
if (typeof window !== 'undefined' && !!window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;
