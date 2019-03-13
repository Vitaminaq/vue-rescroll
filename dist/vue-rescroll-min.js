!function(t,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o():"function"==typeof define&&define.amd?define(o):(t=t||self,t.VueRescroll=o())}(this,function(){"use strict";var t=function(){this.position={x:0,y:0}};t.prototype.$savePosition=function(t){return Object.assign(this.position,t)};var o=function(t){this.opt=t,this.timer={},this.openScrollStore(),this.getPosition(),this.scrollTo()};o.prototype.update=function(){return this.scrollTo(),this},o.prototype.openScrollStore=function(){var o=this.opt,e=o.rescroll,r=o.name;return e[r]||(e[r]=new t),this},o.prototype.getPosition=function(){var t=this,o=this.opt,r=o.dom,l=o.name,n=o.rescroll;return this.watchScroll=function(){if(l===e){var o="timer-"+l;clearTimeout(t.timer[o]),t.timer[o]=setTimeout(function(){var e={x:r.scrollLeft,y:r.scrollTop};n[l].$savePosition(e),delete t.timer[o]},1e3/60)}},r.addEventListener("scroll",this.watchScroll,!1),this},o.prototype.scrollTo=function(){var t=this.opt,o=t.dom,e=t.name,r=t.rescroll,l=t.vnode,n=r[e].position,i=n.x,s=n.y;return!r[e]||o.scrollHeight<s||o.scrollWidth<i?(o.scrollLeft=0,o.scrollTop=0,this):l.context?(l.context.$nextTick(function(){o.scrollLeft=i,o.scrollTop=s}),this):this},o.prototype.destroy=function(){var t=this.opt.dom;return this.watchScroll&&t.removeEventListener("scroll",this.watchScroll,!1),this};var e="",r={inserted:function(t,r,l){if(e=r.value.name,!l.context)return this;if(!l.context.$root)return this;var n=l.context.$root;n.$rescroll||(n.$rescroll={});var i={dom:t,name:r.value.name,rescroll:n.$rescroll,vnode:l};return t.restoreScroll||(t.restoreScroll={}),t.restoreScroll[e]?(t.restoreScroll[e].update(i),this):(t.restoreScroll[e]=new o(i),this)},componentUpdated:function(t,r,l){if(e=r.value.name,!l.context)return this;if(!l.context.$root)return this;var n=l.context.$root;n.$rescroll||(n.$rescroll={});var i={dom:t,name:r.value.name,rescroll:n.$rescroll,vnode:l};return t.restoreScroll||(t.restoreScroll={}),t.restoreScroll[e]?(t.restoreScroll[e].update(i),this):(t.restoreScroll[e]=new o(i),this)},unbind:function(t){t.restoreScroll&&t.restoreScroll[e]&&(t.restoreScroll[e].destroy(),delete t.restoreScroll)}},l={install:function(t){t.directive("rescroll",r)}};return"undefined"!=typeof window&&window.Vue&&window.Vue.use(l),l});