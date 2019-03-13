(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.VueRescroll = factory());
}(this, function () { 'use strict';

  var ScrollPosition = function ScrollPosition() {
      this.position = {
          x: 0,
          y: 0
      };
  };
  ScrollPosition.prototype.$savePosition = function $savePosition (position) {
      return Object.assign(this.position, position);
  };
  var RestoreScroll = function RestoreScroll(options) {
      this.opt = options;
      this.timer = {};
      this.openScrollStore();
      this.getPosition();
      this.scrollTo();
  };
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
          var vnode = ref.vnode;
      var ref$1 = rescroll[name].position;
          var x = ref$1.x;
          var y = ref$1.y;
      if (!rescroll[name] || dom.scrollHeight < y || dom.scrollWidth < x) {
          dom.scrollLeft = 0;
          dom.scrollTop = 0;
          return this;
      }
      if (!vnode.context)
          { return this; }
      vnode.context.$nextTick(function () {
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
              rescroll: root.$rescroll,
              vnode: vnode
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
              rescroll: root.$rescroll,
              vnode: vnode
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
      install: function install(Vue) {
          Vue.directive('rescroll', directive);
      }
  };
  if (typeof window !== 'undefined' && !!window.Vue) {
      window.Vue.use(plugin);
  }

  return plugin;

}));
