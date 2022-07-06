!(function (e, t) {
    "object" == typeof exports && "object" == typeof module
        ? (module.exports = t(require("vue")))
        : "function" == typeof define && define.amd
        ? define("JsonSchemaEditor", ["vue"], t)
        : "object" == typeof exports
        ? (exports.JsonSchemaEditor = t(require("vue")))
        : (e.JsonSchemaEditor = t(e.Vue));
})(window, function (e) {
    return (function (e) {
        function t(t) {
            for (var n, i, o = t[0], a = t[1], s = 0, c = []; s < o.length; s++) (i = o[s]), Object.prototype.hasOwnProperty.call(r, i) && r[i] && c.push(r[i][0]), (r[i] = 0);
            for (n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
            for (l && l(t); c.length; ) c.shift()();
        }
        var n = {},
            r = { 0: 0 };
        function i(t) {
            if (n[t]) return n[t].exports;
            var r = (n[t] = { i: t, l: !1, exports: {} });
            return e[t].call(r.exports, r, r.exports, i), (r.l = !0), r.exports;
        }
        (i.e = function () {
            return Promise.resolve();
        }),
            (i.m = e),
            (i.c = n),
            (i.d = function (e, t, n) {
                i.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
            }),
            (i.r = function (e) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
            }),
            (i.t = function (e, t) {
                if ((1 & t && (e = i(e)), 8 & t)) return e;
                if (4 & t && "object" == typeof e && e && e.__esModule) return e;
                var n = Object.create(null);
                if ((i.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e))
                    for (var r in e)
                        i.d(
                            n,
                            r,
                            function (t) {
                                return e[t];
                            }.bind(null, r)
                        );
                return n;
            }),
            (i.n = function (e) {
                var t =
                    e && e.__esModule
                        ? function () {
                              return e.default;
                          }
                        : function () {
                              return e;
                          };
                return i.d(t, "a", t), t;
            }),
            (i.o = function (e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (i.p = "../dist/"),
            (i.oe = function (e) {
                throw (console.error(e), e);
            });
        var o = (window.webpackJsonpJsonSchemaEditor = window.webpackJsonpJsonSchemaEditor || []),
            a = o.push.bind(o);
        (o.push = t), (o = o.slice());
        for (var s = 0; s < o.length; s++) t(o[s]);
        var l = a;
        return i((i.s = 60));
    })([
        function (e, t, n) {
            "use strict";
            (function (e) {
                n.d(t, "a", function () {
                    return r;
                }),
                    n.d(t, "b", function () {
                        return i;
                    }),
                    n.d(t, "d", function () {
                        return o;
                    }),
                    n.d(t, "e", function () {
                        return a;
                    }),
                    n.d(t, "f", function () {
                        return s;
                    }),
                    n.d(t, "h", function () {
                        return l;
                    }),
                    n.d(t, "c", function () {
                        return c;
                    }),
                    n.d(t, "j", function () {
                        return u;
                    }),
                    n.d(t, "i", function () {
                        return d;
                    }),
                    n.d(t, "g", function () {
                        return h;
                    });
                n(23);
                const r = ".",
                    i = ["string", "number", "array", "object", "boolean", "integer"],
                    o = { type: "object", title: "title", properties: {} },
                    a = { string: { type: "string" }, number: { type: "number" }, array: { type: "array", items: { type: "string" } }, object: { type: "object", properties: {} }, boolean: { type: "boolean" }, integer: { type: "integer" } },
                    s = function (e, t) {
                        let n = e;
                        for (let e = 0; e < t.length - 1; e++) n = n[t[e]];
                        delete n[t[t.length - 1]];
                    };
                function l(e, t) {
                    if ("object" === e.type) {
                        const n = (function (e) {
                            const t = [];
                            return (
                                Object.keys(e).map((e) => {
                                    t.push(e);
                                }),
                                t
                            );
                        })(e.properties);
                        t ? (e.required = [].concat(n)) : delete e.required,
                            (function (e, t) {
                                for (var n in e) ("array" !== e[n].type && "object" !== e[n].type) || l(e[n], t);
                            })(e.properties, t);
                    } else {
                        if ("array" !== e.type) return e;
                        l(e.items, t);
                    }
                }
                function c(e) {
                    if ("object" == typeof e) {
                        if (Array.isArray(e)) {
                            var t = [];
                            return (
                                e.forEach(function (e, n) {
                                    t[n] = c(e);
                                }),
                                t
                            );
                        }
                        var n = {};
                        for (var r in e) n[r] = c(e[r]);
                        return n;
                    }
                    return e;
                }
                const u = () => Math.random().toString(16).substr(2, 5),
                    d = (...t) => {
                        e && e.env, 0;
                    },
                    f = (e) => ![void 0, null, ""].includes(e),
                    h = (e) => {
                        const t = {};
                        return (
                            Object.keys(e).forEach((n) => {
                                f(e[n]) && (t[n] = e[n]);
                            }),
                            t
                        );
                    };
            }.call(this, n(142)));
        },
        function (e, t, n) {
            "use strict";
            function r(e, t, n, r, i, o, a, s) {
                var l,
                    c = "function" == typeof e ? e.options : e;
                if (
                    (t && ((c.render = t), (c.staticRenderFns = n), (c._compiled = !0)),
                    r && (c.functional = !0),
                    o && (c._scopeId = "data-v-" + o),
                    a
                        ? ((l = function (e) {
                              (e = e || (this.$vnode && this.$vnode.ssrContext) || (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)) || "undefined" == typeof __VUE_SSR_CONTEXT__ || (e = __VUE_SSR_CONTEXT__),
                                  i && i.call(this, e),
                                  e && e._registeredComponents && e._registeredComponents.add(a);
                          }),
                          (c._ssrRegister = l))
                        : i &&
                          (l = s
                              ? function () {
                                    i.call(this, (c.functional ? this.parent : this).$root.$options.shadowRoot);
                                }
                              : i),
                    l)
                )
                    if (c.functional) {
                        c._injectStyles = l;
                        var u = c.render;
                        c.render = function (e, t) {
                            return l.call(t), u(e, t);
                        };
                    } else {
                        var d = c.beforeCreate;
                        c.beforeCreate = d ? [].concat(d, l) : [l];
                    }
                return { exports: e, options: c };
            }
            n.d(t, "a", function () {
                return r;
            });
        },
        function (e, t, n) {
            "use strict";
            e.exports = function (e) {
                var t = [];
                return (
                    (t.toString = function () {
                        return this.map(function (t) {
                            var n = (function (e, t) {
                                var n = e[1] || "",
                                    r = e[3];
                                if (!r) return n;
                                if (t && "function" == typeof btoa) {
                                    var i = ((a = r), (s = btoa(unescape(encodeURIComponent(JSON.stringify(a))))), (l = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s)), "/*# ".concat(l, " */")),
                                        o = r.sources.map(function (e) {
                                            return "/*# sourceURL=".concat(r.sourceRoot || "").concat(e, " */");
                                        });
                                    return [n].concat(o).concat([i]).join("\n");
                                }
                                var a, s, l;
                                return [n].join("\n");
                            })(t, e);
                            return t[2] ? "@media ".concat(t[2], " {").concat(n, "}") : n;
                        }).join("");
                    }),
                    (t.i = function (e, n, r) {
                        "string" == typeof e && (e = [[null, e, ""]]);
                        var i = {};
                        if (r)
                            for (var o = 0; o < this.length; o++) {
                                var a = this[o][0];
                                null != a && (i[a] = !0);
                            }
                        for (var s = 0; s < e.length; s++) {
                            var l = [].concat(e[s]);
                            (r && i[l[0]]) || (n && (l[2] ? (l[2] = "".concat(n, " and ").concat(l[2])) : (l[2] = n)), t.push(l));
                        }
                    }),
                    t
                );
            };
        },
        function (e, t, n) {
            var r = n(98);
            e.exports = function (e) {
                return r(e, 5);
            };
        },
        function (e, t, n) {
            var r = n(43),
                i = "object" == typeof self && self && self.Object === Object && self,
                o = r || i || Function("return this")();
            e.exports = o;
        },
        function (e, t, n) {
            var r = n(61);
            e.exports = function (e, t, n) {
                return null == e ? e : r(e, t, n);
            };
        },
        function (e, t, n) {
            var r = n(48);
            e.exports = function (e, t, n) {
                var i = null == e ? void 0 : r(e, t);
                return void 0 === i ? n : i;
            };
        },
        function (e, t, n) {
            var r = n(63),
                i = n(69);
            e.exports = function (e, t) {
                var n = i(e, t);
                return r(n) ? n : void 0;
            };
        },
        function (e, t) {
            e.exports = function (e) {
                var t = typeof e;
                return null != e && ("object" == t || "function" == t);
            };
        },
        function (e, t) {
            var n = Array.isArray;
            e.exports = n;
        },
        function (e, t) {
            e.exports = function (e) {
                return null != e && "object" == typeof e;
            };
        },
        function (e, t, n) {
            "use strict";
            var r,
                i = function () {
                    return void 0 === r && (r = Boolean(window && document && document.all && !window.atob)), r;
                },
                o = (function () {
                    var e = {};
                    return function (t) {
                        if (void 0 === e[t]) {
                            var n = document.querySelector(t);
                            if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement)
                                try {
                                    n = n.contentDocument.head;
                                } catch (e) {
                                    n = null;
                                }
                            e[t] = n;
                        }
                        return e[t];
                    };
                })(),
                a = [];
            function s(e) {
                for (var t = -1, n = 0; n < a.length; n++)
                    if (a[n].identifier === e) {
                        t = n;
                        break;
                    }
                return t;
            }
            function l(e, t) {
                for (var n = {}, r = [], i = 0; i < e.length; i++) {
                    var o = e[i],
                        l = t.base ? o[0] + t.base : o[0],
                        c = n[l] || 0,
                        u = "".concat(l, " ").concat(c);
                    n[l] = c + 1;
                    var d = s(u),
                        f = { css: o[1], media: o[2], sourceMap: o[3] };
                    -1 !== d ? (a[d].references++, a[d].updater(f)) : a.push({ identifier: u, updater: g(f, t), references: 1 }), r.push(u);
                }
                return r;
            }
            function c(e) {
                var t = document.createElement("style"),
                    r = e.attributes || {};
                if (void 0 === r.nonce) {
                    var i = n.nc;
                    i && (r.nonce = i);
                }
                if (
                    (Object.keys(r).forEach(function (e) {
                        t.setAttribute(e, r[e]);
                    }),
                    "function" == typeof e.insert)
                )
                    e.insert(t);
                else {
                    var a = o(e.insert || "head");
                    if (!a) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                    a.appendChild(t);
                }
                return t;
            }
            var u,
                d =
                    ((u = []),
                    function (e, t) {
                        return (u[e] = t), u.filter(Boolean).join("\n");
                    });
            function f(e, t, n, r) {
                var i = n ? "" : r.media ? "@media ".concat(r.media, " {").concat(r.css, "}") : r.css;
                if (e.styleSheet) e.styleSheet.cssText = d(t, i);
                else {
                    var o = document.createTextNode(i),
                        a = e.childNodes;
                    a[t] && e.removeChild(a[t]), a.length ? e.insertBefore(o, a[t]) : e.appendChild(o);
                }
            }
            function h(e, t, n) {
                var r = n.css,
                    i = n.media,
                    o = n.sourceMap;
                if (
                    (i ? e.setAttribute("media", i) : e.removeAttribute("media"),
                    o && "undefined" != typeof btoa && (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o)))), " */")),
                    e.styleSheet)
                )
                    e.styleSheet.cssText = r;
                else {
                    for (; e.firstChild; ) e.removeChild(e.firstChild);
                    e.appendChild(document.createTextNode(r));
                }
            }
            var p = null,
                m = 0;
            function g(e, t) {
                var n, r, i;
                if (t.singleton) {
                    var o = m++;
                    (n = p || (p = c(t))), (r = f.bind(null, n, o, !1)), (i = f.bind(null, n, o, !0));
                } else
                    (n = c(t)),
                        (r = h.bind(null, n, t)),
                        (i = function () {
                            !(function (e) {
                                if (null === e.parentNode) return !1;
                                e.parentNode.removeChild(e);
                            })(n);
                        });
                return (
                    r(e),
                    function (t) {
                        if (t) {
                            if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap) return;
                            r((e = t));
                        } else i();
                    }
                );
            }
            e.exports = function (e, t) {
                (t = t || {}).singleton || "boolean" == typeof t.singleton || (t.singleton = i());
                var n = l((e = e || []), t);
                return function (e) {
                    if (((e = e || []), "[object Array]" === Object.prototype.toString.call(e))) {
                        for (var r = 0; r < n.length; r++) {
                            var i = s(n[r]);
                            a[i].references--;
                        }
                        for (var o = l(e, t), c = 0; c < n.length; c++) {
                            var u = s(n[c]);
                            0 === a[u].references && (a[u].updater(), a.splice(u, 1));
                        }
                        n = o;
                    }
                };
            };
        },
        function (e, t, n) {
            "use strict";
            var r = function () {
                var e = this,
                    t = e.$createElement,
                    n = e._self._c || t;
                return n(
                    "div",
                    [
                        n(
                            "el-autocomplete",
                            {
                                staticClass: "certain-category-search",
                                attrs: { "fetch-suggestions": e.querySearchAsync, placeholder: "mock", value: e.schema.mock ? e.schema.mock.mock : "", disabled: "object" === e.schema.type || "array" === e.schema.type },
                                on: { change: e.handleChange },
                                model: {
                                    value: e.mockValue,
                                    callback: function (t) {
                                        e.mockValue = t;
                                    },
                                    expression: "mockValue",
                                },
                            },
                            [n("el-button", { attrs: { slot: "append", icon: "el-icon-edit" }, on: { click: e.showEdit }, slot: "append" })],
                            1
                        ),
                    ],
                    1
                );
            };
            r._withStripped = !0;
            var i = {
                    name: "MockSelect",
                    props: { schema: { type: Object, default: () => {} }, mock: { type: Array, default: () => [] } },
                    data: () => ({ mockValue: "" }),
                    created() {},
                    mounted() {},
                    methods: {
                        showEdit() {
                            this.$emit("showEdit");
                        },
                        handleChange(e) {
                            this.$emit("change", e);
                        },
                        querySearchAsync(e, t) {
                            const n = this.mock || [];
                            t(e ? n.filter(this.createStateFilter(e)) : n);
                        },
                        createStateFilter: (e) => (t) => 0 === t.value.toLowerCase().indexOf(e.toLowerCase()),
                    },
                },
                o = n(1),
                a = Object(o.a)(i, r, [], !1, null, "2628a422", null);
            a.options.__file = "src/MockSelect/index.vue";
            t.a = a.exports;
        },
        function (e, t, n) {
            "use strict";
            var r = function () {
                var e = this,
                    t = e.$createElement,
                    n = e._self._c || t;
                return n(
                    "div",
                    { staticClass: "object-style" },
                    e._l(e.propertyKeys, function (t, r) {
                        return n("schema-item", { key: r, attrs: { data: e.data, name: t, prefix: e.prefix, "is-mock": e.isMock, "show-title": e.showTitle, "show-default-value": e.showDefaultValue, "editor-id": e.editorId } });
                    }),
                    1
                );
            };
            r._withStripped = !0;
            var i = {
                    name: "SchemaObject",
                    components: { "schema-item": () => Promise.resolve().then(n.bind(null, 162)) },
                    props: {
                        prefix: { type: Array, default: () => [] },
                        data: { type: Object, default: () => {} },
                        isMock: { type: Boolean, default: !1 },
                        showTitle: { type: Boolean, default: !1 },
                        showDefaultValue: { type: Boolean, default: !1 },
                        editorId: { type: String, default: "editor_id" },
                    },
                    data() {
                        return { tagPaddingLeftStyle: {}, items: this.data.items };
                    },
                    computed: {
                        propertyKeys() {
                            return Object.keys(this.data.properties);
                        },
                    },
                    methods: {},
                },
                o = n(1),
                a = Object(o.a)(i, r, [], !1, null, null, null);
            a.options.__file = "src/Schema/SchemaObject.vue";
            t.a = a.exports;
        },
        function (e, t, n) {
            var r = n(16),
                i = n(65),
                o = n(66),
                a = r ? r.toStringTag : void 0;
            e.exports = function (e) {
                return null == e ? (void 0 === e ? "[object Undefined]" : "[object Null]") : a && a in Object(e) ? i(e) : o(e);
            };
        },
        function (e, t, n) {
            e.exports = (function () {
                "use strict";
                var e = navigator.userAgent,
                    t = navigator.platform,
                    n = /gecko\/\d/i.test(e),
                    r = /MSIE \d/.test(e),
                    i = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(e),
                    o = /Edge\/(\d+)/.exec(e),
                    a = r || i || o,
                    s = a && (r ? document.documentMode || 6 : +(o || i)[1]),
                    l = !o && /WebKit\//.test(e),
                    c = l && /Qt\/\d+\.\d+/.test(e),
                    u = !o && /Chrome\//.test(e),
                    d = /Opera\//.test(e),
                    f = /Apple Computer/.test(navigator.vendor),
                    h = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(e),
                    p = /PhantomJS/.test(e),
                    m = f && (/Mobile\/\w+/.test(e) || navigator.maxTouchPoints > 2),
                    g = /Android/.test(e),
                    v = m || g || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(e),
                    y = m || /Mac/.test(t),
                    b = /\bCrOS\b/.test(e),
                    x = /win/i.test(t),
                    w = d && e.match(/Version\/(\d*\.\d*)/);
                w && (w = Number(w[1])), w && w >= 15 && ((d = !1), (l = !0));
                var k = y && (c || (d && (null == w || w < 12.11))),
                    C = n || (a && s >= 9);
                function S(e) {
                    return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*");
                }
                var A,
                    M = function (e, t) {
                        var n = e.className,
                            r = S(t).exec(n);
                        if (r) {
                            var i = n.slice(r.index + r[0].length);
                            e.className = n.slice(0, r.index) + (i ? r[1] + i : "");
                        }
                    };
                function T(e) {
                    for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild);
                    return e;
                }
                function D(e, t) {
                    return T(e).appendChild(t);
                }
                function L(e, t, n, r) {
                    var i = document.createElement(e);
                    if ((n && (i.className = n), r && (i.style.cssText = r), "string" == typeof t)) i.appendChild(document.createTextNode(t));
                    else if (t) for (var o = 0; o < t.length; ++o) i.appendChild(t[o]);
                    return i;
                }
                function O(e, t, n, r) {
                    var i = L(e, t, n, r);
                    return i.setAttribute("role", "presentation"), i;
                }
                function j(e, t) {
                    if ((3 == t.nodeType && (t = t.parentNode), e.contains)) return e.contains(t);
                    do {
                        if ((11 == t.nodeType && (t = t.host), t == e)) return !0;
                    } while ((t = t.parentNode));
                }
                function E() {
                    var e;
                    try {
                        e = document.activeElement;
                    } catch (t) {
                        e = document.body || null;
                    }
                    for (; e && e.shadowRoot && e.shadowRoot.activeElement; ) e = e.shadowRoot.activeElement;
                    return e;
                }
                function _(e, t) {
                    var n = e.className;
                    S(t).test(n) || (e.className += (n ? " " : "") + t);
                }
                function N(e, t) {
                    for (var n = e.split(" "), r = 0; r < n.length; r++) n[r] && !S(n[r]).test(t) && (t += " " + n[r]);
                    return t;
                }
                A = document.createRange
                    ? function (e, t, n, r) {
                          var i = document.createRange();
                          return i.setEnd(r || e, n), i.setStart(e, t), i;
                      }
                    : function (e, t, n) {
                          var r = document.body.createTextRange();
                          try {
                              r.moveToElementText(e.parentNode);
                          } catch (e) {
                              return r;
                          }
                          return r.collapse(!0), r.moveEnd("character", n), r.moveStart("character", t), r;
                      };
                var I = function (e) {
                    e.select();
                };
                function F(e) {
                    var t = Array.prototype.slice.call(arguments, 1);
                    return function () {
                        return e.apply(null, t);
                    };
                }
                function R(e, t, n) {
                    for (var r in (t || (t = {}), e)) !e.hasOwnProperty(r) || (!1 === n && t.hasOwnProperty(r)) || (t[r] = e[r]);
                    return t;
                }
                function z(e, t, n, r, i) {
                    null == t && -1 == (t = e.search(/[^\s\u00a0]/)) && (t = e.length);
                    for (var o = r || 0, a = i || 0; ; ) {
                        var s = e.indexOf("\t", o);
                        if (s < 0 || s >= t) return a + (t - o);
                        (a += s - o), (a += n - (a % n)), (o = s + 1);
                    }
                }
                m
                    ? (I = function (e) {
                          (e.selectionStart = 0), (e.selectionEnd = e.value.length);
                      })
                    : a &&
                      (I = function (e) {
                          try {
                              e.select();
                          } catch (e) {}
                      });
                var W = function () {
                    (this.id = null), (this.f = null), (this.time = 0), (this.handler = F(this.onTimeout, this));
                };
                function $(e, t) {
                    for (var n = 0; n < e.length; ++n) if (e[n] == t) return n;
                    return -1;
                }
                (W.prototype.onTimeout = function (e) {
                    (e.id = 0), e.time <= +new Date() ? e.f() : setTimeout(e.handler, e.time - +new Date());
                }),
                    (W.prototype.set = function (e, t) {
                        this.f = t;
                        var n = +new Date() + e;
                        (!this.id || n < this.time) && (clearTimeout(this.id), (this.id = setTimeout(this.handler, e)), (this.time = n));
                    });
                var P = {
                        toString: function () {
                            return "CodeMirror.Pass";
                        },
                    },
                    H = { scroll: !1 },
                    B = { origin: "*mouse" },
                    V = { origin: "+move" };
                function U(e, t, n) {
                    for (var r = 0, i = 0; ; ) {
                        var o = e.indexOf("\t", r);
                        -1 == o && (o = e.length);
                        var a = o - r;
                        if (o == e.length || i + a >= t) return r + Math.min(a, t - i);
                        if (((i += o - r), (r = o + 1), (i += n - (i % n)) >= t)) return r;
                    }
                }
                var G = [""];
                function q(e) {
                    for (; G.length <= e; ) G.push(K(G) + " ");
                    return G[e];
                }
                function K(e) {
                    return e[e.length - 1];
                }
                function Y(e, t) {
                    for (var n = [], r = 0; r < e.length; r++) n[r] = t(e[r], r);
                    return n;
                }
                function X() {}
                function J(e, t) {
                    var n;
                    return Object.create ? (n = Object.create(e)) : ((X.prototype = e), (n = new X())), t && R(t, n), n;
                }
                var Q = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
                function Z(e) {
                    return /\w/.test(e) || (e > "" && (e.toUpperCase() != e.toLowerCase() || Q.test(e)));
                }
                function ee(e, t) {
                    return t ? !!(t.source.indexOf("\\w") > -1 && Z(e)) || t.test(e) : Z(e);
                }
                function te(e) {
                    for (var t in e) if (e.hasOwnProperty(t) && e[t]) return !1;
                    return !0;
                }
                var ne = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
                function re(e) {
                    return e.charCodeAt(0) >= 768 && ne.test(e);
                }
                function ie(e, t, n) {
                    for (; (n < 0 ? t > 0 : t < e.length) && re(e.charAt(t)); ) t += n;
                    return t;
                }
                function oe(e, t, n) {
                    for (var r = t > n ? -1 : 1; ; ) {
                        if (t == n) return t;
                        var i = (t + n) / 2,
                            o = r < 0 ? Math.ceil(i) : Math.floor(i);
                        if (o == t) return e(o) ? t : n;
                        e(o) ? (n = o) : (t = o + r);
                    }
                }
                var ae = null;
                function se(e, t, n) {
                    var r;
                    ae = null;
                    for (var i = 0; i < e.length; ++i) {
                        var o = e[i];
                        if (o.from < t && o.to > t) return i;
                        o.to == t && (o.from != o.to && "before" == n ? (r = i) : (ae = i)), o.from == t && (o.from != o.to && "before" != n ? (r = i) : (ae = i));
                    }
                    return null != r ? r : ae;
                }
                var le = (function () {
                    var e = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
                        t = /[stwN]/,
                        n = /[LRr]/,
                        r = /[Lb1n]/,
                        i = /[1n]/;
                    function o(e, t, n) {
                        (this.level = e), (this.from = t), (this.to = n);
                    }
                    return function (a, s) {
                        var l = "ltr" == s ? "L" : "R";
                        if (0 == a.length || ("ltr" == s && !e.test(a))) return !1;
                        for (var c, u = a.length, d = [], f = 0; f < u; ++f)
                            d.push(
                                (c = a.charCodeAt(f)) <= 247
                                    ? "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(
                                          c
                                      )
                                    : 1424 <= c && c <= 1524
                                    ? "R"
                                    : 1536 <= c && c <= 1785
                                    ? "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111".charAt(
                                          c - 1536
                                      )
                                    : 1774 <= c && c <= 2220
                                    ? "r"
                                    : 8192 <= c && c <= 8203
                                    ? "w"
                                    : 8204 == c
                                    ? "b"
                                    : "L"
                            );
                        for (var h = 0, p = l; h < u; ++h) {
                            var m = d[h];
                            "m" == m ? (d[h] = p) : (p = m);
                        }
                        for (var g = 0, v = l; g < u; ++g) {
                            var y = d[g];
                            "1" == y && "r" == v ? (d[g] = "n") : n.test(y) && ((v = y), "r" == y && (d[g] = "R"));
                        }
                        for (var b = 1, x = d[0]; b < u - 1; ++b) {
                            var w = d[b];
                            "+" == w && "1" == x && "1" == d[b + 1] ? (d[b] = "1") : "," != w || x != d[b + 1] || ("1" != x && "n" != x) || (d[b] = x), (x = w);
                        }
                        for (var k = 0; k < u; ++k) {
                            var C = d[k];
                            if ("," == C) d[k] = "N";
                            else if ("%" == C) {
                                var S = void 0;
                                for (S = k + 1; S < u && "%" == d[S]; ++S);
                                for (var A = (k && "!" == d[k - 1]) || (S < u && "1" == d[S]) ? "1" : "N", M = k; M < S; ++M) d[M] = A;
                                k = S - 1;
                            }
                        }
                        for (var T = 0, D = l; T < u; ++T) {
                            var L = d[T];
                            "L" == D && "1" == L ? (d[T] = "L") : n.test(L) && (D = L);
                        }
                        for (var O = 0; O < u; ++O)
                            if (t.test(d[O])) {
                                var j = void 0;
                                for (j = O + 1; j < u && t.test(d[j]); ++j);
                                for (var E = "L" == (O ? d[O - 1] : l), _ = E == ("L" == (j < u ? d[j] : l)) ? (E ? "L" : "R") : l, N = O; N < j; ++N) d[N] = _;
                                O = j - 1;
                            }
                        for (var I, F = [], R = 0; R < u; )
                            if (r.test(d[R])) {
                                var z = R;
                                for (++R; R < u && r.test(d[R]); ++R);
                                F.push(new o(0, z, R));
                            } else {
                                var W = R,
                                    $ = F.length,
                                    P = "rtl" == s ? 1 : 0;
                                for (++R; R < u && "L" != d[R]; ++R);
                                for (var H = W; H < R; )
                                    if (i.test(d[H])) {
                                        W < H && (F.splice($, 0, new o(1, W, H)), ($ += P));
                                        var B = H;
                                        for (++H; H < R && i.test(d[H]); ++H);
                                        F.splice($, 0, new o(2, B, H)), ($ += P), (W = H);
                                    } else ++H;
                                W < R && F.splice($, 0, new o(1, W, R));
                            }
                        return (
                            "ltr" == s &&
                                (1 == F[0].level && (I = a.match(/^\s+/)) && ((F[0].from = I[0].length), F.unshift(new o(0, 0, I[0].length))),
                                1 == K(F).level && (I = a.match(/\s+$/)) && ((K(F).to -= I[0].length), F.push(new o(0, u - I[0].length, u)))),
                            "rtl" == s ? F.reverse() : F
                        );
                    };
                })();
                function ce(e, t) {
                    var n = e.order;
                    return null == n && (n = e.order = le(e.text, t)), n;
                }
                var ue = [],
                    de = function (e, t, n) {
                        if (e.addEventListener) e.addEventListener(t, n, !1);
                        else if (e.attachEvent) e.attachEvent("on" + t, n);
                        else {
                            var r = e._handlers || (e._handlers = {});
                            r[t] = (r[t] || ue).concat(n);
                        }
                    };
                function fe(e, t) {
                    return (e._handlers && e._handlers[t]) || ue;
                }
                function he(e, t, n) {
                    if (e.removeEventListener) e.removeEventListener(t, n, !1);
                    else if (e.detachEvent) e.detachEvent("on" + t, n);
                    else {
                        var r = e._handlers,
                            i = r && r[t];
                        if (i) {
                            var o = $(i, n);
                            o > -1 && (r[t] = i.slice(0, o).concat(i.slice(o + 1)));
                        }
                    }
                }
                function pe(e, t) {
                    var n = fe(e, t);
                    if (n.length) for (var r = Array.prototype.slice.call(arguments, 2), i = 0; i < n.length; ++i) n[i].apply(null, r);
                }
                function me(e, t, n) {
                    return (
                        "string" == typeof t &&
                            (t = {
                                type: t,
                                preventDefault: function () {
                                    this.defaultPrevented = !0;
                                },
                            }),
                        pe(e, n || t.type, e, t),
                        we(t) || t.codemirrorIgnore
                    );
                }
                function ge(e) {
                    var t = e._handlers && e._handlers.cursorActivity;
                    if (t) for (var n = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []), r = 0; r < t.length; ++r) -1 == $(n, t[r]) && n.push(t[r]);
                }
                function ve(e, t) {
                    return fe(e, t).length > 0;
                }
                function ye(e) {
                    (e.prototype.on = function (e, t) {
                        de(this, e, t);
                    }),
                        (e.prototype.off = function (e, t) {
                            he(this, e, t);
                        });
                }
                function be(e) {
                    e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
                }
                function xe(e) {
                    e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = !0);
                }
                function we(e) {
                    return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue;
                }
                function ke(e) {
                    be(e), xe(e);
                }
                function Ce(e) {
                    return e.target || e.srcElement;
                }
                function Se(e) {
                    var t = e.which;
                    return null == t && (1 & e.button ? (t = 1) : 2 & e.button ? (t = 3) : 4 & e.button && (t = 2)), y && e.ctrlKey && 1 == t && (t = 3), t;
                }
                var Ae,
                    Me,
                    Te = (function () {
                        if (a && s < 9) return !1;
                        var e = L("div");
                        return "draggable" in e || "dragDrop" in e;
                    })();
                function De(e) {
                    if (null == Ae) {
                        var t = L("span", "​");
                        D(e, L("span", [t, document.createTextNode("x")])), 0 != e.firstChild.offsetHeight && (Ae = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(a && s < 8));
                    }
                    var n = Ae ? L("span", "​") : L("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px");
                    return n.setAttribute("cm-text", ""), n;
                }
                function Le(e) {
                    if (null != Me) return Me;
                    var t = D(e, document.createTextNode("AخA")),
                        n = A(t, 0, 1).getBoundingClientRect(),
                        r = A(t, 1, 2).getBoundingClientRect();
                    return T(e), !(!n || n.left == n.right) && (Me = r.right - n.right < 3);
                }
                var Oe,
                    je =
                        3 != "\n\nb".split(/\n/).length
                            ? function (e) {
                                  for (var t = 0, n = [], r = e.length; t <= r; ) {
                                      var i = e.indexOf("\n", t);
                                      -1 == i && (i = e.length);
                                      var o = e.slice(t, "\r" == e.charAt(i - 1) ? i - 1 : i),
                                          a = o.indexOf("\r");
                                      -1 != a ? (n.push(o.slice(0, a)), (t += a + 1)) : (n.push(o), (t = i + 1));
                                  }
                                  return n;
                              }
                            : function (e) {
                                  return e.split(/\r\n?|\n/);
                              },
                    Ee = window.getSelection
                        ? function (e) {
                              try {
                                  return e.selectionStart != e.selectionEnd;
                              } catch (e) {
                                  return !1;
                              }
                          }
                        : function (e) {
                              var t;
                              try {
                                  t = e.ownerDocument.selection.createRange();
                              } catch (e) {}
                              return !(!t || t.parentElement() != e) && 0 != t.compareEndPoints("StartToEnd", t);
                          },
                    _e = "oncopy" in (Oe = L("div")) || (Oe.setAttribute("oncopy", "return;"), "function" == typeof Oe.oncopy),
                    Ne = null,
                    Ie = {},
                    Fe = {};
                function Re(e, t) {
                    arguments.length > 2 && (t.dependencies = Array.prototype.slice.call(arguments, 2)), (Ie[e] = t);
                }
                function ze(e) {
                    if ("string" == typeof e && Fe.hasOwnProperty(e)) e = Fe[e];
                    else if (e && "string" == typeof e.name && Fe.hasOwnProperty(e.name)) {
                        var t = Fe[e.name];
                        "string" == typeof t && (t = { name: t }), ((e = J(t, e)).name = t.name);
                    } else {
                        if ("string" == typeof e && /^[\w\-]+\/[\w\-]+\+xml$/.test(e)) return ze("application/xml");
                        if ("string" == typeof e && /^[\w\-]+\/[\w\-]+\+json$/.test(e)) return ze("application/json");
                    }
                    return "string" == typeof e ? { name: e } : e || { name: "null" };
                }
                function We(e, t) {
                    t = ze(t);
                    var n = Ie[t.name];
                    if (!n) return We(e, "text/plain");
                    var r = n(e, t);
                    if ($e.hasOwnProperty(t.name)) {
                        var i = $e[t.name];
                        for (var o in i) i.hasOwnProperty(o) && (r.hasOwnProperty(o) && (r["_" + o] = r[o]), (r[o] = i[o]));
                    }
                    if (((r.name = t.name), t.helperType && (r.helperType = t.helperType), t.modeProps)) for (var a in t.modeProps) r[a] = t.modeProps[a];
                    return r;
                }
                var $e = {};
                function Pe(e, t) {
                    R(t, $e.hasOwnProperty(e) ? $e[e] : ($e[e] = {}));
                }
                function He(e, t) {
                    if (!0 === t) return t;
                    if (e.copyState) return e.copyState(t);
                    var n = {};
                    for (var r in t) {
                        var i = t[r];
                        i instanceof Array && (i = i.concat([])), (n[r] = i);
                    }
                    return n;
                }
                function Be(e, t) {
                    for (var n; e.innerMode && (n = e.innerMode(t)) && n.mode != e; ) (t = n.state), (e = n.mode);
                    return n || { mode: e, state: t };
                }
                function Ve(e, t, n) {
                    return !e.startState || e.startState(t, n);
                }
                var Ue = function (e, t, n) {
                    (this.pos = this.start = 0), (this.string = e), (this.tabSize = t || 8), (this.lastColumnPos = this.lastColumnValue = 0), (this.lineStart = 0), (this.lineOracle = n);
                };
                function Ge(e, t) {
                    if ((t -= e.first) < 0 || t >= e.size) throw new Error("There is no line " + (t + e.first) + " in the document.");
                    for (var n = e; !n.lines; )
                        for (var r = 0; ; ++r) {
                            var i = n.children[r],
                                o = i.chunkSize();
                            if (t < o) {
                                n = i;
                                break;
                            }
                            t -= o;
                        }
                    return n.lines[t];
                }
                function qe(e, t, n) {
                    var r = [],
                        i = t.line;
                    return (
                        e.iter(t.line, n.line + 1, function (e) {
                            var o = e.text;
                            i == n.line && (o = o.slice(0, n.ch)), i == t.line && (o = o.slice(t.ch)), r.push(o), ++i;
                        }),
                        r
                    );
                }
                function Ke(e, t, n) {
                    var r = [];
                    return (
                        e.iter(t, n, function (e) {
                            r.push(e.text);
                        }),
                        r
                    );
                }
                function Ye(e, t) {
                    var n = t - e.height;
                    if (n) for (var r = e; r; r = r.parent) r.height += n;
                }
                function Xe(e) {
                    if (null == e.parent) return null;
                    for (var t = e.parent, n = $(t.lines, e), r = t.parent; r; t = r, r = r.parent) for (var i = 0; r.children[i] != t; ++i) n += r.children[i].chunkSize();
                    return n + t.first;
                }
                function Je(e, t) {
                    var n = e.first;
                    e: do {
                        for (var r = 0; r < e.children.length; ++r) {
                            var i = e.children[r],
                                o = i.height;
                            if (t < o) {
                                e = i;
                                continue e;
                            }
                            (t -= o), (n += i.chunkSize());
                        }
                        return n;
                    } while (!e.lines);
                    for (var a = 0; a < e.lines.length; ++a) {
                        var s = e.lines[a].height;
                        if (t < s) break;
                        t -= s;
                    }
                    return n + a;
                }
                function Qe(e, t) {
                    return t >= e.first && t < e.first + e.size;
                }
                function Ze(e, t) {
                    return String(e.lineNumberFormatter(t + e.firstLineNumber));
                }
                function et(e, t, n) {
                    if ((void 0 === n && (n = null), !(this instanceof et))) return new et(e, t, n);
                    (this.line = e), (this.ch = t), (this.sticky = n);
                }
                function tt(e, t) {
                    return e.line - t.line || e.ch - t.ch;
                }
                function nt(e, t) {
                    return e.sticky == t.sticky && 0 == tt(e, t);
                }
                function rt(e) {
                    return et(e.line, e.ch);
                }
                function it(e, t) {
                    return tt(e, t) < 0 ? t : e;
                }
                function ot(e, t) {
                    return tt(e, t) < 0 ? e : t;
                }
                function at(e, t) {
                    return Math.max(e.first, Math.min(t, e.first + e.size - 1));
                }
                function st(e, t) {
                    if (t.line < e.first) return et(e.first, 0);
                    var n = e.first + e.size - 1;
                    return t.line > n
                        ? et(n, Ge(e, n).text.length)
                        : (function (e, t) {
                              var n = e.ch;
                              return null == n || n > t ? et(e.line, t) : n < 0 ? et(e.line, 0) : e;
                          })(t, Ge(e, t.line).text.length);
                }
                function lt(e, t) {
                    for (var n = [], r = 0; r < t.length; r++) n[r] = st(e, t[r]);
                    return n;
                }
                (Ue.prototype.eol = function () {
                    return this.pos >= this.string.length;
                }),
                    (Ue.prototype.sol = function () {
                        return this.pos == this.lineStart;
                    }),
                    (Ue.prototype.peek = function () {
                        return this.string.charAt(this.pos) || void 0;
                    }),
                    (Ue.prototype.next = function () {
                        if (this.pos < this.string.length) return this.string.charAt(this.pos++);
                    }),
                    (Ue.prototype.eat = function (e) {
                        var t = this.string.charAt(this.pos);
                        if ("string" == typeof e ? t == e : t && (e.test ? e.test(t) : e(t))) return ++this.pos, t;
                    }),
                    (Ue.prototype.eatWhile = function (e) {
                        for (var t = this.pos; this.eat(e); );
                        return this.pos > t;
                    }),
                    (Ue.prototype.eatSpace = function () {
                        for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos)); ) ++this.pos;
                        return this.pos > e;
                    }),
                    (Ue.prototype.skipToEnd = function () {
                        this.pos = this.string.length;
                    }),
                    (Ue.prototype.skipTo = function (e) {
                        var t = this.string.indexOf(e, this.pos);
                        if (t > -1) return (this.pos = t), !0;
                    }),
                    (Ue.prototype.backUp = function (e) {
                        this.pos -= e;
                    }),
                    (Ue.prototype.column = function () {
                        return (
                            this.lastColumnPos < this.start && ((this.lastColumnValue = z(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue)), (this.lastColumnPos = this.start)),
                            this.lastColumnValue - (this.lineStart ? z(this.string, this.lineStart, this.tabSize) : 0)
                        );
                    }),
                    (Ue.prototype.indentation = function () {
                        return z(this.string, null, this.tabSize) - (this.lineStart ? z(this.string, this.lineStart, this.tabSize) : 0);
                    }),
                    (Ue.prototype.match = function (e, t, n) {
                        if ("string" != typeof e) {
                            var r = this.string.slice(this.pos).match(e);
                            return r && r.index > 0 ? null : (r && !1 !== t && (this.pos += r[0].length), r);
                        }
                        var i = function (e) {
                            return n ? e.toLowerCase() : e;
                        };
                        if (i(this.string.substr(this.pos, e.length)) == i(e)) return !1 !== t && (this.pos += e.length), !0;
                    }),
                    (Ue.prototype.current = function () {
                        return this.string.slice(this.start, this.pos);
                    }),
                    (Ue.prototype.hideFirstChars = function (e, t) {
                        this.lineStart += e;
                        try {
                            return t();
                        } finally {
                            this.lineStart -= e;
                        }
                    }),
                    (Ue.prototype.lookAhead = function (e) {
                        var t = this.lineOracle;
                        return t && t.lookAhead(e);
                    }),
                    (Ue.prototype.baseToken = function () {
                        var e = this.lineOracle;
                        return e && e.baseToken(this.pos);
                    });
                var ct = function (e, t) {
                        (this.state = e), (this.lookAhead = t);
                    },
                    ut = function (e, t, n, r) {
                        (this.state = t), (this.doc = e), (this.line = n), (this.maxLookAhead = r || 0), (this.baseTokens = null), (this.baseTokenPos = 1);
                    };
                function dt(e, t, n, r) {
                    var i = [e.state.modeGen],
                        o = {};
                    xt(
                        e,
                        t.text,
                        e.doc.mode,
                        n,
                        function (e, t) {
                            return i.push(e, t);
                        },
                        o,
                        r
                    );
                    for (
                        var a = n.state,
                            s = function (r) {
                                n.baseTokens = i;
                                var s = e.state.overlays[r],
                                    l = 1,
                                    c = 0;
                                (n.state = !0),
                                    xt(
                                        e,
                                        t.text,
                                        s.mode,
                                        n,
                                        function (e, t) {
                                            for (var n = l; c < e; ) {
                                                var r = i[l];
                                                r > e && i.splice(l, 1, e, i[l + 1], r), (l += 2), (c = Math.min(e, r));
                                            }
                                            if (t)
                                                if (s.opaque) i.splice(n, l - n, e, "overlay " + t), (l = n + 2);
                                                else
                                                    for (; n < l; n += 2) {
                                                        var o = i[n + 1];
                                                        i[n + 1] = (o ? o + " " : "") + "overlay " + t;
                                                    }
                                        },
                                        o
                                    ),
                                    (n.state = a),
                                    (n.baseTokens = null),
                                    (n.baseTokenPos = 1);
                            },
                            l = 0;
                        l < e.state.overlays.length;
                        ++l
                    )
                        s(l);
                    return { styles: i, classes: o.bgClass || o.textClass ? o : null };
                }
                function ft(e, t, n) {
                    if (!t.styles || t.styles[0] != e.state.modeGen) {
                        var r = ht(e, Xe(t)),
                            i = t.text.length > e.options.maxHighlightLength && He(e.doc.mode, r.state),
                            o = dt(e, t, r);
                        i && (r.state = i),
                            (t.stateAfter = r.save(!i)),
                            (t.styles = o.styles),
                            o.classes ? (t.styleClasses = o.classes) : t.styleClasses && (t.styleClasses = null),
                            n === e.doc.highlightFrontier && (e.doc.modeFrontier = Math.max(e.doc.modeFrontier, ++e.doc.highlightFrontier));
                    }
                    return t.styles;
                }
                function ht(e, t, n) {
                    var r = e.doc,
                        i = e.display;
                    if (!r.mode.startState) return new ut(r, !0, t);
                    var o = (function (e, t, n) {
                            for (var r, i, o = e.doc, a = n ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), s = t; s > a; --s) {
                                if (s <= o.first) return o.first;
                                var l = Ge(o, s - 1),
                                    c = l.stateAfter;
                                if (c && (!n || s + (c instanceof ct ? c.lookAhead : 0) <= o.modeFrontier)) return s;
                                var u = z(l.text, null, e.options.tabSize);
                                (null == i || r > u) && ((i = s - 1), (r = u));
                            }
                            return i;
                        })(e, t, n),
                        a = o > r.first && Ge(r, o - 1).stateAfter,
                        s = a ? ut.fromSaved(r, a, o) : new ut(r, Ve(r.mode), o);
                    return (
                        r.iter(o, t, function (n) {
                            pt(e, n.text, s);
                            var r = s.line;
                            (n.stateAfter = r == t - 1 || r % 5 == 0 || (r >= i.viewFrom && r < i.viewTo) ? s.save() : null), s.nextLine();
                        }),
                        n && (r.modeFrontier = s.line),
                        s
                    );
                }
                function pt(e, t, n, r) {
                    var i = e.doc.mode,
                        o = new Ue(t, e.options.tabSize, n);
                    for (o.start = o.pos = r || 0, "" == t && mt(i, n.state); !o.eol(); ) gt(i, o, n.state), (o.start = o.pos);
                }
                function mt(e, t) {
                    if (e.blankLine) return e.blankLine(t);
                    if (e.innerMode) {
                        var n = Be(e, t);
                        return n.mode.blankLine ? n.mode.blankLine(n.state) : void 0;
                    }
                }
                function gt(e, t, n, r) {
                    for (var i = 0; i < 10; i++) {
                        r && (r[0] = Be(e, n).mode);
                        var o = e.token(t, n);
                        if (t.pos > t.start) return o;
                    }
                    throw new Error("Mode " + e.name + " failed to advance stream.");
                }
                (ut.prototype.lookAhead = function (e) {
                    var t = this.doc.getLine(this.line + e);
                    return null != t && e > this.maxLookAhead && (this.maxLookAhead = e), t;
                }),
                    (ut.prototype.baseToken = function (e) {
                        if (!this.baseTokens) return null;
                        for (; this.baseTokens[this.baseTokenPos] <= e; ) this.baseTokenPos += 2;
                        var t = this.baseTokens[this.baseTokenPos + 1];
                        return { type: t && t.replace(/( |^)overlay .*/, ""), size: this.baseTokens[this.baseTokenPos] - e };
                    }),
                    (ut.prototype.nextLine = function () {
                        this.line++, this.maxLookAhead > 0 && this.maxLookAhead--;
                    }),
                    (ut.fromSaved = function (e, t, n) {
                        return t instanceof ct ? new ut(e, He(e.mode, t.state), n, t.lookAhead) : new ut(e, He(e.mode, t), n);
                    }),
                    (ut.prototype.save = function (e) {
                        var t = !1 !== e ? He(this.doc.mode, this.state) : this.state;
                        return this.maxLookAhead > 0 ? new ct(t, this.maxLookAhead) : t;
                    });
                var vt = function (e, t, n) {
                    (this.start = e.start), (this.end = e.pos), (this.string = e.current()), (this.type = t || null), (this.state = n);
                };
                function yt(e, t, n, r) {
                    var i,
                        o,
                        a = e.doc,
                        s = a.mode,
                        l = Ge(a, (t = st(a, t)).line),
                        c = ht(e, t.line, n),
                        u = new Ue(l.text, e.options.tabSize, c);
                    for (r && (o = []); (r || u.pos < t.ch) && !u.eol(); ) (u.start = u.pos), (i = gt(s, u, c.state)), r && o.push(new vt(u, i, He(a.mode, c.state)));
                    return r ? o : new vt(u, i, c.state);
                }
                function bt(e, t) {
                    if (e)
                        for (;;) {
                            var n = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
                            if (!n) break;
                            e = e.slice(0, n.index) + e.slice(n.index + n[0].length);
                            var r = n[1] ? "bgClass" : "textClass";
                            null == t[r] ? (t[r] = n[2]) : new RegExp("(?:^|\\s)" + n[2] + "(?:$|\\s)").test(t[r]) || (t[r] += " " + n[2]);
                        }
                    return e;
                }
                function xt(e, t, n, r, i, o, a) {
                    var s = n.flattenSpans;
                    null == s && (s = e.options.flattenSpans);
                    var l,
                        c = 0,
                        u = null,
                        d = new Ue(t, e.options.tabSize, r),
                        f = e.options.addModeClass && [null];
                    for ("" == t && bt(mt(n, r.state), o); !d.eol(); ) {
                        if ((d.pos > e.options.maxHighlightLength ? ((s = !1), a && pt(e, t, r, d.pos), (d.pos = t.length), (l = null)) : (l = bt(gt(n, d, r.state, f), o)), f)) {
                            var h = f[0].name;
                            h && (l = "m-" + (l ? h + " " + l : h));
                        }
                        if (!s || u != l) {
                            for (; c < d.start; ) i((c = Math.min(d.start, c + 5e3)), u);
                            u = l;
                        }
                        d.start = d.pos;
                    }
                    for (; c < d.pos; ) {
                        var p = Math.min(d.pos, c + 5e3);
                        i(p, u), (c = p);
                    }
                }
                var wt = !1,
                    kt = !1;
                function Ct(e, t, n) {
                    (this.marker = e), (this.from = t), (this.to = n);
                }
                function St(e, t) {
                    if (e)
                        for (var n = 0; n < e.length; ++n) {
                            var r = e[n];
                            if (r.marker == t) return r;
                        }
                }
                function At(e, t) {
                    for (var n, r = 0; r < e.length; ++r) e[r] != t && (n || (n = [])).push(e[r]);
                    return n;
                }
                function Mt(e, t) {
                    if (t.full) return null;
                    var n = Qe(e, t.from.line) && Ge(e, t.from.line).markedSpans,
                        r = Qe(e, t.to.line) && Ge(e, t.to.line).markedSpans;
                    if (!n && !r) return null;
                    var i = t.from.ch,
                        o = t.to.ch,
                        a = 0 == tt(t.from, t.to),
                        s = (function (e, t, n) {
                            var r;
                            if (e)
                                for (var i = 0; i < e.length; ++i) {
                                    var o = e[i],
                                        a = o.marker;
                                    if (null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t) || (o.from == t && "bookmark" == a.type && (!n || !o.marker.insertLeft))) {
                                        var s = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
                                        (r || (r = [])).push(new Ct(a, o.from, s ? null : o.to));
                                    }
                                }
                            return r;
                        })(n, i, a),
                        l = (function (e, t, n) {
                            var r;
                            if (e)
                                for (var i = 0; i < e.length; ++i) {
                                    var o = e[i],
                                        a = o.marker;
                                    if (null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t) || (o.from == t && "bookmark" == a.type && (!n || o.marker.insertLeft))) {
                                        var s = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
                                        (r || (r = [])).push(new Ct(a, s ? null : o.from - t, null == o.to ? null : o.to - t));
                                    }
                                }
                            return r;
                        })(r, o, a),
                        c = 1 == t.text.length,
                        u = K(t.text).length + (c ? i : 0);
                    if (s)
                        for (var d = 0; d < s.length; ++d) {
                            var f = s[d];
                            if (null == f.to) {
                                var h = St(l, f.marker);
                                h ? c && (f.to = null == h.to ? null : h.to + u) : (f.to = i);
                            }
                        }
                    if (l)
                        for (var p = 0; p < l.length; ++p) {
                            var m = l[p];
                            null != m.to && (m.to += u), null == m.from ? St(s, m.marker) || ((m.from = u), c && (s || (s = [])).push(m)) : ((m.from += u), c && (s || (s = [])).push(m));
                        }
                    s && (s = Tt(s)), l && l != s && (l = Tt(l));
                    var g = [s];
                    if (!c) {
                        var v,
                            y = t.text.length - 2;
                        if (y > 0 && s) for (var b = 0; b < s.length; ++b) null == s[b].to && (v || (v = [])).push(new Ct(s[b].marker, null, null));
                        for (var x = 0; x < y; ++x) g.push(v);
                        g.push(l);
                    }
                    return g;
                }
                function Tt(e) {
                    for (var t = 0; t < e.length; ++t) {
                        var n = e[t];
                        null != n.from && n.from == n.to && !1 !== n.marker.clearWhenEmpty && e.splice(t--, 1);
                    }
                    return e.length ? e : null;
                }
                function Dt(e) {
                    var t = e.markedSpans;
                    if (t) {
                        for (var n = 0; n < t.length; ++n) t[n].marker.detachLine(e);
                        e.markedSpans = null;
                    }
                }
                function Lt(e, t) {
                    if (t) {
                        for (var n = 0; n < t.length; ++n) t[n].marker.attachLine(e);
                        e.markedSpans = t;
                    }
                }
                function Ot(e) {
                    return e.inclusiveLeft ? -1 : 0;
                }
                function jt(e) {
                    return e.inclusiveRight ? 1 : 0;
                }
                function Et(e, t) {
                    var n = e.lines.length - t.lines.length;
                    if (0 != n) return n;
                    var r = e.find(),
                        i = t.find(),
                        o = tt(r.from, i.from) || Ot(e) - Ot(t);
                    if (o) return -o;
                    var a = tt(r.to, i.to) || jt(e) - jt(t);
                    return a || t.id - e.id;
                }
                function _t(e, t) {
                    var n,
                        r = kt && e.markedSpans;
                    if (r) for (var i = void 0, o = 0; o < r.length; ++o) (i = r[o]).marker.collapsed && null == (t ? i.from : i.to) && (!n || Et(n, i.marker) < 0) && (n = i.marker);
                    return n;
                }
                function Nt(e) {
                    return _t(e, !0);
                }
                function It(e) {
                    return _t(e, !1);
                }
                function Ft(e, t) {
                    var n,
                        r = kt && e.markedSpans;
                    if (r)
                        for (var i = 0; i < r.length; ++i) {
                            var o = r[i];
                            o.marker.collapsed && (null == o.from || o.from < t) && (null == o.to || o.to > t) && (!n || Et(n, o.marker) < 0) && (n = o.marker);
                        }
                    return n;
                }
                function Rt(e, t, n, r, i) {
                    var o = Ge(e, t),
                        a = kt && o.markedSpans;
                    if (a)
                        for (var s = 0; s < a.length; ++s) {
                            var l = a[s];
                            if (l.marker.collapsed) {
                                var c = l.marker.find(0),
                                    u = tt(c.from, n) || Ot(l.marker) - Ot(i),
                                    d = tt(c.to, r) || jt(l.marker) - jt(i);
                                if (
                                    !((u >= 0 && d <= 0) || (u <= 0 && d >= 0)) &&
                                    ((u <= 0 && (l.marker.inclusiveRight && i.inclusiveLeft ? tt(c.to, n) >= 0 : tt(c.to, n) > 0)) || (u >= 0 && (l.marker.inclusiveRight && i.inclusiveLeft ? tt(c.from, r) <= 0 : tt(c.from, r) < 0)))
                                )
                                    return !0;
                            }
                        }
                }
                function zt(e) {
                    for (var t; (t = Nt(e)); ) e = t.find(-1, !0).line;
                    return e;
                }
                function Wt(e, t) {
                    var n = Ge(e, t),
                        r = zt(n);
                    return n == r ? t : Xe(r);
                }
                function $t(e, t) {
                    if (t > e.lastLine()) return t;
                    var n,
                        r = Ge(e, t);
                    if (!Pt(e, r)) return t;
                    for (; (n = It(r)); ) r = n.find(1, !0).line;
                    return Xe(r) + 1;
                }
                function Pt(e, t) {
                    var n = kt && t.markedSpans;
                    if (n)
                        for (var r = void 0, i = 0; i < n.length; ++i)
                            if ((r = n[i]).marker.collapsed) {
                                if (null == r.from) return !0;
                                if (!r.marker.widgetNode && 0 == r.from && r.marker.inclusiveLeft && Ht(e, t, r)) return !0;
                            }
                }
                function Ht(e, t, n) {
                    if (null == n.to) {
                        var r = n.marker.find(1, !0);
                        return Ht(e, r.line, St(r.line.markedSpans, n.marker));
                    }
                    if (n.marker.inclusiveRight && n.to == t.text.length) return !0;
                    for (var i = void 0, o = 0; o < t.markedSpans.length; ++o)
                        if ((i = t.markedSpans[o]).marker.collapsed && !i.marker.widgetNode && i.from == n.to && (null == i.to || i.to != n.from) && (i.marker.inclusiveLeft || n.marker.inclusiveRight) && Ht(e, t, i)) return !0;
                }
                function Bt(e) {
                    for (var t = 0, n = (e = zt(e)).parent, r = 0; r < n.lines.length; ++r) {
                        var i = n.lines[r];
                        if (i == e) break;
                        t += i.height;
                    }
                    for (var o = n.parent; o; o = (n = o).parent)
                        for (var a = 0; a < o.children.length; ++a) {
                            var s = o.children[a];
                            if (s == n) break;
                            t += s.height;
                        }
                    return t;
                }
                function Vt(e) {
                    if (0 == e.height) return 0;
                    for (var t, n = e.text.length, r = e; (t = Nt(r)); ) {
                        var i = t.find(0, !0);
                        (r = i.from.line), (n += i.from.ch - i.to.ch);
                    }
                    for (r = e; (t = It(r)); ) {
                        var o = t.find(0, !0);
                        (n -= r.text.length - o.from.ch), (n += (r = o.to.line).text.length - o.to.ch);
                    }
                    return n;
                }
                function Ut(e) {
                    var t = e.display,
                        n = e.doc;
                    (t.maxLine = Ge(n, n.first)),
                        (t.maxLineLength = Vt(t.maxLine)),
                        (t.maxLineChanged = !0),
                        n.iter(function (e) {
                            var n = Vt(e);
                            n > t.maxLineLength && ((t.maxLineLength = n), (t.maxLine = e));
                        });
                }
                var Gt = function (e, t, n) {
                    (this.text = e), Lt(this, t), (this.height = n ? n(this) : 1);
                };
                function qt(e) {
                    (e.parent = null), Dt(e);
                }
                (Gt.prototype.lineNo = function () {
                    return Xe(this);
                }),
                    ye(Gt);
                var Kt = {},
                    Yt = {};
                function Xt(e, t) {
                    if (!e || /^\s*$/.test(e)) return null;
                    var n = t.addModeClass ? Yt : Kt;
                    return n[e] || (n[e] = e.replace(/\S+/g, "cm-$&"));
                }
                function Jt(e, t) {
                    var n = O("span", null, null, l ? "padding-right: .1px" : null),
                        r = { pre: O("pre", [n], "CodeMirror-line"), content: n, col: 0, pos: 0, cm: e, trailingSpace: !1, splitSpaces: e.getOption("lineWrapping") };
                    t.measure = {};
                    for (var i = 0; i <= (t.rest ? t.rest.length : 0); i++) {
                        var o = i ? t.rest[i - 1] : t.line,
                            a = void 0;
                        (r.pos = 0),
                            (r.addToken = Zt),
                            Le(e.display.measure) && (a = ce(o, e.doc.direction)) && (r.addToken = en(r.addToken, a)),
                            (r.map = []),
                            nn(o, r, ft(e, o, t != e.display.externalMeasured && Xe(o))),
                            o.styleClasses && (o.styleClasses.bgClass && (r.bgClass = N(o.styleClasses.bgClass, r.bgClass || "")), o.styleClasses.textClass && (r.textClass = N(o.styleClasses.textClass, r.textClass || ""))),
                            0 == r.map.length && r.map.push(0, 0, r.content.appendChild(De(e.display.measure))),
                            0 == i ? ((t.measure.map = r.map), (t.measure.cache = {})) : ((t.measure.maps || (t.measure.maps = [])).push(r.map), (t.measure.caches || (t.measure.caches = [])).push({}));
                    }
                    if (l) {
                        var s = r.content.lastChild;
                        (/\bcm-tab\b/.test(s.className) || (s.querySelector && s.querySelector(".cm-tab"))) && (r.content.className = "cm-tab-wrap-hack");
                    }
                    return pe(e, "renderLine", e, t.line, r.pre), r.pre.className && (r.textClass = N(r.pre.className, r.textClass || "")), r;
                }
                function Qt(e) {
                    var t = L("span", "•", "cm-invalidchar");
                    return (t.title = "\\u" + e.charCodeAt(0).toString(16)), t.setAttribute("aria-label", t.title), t;
                }
                function Zt(e, t, n, r, i, o, l) {
                    if (t) {
                        var c,
                            u = e.splitSpaces
                                ? (function (e, t) {
                                      if (e.length > 1 && !/  /.test(e)) return e;
                                      for (var n = t, r = "", i = 0; i < e.length; i++) {
                                          var o = e.charAt(i);
                                          " " != o || !n || (i != e.length - 1 && 32 != e.charCodeAt(i + 1)) || (o = " "), (r += o), (n = " " == o);
                                      }
                                      return r;
                                  })(t, e.trailingSpace)
                                : t,
                            d = e.cm.state.specialChars,
                            f = !1;
                        if (d.test(t)) {
                            c = document.createDocumentFragment();
                            for (var h = 0; ; ) {
                                d.lastIndex = h;
                                var p = d.exec(t),
                                    m = p ? p.index - h : t.length - h;
                                if (m) {
                                    var g = document.createTextNode(u.slice(h, h + m));
                                    a && s < 9 ? c.appendChild(L("span", [g])) : c.appendChild(g), e.map.push(e.pos, e.pos + m, g), (e.col += m), (e.pos += m);
                                }
                                if (!p) break;
                                h += m + 1;
                                var v = void 0;
                                if ("\t" == p[0]) {
                                    var y = e.cm.options.tabSize,
                                        b = y - (e.col % y);
                                    (v = c.appendChild(L("span", q(b), "cm-tab"))).setAttribute("role", "presentation"), v.setAttribute("cm-text", "\t"), (e.col += b);
                                } else
                                    "\r" == p[0] || "\n" == p[0]
                                        ? ((v = c.appendChild(L("span", "\r" == p[0] ? "␍" : "␤", "cm-invalidchar"))).setAttribute("cm-text", p[0]), (e.col += 1))
                                        : ((v = e.cm.options.specialCharPlaceholder(p[0])).setAttribute("cm-text", p[0]), a && s < 9 ? c.appendChild(L("span", [v])) : c.appendChild(v), (e.col += 1));
                                e.map.push(e.pos, e.pos + 1, v), e.pos++;
                            }
                        } else (e.col += t.length), (c = document.createTextNode(u)), e.map.push(e.pos, e.pos + t.length, c), a && s < 9 && (f = !0), (e.pos += t.length);
                        if (((e.trailingSpace = 32 == u.charCodeAt(t.length - 1)), n || r || i || f || o || l)) {
                            var x = n || "";
                            r && (x += r), i && (x += i);
                            var w = L("span", [c], x, o);
                            if (l) for (var k in l) l.hasOwnProperty(k) && "style" != k && "class" != k && w.setAttribute(k, l[k]);
                            return e.content.appendChild(w);
                        }
                        e.content.appendChild(c);
                    }
                }
                function en(e, t) {
                    return function (n, r, i, o, a, s, l) {
                        i = i ? i + " cm-force-border" : "cm-force-border";
                        for (var c = n.pos, u = c + r.length; ; ) {
                            for (var d = void 0, f = 0; f < t.length && !((d = t[f]).to > c && d.from <= c); f++);
                            if (d.to >= u) return e(n, r, i, o, a, s, l);
                            e(n, r.slice(0, d.to - c), i, o, null, s, l), (o = null), (r = r.slice(d.to - c)), (c = d.to);
                        }
                    };
                }
                function tn(e, t, n, r) {
                    var i = !r && n.widgetNode;
                    i && e.map.push(e.pos, e.pos + t, i),
                        !r && e.cm.display.input.needsContentAttribute && (i || (i = e.content.appendChild(document.createElement("span"))), i.setAttribute("cm-marker", n.id)),
                        i && (e.cm.display.input.setUneditable(i), e.content.appendChild(i)),
                        (e.pos += t),
                        (e.trailingSpace = !1);
                }
                function nn(e, t, n) {
                    var r = e.markedSpans,
                        i = e.text,
                        o = 0;
                    if (r)
                        for (var a, s, l, c, u, d, f, h = i.length, p = 0, m = 1, g = "", v = 0; ; ) {
                            if (v == p) {
                                (l = c = u = s = ""), (f = null), (d = null), (v = 1 / 0);
                                for (var y = [], b = void 0, x = 0; x < r.length; ++x) {
                                    var w = r[x],
                                        k = w.marker;
                                    if ("bookmark" == k.type && w.from == p && k.widgetNode) y.push(k);
                                    else if (w.from <= p && (null == w.to || w.to > p || (k.collapsed && w.to == p && w.from == p))) {
                                        if (
                                            (null != w.to && w.to != p && v > w.to && ((v = w.to), (c = "")),
                                            k.className && (l += " " + k.className),
                                            k.css && (s = (s ? s + ";" : "") + k.css),
                                            k.startStyle && w.from == p && (u += " " + k.startStyle),
                                            k.endStyle && w.to == v && (b || (b = [])).push(k.endStyle, w.to),
                                            k.title && ((f || (f = {})).title = k.title),
                                            k.attributes)
                                        )
                                            for (var C in k.attributes) (f || (f = {}))[C] = k.attributes[C];
                                        k.collapsed && (!d || Et(d.marker, k) < 0) && (d = w);
                                    } else w.from > p && v > w.from && (v = w.from);
                                }
                                if (b) for (var S = 0; S < b.length; S += 2) b[S + 1] == v && (c += " " + b[S]);
                                if (!d || d.from == p) for (var A = 0; A < y.length; ++A) tn(t, 0, y[A]);
                                if (d && (d.from || 0) == p) {
                                    if ((tn(t, (null == d.to ? h + 1 : d.to) - p, d.marker, null == d.from), null == d.to)) return;
                                    d.to == p && (d = !1);
                                }
                            }
                            if (p >= h) break;
                            for (var M = Math.min(h, v); ; ) {
                                if (g) {
                                    var T = p + g.length;
                                    if (!d) {
                                        var D = T > M ? g.slice(0, M - p) : g;
                                        t.addToken(t, D, a ? a + l : l, u, p + D.length == v ? c : "", s, f);
                                    }
                                    if (T >= M) {
                                        (g = g.slice(M - p)), (p = M);
                                        break;
                                    }
                                    (p = T), (u = "");
                                }
                                (g = i.slice(o, (o = n[m++]))), (a = Xt(n[m++], t.cm.options));
                            }
                        }
                    else for (var L = 1; L < n.length; L += 2) t.addToken(t, i.slice(o, (o = n[L])), Xt(n[L + 1], t.cm.options));
                }
                function rn(e, t, n) {
                    (this.line = t),
                        (this.rest = (function (e) {
                            for (var t, n; (t = It(e)); ) (e = t.find(1, !0).line), (n || (n = [])).push(e);
                            return n;
                        })(t)),
                        (this.size = this.rest ? Xe(K(this.rest)) - n + 1 : 1),
                        (this.node = this.text = null),
                        (this.hidden = Pt(e, t));
                }
                function on(e, t, n) {
                    for (var r, i = [], o = t; o < n; o = r) {
                        var a = new rn(e.doc, Ge(e.doc, o), o);
                        (r = o + a.size), i.push(a);
                    }
                    return i;
                }
                var an = null,
                    sn = null;
                function ln(e, t) {
                    var n = fe(e, t);
                    if (n.length) {
                        var r,
                            i = Array.prototype.slice.call(arguments, 2);
                        an ? (r = an.delayedCallbacks) : sn ? (r = sn) : ((r = sn = []), setTimeout(cn, 0));
                        for (
                            var o = function (e) {
                                    r.push(function () {
                                        return n[e].apply(null, i);
                                    });
                                },
                                a = 0;
                            a < n.length;
                            ++a
                        )
                            o(a);
                    }
                }
                function cn() {
                    var e = sn;
                    sn = null;
                    for (var t = 0; t < e.length; ++t) e[t]();
                }
                function un(e, t, n, r) {
                    for (var i = 0; i < t.changes.length; i++) {
                        var o = t.changes[i];
                        "text" == o ? hn(e, t) : "gutter" == o ? mn(e, t, n, r) : "class" == o ? pn(e, t) : "widget" == o && gn(e, t, r);
                    }
                    t.changes = null;
                }
                function dn(e) {
                    return (
                        e.node == e.text && ((e.node = L("div", null, null, "position: relative")), e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text), e.node.appendChild(e.text), a && s < 8 && (e.node.style.zIndex = 2)),
                        e.node
                    );
                }
                function fn(e, t) {
                    var n = e.display.externalMeasured;
                    return n && n.line == t.line ? ((e.display.externalMeasured = null), (t.measure = n.measure), n.built) : Jt(e, t);
                }
                function hn(e, t) {
                    var n = t.text.className,
                        r = fn(e, t);
                    t.text == t.node && (t.node = r.pre),
                        t.text.parentNode.replaceChild(r.pre, t.text),
                        (t.text = r.pre),
                        r.bgClass != t.bgClass || r.textClass != t.textClass ? ((t.bgClass = r.bgClass), (t.textClass = r.textClass), pn(e, t)) : n && (t.text.className = n);
                }
                function pn(e, t) {
                    !(function (e, t) {
                        var n = t.bgClass ? t.bgClass + " " + (t.line.bgClass || "") : t.line.bgClass;
                        if ((n && (n += " CodeMirror-linebackground"), t.background)) n ? (t.background.className = n) : (t.background.parentNode.removeChild(t.background), (t.background = null));
                        else if (n) {
                            var r = dn(t);
                            (t.background = r.insertBefore(L("div", null, n), r.firstChild)), e.display.input.setUneditable(t.background);
                        }
                    })(e, t),
                        t.line.wrapClass ? (dn(t).className = t.line.wrapClass) : t.node != t.text && (t.node.className = "");
                    var n = t.textClass ? t.textClass + " " + (t.line.textClass || "") : t.line.textClass;
                    t.text.className = n || "";
                }
                function mn(e, t, n, r) {
                    if ((t.gutter && (t.node.removeChild(t.gutter), (t.gutter = null)), t.gutterBackground && (t.node.removeChild(t.gutterBackground), (t.gutterBackground = null)), t.line.gutterClass)) {
                        var i = dn(t);
                        (t.gutterBackground = L("div", null, "CodeMirror-gutter-background " + t.line.gutterClass, "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px; width: " + r.gutterTotalWidth + "px")),
                            e.display.input.setUneditable(t.gutterBackground),
                            i.insertBefore(t.gutterBackground, t.text);
                    }
                    var o = t.line.gutterMarkers;
                    if (e.options.lineNumbers || o) {
                        var a = dn(t),
                            s = (t.gutter = L("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px"));
                        if (
                            (e.display.input.setUneditable(s),
                            a.insertBefore(s, t.text),
                            t.line.gutterClass && (s.className += " " + t.line.gutterClass),
                            !e.options.lineNumbers ||
                                (o && o["CodeMirror-linenumbers"]) ||
                                (t.lineNumber = s.appendChild(
                                    L("div", Ze(e.options, n), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + r.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px")
                                )),
                            o)
                        )
                            for (var l = 0; l < e.display.gutterSpecs.length; ++l) {
                                var c = e.display.gutterSpecs[l].className,
                                    u = o.hasOwnProperty(c) && o[c];
                                u && s.appendChild(L("div", [u], "CodeMirror-gutter-elt", "left: " + r.gutterLeft[c] + "px; width: " + r.gutterWidth[c] + "px"));
                            }
                    }
                }
                function gn(e, t, n) {
                    t.alignable && (t.alignable = null);
                    for (var r = S("CodeMirror-linewidget"), i = t.node.firstChild, o = void 0; i; i = o) (o = i.nextSibling), r.test(i.className) && t.node.removeChild(i);
                    yn(e, t, n);
                }
                function vn(e, t, n, r) {
                    var i = fn(e, t);
                    return (t.text = t.node = i.pre), i.bgClass && (t.bgClass = i.bgClass), i.textClass && (t.textClass = i.textClass), pn(e, t), mn(e, t, n, r), yn(e, t, r), t.node;
                }
                function yn(e, t, n) {
                    if ((bn(e, t.line, t, n, !0), t.rest)) for (var r = 0; r < t.rest.length; r++) bn(e, t.rest[r], t, n, !1);
                }
                function bn(e, t, n, r, i) {
                    if (t.widgets)
                        for (var o = dn(n), a = 0, s = t.widgets; a < s.length; ++a) {
                            var l = s[a],
                                c = L("div", [l.node], "CodeMirror-linewidget" + (l.className ? " " + l.className : ""));
                            l.handleMouseEvents || c.setAttribute("cm-ignore-events", "true"), xn(l, c, n, r), e.display.input.setUneditable(c), i && l.above ? o.insertBefore(c, n.gutter || n.text) : o.appendChild(c), ln(l, "redraw");
                        }
                }
                function xn(e, t, n, r) {
                    if (e.noHScroll) {
                        (n.alignable || (n.alignable = [])).push(t);
                        var i = r.wrapperWidth;
                        (t.style.left = r.fixedPos + "px"), e.coverGutter || ((i -= r.gutterTotalWidth), (t.style.paddingLeft = r.gutterTotalWidth + "px")), (t.style.width = i + "px");
                    }
                    e.coverGutter && ((t.style.zIndex = 5), (t.style.position = "relative"), e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + "px"));
                }
                function wn(e) {
                    if (null != e.height) return e.height;
                    var t = e.doc.cm;
                    if (!t) return 0;
                    if (!j(document.body, e.node)) {
                        var n = "position: relative;";
                        e.coverGutter && (n += "margin-left: -" + t.display.gutters.offsetWidth + "px;"), e.noHScroll && (n += "width: " + t.display.wrapper.clientWidth + "px;"), D(t.display.measure, L("div", [e.node], null, n));
                    }
                    return (e.height = e.node.parentNode.offsetHeight);
                }
                function kn(e, t) {
                    for (var n = Ce(t); n != e.wrapper; n = n.parentNode) if (!n || (1 == n.nodeType && "true" == n.getAttribute("cm-ignore-events")) || (n.parentNode == e.sizer && n != e.mover)) return !0;
                }
                function Cn(e) {
                    return e.lineSpace.offsetTop;
                }
                function Sn(e) {
                    return e.mover.offsetHeight - e.lineSpace.offsetHeight;
                }
                function An(e) {
                    if (e.cachedPaddingH) return e.cachedPaddingH;
                    var t = D(e.measure, L("pre", "x", "CodeMirror-line-like")),
                        n = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle,
                        r = { left: parseInt(n.paddingLeft), right: parseInt(n.paddingRight) };
                    return isNaN(r.left) || isNaN(r.right) || (e.cachedPaddingH = r), r;
                }
                function Mn(e) {
                    return 50 - e.display.nativeBarWidth;
                }
                function Tn(e) {
                    return e.display.scroller.clientWidth - Mn(e) - e.display.barWidth;
                }
                function Dn(e) {
                    return e.display.scroller.clientHeight - Mn(e) - e.display.barHeight;
                }
                function Ln(e, t, n) {
                    if (e.line == t) return { map: e.measure.map, cache: e.measure.cache };
                    for (var r = 0; r < e.rest.length; r++) if (e.rest[r] == t) return { map: e.measure.maps[r], cache: e.measure.caches[r] };
                    for (var i = 0; i < e.rest.length; i++) if (Xe(e.rest[i]) > n) return { map: e.measure.maps[i], cache: e.measure.caches[i], before: !0 };
                }
                function On(e, t, n, r) {
                    return _n(e, En(e, t), n, r);
                }
                function jn(e, t) {
                    if (t >= e.display.viewFrom && t < e.display.viewTo) return e.display.view[ur(e, t)];
                    var n = e.display.externalMeasured;
                    return n && t >= n.lineN && t < n.lineN + n.size ? n : void 0;
                }
                function En(e, t) {
                    var n = Xe(t),
                        r = jn(e, n);
                    r && !r.text ? (r = null) : r && r.changes && (un(e, r, n, or(e)), (e.curOp.forceUpdate = !0)),
                        r ||
                            (r = (function (e, t) {
                                var n = Xe((t = zt(t))),
                                    r = (e.display.externalMeasured = new rn(e.doc, t, n));
                                r.lineN = n;
                                var i = (r.built = Jt(e, r));
                                return (r.text = i.pre), D(e.display.lineMeasure, i.pre), r;
                            })(e, t));
                    var i = Ln(r, t, n);
                    return { line: t, view: r, rect: null, map: i.map, cache: i.cache, before: i.before, hasHeights: !1 };
                }
                function _n(e, t, n, r, i) {
                    t.before && (n = -1);
                    var o,
                        l = n + (r || "");
                    return (
                        t.cache.hasOwnProperty(l)
                            ? (o = t.cache[l])
                            : (t.rect || (t.rect = t.view.text.getBoundingClientRect()),
                              t.hasHeights ||
                                  ((function (e, t, n) {
                                      var r = e.options.lineWrapping,
                                          i = r && Tn(e);
                                      if (!t.measure.heights || (r && t.measure.width != i)) {
                                          var o = (t.measure.heights = []);
                                          if (r) {
                                              t.measure.width = i;
                                              for (var a = t.text.firstChild.getClientRects(), s = 0; s < a.length - 1; s++) {
                                                  var l = a[s],
                                                      c = a[s + 1];
                                                  Math.abs(l.bottom - c.bottom) > 2 && o.push((l.bottom + c.top) / 2 - n.top);
                                              }
                                          }
                                          o.push(n.bottom - n.top);
                                      }
                                  })(e, t.view, t.rect),
                                  (t.hasHeights = !0)),
                              (o = (function (e, t, n, r) {
                                  var i,
                                      o = Fn(t.map, n, r),
                                      l = o.node,
                                      c = o.start,
                                      u = o.end,
                                      d = o.collapse;
                                  if (3 == l.nodeType) {
                                      for (var f = 0; f < 4; f++) {
                                          for (; c && re(t.line.text.charAt(o.coverStart + c)); ) --c;
                                          for (; o.coverStart + u < o.coverEnd && re(t.line.text.charAt(o.coverStart + u)); ) ++u;
                                          if ((i = a && s < 9 && 0 == c && u == o.coverEnd - o.coverStart ? l.parentNode.getBoundingClientRect() : Rn(A(l, c, u).getClientRects(), r)).left || i.right || 0 == c) break;
                                          (u = c), (c -= 1), (d = "right");
                                      }
                                      a &&
                                          s < 11 &&
                                          (i = (function (e, t) {
                                              if (
                                                  !window.screen ||
                                                  null == screen.logicalXDPI ||
                                                  screen.logicalXDPI == screen.deviceXDPI ||
                                                  !(function (e) {
                                                      if (null != Ne) return Ne;
                                                      var t = D(e, L("span", "x")),
                                                          n = t.getBoundingClientRect(),
                                                          r = A(t, 0, 1).getBoundingClientRect();
                                                      return (Ne = Math.abs(n.left - r.left) > 1);
                                                  })(e)
                                              )
                                                  return t;
                                              var n = screen.logicalXDPI / screen.deviceXDPI,
                                                  r = screen.logicalYDPI / screen.deviceYDPI;
                                              return { left: t.left * n, right: t.right * n, top: t.top * r, bottom: t.bottom * r };
                                          })(e.display.measure, i));
                                  } else {
                                      var h;
                                      c > 0 && (d = r = "right"), (i = e.options.lineWrapping && (h = l.getClientRects()).length > 1 ? h["right" == r ? h.length - 1 : 0] : l.getBoundingClientRect());
                                  }
                                  if (a && s < 9 && !c && (!i || (!i.left && !i.right))) {
                                      var p = l.parentNode.getClientRects()[0];
                                      i = p ? { left: p.left, right: p.left + ir(e.display), top: p.top, bottom: p.bottom } : In;
                                  }
                                  for (var m = i.top - t.rect.top, g = i.bottom - t.rect.top, v = (m + g) / 2, y = t.view.measure.heights, b = 0; b < y.length - 1 && !(v < y[b]); b++);
                                  var x = b ? y[b - 1] : 0,
                                      w = y[b],
                                      k = { left: ("right" == d ? i.right : i.left) - t.rect.left, right: ("left" == d ? i.left : i.right) - t.rect.left, top: x, bottom: w };
                                  return i.left || i.right || (k.bogus = !0), e.options.singleCursorHeightPerLine || ((k.rtop = m), (k.rbottom = g)), k;
                              })(e, t, n, r)).bogus || (t.cache[l] = o)),
                        { left: o.left, right: o.right, top: i ? o.rtop : o.top, bottom: i ? o.rbottom : o.bottom }
                    );
                }
                var Nn,
                    In = { left: 0, right: 0, top: 0, bottom: 0 };
                function Fn(e, t, n) {
                    for (var r, i, o, a, s, l, c = 0; c < e.length; c += 3)
                        if (
                            ((s = e[c]),
                            (l = e[c + 1]),
                            t < s ? ((i = 0), (o = 1), (a = "left")) : t < l ? (o = 1 + (i = t - s)) : (c == e.length - 3 || (t == l && e[c + 3] > t)) && ((i = (o = l - s) - 1), t >= l && (a = "right")),
                            null != i)
                        ) {
                            if (((r = e[c + 2]), s == l && n == (r.insertLeft ? "left" : "right") && (a = n), "left" == n && 0 == i)) for (; c && e[c - 2] == e[c - 3] && e[c - 1].insertLeft; ) (r = e[2 + (c -= 3)]), (a = "left");
                            if ("right" == n && i == l - s) for (; c < e.length - 3 && e[c + 3] == e[c + 4] && !e[c + 5].insertLeft; ) (r = e[(c += 3) + 2]), (a = "right");
                            break;
                        }
                    return { node: r, start: i, end: o, collapse: a, coverStart: s, coverEnd: l };
                }
                function Rn(e, t) {
                    var n = In;
                    if ("left" == t) for (var r = 0; r < e.length && (n = e[r]).left == n.right; r++);
                    else for (var i = e.length - 1; i >= 0 && (n = e[i]).left == n.right; i--);
                    return n;
                }
                function zn(e) {
                    if (e.measure && ((e.measure.cache = {}), (e.measure.heights = null), e.rest)) for (var t = 0; t < e.rest.length; t++) e.measure.caches[t] = {};
                }
                function Wn(e) {
                    (e.display.externalMeasure = null), T(e.display.lineMeasure);
                    for (var t = 0; t < e.display.view.length; t++) zn(e.display.view[t]);
                }
                function $n(e) {
                    Wn(e), (e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null), e.options.lineWrapping || (e.display.maxLineChanged = !0), (e.display.lineNumChars = null);
                }
                function Pn() {
                    return u && g ? -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft)) : window.pageXOffset || (document.documentElement || document.body).scrollLeft;
                }
                function Hn() {
                    return u && g ? -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop)) : window.pageYOffset || (document.documentElement || document.body).scrollTop;
                }
                function Bn(e) {
                    var t = 0;
                    if (e.widgets) for (var n = 0; n < e.widgets.length; ++n) e.widgets[n].above && (t += wn(e.widgets[n]));
                    return t;
                }
                function Vn(e, t, n, r, i) {
                    if (!i) {
                        var o = Bn(t);
                        (n.top += o), (n.bottom += o);
                    }
                    if ("line" == r) return n;
                    r || (r = "local");
                    var a = Bt(t);
                    if (("local" == r ? (a += Cn(e.display)) : (a -= e.display.viewOffset), "page" == r || "window" == r)) {
                        var s = e.display.lineSpace.getBoundingClientRect();
                        a += s.top + ("window" == r ? 0 : Hn());
                        var l = s.left + ("window" == r ? 0 : Pn());
                        (n.left += l), (n.right += l);
                    }
                    return (n.top += a), (n.bottom += a), n;
                }
                function Un(e, t, n) {
                    if ("div" == n) return t;
                    var r = t.left,
                        i = t.top;
                    if ("page" == n) (r -= Pn()), (i -= Hn());
                    else if ("local" == n || !n) {
                        var o = e.display.sizer.getBoundingClientRect();
                        (r += o.left), (i += o.top);
                    }
                    var a = e.display.lineSpace.getBoundingClientRect();
                    return { left: r - a.left, top: i - a.top };
                }
                function Gn(e, t, n, r, i) {
                    return r || (r = Ge(e.doc, t.line)), Vn(e, r, On(e, r, t.ch, i), n);
                }
                function qn(e, t, n, r, i, o) {
                    function a(t, a) {
                        var s = _n(e, i, t, a ? "right" : "left", o);
                        return a ? (s.left = s.right) : (s.right = s.left), Vn(e, r, s, n);
                    }
                    (r = r || Ge(e.doc, t.line)), i || (i = En(e, r));
                    var s = ce(r, e.doc.direction),
                        l = t.ch,
                        c = t.sticky;
                    if ((l >= r.text.length ? ((l = r.text.length), (c = "before")) : l <= 0 && ((l = 0), (c = "after")), !s)) return a("before" == c ? l - 1 : l, "before" == c);
                    function u(e, t, n) {
                        return a(n ? e - 1 : e, (1 == s[t].level) != n);
                    }
                    var d = se(s, l, c),
                        f = ae,
                        h = u(l, d, "before" == c);
                    return null != f && (h.other = u(l, f, "before" != c)), h;
                }
                function Kn(e, t) {
                    var n = 0;
                    (t = st(e.doc, t)), e.options.lineWrapping || (n = ir(e.display) * t.ch);
                    var r = Ge(e.doc, t.line),
                        i = Bt(r) + Cn(e.display);
                    return { left: n, right: n, top: i, bottom: i + r.height };
                }
                function Yn(e, t, n, r, i) {
                    var o = et(e, t, n);
                    return (o.xRel = i), r && (o.outside = r), o;
                }
                function Xn(e, t, n) {
                    var r = e.doc;
                    if ((n += e.display.viewOffset) < 0) return Yn(r.first, 0, null, -1, -1);
                    var i = Je(r, n),
                        o = r.first + r.size - 1;
                    if (i > o) return Yn(r.first + r.size - 1, Ge(r, o).text.length, null, 1, 1);
                    t < 0 && (t = 0);
                    for (var a = Ge(r, i); ; ) {
                        var s = er(e, a, i, t, n),
                            l = Ft(a, s.ch + (s.xRel > 0 || s.outside > 0 ? 1 : 0));
                        if (!l) return s;
                        var c = l.find(1);
                        if (c.line == i) return c;
                        a = Ge(r, (i = c.line));
                    }
                }
                function Jn(e, t, n, r) {
                    r -= Bn(t);
                    var i = t.text.length,
                        o = oe(
                            function (t) {
                                return _n(e, n, t - 1).bottom <= r;
                            },
                            i,
                            0
                        );
                    return {
                        begin: o,
                        end: (i = oe(
                            function (t) {
                                return _n(e, n, t).top > r;
                            },
                            o,
                            i
                        )),
                    };
                }
                function Qn(e, t, n, r) {
                    return n || (n = En(e, t)), Jn(e, t, n, Vn(e, t, _n(e, n, r), "line").top);
                }
                function Zn(e, t, n, r) {
                    return !(e.bottom <= n) && (e.top > n || (r ? e.left : e.right) > t);
                }
                function er(e, t, n, r, i) {
                    i -= Bt(t);
                    var o = En(e, t),
                        a = Bn(t),
                        s = 0,
                        l = t.text.length,
                        c = !0,
                        u = ce(t, e.doc.direction);
                    if (u) {
                        var d = (e.options.lineWrapping ? nr : tr)(e, t, n, o, u, r, i);
                        (s = (c = 1 != d.level) ? d.from : d.to - 1), (l = c ? d.to : d.from - 1);
                    }
                    var f,
                        h,
                        p = null,
                        m = null,
                        g = oe(
                            function (t) {
                                var n = _n(e, o, t);
                                return (n.top += a), (n.bottom += a), !!Zn(n, r, i, !1) && (n.top <= i && n.left <= r && ((p = t), (m = n)), !0);
                            },
                            s,
                            l
                        ),
                        v = !1;
                    if (m) {
                        var y = r - m.left < m.right - r,
                            b = y == c;
                        (g = p + (b ? 0 : 1)), (h = b ? "after" : "before"), (f = y ? m.left : m.right);
                    } else {
                        c || (g != l && g != s) || g++, (h = 0 == g ? "after" : g == t.text.length ? "before" : _n(e, o, g - (c ? 1 : 0)).bottom + a <= i == c ? "after" : "before");
                        var x = qn(e, et(n, g, h), "line", t, o);
                        (f = x.left), (v = i < x.top ? -1 : i >= x.bottom ? 1 : 0);
                    }
                    return Yn(n, (g = ie(t.text, g, 1)), h, v, r - f);
                }
                function tr(e, t, n, r, i, o, a) {
                    var s = oe(
                            function (s) {
                                var l = i[s],
                                    c = 1 != l.level;
                                return Zn(qn(e, et(n, c ? l.to : l.from, c ? "before" : "after"), "line", t, r), o, a, !0);
                            },
                            0,
                            i.length - 1
                        ),
                        l = i[s];
                    if (s > 0) {
                        var c = 1 != l.level,
                            u = qn(e, et(n, c ? l.from : l.to, c ? "after" : "before"), "line", t, r);
                        Zn(u, o, a, !0) && u.top > a && (l = i[s - 1]);
                    }
                    return l;
                }
                function nr(e, t, n, r, i, o, a) {
                    var s = Jn(e, t, r, a),
                        l = s.begin,
                        c = s.end;
                    /\s/.test(t.text.charAt(c - 1)) && c--;
                    for (var u = null, d = null, f = 0; f < i.length; f++) {
                        var h = i[f];
                        if (!(h.from >= c || h.to <= l)) {
                            var p = _n(e, r, 1 != h.level ? Math.min(c, h.to) - 1 : Math.max(l, h.from)).right,
                                m = p < o ? o - p + 1e9 : p - o;
                            (!u || d > m) && ((u = h), (d = m));
                        }
                    }
                    return u || (u = i[i.length - 1]), u.from < l && (u = { from: l, to: u.to, level: u.level }), u.to > c && (u = { from: u.from, to: c, level: u.level }), u;
                }
                function rr(e) {
                    if (null != e.cachedTextHeight) return e.cachedTextHeight;
                    if (null == Nn) {
                        Nn = L("pre", null, "CodeMirror-line-like");
                        for (var t = 0; t < 49; ++t) Nn.appendChild(document.createTextNode("x")), Nn.appendChild(L("br"));
                        Nn.appendChild(document.createTextNode("x"));
                    }
                    D(e.measure, Nn);
                    var n = Nn.offsetHeight / 50;
                    return n > 3 && (e.cachedTextHeight = n), T(e.measure), n || 1;
                }
                function ir(e) {
                    if (null != e.cachedCharWidth) return e.cachedCharWidth;
                    var t = L("span", "xxxxxxxxxx"),
                        n = L("pre", [t], "CodeMirror-line-like");
                    D(e.measure, n);
                    var r = t.getBoundingClientRect(),
                        i = (r.right - r.left) / 10;
                    return i > 2 && (e.cachedCharWidth = i), i || 10;
                }
                function or(e) {
                    for (var t = e.display, n = {}, r = {}, i = t.gutters.clientLeft, o = t.gutters.firstChild, a = 0; o; o = o.nextSibling, ++a) {
                        var s = e.display.gutterSpecs[a].className;
                        (n[s] = o.offsetLeft + o.clientLeft + i), (r[s] = o.clientWidth);
                    }
                    return { fixedPos: ar(t), gutterTotalWidth: t.gutters.offsetWidth, gutterLeft: n, gutterWidth: r, wrapperWidth: t.wrapper.clientWidth };
                }
                function ar(e) {
                    return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left;
                }
                function sr(e) {
                    var t = rr(e.display),
                        n = e.options.lineWrapping,
                        r = n && Math.max(5, e.display.scroller.clientWidth / ir(e.display) - 3);
                    return function (i) {
                        if (Pt(e.doc, i)) return 0;
                        var o = 0;
                        if (i.widgets) for (var a = 0; a < i.widgets.length; a++) i.widgets[a].height && (o += i.widgets[a].height);
                        return n ? o + (Math.ceil(i.text.length / r) || 1) * t : o + t;
                    };
                }
                function lr(e) {
                    var t = e.doc,
                        n = sr(e);
                    t.iter(function (e) {
                        var t = n(e);
                        t != e.height && Ye(e, t);
                    });
                }
                function cr(e, t, n, r) {
                    var i = e.display;
                    if (!n && "true" == Ce(t).getAttribute("cm-not-content")) return null;
                    var o,
                        a,
                        s = i.lineSpace.getBoundingClientRect();
                    try {
                        (o = t.clientX - s.left), (a = t.clientY - s.top);
                    } catch (e) {
                        return null;
                    }
                    var l,
                        c = Xn(e, o, a);
                    if (r && c.xRel > 0 && (l = Ge(e.doc, c.line).text).length == c.ch) {
                        var u = z(l, l.length, e.options.tabSize) - l.length;
                        c = et(c.line, Math.max(0, Math.round((o - An(e.display).left) / ir(e.display)) - u));
                    }
                    return c;
                }
                function ur(e, t) {
                    if (t >= e.display.viewTo) return null;
                    if ((t -= e.display.viewFrom) < 0) return null;
                    for (var n = e.display.view, r = 0; r < n.length; r++) if ((t -= n[r].size) < 0) return r;
                }
                function dr(e, t, n, r) {
                    null == t && (t = e.doc.first), null == n && (n = e.doc.first + e.doc.size), r || (r = 0);
                    var i = e.display;
                    if ((r && n < i.viewTo && (null == i.updateLineNumbers || i.updateLineNumbers > t) && (i.updateLineNumbers = t), (e.curOp.viewChanged = !0), t >= i.viewTo)) kt && Wt(e.doc, t) < i.viewTo && hr(e);
                    else if (n <= i.viewFrom) kt && $t(e.doc, n + r) > i.viewFrom ? hr(e) : ((i.viewFrom += r), (i.viewTo += r));
                    else if (t <= i.viewFrom && n >= i.viewTo) hr(e);
                    else if (t <= i.viewFrom) {
                        var o = pr(e, n, n + r, 1);
                        o ? ((i.view = i.view.slice(o.index)), (i.viewFrom = o.lineN), (i.viewTo += r)) : hr(e);
                    } else if (n >= i.viewTo) {
                        var a = pr(e, t, t, -1);
                        a ? ((i.view = i.view.slice(0, a.index)), (i.viewTo = a.lineN)) : hr(e);
                    } else {
                        var s = pr(e, t, t, -1),
                            l = pr(e, n, n + r, 1);
                        s && l ? ((i.view = i.view.slice(0, s.index).concat(on(e, s.lineN, l.lineN)).concat(i.view.slice(l.index))), (i.viewTo += r)) : hr(e);
                    }
                    var c = i.externalMeasured;
                    c && (n < c.lineN ? (c.lineN += r) : t < c.lineN + c.size && (i.externalMeasured = null));
                }
                function fr(e, t, n) {
                    e.curOp.viewChanged = !0;
                    var r = e.display,
                        i = e.display.externalMeasured;
                    if ((i && t >= i.lineN && t < i.lineN + i.size && (r.externalMeasured = null), !(t < r.viewFrom || t >= r.viewTo))) {
                        var o = r.view[ur(e, t)];
                        if (null != o.node) {
                            var a = o.changes || (o.changes = []);
                            -1 == $(a, n) && a.push(n);
                        }
                    }
                }
                function hr(e) {
                    (e.display.viewFrom = e.display.viewTo = e.doc.first), (e.display.view = []), (e.display.viewOffset = 0);
                }
                function pr(e, t, n, r) {
                    var i,
                        o = ur(e, t),
                        a = e.display.view;
                    if (!kt || n == e.doc.first + e.doc.size) return { index: o, lineN: n };
                    for (var s = e.display.viewFrom, l = 0; l < o; l++) s += a[l].size;
                    if (s != t) {
                        if (r > 0) {
                            if (o == a.length - 1) return null;
                            (i = s + a[o].size - t), o++;
                        } else i = s - t;
                        (t += i), (n += i);
                    }
                    for (; Wt(e.doc, n) != n; ) {
                        if (o == (r < 0 ? 0 : a.length - 1)) return null;
                        (n += r * a[o - (r < 0 ? 1 : 0)].size), (o += r);
                    }
                    return { index: o, lineN: n };
                }
                function mr(e) {
                    for (var t = e.display.view, n = 0, r = 0; r < t.length; r++) {
                        var i = t[r];
                        i.hidden || (i.node && !i.changes) || ++n;
                    }
                    return n;
                }
                function gr(e) {
                    e.display.input.showSelection(e.display.input.prepareSelection());
                }
                function vr(e, t) {
                    void 0 === t && (t = !0);
                    for (var n = e.doc, r = {}, i = (r.cursors = document.createDocumentFragment()), o = (r.selection = document.createDocumentFragment()), a = 0; a < n.sel.ranges.length; a++)
                        if (t || a != n.sel.primIndex) {
                            var s = n.sel.ranges[a];
                            if (!(s.from().line >= e.display.viewTo || s.to().line < e.display.viewFrom)) {
                                var l = s.empty();
                                (l || e.options.showCursorWhenSelecting) && yr(e, s.head, i), l || xr(e, s, o);
                            }
                        }
                    return r;
                }
                function yr(e, t, n) {
                    var r = qn(e, t, "div", null, null, !e.options.singleCursorHeightPerLine),
                        i = n.appendChild(L("div", " ", "CodeMirror-cursor"));
                    if (((i.style.left = r.left + "px"), (i.style.top = r.top + "px"), (i.style.height = Math.max(0, r.bottom - r.top) * e.options.cursorHeight + "px"), r.other)) {
                        var o = n.appendChild(L("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"));
                        (o.style.display = ""), (o.style.left = r.other.left + "px"), (o.style.top = r.other.top + "px"), (o.style.height = 0.85 * (r.other.bottom - r.other.top) + "px");
                    }
                }
                function br(e, t) {
                    return e.top - t.top || e.left - t.left;
                }
                function xr(e, t, n) {
                    var r = e.display,
                        i = e.doc,
                        o = document.createDocumentFragment(),
                        a = An(e.display),
                        s = a.left,
                        l = Math.max(r.sizerWidth, Tn(e) - r.sizer.offsetLeft) - a.right,
                        c = "ltr" == i.direction;
                    function u(e, t, n, r) {
                        t < 0 && (t = 0),
                            (t = Math.round(t)),
                            (r = Math.round(r)),
                            o.appendChild(
                                L(
                                    "div",
                                    null,
                                    "CodeMirror-selected",
                                    "position: absolute; left: " + e + "px;\n                             top: " + t + "px; width: " + (null == n ? l - e : n) + "px;\n                             height: " + (r - t) + "px"
                                )
                            );
                    }
                    function d(t, n, r) {
                        var o,
                            a,
                            d = Ge(i, t),
                            f = d.text.length;
                        function h(n, r) {
                            return Gn(e, et(t, n), "div", d, r);
                        }
                        function p(t, n, r) {
                            var i = Qn(e, d, null, t),
                                o = ("ltr" == n) == ("after" == r) ? "left" : "right";
                            return h("after" == r ? i.begin : i.end - (/\s/.test(d.text.charAt(i.end - 1)) ? 2 : 1), o)[o];
                        }
                        var m = ce(d, i.direction);
                        return (
                            (function (e, t, n, r) {
                                if (!e) return r(t, n, "ltr", 0);
                                for (var i = !1, o = 0; o < e.length; ++o) {
                                    var a = e[o];
                                    ((a.from < n && a.to > t) || (t == n && a.to == t)) && (r(Math.max(a.from, t), Math.min(a.to, n), 1 == a.level ? "rtl" : "ltr", o), (i = !0));
                                }
                                i || r(t, n, "ltr");
                            })(m, n || 0, null == r ? f : r, function (e, t, i, d) {
                                var g = "ltr" == i,
                                    v = h(e, g ? "left" : "right"),
                                    y = h(t - 1, g ? "right" : "left"),
                                    b = null == n && 0 == e,
                                    x = null == r && t == f,
                                    w = 0 == d,
                                    k = !m || d == m.length - 1;
                                if (y.top - v.top <= 3) {
                                    var C = (c ? x : b) && k,
                                        S = (c ? b : x) && w ? s : (g ? v : y).left,
                                        A = C ? l : (g ? y : v).right;
                                    u(S, v.top, A - S, v.bottom);
                                } else {
                                    var M, T, D, L;
                                    g
                                        ? ((M = c && b && w ? s : v.left), (T = c ? l : p(e, i, "before")), (D = c ? s : p(t, i, "after")), (L = c && x && k ? l : y.right))
                                        : ((M = c ? p(e, i, "before") : s), (T = !c && b && w ? l : v.right), (D = !c && x && k ? s : y.left), (L = c ? p(t, i, "after") : l)),
                                        u(M, v.top, T - M, v.bottom),
                                        v.bottom < y.top && u(s, v.bottom, null, y.top),
                                        u(D, y.top, L - D, y.bottom);
                                }
                                (!o || br(v, o) < 0) && (o = v), br(y, o) < 0 && (o = y), (!a || br(v, a) < 0) && (a = v), br(y, a) < 0 && (a = y);
                            }),
                            { start: o, end: a }
                        );
                    }
                    var f = t.from(),
                        h = t.to();
                    if (f.line == h.line) d(f.line, f.ch, h.ch);
                    else {
                        var p = Ge(i, f.line),
                            m = Ge(i, h.line),
                            g = zt(p) == zt(m),
                            v = d(f.line, f.ch, g ? p.text.length + 1 : null).end,
                            y = d(h.line, g ? 0 : null, h.ch).start;
                        g && (v.top < y.top - 2 ? (u(v.right, v.top, null, v.bottom), u(s, y.top, y.left, y.bottom)) : u(v.right, v.top, y.left - v.right, v.bottom)), v.bottom < y.top && u(s, v.bottom, null, y.top);
                    }
                    n.appendChild(o);
                }
                function wr(e) {
                    if (e.state.focused) {
                        var t = e.display;
                        clearInterval(t.blinker);
                        var n = !0;
                        (t.cursorDiv.style.visibility = ""),
                            e.options.cursorBlinkRate > 0
                                ? (t.blinker = setInterval(function () {
                                      e.hasFocus() || Ar(e), (t.cursorDiv.style.visibility = (n = !n) ? "" : "hidden");
                                  }, e.options.cursorBlinkRate))
                                : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = "hidden");
                    }
                }
                function kr(e) {
                    e.hasFocus() || (e.display.input.focus(), e.state.focused || Sr(e));
                }
                function Cr(e) {
                    (e.state.delayingBlurEvent = !0),
                        setTimeout(function () {
                            e.state.delayingBlurEvent && ((e.state.delayingBlurEvent = !1), e.state.focused && Ar(e));
                        }, 100);
                }
                function Sr(e, t) {
                    e.state.delayingBlurEvent && !e.state.draggingText && (e.state.delayingBlurEvent = !1),
                        "nocursor" != e.options.readOnly &&
                            (e.state.focused ||
                                (pe(e, "focus", e, t),
                                (e.state.focused = !0),
                                _(e.display.wrapper, "CodeMirror-focused"),
                                e.curOp ||
                                    e.display.selForContextMenu == e.doc.sel ||
                                    (e.display.input.reset(),
                                    l &&
                                        setTimeout(function () {
                                            return e.display.input.reset(!0);
                                        }, 20)),
                                e.display.input.receivedFocus()),
                            wr(e));
                }
                function Ar(e, t) {
                    e.state.delayingBlurEvent ||
                        (e.state.focused && (pe(e, "blur", e, t), (e.state.focused = !1), M(e.display.wrapper, "CodeMirror-focused")),
                        clearInterval(e.display.blinker),
                        setTimeout(function () {
                            e.state.focused || (e.display.shift = !1);
                        }, 150));
                }
                function Mr(e) {
                    for (var t = e.display, n = t.lineDiv.offsetTop, r = 0; r < t.view.length; r++) {
                        var i = t.view[r],
                            o = e.options.lineWrapping,
                            l = void 0,
                            c = 0;
                        if (!i.hidden) {
                            if (a && s < 8) {
                                var u = i.node.offsetTop + i.node.offsetHeight;
                                (l = u - n), (n = u);
                            } else {
                                var d = i.node.getBoundingClientRect();
                                (l = d.bottom - d.top), !o && i.text.firstChild && (c = i.text.firstChild.getBoundingClientRect().right - d.left - 1);
                            }
                            var f = i.line.height - l;
                            if ((f > 0.005 || f < -0.005) && (Ye(i.line, l), Tr(i.line), i.rest)) for (var h = 0; h < i.rest.length; h++) Tr(i.rest[h]);
                            if (c > e.display.sizerWidth) {
                                var p = Math.ceil(c / ir(e.display));
                                p > e.display.maxLineLength && ((e.display.maxLineLength = p), (e.display.maxLine = i.line), (e.display.maxLineChanged = !0));
                            }
                        }
                    }
                }
                function Tr(e) {
                    if (e.widgets)
                        for (var t = 0; t < e.widgets.length; ++t) {
                            var n = e.widgets[t],
                                r = n.node.parentNode;
                            r && (n.height = r.offsetHeight);
                        }
                }
                function Dr(e, t, n) {
                    var r = n && null != n.top ? Math.max(0, n.top) : e.scroller.scrollTop;
                    r = Math.floor(r - Cn(e));
                    var i = n && null != n.bottom ? n.bottom : r + e.wrapper.clientHeight,
                        o = Je(t, r),
                        a = Je(t, i);
                    if (n && n.ensure) {
                        var s = n.ensure.from.line,
                            l = n.ensure.to.line;
                        s < o ? ((o = s), (a = Je(t, Bt(Ge(t, s)) + e.wrapper.clientHeight))) : Math.min(l, t.lastLine()) >= a && ((o = Je(t, Bt(Ge(t, l)) - e.wrapper.clientHeight)), (a = l));
                    }
                    return { from: o, to: Math.max(a, o + 1) };
                }
                function Lr(e, t) {
                    var n = e.display,
                        r = rr(e.display);
                    t.top < 0 && (t.top = 0);
                    var i = e.curOp && null != e.curOp.scrollTop ? e.curOp.scrollTop : n.scroller.scrollTop,
                        o = Dn(e),
                        a = {};
                    t.bottom - t.top > o && (t.bottom = t.top + o);
                    var s = e.doc.height + Sn(n),
                        l = t.top < r,
                        c = t.bottom > s - r;
                    if (t.top < i) a.scrollTop = l ? 0 : t.top;
                    else if (t.bottom > i + o) {
                        var u = Math.min(t.top, (c ? s : t.bottom) - o);
                        u != i && (a.scrollTop = u);
                    }
                    var d = e.options.fixedGutter ? 0 : n.gutters.offsetWidth,
                        f = e.curOp && null != e.curOp.scrollLeft ? e.curOp.scrollLeft : n.scroller.scrollLeft - d,
                        h = Tn(e) - n.gutters.offsetWidth,
                        p = t.right - t.left > h;
                    return p && (t.right = t.left + h), t.left < 10 ? (a.scrollLeft = 0) : t.left < f ? (a.scrollLeft = Math.max(0, t.left + d - (p ? 0 : 10))) : t.right > h + f - 3 && (a.scrollLeft = t.right + (p ? 0 : 10) - h), a;
                }
                function Or(e, t) {
                    null != t && (_r(e), (e.curOp.scrollTop = (null == e.curOp.scrollTop ? e.doc.scrollTop : e.curOp.scrollTop) + t));
                }
                function jr(e) {
                    _r(e);
                    var t = e.getCursor();
                    e.curOp.scrollToPos = { from: t, to: t, margin: e.options.cursorScrollMargin };
                }
                function Er(e, t, n) {
                    (null == t && null == n) || _r(e), null != t && (e.curOp.scrollLeft = t), null != n && (e.curOp.scrollTop = n);
                }
                function _r(e) {
                    var t = e.curOp.scrollToPos;
                    t && ((e.curOp.scrollToPos = null), Nr(e, Kn(e, t.from), Kn(e, t.to), t.margin));
                }
                function Nr(e, t, n, r) {
                    var i = Lr(e, { left: Math.min(t.left, n.left), top: Math.min(t.top, n.top) - r, right: Math.max(t.right, n.right), bottom: Math.max(t.bottom, n.bottom) + r });
                    Er(e, i.scrollLeft, i.scrollTop);
                }
                function Ir(e, t) {
                    Math.abs(e.doc.scrollTop - t) < 2 || (n || li(e, { top: t }), Fr(e, t, !0), n && li(e), ri(e, 100));
                }
                function Fr(e, t, n) {
                    (t = Math.max(0, Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, t))),
                        (e.display.scroller.scrollTop != t || n) && ((e.doc.scrollTop = t), e.display.scrollbars.setScrollTop(t), e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t));
                }
                function Rr(e, t, n, r) {
                    (t = Math.max(0, Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth))),
                        ((n ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) && !r) ||
                            ((e.doc.scrollLeft = t), di(e), e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t), e.display.scrollbars.setScrollLeft(t));
                }
                function zr(e) {
                    var t = e.display,
                        n = t.gutters.offsetWidth,
                        r = Math.round(e.doc.height + Sn(e.display));
                    return {
                        clientHeight: t.scroller.clientHeight,
                        viewHeight: t.wrapper.clientHeight,
                        scrollWidth: t.scroller.scrollWidth,
                        clientWidth: t.scroller.clientWidth,
                        viewWidth: t.wrapper.clientWidth,
                        barLeft: e.options.fixedGutter ? n : 0,
                        docHeight: r,
                        scrollHeight: r + Mn(e) + t.barHeight,
                        nativeBarWidth: t.nativeBarWidth,
                        gutterWidth: n,
                    };
                }
                var Wr = function (e, t, n) {
                    this.cm = n;
                    var r = (this.vert = L("div", [L("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar")),
                        i = (this.horiz = L("div", [L("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar"));
                    (r.tabIndex = i.tabIndex = -1),
                        e(r),
                        e(i),
                        de(r, "scroll", function () {
                            r.clientHeight && t(r.scrollTop, "vertical");
                        }),
                        de(i, "scroll", function () {
                            i.clientWidth && t(i.scrollLeft, "horizontal");
                        }),
                        (this.checkedZeroWidth = !1),
                        a && s < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px");
                };
                (Wr.prototype.update = function (e) {
                    var t = e.scrollWidth > e.clientWidth + 1,
                        n = e.scrollHeight > e.clientHeight + 1,
                        r = e.nativeBarWidth;
                    if (n) {
                        (this.vert.style.display = "block"), (this.vert.style.bottom = t ? r + "px" : "0");
                        var i = e.viewHeight - (t ? r : 0);
                        this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + i) + "px";
                    } else (this.vert.style.display = ""), (this.vert.firstChild.style.height = "0");
                    if (t) {
                        (this.horiz.style.display = "block"), (this.horiz.style.right = n ? r + "px" : "0"), (this.horiz.style.left = e.barLeft + "px");
                        var o = e.viewWidth - e.barLeft - (n ? r : 0);
                        this.horiz.firstChild.style.width = Math.max(0, e.scrollWidth - e.clientWidth + o) + "px";
                    } else (this.horiz.style.display = ""), (this.horiz.firstChild.style.width = "0");
                    return !this.checkedZeroWidth && e.clientHeight > 0 && (0 == r && this.zeroWidthHack(), (this.checkedZeroWidth = !0)), { right: n ? r : 0, bottom: t ? r : 0 };
                }),
                    (Wr.prototype.setScrollLeft = function (e) {
                        this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e), this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
                    }),
                    (Wr.prototype.setScrollTop = function (e) {
                        this.vert.scrollTop != e && (this.vert.scrollTop = e), this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
                    }),
                    (Wr.prototype.zeroWidthHack = function () {
                        var e = y && !h ? "12px" : "18px";
                        (this.horiz.style.height = this.vert.style.width = e), (this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none"), (this.disableHoriz = new W()), (this.disableVert = new W());
                    }),
                    (Wr.prototype.enableZeroWidthBar = function (e, t, n) {
                        (e.style.pointerEvents = "auto"),
                            t.set(1e3, function r() {
                                var i = e.getBoundingClientRect();
                                ("vert" == n ? document.elementFromPoint(i.right - 1, (i.top + i.bottom) / 2) : document.elementFromPoint((i.right + i.left) / 2, i.bottom - 1)) != e ? (e.style.pointerEvents = "none") : t.set(1e3, r);
                            });
                    }),
                    (Wr.prototype.clear = function () {
                        var e = this.horiz.parentNode;
                        e.removeChild(this.horiz), e.removeChild(this.vert);
                    });
                var $r = function () {};
                function Pr(e, t) {
                    t || (t = zr(e));
                    var n = e.display.barWidth,
                        r = e.display.barHeight;
                    Hr(e, t);
                    for (var i = 0; (i < 4 && n != e.display.barWidth) || r != e.display.barHeight; i++) n != e.display.barWidth && e.options.lineWrapping && Mr(e), Hr(e, zr(e)), (n = e.display.barWidth), (r = e.display.barHeight);
                }
                function Hr(e, t) {
                    var n = e.display,
                        r = n.scrollbars.update(t);
                    (n.sizer.style.paddingRight = (n.barWidth = r.right) + "px"),
                        (n.sizer.style.paddingBottom = (n.barHeight = r.bottom) + "px"),
                        (n.heightForcer.style.borderBottom = r.bottom + "px solid transparent"),
                        r.right && r.bottom ? ((n.scrollbarFiller.style.display = "block"), (n.scrollbarFiller.style.height = r.bottom + "px"), (n.scrollbarFiller.style.width = r.right + "px")) : (n.scrollbarFiller.style.display = ""),
                        r.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter
                            ? ((n.gutterFiller.style.display = "block"), (n.gutterFiller.style.height = r.bottom + "px"), (n.gutterFiller.style.width = t.gutterWidth + "px"))
                            : (n.gutterFiller.style.display = "");
                }
                ($r.prototype.update = function () {
                    return { bottom: 0, right: 0 };
                }),
                    ($r.prototype.setScrollLeft = function () {}),
                    ($r.prototype.setScrollTop = function () {}),
                    ($r.prototype.clear = function () {});
                var Br = { native: Wr, null: $r };
                function Vr(e) {
                    e.display.scrollbars && (e.display.scrollbars.clear(), e.display.scrollbars.addClass && M(e.display.wrapper, e.display.scrollbars.addClass)),
                        (e.display.scrollbars = new Br[e.options.scrollbarStyle](
                            function (t) {
                                e.display.wrapper.insertBefore(t, e.display.scrollbarFiller),
                                    de(t, "mousedown", function () {
                                        e.state.focused &&
                                            setTimeout(function () {
                                                return e.display.input.focus();
                                            }, 0);
                                    }),
                                    t.setAttribute("cm-not-content", "true");
                            },
                            function (t, n) {
                                "horizontal" == n ? Rr(e, t) : Ir(e, t);
                            },
                            e
                        )),
                        e.display.scrollbars.addClass && _(e.display.wrapper, e.display.scrollbars.addClass);
                }
                var Ur = 0;
                function Gr(e) {
                    var t;
                    (e.curOp = {
                        cm: e,
                        viewChanged: !1,
                        startHeight: e.doc.height,
                        forceUpdate: !1,
                        updateInput: 0,
                        typing: !1,
                        changeObjs: null,
                        cursorActivityHandlers: null,
                        cursorActivityCalled: 0,
                        selectionChanged: !1,
                        updateMaxLine: !1,
                        scrollLeft: null,
                        scrollTop: null,
                        scrollToPos: null,
                        focus: !1,
                        id: ++Ur,
                    }),
                        (t = e.curOp),
                        an ? an.ops.push(t) : (t.ownsGroup = an = { ops: [t], delayedCallbacks: [] });
                }
                function qr(e) {
                    var t = e.curOp;
                    t &&
                        (function (e, t) {
                            var n = e.ownsGroup;
                            if (n)
                                try {
                                    !(function (e) {
                                        var t = e.delayedCallbacks,
                                            n = 0;
                                        do {
                                            for (; n < t.length; n++) t[n].call(null);
                                            for (var r = 0; r < e.ops.length; r++) {
                                                var i = e.ops[r];
                                                if (i.cursorActivityHandlers) for (; i.cursorActivityCalled < i.cursorActivityHandlers.length; ) i.cursorActivityHandlers[i.cursorActivityCalled++].call(null, i.cm);
                                            }
                                        } while (n < t.length);
                                    })(n);
                                } finally {
                                    (an = null), t(n);
                                }
                        })(t, function (e) {
                            for (var t = 0; t < e.ops.length; t++) e.ops[t].cm.curOp = null;
                            !(function (e) {
                                for (var t = e.ops, n = 0; n < t.length; n++) Kr(t[n]);
                                for (var r = 0; r < t.length; r++) Yr(t[r]);
                                for (var i = 0; i < t.length; i++) Xr(t[i]);
                                for (var o = 0; o < t.length; o++) Jr(t[o]);
                                for (var a = 0; a < t.length; a++) Qr(t[a]);
                            })(e);
                        });
                }
                function Kr(e) {
                    var t = e.cm,
                        n = t.display;
                    !(function (e) {
                        var t = e.display;
                        !t.scrollbarsClipped &&
                            t.scroller.offsetWidth &&
                            ((t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth),
                            (t.heightForcer.style.height = Mn(e) + "px"),
                            (t.sizer.style.marginBottom = -t.nativeBarWidth + "px"),
                            (t.sizer.style.borderRightWidth = Mn(e) + "px"),
                            (t.scrollbarsClipped = !0));
                    })(t),
                        e.updateMaxLine && Ut(t),
                        (e.mustUpdate =
                            e.viewChanged || e.forceUpdate || null != e.scrollTop || (e.scrollToPos && (e.scrollToPos.from.line < n.viewFrom || e.scrollToPos.to.line >= n.viewTo)) || (n.maxLineChanged && t.options.lineWrapping)),
                        (e.update = e.mustUpdate && new oi(t, e.mustUpdate && { top: e.scrollTop, ensure: e.scrollToPos }, e.forceUpdate));
                }
                function Yr(e) {
                    e.updatedDisplay = e.mustUpdate && ai(e.cm, e.update);
                }
                function Xr(e) {
                    var t = e.cm,
                        n = t.display;
                    e.updatedDisplay && Mr(t),
                        (e.barMeasure = zr(t)),
                        n.maxLineChanged &&
                            !t.options.lineWrapping &&
                            ((e.adjustWidthTo = On(t, n.maxLine, n.maxLine.text.length).left + 3),
                            (t.display.sizerWidth = e.adjustWidthTo),
                            (e.barMeasure.scrollWidth = Math.max(n.scroller.clientWidth, n.sizer.offsetLeft + e.adjustWidthTo + Mn(t) + t.display.barWidth)),
                            (e.maxScrollLeft = Math.max(0, n.sizer.offsetLeft + e.adjustWidthTo - Tn(t)))),
                        (e.updatedDisplay || e.selectionChanged) && (e.preparedSelection = n.input.prepareSelection());
                }
                function Jr(e) {
                    var t = e.cm;
                    null != e.adjustWidthTo &&
                        ((t.display.sizer.style.minWidth = e.adjustWidthTo + "px"), e.maxScrollLeft < t.doc.scrollLeft && Rr(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0), (t.display.maxLineChanged = !1));
                    var n = e.focus && e.focus == E();
                    e.preparedSelection && t.display.input.showSelection(e.preparedSelection, n),
                        (e.updatedDisplay || e.startHeight != t.doc.height) && Pr(t, e.barMeasure),
                        e.updatedDisplay && ui(t, e.barMeasure),
                        e.selectionChanged && wr(t),
                        t.state.focused && e.updateInput && t.display.input.reset(e.typing),
                        n && kr(e.cm);
                }
                function Qr(e) {
                    var t = e.cm,
                        n = t.display,
                        r = t.doc;
                    e.updatedDisplay && si(t, e.update),
                        null == n.wheelStartX || (null == e.scrollTop && null == e.scrollLeft && !e.scrollToPos) || (n.wheelStartX = n.wheelStartY = null),
                        null != e.scrollTop && Fr(t, e.scrollTop, e.forceScroll),
                        null != e.scrollLeft && Rr(t, e.scrollLeft, !0, !0),
                        e.scrollToPos &&
                            (function (e, t) {
                                if (!me(e, "scrollCursorIntoView")) {
                                    var n = e.display,
                                        r = n.sizer.getBoundingClientRect(),
                                        i = null;
                                    if ((t.top + r.top < 0 ? (i = !0) : t.bottom + r.top > (window.innerHeight || document.documentElement.clientHeight) && (i = !1), null != i && !p)) {
                                        var o = L(
                                            "div",
                                            "​",
                                            null,
                                            "position: absolute;\n                         top: " +
                                                (t.top - n.viewOffset - Cn(e.display)) +
                                                "px;\n                         height: " +
                                                (t.bottom - t.top + Mn(e) + n.barHeight) +
                                                "px;\n                         left: " +
                                                t.left +
                                                "px; width: " +
                                                Math.max(2, t.right - t.left) +
                                                "px;"
                                        );
                                        e.display.lineSpace.appendChild(o), o.scrollIntoView(i), e.display.lineSpace.removeChild(o);
                                    }
                                }
                            })(
                                t,
                                (function (e, t, n, r) {
                                    var i;
                                    null == r && (r = 0), e.options.lineWrapping || t != n || (n = "before" == (t = t.ch ? et(t.line, "before" == t.sticky ? t.ch - 1 : t.ch, "after") : t).sticky ? et(t.line, t.ch + 1, "before") : t);
                                    for (var o = 0; o < 5; o++) {
                                        var a = !1,
                                            s = qn(e, t),
                                            l = n && n != t ? qn(e, n) : s,
                                            c = Lr(e, (i = { left: Math.min(s.left, l.left), top: Math.min(s.top, l.top) - r, right: Math.max(s.left, l.left), bottom: Math.max(s.bottom, l.bottom) + r })),
                                            u = e.doc.scrollTop,
                                            d = e.doc.scrollLeft;
                                        if ((null != c.scrollTop && (Ir(e, c.scrollTop), Math.abs(e.doc.scrollTop - u) > 1 && (a = !0)), null != c.scrollLeft && (Rr(e, c.scrollLeft), Math.abs(e.doc.scrollLeft - d) > 1 && (a = !0)), !a))
                                            break;
                                    }
                                    return i;
                                })(t, st(r, e.scrollToPos.from), st(r, e.scrollToPos.to), e.scrollToPos.margin)
                            );
                    var i = e.maybeHiddenMarkers,
                        o = e.maybeUnhiddenMarkers;
                    if (i) for (var a = 0; a < i.length; ++a) i[a].lines.length || pe(i[a], "hide");
                    if (o) for (var s = 0; s < o.length; ++s) o[s].lines.length && pe(o[s], "unhide");
                    n.wrapper.offsetHeight && (r.scrollTop = t.display.scroller.scrollTop), e.changeObjs && pe(t, "changes", t, e.changeObjs), e.update && e.update.finish();
                }
                function Zr(e, t) {
                    if (e.curOp) return t();
                    Gr(e);
                    try {
                        return t();
                    } finally {
                        qr(e);
                    }
                }
                function ei(e, t) {
                    return function () {
                        if (e.curOp) return t.apply(e, arguments);
                        Gr(e);
                        try {
                            return t.apply(e, arguments);
                        } finally {
                            qr(e);
                        }
                    };
                }
                function ti(e) {
                    return function () {
                        if (this.curOp) return e.apply(this, arguments);
                        Gr(this);
                        try {
                            return e.apply(this, arguments);
                        } finally {
                            qr(this);
                        }
                    };
                }
                function ni(e) {
                    return function () {
                        var t = this.cm;
                        if (!t || t.curOp) return e.apply(this, arguments);
                        Gr(t);
                        try {
                            return e.apply(this, arguments);
                        } finally {
                            qr(t);
                        }
                    };
                }
                function ri(e, t) {
                    e.doc.highlightFrontier < e.display.viewTo && e.state.highlight.set(t, F(ii, e));
                }
                function ii(e) {
                    var t = e.doc;
                    if (!(t.highlightFrontier >= e.display.viewTo)) {
                        var n = +new Date() + e.options.workTime,
                            r = ht(e, t.highlightFrontier),
                            i = [];
                        t.iter(r.line, Math.min(t.first + t.size, e.display.viewTo + 500), function (o) {
                            if (r.line >= e.display.viewFrom) {
                                var a = o.styles,
                                    s = o.text.length > e.options.maxHighlightLength ? He(t.mode, r.state) : null,
                                    l = dt(e, o, r, !0);
                                s && (r.state = s), (o.styles = l.styles);
                                var c = o.styleClasses,
                                    u = l.classes;
                                u ? (o.styleClasses = u) : c && (o.styleClasses = null);
                                for (var d = !a || a.length != o.styles.length || (c != u && (!c || !u || c.bgClass != u.bgClass || c.textClass != u.textClass)), f = 0; !d && f < a.length; ++f) d = a[f] != o.styles[f];
                                d && i.push(r.line), (o.stateAfter = r.save()), r.nextLine();
                            } else o.text.length <= e.options.maxHighlightLength && pt(e, o.text, r), (o.stateAfter = r.line % 5 == 0 ? r.save() : null), r.nextLine();
                            if (+new Date() > n) return ri(e, e.options.workDelay), !0;
                        }),
                            (t.highlightFrontier = r.line),
                            (t.modeFrontier = Math.max(t.modeFrontier, r.line)),
                            i.length &&
                                Zr(e, function () {
                                    for (var t = 0; t < i.length; t++) fr(e, i[t], "text");
                                });
                    }
                }
                var oi = function (e, t, n) {
                    var r = e.display;
                    (this.viewport = t),
                        (this.visible = Dr(r, e.doc, t)),
                        (this.editorIsHidden = !r.wrapper.offsetWidth),
                        (this.wrapperHeight = r.wrapper.clientHeight),
                        (this.wrapperWidth = r.wrapper.clientWidth),
                        (this.oldDisplayWidth = Tn(e)),
                        (this.force = n),
                        (this.dims = or(e)),
                        (this.events = []);
                };
                function ai(e, t) {
                    var n = e.display,
                        r = e.doc;
                    if (t.editorIsHidden) return hr(e), !1;
                    if (!t.force && t.visible.from >= n.viewFrom && t.visible.to <= n.viewTo && (null == n.updateLineNumbers || n.updateLineNumbers >= n.viewTo) && n.renderedView == n.view && 0 == mr(e)) return !1;
                    fi(e) && (hr(e), (t.dims = or(e)));
                    var i = r.first + r.size,
                        o = Math.max(t.visible.from - e.options.viewportMargin, r.first),
                        a = Math.min(i, t.visible.to + e.options.viewportMargin);
                    n.viewFrom < o && o - n.viewFrom < 20 && (o = Math.max(r.first, n.viewFrom)), n.viewTo > a && n.viewTo - a < 20 && (a = Math.min(i, n.viewTo)), kt && ((o = Wt(e.doc, o)), (a = $t(e.doc, a)));
                    var s = o != n.viewFrom || a != n.viewTo || n.lastWrapHeight != t.wrapperHeight || n.lastWrapWidth != t.wrapperWidth;
                    !(function (e, t, n) {
                        var r = e.display;
                        0 == r.view.length || t >= r.viewTo || n <= r.viewFrom
                            ? ((r.view = on(e, t, n)), (r.viewFrom = t))
                            : (r.viewFrom > t ? (r.view = on(e, t, r.viewFrom).concat(r.view)) : r.viewFrom < t && (r.view = r.view.slice(ur(e, t))),
                              (r.viewFrom = t),
                              r.viewTo < n ? (r.view = r.view.concat(on(e, r.viewTo, n))) : r.viewTo > n && (r.view = r.view.slice(0, ur(e, n)))),
                            (r.viewTo = n);
                    })(e, o, a),
                        (n.viewOffset = Bt(Ge(e.doc, n.viewFrom))),
                        (e.display.mover.style.top = n.viewOffset + "px");
                    var c = mr(e);
                    if (!s && 0 == c && !t.force && n.renderedView == n.view && (null == n.updateLineNumbers || n.updateLineNumbers >= n.viewTo)) return !1;
                    var u = (function (e) {
                        if (e.hasFocus()) return null;
                        var t = E();
                        if (!t || !j(e.display.lineDiv, t)) return null;
                        var n = { activeElt: t };
                        if (window.getSelection) {
                            var r = window.getSelection();
                            r.anchorNode && r.extend && j(e.display.lineDiv, r.anchorNode) && ((n.anchorNode = r.anchorNode), (n.anchorOffset = r.anchorOffset), (n.focusNode = r.focusNode), (n.focusOffset = r.focusOffset));
                        }
                        return n;
                    })(e);
                    return (
                        c > 4 && (n.lineDiv.style.display = "none"),
                        (function (e, t, n) {
                            var r = e.display,
                                i = e.options.lineNumbers,
                                o = r.lineDiv,
                                a = o.firstChild;
                            function s(t) {
                                var n = t.nextSibling;
                                return l && y && e.display.currentWheelTarget == t ? (t.style.display = "none") : t.parentNode.removeChild(t), n;
                            }
                            for (var c = r.view, u = r.viewFrom, d = 0; d < c.length; d++) {
                                var f = c[d];
                                if (f.hidden);
                                else if (f.node && f.node.parentNode == o) {
                                    for (; a != f.node; ) a = s(a);
                                    var h = i && null != t && t <= u && f.lineNumber;
                                    f.changes && ($(f.changes, "gutter") > -1 && (h = !1), un(e, f, u, n)), h && (T(f.lineNumber), f.lineNumber.appendChild(document.createTextNode(Ze(e.options, u)))), (a = f.node.nextSibling);
                                } else {
                                    var p = vn(e, f, u, n);
                                    o.insertBefore(p, a);
                                }
                                u += f.size;
                            }
                            for (; a; ) a = s(a);
                        })(e, n.updateLineNumbers, t.dims),
                        c > 4 && (n.lineDiv.style.display = ""),
                        (n.renderedView = n.view),
                        (function (e) {
                            if (e && e.activeElt && e.activeElt != E() && (e.activeElt.focus(), !/^(INPUT|TEXTAREA)$/.test(e.activeElt.nodeName) && e.anchorNode && j(document.body, e.anchorNode) && j(document.body, e.focusNode))) {
                                var t = window.getSelection(),
                                    n = document.createRange();
                                n.setEnd(e.anchorNode, e.anchorOffset), n.collapse(!1), t.removeAllRanges(), t.addRange(n), t.extend(e.focusNode, e.focusOffset);
                            }
                        })(u),
                        T(n.cursorDiv),
                        T(n.selectionDiv),
                        (n.gutters.style.height = n.sizer.style.minHeight = 0),
                        s && ((n.lastWrapHeight = t.wrapperHeight), (n.lastWrapWidth = t.wrapperWidth), ri(e, 400)),
                        (n.updateLineNumbers = null),
                        !0
                    );
                }
                function si(e, t) {
                    for (var n = t.viewport, r = !0; ; r = !1) {
                        if (r && e.options.lineWrapping && t.oldDisplayWidth != Tn(e)) r && (t.visible = Dr(e.display, e.doc, n));
                        else if ((n && null != n.top && (n = { top: Math.min(e.doc.height + Sn(e.display) - Dn(e), n.top) }), (t.visible = Dr(e.display, e.doc, n)), t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo))
                            break;
                        if (!ai(e, t)) break;
                        Mr(e);
                        var i = zr(e);
                        gr(e), Pr(e, i), ui(e, i), (t.force = !1);
                    }
                    t.signal(e, "update", e),
                        (e.display.viewFrom == e.display.reportedViewFrom && e.display.viewTo == e.display.reportedViewTo) ||
                            (t.signal(e, "viewportChange", e, e.display.viewFrom, e.display.viewTo), (e.display.reportedViewFrom = e.display.viewFrom), (e.display.reportedViewTo = e.display.viewTo));
                }
                function li(e, t) {
                    var n = new oi(e, t);
                    if (ai(e, n)) {
                        Mr(e), si(e, n);
                        var r = zr(e);
                        gr(e), Pr(e, r), ui(e, r), n.finish();
                    }
                }
                function ci(e) {
                    var t = e.gutters.offsetWidth;
                    e.sizer.style.marginLeft = t + "px";
                }
                function ui(e, t) {
                    (e.display.sizer.style.minHeight = t.docHeight + "px"), (e.display.heightForcer.style.top = t.docHeight + "px"), (e.display.gutters.style.height = t.docHeight + e.display.barHeight + Mn(e) + "px");
                }
                function di(e) {
                    var t = e.display,
                        n = t.view;
                    if (t.alignWidgets || (t.gutters.firstChild && e.options.fixedGutter)) {
                        for (var r = ar(t) - t.scroller.scrollLeft + e.doc.scrollLeft, i = t.gutters.offsetWidth, o = r + "px", a = 0; a < n.length; a++)
                            if (!n[a].hidden) {
                                e.options.fixedGutter && (n[a].gutter && (n[a].gutter.style.left = o), n[a].gutterBackground && (n[a].gutterBackground.style.left = o));
                                var s = n[a].alignable;
                                if (s) for (var l = 0; l < s.length; l++) s[l].style.left = o;
                            }
                        e.options.fixedGutter && (t.gutters.style.left = r + i + "px");
                    }
                }
                function fi(e) {
                    if (!e.options.lineNumbers) return !1;
                    var t = e.doc,
                        n = Ze(e.options, t.first + t.size - 1),
                        r = e.display;
                    if (n.length != r.lineNumChars) {
                        var i = r.measure.appendChild(L("div", [L("div", n)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
                            o = i.firstChild.offsetWidth,
                            a = i.offsetWidth - o;
                        return (
                            (r.lineGutter.style.width = ""),
                            (r.lineNumInnerWidth = Math.max(o, r.lineGutter.offsetWidth - a) + 1),
                            (r.lineNumWidth = r.lineNumInnerWidth + a),
                            (r.lineNumChars = r.lineNumInnerWidth ? n.length : -1),
                            (r.lineGutter.style.width = r.lineNumWidth + "px"),
                            ci(e.display),
                            !0
                        );
                    }
                    return !1;
                }
                function hi(e, t) {
                    for (var n = [], r = !1, i = 0; i < e.length; i++) {
                        var o = e[i],
                            a = null;
                        if (("string" != typeof o && ((a = o.style), (o = o.className)), "CodeMirror-linenumbers" == o)) {
                            if (!t) continue;
                            r = !0;
                        }
                        n.push({ className: o, style: a });
                    }
                    return t && !r && n.push({ className: "CodeMirror-linenumbers", style: null }), n;
                }
                function pi(e) {
                    var t = e.gutters,
                        n = e.gutterSpecs;
                    T(t), (e.lineGutter = null);
                    for (var r = 0; r < n.length; ++r) {
                        var i = n[r],
                            o = i.className,
                            a = i.style,
                            s = t.appendChild(L("div", null, "CodeMirror-gutter " + o));
                        a && (s.style.cssText = a), "CodeMirror-linenumbers" == o && ((e.lineGutter = s), (s.style.width = (e.lineNumWidth || 1) + "px"));
                    }
                    (t.style.display = n.length ? "" : "none"), ci(e);
                }
                function mi(e) {
                    pi(e.display), dr(e), di(e);
                }
                function gi(e, t, r, i) {
                    var o = this;
                    (this.input = r),
                        (o.scrollbarFiller = L("div", null, "CodeMirror-scrollbar-filler")),
                        o.scrollbarFiller.setAttribute("cm-not-content", "true"),
                        (o.gutterFiller = L("div", null, "CodeMirror-gutter-filler")),
                        o.gutterFiller.setAttribute("cm-not-content", "true"),
                        (o.lineDiv = O("div", null, "CodeMirror-code")),
                        (o.selectionDiv = L("div", null, null, "position: relative; z-index: 1")),
                        (o.cursorDiv = L("div", null, "CodeMirror-cursors")),
                        (o.measure = L("div", null, "CodeMirror-measure")),
                        (o.lineMeasure = L("div", null, "CodeMirror-measure")),
                        (o.lineSpace = O("div", [o.measure, o.lineMeasure, o.selectionDiv, o.cursorDiv, o.lineDiv], null, "position: relative; outline: none"));
                    var c = O("div", [o.lineSpace], "CodeMirror-lines");
                    (o.mover = L("div", [c], null, "position: relative")),
                        (o.sizer = L("div", [o.mover], "CodeMirror-sizer")),
                        (o.sizerWidth = null),
                        (o.heightForcer = L("div", null, null, "position: absolute; height: 50px; width: 1px;")),
                        (o.gutters = L("div", null, "CodeMirror-gutters")),
                        (o.lineGutter = null),
                        (o.scroller = L("div", [o.sizer, o.heightForcer, o.gutters], "CodeMirror-scroll")),
                        o.scroller.setAttribute("tabIndex", "-1"),
                        (o.wrapper = L("div", [o.scrollbarFiller, o.gutterFiller, o.scroller], "CodeMirror")),
                        a && s < 8 && ((o.gutters.style.zIndex = -1), (o.scroller.style.paddingRight = 0)),
                        l || (n && v) || (o.scroller.draggable = !0),
                        e && (e.appendChild ? e.appendChild(o.wrapper) : e(o.wrapper)),
                        (o.viewFrom = o.viewTo = t.first),
                        (o.reportedViewFrom = o.reportedViewTo = t.first),
                        (o.view = []),
                        (o.renderedView = null),
                        (o.externalMeasured = null),
                        (o.viewOffset = 0),
                        (o.lastWrapHeight = o.lastWrapWidth = 0),
                        (o.updateLineNumbers = null),
                        (o.nativeBarWidth = o.barHeight = o.barWidth = 0),
                        (o.scrollbarsClipped = !1),
                        (o.lineNumWidth = o.lineNumInnerWidth = o.lineNumChars = null),
                        (o.alignWidgets = !1),
                        (o.cachedCharWidth = o.cachedTextHeight = o.cachedPaddingH = null),
                        (o.maxLine = null),
                        (o.maxLineLength = 0),
                        (o.maxLineChanged = !1),
                        (o.wheelDX = o.wheelDY = o.wheelStartX = o.wheelStartY = null),
                        (o.shift = !1),
                        (o.selForContextMenu = null),
                        (o.activeTouch = null),
                        (o.gutterSpecs = hi(i.gutters, i.lineNumbers)),
                        pi(o),
                        r.init(o);
                }
                (oi.prototype.signal = function (e, t) {
                    ve(e, t) && this.events.push(arguments);
                }),
                    (oi.prototype.finish = function () {
                        for (var e = 0; e < this.events.length; e++) pe.apply(null, this.events[e]);
                    });
                var vi = 0,
                    yi = null;
                function bi(e) {
                    var t = e.wheelDeltaX,
                        n = e.wheelDeltaY;
                    return null == t && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail), null == n && e.detail && e.axis == e.VERTICAL_AXIS ? (n = e.detail) : null == n && (n = e.wheelDelta), { x: t, y: n };
                }
                function xi(e) {
                    var t = bi(e);
                    return (t.x *= yi), (t.y *= yi), t;
                }
                function wi(e, t) {
                    var r = bi(t),
                        i = r.x,
                        o = r.y,
                        a = e.display,
                        s = a.scroller,
                        c = s.scrollWidth > s.clientWidth,
                        u = s.scrollHeight > s.clientHeight;
                    if ((i && c) || (o && u)) {
                        if (o && y && l)
                            e: for (var f = t.target, h = a.view; f != s; f = f.parentNode)
                                for (var p = 0; p < h.length; p++)
                                    if (h[p].node == f) {
                                        e.display.currentWheelTarget = f;
                                        break e;
                                    }
                        if (i && !n && !d && null != yi) return o && u && Ir(e, Math.max(0, s.scrollTop + o * yi)), Rr(e, Math.max(0, s.scrollLeft + i * yi)), (!o || (o && u)) && be(t), void (a.wheelStartX = null);
                        if (o && null != yi) {
                            var m = o * yi,
                                g = e.doc.scrollTop,
                                v = g + a.wrapper.clientHeight;
                            m < 0 ? (g = Math.max(0, g + m - 50)) : (v = Math.min(e.doc.height, v + m + 50)), li(e, { top: g, bottom: v });
                        }
                        vi < 20 &&
                            (null == a.wheelStartX
                                ? ((a.wheelStartX = s.scrollLeft),
                                  (a.wheelStartY = s.scrollTop),
                                  (a.wheelDX = i),
                                  (a.wheelDY = o),
                                  setTimeout(function () {
                                      if (null != a.wheelStartX) {
                                          var e = s.scrollLeft - a.wheelStartX,
                                              t = s.scrollTop - a.wheelStartY,
                                              n = (t && a.wheelDY && t / a.wheelDY) || (e && a.wheelDX && e / a.wheelDX);
                                          (a.wheelStartX = a.wheelStartY = null), n && ((yi = (yi * vi + n) / (vi + 1)), ++vi);
                                      }
                                  }, 200))
                                : ((a.wheelDX += i), (a.wheelDY += o)));
                    }
                }
                a ? (yi = -0.53) : n ? (yi = 15) : u ? (yi = -0.7) : f && (yi = -1 / 3);
                var ki = function (e, t) {
                    (this.ranges = e), (this.primIndex = t);
                };
                (ki.prototype.primary = function () {
                    return this.ranges[this.primIndex];
                }),
                    (ki.prototype.equals = function (e) {
                        if (e == this) return !0;
                        if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length) return !1;
                        for (var t = 0; t < this.ranges.length; t++) {
                            var n = this.ranges[t],
                                r = e.ranges[t];
                            if (!nt(n.anchor, r.anchor) || !nt(n.head, r.head)) return !1;
                        }
                        return !0;
                    }),
                    (ki.prototype.deepCopy = function () {
                        for (var e = [], t = 0; t < this.ranges.length; t++) e[t] = new Ci(rt(this.ranges[t].anchor), rt(this.ranges[t].head));
                        return new ki(e, this.primIndex);
                    }),
                    (ki.prototype.somethingSelected = function () {
                        for (var e = 0; e < this.ranges.length; e++) if (!this.ranges[e].empty()) return !0;
                        return !1;
                    }),
                    (ki.prototype.contains = function (e, t) {
                        t || (t = e);
                        for (var n = 0; n < this.ranges.length; n++) {
                            var r = this.ranges[n];
                            if (tt(t, r.from()) >= 0 && tt(e, r.to()) <= 0) return n;
                        }
                        return -1;
                    });
                var Ci = function (e, t) {
                    (this.anchor = e), (this.head = t);
                };
                function Si(e, t, n) {
                    var r = e && e.options.selectionsMayTouch,
                        i = t[n];
                    t.sort(function (e, t) {
                        return tt(e.from(), t.from());
                    }),
                        (n = $(t, i));
                    for (var o = 1; o < t.length; o++) {
                        var a = t[o],
                            s = t[o - 1],
                            l = tt(s.to(), a.from());
                        if (r && !a.empty() ? l > 0 : l >= 0) {
                            var c = ot(s.from(), a.from()),
                                u = it(s.to(), a.to()),
                                d = s.empty() ? a.from() == a.head : s.from() == s.head;
                            o <= n && --n, t.splice(--o, 2, new Ci(d ? u : c, d ? c : u));
                        }
                    }
                    return new ki(t, n);
                }
                function Ai(e, t) {
                    return new ki([new Ci(e, t || e)], 0);
                }
                function Mi(e) {
                    return e.text ? et(e.from.line + e.text.length - 1, K(e.text).length + (1 == e.text.length ? e.from.ch : 0)) : e.to;
                }
                function Ti(e, t) {
                    if (tt(e, t.from) < 0) return e;
                    if (tt(e, t.to) <= 0) return Mi(t);
                    var n = e.line + t.text.length - (t.to.line - t.from.line) - 1,
                        r = e.ch;
                    return e.line == t.to.line && (r += Mi(t).ch - t.to.ch), et(n, r);
                }
                function Di(e, t) {
                    for (var n = [], r = 0; r < e.sel.ranges.length; r++) {
                        var i = e.sel.ranges[r];
                        n.push(new Ci(Ti(i.anchor, t), Ti(i.head, t)));
                    }
                    return Si(e.cm, n, e.sel.primIndex);
                }
                function Li(e, t, n) {
                    return e.line == t.line ? et(n.line, e.ch - t.ch + n.ch) : et(n.line + (e.line - t.line), e.ch);
                }
                function Oi(e) {
                    (e.doc.mode = We(e.options, e.doc.modeOption)), ji(e);
                }
                function ji(e) {
                    e.doc.iter(function (e) {
                        e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null);
                    }),
                        (e.doc.modeFrontier = e.doc.highlightFrontier = e.doc.first),
                        ri(e, 100),
                        e.state.modeGen++,
                        e.curOp && dr(e);
                }
                function Ei(e, t) {
                    return 0 == t.from.ch && 0 == t.to.ch && "" == K(t.text) && (!e.cm || e.cm.options.wholeLineUpdateBefore);
                }
                function _i(e, t, n, r) {
                    function i(e) {
                        return n ? n[e] : null;
                    }
                    function o(e, n, i) {
                        !(function (e, t, n, r) {
                            (e.text = t), e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null), null != e.order && (e.order = null), Dt(e), Lt(e, n);
                            var i = r ? r(e) : 1;
                            i != e.height && Ye(e, i);
                        })(e, n, i, r),
                            ln(e, "change", e, t);
                    }
                    function a(e, t) {
                        for (var n = [], o = e; o < t; ++o) n.push(new Gt(c[o], i(o), r));
                        return n;
                    }
                    var s = t.from,
                        l = t.to,
                        c = t.text,
                        u = Ge(e, s.line),
                        d = Ge(e, l.line),
                        f = K(c),
                        h = i(c.length - 1),
                        p = l.line - s.line;
                    if (t.full) e.insert(0, a(0, c.length)), e.remove(c.length, e.size - c.length);
                    else if (Ei(e, t)) {
                        var m = a(0, c.length - 1);
                        o(d, d.text, h), p && e.remove(s.line, p), m.length && e.insert(s.line, m);
                    } else if (u == d)
                        if (1 == c.length) o(u, u.text.slice(0, s.ch) + f + u.text.slice(l.ch), h);
                        else {
                            var g = a(1, c.length - 1);
                            g.push(new Gt(f + u.text.slice(l.ch), h, r)), o(u, u.text.slice(0, s.ch) + c[0], i(0)), e.insert(s.line + 1, g);
                        }
                    else if (1 == c.length) o(u, u.text.slice(0, s.ch) + c[0] + d.text.slice(l.ch), i(0)), e.remove(s.line + 1, p);
                    else {
                        o(u, u.text.slice(0, s.ch) + c[0], i(0)), o(d, f + d.text.slice(l.ch), h);
                        var v = a(1, c.length - 1);
                        p > 1 && e.remove(s.line + 1, p - 1), e.insert(s.line + 1, v);
                    }
                    ln(e, "change", e, t);
                }
                function Ni(e, t, n) {
                    !(function e(r, i, o) {
                        if (r.linked)
                            for (var a = 0; a < r.linked.length; ++a) {
                                var s = r.linked[a];
                                if (s.doc != i) {
                                    var l = o && s.sharedHist;
                                    (n && !l) || (t(s.doc, l), e(s.doc, r, l));
                                }
                            }
                    })(e, null, !0);
                }
                function Ii(e, t) {
                    if (t.cm) throw new Error("This document is already in use.");
                    (e.doc = t), (t.cm = e), lr(e), Oi(e), Fi(e), e.options.lineWrapping || Ut(e), (e.options.mode = t.modeOption), dr(e);
                }
                function Fi(e) {
                    ("rtl" == e.doc.direction ? _ : M)(e.display.lineDiv, "CodeMirror-rtl");
                }
                function Ri(e) {
                    (this.done = []),
                        (this.undone = []),
                        (this.undoDepth = e ? e.undoDepth : 1 / 0),
                        (this.lastModTime = this.lastSelTime = 0),
                        (this.lastOp = this.lastSelOp = null),
                        (this.lastOrigin = this.lastSelOrigin = null),
                        (this.generation = this.maxGeneration = e ? e.maxGeneration : 1);
                }
                function zi(e, t) {
                    var n = { from: rt(t.from), to: Mi(t), text: qe(e, t.from, t.to) };
                    return (
                        Bi(e, n, t.from.line, t.to.line + 1),
                        Ni(
                            e,
                            function (e) {
                                return Bi(e, n, t.from.line, t.to.line + 1);
                            },
                            !0
                        ),
                        n
                    );
                }
                function Wi(e) {
                    for (; e.length && K(e).ranges; ) e.pop();
                }
                function $i(e, t, n, r) {
                    var i = e.history;
                    i.undone.length = 0;
                    var o,
                        a,
                        s = +new Date();
                    if (
                        (i.lastOp == r || (i.lastOrigin == t.origin && t.origin && (("+" == t.origin.charAt(0) && i.lastModTime > s - (e.cm ? e.cm.options.historyEventDelay : 500)) || "*" == t.origin.charAt(0)))) &&
                        (o = (function (e, t) {
                            return t ? (Wi(e.done), K(e.done)) : e.done.length && !K(e.done).ranges ? K(e.done) : e.done.length > 1 && !e.done[e.done.length - 2].ranges ? (e.done.pop(), K(e.done)) : void 0;
                        })(i, i.lastOp == r))
                    )
                        (a = K(o.changes)), 0 == tt(t.from, t.to) && 0 == tt(t.from, a.to) ? (a.to = Mi(t)) : o.changes.push(zi(e, t));
                    else {
                        var l = K(i.done);
                        for ((l && l.ranges) || Hi(e.sel, i.done), o = { changes: [zi(e, t)], generation: i.generation }, i.done.push(o); i.done.length > i.undoDepth; ) i.done.shift(), i.done[0].ranges || i.done.shift();
                    }
                    i.done.push(n), (i.generation = ++i.maxGeneration), (i.lastModTime = i.lastSelTime = s), (i.lastOp = i.lastSelOp = r), (i.lastOrigin = i.lastSelOrigin = t.origin), a || pe(e, "historyAdded");
                }
                function Pi(e, t, n, r) {
                    var i = e.history,
                        o = r && r.origin;
                    n == i.lastSelOp ||
                    (o &&
                        i.lastSelOrigin == o &&
                        ((i.lastModTime == i.lastSelTime && i.lastOrigin == o) ||
                            (function (e, t, n, r) {
                                var i = t.charAt(0);
                                return "*" == i || ("+" == i && n.ranges.length == r.ranges.length && n.somethingSelected() == r.somethingSelected() && new Date() - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500));
                            })(e, o, K(i.done), t)))
                        ? (i.done[i.done.length - 1] = t)
                        : Hi(t, i.done),
                        (i.lastSelTime = +new Date()),
                        (i.lastSelOrigin = o),
                        (i.lastSelOp = n),
                        r && !1 !== r.clearRedo && Wi(i.undone);
                }
                function Hi(e, t) {
                    var n = K(t);
                    (n && n.ranges && n.equals(e)) || t.push(e);
                }
                function Bi(e, t, n, r) {
                    var i = t["spans_" + e.id],
                        o = 0;
                    e.iter(Math.max(e.first, n), Math.min(e.first + e.size, r), function (n) {
                        n.markedSpans && ((i || (i = t["spans_" + e.id] = {}))[o] = n.markedSpans), ++o;
                    });
                }
                function Vi(e) {
                    if (!e) return null;
                    for (var t, n = 0; n < e.length; ++n) e[n].marker.explicitlyCleared ? t || (t = e.slice(0, n)) : t && t.push(e[n]);
                    return t ? (t.length ? t : null) : e;
                }
                function Ui(e, t) {
                    var n = (function (e, t) {
                            var n = t["spans_" + e.id];
                            if (!n) return null;
                            for (var r = [], i = 0; i < t.text.length; ++i) r.push(Vi(n[i]));
                            return r;
                        })(e, t),
                        r = Mt(e, t);
                    if (!n) return r;
                    if (!r) return n;
                    for (var i = 0; i < n.length; ++i) {
                        var o = n[i],
                            a = r[i];
                        if (o && a)
                            e: for (var s = 0; s < a.length; ++s) {
                                for (var l = a[s], c = 0; c < o.length; ++c) if (o[c].marker == l.marker) continue e;
                                o.push(l);
                            }
                        else a && (n[i] = a);
                    }
                    return n;
                }
                function Gi(e, t, n) {
                    for (var r = [], i = 0; i < e.length; ++i) {
                        var o = e[i];
                        if (o.ranges) r.push(n ? ki.prototype.deepCopy.call(o) : o);
                        else {
                            var a = o.changes,
                                s = [];
                            r.push({ changes: s });
                            for (var l = 0; l < a.length; ++l) {
                                var c = a[l],
                                    u = void 0;
                                if ((s.push({ from: c.from, to: c.to, text: c.text }), t)) for (var d in c) (u = d.match(/^spans_(\d+)$/)) && $(t, Number(u[1])) > -1 && ((K(s)[d] = c[d]), delete c[d]);
                            }
                        }
                    }
                    return r;
                }
                function qi(e, t, n, r) {
                    if (r) {
                        var i = e.anchor;
                        if (n) {
                            var o = tt(t, i) < 0;
                            o != tt(n, i) < 0 ? ((i = t), (t = n)) : o != tt(t, n) < 0 && (t = n);
                        }
                        return new Ci(i, t);
                    }
                    return new Ci(n || t, t);
                }
                function Ki(e, t, n, r, i) {
                    null == i && (i = e.cm && (e.cm.display.shift || e.extend)), Zi(e, new ki([qi(e.sel.primary(), t, n, i)], 0), r);
                }
                function Yi(e, t, n) {
                    for (var r = [], i = e.cm && (e.cm.display.shift || e.extend), o = 0; o < e.sel.ranges.length; o++) r[o] = qi(e.sel.ranges[o], t[o], null, i);
                    Zi(e, Si(e.cm, r, e.sel.primIndex), n);
                }
                function Xi(e, t, n, r) {
                    var i = e.sel.ranges.slice(0);
                    (i[t] = n), Zi(e, Si(e.cm, i, e.sel.primIndex), r);
                }
                function Ji(e, t, n, r) {
                    Zi(e, Ai(t, n), r);
                }
                function Qi(e, t, n) {
                    var r = e.history.done,
                        i = K(r);
                    i && i.ranges ? ((r[r.length - 1] = t), eo(e, t, n)) : Zi(e, t, n);
                }
                function Zi(e, t, n) {
                    eo(e, t, n), Pi(e, e.sel, e.cm ? e.cm.curOp.id : NaN, n);
                }
                function eo(e, t, n) {
                    (ve(e, "beforeSelectionChange") || (e.cm && ve(e.cm, "beforeSelectionChange"))) &&
                        (t = (function (e, t, n) {
                            var r = {
                                ranges: t.ranges,
                                update: function (t) {
                                    this.ranges = [];
                                    for (var n = 0; n < t.length; n++) this.ranges[n] = new Ci(st(e, t[n].anchor), st(e, t[n].head));
                                },
                                origin: n && n.origin,
                            };
                            return pe(e, "beforeSelectionChange", e, r), e.cm && pe(e.cm, "beforeSelectionChange", e.cm, r), r.ranges != t.ranges ? Si(e.cm, r.ranges, r.ranges.length - 1) : t;
                        })(e, t, n));
                    var r = (n && n.bias) || (tt(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
                    to(e, ro(e, t, r, !0)), (n && !1 === n.scroll) || !e.cm || "nocursor" == e.cm.getOption("readOnly") || jr(e.cm);
                }
                function to(e, t) {
                    t.equals(e.sel) || ((e.sel = t), e.cm && ((e.cm.curOp.updateInput = 1), (e.cm.curOp.selectionChanged = !0), ge(e.cm)), ln(e, "cursorActivity", e));
                }
                function no(e) {
                    to(e, ro(e, e.sel, null, !1));
                }
                function ro(e, t, n, r) {
                    for (var i, o = 0; o < t.ranges.length; o++) {
                        var a = t.ranges[o],
                            s = t.ranges.length == e.sel.ranges.length && e.sel.ranges[o],
                            l = oo(e, a.anchor, s && s.anchor, n, r),
                            c = oo(e, a.head, s && s.head, n, r);
                        (i || l != a.anchor || c != a.head) && (i || (i = t.ranges.slice(0, o)), (i[o] = new Ci(l, c)));
                    }
                    return i ? Si(e.cm, i, t.primIndex) : t;
                }
                function io(e, t, n, r, i) {
                    var o = Ge(e, t.line);
                    if (o.markedSpans)
                        for (var a = 0; a < o.markedSpans.length; ++a) {
                            var s = o.markedSpans[a],
                                l = s.marker,
                                c = "selectLeft" in l ? !l.selectLeft : l.inclusiveLeft,
                                u = "selectRight" in l ? !l.selectRight : l.inclusiveRight;
                            if ((null == s.from || (c ? s.from <= t.ch : s.from < t.ch)) && (null == s.to || (u ? s.to >= t.ch : s.to > t.ch))) {
                                if (i && (pe(l, "beforeCursorEnter"), l.explicitlyCleared)) {
                                    if (o.markedSpans) {
                                        --a;
                                        continue;
                                    }
                                    break;
                                }
                                if (!l.atomic) continue;
                                if (n) {
                                    var d = l.find(r < 0 ? 1 : -1),
                                        f = void 0;
                                    if (((r < 0 ? u : c) && (d = ao(e, d, -r, d && d.line == t.line ? o : null)), d && d.line == t.line && (f = tt(d, n)) && (r < 0 ? f < 0 : f > 0))) return io(e, d, t, r, i);
                                }
                                var h = l.find(r < 0 ? -1 : 1);
                                return (r < 0 ? c : u) && (h = ao(e, h, r, h.line == t.line ? o : null)), h ? io(e, h, t, r, i) : null;
                            }
                        }
                    return t;
                }
                function oo(e, t, n, r, i) {
                    var o = r || 1,
                        a = io(e, t, n, o, i) || (!i && io(e, t, n, o, !0)) || io(e, t, n, -o, i) || (!i && io(e, t, n, -o, !0));
                    return a || ((e.cantEdit = !0), et(e.first, 0));
                }
                function ao(e, t, n, r) {
                    return n < 0 && 0 == t.ch ? (t.line > e.first ? st(e, et(t.line - 1)) : null) : n > 0 && t.ch == (r || Ge(e, t.line)).text.length ? (t.line < e.first + e.size - 1 ? et(t.line + 1, 0) : null) : new et(t.line, t.ch + n);
                }
                function so(e) {
                    e.setSelection(et(e.firstLine(), 0), et(e.lastLine()), H);
                }
                function lo(e, t, n) {
                    var r = {
                        canceled: !1,
                        from: t.from,
                        to: t.to,
                        text: t.text,
                        origin: t.origin,
                        cancel: function () {
                            return (r.canceled = !0);
                        },
                    };
                    return (
                        n &&
                            (r.update = function (t, n, i, o) {
                                t && (r.from = st(e, t)), n && (r.to = st(e, n)), i && (r.text = i), void 0 !== o && (r.origin = o);
                            }),
                        pe(e, "beforeChange", e, r),
                        e.cm && pe(e.cm, "beforeChange", e.cm, r),
                        r.canceled ? (e.cm && (e.cm.curOp.updateInput = 2), null) : { from: r.from, to: r.to, text: r.text, origin: r.origin }
                    );
                }
                function co(e, t, n) {
                    if (e.cm) {
                        if (!e.cm.curOp) return ei(e.cm, co)(e, t, n);
                        if (e.cm.state.suppressEdits) return;
                    }
                    if (!(ve(e, "beforeChange") || (e.cm && ve(e.cm, "beforeChange"))) || (t = lo(e, t, !0))) {
                        var r =
                            wt &&
                            !n &&
                            (function (e, t, n) {
                                var r = null;
                                if (
                                    (e.iter(t.line, n.line + 1, function (e) {
                                        if (e.markedSpans)
                                            for (var t = 0; t < e.markedSpans.length; ++t) {
                                                var n = e.markedSpans[t].marker;
                                                !n.readOnly || (r && -1 != $(r, n)) || (r || (r = [])).push(n);
                                            }
                                    }),
                                    !r)
                                )
                                    return null;
                                for (var i = [{ from: t, to: n }], o = 0; o < r.length; ++o)
                                    for (var a = r[o], s = a.find(0), l = 0; l < i.length; ++l) {
                                        var c = i[l];
                                        if (!(tt(c.to, s.from) < 0 || tt(c.from, s.to) > 0)) {
                                            var u = [l, 1],
                                                d = tt(c.from, s.from),
                                                f = tt(c.to, s.to);
                                            (d < 0 || (!a.inclusiveLeft && !d)) && u.push({ from: c.from, to: s.from }), (f > 0 || (!a.inclusiveRight && !f)) && u.push({ from: s.to, to: c.to }), i.splice.apply(i, u), (l += u.length - 3);
                                        }
                                    }
                                return i;
                            })(e, t.from, t.to);
                        if (r) for (var i = r.length - 1; i >= 0; --i) uo(e, { from: r[i].from, to: r[i].to, text: i ? [""] : t.text, origin: t.origin });
                        else uo(e, t);
                    }
                }
                function uo(e, t) {
                    if (1 != t.text.length || "" != t.text[0] || 0 != tt(t.from, t.to)) {
                        var n = Di(e, t);
                        $i(e, t, n, e.cm ? e.cm.curOp.id : NaN), po(e, t, n, Mt(e, t));
                        var r = [];
                        Ni(e, function (e, n) {
                            n || -1 != $(r, e.history) || (yo(e.history, t), r.push(e.history)), po(e, t, null, Mt(e, t));
                        });
                    }
                }
                function fo(e, t, n) {
                    var r = e.cm && e.cm.state.suppressEdits;
                    if (!r || n) {
                        for (var i, o = e.history, a = e.sel, s = "undo" == t ? o.done : o.undone, l = "undo" == t ? o.undone : o.done, c = 0; c < s.length && ((i = s[c]), n ? !i.ranges || i.equals(e.sel) : i.ranges); c++);
                        if (c != s.length) {
                            for (o.lastOrigin = o.lastSelOrigin = null; ; ) {
                                if (!(i = s.pop()).ranges) {
                                    if (r) return void s.push(i);
                                    break;
                                }
                                if ((Hi(i, l), n && !i.equals(e.sel))) return void Zi(e, i, { clearRedo: !1 });
                                a = i;
                            }
                            var u = [];
                            Hi(a, l), l.push({ changes: u, generation: o.generation }), (o.generation = i.generation || ++o.maxGeneration);
                            for (
                                var d = ve(e, "beforeChange") || (e.cm && ve(e.cm, "beforeChange")),
                                    f = function (n) {
                                        var r = i.changes[n];
                                        if (((r.origin = t), d && !lo(e, r, !1))) return (s.length = 0), {};
                                        u.push(zi(e, r));
                                        var o = n ? Di(e, r) : K(s);
                                        po(e, r, o, Ui(e, r)), !n && e.cm && e.cm.scrollIntoView({ from: r.from, to: Mi(r) });
                                        var a = [];
                                        Ni(e, function (e, t) {
                                            t || -1 != $(a, e.history) || (yo(e.history, r), a.push(e.history)), po(e, r, null, Ui(e, r));
                                        });
                                    },
                                    h = i.changes.length - 1;
                                h >= 0;
                                --h
                            ) {
                                var p = f(h);
                                if (p) return p.v;
                            }
                        }
                    }
                }
                function ho(e, t) {
                    if (
                        0 != t &&
                        ((e.first += t),
                        (e.sel = new ki(
                            Y(e.sel.ranges, function (e) {
                                return new Ci(et(e.anchor.line + t, e.anchor.ch), et(e.head.line + t, e.head.ch));
                            }),
                            e.sel.primIndex
                        )),
                        e.cm)
                    ) {
                        dr(e.cm, e.first, e.first - t, t);
                        for (var n = e.cm.display, r = n.viewFrom; r < n.viewTo; r++) fr(e.cm, r, "gutter");
                    }
                }
                function po(e, t, n, r) {
                    if (e.cm && !e.cm.curOp) return ei(e.cm, po)(e, t, n, r);
                    if (t.to.line < e.first) ho(e, t.text.length - 1 - (t.to.line - t.from.line));
                    else if (!(t.from.line > e.lastLine())) {
                        if (t.from.line < e.first) {
                            var i = t.text.length - 1 - (e.first - t.from.line);
                            ho(e, i), (t = { from: et(e.first, 0), to: et(t.to.line + i, t.to.ch), text: [K(t.text)], origin: t.origin });
                        }
                        var o = e.lastLine();
                        t.to.line > o && (t = { from: t.from, to: et(o, Ge(e, o).text.length), text: [t.text[0]], origin: t.origin }),
                            (t.removed = qe(e, t.from, t.to)),
                            n || (n = Di(e, t)),
                            e.cm
                                ? (function (e, t, n) {
                                      var r = e.doc,
                                          i = e.display,
                                          o = t.from,
                                          a = t.to,
                                          s = !1,
                                          l = o.line;
                                      e.options.lineWrapping ||
                                          ((l = Xe(zt(Ge(r, o.line)))),
                                          r.iter(l, a.line + 1, function (e) {
                                              if (e == i.maxLine) return (s = !0), !0;
                                          })),
                                          r.sel.contains(t.from, t.to) > -1 && ge(e),
                                          _i(r, t, n, sr(e)),
                                          e.options.lineWrapping ||
                                              (r.iter(l, o.line + t.text.length, function (e) {
                                                  var t = Vt(e);
                                                  t > i.maxLineLength && ((i.maxLine = e), (i.maxLineLength = t), (i.maxLineChanged = !0), (s = !1));
                                              }),
                                              s && (e.curOp.updateMaxLine = !0)),
                                          (function (e, t) {
                                              if (((e.modeFrontier = Math.min(e.modeFrontier, t)), !(e.highlightFrontier < t - 10))) {
                                                  for (var n = e.first, r = t - 1; r > n; r--) {
                                                      var i = Ge(e, r).stateAfter;
                                                      if (i && (!(i instanceof ct) || r + i.lookAhead < t)) {
                                                          n = r + 1;
                                                          break;
                                                      }
                                                  }
                                                  e.highlightFrontier = Math.min(e.highlightFrontier, n);
                                              }
                                          })(r, o.line),
                                          ri(e, 400);
                                      var c = t.text.length - (a.line - o.line) - 1;
                                      t.full ? dr(e) : o.line != a.line || 1 != t.text.length || Ei(e.doc, t) ? dr(e, o.line, a.line + 1, c) : fr(e, o.line, "text");
                                      var u = ve(e, "changes"),
                                          d = ve(e, "change");
                                      if (d || u) {
                                          var f = { from: o, to: a, text: t.text, removed: t.removed, origin: t.origin };
                                          d && ln(e, "change", e, f), u && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(f);
                                      }
                                      e.display.selForContextMenu = null;
                                  })(e.cm, t, r)
                                : _i(e, t, r),
                            eo(e, n, H),
                            e.cantEdit && oo(e, et(e.firstLine(), 0)) && (e.cantEdit = !1);
                    }
                }
                function mo(e, t, n, r, i) {
                    var o;
                    r || (r = n), tt(r, n) < 0 && ((n = (o = [r, n])[0]), (r = o[1])), "string" == typeof t && (t = e.splitLines(t)), co(e, { from: n, to: r, text: t, origin: i });
                }
                function go(e, t, n, r) {
                    n < e.line ? (e.line += r) : t < e.line && ((e.line = t), (e.ch = 0));
                }
                function vo(e, t, n, r) {
                    for (var i = 0; i < e.length; ++i) {
                        var o = e[i],
                            a = !0;
                        if (o.ranges) {
                            o.copied || ((o = e[i] = o.deepCopy()).copied = !0);
                            for (var s = 0; s < o.ranges.length; s++) go(o.ranges[s].anchor, t, n, r), go(o.ranges[s].head, t, n, r);
                        } else {
                            for (var l = 0; l < o.changes.length; ++l) {
                                var c = o.changes[l];
                                if (n < c.from.line) (c.from = et(c.from.line + r, c.from.ch)), (c.to = et(c.to.line + r, c.to.ch));
                                else if (t <= c.to.line) {
                                    a = !1;
                                    break;
                                }
                            }
                            a || (e.splice(0, i + 1), (i = 0));
                        }
                    }
                }
                function yo(e, t) {
                    var n = t.from.line,
                        r = t.to.line,
                        i = t.text.length - (r - n) - 1;
                    vo(e.done, n, r, i), vo(e.undone, n, r, i);
                }
                function bo(e, t, n, r) {
                    var i = t,
                        o = t;
                    return "number" == typeof t ? (o = Ge(e, at(e, t))) : (i = Xe(t)), null == i ? null : (r(o, i) && e.cm && fr(e.cm, i, n), o);
                }
                function xo(e) {
                    (this.lines = e), (this.parent = null);
                    for (var t = 0, n = 0; n < e.length; ++n) (e[n].parent = this), (t += e[n].height);
                    this.height = t;
                }
                function wo(e) {
                    this.children = e;
                    for (var t = 0, n = 0, r = 0; r < e.length; ++r) {
                        var i = e[r];
                        (t += i.chunkSize()), (n += i.height), (i.parent = this);
                    }
                    (this.size = t), (this.height = n), (this.parent = null);
                }
                (Ci.prototype.from = function () {
                    return ot(this.anchor, this.head);
                }),
                    (Ci.prototype.to = function () {
                        return it(this.anchor, this.head);
                    }),
                    (Ci.prototype.empty = function () {
                        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
                    }),
                    (xo.prototype = {
                        chunkSize: function () {
                            return this.lines.length;
                        },
                        removeInner: function (e, t) {
                            for (var n = e, r = e + t; n < r; ++n) {
                                var i = this.lines[n];
                                (this.height -= i.height), qt(i), ln(i, "delete");
                            }
                            this.lines.splice(e, t);
                        },
                        collapse: function (e) {
                            e.push.apply(e, this.lines);
                        },
                        insertInner: function (e, t, n) {
                            (this.height += n), (this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e)));
                            for (var r = 0; r < t.length; ++r) t[r].parent = this;
                        },
                        iterN: function (e, t, n) {
                            for (var r = e + t; e < r; ++e) if (n(this.lines[e])) return !0;
                        },
                    }),
                    (wo.prototype = {
                        chunkSize: function () {
                            return this.size;
                        },
                        removeInner: function (e, t) {
                            this.size -= t;
                            for (var n = 0; n < this.children.length; ++n) {
                                var r = this.children[n],
                                    i = r.chunkSize();
                                if (e < i) {
                                    var o = Math.min(t, i - e),
                                        a = r.height;
                                    if ((r.removeInner(e, o), (this.height -= a - r.height), i == o && (this.children.splice(n--, 1), (r.parent = null)), 0 == (t -= o))) break;
                                    e = 0;
                                } else e -= i;
                            }
                            if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0] instanceof xo))) {
                                var s = [];
                                this.collapse(s), (this.children = [new xo(s)]), (this.children[0].parent = this);
                            }
                        },
                        collapse: function (e) {
                            for (var t = 0; t < this.children.length; ++t) this.children[t].collapse(e);
                        },
                        insertInner: function (e, t, n) {
                            (this.size += t.length), (this.height += n);
                            for (var r = 0; r < this.children.length; ++r) {
                                var i = this.children[r],
                                    o = i.chunkSize();
                                if (e <= o) {
                                    if ((i.insertInner(e, t, n), i.lines && i.lines.length > 50)) {
                                        for (var a = (i.lines.length % 25) + 25, s = a; s < i.lines.length; ) {
                                            var l = new xo(i.lines.slice(s, (s += 25)));
                                            (i.height -= l.height), this.children.splice(++r, 0, l), (l.parent = this);
                                        }
                                        (i.lines = i.lines.slice(0, a)), this.maybeSpill();
                                    }
                                    break;
                                }
                                e -= o;
                            }
                        },
                        maybeSpill: function () {
                            if (!(this.children.length <= 10)) {
                                var e = this;
                                do {
                                    var t = new wo(e.children.splice(e.children.length - 5, 5));
                                    if (e.parent) {
                                        (e.size -= t.size), (e.height -= t.height);
                                        var n = $(e.parent.children, e);
                                        e.parent.children.splice(n + 1, 0, t);
                                    } else {
                                        var r = new wo(e.children);
                                        (r.parent = e), (e.children = [r, t]), (e = r);
                                    }
                                    t.parent = e.parent;
                                } while (e.children.length > 10);
                                e.parent.maybeSpill();
                            }
                        },
                        iterN: function (e, t, n) {
                            for (var r = 0; r < this.children.length; ++r) {
                                var i = this.children[r],
                                    o = i.chunkSize();
                                if (e < o) {
                                    var a = Math.min(t, o - e);
                                    if (i.iterN(e, a, n)) return !0;
                                    if (0 == (t -= a)) break;
                                    e = 0;
                                } else e -= o;
                            }
                        },
                    });
                var ko = function (e, t, n) {
                    if (n) for (var r in n) n.hasOwnProperty(r) && (this[r] = n[r]);
                    (this.doc = e), (this.node = t);
                };
                function Co(e, t, n) {
                    Bt(t) < ((e.curOp && e.curOp.scrollTop) || e.doc.scrollTop) && Or(e, n);
                }
                (ko.prototype.clear = function () {
                    var e = this.doc.cm,
                        t = this.line.widgets,
                        n = this.line,
                        r = Xe(n);
                    if (null != r && t) {
                        for (var i = 0; i < t.length; ++i) t[i] == this && t.splice(i--, 1);
                        t.length || (n.widgets = null);
                        var o = wn(this);
                        Ye(n, Math.max(0, n.height - o)),
                            e &&
                                (Zr(e, function () {
                                    Co(e, n, -o), fr(e, r, "widget");
                                }),
                                ln(e, "lineWidgetCleared", e, this, r));
                    }
                }),
                    (ko.prototype.changed = function () {
                        var e = this,
                            t = this.height,
                            n = this.doc.cm,
                            r = this.line;
                        this.height = null;
                        var i = wn(this) - t;
                        i &&
                            (Pt(this.doc, r) || Ye(r, r.height + i),
                            n &&
                                Zr(n, function () {
                                    (n.curOp.forceUpdate = !0), Co(n, r, i), ln(n, "lineWidgetChanged", n, e, Xe(r));
                                }));
                    }),
                    ye(ko);
                var So = 0,
                    Ao = function (e, t) {
                        (this.lines = []), (this.type = t), (this.doc = e), (this.id = ++So);
                    };
                function Mo(e, t, n, r, i) {
                    if (r && r.shared)
                        return (function (e, t, n, r, i) {
                            (r = R(r)).shared = !1;
                            var o = [Mo(e, t, n, r, i)],
                                a = o[0],
                                s = r.widgetNode;
                            return (
                                Ni(e, function (e) {
                                    s && (r.widgetNode = s.cloneNode(!0)), o.push(Mo(e, st(e, t), st(e, n), r, i));
                                    for (var l = 0; l < e.linked.length; ++l) if (e.linked[l].isParent) return;
                                    a = K(o);
                                }),
                                new To(o, a)
                            );
                        })(e, t, n, r, i);
                    if (e.cm && !e.cm.curOp) return ei(e.cm, Mo)(e, t, n, r, i);
                    var o = new Ao(e, i),
                        a = tt(t, n);
                    if ((r && R(r, o, !1), a > 0 || (0 == a && !1 !== o.clearWhenEmpty))) return o;
                    if (
                        (o.replacedWith &&
                            ((o.collapsed = !0),
                            (o.widgetNode = O("span", [o.replacedWith], "CodeMirror-widget")),
                            r.handleMouseEvents || o.widgetNode.setAttribute("cm-ignore-events", "true"),
                            r.insertLeft && (o.widgetNode.insertLeft = !0)),
                        o.collapsed)
                    ) {
                        if (Rt(e, t.line, t, n, o) || (t.line != n.line && Rt(e, n.line, t, n, o))) throw new Error("Inserting collapsed marker partially overlapping an existing one");
                        kt = !0;
                    }
                    o.addToHistory && $i(e, { from: t, to: n, origin: "markText" }, e.sel, NaN);
                    var s,
                        l = t.line,
                        c = e.cm;
                    if (
                        (e.iter(l, n.line + 1, function (e) {
                            c && o.collapsed && !c.options.lineWrapping && zt(e) == c.display.maxLine && (s = !0),
                                o.collapsed && l != t.line && Ye(e, 0),
                                (function (e, t) {
                                    (e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t]), t.marker.attachLine(e);
                                })(e, new Ct(o, l == t.line ? t.ch : null, l == n.line ? n.ch : null)),
                                ++l;
                        }),
                        o.collapsed &&
                            e.iter(t.line, n.line + 1, function (t) {
                                Pt(e, t) && Ye(t, 0);
                            }),
                        o.clearOnEnter &&
                            de(o, "beforeCursorEnter", function () {
                                return o.clear();
                            }),
                        o.readOnly && ((wt = !0), (e.history.done.length || e.history.undone.length) && e.clearHistory()),
                        o.collapsed && ((o.id = ++So), (o.atomic = !0)),
                        c)
                    ) {
                        if ((s && (c.curOp.updateMaxLine = !0), o.collapsed)) dr(c, t.line, n.line + 1);
                        else if (o.className || o.startStyle || o.endStyle || o.css || o.attributes || o.title) for (var u = t.line; u <= n.line; u++) fr(c, u, "text");
                        o.atomic && no(c.doc), ln(c, "markerAdded", c, o);
                    }
                    return o;
                }
                (Ao.prototype.clear = function () {
                    if (!this.explicitlyCleared) {
                        var e = this.doc.cm,
                            t = e && !e.curOp;
                        if ((t && Gr(e), ve(this, "clear"))) {
                            var n = this.find();
                            n && ln(this, "clear", n.from, n.to);
                        }
                        for (var r = null, i = null, o = 0; o < this.lines.length; ++o) {
                            var a = this.lines[o],
                                s = St(a.markedSpans, this);
                            e && !this.collapsed ? fr(e, Xe(a), "text") : e && (null != s.to && (i = Xe(a)), null != s.from && (r = Xe(a))),
                                (a.markedSpans = At(a.markedSpans, s)),
                                null == s.from && this.collapsed && !Pt(this.doc, a) && e && Ye(a, rr(e.display));
                        }
                        if (e && this.collapsed && !e.options.lineWrapping)
                            for (var l = 0; l < this.lines.length; ++l) {
                                var c = zt(this.lines[l]),
                                    u = Vt(c);
                                u > e.display.maxLineLength && ((e.display.maxLine = c), (e.display.maxLineLength = u), (e.display.maxLineChanged = !0));
                            }
                        null != r && e && this.collapsed && dr(e, r, i + 1),
                            (this.lines.length = 0),
                            (this.explicitlyCleared = !0),
                            this.atomic && this.doc.cantEdit && ((this.doc.cantEdit = !1), e && no(e.doc)),
                            e && ln(e, "markerCleared", e, this, r, i),
                            t && qr(e),
                            this.parent && this.parent.clear();
                    }
                }),
                    (Ao.prototype.find = function (e, t) {
                        var n, r;
                        null == e && "bookmark" == this.type && (e = 1);
                        for (var i = 0; i < this.lines.length; ++i) {
                            var o = this.lines[i],
                                a = St(o.markedSpans, this);
                            if (null != a.from && ((n = et(t ? o : Xe(o), a.from)), -1 == e)) return n;
                            if (null != a.to && ((r = et(t ? o : Xe(o), a.to)), 1 == e)) return r;
                        }
                        return n && { from: n, to: r };
                    }),
                    (Ao.prototype.changed = function () {
                        var e = this,
                            t = this.find(-1, !0),
                            n = this,
                            r = this.doc.cm;
                        t &&
                            r &&
                            Zr(r, function () {
                                var i = t.line,
                                    o = Xe(t.line),
                                    a = jn(r, o);
                                if ((a && (zn(a), (r.curOp.selectionChanged = r.curOp.forceUpdate = !0)), (r.curOp.updateMaxLine = !0), !Pt(n.doc, i) && null != n.height)) {
                                    var s = n.height;
                                    n.height = null;
                                    var l = wn(n) - s;
                                    l && Ye(i, i.height + l);
                                }
                                ln(r, "markerChanged", r, e);
                            });
                    }),
                    (Ao.prototype.attachLine = function (e) {
                        if (!this.lines.length && this.doc.cm) {
                            var t = this.doc.cm.curOp;
                            (t.maybeHiddenMarkers && -1 != $(t.maybeHiddenMarkers, this)) || (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this);
                        }
                        this.lines.push(e);
                    }),
                    (Ao.prototype.detachLine = function (e) {
                        if ((this.lines.splice($(this.lines, e), 1), !this.lines.length && this.doc.cm)) {
                            var t = this.doc.cm.curOp;
                            (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this);
                        }
                    }),
                    ye(Ao);
                var To = function (e, t) {
                    (this.markers = e), (this.primary = t);
                    for (var n = 0; n < e.length; ++n) e[n].parent = this;
                };
                function Do(e) {
                    return e.findMarks(et(e.first, 0), e.clipPos(et(e.lastLine())), function (e) {
                        return e.parent;
                    });
                }
                function Lo(e) {
                    for (
                        var t = function (t) {
                                var n = e[t],
                                    r = [n.primary.doc];
                                Ni(n.primary.doc, function (e) {
                                    return r.push(e);
                                });
                                for (var i = 0; i < n.markers.length; i++) {
                                    var o = n.markers[i];
                                    -1 == $(r, o.doc) && ((o.parent = null), n.markers.splice(i--, 1));
                                }
                            },
                            n = 0;
                        n < e.length;
                        n++
                    )
                        t(n);
                }
                (To.prototype.clear = function () {
                    if (!this.explicitlyCleared) {
                        this.explicitlyCleared = !0;
                        for (var e = 0; e < this.markers.length; ++e) this.markers[e].clear();
                        ln(this, "clear");
                    }
                }),
                    (To.prototype.find = function (e, t) {
                        return this.primary.find(e, t);
                    }),
                    ye(To);
                var Oo = 0,
                    jo = function (e, t, n, r, i) {
                        if (!(this instanceof jo)) return new jo(e, t, n, r, i);
                        null == n && (n = 0),
                            wo.call(this, [new xo([new Gt("", null)])]),
                            (this.first = n),
                            (this.scrollTop = this.scrollLeft = 0),
                            (this.cantEdit = !1),
                            (this.cleanGeneration = 1),
                            (this.modeFrontier = this.highlightFrontier = n);
                        var o = et(n, 0);
                        (this.sel = Ai(o)),
                            (this.history = new Ri(null)),
                            (this.id = ++Oo),
                            (this.modeOption = t),
                            (this.lineSep = r),
                            (this.direction = "rtl" == i ? "rtl" : "ltr"),
                            (this.extend = !1),
                            "string" == typeof e && (e = this.splitLines(e)),
                            _i(this, { from: o, to: o, text: e }),
                            Zi(this, Ai(o), H);
                    };
                (jo.prototype = J(wo.prototype, {
                    constructor: jo,
                    iter: function (e, t, n) {
                        n ? this.iterN(e - this.first, t - e, n) : this.iterN(this.first, this.first + this.size, e);
                    },
                    insert: function (e, t) {
                        for (var n = 0, r = 0; r < t.length; ++r) n += t[r].height;
                        this.insertInner(e - this.first, t, n);
                    },
                    remove: function (e, t) {
                        this.removeInner(e - this.first, t);
                    },
                    getValue: function (e) {
                        var t = Ke(this, this.first, this.first + this.size);
                        return !1 === e ? t : t.join(e || this.lineSeparator());
                    },
                    setValue: ni(function (e) {
                        var t = et(this.first, 0),
                            n = this.first + this.size - 1;
                        co(this, { from: t, to: et(n, Ge(this, n).text.length), text: this.splitLines(e), origin: "setValue", full: !0 }, !0), this.cm && Er(this.cm, 0, 0), Zi(this, Ai(t), H);
                    }),
                    replaceRange: function (e, t, n, r) {
                        mo(this, e, (t = st(this, t)), (n = n ? st(this, n) : t), r);
                    },
                    getRange: function (e, t, n) {
                        var r = qe(this, st(this, e), st(this, t));
                        return !1 === n ? r : r.join(n || this.lineSeparator());
                    },
                    getLine: function (e) {
                        var t = this.getLineHandle(e);
                        return t && t.text;
                    },
                    getLineHandle: function (e) {
                        if (Qe(this, e)) return Ge(this, e);
                    },
                    getLineNumber: function (e) {
                        return Xe(e);
                    },
                    getLineHandleVisualStart: function (e) {
                        return "number" == typeof e && (e = Ge(this, e)), zt(e);
                    },
                    lineCount: function () {
                        return this.size;
                    },
                    firstLine: function () {
                        return this.first;
                    },
                    lastLine: function () {
                        return this.first + this.size - 1;
                    },
                    clipPos: function (e) {
                        return st(this, e);
                    },
                    getCursor: function (e) {
                        var t = this.sel.primary();
                        return null == e || "head" == e ? t.head : "anchor" == e ? t.anchor : "end" == e || "to" == e || !1 === e ? t.to() : t.from();
                    },
                    listSelections: function () {
                        return this.sel.ranges;
                    },
                    somethingSelected: function () {
                        return this.sel.somethingSelected();
                    },
                    setCursor: ni(function (e, t, n) {
                        Ji(this, st(this, "number" == typeof e ? et(e, t || 0) : e), null, n);
                    }),
                    setSelection: ni(function (e, t, n) {
                        Ji(this, st(this, e), st(this, t || e), n);
                    }),
                    extendSelection: ni(function (e, t, n) {
                        Ki(this, st(this, e), t && st(this, t), n);
                    }),
                    extendSelections: ni(function (e, t) {
                        Yi(this, lt(this, e), t);
                    }),
                    extendSelectionsBy: ni(function (e, t) {
                        Yi(this, lt(this, Y(this.sel.ranges, e)), t);
                    }),
                    setSelections: ni(function (e, t, n) {
                        if (e.length) {
                            for (var r = [], i = 0; i < e.length; i++) r[i] = new Ci(st(this, e[i].anchor), st(this, e[i].head || e[i].anchor));
                            null == t && (t = Math.min(e.length - 1, this.sel.primIndex)), Zi(this, Si(this.cm, r, t), n);
                        }
                    }),
                    addSelection: ni(function (e, t, n) {
                        var r = this.sel.ranges.slice(0);
                        r.push(new Ci(st(this, e), st(this, t || e))), Zi(this, Si(this.cm, r, r.length - 1), n);
                    }),
                    getSelection: function (e) {
                        for (var t, n = this.sel.ranges, r = 0; r < n.length; r++) {
                            var i = qe(this, n[r].from(), n[r].to());
                            t = t ? t.concat(i) : i;
                        }
                        return !1 === e ? t : t.join(e || this.lineSeparator());
                    },
                    getSelections: function (e) {
                        for (var t = [], n = this.sel.ranges, r = 0; r < n.length; r++) {
                            var i = qe(this, n[r].from(), n[r].to());
                            !1 !== e && (i = i.join(e || this.lineSeparator())), (t[r] = i);
                        }
                        return t;
                    },
                    replaceSelection: function (e, t, n) {
                        for (var r = [], i = 0; i < this.sel.ranges.length; i++) r[i] = e;
                        this.replaceSelections(r, t, n || "+input");
                    },
                    replaceSelections: ni(function (e, t, n) {
                        for (var r = [], i = this.sel, o = 0; o < i.ranges.length; o++) {
                            var a = i.ranges[o];
                            r[o] = { from: a.from(), to: a.to(), text: this.splitLines(e[o]), origin: n };
                        }
                        for (
                            var s =
                                    t &&
                                    "end" != t &&
                                    (function (e, t, n) {
                                        for (var r = [], i = et(e.first, 0), o = i, a = 0; a < t.length; a++) {
                                            var s = t[a],
                                                l = Li(s.from, i, o),
                                                c = Li(Mi(s), i, o);
                                            if (((i = s.to), (o = c), "around" == n)) {
                                                var u = e.sel.ranges[a],
                                                    d = tt(u.head, u.anchor) < 0;
                                                r[a] = new Ci(d ? c : l, d ? l : c);
                                            } else r[a] = new Ci(l, l);
                                        }
                                        return new ki(r, e.sel.primIndex);
                                    })(this, r, t),
                                l = r.length - 1;
                            l >= 0;
                            l--
                        )
                            co(this, r[l]);
                        s ? Qi(this, s) : this.cm && jr(this.cm);
                    }),
                    undo: ni(function () {
                        fo(this, "undo");
                    }),
                    redo: ni(function () {
                        fo(this, "redo");
                    }),
                    undoSelection: ni(function () {
                        fo(this, "undo", !0);
                    }),
                    redoSelection: ni(function () {
                        fo(this, "redo", !0);
                    }),
                    setExtending: function (e) {
                        this.extend = e;
                    },
                    getExtending: function () {
                        return this.extend;
                    },
                    historySize: function () {
                        for (var e = this.history, t = 0, n = 0, r = 0; r < e.done.length; r++) e.done[r].ranges || ++t;
                        for (var i = 0; i < e.undone.length; i++) e.undone[i].ranges || ++n;
                        return { undo: t, redo: n };
                    },
                    clearHistory: function () {
                        var e = this;
                        (this.history = new Ri(this.history)),
                            Ni(
                                this,
                                function (t) {
                                    return (t.history = e.history);
                                },
                                !0
                            );
                    },
                    markClean: function () {
                        this.cleanGeneration = this.changeGeneration(!0);
                    },
                    changeGeneration: function (e) {
                        return e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation;
                    },
                    isClean: function (e) {
                        return this.history.generation == (e || this.cleanGeneration);
                    },
                    getHistory: function () {
                        return { done: Gi(this.history.done), undone: Gi(this.history.undone) };
                    },
                    setHistory: function (e) {
                        var t = (this.history = new Ri(this.history));
                        (t.done = Gi(e.done.slice(0), null, !0)), (t.undone = Gi(e.undone.slice(0), null, !0));
                    },
                    setGutterMarker: ni(function (e, t, n) {
                        return bo(this, e, "gutter", function (e) {
                            var r = e.gutterMarkers || (e.gutterMarkers = {});
                            return (r[t] = n), !n && te(r) && (e.gutterMarkers = null), !0;
                        });
                    }),
                    clearGutter: ni(function (e) {
                        var t = this;
                        this.iter(function (n) {
                            n.gutterMarkers &&
                                n.gutterMarkers[e] &&
                                bo(t, n, "gutter", function () {
                                    return (n.gutterMarkers[e] = null), te(n.gutterMarkers) && (n.gutterMarkers = null), !0;
                                });
                        });
                    }),
                    lineInfo: function (e) {
                        var t;
                        if ("number" == typeof e) {
                            if (!Qe(this, e)) return null;
                            if (((t = e), !(e = Ge(this, e)))) return null;
                        } else if (null == (t = Xe(e))) return null;
                        return { line: t, handle: e, text: e.text, gutterMarkers: e.gutterMarkers, textClass: e.textClass, bgClass: e.bgClass, wrapClass: e.wrapClass, widgets: e.widgets };
                    },
                    addLineClass: ni(function (e, t, n) {
                        return bo(this, e, "gutter" == t ? "gutter" : "class", function (e) {
                            var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass";
                            if (e[r]) {
                                if (S(n).test(e[r])) return !1;
                                e[r] += " " + n;
                            } else e[r] = n;
                            return !0;
                        });
                    }),
                    removeLineClass: ni(function (e, t, n) {
                        return bo(this, e, "gutter" == t ? "gutter" : "class", function (e) {
                            var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass",
                                i = e[r];
                            if (!i) return !1;
                            if (null == n) e[r] = null;
                            else {
                                var o = i.match(S(n));
                                if (!o) return !1;
                                var a = o.index + o[0].length;
                                e[r] = i.slice(0, o.index) + (o.index && a != i.length ? " " : "") + i.slice(a) || null;
                            }
                            return !0;
                        });
                    }),
                    addLineWidget: ni(function (e, t, n) {
                        return (function (e, t, n, r) {
                            var i = new ko(e, n, r),
                                o = e.cm;
                            return (
                                o && i.noHScroll && (o.display.alignWidgets = !0),
                                bo(e, t, "widget", function (t) {
                                    var n = t.widgets || (t.widgets = []);
                                    if ((null == i.insertAt ? n.push(i) : n.splice(Math.min(n.length, Math.max(0, i.insertAt)), 0, i), (i.line = t), o && !Pt(e, t))) {
                                        var r = Bt(t) < e.scrollTop;
                                        Ye(t, t.height + wn(i)), r && Or(o, i.height), (o.curOp.forceUpdate = !0);
                                    }
                                    return !0;
                                }),
                                o && ln(o, "lineWidgetAdded", o, i, "number" == typeof t ? t : Xe(t)),
                                i
                            );
                        })(this, e, t, n);
                    }),
                    removeLineWidget: function (e) {
                        e.clear();
                    },
                    markText: function (e, t, n) {
                        return Mo(this, st(this, e), st(this, t), n, (n && n.type) || "range");
                    },
                    setBookmark: function (e, t) {
                        var n = { replacedWith: t && (null == t.nodeType ? t.widget : t), insertLeft: t && t.insertLeft, clearWhenEmpty: !1, shared: t && t.shared, handleMouseEvents: t && t.handleMouseEvents };
                        return Mo(this, (e = st(this, e)), e, n, "bookmark");
                    },
                    findMarksAt: function (e) {
                        var t = [],
                            n = Ge(this, (e = st(this, e)).line).markedSpans;
                        if (n)
                            for (var r = 0; r < n.length; ++r) {
                                var i = n[r];
                                (null == i.from || i.from <= e.ch) && (null == i.to || i.to >= e.ch) && t.push(i.marker.parent || i.marker);
                            }
                        return t;
                    },
                    findMarks: function (e, t, n) {
                        (e = st(this, e)), (t = st(this, t));
                        var r = [],
                            i = e.line;
                        return (
                            this.iter(e.line, t.line + 1, function (o) {
                                var a = o.markedSpans;
                                if (a)
                                    for (var s = 0; s < a.length; s++) {
                                        var l = a[s];
                                        (null != l.to && i == e.line && e.ch >= l.to) || (null == l.from && i != e.line) || (null != l.from && i == t.line && l.from >= t.ch) || (n && !n(l.marker)) || r.push(l.marker.parent || l.marker);
                                    }
                                ++i;
                            }),
                            r
                        );
                    },
                    getAllMarks: function () {
                        var e = [];
                        return (
                            this.iter(function (t) {
                                var n = t.markedSpans;
                                if (n) for (var r = 0; r < n.length; ++r) null != n[r].from && e.push(n[r].marker);
                            }),
                            e
                        );
                    },
                    posFromIndex: function (e) {
                        var t,
                            n = this.first,
                            r = this.lineSeparator().length;
                        return (
                            this.iter(function (i) {
                                var o = i.text.length + r;
                                if (o > e) return (t = e), !0;
                                (e -= o), ++n;
                            }),
                            st(this, et(n, t))
                        );
                    },
                    indexFromPos: function (e) {
                        var t = (e = st(this, e)).ch;
                        if (e.line < this.first || e.ch < 0) return 0;
                        var n = this.lineSeparator().length;
                        return (
                            this.iter(this.first, e.line, function (e) {
                                t += e.text.length + n;
                            }),
                            t
                        );
                    },
                    copy: function (e) {
                        var t = new jo(Ke(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
                        return (t.scrollTop = this.scrollTop), (t.scrollLeft = this.scrollLeft), (t.sel = this.sel), (t.extend = !1), e && ((t.history.undoDepth = this.history.undoDepth), t.setHistory(this.getHistory())), t;
                    },
                    linkedDoc: function (e) {
                        e || (e = {});
                        var t = this.first,
                            n = this.first + this.size;
                        null != e.from && e.from > t && (t = e.from), null != e.to && e.to < n && (n = e.to);
                        var r = new jo(Ke(this, t, n), e.mode || this.modeOption, t, this.lineSep, this.direction);
                        return (
                            e.sharedHist && (r.history = this.history),
                            (this.linked || (this.linked = [])).push({ doc: r, sharedHist: e.sharedHist }),
                            (r.linked = [{ doc: this, isParent: !0, sharedHist: e.sharedHist }]),
                            (function (e, t) {
                                for (var n = 0; n < t.length; n++) {
                                    var r = t[n],
                                        i = r.find(),
                                        o = e.clipPos(i.from),
                                        a = e.clipPos(i.to);
                                    if (tt(o, a)) {
                                        var s = Mo(e, o, a, r.primary, r.primary.type);
                                        r.markers.push(s), (s.parent = r);
                                    }
                                }
                            })(r, Do(this)),
                            r
                        );
                    },
                    unlinkDoc: function (e) {
                        if ((e instanceof Ta && (e = e.doc), this.linked))
                            for (var t = 0; t < this.linked.length; ++t)
                                if (this.linked[t].doc == e) {
                                    this.linked.splice(t, 1), e.unlinkDoc(this), Lo(Do(this));
                                    break;
                                }
                        if (e.history == this.history) {
                            var n = [e.id];
                            Ni(
                                e,
                                function (e) {
                                    return n.push(e.id);
                                },
                                !0
                            ),
                                (e.history = new Ri(null)),
                                (e.history.done = Gi(this.history.done, n)),
                                (e.history.undone = Gi(this.history.undone, n));
                        }
                    },
                    iterLinkedDocs: function (e) {
                        Ni(this, e);
                    },
                    getMode: function () {
                        return this.mode;
                    },
                    getEditor: function () {
                        return this.cm;
                    },
                    splitLines: function (e) {
                        return this.lineSep ? e.split(this.lineSep) : je(e);
                    },
                    lineSeparator: function () {
                        return this.lineSep || "\n";
                    },
                    setDirection: ni(function (e) {
                        var t;
                        "rtl" != e && (e = "ltr"),
                            e != this.direction &&
                                ((this.direction = e),
                                this.iter(function (e) {
                                    return (e.order = null);
                                }),
                                this.cm &&
                                    Zr((t = this.cm), function () {
                                        Fi(t), dr(t);
                                    }));
                    }),
                })),
                    (jo.prototype.eachLine = jo.prototype.iter);
                var Eo = 0;
                function _o(e) {
                    var t = this;
                    if ((No(t), !me(t, e) && !kn(t.display, e))) {
                        be(e), a && (Eo = +new Date());
                        var n = cr(t, e, !0),
                            r = e.dataTransfer.files;
                        if (n && !t.isReadOnly())
                            if (r && r.length && window.FileReader && window.File)
                                for (
                                    var i = r.length,
                                        o = Array(i),
                                        s = 0,
                                        l = function () {
                                            ++s == i &&
                                                ei(t, function () {
                                                    var e = {
                                                        from: (n = st(t.doc, n)),
                                                        to: n,
                                                        text: t.doc.splitLines(
                                                            o
                                                                .filter(function (e) {
                                                                    return null != e;
                                                                })
                                                                .join(t.doc.lineSeparator())
                                                        ),
                                                        origin: "paste",
                                                    };
                                                    co(t.doc, e), Qi(t.doc, Ai(st(t.doc, n), st(t.doc, Mi(e))));
                                                })();
                                        },
                                        c = function (e, n) {
                                            if (t.options.allowDropFileTypes && -1 == $(t.options.allowDropFileTypes, e.type)) l();
                                            else {
                                                var r = new FileReader();
                                                (r.onerror = function () {
                                                    return l();
                                                }),
                                                    (r.onload = function () {
                                                        var e = r.result;
                                                        /[\x00-\x08\x0e-\x1f]{2}/.test(e) || (o[n] = e), l();
                                                    }),
                                                    r.readAsText(e);
                                            }
                                        },
                                        u = 0;
                                    u < r.length;
                                    u++
                                )
                                    c(r[u], u);
                            else {
                                if (t.state.draggingText && t.doc.sel.contains(n) > -1)
                                    return (
                                        t.state.draggingText(e),
                                        void setTimeout(function () {
                                            return t.display.input.focus();
                                        }, 20)
                                    );
                                try {
                                    var d = e.dataTransfer.getData("Text");
                                    if (d) {
                                        var f;
                                        if ((t.state.draggingText && !t.state.draggingText.copy && (f = t.listSelections()), eo(t.doc, Ai(n, n)), f)) for (var h = 0; h < f.length; ++h) mo(t.doc, "", f[h].anchor, f[h].head, "drag");
                                        t.replaceSelection(d, "around", "paste"), t.display.input.focus();
                                    }
                                } catch (e) {}
                            }
                    }
                }
                function No(e) {
                    e.display.dragCursor && (e.display.lineSpace.removeChild(e.display.dragCursor), (e.display.dragCursor = null));
                }
                function Io(e) {
                    if (document.getElementsByClassName) {
                        for (var t = document.getElementsByClassName("CodeMirror"), n = [], r = 0; r < t.length; r++) {
                            var i = t[r].CodeMirror;
                            i && n.push(i);
                        }
                        n.length &&
                            n[0].operation(function () {
                                for (var t = 0; t < n.length; t++) e(n[t]);
                            });
                    }
                }
                var Fo = !1;
                function Ro() {
                    var e;
                    Fo ||
                        (de(window, "resize", function () {
                            null == e &&
                                (e = setTimeout(function () {
                                    (e = null), Io(zo);
                                }, 100));
                        }),
                        de(window, "blur", function () {
                            return Io(Ar);
                        }),
                        (Fo = !0));
                }
                function zo(e) {
                    var t = e.display;
                    (t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null), (t.scrollbarsClipped = !1), e.setSize();
                }
                for (
                    var Wo = {
                            3: "Pause",
                            8: "Backspace",
                            9: "Tab",
                            13: "Enter",
                            16: "Shift",
                            17: "Ctrl",
                            18: "Alt",
                            19: "Pause",
                            20: "CapsLock",
                            27: "Esc",
                            32: "Space",
                            33: "PageUp",
                            34: "PageDown",
                            35: "End",
                            36: "Home",
                            37: "Left",
                            38: "Up",
                            39: "Right",
                            40: "Down",
                            44: "PrintScrn",
                            45: "Insert",
                            46: "Delete",
                            59: ";",
                            61: "=",
                            91: "Mod",
                            92: "Mod",
                            93: "Mod",
                            106: "*",
                            107: "=",
                            109: "-",
                            110: ".",
                            111: "/",
                            145: "ScrollLock",
                            173: "-",
                            186: ";",
                            187: "=",
                            188: ",",
                            189: "-",
                            190: ".",
                            191: "/",
                            192: "`",
                            219: "[",
                            220: "\\",
                            221: "]",
                            222: "'",
                            224: "Mod",
                            63232: "Up",
                            63233: "Down",
                            63234: "Left",
                            63235: "Right",
                            63272: "Delete",
                            63273: "Home",
                            63275: "End",
                            63276: "PageUp",
                            63277: "PageDown",
                            63302: "Insert",
                        },
                        $o = 0;
                    $o < 10;
                    $o++
                )
                    Wo[$o + 48] = Wo[$o + 96] = String($o);
                for (var Po = 65; Po <= 90; Po++) Wo[Po] = String.fromCharCode(Po);
                for (var Ho = 1; Ho <= 12; Ho++) Wo[Ho + 111] = Wo[Ho + 63235] = "F" + Ho;
                var Bo = {};
                function Vo(e) {
                    var t,
                        n,
                        r,
                        i,
                        o = e.split(/-(?!$)/);
                    e = o[o.length - 1];
                    for (var a = 0; a < o.length - 1; a++) {
                        var s = o[a];
                        if (/^(cmd|meta|m)$/i.test(s)) i = !0;
                        else if (/^a(lt)?$/i.test(s)) t = !0;
                        else if (/^(c|ctrl|control)$/i.test(s)) n = !0;
                        else {
                            if (!/^s(hift)?$/i.test(s)) throw new Error("Unrecognized modifier name: " + s);
                            r = !0;
                        }
                    }
                    return t && (e = "Alt-" + e), n && (e = "Ctrl-" + e), i && (e = "Cmd-" + e), r && (e = "Shift-" + e), e;
                }
                function Uo(e) {
                    var t = {};
                    for (var n in e)
                        if (e.hasOwnProperty(n)) {
                            var r = e[n];
                            if (/^(name|fallthrough|(de|at)tach)$/.test(n)) continue;
                            if ("..." == r) {
                                delete e[n];
                                continue;
                            }
                            for (var i = Y(n.split(" "), Vo), o = 0; o < i.length; o++) {
                                var a = void 0,
                                    s = void 0;
                                o == i.length - 1 ? ((s = i.join(" ")), (a = r)) : ((s = i.slice(0, o + 1).join(" ")), (a = "..."));
                                var l = t[s];
                                if (l) {
                                    if (l != a) throw new Error("Inconsistent bindings for " + s);
                                } else t[s] = a;
                            }
                            delete e[n];
                        }
                    for (var c in t) e[c] = t[c];
                    return e;
                }
                function Go(e, t, n, r) {
                    var i = (t = Xo(t)).call ? t.call(e, r) : t[e];
                    if (!1 === i) return "nothing";
                    if ("..." === i) return "multi";
                    if (null != i && n(i)) return "handled";
                    if (t.fallthrough) {
                        if ("[object Array]" != Object.prototype.toString.call(t.fallthrough)) return Go(e, t.fallthrough, n, r);
                        for (var o = 0; o < t.fallthrough.length; o++) {
                            var a = Go(e, t.fallthrough[o], n, r);
                            if (a) return a;
                        }
                    }
                }
                function qo(e) {
                    var t = "string" == typeof e ? e : Wo[e.keyCode];
                    return "Ctrl" == t || "Alt" == t || "Shift" == t || "Mod" == t;
                }
                function Ko(e, t, n) {
                    var r = e;
                    return (
                        t.altKey && "Alt" != r && (e = "Alt-" + e),
                        (k ? t.metaKey : t.ctrlKey) && "Ctrl" != r && (e = "Ctrl-" + e),
                        (k ? t.ctrlKey : t.metaKey) && "Mod" != r && (e = "Cmd-" + e),
                        !n && t.shiftKey && "Shift" != r && (e = "Shift-" + e),
                        e
                    );
                }
                function Yo(e, t) {
                    if (d && 34 == e.keyCode && e.char) return !1;
                    var n = Wo[e.keyCode];
                    return null != n && !e.altGraphKey && (3 == e.keyCode && e.code && (n = e.code), Ko(n, e, t));
                }
                function Xo(e) {
                    return "string" == typeof e ? Bo[e] : e;
                }
                function Jo(e, t) {
                    for (var n = e.doc.sel.ranges, r = [], i = 0; i < n.length; i++) {
                        for (var o = t(n[i]); r.length && tt(o.from, K(r).to) <= 0; ) {
                            var a = r.pop();
                            if (tt(a.from, o.from) < 0) {
                                o.from = a.from;
                                break;
                            }
                        }
                        r.push(o);
                    }
                    Zr(e, function () {
                        for (var t = r.length - 1; t >= 0; t--) mo(e.doc, "", r[t].from, r[t].to, "+delete");
                        jr(e);
                    });
                }
                function Qo(e, t, n) {
                    var r = ie(e.text, t + n, n);
                    return r < 0 || r > e.text.length ? null : r;
                }
                function Zo(e, t, n) {
                    var r = Qo(e, t.ch, n);
                    return null == r ? null : new et(t.line, r, n < 0 ? "after" : "before");
                }
                function ea(e, t, n, r, i) {
                    if (e) {
                        "rtl" == t.doc.direction && (i = -i);
                        var o = ce(n, t.doc.direction);
                        if (o) {
                            var a,
                                s = i < 0 ? K(o) : o[0],
                                l = i < 0 == (1 == s.level) ? "after" : "before";
                            if (s.level > 0 || "rtl" == t.doc.direction) {
                                var c = En(t, n);
                                a = i < 0 ? n.text.length - 1 : 0;
                                var u = _n(t, c, a).top;
                                (a = oe(
                                    function (e) {
                                        return _n(t, c, e).top == u;
                                    },
                                    i < 0 == (1 == s.level) ? s.from : s.to - 1,
                                    a
                                )),
                                    "before" == l && (a = Qo(n, a, 1));
                            } else a = i < 0 ? s.to : s.from;
                            return new et(r, a, l);
                        }
                    }
                    return new et(r, i < 0 ? n.text.length : 0, i < 0 ? "before" : "after");
                }
                (Bo.basic = {
                    Left: "goCharLeft",
                    Right: "goCharRight",
                    Up: "goLineUp",
                    Down: "goLineDown",
                    End: "goLineEnd",
                    Home: "goLineStartSmart",
                    PageUp: "goPageUp",
                    PageDown: "goPageDown",
                    Delete: "delCharAfter",
                    Backspace: "delCharBefore",
                    "Shift-Backspace": "delCharBefore",
                    Tab: "defaultTab",
                    "Shift-Tab": "indentAuto",
                    Enter: "newlineAndIndent",
                    Insert: "toggleOverwrite",
                    Esc: "singleSelection",
                }),
                    (Bo.pcDefault = {
                        "Ctrl-A": "selectAll",
                        "Ctrl-D": "deleteLine",
                        "Ctrl-Z": "undo",
                        "Shift-Ctrl-Z": "redo",
                        "Ctrl-Y": "redo",
                        "Ctrl-Home": "goDocStart",
                        "Ctrl-End": "goDocEnd",
                        "Ctrl-Up": "goLineUp",
                        "Ctrl-Down": "goLineDown",
                        "Ctrl-Left": "goGroupLeft",
                        "Ctrl-Right": "goGroupRight",
                        "Alt-Left": "goLineStart",
                        "Alt-Right": "goLineEnd",
                        "Ctrl-Backspace": "delGroupBefore",
                        "Ctrl-Delete": "delGroupAfter",
                        "Ctrl-S": "save",
                        "Ctrl-F": "find",
                        "Ctrl-G": "findNext",
                        "Shift-Ctrl-G": "findPrev",
                        "Shift-Ctrl-F": "replace",
                        "Shift-Ctrl-R": "replaceAll",
                        "Ctrl-[": "indentLess",
                        "Ctrl-]": "indentMore",
                        "Ctrl-U": "undoSelection",
                        "Shift-Ctrl-U": "redoSelection",
                        "Alt-U": "redoSelection",
                        fallthrough: "basic",
                    }),
                    (Bo.emacsy = {
                        "Ctrl-F": "goCharRight",
                        "Ctrl-B": "goCharLeft",
                        "Ctrl-P": "goLineUp",
                        "Ctrl-N": "goLineDown",
                        "Alt-F": "goWordRight",
                        "Alt-B": "goWordLeft",
                        "Ctrl-A": "goLineStart",
                        "Ctrl-E": "goLineEnd",
                        "Ctrl-V": "goPageDown",
                        "Shift-Ctrl-V": "goPageUp",
                        "Ctrl-D": "delCharAfter",
                        "Ctrl-H": "delCharBefore",
                        "Alt-D": "delWordAfter",
                        "Alt-Backspace": "delWordBefore",
                        "Ctrl-K": "killLine",
                        "Ctrl-T": "transposeChars",
                        "Ctrl-O": "openLine",
                    }),
                    (Bo.macDefault = {
                        "Cmd-A": "selectAll",
                        "Cmd-D": "deleteLine",
                        "Cmd-Z": "undo",
                        "Shift-Cmd-Z": "redo",
                        "Cmd-Y": "redo",
                        "Cmd-Home": "goDocStart",
                        "Cmd-Up": "goDocStart",
                        "Cmd-End": "goDocEnd",
                        "Cmd-Down": "goDocEnd",
                        "Alt-Left": "goGroupLeft",
                        "Alt-Right": "goGroupRight",
                        "Cmd-Left": "goLineLeft",
                        "Cmd-Right": "goLineRight",
                        "Alt-Backspace": "delGroupBefore",
                        "Ctrl-Alt-Backspace": "delGroupAfter",
                        "Alt-Delete": "delGroupAfter",
                        "Cmd-S": "save",
                        "Cmd-F": "find",
                        "Cmd-G": "findNext",
                        "Shift-Cmd-G": "findPrev",
                        "Cmd-Alt-F": "replace",
                        "Shift-Cmd-Alt-F": "replaceAll",
                        "Cmd-[": "indentLess",
                        "Cmd-]": "indentMore",
                        "Cmd-Backspace": "delWrappedLineLeft",
                        "Cmd-Delete": "delWrappedLineRight",
                        "Cmd-U": "undoSelection",
                        "Shift-Cmd-U": "redoSelection",
                        "Ctrl-Up": "goDocStart",
                        "Ctrl-Down": "goDocEnd",
                        fallthrough: ["basic", "emacsy"],
                    }),
                    (Bo.default = y ? Bo.macDefault : Bo.pcDefault);
                var ta = {
                    selectAll: so,
                    singleSelection: function (e) {
                        return e.setSelection(e.getCursor("anchor"), e.getCursor("head"), H);
                    },
                    killLine: function (e) {
                        return Jo(e, function (t) {
                            if (t.empty()) {
                                var n = Ge(e.doc, t.head.line).text.length;
                                return t.head.ch == n && t.head.line < e.lastLine() ? { from: t.head, to: et(t.head.line + 1, 0) } : { from: t.head, to: et(t.head.line, n) };
                            }
                            return { from: t.from(), to: t.to() };
                        });
                    },
                    deleteLine: function (e) {
                        return Jo(e, function (t) {
                            return { from: et(t.from().line, 0), to: st(e.doc, et(t.to().line + 1, 0)) };
                        });
                    },
                    delLineLeft: function (e) {
                        return Jo(e, function (e) {
                            return { from: et(e.from().line, 0), to: e.from() };
                        });
                    },
                    delWrappedLineLeft: function (e) {
                        return Jo(e, function (t) {
                            var n = e.charCoords(t.head, "div").top + 5;
                            return { from: e.coordsChar({ left: 0, top: n }, "div"), to: t.from() };
                        });
                    },
                    delWrappedLineRight: function (e) {
                        return Jo(e, function (t) {
                            var n = e.charCoords(t.head, "div").top + 5,
                                r = e.coordsChar({ left: e.display.lineDiv.offsetWidth + 100, top: n }, "div");
                            return { from: t.from(), to: r };
                        });
                    },
                    undo: function (e) {
                        return e.undo();
                    },
                    redo: function (e) {
                        return e.redo();
                    },
                    undoSelection: function (e) {
                        return e.undoSelection();
                    },
                    redoSelection: function (e) {
                        return e.redoSelection();
                    },
                    goDocStart: function (e) {
                        return e.extendSelection(et(e.firstLine(), 0));
                    },
                    goDocEnd: function (e) {
                        return e.extendSelection(et(e.lastLine()));
                    },
                    goLineStart: function (e) {
                        return e.extendSelectionsBy(
                            function (t) {
                                return na(e, t.head.line);
                            },
                            { origin: "+move", bias: 1 }
                        );
                    },
                    goLineStartSmart: function (e) {
                        return e.extendSelectionsBy(
                            function (t) {
                                return ra(e, t.head);
                            },
                            { origin: "+move", bias: 1 }
                        );
                    },
                    goLineEnd: function (e) {
                        return e.extendSelectionsBy(
                            function (t) {
                                return (function (e, t) {
                                    var n = Ge(e.doc, t),
                                        r = (function (e) {
                                            for (var t; (t = It(e)); ) e = t.find(1, !0).line;
                                            return e;
                                        })(n);
                                    return r != n && (t = Xe(r)), ea(!0, e, n, t, -1);
                                })(e, t.head.line);
                            },
                            { origin: "+move", bias: -1 }
                        );
                    },
                    goLineRight: function (e) {
                        return e.extendSelectionsBy(function (t) {
                            var n = e.cursorCoords(t.head, "div").top + 5;
                            return e.coordsChar({ left: e.display.lineDiv.offsetWidth + 100, top: n }, "div");
                        }, V);
                    },
                    goLineLeft: function (e) {
                        return e.extendSelectionsBy(function (t) {
                            var n = e.cursorCoords(t.head, "div").top + 5;
                            return e.coordsChar({ left: 0, top: n }, "div");
                        }, V);
                    },
                    goLineLeftSmart: function (e) {
                        return e.extendSelectionsBy(function (t) {
                            var n = e.cursorCoords(t.head, "div").top + 5,
                                r = e.coordsChar({ left: 0, top: n }, "div");
                            return r.ch < e.getLine(r.line).search(/\S/) ? ra(e, t.head) : r;
                        }, V);
                    },
                    goLineUp: function (e) {
                        return e.moveV(-1, "line");
                    },
                    goLineDown: function (e) {
                        return e.moveV(1, "line");
                    },
                    goPageUp: function (e) {
                        return e.moveV(-1, "page");
                    },
                    goPageDown: function (e) {
                        return e.moveV(1, "page");
                    },
                    goCharLeft: function (e) {
                        return e.moveH(-1, "char");
                    },
                    goCharRight: function (e) {
                        return e.moveH(1, "char");
                    },
                    goColumnLeft: function (e) {
                        return e.moveH(-1, "column");
                    },
                    goColumnRight: function (e) {
                        return e.moveH(1, "column");
                    },
                    goWordLeft: function (e) {
                        return e.moveH(-1, "word");
                    },
                    goGroupRight: function (e) {
                        return e.moveH(1, "group");
                    },
                    goGroupLeft: function (e) {
                        return e.moveH(-1, "group");
                    },
                    goWordRight: function (e) {
                        return e.moveH(1, "word");
                    },
                    delCharBefore: function (e) {
                        return e.deleteH(-1, "codepoint");
                    },
                    delCharAfter: function (e) {
                        return e.deleteH(1, "char");
                    },
                    delWordBefore: function (e) {
                        return e.deleteH(-1, "word");
                    },
                    delWordAfter: function (e) {
                        return e.deleteH(1, "word");
                    },
                    delGroupBefore: function (e) {
                        return e.deleteH(-1, "group");
                    },
                    delGroupAfter: function (e) {
                        return e.deleteH(1, "group");
                    },
                    indentAuto: function (e) {
                        return e.indentSelection("smart");
                    },
                    indentMore: function (e) {
                        return e.indentSelection("add");
                    },
                    indentLess: function (e) {
                        return e.indentSelection("subtract");
                    },
                    insertTab: function (e) {
                        return e.replaceSelection("\t");
                    },
                    insertSoftTab: function (e) {
                        for (var t = [], n = e.listSelections(), r = e.options.tabSize, i = 0; i < n.length; i++) {
                            var o = n[i].from(),
                                a = z(e.getLine(o.line), o.ch, r);
                            t.push(q(r - (a % r)));
                        }
                        e.replaceSelections(t);
                    },
                    defaultTab: function (e) {
                        e.somethingSelected() ? e.indentSelection("add") : e.execCommand("insertTab");
                    },
                    transposeChars: function (e) {
                        return Zr(e, function () {
                            for (var t = e.listSelections(), n = [], r = 0; r < t.length; r++)
                                if (t[r].empty()) {
                                    var i = t[r].head,
                                        o = Ge(e.doc, i.line).text;
                                    if (o)
                                        if ((i.ch == o.length && (i = new et(i.line, i.ch - 1)), i.ch > 0)) (i = new et(i.line, i.ch + 1)), e.replaceRange(o.charAt(i.ch - 1) + o.charAt(i.ch - 2), et(i.line, i.ch - 2), i, "+transpose");
                                        else if (i.line > e.doc.first) {
                                            var a = Ge(e.doc, i.line - 1).text;
                                            a && ((i = new et(i.line, 1)), e.replaceRange(o.charAt(0) + e.doc.lineSeparator() + a.charAt(a.length - 1), et(i.line - 1, a.length - 1), i, "+transpose"));
                                        }
                                    n.push(new Ci(i, i));
                                }
                            e.setSelections(n);
                        });
                    },
                    newlineAndIndent: function (e) {
                        return Zr(e, function () {
                            for (var t = e.listSelections(), n = t.length - 1; n >= 0; n--) e.replaceRange(e.doc.lineSeparator(), t[n].anchor, t[n].head, "+input");
                            t = e.listSelections();
                            for (var r = 0; r < t.length; r++) e.indentLine(t[r].from().line, null, !0);
                            jr(e);
                        });
                    },
                    openLine: function (e) {
                        return e.replaceSelection("\n", "start");
                    },
                    toggleOverwrite: function (e) {
                        return e.toggleOverwrite();
                    },
                };
                function na(e, t) {
                    var n = Ge(e.doc, t),
                        r = zt(n);
                    return r != n && (t = Xe(r)), ea(!0, e, r, t, 1);
                }
                function ra(e, t) {
                    var n = na(e, t.line),
                        r = Ge(e.doc, n.line),
                        i = ce(r, e.doc.direction);
                    if (!i || 0 == i[0].level) {
                        var o = Math.max(n.ch, r.text.search(/\S/)),
                            a = t.line == n.line && t.ch <= o && t.ch;
                        return et(n.line, a ? 0 : o, n.sticky);
                    }
                    return n;
                }
                function ia(e, t, n) {
                    if ("string" == typeof t && !(t = ta[t])) return !1;
                    e.display.input.ensurePolled();
                    var r = e.display.shift,
                        i = !1;
                    try {
                        e.isReadOnly() && (e.state.suppressEdits = !0), n && (e.display.shift = !1), (i = t(e) != P);
                    } finally {
                        (e.display.shift = r), (e.state.suppressEdits = !1);
                    }
                    return i;
                }
                var oa = new W();
                function aa(e, t, n, r) {
                    var i = e.state.keySeq;
                    if (i) {
                        if (qo(t)) return "handled";
                        if (
                            (/\'$/.test(t)
                                ? (e.state.keySeq = null)
                                : oa.set(50, function () {
                                      e.state.keySeq == i && ((e.state.keySeq = null), e.display.input.reset());
                                  }),
                            sa(e, i + " " + t, n, r))
                        )
                            return !0;
                    }
                    return sa(e, t, n, r);
                }
                function sa(e, t, n, r) {
                    var i = (function (e, t, n) {
                        for (var r = 0; r < e.state.keyMaps.length; r++) {
                            var i = Go(t, e.state.keyMaps[r], n, e);
                            if (i) return i;
                        }
                        return (e.options.extraKeys && Go(t, e.options.extraKeys, n, e)) || Go(t, e.options.keyMap, n, e);
                    })(e, t, r);
                    return "multi" == i && (e.state.keySeq = t), "handled" == i && ln(e, "keyHandled", e, t, n), ("handled" != i && "multi" != i) || (be(n), wr(e)), !!i;
                }
                function la(e, t) {
                    var n = Yo(t, !0);
                    return (
                        !!n &&
                        (t.shiftKey && !e.state.keySeq
                            ? aa(e, "Shift-" + n, t, function (t) {
                                  return ia(e, t, !0);
                              }) ||
                              aa(e, n, t, function (t) {
                                  if ("string" == typeof t ? /^go[A-Z]/.test(t) : t.motion) return ia(e, t);
                              })
                            : aa(e, n, t, function (t) {
                                  return ia(e, t);
                              }))
                    );
                }
                var ca = null;
                function ua(e) {
                    var t = this;
                    if (!((e.target && e.target != t.display.input.getField()) || ((t.curOp.focus = E()), me(t, e)))) {
                        a && s < 11 && 27 == e.keyCode && (e.returnValue = !1);
                        var r = e.keyCode;
                        t.display.shift = 16 == r || e.shiftKey;
                        var i = la(t, e);
                        d && ((ca = i ? r : null), i || 88 != r || _e || !(y ? e.metaKey : e.ctrlKey) || t.replaceSelection("", null, "cut")),
                            n && !y && !i && 46 == r && e.shiftKey && !e.ctrlKey && document.execCommand && document.execCommand("cut"),
                            18 != r ||
                                /\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) ||
                                (function (e) {
                                    var t = e.display.lineDiv;
                                    function n(e) {
                                        (18 != e.keyCode && e.altKey) || (M(t, "CodeMirror-crosshair"), he(document, "keyup", n), he(document, "mouseover", n));
                                    }
                                    _(t, "CodeMirror-crosshair"), de(document, "keyup", n), de(document, "mouseover", n);
                                })(t);
                    }
                }
                function da(e) {
                    16 == e.keyCode && (this.doc.sel.shift = !1), me(this, e);
                }
                function fa(e) {
                    var t = this;
                    if (!((e.target && e.target != t.display.input.getField()) || kn(t.display, e) || me(t, e) || (e.ctrlKey && !e.altKey) || (y && e.metaKey))) {
                        var n = e.keyCode,
                            r = e.charCode;
                        if (d && n == ca) return (ca = null), void be(e);
                        if (!d || (e.which && !(e.which < 10)) || !la(t, e)) {
                            var i = String.fromCharCode(null == r ? n : r);
                            "\b" != i &&
                                ((function (e, t, n) {
                                    return aa(e, "'" + n + "'", t, function (t) {
                                        return ia(e, t, !0);
                                    });
                                })(t, e, i) ||
                                    t.display.input.onKeyPress(e));
                        }
                    }
                }
                var ha,
                    pa,
                    ma = function (e, t, n) {
                        (this.time = e), (this.pos = t), (this.button = n);
                    };
                function ga(e) {
                    var t = this,
                        n = t.display;
                    if (!(me(t, e) || (n.activeTouch && n.input.supportsTouch())))
                        if ((n.input.ensurePolled(), (n.shift = e.shiftKey), kn(n, e)))
                            l ||
                                ((n.scroller.draggable = !1),
                                setTimeout(function () {
                                    return (n.scroller.draggable = !0);
                                }, 100));
                        else if (!ba(t, e)) {
                            var r = cr(t, e),
                                i = Se(e),
                                o = r
                                    ? (function (e, t) {
                                          var n = +new Date();
                                          return pa && pa.compare(n, e, t) ? ((ha = pa = null), "triple") : ha && ha.compare(n, e, t) ? ((pa = new ma(n, e, t)), (ha = null), "double") : ((ha = new ma(n, e, t)), (pa = null), "single");
                                      })(r, i)
                                    : "single";
                            window.focus(),
                                1 == i && t.state.selectingText && t.state.selectingText(e),
                                (r &&
                                    (function (e, t, n, r, i) {
                                        var o = "Click";
                                        return (
                                            "double" == r ? (o = "Double" + o) : "triple" == r && (o = "Triple" + o),
                                            aa(e, Ko((o = (1 == t ? "Left" : 2 == t ? "Middle" : "Right") + o), i), i, function (t) {
                                                if (("string" == typeof t && (t = ta[t]), !t)) return !1;
                                                var r = !1;
                                                try {
                                                    e.isReadOnly() && (e.state.suppressEdits = !0), (r = t(e, n) != P);
                                                } finally {
                                                    e.state.suppressEdits = !1;
                                                }
                                                return r;
                                            })
                                        );
                                    })(t, i, r, o, e)) ||
                                    (1 == i
                                        ? r
                                            ? (function (e, t, n, r) {
                                                  a ? setTimeout(F(kr, e), 0) : (e.curOp.focus = E());
                                                  var i,
                                                      o = (function (e, t, n) {
                                                          var r = e.getOption("configureMouse"),
                                                              i = r ? r(e, t, n) : {};
                                                          if (null == i.unit) {
                                                              var o = b ? n.shiftKey && n.metaKey : n.altKey;
                                                              i.unit = o ? "rectangle" : "single" == t ? "char" : "double" == t ? "word" : "line";
                                                          }
                                                          return (
                                                              (null == i.extend || e.doc.extend) && (i.extend = e.doc.extend || n.shiftKey),
                                                              null == i.addNew && (i.addNew = y ? n.metaKey : n.ctrlKey),
                                                              null == i.moveOnDrag && (i.moveOnDrag = !(y ? n.altKey : n.ctrlKey)),
                                                              i
                                                          );
                                                      })(e, n, r),
                                                      c = e.doc.sel;
                                                  e.options.dragDrop && Te && !e.isReadOnly() && "single" == n && (i = c.contains(t)) > -1 && (tt((i = c.ranges[i]).from(), t) < 0 || t.xRel > 0) && (tt(i.to(), t) > 0 || t.xRel < 0)
                                                      ? (function (e, t, n, r) {
                                                            var i = e.display,
                                                                o = !1,
                                                                c = ei(e, function (t) {
                                                                    l && (i.scroller.draggable = !1),
                                                                        (e.state.draggingText = !1),
                                                                        e.state.delayingBlurEvent && (e.hasFocus() ? (e.state.delayingBlurEvent = !1) : Cr(e)),
                                                                        he(i.wrapper.ownerDocument, "mouseup", c),
                                                                        he(i.wrapper.ownerDocument, "mousemove", u),
                                                                        he(i.scroller, "dragstart", d),
                                                                        he(i.scroller, "drop", c),
                                                                        o ||
                                                                            (be(t),
                                                                            r.addNew || Ki(e.doc, n, null, null, r.extend),
                                                                            (l && !f) || (a && 9 == s)
                                                                                ? setTimeout(function () {
                                                                                      i.wrapper.ownerDocument.body.focus({ preventScroll: !0 }), i.input.focus();
                                                                                  }, 20)
                                                                                : i.input.focus());
                                                                }),
                                                                u = function (e) {
                                                                    o = o || Math.abs(t.clientX - e.clientX) + Math.abs(t.clientY - e.clientY) >= 10;
                                                                },
                                                                d = function () {
                                                                    return (o = !0);
                                                                };
                                                            l && (i.scroller.draggable = !0),
                                                                (e.state.draggingText = c),
                                                                (c.copy = !r.moveOnDrag),
                                                                de(i.wrapper.ownerDocument, "mouseup", c),
                                                                de(i.wrapper.ownerDocument, "mousemove", u),
                                                                de(i.scroller, "dragstart", d),
                                                                de(i.scroller, "drop", c),
                                                                (e.state.delayingBlurEvent = !0),
                                                                setTimeout(function () {
                                                                    return i.input.focus();
                                                                }, 20),
                                                                i.scroller.dragDrop && i.scroller.dragDrop();
                                                        })(e, r, t, o)
                                                      : (function (e, t, n, r) {
                                                            a && Cr(e);
                                                            var i = e.display,
                                                                o = e.doc;
                                                            be(t);
                                                            var s,
                                                                l,
                                                                c = o.sel,
                                                                u = c.ranges;
                                                            if ((r.addNew && !r.extend ? ((l = o.sel.contains(n)), (s = l > -1 ? u[l] : new Ci(n, n))) : ((s = o.sel.primary()), (l = o.sel.primIndex)), "rectangle" == r.unit))
                                                                r.addNew || (s = new Ci(n, n)), (n = cr(e, t, !0, !0)), (l = -1);
                                                            else {
                                                                var d = va(e, n, r.unit);
                                                                s = r.extend ? qi(s, d.anchor, d.head, r.extend) : d;
                                                            }
                                                            r.addNew
                                                                ? -1 == l
                                                                    ? ((l = u.length), Zi(o, Si(e, u.concat([s]), l), { scroll: !1, origin: "*mouse" }))
                                                                    : u.length > 1 && u[l].empty() && "char" == r.unit && !r.extend
                                                                    ? (Zi(o, Si(e, u.slice(0, l).concat(u.slice(l + 1)), 0), { scroll: !1, origin: "*mouse" }), (c = o.sel))
                                                                    : Xi(o, l, s, B)
                                                                : ((l = 0), Zi(o, new ki([s], 0), B), (c = o.sel));
                                                            var f = n;
                                                            function h(t) {
                                                                if (0 != tt(f, t))
                                                                    if (((f = t), "rectangle" == r.unit)) {
                                                                        for (
                                                                            var i = [],
                                                                                a = e.options.tabSize,
                                                                                u = z(Ge(o, n.line).text, n.ch, a),
                                                                                d = z(Ge(o, t.line).text, t.ch, a),
                                                                                h = Math.min(u, d),
                                                                                p = Math.max(u, d),
                                                                                m = Math.min(n.line, t.line),
                                                                                g = Math.min(e.lastLine(), Math.max(n.line, t.line));
                                                                            m <= g;
                                                                            m++
                                                                        ) {
                                                                            var v = Ge(o, m).text,
                                                                                y = U(v, h, a);
                                                                            h == p ? i.push(new Ci(et(m, y), et(m, y))) : v.length > y && i.push(new Ci(et(m, y), et(m, U(v, p, a))));
                                                                        }
                                                                        i.length || i.push(new Ci(n, n)), Zi(o, Si(e, c.ranges.slice(0, l).concat(i), l), { origin: "*mouse", scroll: !1 }), e.scrollIntoView(t);
                                                                    } else {
                                                                        var b,
                                                                            x = s,
                                                                            w = va(e, t, r.unit),
                                                                            k = x.anchor;
                                                                        tt(w.anchor, k) > 0 ? ((b = w.head), (k = ot(x.from(), w.anchor))) : ((b = w.anchor), (k = it(x.to(), w.head)));
                                                                        var C = c.ranges.slice(0);
                                                                        (C[l] = (function (e, t) {
                                                                            var n = t.anchor,
                                                                                r = t.head,
                                                                                i = Ge(e.doc, n.line);
                                                                            if (0 == tt(n, r) && n.sticky == r.sticky) return t;
                                                                            var o = ce(i);
                                                                            if (!o) return t;
                                                                            var a = se(o, n.ch, n.sticky),
                                                                                s = o[a];
                                                                            if (s.from != n.ch && s.to != n.ch) return t;
                                                                            var l,
                                                                                c = a + ((s.from == n.ch) == (1 != s.level) ? 0 : 1);
                                                                            if (0 == c || c == o.length) return t;
                                                                            if (r.line != n.line) l = (r.line - n.line) * ("ltr" == e.doc.direction ? 1 : -1) > 0;
                                                                            else {
                                                                                var u = se(o, r.ch, r.sticky),
                                                                                    d = u - a || (r.ch - n.ch) * (1 == s.level ? -1 : 1);
                                                                                l = u == c - 1 || u == c ? d < 0 : d > 0;
                                                                            }
                                                                            var f = o[c + (l ? -1 : 0)],
                                                                                h = l == (1 == f.level),
                                                                                p = h ? f.from : f.to,
                                                                                m = h ? "after" : "before";
                                                                            return n.ch == p && n.sticky == m ? t : new Ci(new et(n.line, p, m), r);
                                                                        })(e, new Ci(st(o, k), b))),
                                                                            Zi(o, Si(e, C, l), B);
                                                                    }
                                                            }
                                                            var p = i.wrapper.getBoundingClientRect(),
                                                                m = 0;
                                                            function g(t) {
                                                                (e.state.selectingText = !1),
                                                                    (m = 1 / 0),
                                                                    t && (be(t), i.input.focus()),
                                                                    he(i.wrapper.ownerDocument, "mousemove", v),
                                                                    he(i.wrapper.ownerDocument, "mouseup", y),
                                                                    (o.history.lastSelOrigin = null);
                                                            }
                                                            var v = ei(e, function (t) {
                                                                    0 !== t.buttons && Se(t)
                                                                        ? (function t(n) {
                                                                              var a = ++m,
                                                                                  s = cr(e, n, !0, "rectangle" == r.unit);
                                                                              if (s)
                                                                                  if (0 != tt(s, f)) {
                                                                                      (e.curOp.focus = E()), h(s);
                                                                                      var l = Dr(i, o);
                                                                                      (s.line >= l.to || s.line < l.from) &&
                                                                                          setTimeout(
                                                                                              ei(e, function () {
                                                                                                  m == a && t(n);
                                                                                              }),
                                                                                              150
                                                                                          );
                                                                                  } else {
                                                                                      var c = n.clientY < p.top ? -20 : n.clientY > p.bottom ? 20 : 0;
                                                                                      c &&
                                                                                          setTimeout(
                                                                                              ei(e, function () {
                                                                                                  m == a && ((i.scroller.scrollTop += c), t(n));
                                                                                              }),
                                                                                              50
                                                                                          );
                                                                                  }
                                                                          })(t)
                                                                        : g(t);
                                                                }),
                                                                y = ei(e, g);
                                                            (e.state.selectingText = y), de(i.wrapper.ownerDocument, "mousemove", v), de(i.wrapper.ownerDocument, "mouseup", y);
                                                        })(e, r, t, o);
                                              })(t, r, o, e)
                                            : Ce(e) == n.scroller && be(e)
                                        : 2 == i
                                        ? (r && Ki(t.doc, r),
                                          setTimeout(function () {
                                              return n.input.focus();
                                          }, 20))
                                        : 3 == i && (C ? t.display.input.onContextMenu(e) : Cr(t)));
                        }
                }
                function va(e, t, n) {
                    if ("char" == n) return new Ci(t, t);
                    if ("word" == n) return e.findWordAt(t);
                    if ("line" == n) return new Ci(et(t.line, 0), st(e.doc, et(t.line + 1, 0)));
                    var r = n(e, t);
                    return new Ci(r.from, r.to);
                }
                function ya(e, t, n, r) {
                    var i, o;
                    if (t.touches) (i = t.touches[0].clientX), (o = t.touches[0].clientY);
                    else
                        try {
                            (i = t.clientX), (o = t.clientY);
                        } catch (e) {
                            return !1;
                        }
                    if (i >= Math.floor(e.display.gutters.getBoundingClientRect().right)) return !1;
                    r && be(t);
                    var a = e.display,
                        s = a.lineDiv.getBoundingClientRect();
                    if (o > s.bottom || !ve(e, n)) return we(t);
                    o -= s.top - a.viewOffset;
                    for (var l = 0; l < e.display.gutterSpecs.length; ++l) {
                        var c = a.gutters.childNodes[l];
                        if (c && c.getBoundingClientRect().right >= i) return pe(e, n, e, Je(e.doc, o), e.display.gutterSpecs[l].className, t), we(t);
                    }
                }
                function ba(e, t) {
                    return ya(e, t, "gutterClick", !0);
                }
                function xa(e, t) {
                    kn(e.display, t) ||
                        (function (e, t) {
                            return !!ve(e, "gutterContextMenu") && ya(e, t, "gutterContextMenu", !1);
                        })(e, t) ||
                        me(e, t, "contextmenu") ||
                        C ||
                        e.display.input.onContextMenu(t);
                }
                function wa(e) {
                    (e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-")), $n(e);
                }
                ma.prototype.compare = function (e, t, n) {
                    return this.time + 400 > e && 0 == tt(t, this.pos) && n == this.button;
                };
                var ka = {
                        toString: function () {
                            return "CodeMirror.Init";
                        },
                    },
                    Ca = {},
                    Sa = {};
                function Aa(e, t, n) {
                    if (!t != !(n && n != ka)) {
                        var r = e.display.dragFunctions,
                            i = t ? de : he;
                        i(e.display.scroller, "dragstart", r.start), i(e.display.scroller, "dragenter", r.enter), i(e.display.scroller, "dragover", r.over), i(e.display.scroller, "dragleave", r.leave), i(e.display.scroller, "drop", r.drop);
                    }
                }
                function Ma(e) {
                    e.options.lineWrapping ? (_(e.display.wrapper, "CodeMirror-wrap"), (e.display.sizer.style.minWidth = ""), (e.display.sizerWidth = null)) : (M(e.display.wrapper, "CodeMirror-wrap"), Ut(e)),
                        lr(e),
                        dr(e),
                        $n(e),
                        setTimeout(function () {
                            return Pr(e);
                        }, 100);
                }
                function Ta(e, t) {
                    var n = this;
                    if (!(this instanceof Ta)) return new Ta(e, t);
                    (this.options = t = t ? R(t) : {}), R(Ca, t, !1);
                    var r = t.value;
                    "string" == typeof r ? (r = new jo(r, t.mode, null, t.lineSeparator, t.direction)) : t.mode && (r.modeOption = t.mode), (this.doc = r);
                    var i = new Ta.inputStyles[t.inputStyle](this),
                        o = (this.display = new gi(e, r, i, t));
                    for (var c in ((o.wrapper.CodeMirror = this),
                    wa(this),
                    t.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"),
                    Vr(this),
                    (this.state = {
                        keyMaps: [],
                        overlays: [],
                        modeGen: 0,
                        overwrite: !1,
                        delayingBlurEvent: !1,
                        focused: !1,
                        suppressEdits: !1,
                        pasteIncoming: -1,
                        cutIncoming: -1,
                        selectingText: !1,
                        draggingText: !1,
                        highlight: new W(),
                        keySeq: null,
                        specialChars: null,
                    }),
                    t.autofocus && !v && o.input.focus(),
                    a &&
                        s < 11 &&
                        setTimeout(function () {
                            return n.display.input.reset(!0);
                        }, 20),
                    (function (e) {
                        var t = e.display;
                        de(t.scroller, "mousedown", ei(e, ga)),
                            de(
                                t.scroller,
                                "dblclick",
                                a && s < 11
                                    ? ei(e, function (t) {
                                          if (!me(e, t)) {
                                              var n = cr(e, t);
                                              if (n && !ba(e, t) && !kn(e.display, t)) {
                                                  be(t);
                                                  var r = e.findWordAt(n);
                                                  Ki(e.doc, r.anchor, r.head);
                                              }
                                          }
                                      })
                                    : function (t) {
                                          return me(e, t) || be(t);
                                      }
                            ),
                            de(t.scroller, "contextmenu", function (t) {
                                return xa(e, t);
                            }),
                            de(t.input.getField(), "contextmenu", function (n) {
                                t.scroller.contains(n.target) || xa(e, n);
                            });
                        var n,
                            r = { end: 0 };
                        function i() {
                            t.activeTouch &&
                                ((n = setTimeout(function () {
                                    return (t.activeTouch = null);
                                }, 1e3)),
                                ((r = t.activeTouch).end = +new Date()));
                        }
                        function o(e, t) {
                            if (null == t.left) return !0;
                            var n = t.left - e.left,
                                r = t.top - e.top;
                            return n * n + r * r > 400;
                        }
                        de(t.scroller, "touchstart", function (i) {
                            if (
                                !me(e, i) &&
                                !(function (e) {
                                    if (1 != e.touches.length) return !1;
                                    var t = e.touches[0];
                                    return t.radiusX <= 1 && t.radiusY <= 1;
                                })(i) &&
                                !ba(e, i)
                            ) {
                                t.input.ensurePolled(), clearTimeout(n);
                                var o = +new Date();
                                (t.activeTouch = { start: o, moved: !1, prev: o - r.end <= 300 ? r : null }), 1 == i.touches.length && ((t.activeTouch.left = i.touches[0].pageX), (t.activeTouch.top = i.touches[0].pageY));
                            }
                        }),
                            de(t.scroller, "touchmove", function () {
                                t.activeTouch && (t.activeTouch.moved = !0);
                            }),
                            de(t.scroller, "touchend", function (n) {
                                var r = t.activeTouch;
                                if (r && !kn(t, n) && null != r.left && !r.moved && new Date() - r.start < 300) {
                                    var a,
                                        s = e.coordsChar(t.activeTouch, "page");
                                    (a = !r.prev || o(r, r.prev) ? new Ci(s, s) : !r.prev.prev || o(r, r.prev.prev) ? e.findWordAt(s) : new Ci(et(s.line, 0), st(e.doc, et(s.line + 1, 0)))),
                                        e.setSelection(a.anchor, a.head),
                                        e.focus(),
                                        be(n);
                                }
                                i();
                            }),
                            de(t.scroller, "touchcancel", i),
                            de(t.scroller, "scroll", function () {
                                t.scroller.clientHeight && (Ir(e, t.scroller.scrollTop), Rr(e, t.scroller.scrollLeft, !0), pe(e, "scroll", e));
                            }),
                            de(t.scroller, "mousewheel", function (t) {
                                return wi(e, t);
                            }),
                            de(t.scroller, "DOMMouseScroll", function (t) {
                                return wi(e, t);
                            }),
                            de(t.wrapper, "scroll", function () {
                                return (t.wrapper.scrollTop = t.wrapper.scrollLeft = 0);
                            }),
                            (t.dragFunctions = {
                                enter: function (t) {
                                    me(e, t) || ke(t);
                                },
                                over: function (t) {
                                    me(e, t) ||
                                        ((function (e, t) {
                                            var n = cr(e, t);
                                            if (n) {
                                                var r = document.createDocumentFragment();
                                                yr(e, n, r),
                                                    e.display.dragCursor || ((e.display.dragCursor = L("div", null, "CodeMirror-cursors CodeMirror-dragcursors")), e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv)),
                                                    D(e.display.dragCursor, r);
                                            }
                                        })(e, t),
                                        ke(t));
                                },
                                start: function (t) {
                                    return (function (e, t) {
                                        if (a && (!e.state.draggingText || +new Date() - Eo < 100)) ke(t);
                                        else if (!me(e, t) && !kn(e.display, t) && (t.dataTransfer.setData("Text", e.getSelection()), (t.dataTransfer.effectAllowed = "copyMove"), t.dataTransfer.setDragImage && !f)) {
                                            var n = L("img", null, null, "position: fixed; left: 0; top: 0;");
                                            (n.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),
                                                d && ((n.width = n.height = 1), e.display.wrapper.appendChild(n), (n._top = n.offsetTop)),
                                                t.dataTransfer.setDragImage(n, 0, 0),
                                                d && n.parentNode.removeChild(n);
                                        }
                                    })(e, t);
                                },
                                drop: ei(e, _o),
                                leave: function (t) {
                                    me(e, t) || No(e);
                                },
                            });
                        var l = t.input.getField();
                        de(l, "keyup", function (t) {
                            return da.call(e, t);
                        }),
                            de(l, "keydown", ei(e, ua)),
                            de(l, "keypress", ei(e, fa)),
                            de(l, "focus", function (t) {
                                return Sr(e, t);
                            }),
                            de(l, "blur", function (t) {
                                return Ar(e, t);
                            });
                    })(this),
                    Ro(),
                    Gr(this),
                    (this.curOp.forceUpdate = !0),
                    Ii(this, r),
                    (t.autofocus && !v) || this.hasFocus()
                        ? setTimeout(function () {
                              n.hasFocus() && !n.state.focused && Sr(n);
                          }, 20)
                        : Ar(this),
                    Sa))
                        Sa.hasOwnProperty(c) && Sa[c](this, t[c], ka);
                    fi(this), t.finishInit && t.finishInit(this);
                    for (var u = 0; u < Da.length; ++u) Da[u](this);
                    qr(this), l && t.lineWrapping && "optimizelegibility" == getComputedStyle(o.lineDiv).textRendering && (o.lineDiv.style.textRendering = "auto");
                }
                (Ta.defaults = Ca), (Ta.optionHandlers = Sa);
                var Da = [];
                function La(e, t, n, r) {
                    var i,
                        o = e.doc;
                    null == n && (n = "add"), "smart" == n && (o.mode.indent ? (i = ht(e, t).state) : (n = "prev"));
                    var a = e.options.tabSize,
                        s = Ge(o, t),
                        l = z(s.text, null, a);
                    s.stateAfter && (s.stateAfter = null);
                    var c,
                        u = s.text.match(/^\s*/)[0];
                    if (r || /\S/.test(s.text)) {
                        if ("smart" == n && ((c = o.mode.indent(i, s.text.slice(u.length), s.text)) == P || c > 150)) {
                            if (!r) return;
                            n = "prev";
                        }
                    } else (c = 0), (n = "not");
                    "prev" == n ? (c = t > o.first ? z(Ge(o, t - 1).text, null, a) : 0) : "add" == n ? (c = l + e.options.indentUnit) : "subtract" == n ? (c = l - e.options.indentUnit) : "number" == typeof n && (c = l + n),
                        (c = Math.max(0, c));
                    var d = "",
                        f = 0;
                    if (e.options.indentWithTabs) for (var h = Math.floor(c / a); h; --h) (f += a), (d += "\t");
                    if ((f < c && (d += q(c - f)), d != u)) return mo(o, d, et(t, 0), et(t, u.length), "+input"), (s.stateAfter = null), !0;
                    for (var p = 0; p < o.sel.ranges.length; p++) {
                        var m = o.sel.ranges[p];
                        if (m.head.line == t && m.head.ch < u.length) {
                            var g = et(t, u.length);
                            Xi(o, p, new Ci(g, g));
                            break;
                        }
                    }
                }
                Ta.defineInitHook = function (e) {
                    return Da.push(e);
                };
                var Oa = null;
                function ja(e) {
                    Oa = e;
                }
                function Ea(e, t, n, r, i) {
                    var o = e.doc;
                    (e.display.shift = !1), r || (r = o.sel);
                    var a = +new Date() - 200,
                        s = "paste" == i || e.state.pasteIncoming > a,
                        l = je(t),
                        c = null;
                    if (s && r.ranges.length > 1)
                        if (Oa && Oa.text.join("\n") == t) {
                            if (r.ranges.length % Oa.text.length == 0) {
                                c = [];
                                for (var u = 0; u < Oa.text.length; u++) c.push(o.splitLines(Oa.text[u]));
                            }
                        } else
                            l.length == r.ranges.length &&
                                e.options.pasteLinesPerSelection &&
                                (c = Y(l, function (e) {
                                    return [e];
                                }));
                    for (var d = e.curOp.updateInput, f = r.ranges.length - 1; f >= 0; f--) {
                        var h = r.ranges[f],
                            p = h.from(),
                            m = h.to();
                        h.empty() &&
                            (n && n > 0
                                ? (p = et(p.line, p.ch - n))
                                : e.state.overwrite && !s
                                ? (m = et(m.line, Math.min(Ge(o, m.line).text.length, m.ch + K(l).length)))
                                : s && Oa && Oa.lineWise && Oa.text.join("\n") == l.join("\n") && (p = m = et(p.line, 0)));
                        var g = { from: p, to: m, text: c ? c[f % c.length] : l, origin: i || (s ? "paste" : e.state.cutIncoming > a ? "cut" : "+input") };
                        co(e.doc, g), ln(e, "inputRead", e, g);
                    }
                    t && !s && Na(e, t), jr(e), e.curOp.updateInput < 2 && (e.curOp.updateInput = d), (e.curOp.typing = !0), (e.state.pasteIncoming = e.state.cutIncoming = -1);
                }
                function _a(e, t) {
                    var n = e.clipboardData && e.clipboardData.getData("Text");
                    if (n)
                        return (
                            e.preventDefault(),
                            t.isReadOnly() ||
                                t.options.disableInput ||
                                Zr(t, function () {
                                    return Ea(t, n, 0, null, "paste");
                                }),
                            !0
                        );
                }
                function Na(e, t) {
                    if (e.options.electricChars && e.options.smartIndent)
                        for (var n = e.doc.sel, r = n.ranges.length - 1; r >= 0; r--) {
                            var i = n.ranges[r];
                            if (!(i.head.ch > 100 || (r && n.ranges[r - 1].head.line == i.head.line))) {
                                var o = e.getModeAt(i.head),
                                    a = !1;
                                if (o.electricChars) {
                                    for (var s = 0; s < o.electricChars.length; s++)
                                        if (t.indexOf(o.electricChars.charAt(s)) > -1) {
                                            a = La(e, i.head.line, "smart");
                                            break;
                                        }
                                } else o.electricInput && o.electricInput.test(Ge(e.doc, i.head.line).text.slice(0, i.head.ch)) && (a = La(e, i.head.line, "smart"));
                                a && ln(e, "electricInput", e, i.head.line);
                            }
                        }
                }
                function Ia(e) {
                    for (var t = [], n = [], r = 0; r < e.doc.sel.ranges.length; r++) {
                        var i = e.doc.sel.ranges[r].head.line,
                            o = { anchor: et(i, 0), head: et(i + 1, 0) };
                        n.push(o), t.push(e.getRange(o.anchor, o.head));
                    }
                    return { text: t, ranges: n };
                }
                function Fa(e, t, n, r) {
                    e.setAttribute("autocorrect", n ? "" : "off"), e.setAttribute("autocapitalize", r ? "" : "off"), e.setAttribute("spellcheck", !!t);
                }
                function Ra() {
                    var e = L("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"),
                        t = L("div", [e], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
                    return l ? (e.style.width = "1000px") : e.setAttribute("wrap", "off"), m && (e.style.border = "1px solid black"), Fa(e), t;
                }
                function za(e, t, n, r, i) {
                    var o = t,
                        a = n,
                        s = Ge(e, t.line),
                        l = i && "rtl" == e.direction ? -n : n;
                    function c(o) {
                        var a, c;
                        if ("codepoint" == r) {
                            var u = s.text.charCodeAt(t.ch + (n > 0 ? 0 : -1));
                            if (isNaN(u)) a = null;
                            else {
                                var d = n > 0 ? u >= 55296 && u < 56320 : u >= 56320 && u < 57343;
                                a = new et(t.line, Math.max(0, Math.min(s.text.length, t.ch + n * (d ? 2 : 1))), -n);
                            }
                        } else
                            a = i
                                ? (function (e, t, n, r) {
                                      var i = ce(t, e.doc.direction);
                                      if (!i) return Zo(t, n, r);
                                      n.ch >= t.text.length ? ((n.ch = t.text.length), (n.sticky = "before")) : n.ch <= 0 && ((n.ch = 0), (n.sticky = "after"));
                                      var o = se(i, n.ch, n.sticky),
                                          a = i[o];
                                      if ("ltr" == e.doc.direction && a.level % 2 == 0 && (r > 0 ? a.to > n.ch : a.from < n.ch)) return Zo(t, n, r);
                                      var s,
                                          l = function (e, n) {
                                              return Qo(t, e instanceof et ? e.ch : e, n);
                                          },
                                          c = function (n) {
                                              return e.options.lineWrapping ? ((s = s || En(e, t)), Qn(e, t, s, n)) : { begin: 0, end: t.text.length };
                                          },
                                          u = c("before" == n.sticky ? l(n, -1) : n.ch);
                                      if ("rtl" == e.doc.direction || 1 == a.level) {
                                          var d = (1 == a.level) == r < 0,
                                              f = l(n, d ? 1 : -1);
                                          if (null != f && (d ? f <= a.to && f <= u.end : f >= a.from && f >= u.begin)) {
                                              var h = d ? "before" : "after";
                                              return new et(n.line, f, h);
                                          }
                                      }
                                      var p = function (e, t, r) {
                                              for (
                                                  var o = function (e, t) {
                                                      return t ? new et(n.line, l(e, 1), "before") : new et(n.line, e, "after");
                                                  };
                                                  e >= 0 && e < i.length;
                                                  e += t
                                              ) {
                                                  var a = i[e],
                                                      s = t > 0 == (1 != a.level),
                                                      c = s ? r.begin : l(r.end, -1);
                                                  if (a.from <= c && c < a.to) return o(c, s);
                                                  if (((c = s ? a.from : l(a.to, -1)), r.begin <= c && c < r.end)) return o(c, s);
                                              }
                                          },
                                          m = p(o + r, r, u);
                                      if (m) return m;
                                      var g = r > 0 ? u.end : l(u.begin, -1);
                                      return null == g || (r > 0 && g == t.text.length) || !(m = p(r > 0 ? 0 : i.length - 1, r, c(g))) ? null : m;
                                  })(e.cm, s, t, n)
                                : Zo(s, t, n);
                        if (null == a) {
                            if (o || (c = t.line + l) < e.first || c >= e.first + e.size || ((t = new et(c, t.ch, t.sticky)), !(s = Ge(e, c)))) return !1;
                            t = ea(i, e.cm, s, t.line, l);
                        } else t = a;
                        return !0;
                    }
                    if ("char" == r || "codepoint" == r) c();
                    else if ("column" == r) c(!0);
                    else if ("word" == r || "group" == r)
                        for (var u = null, d = "group" == r, f = e.cm && e.cm.getHelper(t, "wordChars"), h = !0; !(n < 0) || c(!h); h = !1) {
                            var p = s.text.charAt(t.ch) || "\n",
                                m = ee(p, f) ? "w" : d && "\n" == p ? "n" : !d || /\s/.test(p) ? null : "p";
                            if ((!d || h || m || (m = "s"), u && u != m)) {
                                n < 0 && ((n = 1), c(), (t.sticky = "after"));
                                break;
                            }
                            if ((m && (u = m), n > 0 && !c(!h))) break;
                        }
                    var g = oo(e, t, o, a, !0);
                    return nt(o, g) && (g.hitSide = !0), g;
                }
                function Wa(e, t, n, r) {
                    var i,
                        o,
                        a = e.doc,
                        s = t.left;
                    if ("page" == r) {
                        var l = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight),
                            c = Math.max(l - 0.5 * rr(e.display), 3);
                        i = (n > 0 ? t.bottom : t.top) + n * c;
                    } else "line" == r && (i = n > 0 ? t.bottom + 3 : t.top - 3);
                    for (; (o = Xn(e, s, i)).outside; ) {
                        if (n < 0 ? i <= 0 : i >= a.height) {
                            o.hitSide = !0;
                            break;
                        }
                        i += 5 * n;
                    }
                    return o;
                }
                var $a = function (e) {
                    (this.cm = e), (this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null), (this.polling = new W()), (this.composing = null), (this.gracePeriod = !1), (this.readDOMTimeout = null);
                };
                function Pa(e, t) {
                    var n = jn(e, t.line);
                    if (!n || n.hidden) return null;
                    var r = Ge(e.doc, t.line),
                        i = Ln(n, r, t.line),
                        o = ce(r, e.doc.direction),
                        a = "left";
                    o && (a = se(o, t.ch) % 2 ? "right" : "left");
                    var s = Fn(i.map, t.ch, a);
                    return (s.offset = "right" == s.collapse ? s.end : s.start), s;
                }
                function Ha(e, t) {
                    return t && (e.bad = !0), e;
                }
                function Ba(e, t, n) {
                    var r;
                    if (t == e.display.lineDiv) {
                        if (!(r = e.display.lineDiv.childNodes[n])) return Ha(e.clipPos(et(e.display.viewTo - 1)), !0);
                        (t = null), (n = 0);
                    } else
                        for (r = t; ; r = r.parentNode) {
                            if (!r || r == e.display.lineDiv) return null;
                            if (r.parentNode && r.parentNode == e.display.lineDiv) break;
                        }
                    for (var i = 0; i < e.display.view.length; i++) {
                        var o = e.display.view[i];
                        if (o.node == r) return Va(o, t, n);
                    }
                }
                function Va(e, t, n) {
                    var r = e.text.firstChild,
                        i = !1;
                    if (!t || !j(r, t)) return Ha(et(Xe(e.line), 0), !0);
                    if (t == r && ((i = !0), (t = r.childNodes[n]), (n = 0), !t)) {
                        var o = e.rest ? K(e.rest) : e.line;
                        return Ha(et(Xe(o), o.text.length), i);
                    }
                    var a = 3 == t.nodeType ? t : null,
                        s = t;
                    for (a || 1 != t.childNodes.length || 3 != t.firstChild.nodeType || ((a = t.firstChild), n && (n = a.nodeValue.length)); s.parentNode != r; ) s = s.parentNode;
                    var l = e.measure,
                        c = l.maps;
                    function u(t, n, r) {
                        for (var i = -1; i < (c ? c.length : 0); i++)
                            for (var o = i < 0 ? l.map : c[i], a = 0; a < o.length; a += 3) {
                                var s = o[a + 2];
                                if (s == t || s == n) {
                                    var u = Xe(i < 0 ? e.line : e.rest[i]),
                                        d = o[a] + r;
                                    return (r < 0 || s != t) && (d = o[a + (r ? 1 : 0)]), et(u, d);
                                }
                            }
                    }
                    var d = u(a, s, n);
                    if (d) return Ha(d, i);
                    for (var f = s.nextSibling, h = a ? a.nodeValue.length - n : 0; f; f = f.nextSibling) {
                        if ((d = u(f, f.firstChild, 0))) return Ha(et(d.line, d.ch - h), i);
                        h += f.textContent.length;
                    }
                    for (var p = s.previousSibling, m = n; p; p = p.previousSibling) {
                        if ((d = u(p, p.firstChild, -1))) return Ha(et(d.line, d.ch + m), i);
                        m += p.textContent.length;
                    }
                }
                ($a.prototype.init = function (e) {
                    var t = this,
                        n = this,
                        r = n.cm,
                        i = (n.div = e.lineDiv);
                    function o(e) {
                        for (var t = e.target; t; t = t.parentNode) {
                            if (t == i) return !0;
                            if (/\bCodeMirror-(?:line)?widget\b/.test(t.className)) break;
                        }
                        return !1;
                    }
                    function a(e) {
                        if (o(e) && !me(r, e)) {
                            if (r.somethingSelected()) ja({ lineWise: !1, text: r.getSelections() }), "cut" == e.type && r.replaceSelection("", null, "cut");
                            else {
                                if (!r.options.lineWiseCopyCut) return;
                                var t = Ia(r);
                                ja({ lineWise: !0, text: t.text }),
                                    "cut" == e.type &&
                                        r.operation(function () {
                                            r.setSelections(t.ranges, 0, H), r.replaceSelection("", null, "cut");
                                        });
                            }
                            if (e.clipboardData) {
                                e.clipboardData.clearData();
                                var a = Oa.text.join("\n");
                                if ((e.clipboardData.setData("Text", a), e.clipboardData.getData("Text") == a)) return void e.preventDefault();
                            }
                            var s = Ra(),
                                l = s.firstChild;
                            r.display.lineSpace.insertBefore(s, r.display.lineSpace.firstChild), (l.value = Oa.text.join("\n"));
                            var c = document.activeElement;
                            I(l),
                                setTimeout(function () {
                                    r.display.lineSpace.removeChild(s), c.focus(), c == i && n.showPrimarySelection();
                                }, 50);
                        }
                    }
                    (i.contentEditable = !0),
                        Fa(i, r.options.spellcheck, r.options.autocorrect, r.options.autocapitalize),
                        de(i, "paste", function (e) {
                            !o(e) ||
                                me(r, e) ||
                                _a(e, r) ||
                                (s <= 11 &&
                                    setTimeout(
                                        ei(r, function () {
                                            return t.updateFromDOM();
                                        }),
                                        20
                                    ));
                        }),
                        de(i, "compositionstart", function (e) {
                            t.composing = { data: e.data, done: !1 };
                        }),
                        de(i, "compositionupdate", function (e) {
                            t.composing || (t.composing = { data: e.data, done: !1 });
                        }),
                        de(i, "compositionend", function (e) {
                            t.composing && (e.data != t.composing.data && t.readFromDOMSoon(), (t.composing.done = !0));
                        }),
                        de(i, "touchstart", function () {
                            return n.forceCompositionEnd();
                        }),
                        de(i, "input", function () {
                            t.composing || t.readFromDOMSoon();
                        }),
                        de(i, "copy", a),
                        de(i, "cut", a);
                }),
                    ($a.prototype.screenReaderLabelChanged = function (e) {
                        e ? this.div.setAttribute("aria-label", e) : this.div.removeAttribute("aria-label");
                    }),
                    ($a.prototype.prepareSelection = function () {
                        var e = vr(this.cm, !1);
                        return (e.focus = document.activeElement == this.div), e;
                    }),
                    ($a.prototype.showSelection = function (e, t) {
                        e && this.cm.display.view.length && ((e.focus || t) && this.showPrimarySelection(), this.showMultipleSelections(e));
                    }),
                    ($a.prototype.getSelection = function () {
                        return this.cm.display.wrapper.ownerDocument.getSelection();
                    }),
                    ($a.prototype.showPrimarySelection = function () {
                        var e = this.getSelection(),
                            t = this.cm,
                            r = t.doc.sel.primary(),
                            i = r.from(),
                            o = r.to();
                        if (t.display.viewTo == t.display.viewFrom || i.line >= t.display.viewTo || o.line < t.display.viewFrom) e.removeAllRanges();
                        else {
                            var a = Ba(t, e.anchorNode, e.anchorOffset),
                                s = Ba(t, e.focusNode, e.focusOffset);
                            if (!a || a.bad || !s || s.bad || 0 != tt(ot(a, s), i) || 0 != tt(it(a, s), o)) {
                                var l = t.display.view,
                                    c = (i.line >= t.display.viewFrom && Pa(t, i)) || { node: l[0].measure.map[2], offset: 0 },
                                    u = o.line < t.display.viewTo && Pa(t, o);
                                if (!u) {
                                    var d = l[l.length - 1].measure,
                                        f = d.maps ? d.maps[d.maps.length - 1] : d.map;
                                    u = { node: f[f.length - 1], offset: f[f.length - 2] - f[f.length - 3] };
                                }
                                if (c && u) {
                                    var h,
                                        p = e.rangeCount && e.getRangeAt(0);
                                    try {
                                        h = A(c.node, c.offset, u.offset, u.node);
                                    } catch (e) {}
                                    h &&
                                        (!n && t.state.focused ? (e.collapse(c.node, c.offset), h.collapsed || (e.removeAllRanges(), e.addRange(h))) : (e.removeAllRanges(), e.addRange(h)),
                                        p && null == e.anchorNode ? e.addRange(p) : n && this.startGracePeriod()),
                                        this.rememberSelection();
                                } else e.removeAllRanges();
                            }
                        }
                    }),
                    ($a.prototype.startGracePeriod = function () {
                        var e = this;
                        clearTimeout(this.gracePeriod),
                            (this.gracePeriod = setTimeout(function () {
                                (e.gracePeriod = !1),
                                    e.selectionChanged() &&
                                        e.cm.operation(function () {
                                            return (e.cm.curOp.selectionChanged = !0);
                                        });
                            }, 20));
                    }),
                    ($a.prototype.showMultipleSelections = function (e) {
                        D(this.cm.display.cursorDiv, e.cursors), D(this.cm.display.selectionDiv, e.selection);
                    }),
                    ($a.prototype.rememberSelection = function () {
                        var e = this.getSelection();
                        (this.lastAnchorNode = e.anchorNode), (this.lastAnchorOffset = e.anchorOffset), (this.lastFocusNode = e.focusNode), (this.lastFocusOffset = e.focusOffset);
                    }),
                    ($a.prototype.selectionInEditor = function () {
                        var e = this.getSelection();
                        if (!e.rangeCount) return !1;
                        var t = e.getRangeAt(0).commonAncestorContainer;
                        return j(this.div, t);
                    }),
                    ($a.prototype.focus = function () {
                        "nocursor" != this.cm.options.readOnly && ((this.selectionInEditor() && document.activeElement == this.div) || this.showSelection(this.prepareSelection(), !0), this.div.focus());
                    }),
                    ($a.prototype.blur = function () {
                        this.div.blur();
                    }),
                    ($a.prototype.getField = function () {
                        return this.div;
                    }),
                    ($a.prototype.supportsTouch = function () {
                        return !0;
                    }),
                    ($a.prototype.receivedFocus = function () {
                        var e = this;
                        this.selectionInEditor()
                            ? this.pollSelection()
                            : Zr(this.cm, function () {
                                  return (e.cm.curOp.selectionChanged = !0);
                              }),
                            this.polling.set(this.cm.options.pollInterval, function t() {
                                e.cm.state.focused && (e.pollSelection(), e.polling.set(e.cm.options.pollInterval, t));
                            });
                    }),
                    ($a.prototype.selectionChanged = function () {
                        var e = this.getSelection();
                        return e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset;
                    }),
                    ($a.prototype.pollSelection = function () {
                        if (null == this.readDOMTimeout && !this.gracePeriod && this.selectionChanged()) {
                            var e = this.getSelection(),
                                t = this.cm;
                            if (
                                g &&
                                u &&
                                this.cm.display.gutterSpecs.length &&
                                (function (e) {
                                    for (var t = e; t; t = t.parentNode) if (/CodeMirror-gutter-wrapper/.test(t.className)) return !0;
                                    return !1;
                                })(e.anchorNode)
                            )
                                return this.cm.triggerOnKeyDown({ type: "keydown", keyCode: 8, preventDefault: Math.abs }), this.blur(), void this.focus();
                            if (!this.composing) {
                                this.rememberSelection();
                                var n = Ba(t, e.anchorNode, e.anchorOffset),
                                    r = Ba(t, e.focusNode, e.focusOffset);
                                n &&
                                    r &&
                                    Zr(t, function () {
                                        Zi(t.doc, Ai(n, r), H), (n.bad || r.bad) && (t.curOp.selectionChanged = !0);
                                    });
                            }
                        }
                    }),
                    ($a.prototype.pollContent = function () {
                        null != this.readDOMTimeout && (clearTimeout(this.readDOMTimeout), (this.readDOMTimeout = null));
                        var e,
                            t,
                            n,
                            r = this.cm,
                            i = r.display,
                            o = r.doc.sel.primary(),
                            a = o.from(),
                            s = o.to();
                        if (
                            (0 == a.ch && a.line > r.firstLine() && (a = et(a.line - 1, Ge(r.doc, a.line - 1).length)),
                            s.ch == Ge(r.doc, s.line).text.length && s.line < r.lastLine() && (s = et(s.line + 1, 0)),
                            a.line < i.viewFrom || s.line > i.viewTo - 1)
                        )
                            return !1;
                        a.line == i.viewFrom || 0 == (e = ur(r, a.line)) ? ((t = Xe(i.view[0].line)), (n = i.view[0].node)) : ((t = Xe(i.view[e].line)), (n = i.view[e - 1].node.nextSibling));
                        var l,
                            c,
                            u = ur(r, s.line);
                        if ((u == i.view.length - 1 ? ((l = i.viewTo - 1), (c = i.lineDiv.lastChild)) : ((l = Xe(i.view[u + 1].line) - 1), (c = i.view[u + 1].node.previousSibling)), !n)) return !1;
                        for (
                            var d = r.doc.splitLines(
                                    (function (e, t, n, r, i) {
                                        var o = "",
                                            a = !1,
                                            s = e.doc.lineSeparator(),
                                            l = !1;
                                        function c() {
                                            a && ((o += s), l && (o += s), (a = l = !1));
                                        }
                                        function u(e) {
                                            e && (c(), (o += e));
                                        }
                                        function d(t) {
                                            if (1 == t.nodeType) {
                                                var n = t.getAttribute("cm-text");
                                                if (n) return void u(n);
                                                var o,
                                                    f = t.getAttribute("cm-marker");
                                                if (f) {
                                                    var h = e.findMarks(
                                                        et(r, 0),
                                                        et(i + 1, 0),
                                                        ((g = +f),
                                                        function (e) {
                                                            return e.id == g;
                                                        })
                                                    );
                                                    return void (h.length && (o = h[0].find(0)) && u(qe(e.doc, o.from, o.to).join(s)));
                                                }
                                                if ("false" == t.getAttribute("contenteditable")) return;
                                                var p = /^(pre|div|p|li|table|br)$/i.test(t.nodeName);
                                                if (!/^br$/i.test(t.nodeName) && 0 == t.textContent.length) return;
                                                p && c();
                                                for (var m = 0; m < t.childNodes.length; m++) d(t.childNodes[m]);
                                                /^(pre|p)$/i.test(t.nodeName) && (l = !0), p && (a = !0);
                                            } else 3 == t.nodeType && u(t.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
                                            var g;
                                        }
                                        for (; d(t), t != n; ) (t = t.nextSibling), (l = !1);
                                        return o;
                                    })(r, n, c, t, l)
                                ),
                                f = qe(r.doc, et(t, 0), et(l, Ge(r.doc, l).text.length));
                            d.length > 1 && f.length > 1;

                        )
                            if (K(d) == K(f)) d.pop(), f.pop(), l--;
                            else {
                                if (d[0] != f[0]) break;
                                d.shift(), f.shift(), t++;
                            }
                        for (var h = 0, p = 0, m = d[0], g = f[0], v = Math.min(m.length, g.length); h < v && m.charCodeAt(h) == g.charCodeAt(h); ) ++h;
                        for (var y = K(d), b = K(f), x = Math.min(y.length - (1 == d.length ? h : 0), b.length - (1 == f.length ? h : 0)); p < x && y.charCodeAt(y.length - p - 1) == b.charCodeAt(b.length - p - 1); ) ++p;
                        if (1 == d.length && 1 == f.length && t == a.line) for (; h && h > a.ch && y.charCodeAt(y.length - p - 1) == b.charCodeAt(b.length - p - 1); ) h--, p++;
                        (d[d.length - 1] = y.slice(0, y.length - p).replace(/^\u200b+/, "")), (d[0] = d[0].slice(h).replace(/\u200b+$/, ""));
                        var w = et(t, h),
                            k = et(l, f.length ? K(f).length - p : 0);
                        return d.length > 1 || d[0] || tt(w, k) ? (mo(r.doc, d, w, k, "+input"), !0) : void 0;
                    }),
                    ($a.prototype.ensurePolled = function () {
                        this.forceCompositionEnd();
                    }),
                    ($a.prototype.reset = function () {
                        this.forceCompositionEnd();
                    }),
                    ($a.prototype.forceCompositionEnd = function () {
                        this.composing && (clearTimeout(this.readDOMTimeout), (this.composing = null), this.updateFromDOM(), this.div.blur(), this.div.focus());
                    }),
                    ($a.prototype.readFromDOMSoon = function () {
                        var e = this;
                        null == this.readDOMTimeout &&
                            (this.readDOMTimeout = setTimeout(function () {
                                if (((e.readDOMTimeout = null), e.composing)) {
                                    if (!e.composing.done) return;
                                    e.composing = null;
                                }
                                e.updateFromDOM();
                            }, 80));
                    }),
                    ($a.prototype.updateFromDOM = function () {
                        var e = this;
                        (!this.cm.isReadOnly() && this.pollContent()) ||
                            Zr(this.cm, function () {
                                return dr(e.cm);
                            });
                    }),
                    ($a.prototype.setUneditable = function (e) {
                        e.contentEditable = "false";
                    }),
                    ($a.prototype.onKeyPress = function (e) {
                        0 == e.charCode || this.composing || (e.preventDefault(), this.cm.isReadOnly() || ei(this.cm, Ea)(this.cm, String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), 0));
                    }),
                    ($a.prototype.readOnlyChanged = function (e) {
                        this.div.contentEditable = String("nocursor" != e);
                    }),
                    ($a.prototype.onContextMenu = function () {}),
                    ($a.prototype.resetPosition = function () {}),
                    ($a.prototype.needsContentAttribute = !0);
                var Ua = function (e) {
                    (this.cm = e), (this.prevInput = ""), (this.pollingFast = !1), (this.polling = new W()), (this.hasSelection = !1), (this.composing = null);
                };
                (Ua.prototype.init = function (e) {
                    var t = this,
                        n = this,
                        r = this.cm;
                    this.createField(e);
                    var i = this.textarea;
                    function o(e) {
                        if (!me(r, e)) {
                            if (r.somethingSelected()) ja({ lineWise: !1, text: r.getSelections() });
                            else {
                                if (!r.options.lineWiseCopyCut) return;
                                var t = Ia(r);
                                ja({ lineWise: !0, text: t.text }), "cut" == e.type ? r.setSelections(t.ranges, null, H) : ((n.prevInput = ""), (i.value = t.text.join("\n")), I(i));
                            }
                            "cut" == e.type && (r.state.cutIncoming = +new Date());
                        }
                    }
                    e.wrapper.insertBefore(this.wrapper, e.wrapper.firstChild),
                        m && (i.style.width = "0px"),
                        de(i, "input", function () {
                            a && s >= 9 && t.hasSelection && (t.hasSelection = null), n.poll();
                        }),
                        de(i, "paste", function (e) {
                            me(r, e) || _a(e, r) || ((r.state.pasteIncoming = +new Date()), n.fastPoll());
                        }),
                        de(i, "cut", o),
                        de(i, "copy", o),
                        de(e.scroller, "paste", function (t) {
                            if (!kn(e, t) && !me(r, t)) {
                                if (!i.dispatchEvent) return (r.state.pasteIncoming = +new Date()), void n.focus();
                                var o = new Event("paste");
                                (o.clipboardData = t.clipboardData), i.dispatchEvent(o);
                            }
                        }),
                        de(e.lineSpace, "selectstart", function (t) {
                            kn(e, t) || be(t);
                        }),
                        de(i, "compositionstart", function () {
                            var e = r.getCursor("from");
                            n.composing && n.composing.range.clear(), (n.composing = { start: e, range: r.markText(e, r.getCursor("to"), { className: "CodeMirror-composing" }) });
                        }),
                        de(i, "compositionend", function () {
                            n.composing && (n.poll(), n.composing.range.clear(), (n.composing = null));
                        });
                }),
                    (Ua.prototype.createField = function (e) {
                        (this.wrapper = Ra()), (this.textarea = this.wrapper.firstChild);
                    }),
                    (Ua.prototype.screenReaderLabelChanged = function (e) {
                        e ? this.textarea.setAttribute("aria-label", e) : this.textarea.removeAttribute("aria-label");
                    }),
                    (Ua.prototype.prepareSelection = function () {
                        var e = this.cm,
                            t = e.display,
                            n = e.doc,
                            r = vr(e);
                        if (e.options.moveInputWithCursor) {
                            var i = qn(e, n.sel.primary().head, "div"),
                                o = t.wrapper.getBoundingClientRect(),
                                a = t.lineDiv.getBoundingClientRect();
                            (r.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, i.top + a.top - o.top))), (r.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, i.left + a.left - o.left)));
                        }
                        return r;
                    }),
                    (Ua.prototype.showSelection = function (e) {
                        var t = this.cm.display;
                        D(t.cursorDiv, e.cursors), D(t.selectionDiv, e.selection), null != e.teTop && ((this.wrapper.style.top = e.teTop + "px"), (this.wrapper.style.left = e.teLeft + "px"));
                    }),
                    (Ua.prototype.reset = function (e) {
                        if (!this.contextMenuPending && !this.composing) {
                            var t = this.cm;
                            if (t.somethingSelected()) {
                                this.prevInput = "";
                                var n = t.getSelection();
                                (this.textarea.value = n), t.state.focused && I(this.textarea), a && s >= 9 && (this.hasSelection = n);
                            } else e || ((this.prevInput = this.textarea.value = ""), a && s >= 9 && (this.hasSelection = null));
                        }
                    }),
                    (Ua.prototype.getField = function () {
                        return this.textarea;
                    }),
                    (Ua.prototype.supportsTouch = function () {
                        return !1;
                    }),
                    (Ua.prototype.focus = function () {
                        if ("nocursor" != this.cm.options.readOnly && (!v || E() != this.textarea))
                            try {
                                this.textarea.focus();
                            } catch (e) {}
                    }),
                    (Ua.prototype.blur = function () {
                        this.textarea.blur();
                    }),
                    (Ua.prototype.resetPosition = function () {
                        this.wrapper.style.top = this.wrapper.style.left = 0;
                    }),
                    (Ua.prototype.receivedFocus = function () {
                        this.slowPoll();
                    }),
                    (Ua.prototype.slowPoll = function () {
                        var e = this;
                        this.pollingFast ||
                            this.polling.set(this.cm.options.pollInterval, function () {
                                e.poll(), e.cm.state.focused && e.slowPoll();
                            });
                    }),
                    (Ua.prototype.fastPoll = function () {
                        var e = !1,
                            t = this;
                        (t.pollingFast = !0),
                            t.polling.set(20, function n() {
                                t.poll() || e ? ((t.pollingFast = !1), t.slowPoll()) : ((e = !0), t.polling.set(60, n));
                            });
                    }),
                    (Ua.prototype.poll = function () {
                        var e = this,
                            t = this.cm,
                            n = this.textarea,
                            r = this.prevInput;
                        if (this.contextMenuPending || !t.state.focused || (Ee(n) && !r && !this.composing) || t.isReadOnly() || t.options.disableInput || t.state.keySeq) return !1;
                        var i = n.value;
                        if (i == r && !t.somethingSelected()) return !1;
                        if ((a && s >= 9 && this.hasSelection === i) || (y && /[\uf700-\uf7ff]/.test(i))) return t.display.input.reset(), !1;
                        if (t.doc.sel == t.display.selForContextMenu) {
                            var o = i.charCodeAt(0);
                            if ((8203 != o || r || (r = "​"), 8666 == o)) return this.reset(), this.cm.execCommand("undo");
                        }
                        for (var l = 0, c = Math.min(r.length, i.length); l < c && r.charCodeAt(l) == i.charCodeAt(l); ) ++l;
                        return (
                            Zr(t, function () {
                                Ea(t, i.slice(l), r.length - l, null, e.composing ? "*compose" : null),
                                    i.length > 1e3 || i.indexOf("\n") > -1 ? (n.value = e.prevInput = "") : (e.prevInput = i),
                                    e.composing && (e.composing.range.clear(), (e.composing.range = t.markText(e.composing.start, t.getCursor("to"), { className: "CodeMirror-composing" })));
                            }),
                            !0
                        );
                    }),
                    (Ua.prototype.ensurePolled = function () {
                        this.pollingFast && this.poll() && (this.pollingFast = !1);
                    }),
                    (Ua.prototype.onKeyPress = function () {
                        a && s >= 9 && (this.hasSelection = null), this.fastPoll();
                    }),
                    (Ua.prototype.onContextMenu = function (e) {
                        var t = this,
                            n = t.cm,
                            r = n.display,
                            i = t.textarea;
                        t.contextMenuPending && t.contextMenuPending();
                        var o = cr(n, e),
                            c = r.scroller.scrollTop;
                        if (o && !d) {
                            n.options.resetSelectionOnContextMenu && -1 == n.doc.sel.contains(o) && ei(n, Zi)(n.doc, Ai(o), H);
                            var u,
                                f = i.style.cssText,
                                h = t.wrapper.style.cssText,
                                p = t.wrapper.offsetParent.getBoundingClientRect();
                            if (
                                ((t.wrapper.style.cssText = "position: static"),
                                (i.style.cssText =
                                    "position: absolute; width: 30px; height: 30px;\n      top: " +
                                    (e.clientY - p.top - 5) +
                                    "px; left: " +
                                    (e.clientX - p.left - 5) +
                                    "px;\n      z-index: 1000; background: " +
                                    (a ? "rgba(255, 255, 255, .05)" : "transparent") +
                                    ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);"),
                                l && (u = window.scrollY),
                                r.input.focus(),
                                l && window.scrollTo(null, u),
                                r.input.reset(),
                                n.somethingSelected() || (i.value = t.prevInput = " "),
                                (t.contextMenuPending = v),
                                (r.selForContextMenu = n.doc.sel),
                                clearTimeout(r.detectingSelectAll),
                                a && s >= 9 && g(),
                                C)
                            ) {
                                ke(e);
                                var m = function () {
                                    he(window, "mouseup", m), setTimeout(v, 20);
                                };
                                de(window, "mouseup", m);
                            } else setTimeout(v, 50);
                        }
                        function g() {
                            if (null != i.selectionStart) {
                                var e = n.somethingSelected(),
                                    o = "​" + (e ? i.value : "");
                                (i.value = "⇚"), (i.value = o), (t.prevInput = e ? "" : "​"), (i.selectionStart = 1), (i.selectionEnd = o.length), (r.selForContextMenu = n.doc.sel);
                            }
                        }
                        function v() {
                            if (
                                t.contextMenuPending == v &&
                                ((t.contextMenuPending = !1), (t.wrapper.style.cssText = h), (i.style.cssText = f), a && s < 9 && r.scrollbars.setScrollTop((r.scroller.scrollTop = c)), null != i.selectionStart)
                            ) {
                                (!a || (a && s < 9)) && g();
                                var e = 0,
                                    o = function () {
                                        r.selForContextMenu == n.doc.sel && 0 == i.selectionStart && i.selectionEnd > 0 && "​" == t.prevInput
                                            ? ei(n, so)(n)
                                            : e++ < 10
                                            ? (r.detectingSelectAll = setTimeout(o, 500))
                                            : ((r.selForContextMenu = null), r.input.reset());
                                    };
                                r.detectingSelectAll = setTimeout(o, 200);
                            }
                        }
                    }),
                    (Ua.prototype.readOnlyChanged = function (e) {
                        e || this.reset(), (this.textarea.disabled = "nocursor" == e), (this.textarea.readOnly = !!e);
                    }),
                    (Ua.prototype.setUneditable = function () {}),
                    (Ua.prototype.needsContentAttribute = !1),
                    (function (e) {
                        var t = e.optionHandlers;
                        function n(n, r, i, o) {
                            (e.defaults[n] = r),
                                i &&
                                    (t[n] = o
                                        ? function (e, t, n) {
                                              n != ka && i(e, t, n);
                                          }
                                        : i);
                        }
                        (e.defineOption = n),
                            (e.Init = ka),
                            n(
                                "value",
                                "",
                                function (e, t) {
                                    return e.setValue(t);
                                },
                                !0
                            ),
                            n(
                                "mode",
                                null,
                                function (e, t) {
                                    (e.doc.modeOption = t), Oi(e);
                                },
                                !0
                            ),
                            n("indentUnit", 2, Oi, !0),
                            n("indentWithTabs", !1),
                            n("smartIndent", !0),
                            n(
                                "tabSize",
                                4,
                                function (e) {
                                    ji(e), $n(e), dr(e);
                                },
                                !0
                            ),
                            n("lineSeparator", null, function (e, t) {
                                if (((e.doc.lineSep = t), t)) {
                                    var n = [],
                                        r = e.doc.first;
                                    e.doc.iter(function (e) {
                                        for (var i = 0; ; ) {
                                            var o = e.text.indexOf(t, i);
                                            if (-1 == o) break;
                                            (i = o + t.length), n.push(et(r, o));
                                        }
                                        r++;
                                    });
                                    for (var i = n.length - 1; i >= 0; i--) mo(e.doc, t, n[i], et(n[i].line, n[i].ch + t.length));
                                }
                            }),
                            n("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function (e, t, n) {
                                (e.state.specialChars = new RegExp(t.source + (t.test("\t") ? "" : "|\t"), "g")), n != ka && e.refresh();
                            }),
                            n(
                                "specialCharPlaceholder",
                                Qt,
                                function (e) {
                                    return e.refresh();
                                },
                                !0
                            ),
                            n("electricChars", !0),
                            n(
                                "inputStyle",
                                v ? "contenteditable" : "textarea",
                                function () {
                                    throw new Error("inputStyle can not (yet) be changed in a running editor");
                                },
                                !0
                            ),
                            n(
                                "spellcheck",
                                !1,
                                function (e, t) {
                                    return (e.getInputField().spellcheck = t);
                                },
                                !0
                            ),
                            n(
                                "autocorrect",
                                !1,
                                function (e, t) {
                                    return (e.getInputField().autocorrect = t);
                                },
                                !0
                            ),
                            n(
                                "autocapitalize",
                                !1,
                                function (e, t) {
                                    return (e.getInputField().autocapitalize = t);
                                },
                                !0
                            ),
                            n("rtlMoveVisually", !x),
                            n("wholeLineUpdateBefore", !0),
                            n(
                                "theme",
                                "default",
                                function (e) {
                                    wa(e), mi(e);
                                },
                                !0
                            ),
                            n("keyMap", "default", function (e, t, n) {
                                var r = Xo(t),
                                    i = n != ka && Xo(n);
                                i && i.detach && i.detach(e, r), r.attach && r.attach(e, i || null);
                            }),
                            n("extraKeys", null),
                            n("configureMouse", null),
                            n("lineWrapping", !1, Ma, !0),
                            n(
                                "gutters",
                                [],
                                function (e, t) {
                                    (e.display.gutterSpecs = hi(t, e.options.lineNumbers)), mi(e);
                                },
                                !0
                            ),
                            n(
                                "fixedGutter",
                                !0,
                                function (e, t) {
                                    (e.display.gutters.style.left = t ? ar(e.display) + "px" : "0"), e.refresh();
                                },
                                !0
                            ),
                            n(
                                "coverGutterNextToScrollbar",
                                !1,
                                function (e) {
                                    return Pr(e);
                                },
                                !0
                            ),
                            n(
                                "scrollbarStyle",
                                "native",
                                function (e) {
                                    Vr(e), Pr(e), e.display.scrollbars.setScrollTop(e.doc.scrollTop), e.display.scrollbars.setScrollLeft(e.doc.scrollLeft);
                                },
                                !0
                            ),
                            n(
                                "lineNumbers",
                                !1,
                                function (e, t) {
                                    (e.display.gutterSpecs = hi(e.options.gutters, t)), mi(e);
                                },
                                !0
                            ),
                            n("firstLineNumber", 1, mi, !0),
                            n(
                                "lineNumberFormatter",
                                function (e) {
                                    return e;
                                },
                                mi,
                                !0
                            ),
                            n("showCursorWhenSelecting", !1, gr, !0),
                            n("resetSelectionOnContextMenu", !0),
                            n("lineWiseCopyCut", !0),
                            n("pasteLinesPerSelection", !0),
                            n("selectionsMayTouch", !1),
                            n("readOnly", !1, function (e, t) {
                                "nocursor" == t && (Ar(e), e.display.input.blur()), e.display.input.readOnlyChanged(t);
                            }),
                            n("screenReaderLabel", null, function (e, t) {
                                (t = "" === t ? null : t), e.display.input.screenReaderLabelChanged(t);
                            }),
                            n(
                                "disableInput",
                                !1,
                                function (e, t) {
                                    t || e.display.input.reset();
                                },
                                !0
                            ),
                            n("dragDrop", !0, Aa),
                            n("allowDropFileTypes", null),
                            n("cursorBlinkRate", 530),
                            n("cursorScrollMargin", 0),
                            n("cursorHeight", 1, gr, !0),
                            n("singleCursorHeightPerLine", !0, gr, !0),
                            n("workTime", 100),
                            n("workDelay", 100),
                            n("flattenSpans", !0, ji, !0),
                            n("addModeClass", !1, ji, !0),
                            n("pollInterval", 100),
                            n("undoDepth", 200, function (e, t) {
                                return (e.doc.history.undoDepth = t);
                            }),
                            n("historyEventDelay", 1250),
                            n(
                                "viewportMargin",
                                10,
                                function (e) {
                                    return e.refresh();
                                },
                                !0
                            ),
                            n("maxHighlightLength", 1e4, ji, !0),
                            n("moveInputWithCursor", !0, function (e, t) {
                                t || e.display.input.resetPosition();
                            }),
                            n("tabindex", null, function (e, t) {
                                return (e.display.input.getField().tabIndex = t || "");
                            }),
                            n("autofocus", null),
                            n(
                                "direction",
                                "ltr",
                                function (e, t) {
                                    return e.doc.setDirection(t);
                                },
                                !0
                            ),
                            n("phrases", null);
                    })(Ta),
                    (function (e) {
                        var t = e.optionHandlers,
                            n = (e.helpers = {});
                        (e.prototype = {
                            constructor: e,
                            focus: function () {
                                window.focus(), this.display.input.focus();
                            },
                            setOption: function (e, n) {
                                var r = this.options,
                                    i = r[e];
                                (r[e] == n && "mode" != e) || ((r[e] = n), t.hasOwnProperty(e) && ei(this, t[e])(this, n, i), pe(this, "optionChange", this, e));
                            },
                            getOption: function (e) {
                                return this.options[e];
                            },
                            getDoc: function () {
                                return this.doc;
                            },
                            addKeyMap: function (e, t) {
                                this.state.keyMaps[t ? "push" : "unshift"](Xo(e));
                            },
                            removeKeyMap: function (e) {
                                for (var t = this.state.keyMaps, n = 0; n < t.length; ++n) if (t[n] == e || t[n].name == e) return t.splice(n, 1), !0;
                            },
                            addOverlay: ti(function (t, n) {
                                var r = t.token ? t : e.getMode(this.options, t);
                                if (r.startState) throw new Error("Overlays may not be stateful.");
                                !(function (e, t, n) {
                                    for (var r = 0, i = n(t); r < e.length && n(e[r]) <= i; ) r++;
                                    e.splice(r, 0, t);
                                })(this.state.overlays, { mode: r, modeSpec: t, opaque: n && n.opaque, priority: (n && n.priority) || 0 }, function (e) {
                                    return e.priority;
                                }),
                                    this.state.modeGen++,
                                    dr(this);
                            }),
                            removeOverlay: ti(function (e) {
                                for (var t = this.state.overlays, n = 0; n < t.length; ++n) {
                                    var r = t[n].modeSpec;
                                    if (r == e || ("string" == typeof e && r.name == e)) return t.splice(n, 1), this.state.modeGen++, void dr(this);
                                }
                            }),
                            indentLine: ti(function (e, t, n) {
                                "string" != typeof t && "number" != typeof t && (t = null == t ? (this.options.smartIndent ? "smart" : "prev") : t ? "add" : "subtract"), Qe(this.doc, e) && La(this, e, t, n);
                            }),
                            indentSelection: ti(function (e) {
                                for (var t = this.doc.sel.ranges, n = -1, r = 0; r < t.length; r++) {
                                    var i = t[r];
                                    if (i.empty()) i.head.line > n && (La(this, i.head.line, e, !0), (n = i.head.line), r == this.doc.sel.primIndex && jr(this));
                                    else {
                                        var o = i.from(),
                                            a = i.to(),
                                            s = Math.max(n, o.line);
                                        n = Math.min(this.lastLine(), a.line - (a.ch ? 0 : 1)) + 1;
                                        for (var l = s; l < n; ++l) La(this, l, e);
                                        var c = this.doc.sel.ranges;
                                        0 == o.ch && t.length == c.length && c[r].from().ch > 0 && Xi(this.doc, r, new Ci(o, c[r].to()), H);
                                    }
                                }
                            }),
                            getTokenAt: function (e, t) {
                                return yt(this, e, t);
                            },
                            getLineTokens: function (e, t) {
                                return yt(this, et(e), t, !0);
                            },
                            getTokenTypeAt: function (e) {
                                e = st(this.doc, e);
                                var t,
                                    n = ft(this, Ge(this.doc, e.line)),
                                    r = 0,
                                    i = (n.length - 1) / 2,
                                    o = e.ch;
                                if (0 == o) t = n[2];
                                else
                                    for (;;) {
                                        var a = (r + i) >> 1;
                                        if ((a ? n[2 * a - 1] : 0) >= o) i = a;
                                        else {
                                            if (!(n[2 * a + 1] < o)) {
                                                t = n[2 * a + 2];
                                                break;
                                            }
                                            r = a + 1;
                                        }
                                    }
                                var s = t ? t.indexOf("overlay ") : -1;
                                return s < 0 ? t : 0 == s ? null : t.slice(0, s - 1);
                            },
                            getModeAt: function (t) {
                                var n = this.doc.mode;
                                return n.innerMode ? e.innerMode(n, this.getTokenAt(t).state).mode : n;
                            },
                            getHelper: function (e, t) {
                                return this.getHelpers(e, t)[0];
                            },
                            getHelpers: function (e, t) {
                                var r = [];
                                if (!n.hasOwnProperty(t)) return r;
                                var i = n[t],
                                    o = this.getModeAt(e);
                                if ("string" == typeof o[t]) i[o[t]] && r.push(i[o[t]]);
                                else if (o[t])
                                    for (var a = 0; a < o[t].length; a++) {
                                        var s = i[o[t][a]];
                                        s && r.push(s);
                                    }
                                else o.helperType && i[o.helperType] ? r.push(i[o.helperType]) : i[o.name] && r.push(i[o.name]);
                                for (var l = 0; l < i._global.length; l++) {
                                    var c = i._global[l];
                                    c.pred(o, this) && -1 == $(r, c.val) && r.push(c.val);
                                }
                                return r;
                            },
                            getStateAfter: function (e, t) {
                                var n = this.doc;
                                return ht(this, (e = at(n, null == e ? n.first + n.size - 1 : e)) + 1, t).state;
                            },
                            cursorCoords: function (e, t) {
                                var n = this.doc.sel.primary();
                                return qn(this, null == e ? n.head : "object" == typeof e ? st(this.doc, e) : e ? n.from() : n.to(), t || "page");
                            },
                            charCoords: function (e, t) {
                                return Gn(this, st(this.doc, e), t || "page");
                            },
                            coordsChar: function (e, t) {
                                return Xn(this, (e = Un(this, e, t || "page")).left, e.top);
                            },
                            lineAtHeight: function (e, t) {
                                return (e = Un(this, { top: e, left: 0 }, t || "page").top), Je(this.doc, e + this.display.viewOffset);
                            },
                            heightAtLine: function (e, t, n) {
                                var r,
                                    i = !1;
                                if ("number" == typeof e) {
                                    var o = this.doc.first + this.doc.size - 1;
                                    e < this.doc.first ? (e = this.doc.first) : e > o && ((e = o), (i = !0)), (r = Ge(this.doc, e));
                                } else r = e;
                                return Vn(this, r, { top: 0, left: 0 }, t || "page", n || i).top + (i ? this.doc.height - Bt(r) : 0);
                            },
                            defaultTextHeight: function () {
                                return rr(this.display);
                            },
                            defaultCharWidth: function () {
                                return ir(this.display);
                            },
                            getViewport: function () {
                                return { from: this.display.viewFrom, to: this.display.viewTo };
                            },
                            addWidget: function (e, t, n, r, i) {
                                var o,
                                    a,
                                    s,
                                    l = this.display,
                                    c = (e = qn(this, st(this.doc, e))).bottom,
                                    u = e.left;
                                if (((t.style.position = "absolute"), t.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(t), l.sizer.appendChild(t), "over" == r)) c = e.top;
                                else if ("above" == r || "near" == r) {
                                    var d = Math.max(l.wrapper.clientHeight, this.doc.height),
                                        f = Math.max(l.sizer.clientWidth, l.lineSpace.clientWidth);
                                    ("above" == r || e.bottom + t.offsetHeight > d) && e.top > t.offsetHeight ? (c = e.top - t.offsetHeight) : e.bottom + t.offsetHeight <= d && (c = e.bottom),
                                        u + t.offsetWidth > f && (u = f - t.offsetWidth);
                                }
                                (t.style.top = c + "px"),
                                    (t.style.left = t.style.right = ""),
                                    "right" == i ? ((u = l.sizer.clientWidth - t.offsetWidth), (t.style.right = "0px")) : ("left" == i ? (u = 0) : "middle" == i && (u = (l.sizer.clientWidth - t.offsetWidth) / 2), (t.style.left = u + "px")),
                                    n && ((o = this), (a = { left: u, top: c, right: u + t.offsetWidth, bottom: c + t.offsetHeight }), null != (s = Lr(o, a)).scrollTop && Ir(o, s.scrollTop), null != s.scrollLeft && Rr(o, s.scrollLeft));
                            },
                            triggerOnKeyDown: ti(ua),
                            triggerOnKeyPress: ti(fa),
                            triggerOnKeyUp: da,
                            triggerOnMouseDown: ti(ga),
                            execCommand: function (e) {
                                if (ta.hasOwnProperty(e)) return ta[e].call(null, this);
                            },
                            triggerElectric: ti(function (e) {
                                Na(this, e);
                            }),
                            findPosH: function (e, t, n, r) {
                                var i = 1;
                                t < 0 && ((i = -1), (t = -t));
                                for (var o = st(this.doc, e), a = 0; a < t && !(o = za(this.doc, o, i, n, r)).hitSide; ++a);
                                return o;
                            },
                            moveH: ti(function (e, t) {
                                var n = this;
                                this.extendSelectionsBy(function (r) {
                                    return n.display.shift || n.doc.extend || r.empty() ? za(n.doc, r.head, e, t, n.options.rtlMoveVisually) : e < 0 ? r.from() : r.to();
                                }, V);
                            }),
                            deleteH: ti(function (e, t) {
                                var n = this.doc.sel,
                                    r = this.doc;
                                n.somethingSelected()
                                    ? r.replaceSelection("", null, "+delete")
                                    : Jo(this, function (n) {
                                          var i = za(r, n.head, e, t, !1);
                                          return e < 0 ? { from: i, to: n.head } : { from: n.head, to: i };
                                      });
                            }),
                            findPosV: function (e, t, n, r) {
                                var i = 1,
                                    o = r;
                                t < 0 && ((i = -1), (t = -t));
                                for (var a = st(this.doc, e), s = 0; s < t; ++s) {
                                    var l = qn(this, a, "div");
                                    if ((null == o ? (o = l.left) : (l.left = o), (a = Wa(this, l, i, n)).hitSide)) break;
                                }
                                return a;
                            },
                            moveV: ti(function (e, t) {
                                var n = this,
                                    r = this.doc,
                                    i = [],
                                    o = !this.display.shift && !r.extend && r.sel.somethingSelected();
                                if (
                                    (r.extendSelectionsBy(function (a) {
                                        if (o) return e < 0 ? a.from() : a.to();
                                        var s = qn(n, a.head, "div");
                                        null != a.goalColumn && (s.left = a.goalColumn), i.push(s.left);
                                        var l = Wa(n, s, e, t);
                                        return "page" == t && a == r.sel.primary() && Or(n, Gn(n, l, "div").top - s.top), l;
                                    }, V),
                                    i.length)
                                )
                                    for (var a = 0; a < r.sel.ranges.length; a++) r.sel.ranges[a].goalColumn = i[a];
                            }),
                            findWordAt: function (e) {
                                var t = Ge(this.doc, e.line).text,
                                    n = e.ch,
                                    r = e.ch;
                                if (t) {
                                    var i = this.getHelper(e, "wordChars");
                                    ("before" != e.sticky && r != t.length) || !n ? ++r : --n;
                                    for (
                                        var o = t.charAt(n),
                                            a = ee(o, i)
                                                ? function (e) {
                                                      return ee(e, i);
                                                  }
                                                : /\s/.test(o)
                                                ? function (e) {
                                                      return /\s/.test(e);
                                                  }
                                                : function (e) {
                                                      return !/\s/.test(e) && !ee(e);
                                                  };
                                        n > 0 && a(t.charAt(n - 1));

                                    )
                                        --n;
                                    for (; r < t.length && a(t.charAt(r)); ) ++r;
                                }
                                return new Ci(et(e.line, n), et(e.line, r));
                            },
                            toggleOverwrite: function (e) {
                                (null != e && e == this.state.overwrite) ||
                                    ((this.state.overwrite = !this.state.overwrite) ? _(this.display.cursorDiv, "CodeMirror-overwrite") : M(this.display.cursorDiv, "CodeMirror-overwrite"),
                                    pe(this, "overwriteToggle", this, this.state.overwrite));
                            },
                            hasFocus: function () {
                                return this.display.input.getField() == E();
                            },
                            isReadOnly: function () {
                                return !(!this.options.readOnly && !this.doc.cantEdit);
                            },
                            scrollTo: ti(function (e, t) {
                                Er(this, e, t);
                            }),
                            getScrollInfo: function () {
                                var e = this.display.scroller;
                                return {
                                    left: e.scrollLeft,
                                    top: e.scrollTop,
                                    height: e.scrollHeight - Mn(this) - this.display.barHeight,
                                    width: e.scrollWidth - Mn(this) - this.display.barWidth,
                                    clientHeight: Dn(this),
                                    clientWidth: Tn(this),
                                };
                            },
                            scrollIntoView: ti(function (e, t) {
                                null == e
                                    ? ((e = { from: this.doc.sel.primary().head, to: null }), null == t && (t = this.options.cursorScrollMargin))
                                    : "number" == typeof e
                                    ? (e = { from: et(e, 0), to: null })
                                    : null == e.from && (e = { from: e, to: null }),
                                    e.to || (e.to = e.from),
                                    (e.margin = t || 0),
                                    null != e.from.line
                                        ? (function (e, t) {
                                              _r(e), (e.curOp.scrollToPos = t);
                                          })(this, e)
                                        : Nr(this, e.from, e.to, e.margin);
                            }),
                            setSize: ti(function (e, t) {
                                var n = this,
                                    r = function (e) {
                                        return "number" == typeof e || /^\d+$/.test(String(e)) ? e + "px" : e;
                                    };
                                null != e && (this.display.wrapper.style.width = r(e)), null != t && (this.display.wrapper.style.height = r(t)), this.options.lineWrapping && Wn(this);
                                var i = this.display.viewFrom;
                                this.doc.iter(i, this.display.viewTo, function (e) {
                                    if (e.widgets)
                                        for (var t = 0; t < e.widgets.length; t++)
                                            if (e.widgets[t].noHScroll) {
                                                fr(n, i, "widget");
                                                break;
                                            }
                                    ++i;
                                }),
                                    (this.curOp.forceUpdate = !0),
                                    pe(this, "refresh", this);
                            }),
                            operation: function (e) {
                                return Zr(this, e);
                            },
                            startOperation: function () {
                                return Gr(this);
                            },
                            endOperation: function () {
                                return qr(this);
                            },
                            refresh: ti(function () {
                                var e = this.display.cachedTextHeight;
                                dr(this),
                                    (this.curOp.forceUpdate = !0),
                                    $n(this),
                                    Er(this, this.doc.scrollLeft, this.doc.scrollTop),
                                    ci(this.display),
                                    (null == e || Math.abs(e - rr(this.display)) > 0.5 || this.options.lineWrapping) && lr(this),
                                    pe(this, "refresh", this);
                            }),
                            swapDoc: ti(function (e) {
                                var t = this.doc;
                                return (
                                    (t.cm = null),
                                    this.state.selectingText && this.state.selectingText(),
                                    Ii(this, e),
                                    $n(this),
                                    this.display.input.reset(),
                                    Er(this, e.scrollLeft, e.scrollTop),
                                    (this.curOp.forceScroll = !0),
                                    ln(this, "swapDoc", this, t),
                                    t
                                );
                            }),
                            phrase: function (e) {
                                var t = this.options.phrases;
                                return t && Object.prototype.hasOwnProperty.call(t, e) ? t[e] : e;
                            },
                            getInputField: function () {
                                return this.display.input.getField();
                            },
                            getWrapperElement: function () {
                                return this.display.wrapper;
                            },
                            getScrollerElement: function () {
                                return this.display.scroller;
                            },
                            getGutterElement: function () {
                                return this.display.gutters;
                            },
                        }),
                            ye(e),
                            (e.registerHelper = function (t, r, i) {
                                n.hasOwnProperty(t) || (n[t] = e[t] = { _global: [] }), (n[t][r] = i);
                            }),
                            (e.registerGlobalHelper = function (t, r, i, o) {
                                e.registerHelper(t, r, o), n[t]._global.push({ pred: i, val: o });
                            });
                    })(Ta);
                var Ga = "iter insert remove copy getEditor constructor".split(" ");
                for (var qa in jo.prototype)
                    jo.prototype.hasOwnProperty(qa) &&
                        $(Ga, qa) < 0 &&
                        (Ta.prototype[qa] = (function (e) {
                            return function () {
                                return e.apply(this.doc, arguments);
                            };
                        })(jo.prototype[qa]));
                return (
                    ye(jo),
                    (Ta.inputStyles = { textarea: Ua, contenteditable: $a }),
                    (Ta.defineMode = function (e) {
                        Ta.defaults.mode || "null" == e || (Ta.defaults.mode = e), Re.apply(this, arguments);
                    }),
                    (Ta.defineMIME = function (e, t) {
                        Fe[e] = t;
                    }),
                    Ta.defineMode("null", function () {
                        return {
                            token: function (e) {
                                return e.skipToEnd();
                            },
                        };
                    }),
                    Ta.defineMIME("text/plain", "null"),
                    (Ta.defineExtension = function (e, t) {
                        Ta.prototype[e] = t;
                    }),
                    (Ta.defineDocExtension = function (e, t) {
                        jo.prototype[e] = t;
                    }),
                    (Ta.fromTextArea = function (e, t) {
                        if ((((t = t ? R(t) : {}).value = e.value), !t.tabindex && e.tabIndex && (t.tabindex = e.tabIndex), !t.placeholder && e.placeholder && (t.placeholder = e.placeholder), null == t.autofocus)) {
                            var n = E();
                            t.autofocus = n == e || (null != e.getAttribute("autofocus") && n == document.body);
                        }
                        function r() {
                            e.value = s.getValue();
                        }
                        var i;
                        if (e.form && (de(e.form, "submit", r), !t.leaveSubmitMethodAlone)) {
                            var o = e.form;
                            i = o.submit;
                            try {
                                var a = (o.submit = function () {
                                    r(), (o.submit = i), o.submit(), (o.submit = a);
                                });
                            } catch (e) {}
                        }
                        (t.finishInit = function (n) {
                            (n.save = r),
                                (n.getTextArea = function () {
                                    return e;
                                }),
                                (n.toTextArea = function () {
                                    (n.toTextArea = isNaN),
                                        r(),
                                        e.parentNode.removeChild(n.getWrapperElement()),
                                        (e.style.display = ""),
                                        e.form && (he(e.form, "submit", r), t.leaveSubmitMethodAlone || "function" != typeof e.form.submit || (e.form.submit = i));
                                });
                        }),
                            (e.style.display = "none");
                        var s = Ta(function (t) {
                            return e.parentNode.insertBefore(t, e.nextSibling);
                        }, t);
                        return s;
                    }),
                    (function (e) {
                        (e.off = he),
                            (e.on = de),
                            (e.wheelEventPixels = xi),
                            (e.Doc = jo),
                            (e.splitLines = je),
                            (e.countColumn = z),
                            (e.findColumn = U),
                            (e.isWordChar = Z),
                            (e.Pass = P),
                            (e.signal = pe),
                            (e.Line = Gt),
                            (e.changeEnd = Mi),
                            (e.scrollbarModel = Br),
                            (e.Pos = et),
                            (e.cmpPos = tt),
                            (e.modes = Ie),
                            (e.mimeModes = Fe),
                            (e.resolveMode = ze),
                            (e.getMode = We),
                            (e.modeExtensions = $e),
                            (e.extendMode = Pe),
                            (e.copyState = He),
                            (e.startState = Ve),
                            (e.innerMode = Be),
                            (e.commands = ta),
                            (e.keyMap = Bo),
                            (e.keyName = Yo),
                            (e.isModifierKey = qo),
                            (e.lookupKey = Go),
                            (e.normalizeKeyMap = Uo),
                            (e.StringStream = Ue),
                            (e.SharedTextMarker = To),
                            (e.TextMarker = Ao),
                            (e.LineWidget = ko),
                            (e.e_preventDefault = be),
                            (e.e_stopPropagation = xe),
                            (e.e_stop = ke),
                            (e.addClass = _),
                            (e.contains = j),
                            (e.rmClass = M),
                            (e.keyNames = Wo);
                    })(Ta),
                    (Ta.version = "5.60.0"),
                    Ta
                );
            })();
        },
        function (e, t, n) {
            var r = n(4).Symbol;
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(7)(Object, "create");
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(81),
                i = n(82),
                o = n(83),
                a = n(84),
                s = n(85);
            function l(e) {
                var t = -1,
                    n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n; ) {
                    var r = e[t];
                    this.set(r[0], r[1]);
                }
            }
            (l.prototype.clear = r), (l.prototype.delete = i), (l.prototype.get = o), (l.prototype.has = a), (l.prototype.set = s), (e.exports = l);
        },
        function (e, t, n) {
            var r = n(45);
            e.exports = function (e, t) {
                for (var n = e.length; n--; ) if (r(e[n][0], t)) return n;
                return -1;
            };
        },
        function (e, t, n) {
            var r = n(87);
            e.exports = function (e, t) {
                var n = e.__data__;
                return r(t) ? n["string" == typeof t ? "string" : "hash"] : n.map;
            };
        },
        function (e, t, n) {
            var r = n(26),
                i = n(41);
            e.exports = function (e, t, n, o) {
                var a = !n;
                n || (n = {});
                for (var s = -1, l = t.length; ++s < l; ) {
                    var c = t[s],
                        u = o ? o(n[c], e[c], c, n, e) : void 0;
                    void 0 === u && (u = e[c]), a ? i(n, c, u) : r(n, c, u);
                }
                return n;
            };
        },
        function (e, t) {
            e.exports = function (e) {
                return void 0 === e;
            };
        },
        function (t, n) {
            t.exports = e;
        },
        function (e, t) {
            e.exports = function (e) {
                for (var t = -1, n = null == e ? 0 : e.length, r = 0, i = []; ++t < n; ) {
                    var o = e[t];
                    o && (i[r++] = o);
                }
                return i;
            };
        },
        function (e, t, n) {
            "use strict";
            var r = function () {
                var e = this,
                    t = e.$createElement,
                    n = e._self._c || t;
                return n(
                    "div",
                    { staticClass: "array-type" },
                    [
                        n(
                            "el-row",
                            { attrs: { type: "flex", align: "middle" } },
                            [
                                n(
                                    "el-col",
                                    { staticClass: "col-item name-item col-item-name", style: e.tagPaddingLeftStyle, attrs: { span: 8 } },
                                    [
                                        n(
                                            "el-row",
                                            { attrs: { type: "flex", justify: "space-around", align: "middle" } },
                                            [
                                                n("el-col", { staticClass: "down-style-col", attrs: { span: 2 } }, [
                                                    "object" === e.items.type
                                                        ? n("span", { staticClass: "down-style", on: { click: e.handleClickIcon } }, [
                                                              e.showIcon ? n("i", { staticClass: "el-icon-caret-right icon-object" }) : n("i", { staticClass: "el-icon-caret-bottom icon-object" }),
                                                          ])
                                                        : e._e(),
                                                ]),
                                                n("el-col", { attrs: { span: 20 } }, [n("el-input", { attrs: { disabled: "", value: "Items", size: "small" } })], 1),
                                                n(
                                                    "el-col",
                                                    { staticStyle: { "text-align": "center" }, attrs: { span: 4 } },
                                                    [n("el-tooltip", { attrs: { placement: "top", content: "Select all" } }, [n("el-checkbox", { attrs: { disabled: "" } })], 1)],
                                                    1
                                                ),
                                            ],
                                            1
                                        ),
                                    ],
                                    1
                                ),
                                n(
                                    "el-col",
                                    { staticClass: "col-item col-item-type", attrs: { span: 6 } },
                                    [
                                        n(
                                            "el-select",
                                            { staticClass: "type-select-style", attrs: { value: e.items.type, size: "small" }, on: { change: e.handleChangeType } },
                                            e._l(e.schemaTypes, function (e) {
                                                return n("el-option", { key: e, attrs: { value: e, label: e } });
                                            }),
                                            1
                                        ),
                                    ],
                                    1
                                ),
                                e.isMock
                                    ? n(
                                          "el-col",
                                          { staticClass: "col-item col-item-mock", attrs: { span: 3 } },
                                          [
                                              n("MockSelect", {
                                                  attrs: { schema: e.items },
                                                  on: {
                                                      showEdit: function (t) {
                                                          return e.handleAction({ eventType: "mock-edit" });
                                                      },
                                                      change: e.handleChangeMock,
                                                  },
                                              }),
                                          ],
                                          1
                                      )
                                    : e._e(),
                                e.showTitle
                                    ? n(
                                          "el-col",
                                          { staticClass: "col-item col-item-mock", attrs: { span: e.isMock ? 4 : 5 } },
                                          [
                                              n(
                                                  "el-input",
                                                  {
                                                      attrs: { placeholder: "标题", size: "small" },
                                                      model: {
                                                          value: e.items.title,
                                                          callback: function (t) {
                                                              e.$set(e.items, "title", t);
                                                          },
                                                          expression: "items.title",
                                                      },
                                                  },
                                                  [
                                                      n("i", {
                                                          staticClass: "el-icon-edit",
                                                          attrs: { slot: "append" },
                                                          on: {
                                                              click: function (t) {
                                                                  return e.handleAction({ eventType: "show-edit", field: "title" });
                                                              },
                                                          },
                                                          slot: "append",
                                                      }),
                                                  ]
                                              ),
                                          ],
                                          1
                                      )
                                    : e._e(),
                                !e.showTitle && e.showDefaultValue
                                    ? n(
                                          "el-col",
                                          { staticClass: "col-item col-item-mock", attrs: { span: e.isMock ? 4 : 5 } },
                                          [
                                              n(
                                                  "el-input",
                                                  {
                                                      attrs: { placeholder: "默认值", size: "small" },
                                                      model: {
                                                          value: e.items.default,
                                                          callback: function (t) {
                                                              e.$set(e.items, "default", t);
                                                          },
                                                          expression: "items.default",
                                                      },
                                                  },
                                                  [
                                                      n("i", {
                                                          staticClass: "el-icon-edit",
                                                          attrs: { slot: "append" },
                                                          on: {
                                                              click: function (t) {
                                                                  return e.handleAction({ eventType: "show-edit", field: "default" });
                                                              },
                                                          },
                                                          slot: "append",
                                                      }),
                                                  ]
                                              ),
                                          ],
                                          1
                                      )
                                    : e._e(),
                                n("el-col", { staticClass: "col-item col-item-setting", attrs: { span: 12, align: "right" } }, [
                                    n(
                                        "span",
                                        {
                                            staticClass: "adv-set adv-set--left-pad",
                                            on: {
                                                click: function (t) {
                                                    return e.handleAction({ eventType: "setting", schemaType: e.items.type });
                                                },
                                            },
                                        },
                                        [n("el-tooltip", { attrs: { placement: "top", content: "Settings" } }, [n("i", { staticClass: "el-icon-setting" })])],
                                        1
                                    ),
                                    "object" === e.items.type
                                        ? n(
                                              "span",
                                              {
                                                  staticClass : "add-field add-field--right-pad",
                                                  on: {
                                                      click: function (t) {
                                                          return e.handleAction({ eventType: "add-field", isChild: !0 });
                                                      },
                                                  },
                                              },
                                              [n("el-tooltip", { attrs: { placement: "top", content: "Add field" } }, [n("i", { staticClass: "el-icon-plus plus" })])],
                                              1
                                          )
                                        : e._e(),
                                ]),
                            ],
                            1
                        ),
                        n(
                            "div",
                            { staticClass: "option-formStyle" },
                            [
                                "array" === e.items.type
                                    ? [n("SchemaArray", { attrs: { prefix: e.prefixArray, data: e.items, "is-mock": e.isMock, "show-title": e.showTitle, "show-default-value": e.showDefaultValue, "editor-id": e.editorId } })]
                                    : e._e(),
                                "object" !== e.items.type || e.showIcon
                                    ? e._e()
                                    : [n("SchemaObject", { attrs: { prefix: e.nameArray, data: e.items, "is-mock": e.isMock, "show-title": e.showTitle, "show-default-value": e.showDefaultValue, "editor-id": e.editorId } })],
                            ],
                            2
                        ),
                    ],
                    1
                );
            };
            r._withStripped = !0;
            var i = n(22),
                o = n.n(i),
                a = n(12),
                s = n(13),
                l = n(0),
                c = {
                    name: "SchemaArray",
                    components: { MockSelect: a.a, SchemaObject: s.a },
                    props: {
                        isMock: { type: Boolean, default: !1 },
                        showTitle: { type: Boolean, default: !1 },
                        showDefaultValue: { type: Boolean, default: !1 },
                        editorId: { type: String, default: "editor_id" },
                        name: { type: String, default: "" },
                        prefix: { type: Array, default: () => [] },
                        data: { type: Object, default: () => {} },
                        action: { type: Function, default: () => () => {} },
                    },
                    data() {
                        return { tagPaddingLeftStyle: {}, schemaTypes: l.b, items: this.data.items, showIcon: !1 };
                    },
                    computed: {
                        nameArray() {
                            return [].concat(this.prefixArray, "properties");
                        },
                        prefixArray() {
                            return [].concat(this.prefix, "items");
                        },
                    },
                    beforeMount() {
                        const e = this.prefix.filter((e) => "properties" !== e).length;
                        this.tagPaddingLeftStyle = { paddingLeft: 20 * (e + 1) + "px" };
                    },
                    methods: {
                        isUndefined: () => o.a,
                        handleClickIcon() {
                            this.showIcon = !this.showIcon;
                        },
                        handleAction(e) {
                            const { prefix: t, name: n } = this;
                            this.$jsEditorEvent.emit("schema-update-" + this.editorId, { prefix: t, name: n || "items", ...e });
                        },
                        handleChangeMock() {},
                        handleChangeType(e) {
                            console.log(e), this.handleAction({ eventType: "schema-type", value: e });
                        },
                    },
                },
                u = n(1),
                d = Object(u.a)(c, r, [], !1, null, null, null);
            d.options.__file = "src/Schema/SchemaArray.vue";
            t.a = d.exports;
        },
        function (e, t, n) {
            var r = n(41),
                i = n(45),
                o = Object.prototype.hasOwnProperty;
            e.exports = function (e, t, n) {
                var a = e[t];
                (o.call(e, t) && i(a, n) && (void 0 !== n || t in e)) || r(e, t, n);
            };
        },
        function (e, t, n) {
            var r = n(9),
                i = n(70),
                o = n(71),
                a = n(91);
            e.exports = function (e, t) {
                return r(e) ? e : i(e, t) ? [e] : o(a(e));
            };
        },
        function (e, t, n) {
            var r = n(14),
                i = n(10);
            e.exports = function (e) {
                return "symbol" == typeof e || (i(e) && "[object Symbol]" == r(e));
            };
        },
        function (e, t, n) {
            var r = n(7)(n(4), "Map");
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(28);
            e.exports = function (e) {
                if ("string" == typeof e || r(e)) return e;
                var t = e + "";
                return "0" == t && 1 / e == -1 / 0 ? "-0" : t;
            };
        },
        function (e, t, n) {
            var r = n(49),
                i = n(113),
                o = n(53);
            e.exports = function (e) {
                return o(e) ? r(e) : i(e);
            };
        },
        function (e, t) {
            e.exports = function (e) {
                return (
                    e.webpackPolyfill ||
                        ((e.deprecate = function () {}),
                        (e.paths = []),
                        e.children || (e.children = []),
                        Object.defineProperty(e, "loaded", {
                            enumerable: !0,
                            get: function () {
                                return e.l;
                            },
                        }),
                        Object.defineProperty(e, "id", {
                            enumerable: !0,
                            get: function () {
                                return e.i;
                            },
                        }),
                        (e.webpackPolyfill = 1)),
                    e
                );
            };
        },
        function (e, t) {
            e.exports = function (e) {
                return function (t) {
                    return e(t);
                };
            };
        },
        function (e, t, n) {
            (function (e) {
                var r = n(43),
                    i = t && !t.nodeType && t,
                    o = i && "object" == typeof e && e && !e.nodeType && e,
                    a = o && o.exports === i && r.process,
                    s = (function () {
                        try {
                            var e = o && o.require && o.require("util").types;
                            return e || (a && a.binding && a.binding("util"));
                        } catch (e) {}
                    })();
                e.exports = s;
            }.call(this, n(32)(e)));
        },
        function (e, t) {
            var n = Object.prototype;
            e.exports = function (e) {
                var t = e && e.constructor;
                return e === (("function" == typeof t && t.prototype) || n);
            };
        },
        function (e, t, n) {
            var r = n(49),
                i = n(116),
                o = n(53);
            e.exports = function (e) {
                return o(e) ? r(e, !0) : i(e);
            };
        },
        function (e, t, n) {
            var r = n(121),
                i = n(54),
                o = Object.prototype.propertyIsEnumerable,
                a = Object.getOwnPropertySymbols,
                s = a
                    ? function (e) {
                          return null == e
                              ? []
                              : ((e = Object(e)),
                                r(a(e), function (t) {
                                    return o.call(e, t);
                                }));
                      }
                    : i;
            e.exports = s;
        },
        function (e, t, n) {
            var r = n(125),
                i = n(29),
                o = n(126),
                a = n(127),
                s = n(128),
                l = n(14),
                c = n(44),
                u = c(r),
                d = c(i),
                f = c(o),
                h = c(a),
                p = c(s),
                m = l;
            ((r && "[object DataView]" != m(new r(new ArrayBuffer(1)))) ||
                (i && "[object Map]" != m(new i())) ||
                (o && "[object Promise]" != m(o.resolve())) ||
                (a && "[object Set]" != m(new a())) ||
                (s && "[object WeakMap]" != m(new s()))) &&
                (m = function (e) {
                    var t = l(e),
                        n = "[object Object]" == t ? e.constructor : void 0,
                        r = n ? c(n) : "";
                    if (r)
                        switch (r) {
                            case u:
                                return "[object DataView]";
                            case d:
                                return "[object Map]";
                            case f:
                                return "[object Promise]";
                            case h:
                                return "[object Set]";
                            case p:
                                return "[object WeakMap]";
                        }
                    return t;
                }),
                (e.exports = m);
        },
        function (e, t, n) {
            var r = n(131);
            e.exports = function (e) {
                var t = new e.constructor(e.byteLength);
                return new r(t).set(new r(e)), t;
            };
        },
        function (e, t, n) {
            var r = n(94);
            e.exports = function (e, t) {
                return null == e || r(e, t);
            };
        },
        function (e, t, n) {
            var r = n(62);
            e.exports = function (e, t, n) {
                "__proto__" == t && r ? r(e, t, { configurable: !0, enumerable: !0, value: n, writable: !0 }) : (e[t] = n);
            };
        },
        function (e, t, n) {
            var r = n(14),
                i = n(8);
            e.exports = function (e) {
                if (!i(e)) return !1;
                var t = r(e);
                return "[object Function]" == t || "[object GeneratorFunction]" == t || "[object AsyncFunction]" == t || "[object Proxy]" == t;
            };
        },
        function (e, t, n) {
            (function (t) {
                var n = "object" == typeof t && t && t.Object === Object && t;
                e.exports = n;
            }.call(this, n(64)));
        },
        function (e, t) {
            var n = Function.prototype.toString;
            e.exports = function (e) {
                if (null != e) {
                    try {
                        return n.call(e);
                    } catch (e) {}
                    try {
                        return e + "";
                    } catch (e) {}
                }
                return "";
            };
        },
        function (e, t) {
            e.exports = function (e, t) {
                return e === t || (e != e && t != t);
            };
        },
        function (e, t, n) {
            var r = n(74),
                i = n(86),
                o = n(88),
                a = n(89),
                s = n(90);
            function l(e) {
                var t = -1,
                    n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n; ) {
                    var r = e[t];
                    this.set(r[0], r[1]);
                }
            }
            (l.prototype.clear = r), (l.prototype.delete = i), (l.prototype.get = o), (l.prototype.has = a), (l.prototype.set = s), (e.exports = l);
        },
        function (e, t) {
            var n = /^(?:0|[1-9]\d*)$/;
            e.exports = function (e, t) {
                var r = typeof e;
                return !!(t = null == t ? 9007199254740991 : t) && ("number" == r || ("symbol" != r && n.test(e))) && e > -1 && e % 1 == 0 && e < t;
            };
        },
        function (e, t, n) {
            var r = n(27),
                i = n(30);
            e.exports = function (e, t) {
                for (var n = 0, o = (t = r(t, e)).length; null != e && n < o; ) e = e[i(t[n++])];
                return n && n == o ? e : void 0;
            };
        },
        function (e, t, n) {
            var r = n(107),
                i = n(108),
                o = n(9),
                a = n(50),
                s = n(47),
                l = n(111),
                c = Object.prototype.hasOwnProperty;
            e.exports = function (e, t) {
                var n = o(e),
                    u = !n && i(e),
                    d = !n && !u && a(e),
                    f = !n && !u && !d && l(e),
                    h = n || u || d || f,
                    p = h ? r(e.length, String) : [],
                    m = p.length;
                for (var g in e) (!t && !c.call(e, g)) || (h && ("length" == g || (d && ("offset" == g || "parent" == g)) || (f && ("buffer" == g || "byteLength" == g || "byteOffset" == g)) || s(g, m))) || p.push(g);
                return p;
            };
        },
        function (e, t, n) {
            (function (e) {
                var r = n(4),
                    i = n(110),
                    o = t && !t.nodeType && t,
                    a = o && "object" == typeof e && e && !e.nodeType && e,
                    s = a && a.exports === o ? r.Buffer : void 0,
                    l = (s ? s.isBuffer : void 0) || i;
                e.exports = l;
            }.call(this, n(32)(e)));
        },
        function (e, t) {
            e.exports = function (e) {
                return "number" == typeof e && e > -1 && e % 1 == 0 && e <= 9007199254740991;
            };
        },
        function (e, t) {
            e.exports = function (e, t) {
                return function (n) {
                    return e(t(n));
                };
            };
        },
        function (e, t, n) {
            var r = n(42),
                i = n(51);
            e.exports = function (e) {
                return null != e && i(e.length) && !r(e);
            };
        },
        function (e, t) {
            e.exports = function () {
                return [];
            };
        },
        function (e, t, n) {
            var r = n(56),
                i = n(57),
                o = n(37),
                a = n(54),
                s = Object.getOwnPropertySymbols
                    ? function (e) {
                          for (var t = []; e; ) r(t, o(e)), (e = i(e));
                          return t;
                      }
                    : a;
            e.exports = s;
        },
        function (e, t) {
            e.exports = function (e, t) {
                for (var n = -1, r = t.length, i = e.length; ++n < r; ) e[i + n] = t[n];
                return e;
            };
        },
        function (e, t, n) {
            var r = n(52)(Object.getPrototypeOf, Object);
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(56),
                i = n(9);
            e.exports = function (e, t, n) {
                var o = t(e);
                return i(e) ? o : r(o, n(e));
            };
        },
        function (e, t, n) {
            var r = n(11),
                i = n(160);
            "string" == typeof (i = i.__esModule ? i.default : i) && (i = [[e.i, i, ""]]);
            var o = { insert: "head", singleton: !1 };
            r(i, o);
            e.exports = i.locals || {};
        },
        function (e, t, n) {
            e.exports = n(161);
        },
        function (e, t, n) {
            var r = n(26),
                i = n(27),
                o = n(47),
                a = n(8),
                s = n(30);
            e.exports = function (e, t, n, l) {
                if (!a(e)) return e;
                for (var c = -1, u = (t = i(t, e)).length, d = u - 1, f = e; null != f && ++c < u; ) {
                    var h = s(t[c]),
                        p = n;
                    if ("__proto__" === h || "constructor" === h || "prototype" === h) return e;
                    if (c != d) {
                        var m = f[h];
                        void 0 === (p = l ? l(m, h, f) : void 0) && (p = a(m) ? m : o(t[c + 1]) ? [] : {});
                    }
                    r(f, h, p), (f = f[h]);
                }
                return e;
            };
        },
        function (e, t, n) {
            var r = n(7),
                i = (function () {
                    try {
                        var e = r(Object, "defineProperty");
                        return e({}, "", {}), e;
                    } catch (e) {}
                })();
            e.exports = i;
        },
        function (e, t, n) {
            var r = n(42),
                i = n(67),
                o = n(8),
                a = n(44),
                s = /^\[object .+?Constructor\]$/,
                l = Function.prototype,
                c = Object.prototype,
                u = l.toString,
                d = c.hasOwnProperty,
                f = RegExp(
                    "^" +
                        u
                            .call(d)
                            .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
                        "$"
                );
            e.exports = function (e) {
                return !(!o(e) || i(e)) && (r(e) ? f : s).test(a(e));
            };
        },
        function (e, t) {
            var n;
            n = (function () {
                return this;
            })();
            try {
                n = n || new Function("return this")();
            } catch (e) {
                "object" == typeof window && (n = window);
            }
            e.exports = n;
        },
        function (e, t, n) {
            var r = n(16),
                i = Object.prototype,
                o = i.hasOwnProperty,
                a = i.toString,
                s = r ? r.toStringTag : void 0;
            e.exports = function (e) {
                var t = o.call(e, s),
                    n = e[s];
                try {
                    e[s] = void 0;
                    var r = !0;
                } catch (e) {}
                var i = a.call(e);
                return r && (t ? (e[s] = n) : delete e[s]), i;
            };
        },
        function (e, t) {
            var n = Object.prototype.toString;
            e.exports = function (e) {
                return n.call(e);
            };
        },
        function (e, t, n) {
            var r,
                i = n(68),
                o = (r = /[^.]+$/.exec((i && i.keys && i.keys.IE_PROTO) || "")) ? "Symbol(src)_1." + r : "";
            e.exports = function (e) {
                return !!o && o in e;
            };
        },
        function (e, t, n) {
            var r = n(4)["__core-js_shared__"];
            e.exports = r;
        },
        function (e, t) {
            e.exports = function (e, t) {
                return null == e ? void 0 : e[t];
            };
        },
        function (e, t, n) {
            var r = n(9),
                i = n(28),
                o = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                a = /^\w*$/;
            e.exports = function (e, t) {
                if (r(e)) return !1;
                var n = typeof e;
                return !("number" != n && "symbol" != n && "boolean" != n && null != e && !i(e)) || a.test(e) || !o.test(e) || (null != t && e in Object(t));
            };
        },
        function (e, t, n) {
            var r = n(72),
                i = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
                o = /\\(\\)?/g,
                a = r(function (e) {
                    var t = [];
                    return (
                        46 === e.charCodeAt(0) && t.push(""),
                        e.replace(i, function (e, n, r, i) {
                            t.push(r ? i.replace(o, "$1") : n || e);
                        }),
                        t
                    );
                });
            e.exports = a;
        },
        function (e, t, n) {
            var r = n(73);
            e.exports = function (e) {
                var t = r(e, function (e) {
                        return 500 === n.size && n.clear(), e;
                    }),
                    n = t.cache;
                return t;
            };
        },
        function (e, t, n) {
            var r = n(46);
            function i(e, t) {
                if ("function" != typeof e || (null != t && "function" != typeof t)) throw new TypeError("Expected a function");
                var n = function () {
                    var r = arguments,
                        i = t ? t.apply(this, r) : r[0],
                        o = n.cache;
                    if (o.has(i)) return o.get(i);
                    var a = e.apply(this, r);
                    return (n.cache = o.set(i, a) || o), a;
                };
                return (n.cache = new (i.Cache || r)()), n;
            }
            (i.Cache = r), (e.exports = i);
        },
        function (e, t, n) {
            var r = n(75),
                i = n(18),
                o = n(29);
            e.exports = function () {
                (this.size = 0), (this.__data__ = { hash: new r(), map: new (o || i)(), string: new r() });
            };
        },
        function (e, t, n) {
            var r = n(76),
                i = n(77),
                o = n(78),
                a = n(79),
                s = n(80);
            function l(e) {
                var t = -1,
                    n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n; ) {
                    var r = e[t];
                    this.set(r[0], r[1]);
                }
            }
            (l.prototype.clear = r), (l.prototype.delete = i), (l.prototype.get = o), (l.prototype.has = a), (l.prototype.set = s), (e.exports = l);
        },
        function (e, t, n) {
            var r = n(17);
            e.exports = function () {
                (this.__data__ = r ? r(null) : {}), (this.size = 0);
            };
        },
        function (e, t) {
            e.exports = function (e) {
                var t = this.has(e) && delete this.__data__[e];
                return (this.size -= t ? 1 : 0), t;
            };
        },
        function (e, t, n) {
            var r = n(17),
                i = Object.prototype.hasOwnProperty;
            e.exports = function (e) {
                var t = this.__data__;
                if (r) {
                    var n = t[e];
                    return "__lodash_hash_undefined__" === n ? void 0 : n;
                }
                return i.call(t, e) ? t[e] : void 0;
            };
        },
        function (e, t, n) {
            var r = n(17),
                i = Object.prototype.hasOwnProperty;
            e.exports = function (e) {
                var t = this.__data__;
                return r ? void 0 !== t[e] : i.call(t, e);
            };
        },
        function (e, t, n) {
            var r = n(17);
            e.exports = function (e, t) {
                var n = this.__data__;
                return (this.size += this.has(e) ? 0 : 1), (n[e] = r && void 0 === t ? "__lodash_hash_undefined__" : t), this;
            };
        },
        function (e, t) {
            e.exports = function () {
                (this.__data__ = []), (this.size = 0);
            };
        },
        function (e, t, n) {
            var r = n(19),
                i = Array.prototype.splice;
            e.exports = function (e) {
                var t = this.__data__,
                    n = r(t, e);
                return !(n < 0) && (n == t.length - 1 ? t.pop() : i.call(t, n, 1), --this.size, !0);
            };
        },
        function (e, t, n) {
            var r = n(19);
            e.exports = function (e) {
                var t = this.__data__,
                    n = r(t, e);
                return n < 0 ? void 0 : t[n][1];
            };
        },
        function (e, t, n) {
            var r = n(19);
            e.exports = function (e) {
                return r(this.__data__, e) > -1;
            };
        },
        function (e, t, n) {
            var r = n(19);
            e.exports = function (e, t) {
                var n = this.__data__,
                    i = r(n, e);
                return i < 0 ? (++this.size, n.push([e, t])) : (n[i][1] = t), this;
            };
        },
        function (e, t, n) {
            var r = n(20);
            e.exports = function (e) {
                var t = r(this, e).delete(e);
                return (this.size -= t ? 1 : 0), t;
            };
        },
        function (e, t) {
            e.exports = function (e) {
                var t = typeof e;
                return "string" == t || "number" == t || "symbol" == t || "boolean" == t ? "__proto__" !== e : null === e;
            };
        },
        function (e, t, n) {
            var r = n(20);
            e.exports = function (e) {
                return r(this, e).get(e);
            };
        },
        function (e, t, n) {
            var r = n(20);
            e.exports = function (e) {
                return r(this, e).has(e);
            };
        },
        function (e, t, n) {
            var r = n(20);
            e.exports = function (e, t) {
                var n = r(this, e),
                    i = n.size;
                return n.set(e, t), (this.size += n.size == i ? 0 : 1), this;
            };
        },
        function (e, t, n) {
            var r = n(92);
            e.exports = function (e) {
                return null == e ? "" : r(e);
            };
        },
        function (e, t, n) {
            var r = n(16),
                i = n(93),
                o = n(9),
                a = n(28),
                s = r ? r.prototype : void 0,
                l = s ? s.toString : void 0;
            e.exports = function e(t) {
                if ("string" == typeof t) return t;
                if (o(t)) return i(t, e) + "";
                if (a(t)) return l ? l.call(t) : "";
                var n = t + "";
                return "0" == n && 1 / t == -1 / 0 ? "-0" : n;
            };
        },
        function (e, t) {
            e.exports = function (e, t) {
                for (var n = -1, r = null == e ? 0 : e.length, i = Array(r); ++n < r; ) i[n] = t(e[n], n, e);
                return i;
            };
        },
        function (e, t, n) {
            var r = n(27),
                i = n(95),
                o = n(96),
                a = n(30);
            e.exports = function (e, t) {
                return (t = r(t, e)), null == (e = o(e, t)) || delete e[a(i(t))];
            };
        },
        function (e, t) {
            e.exports = function (e) {
                var t = null == e ? 0 : e.length;
                return t ? e[t - 1] : void 0;
            };
        },
        function (e, t, n) {
            var r = n(48),
                i = n(97);
            e.exports = function (e, t) {
                return t.length < 2 ? e : r(e, i(t, 0, -1));
            };
        },
        function (e, t) {
            e.exports = function (e, t, n) {
                var r = -1,
                    i = e.length;
                t < 0 && (t = -t > i ? 0 : i + t), (n = n > i ? i : n) < 0 && (n += i), (i = t > n ? 0 : (n - t) >>> 0), (t >>>= 0);
                for (var o = Array(i); ++r < i; ) o[r] = e[r + t];
                return o;
            };
        },
        function (e, t, n) {
            var r = n(99),
                i = n(105),
                o = n(26),
                a = n(106),
                s = n(115),
                l = n(118),
                c = n(119),
                u = n(120),
                d = n(122),
                f = n(123),
                h = n(124),
                p = n(38),
                m = n(129),
                g = n(130),
                v = n(136),
                y = n(9),
                b = n(50),
                x = n(138),
                w = n(8),
                k = n(140),
                C = n(31),
                S = n(36),
                A = {};
            (A["[object Arguments]"] = A["[object Array]"] = A["[object ArrayBuffer]"] = A["[object DataView]"] = A["[object Boolean]"] = A["[object Date]"] = A["[object Float32Array]"] = A["[object Float64Array]"] = A[
                "[object Int8Array]"
            ] = A["[object Int16Array]"] = A["[object Int32Array]"] = A["[object Map]"] = A["[object Number]"] = A["[object Object]"] = A["[object RegExp]"] = A["[object Set]"] = A["[object String]"] = A["[object Symbol]"] = A[
                "[object Uint8Array]"
            ] = A["[object Uint8ClampedArray]"] = A["[object Uint16Array]"] = A["[object Uint32Array]"] = !0),
                (A["[object Error]"] = A["[object Function]"] = A["[object WeakMap]"] = !1),
                (e.exports = function e(t, n, M, T, D, L) {
                    var O,
                        j = 1 & n,
                        E = 2 & n,
                        _ = 4 & n;
                    if ((M && (O = D ? M(t, T, D, L) : M(t)), void 0 !== O)) return O;
                    if (!w(t)) return t;
                    var N = y(t);
                    if (N) {
                        if (((O = m(t)), !j)) return c(t, O);
                    } else {
                        var I = p(t),
                            F = "[object Function]" == I || "[object GeneratorFunction]" == I;
                        if (b(t)) return l(t, j);
                        if ("[object Object]" == I || "[object Arguments]" == I || (F && !D)) {
                            if (((O = E || F ? {} : v(t)), !j)) return E ? d(t, s(O, t)) : u(t, a(O, t));
                        } else {
                            if (!A[I]) return D ? t : {};
                            O = g(t, I, j);
                        }
                    }
                    L || (L = new r());
                    var R = L.get(t);
                    if (R) return R;
                    L.set(t, O),
                        k(t)
                            ? t.forEach(function (r) {
                                  O.add(e(r, n, M, r, t, L));
                              })
                            : x(t) &&
                              t.forEach(function (r, i) {
                                  O.set(i, e(r, n, M, i, t, L));
                              });
                    var z = N ? void 0 : (_ ? (E ? h : f) : E ? S : C)(t);
                    return (
                        i(z || t, function (r, i) {
                            z && (r = t[(i = r)]), o(O, i, e(r, n, M, i, t, L));
                        }),
                        O
                    );
                });
        },
        function (e, t, n) {
            var r = n(18),
                i = n(100),
                o = n(101),
                a = n(102),
                s = n(103),
                l = n(104);
            function c(e) {
                var t = (this.__data__ = new r(e));
                this.size = t.size;
            }
            (c.prototype.clear = i), (c.prototype.delete = o), (c.prototype.get = a), (c.prototype.has = s), (c.prototype.set = l), (e.exports = c);
        },
        function (e, t, n) {
            var r = n(18);
            e.exports = function () {
                (this.__data__ = new r()), (this.size = 0);
            };
        },
        function (e, t) {
            e.exports = function (e) {
                var t = this.__data__,
                    n = t.delete(e);
                return (this.size = t.size), n;
            };
        },
        function (e, t) {
            e.exports = function (e) {
                return this.__data__.get(e);
            };
        },
        function (e, t) {
            e.exports = function (e) {
                return this.__data__.has(e);
            };
        },
        function (e, t, n) {
            var r = n(18),
                i = n(29),
                o = n(46);
            e.exports = function (e, t) {
                var n = this.__data__;
                if (n instanceof r) {
                    var a = n.__data__;
                    if (!i || a.length < 199) return a.push([e, t]), (this.size = ++n.size), this;
                    n = this.__data__ = new o(a);
                }
                return n.set(e, t), (this.size = n.size), this;
            };
        },
        function (e, t) {
            e.exports = function (e, t) {
                for (var n = -1, r = null == e ? 0 : e.length; ++n < r && !1 !== t(e[n], n, e); );
                return e;
            };
        },
        function (e, t, n) {
            var r = n(21),
                i = n(31);
            e.exports = function (e, t) {
                return e && r(t, i(t), e);
            };
        },
        function (e, t) {
            e.exports = function (e, t) {
                for (var n = -1, r = Array(e); ++n < e; ) r[n] = t(n);
                return r;
            };
        },
        function (e, t, n) {
            var r = n(109),
                i = n(10),
                o = Object.prototype,
                a = o.hasOwnProperty,
                s = o.propertyIsEnumerable,
                l = r(
                    (function () {
                        return arguments;
                    })()
                )
                    ? r
                    : function (e) {
                          return i(e) && a.call(e, "callee") && !s.call(e, "callee");
                      };
            e.exports = l;
        },
        function (e, t, n) {
            var r = n(14),
                i = n(10);
            e.exports = function (e) {
                return i(e) && "[object Arguments]" == r(e);
            };
        },
        function (e, t) {
            e.exports = function () {
                return !1;
            };
        },
        function (e, t, n) {
            var r = n(112),
                i = n(33),
                o = n(34),
                a = o && o.isTypedArray,
                s = a ? i(a) : r;
            e.exports = s;
        },
        function (e, t, n) {
            var r = n(14),
                i = n(51),
                o = n(10),
                a = {};
            (a["[object Float32Array]"] = a["[object Float64Array]"] = a["[object Int8Array]"] = a["[object Int16Array]"] = a["[object Int32Array]"] = a["[object Uint8Array]"] = a["[object Uint8ClampedArray]"] = a[
                "[object Uint16Array]"
            ] = a["[object Uint32Array]"] = !0),
                (a["[object Arguments]"] = a["[object Array]"] = a["[object ArrayBuffer]"] = a["[object Boolean]"] = a["[object DataView]"] = a["[object Date]"] = a["[object Error]"] = a["[object Function]"] = a["[object Map]"] = a[
                    "[object Number]"
                ] = a["[object Object]"] = a["[object RegExp]"] = a["[object Set]"] = a["[object String]"] = a["[object WeakMap]"] = !1),
                (e.exports = function (e) {
                    return o(e) && i(e.length) && !!a[r(e)];
                });
        },
        function (e, t, n) {
            var r = n(35),
                i = n(114),
                o = Object.prototype.hasOwnProperty;
            e.exports = function (e) {
                if (!r(e)) return i(e);
                var t = [];
                for (var n in Object(e)) o.call(e, n) && "constructor" != n && t.push(n);
                return t;
            };
        },
        function (e, t, n) {
            var r = n(52)(Object.keys, Object);
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(21),
                i = n(36);
            e.exports = function (e, t) {
                return e && r(t, i(t), e);
            };
        },
        function (e, t, n) {
            var r = n(8),
                i = n(35),
                o = n(117),
                a = Object.prototype.hasOwnProperty;
            e.exports = function (e) {
                if (!r(e)) return o(e);
                var t = i(e),
                    n = [];
                for (var s in e) ("constructor" != s || (!t && a.call(e, s))) && n.push(s);
                return n;
            };
        },
        function (e, t) {
            e.exports = function (e) {
                var t = [];
                if (null != e) for (var n in Object(e)) t.push(n);
                return t;
            };
        },
        function (e, t, n) {
            (function (e) {
                var r = n(4),
                    i = t && !t.nodeType && t,
                    o = i && "object" == typeof e && e && !e.nodeType && e,
                    a = o && o.exports === i ? r.Buffer : void 0,
                    s = a ? a.allocUnsafe : void 0;
                e.exports = function (e, t) {
                    if (t) return e.slice();
                    var n = e.length,
                        r = s ? s(n) : new e.constructor(n);
                    return e.copy(r), r;
                };
            }.call(this, n(32)(e)));
        },
        function (e, t) {
            e.exports = function (e, t) {
                var n = -1,
                    r = e.length;
                for (t || (t = Array(r)); ++n < r; ) t[n] = e[n];
                return t;
            };
        },
        function (e, t, n) {
            var r = n(21),
                i = n(37);
            e.exports = function (e, t) {
                return r(e, i(e), t);
            };
        },
        function (e, t) {
            e.exports = function (e, t) {
                for (var n = -1, r = null == e ? 0 : e.length, i = 0, o = []; ++n < r; ) {
                    var a = e[n];
                    t(a, n, e) && (o[i++] = a);
                }
                return o;
            };
        },
        function (e, t, n) {
            var r = n(21),
                i = n(55);
            e.exports = function (e, t) {
                return r(e, i(e), t);
            };
        },
        function (e, t, n) {
            var r = n(58),
                i = n(37),
                o = n(31);
            e.exports = function (e) {
                return r(e, o, i);
            };
        },
        function (e, t, n) {
            var r = n(58),
                i = n(55),
                o = n(36);
            e.exports = function (e) {
                return r(e, o, i);
            };
        },
        function (e, t, n) {
            var r = n(7)(n(4), "DataView");
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(7)(n(4), "Promise");
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(7)(n(4), "Set");
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(7)(n(4), "WeakMap");
            e.exports = r;
        },
        function (e, t) {
            var n = Object.prototype.hasOwnProperty;
            e.exports = function (e) {
                var t = e.length,
                    r = new e.constructor(t);
                return t && "string" == typeof e[0] && n.call(e, "index") && ((r.index = e.index), (r.input = e.input)), r;
            };
        },
        function (e, t, n) {
            var r = n(39),
                i = n(132),
                o = n(133),
                a = n(134),
                s = n(135);
            e.exports = function (e, t, n) {
                var l = e.constructor;
                switch (t) {
                    case "[object ArrayBuffer]":
                        return r(e);
                    case "[object Boolean]":
                    case "[object Date]":
                        return new l(+e);
                    case "[object DataView]":
                        return i(e, n);
                    case "[object Float32Array]":
                    case "[object Float64Array]":
                    case "[object Int8Array]":
                    case "[object Int16Array]":
                    case "[object Int32Array]":
                    case "[object Uint8Array]":
                    case "[object Uint8ClampedArray]":
                    case "[object Uint16Array]":
                    case "[object Uint32Array]":
                        return s(e, n);
                    case "[object Map]":
                        return new l();
                    case "[object Number]":
                    case "[object String]":
                        return new l(e);
                    case "[object RegExp]":
                        return o(e);
                    case "[object Set]":
                        return new l();
                    case "[object Symbol]":
                        return a(e);
                }
            };
        },
        function (e, t, n) {
            var r = n(4).Uint8Array;
            e.exports = r;
        },
        function (e, t, n) {
            var r = n(39);
            e.exports = function (e, t) {
                var n = t ? r(e.buffer) : e.buffer;
                return new e.constructor(n, e.byteOffset, e.byteLength);
            };
        },
        function (e, t) {
            var n = /\w*$/;
            e.exports = function (e) {
                var t = new e.constructor(e.source, n.exec(e));
                return (t.lastIndex = e.lastIndex), t;
            };
        },
        function (e, t, n) {
            var r = n(16),
                i = r ? r.prototype : void 0,
                o = i ? i.valueOf : void 0;
            e.exports = function (e) {
                return o ? Object(o.call(e)) : {};
            };
        },
        function (e, t, n) {
            var r = n(39);
            e.exports = function (e, t) {
                var n = t ? r(e.buffer) : e.buffer;
                return new e.constructor(n, e.byteOffset, e.length);
            };
        },
        function (e, t, n) {
            var r = n(137),
                i = n(57),
                o = n(35);
            e.exports = function (e) {
                return "function" != typeof e.constructor || o(e) ? {} : r(i(e));
            };
        },
        function (e, t, n) {
            var r = n(8),
                i = Object.create,
                o = (function () {
                    function e() {}
                    return function (t) {
                        if (!r(t)) return {};
                        if (i) return i(t);
                        e.prototype = t;
                        var n = new e();
                        return (e.prototype = void 0), n;
                    };
                })();
            e.exports = o;
        },
        function (e, t, n) {
            var r = n(139),
                i = n(33),
                o = n(34),
                a = o && o.isMap,
                s = a ? i(a) : r;
            e.exports = s;
        },
        function (e, t, n) {
            var r = n(38),
                i = n(10);
            e.exports = function (e) {
                return i(e) && "[object Map]" == r(e);
            };
        },
        function (e, t, n) {
            var r = n(141),
                i = n(33),
                o = n(34),
                a = o && o.isSet,
                s = a ? i(a) : r;
            e.exports = s;
        },
        function (e, t, n) {
            var r = n(38),
                i = n(10);
            e.exports = function (e) {
                return i(e) && "[object Set]" == r(e);
            };
        },
        function (e, t) {
            var n,
                r,
                i = (e.exports = {});
            function o() {
                throw new Error("setTimeout has not been defined");
            }
            function a() {
                throw new Error("clearTimeout has not been defined");
            }
            function s(e) {
                if (n === setTimeout) return setTimeout(e, 0);
                if ((n === o || !n) && setTimeout) return (n = setTimeout), setTimeout(e, 0);
                try {
                    return n(e, 0);
                } catch (t) {
                    try {
                        return n.call(null, e, 0);
                    } catch (t) {
                        return n.call(this, e, 0);
                    }
                }
            }
            !(function () {
                try {
                    n = "function" == typeof setTimeout ? setTimeout : o;
                } catch (e) {
                    n = o;
                }
                try {
                    r = "function" == typeof clearTimeout ? clearTimeout : a;
                } catch (e) {
                    r = a;
                }
            })();
            var l,
                c = [],
                u = !1,
                d = -1;
            function f() {
                u && l && ((u = !1), l.length ? (c = l.concat(c)) : (d = -1), c.length && h());
            }
            function h() {
                if (!u) {
                    var e = s(f);
                    u = !0;
                    for (var t = c.length; t; ) {
                        for (l = c, c = []; ++d < t; ) l && l[d].run();
                        (d = -1), (t = c.length);
                    }
                    (l = null),
                        (u = !1),
                        (function (e) {
                            if (r === clearTimeout) return clearTimeout(e);
                            if ((r === a || !r) && clearTimeout) return (r = clearTimeout), clearTimeout(e);
                            try {
                                r(e);
                            } catch (t) {
                                try {
                                    return r.call(null, e);
                                } catch (t) {
                                    return r.call(this, e);
                                }
                            }
                        })(e);
                }
            }
            function p(e, t) {
                (this.fun = e), (this.array = t);
            }
            function m() {}
            (i.nextTick = function (e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
                c.push(new p(e, t)), 1 !== c.length || u || s(h);
            }),
                (p.prototype.run = function () {
                    this.fun.apply(null, this.array);
                }),
                (i.title = "browser"),
                (i.browser = !0),
                (i.env = {}),
                (i.argv = []),
                (i.version = ""),
                (i.versions = {}),
                (i.on = m),
                (i.addListener = m),
                (i.once = m),
                (i.off = m),
                (i.removeListener = m),
                (i.removeAllListeners = m),
                (i.emit = m),
                (i.prependListener = m),
                (i.prependOnceListener = m),
                (i.listeners = function (e) {
                    return [];
                }),
                (i.binding = function (e) {
                    throw new Error("process.binding is not supported");
                }),
                (i.cwd = function () {
                    return "/";
                }),
                (i.chdir = function (e) {
                    throw new Error("process.chdir is not supported");
                }),
                (i.umask = function () {
                    return 0;
                });
        },
        function (e, t, n) {
            var r = n(11),
                i = n(144);
            "string" == typeof (i = i.__esModule ? i.default : i) && (i = [[e.i, i, ""]]);
            var o = { insert: "head", singleton: !1 };
            r(i, o);
            e.exports = i.locals || {};
        },
        function (e, t, n) {
            "use strict";
            n.r(t);
            var r = n(2),
                i = n.n(r)()(!1);
            i.push([
                e.i,
                ".json-schema-vue-editor{cursor:pointer}.json-schema-vue-editor .el-input--medium{height:36px}.json-schema-vue-editor .el-input.is-disabled{background-color:#f5f7fa;border-color:#dfe4ed;color:#c0c4cc;cursor:not-allowed}.json-schema-vue-editor .hidden{display:none}.json-schema-vue-editor .required-icon{font-size:1em;color:red;font-weight:bold;padding-left:5px}.json-schema-vue-editor .col-item-type{text-align:center}.json-schema-vue-editor .down-style{cursor:pointer}.json-schema-vue-editor .col-item-desc{text-align:center}.json-schema-vue-editor .col-item-mock{text-align:center;padding-right:6px}.json-schema-vue-editor .col-item-setting{padding-left:6px;cursor:pointer}.json-schema-vue-editor .plus{color:#2395f1}.json-schema-vue-editor .close{color:#ff561b}.json-schema-vue-editor .array-type{margin-top:8px}.json-schema-vue-editor .object-style .name-item .ant-input-group-addon{background-color:unset;border:unset}.json-schema-vue-editor .object-style .name-item .ant-input-group>.ant-input:first-child,.ant-input-group-addon:first-child{border-bottom-right-radius:4px;border-top-right-radius:4px}.json-schema-vue-editor .icon-object{color:#0d1b3ea6;font-weight:400;font-size:12px}.json-schema-vue-editor .wrapper{padding-left:8px}.json-schema-vue-editor .type-select-style{width:90%}.json-schema-vue-editor-import-modal .ant-tabs-nav .ant-tabs-tab{height:auto}.json-schema-vue-editor-adv-modal .other-row{margin-bottom:16px}.json-schema-vue-editor-adv-modal .other-label{text-align:right;padding-right:8px}.json-schema-vue-editor-adv-modal .default-setting{font-size:16px;font-weight:400;margin-bottom:16px;border-left:3px solid #2395f1;padding-left:8px}.json-schema-vue-editor-adv-modal .ant-modal-body{min-height:400px}.json-schema-vue-editor-adv-modal .ant-modal-body .ace_editor{min-height:350px}.json-schema-vue-editor-adv-modal-select .format-items-title{color:#999;position:absolute;right:16px}\n",
                "",
            ]),
                (t.default = i);
        },
        function (e, t, n) {
            var r = n(11),
                i = n(146);
            "string" == typeof (i = i.__esModule ? i.default : i) && (i = [[e.i, i, ""]]);
            var o = { insert: "head", singleton: !1 };
            r(i, o);
            e.exports = i.locals || {};
        },
        function (e, t, n) {
            "use strict";
            n.r(t);
            var r = n(2),
                i = n.n(r)()(!1);
            i.push([
                e.i,
                '/* The lint marker gutter */\n.CodeMirror-lint-markers {\n  width: 16px;\n}\n\n.CodeMirror-lint-tooltip {\n  background-color: #ffd;\n  border: 1px solid black;\n  border-radius: 4px 4px 4px 4px;\n  color: black;\n  font-family: monospace;\n  font-size: 10pt;\n  overflow: hidden;\n  padding: 2px 5px;\n  position: fixed;\n  white-space: pre;\n  white-space: pre-wrap;\n  z-index: 100;\n  max-width: 600px;\n  opacity: 0;\n  transition: opacity .4s;\n  -moz-transition: opacity .4s;\n  -webkit-transition: opacity .4s;\n  -o-transition: opacity .4s;\n  -ms-transition: opacity .4s;\n}\n\n.CodeMirror-lint-mark {\n  background-position: left bottom;\n  background-repeat: repeat-x;\n}\n\n.CodeMirror-lint-mark-warning {\n  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJFhQXEbhTg7YAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAMklEQVQI12NkgIIvJ3QXMjAwdDN+OaEbysDA4MPAwNDNwMCwiOHLCd1zX07o6kBVGQEAKBANtobskNMAAAAASUVORK5CYII=");\n}\n\n.CodeMirror-lint-mark-error {\n  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJDw4cOCW1/KIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHElEQVQI12NggIL/DAz/GdA5/xkY/qPKMDAwAADLZwf5rvm+LQAAAABJRU5ErkJggg==");\n}\n\n.CodeMirror-lint-marker {\n  background-position: center center;\n  background-repeat: no-repeat;\n  cursor: pointer;\n  display: inline-block;\n  height: 16px;\n  width: 16px;\n  vertical-align: middle;\n  position: relative;\n}\n\n.CodeMirror-lint-message {\n  padding-left: 18px;\n  background-position: top left;\n  background-repeat: no-repeat;\n}\n\n.CodeMirror-lint-marker-warning, .CodeMirror-lint-message-warning {\n  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAANlBMVEX/uwDvrwD/uwD/uwD/uwD/uwD/uwD/uwD/uwD6twD/uwAAAADurwD2tQD7uAD+ugAAAAD/uwDhmeTRAAAADHRSTlMJ8mN1EYcbmiixgACm7WbuAAAAVklEQVR42n3PUQqAIBBFUU1LLc3u/jdbOJoW1P08DA9Gba8+YWJ6gNJoNYIBzAA2chBth5kLmG9YUoG0NHAUwFXwO9LuBQL1giCQb8gC9Oro2vp5rncCIY8L8uEx5ZkAAAAASUVORK5CYII=");\n}\n\n.CodeMirror-lint-marker-error, .CodeMirror-lint-message-error {\n  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAHlBMVEW7AAC7AACxAAC7AAC7AAAAAAC4AAC5AAD///+7AAAUdclpAAAABnRSTlMXnORSiwCK0ZKSAAAATUlEQVR42mWPOQ7AQAgDuQLx/z8csYRmPRIFIwRGnosRrpamvkKi0FTIiMASR3hhKW+hAN6/tIWhu9PDWiTGNEkTtIOucA5Oyr9ckPgAWm0GPBog6v4AAAAASUVORK5CYII=");\n}\n\n.CodeMirror-lint-marker-multiple {\n  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAMAAADzjKfhAAAACVBMVEUAAAAAAAC/v7914kyHAAAAAXRSTlMAQObYZgAAACNJREFUeNo1ioEJAAAIwmz/H90iFFSGJgFMe3gaLZ0od+9/AQZ0ADosbYraAAAAAElFTkSuQmCC");\n  background-repeat: no-repeat;\n  background-position: right bottom;\n  width: 100%; height: 100%;\n}\n',
                "",
            ]),
                (t.default = i);
        },
        function (e, t, n) {
            var r = n(11),
                i = n(148);
            "string" == typeof (i = i.__esModule ? i.default : i) && (i = [[e.i, i, ""]]);
            var o = { insert: "head", singleton: !1 };
            r(i, o);
            e.exports = i.locals || {};
        },
        function (e, t, n) {
            "use strict";
            n.r(t);
            var r = n(2),
                i = n.n(r)()(!1);
            i.push([
                e.i,
                "/* BASICS */\n\n.CodeMirror {\n  /* Set height, width, borders, and global font properties here */\n  font-family: monospace;\n  height: 300px;\n  color: black;\n  direction: ltr;\n}\n\n/* PADDING */\n\n.CodeMirror-lines {\n  padding: 4px 0; /* Vertical padding around content */\n}\n.CodeMirror pre.CodeMirror-line,\n.CodeMirror pre.CodeMirror-line-like {\n  padding: 0 4px; /* Horizontal padding of content */\n}\n\n.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  background-color: white; /* The little square between H and V scrollbars */\n}\n\n/* GUTTER */\n\n.CodeMirror-gutters {\n  border-right: 1px solid #ddd;\n  background-color: #f7f7f7;\n  white-space: nowrap;\n}\n.CodeMirror-linenumbers {}\n.CodeMirror-linenumber {\n  padding: 0 3px 0 5px;\n  min-width: 20px;\n  text-align: right;\n  color: #999;\n  white-space: nowrap;\n}\n\n.CodeMirror-guttermarker { color: black; }\n.CodeMirror-guttermarker-subtle { color: #999; }\n\n/* CURSOR */\n\n.CodeMirror-cursor {\n  border-left: 1px solid black;\n  border-right: none;\n  width: 0;\n}\n/* Shown when moving in bi-directional text */\n.CodeMirror div.CodeMirror-secondarycursor {\n  border-left: 1px solid silver;\n}\n.cm-fat-cursor .CodeMirror-cursor {\n  width: auto;\n  border: 0 !important;\n  background: #7e7;\n}\n.cm-fat-cursor div.CodeMirror-cursors {\n  z-index: 1;\n}\n.cm-fat-cursor-mark {\n  background-color: rgba(20, 255, 20, 0.5);\n  -webkit-animation: blink 1.06s steps(1) infinite;\n  -moz-animation: blink 1.06s steps(1) infinite;\n  animation: blink 1.06s steps(1) infinite;\n}\n.cm-animate-fat-cursor {\n  width: auto;\n  border: 0;\n  -webkit-animation: blink 1.06s steps(1) infinite;\n  -moz-animation: blink 1.06s steps(1) infinite;\n  animation: blink 1.06s steps(1) infinite;\n  background-color: #7e7;\n}\n@-moz-keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n@-webkit-keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n@keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n\n/* Can style cursor different in overwrite (non-insert) mode */\n.CodeMirror-overwrite .CodeMirror-cursor {}\n\n.cm-tab { display: inline-block; text-decoration: inherit; }\n\n.CodeMirror-rulers {\n  position: absolute;\n  left: 0; right: 0; top: -50px; bottom: 0;\n  overflow: hidden;\n}\n.CodeMirror-ruler {\n  border-left: 1px solid #ccc;\n  top: 0; bottom: 0;\n  position: absolute;\n}\n\n/* DEFAULT THEME */\n\n.cm-s-default .cm-header {color: blue;}\n.cm-s-default .cm-quote {color: #090;}\n.cm-negative {color: #d44;}\n.cm-positive {color: #292;}\n.cm-header, .cm-strong {font-weight: bold;}\n.cm-em {font-style: italic;}\n.cm-link {text-decoration: underline;}\n.cm-strikethrough {text-decoration: line-through;}\n\n.cm-s-default .cm-keyword {color: #708;}\n.cm-s-default .cm-atom {color: #219;}\n.cm-s-default .cm-number {color: #164;}\n.cm-s-default .cm-def {color: #00f;}\n.cm-s-default .cm-variable,\n.cm-s-default .cm-punctuation,\n.cm-s-default .cm-property,\n.cm-s-default .cm-operator {}\n.cm-s-default .cm-variable-2 {color: #05a;}\n.cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}\n.cm-s-default .cm-comment {color: #a50;}\n.cm-s-default .cm-string {color: #a11;}\n.cm-s-default .cm-string-2 {color: #f50;}\n.cm-s-default .cm-meta {color: #555;}\n.cm-s-default .cm-qualifier {color: #555;}\n.cm-s-default .cm-builtin {color: #30a;}\n.cm-s-default .cm-bracket {color: #997;}\n.cm-s-default .cm-tag {color: #170;}\n.cm-s-default .cm-attribute {color: #00c;}\n.cm-s-default .cm-hr {color: #999;}\n.cm-s-default .cm-link {color: #00c;}\n\n.cm-s-default .cm-error {color: #f00;}\n.cm-invalidchar {color: #f00;}\n\n.CodeMirror-composing { border-bottom: 2px solid; }\n\n/* Default styles for common addons */\n\ndiv.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}\ndiv.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}\n.CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }\n.CodeMirror-activeline-background {background: #e8f2ff;}\n\n/* STOP */\n\n/* The rest of this file contains styles related to the mechanics of\n   the editor. You probably shouldn't touch them. */\n\n.CodeMirror {\n  position: relative;\n  overflow: hidden;\n  background: white;\n}\n\n.CodeMirror-scroll {\n  overflow: scroll !important; /* Things will break if this is overridden */\n  /* 50px is the magic margin used to hide the element's real scrollbars */\n  /* See overflow: hidden in .CodeMirror */\n  margin-bottom: -50px; margin-right: -50px;\n  padding-bottom: 50px;\n  height: 100%;\n  outline: none; /* Prevent dragging from highlighting the element */\n  position: relative;\n}\n.CodeMirror-sizer {\n  position: relative;\n  border-right: 50px solid transparent;\n}\n\n/* The fake, visible scrollbars. Used to force redraw during scrolling\n   before actual scrolling happens, thus preventing shaking and\n   flickering artifacts. */\n.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  position: absolute;\n  z-index: 6;\n  display: none;\n  outline: none;\n}\n.CodeMirror-vscrollbar {\n  right: 0; top: 0;\n  overflow-x: hidden;\n  overflow-y: scroll;\n}\n.CodeMirror-hscrollbar {\n  bottom: 0; left: 0;\n  overflow-y: hidden;\n  overflow-x: scroll;\n}\n.CodeMirror-scrollbar-filler {\n  right: 0; bottom: 0;\n}\n.CodeMirror-gutter-filler {\n  left: 0; bottom: 0;\n}\n\n.CodeMirror-gutters {\n  position: absolute; left: 0; top: 0;\n  min-height: 100%;\n  z-index: 3;\n}\n.CodeMirror-gutter {\n  white-space: normal;\n  height: 100%;\n  display: inline-block;\n  vertical-align: top;\n  margin-bottom: -50px;\n}\n.CodeMirror-gutter-wrapper {\n  position: absolute;\n  z-index: 4;\n  background: none !important;\n  border: none !important;\n}\n.CodeMirror-gutter-background {\n  position: absolute;\n  top: 0; bottom: 0;\n  z-index: 4;\n}\n.CodeMirror-gutter-elt {\n  position: absolute;\n  cursor: default;\n  z-index: 4;\n}\n.CodeMirror-gutter-wrapper ::selection { background-color: transparent }\n.CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }\n\n.CodeMirror-lines {\n  cursor: text;\n  min-height: 1px; /* prevents collapsing before first draw */\n}\n.CodeMirror pre.CodeMirror-line,\n.CodeMirror pre.CodeMirror-line-like {\n  /* Reset some styles that the rest of the page might have set */\n  -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;\n  border-width: 0;\n  background: transparent;\n  font-family: inherit;\n  font-size: inherit;\n  margin: 0;\n  white-space: pre;\n  word-wrap: normal;\n  line-height: inherit;\n  color: inherit;\n  z-index: 2;\n  position: relative;\n  overflow: visible;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-font-variant-ligatures: contextual;\n  font-variant-ligatures: contextual;\n}\n.CodeMirror-wrap pre.CodeMirror-line,\n.CodeMirror-wrap pre.CodeMirror-line-like {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  word-break: normal;\n}\n\n.CodeMirror-linebackground {\n  position: absolute;\n  left: 0; right: 0; top: 0; bottom: 0;\n  z-index: 0;\n}\n\n.CodeMirror-linewidget {\n  position: relative;\n  z-index: 2;\n  padding: 0.1px; /* Force widget margins to stay inside of the container */\n}\n\n.CodeMirror-widget {}\n\n.CodeMirror-rtl pre { direction: rtl; }\n\n.CodeMirror-code {\n  outline: none;\n}\n\n/* Force content-box sizing for the elements where we expect it */\n.CodeMirror-scroll,\n.CodeMirror-sizer,\n.CodeMirror-gutter,\n.CodeMirror-gutters,\n.CodeMirror-linenumber {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n\n.CodeMirror-measure {\n  position: absolute;\n  width: 100%;\n  height: 0;\n  overflow: hidden;\n  visibility: hidden;\n}\n\n.CodeMirror-cursor {\n  position: absolute;\n  pointer-events: none;\n}\n.CodeMirror-measure pre { position: static; }\n\ndiv.CodeMirror-cursors {\n  visibility: hidden;\n  position: relative;\n  z-index: 3;\n}\ndiv.CodeMirror-dragcursors {\n  visibility: visible;\n}\n\n.CodeMirror-focused div.CodeMirror-cursors {\n  visibility: visible;\n}\n\n.CodeMirror-selected { background: #d9d9d9; }\n.CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }\n.CodeMirror-crosshair { cursor: crosshair; }\n.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }\n.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }\n\n.cm-searching {\n  background-color: #ffa;\n  background-color: rgba(255, 255, 0, .4);\n}\n\n/* Used to force a border model for a node */\n.cm-force-border { padding-right: .1px; }\n\n@media print {\n  /* Hide the cursor when printing */\n  .CodeMirror div.CodeMirror-cursors {\n    visibility: hidden;\n  }\n}\n\n/* See issue #2901 */\n.cm-tab-wrap-hack:after { content: ''; }\n\n/* Help users use markselection to safely style text background */\nspan.CodeMirror-selectedtext { background: none; }\n",
                "",
            ]),
                (t.default = i);
        },
        function (e, t, n) {
            var r = n(11),
                i = n(150);
            "string" == typeof (i = i.__esModule ? i.default : i) && (i = [[e.i, i, ""]]);
            var o = { insert: "head", singleton: !1 };
            r(i, o);
            e.exports = i.locals || {};
        },
        function (e, t, n) {
            "use strict";
            n.r(t);
            var r = n(2),
                i = n.n(r)()(!1);
            i.push([
                e.i,
                "/**\n    Name:       IDEA default theme\n    From IntelliJ IDEA by JetBrains\n */\n\n.cm-s-idea span.cm-meta { color: #808000; }\n.cm-s-idea span.cm-number { color: #0000FF; }\n.cm-s-idea span.cm-keyword { line-height: 1em; font-weight: bold; color: #000080; }\n.cm-s-idea span.cm-atom { font-weight: bold; color: #000080; }\n.cm-s-idea span.cm-def { color: #000000; }\n.cm-s-idea span.cm-variable { color: black; }\n.cm-s-idea span.cm-variable-2 { color: black; }\n.cm-s-idea span.cm-variable-3, .cm-s-idea span.cm-type { color: black; }\n.cm-s-idea span.cm-property { color: black; }\n.cm-s-idea span.cm-operator { color: black; }\n.cm-s-idea span.cm-comment { color: #808080; }\n.cm-s-idea span.cm-string { color: #008000; }\n.cm-s-idea span.cm-string-2 { color: #008000; }\n.cm-s-idea span.cm-qualifier { color: #555; }\n.cm-s-idea span.cm-error { color: #FF0000; }\n.cm-s-idea span.cm-attribute { color: #0000FF; }\n.cm-s-idea span.cm-tag { color: #000080; }\n.cm-s-idea span.cm-link { color: #0000FF; }\n.cm-s-idea .CodeMirror-activeline-background { background: #FFFAE3; }\n\n.cm-s-idea span.cm-builtin { color: #30a; }\n.cm-s-idea span.cm-bracket { color: #cc7; }\n.cm-s-idea  { font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;}\n\n\n.cm-s-idea .CodeMirror-matchingbracket { outline:1px solid grey; color:black !important; }\n\n.CodeMirror-hints.idea {\n  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;\n  color: #616569;\n  background-color: #ebf3fd !important;\n}\n\n.CodeMirror-hints.idea .CodeMirror-hint-active {\n  background-color: #a2b8c9 !important;\n  color: #5c6065 !important;\n}",
                "",
            ]),
                (t.default = i);
        },
        function (e, t, n) {
            var r = n(11),
                i = n(152);
            "string" == typeof (i = i.__esModule ? i.default : i) && (i = [[e.i, i, ""]]);
            var o = { insert: "head", singleton: !1 };
            r(i, o);
            e.exports = i.locals || {};
        },
        function (e, t, n) {
            "use strict";
            n.r(t);
            var r = n(2),
                i = n.n(r)()(!1);
            i.push([
                e.i,
                ".cm-s-rubyblue.CodeMirror { background: #112435; color: white; }\n.cm-s-rubyblue div.CodeMirror-selected { background: #38566F; }\n.cm-s-rubyblue .CodeMirror-line::selection, .cm-s-rubyblue .CodeMirror-line > span::selection, .cm-s-rubyblue .CodeMirror-line > span > span::selection { background: rgba(56, 86, 111, 0.99); }\n.cm-s-rubyblue .CodeMirror-line::-moz-selection, .cm-s-rubyblue .CodeMirror-line > span::-moz-selection, .cm-s-rubyblue .CodeMirror-line > span > span::-moz-selection { background: rgba(56, 86, 111, 0.99); }\n.cm-s-rubyblue .CodeMirror-gutters { background: #1F4661; border-right: 7px solid #3E7087; }\n.cm-s-rubyblue .CodeMirror-guttermarker { color: white; }\n.cm-s-rubyblue .CodeMirror-guttermarker-subtle { color: #3E7087; }\n.cm-s-rubyblue .CodeMirror-linenumber { color: white; }\n.cm-s-rubyblue .CodeMirror-cursor { border-left: 1px solid white; }\n\n.cm-s-rubyblue span.cm-comment { color: #999; font-style:italic; line-height: 1em; }\n.cm-s-rubyblue span.cm-atom { color: #F4C20B; }\n.cm-s-rubyblue span.cm-number, .cm-s-rubyblue span.cm-attribute { color: #82C6E0; }\n.cm-s-rubyblue span.cm-keyword { color: #F0F; }\n.cm-s-rubyblue span.cm-string { color: #F08047; }\n.cm-s-rubyblue span.cm-meta { color: #F0F; }\n.cm-s-rubyblue span.cm-variable-2, .cm-s-rubyblue span.cm-tag { color: #7BD827; }\n.cm-s-rubyblue span.cm-variable-3, .cm-s-rubyblue span.cm-def, .cm-s-rubyblue span.cm-type { color: white; }\n.cm-s-rubyblue span.cm-bracket { color: #F0F; }\n.cm-s-rubyblue span.cm-link { color: #F4C20B; }\n.cm-s-rubyblue span.CodeMirror-matchingbracket { color:#F0F !important; }\n.cm-s-rubyblue span.cm-builtin, .cm-s-rubyblue span.cm-special { color: #FF9D00; }\n.cm-s-rubyblue span.cm-error { color: #AF2018; }\n\n.cm-s-rubyblue .CodeMirror-activeline-background { background: #173047; }\n",
                "",
            ]),
                (t.default = i);
        },
        function (e, t, n) {
            n(154)(n(155));
        },
        function (e, t) {
            e.exports = function (e) {
                function t(e) {
                    "undefined" != typeof console && (console.error || console.log)("[Script Loader]", e);
                }
                try {
                    "undefined" != typeof execScript && "undefined" != typeof attachEvent && "undefined" == typeof addEventListener
                        ? execScript(e)
                        : "undefined" != typeof eval
                        ? eval.call(null, e)
                        : t("EvalError: No eval function available");
                } catch (e) {
                    t(e);
                }
            };
        },
        function (e, t) {
            e.exports =
                '/* Jison generated parser */\nvar jsonlint = (function(){\nvar parser = {trace: function trace() { },\nyy: {},\nsymbols_: {"error":2,"JSONString":3,"STRING":4,"JSONNumber":5,"NUMBER":6,"JSONNullLiteral":7,"NULL":8,"JSONBooleanLiteral":9,"TRUE":10,"FALSE":11,"JSONText":12,"JSONValue":13,"EOF":14,"JSONObject":15,"JSONArray":16,"{":17,"}":18,"JSONMemberList":19,"JSONMember":20,":":21,",":22,"[":23,"]":24,"JSONElementList":25,"$accept":0,"$end":1},\nterminals_: {2:"error",4:"STRING",6:"NUMBER",8:"NULL",10:"TRUE",11:"FALSE",14:"EOF",17:"{",18:"}",21:":",22:",",23:"[",24:"]"},\nproductions_: [0,[3,1],[5,1],[7,1],[9,1],[9,1],[12,2],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[15,2],[15,3],[20,3],[19,1],[19,3],[16,2],[16,3],[25,1],[25,3]],\nperformAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {\n\nvar $0 = $$.length - 1;\nswitch (yystate) {\ncase 1: // replace escaped characters with actual character\n          this.$ = yytext.replace(/\\\\(\\\\|")/g, "$"+"1")\n                     .replace(/\\\\n/g,\'\\n\')\n                     .replace(/\\\\r/g,\'\\r\')\n                     .replace(/\\\\t/g,\'\\t\')\n                     .replace(/\\\\v/g,\'\\v\')\n                     .replace(/\\\\f/g,\'\\f\')\n                     .replace(/\\\\b/g,\'\\b\');\n        \nbreak;\ncase 2:this.$ = Number(yytext);\nbreak;\ncase 3:this.$ = null;\nbreak;\ncase 4:this.$ = true;\nbreak;\ncase 5:this.$ = false;\nbreak;\ncase 6:return this.$ = $$[$0-1];\nbreak;\ncase 13:this.$ = {};\nbreak;\ncase 14:this.$ = $$[$0-1];\nbreak;\ncase 15:this.$ = [$$[$0-2], $$[$0]];\nbreak;\ncase 16:this.$ = {}; this.$[$$[$0][0]] = $$[$0][1];\nbreak;\ncase 17:this.$ = $$[$0-2]; $$[$0-2][$$[$0][0]] = $$[$0][1];\nbreak;\ncase 18:this.$ = [];\nbreak;\ncase 19:this.$ = $$[$0-1];\nbreak;\ncase 20:this.$ = [$$[$0]];\nbreak;\ncase 21:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);\nbreak;\n}\n},\ntable: [{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],12:1,13:2,15:7,16:8,17:[1,14],23:[1,15]},{1:[3]},{14:[1,16]},{14:[2,7],18:[2,7],22:[2,7],24:[2,7]},{14:[2,8],18:[2,8],22:[2,8],24:[2,8]},{14:[2,9],18:[2,9],22:[2,9],24:[2,9]},{14:[2,10],18:[2,10],22:[2,10],24:[2,10]},{14:[2,11],18:[2,11],22:[2,11],24:[2,11]},{14:[2,12],18:[2,12],22:[2,12],24:[2,12]},{14:[2,3],18:[2,3],22:[2,3],24:[2,3]},{14:[2,4],18:[2,4],22:[2,4],24:[2,4]},{14:[2,5],18:[2,5],22:[2,5],24:[2,5]},{14:[2,1],18:[2,1],21:[2,1],22:[2,1],24:[2,1]},{14:[2,2],18:[2,2],22:[2,2],24:[2,2]},{3:20,4:[1,12],18:[1,17],19:18,20:19},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:23,15:7,16:8,17:[1,14],23:[1,15],24:[1,21],25:22},{1:[2,6]},{14:[2,13],18:[2,13],22:[2,13],24:[2,13]},{18:[1,24],22:[1,25]},{18:[2,16],22:[2,16]},{21:[1,26]},{14:[2,18],18:[2,18],22:[2,18],24:[2,18]},{22:[1,28],24:[1,27]},{22:[2,20],24:[2,20]},{14:[2,14],18:[2,14],22:[2,14],24:[2,14]},{3:20,4:[1,12],20:29},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:30,15:7,16:8,17:[1,14],23:[1,15]},{14:[2,19],18:[2,19],22:[2,19],24:[2,19]},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:31,15:7,16:8,17:[1,14],23:[1,15]},{18:[2,17],22:[2,17]},{18:[2,15],22:[2,15]},{22:[2,21],24:[2,21]}],\ndefaultActions: {16:[2,6]},\nparseError: function parseError(str, hash) {\n    throw new Error(str);\n},\nparse: function parse(input) {\n    var self = this,\n        stack = [0],\n        vstack = [null], // semantic value stack\n        lstack = [], // location stack\n        table = this.table,\n        yytext = \'\',\n        yylineno = 0,\n        yyleng = 0,\n        recovering = 0,\n        TERROR = 2,\n        EOF = 1;\n\n    //this.reductionCount = this.shiftCount = 0;\n\n    this.lexer.setInput(input);\n    this.lexer.yy = this.yy;\n    this.yy.lexer = this.lexer;\n    if (typeof this.lexer.yylloc == \'undefined\')\n        this.lexer.yylloc = {};\n    var yyloc = this.lexer.yylloc;\n    lstack.push(yyloc);\n\n    if (typeof this.yy.parseError === \'function\')\n        this.parseError = this.yy.parseError;\n\n    function popStack (n) {\n        stack.length = stack.length - 2*n;\n        vstack.length = vstack.length - n;\n        lstack.length = lstack.length - n;\n    }\n\n    function lex() {\n        var token;\n        token = self.lexer.lex() || 1; // $end = 1\n        // if token isn\'t its numeric value, convert\n        if (typeof token !== \'number\') {\n            token = self.symbols_[token] || token;\n        }\n        return token;\n    }\n\n    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;\n    while (true) {\n        // retreive state number from top of stack\n        state = stack[stack.length-1];\n\n        // use default actions if available\n        if (this.defaultActions[state]) {\n            action = this.defaultActions[state];\n        } else {\n            if (symbol == null)\n                symbol = lex();\n            // read action for current state and first input\n            action = table[state] && table[state][symbol];\n        }\n\n        // handle parse error\n        _handle_error:\n        if (typeof action === \'undefined\' || !action.length || !action[0]) {\n\n            if (!recovering) {\n                // Report error\n                expected = [];\n                for (p in table[state]) if (this.terminals_[p] && p > 2) {\n                    expected.push("\'"+this.terminals_[p]+"\'");\n                }\n                var errStr = \'\';\n                if (this.lexer.showPosition) {\n                    errStr = \'Parse error on line \'+(yylineno+1)+":\\n"+this.lexer.showPosition()+"\\nExpecting "+expected.join(\', \') + ", got \'" + this.terminals_[symbol]+ "\'";\n                } else {\n                    errStr = \'Parse error on line \'+(yylineno+1)+": Unexpected " +\n                                  (symbol == 1 /*EOF*/ ? "end of input" :\n                                              ("\'"+(this.terminals_[symbol] || symbol)+"\'"));\n                }\n                this.parseError(errStr,\n                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});\n            }\n\n            // just recovered from another error\n            if (recovering == 3) {\n                if (symbol == EOF) {\n                    throw new Error(errStr || \'Parsing halted.\');\n                }\n\n                // discard current lookahead and grab another\n                yyleng = this.lexer.yyleng;\n                yytext = this.lexer.yytext;\n                yylineno = this.lexer.yylineno;\n                yyloc = this.lexer.yylloc;\n                symbol = lex();\n            }\n\n            // try to recover from error\n            while (1) {\n                // check for error recovery rule in this state\n                if ((TERROR.toString()) in table[state]) {\n                    break;\n                }\n                if (state == 0) {\n                    throw new Error(errStr || \'Parsing halted.\');\n                }\n                popStack(1);\n                state = stack[stack.length-1];\n            }\n\n            preErrorSymbol = symbol; // save the lookahead token\n            symbol = TERROR;         // insert generic error symbol as new lookahead\n            state = stack[stack.length-1];\n            action = table[state] && table[state][TERROR];\n            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error\n        }\n\n        // this shouldn\'t happen, unless resolve defaults are off\n        if (action[0] instanceof Array && action.length > 1) {\n            throw new Error(\'Parse Error: multiple actions possible at state: \'+state+\', token: \'+symbol);\n        }\n\n        switch (action[0]) {\n\n            case 1: // shift\n                //this.shiftCount++;\n\n                stack.push(symbol);\n                vstack.push(this.lexer.yytext);\n                lstack.push(this.lexer.yylloc);\n                stack.push(action[1]); // push state\n                symbol = null;\n                if (!preErrorSymbol) { // normal execution/no error\n                    yyleng = this.lexer.yyleng;\n                    yytext = this.lexer.yytext;\n                    yylineno = this.lexer.yylineno;\n                    yyloc = this.lexer.yylloc;\n                    if (recovering > 0)\n                        recovering--;\n                } else { // error just occurred, resume old lookahead f/ before error\n                    symbol = preErrorSymbol;\n                    preErrorSymbol = null;\n                }\n                break;\n\n            case 2: // reduce\n                //this.reductionCount++;\n\n                len = this.productions_[action[1]][1];\n\n                // perform semantic action\n                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1\n                // default location, uses first token for firsts, last for lasts\n                yyval._$ = {\n                    first_line: lstack[lstack.length-(len||1)].first_line,\n                    last_line: lstack[lstack.length-1].last_line,\n                    first_column: lstack[lstack.length-(len||1)].first_column,\n                    last_column: lstack[lstack.length-1].last_column\n                };\n                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);\n\n                if (typeof r !== \'undefined\') {\n                    return r;\n                }\n\n                // pop off stack\n                if (len) {\n                    stack = stack.slice(0,-1*len*2);\n                    vstack = vstack.slice(0, -1*len);\n                    lstack = lstack.slice(0, -1*len);\n                }\n\n                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)\n                vstack.push(yyval.$);\n                lstack.push(yyval._$);\n                // goto new state = table[STATE][NONTERMINAL]\n                newState = table[stack[stack.length-2]][stack[stack.length-1]];\n                stack.push(newState);\n                break;\n\n            case 3: // accept\n                return true;\n        }\n\n    }\n\n    return true;\n}};\n/* Jison generated lexer */\nvar lexer = (function(){\nvar lexer = ({EOF:1,\nparseError:function parseError(str, hash) {\n        if (this.yy.parseError) {\n            this.yy.parseError(str, hash);\n        } else {\n            throw new Error(str);\n        }\n    },\nsetInput:function (input) {\n        this._input = input;\n        this._more = this._less = this.done = false;\n        this.yylineno = this.yyleng = 0;\n        this.yytext = this.matched = this.match = \'\';\n        this.conditionStack = [\'INITIAL\'];\n        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};\n        return this;\n    },\ninput:function () {\n        var ch = this._input[0];\n        this.yytext+=ch;\n        this.yyleng++;\n        this.match+=ch;\n        this.matched+=ch;\n        var lines = ch.match(/\\n/);\n        if (lines) this.yylineno++;\n        this._input = this._input.slice(1);\n        return ch;\n    },\nunput:function (ch) {\n        this._input = ch + this._input;\n        return this;\n    },\nmore:function () {\n        this._more = true;\n        return this;\n    },\nless:function (n) {\n        this._input = this.match.slice(n) + this._input;\n    },\npastInput:function () {\n        var past = this.matched.substr(0, this.matched.length - this.match.length);\n        return (past.length > 20 ? \'...\':\'\') + past.substr(-20).replace(/\\n/g, "");\n    },\nupcomingInput:function () {\n        var next = this.match;\n        if (next.length < 20) {\n            next += this._input.substr(0, 20-next.length);\n        }\n        return (next.substr(0,20)+(next.length > 20 ? \'...\':\'\')).replace(/\\n/g, "");\n    },\nshowPosition:function () {\n        var pre = this.pastInput();\n        var c = new Array(pre.length + 1).join("-");\n        return pre + this.upcomingInput() + "\\n" + c+"^";\n    },\nnext:function () {\n        if (this.done) {\n            return this.EOF;\n        }\n        if (!this._input) this.done = true;\n\n        var token,\n            match,\n            tempMatch,\n            index,\n            col,\n            lines;\n        if (!this._more) {\n            this.yytext = \'\';\n            this.match = \'\';\n        }\n        var rules = this._currentRules();\n        for (var i=0;i < rules.length; i++) {\n            tempMatch = this._input.match(this.rules[rules[i]]);\n            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {\n                match = tempMatch;\n                index = i;\n                if (!this.options.flex) break;\n            }\n        }\n        if (match) {\n            lines = match[0].match(/\\n.*/g);\n            if (lines) this.yylineno += lines.length;\n            this.yylloc = {first_line: this.yylloc.last_line,\n                           last_line: this.yylineno+1,\n                           first_column: this.yylloc.last_column,\n                           last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}\n            this.yytext += match[0];\n            this.match += match[0];\n            this.yyleng = this.yytext.length;\n            this._more = false;\n            this._input = this._input.slice(match[0].length);\n            this.matched += match[0];\n            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);\n            if (this.done && this._input) this.done = false;\n            if (token) return token;\n            else return;\n        }\n        if (this._input === "") {\n            return this.EOF;\n        } else {\n            this.parseError(\'Lexical error on line \'+(this.yylineno+1)+\'. Unrecognized text.\\n\'+this.showPosition(), \n                    {text: "", token: null, line: this.yylineno});\n        }\n    },\nlex:function lex() {\n        var r = this.next();\n        if (typeof r !== \'undefined\') {\n            return r;\n        } else {\n            return this.lex();\n        }\n    },\nbegin:function begin(condition) {\n        this.conditionStack.push(condition);\n    },\npopState:function popState() {\n        return this.conditionStack.pop();\n    },\n_currentRules:function _currentRules() {\n        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;\n    },\ntopState:function () {\n        return this.conditionStack[this.conditionStack.length-2];\n    },\npushState:function begin(condition) {\n        this.begin(condition);\n    }});\nlexer.options = {};\nlexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {\n\nvar YYSTATE=YY_START\nswitch($avoiding_name_collisions) {\ncase 0:/* skip whitespace */\nbreak;\ncase 1:return 6\nbreak;\ncase 2:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 4\nbreak;\ncase 3:return 17\nbreak;\ncase 4:return 18\nbreak;\ncase 5:return 23\nbreak;\ncase 6:return 24\nbreak;\ncase 7:return 22\nbreak;\ncase 8:return 21\nbreak;\ncase 9:return 10\nbreak;\ncase 10:return 11\nbreak;\ncase 11:return 8\nbreak;\ncase 12:return 14\nbreak;\ncase 13:return \'INVALID\'\nbreak;\n}\n};\nlexer.rules = [/^(?:\\s+)/,/^(?:(-?([0-9]|[1-9][0-9]+))(\\.[0-9]+)?([eE][-+]?[0-9]+)?\\b)/,/^(?:"(?:\\\\[\\\\"bfnrt/]|\\\\u[a-fA-F0-9]{4}|[^\\\\\\0-\\x09\\x0a-\\x1f"])*")/,/^(?:\\{)/,/^(?:\\})/,/^(?:\\[)/,/^(?:\\])/,/^(?:,)/,/^(?::)/,/^(?:true\\b)/,/^(?:false\\b)/,/^(?:null\\b)/,/^(?:$)/,/^(?:.)/];\nlexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}};\n\n\n;\nreturn lexer;})()\nparser.lexer = lexer;\nreturn parser;\n})();\nif (typeof require !== \'undefined\' && typeof exports !== \'undefined\') {\nexports.parser = jsonlint;\nexports.parse = function () { return jsonlint.parse.apply(jsonlint, arguments); }\nexports.main = function commonjsMain(args) {\n    if (!args[1])\n        throw new Error(\'Usage: \'+args[0]+\' FILE\');\n    if (typeof process !== \'undefined\') {\n        var source = require(\'fs\').readFileSync(require(\'path\').join(process.cwd(), args[1]), "utf8");\n    } else {\n        var cwd = require("file").path(require("file").cwd());\n        var source = cwd.join(args[1]).read({charset: "utf-8"});\n    }\n    return exports.parser.parse(source);\n}\nif (typeof module !== \'undefined\' && require.main === module) {\n  exports.main(typeof process !== \'undefined\' ? process.argv.slice(1) : require("system").args);\n}\n}';
        },
        function (e, t, n) {
            !(function (e) {
                "use strict";
                e.defineMode("javascript", function (t, n) {
                    var r,
                        i,
                        o = t.indentUnit,
                        a = n.statementIndent,
                        s = n.jsonld,
                        l = n.json || s,
                        c = n.typescript,
                        u = n.wordCharacters || /[\w$\xa1-\uffff]/,
                        d = (function () {
                            function e(e) {
                                return { type: e, style: "keyword" };
                            }
                            var t = e("keyword a"),
                                n = e("keyword b"),
                                r = e("keyword c"),
                                i = e("keyword d"),
                                o = e("operator"),
                                a = { type: "atom", style: "atom" };
                            return {
                                if: e("if"),
                                while: t,
                                with: t,
                                else: n,
                                do: n,
                                try: n,
                                finally: n,
                                return: i,
                                break: i,
                                continue: i,
                                new: e("new"),
                                delete: r,
                                void: r,
                                throw: r,
                                debugger: e("debugger"),
                                var: e("var"),
                                const: e("var"),
                                let: e("var"),
                                function: e("function"),
                                catch: e("catch"),
                                for: e("for"),
                                switch: e("switch"),
                                case: e("case"),
                                default: e("default"),
                                in: o,
                                typeof: o,
                                instanceof: o,
                                true: a,
                                false: a,
                                null: a,
                                undefined: a,
                                NaN: a,
                                Infinity: a,
                                this: e("this"),
                                class: e("class"),
                                super: e("atom"),
                                yield: r,
                                export: e("export"),
                                import: e("import"),
                                extends: r,
                                await: r,
                            };
                        })(),
                        f = /[+\-*&%=<>!?|~^@]/,
                        h = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;
                    function p(e, t, n) {
                        return (r = e), (i = n), t;
                    }
                    function m(e, t) {
                        var n,
                            r = e.next();
                        if ('"' == r || "'" == r)
                            return (
                                (t.tokenize =
                                    ((n = r),
                                    function (e, t) {
                                        var r,
                                            i = !1;
                                        if (s && "@" == e.peek() && e.match(h)) return (t.tokenize = m), p("jsonld-keyword", "meta");
                                        for (; null != (r = e.next()) && (r != n || i); ) i = !i && "\\" == r;
                                        return i || (t.tokenize = m), p("string", "string");
                                    })),
                                t.tokenize(e, t)
                            );
                        if ("." == r && e.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) return p("number", "number");
                        if ("." == r && e.match("..")) return p("spread", "meta");
                        if (/[\[\]{}\(\),;\:\.]/.test(r)) return p(r);
                        if ("=" == r && e.eat(">")) return p("=>", "operator");
                        if ("0" == r && e.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) return p("number", "number");
                        if (/\d/.test(r)) return e.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/), p("number", "number");
                        if ("/" == r)
                            return e.eat("*")
                                ? ((t.tokenize = g), g(e, t))
                                : e.eat("/")
                                ? (e.skipToEnd(), p("comment", "comment"))
                                : Ke(e, t, 1)
                                ? ((function (e) {
                                      for (var t, n = !1, r = !1; null != (t = e.next()); ) {
                                          if (!n) {
                                              if ("/" == t && !r) return;
                                              "[" == t ? (r = !0) : r && "]" == t && (r = !1);
                                          }
                                          n = !n && "\\" == t;
                                      }
                                  })(e),
                                  e.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/),
                                  p("regexp", "string-2"))
                                : (e.eat("="), p("operator", "operator", e.current()));
                        if ("`" == r) return (t.tokenize = v), v(e, t);
                        if ("#" == r && "!" == e.peek()) return e.skipToEnd(), p("meta", "meta");
                        if ("#" == r && e.eatWhile(u)) return p("variable", "property");
                        if (("<" == r && e.match("!--")) || ("-" == r && e.match("->") && !/\S/.test(e.string.slice(0, e.start)))) return e.skipToEnd(), p("comment", "comment");
                        if (f.test(r))
                            return (
                                (">" == r && t.lexical && ">" == t.lexical.type) || (e.eat("=") ? ("!" != r && "=" != r) || e.eat("=") : /[<>*+\-|&?]/.test(r) && (e.eat(r), ">" == r && e.eat(r))),
                                "?" == r && e.eat(".") ? p(".") : p("operator", "operator", e.current())
                            );
                        if (u.test(r)) {
                            e.eatWhile(u);
                            var i = e.current();
                            if ("." != t.lastType) {
                                if (d.propertyIsEnumerable(i)) {
                                    var o = d[i];
                                    return p(o.type, o.style, i);
                                }
                                if ("async" == i && e.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/, !1)) return p("async", "keyword", i);
                            }
                            return p("variable", "variable", i);
                        }
                    }
                    function g(e, t) {
                        for (var n, r = !1; (n = e.next()); ) {
                            if ("/" == n && r) {
                                t.tokenize = m;
                                break;
                            }
                            r = "*" == n;
                        }
                        return p("comment", "comment");
                    }
                    function v(e, t) {
                        for (var n, r = !1; null != (n = e.next()); ) {
                            if (!r && ("`" == n || ("$" == n && e.eat("{")))) {
                                t.tokenize = m;
                                break;
                            }
                            r = !r && "\\" == n;
                        }
                        return p("quasi", "string-2", e.current());
                    }
                    function y(e, t) {
                        t.fatArrowAt && (t.fatArrowAt = null);
                        var n = e.string.indexOf("=>", e.start);
                        if (!(n < 0)) {
                            if (c) {
                                var r = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(e.string.slice(e.start, n));
                                r && (n = r.index);
                            }
                            for (var i = 0, o = !1, a = n - 1; a >= 0; --a) {
                                var s = e.string.charAt(a),
                                    l = "([{}])".indexOf(s);
                                if (l >= 0 && l < 3) {
                                    if (!i) {
                                        ++a;
                                        break;
                                    }
                                    if (0 == --i) {
                                        "(" == s && (o = !0);
                                        break;
                                    }
                                } else if (l >= 3 && l < 6) ++i;
                                else if (u.test(s)) o = !0;
                                else if (/["'\/`]/.test(s))
                                    for (; ; --a) {
                                        if (0 == a) return;
                                        if (e.string.charAt(a - 1) == s && "\\" != e.string.charAt(a - 2)) {
                                            a--;
                                            break;
                                        }
                                    }
                                else if (o && !i) {
                                    ++a;
                                    break;
                                }
                            }
                            o && !i && (t.fatArrowAt = a);
                        }
                    }
                    var b = { atom: !0, number: !0, variable: !0, string: !0, regexp: !0, this: !0, import: !0, "jsonld-keyword": !0 };
                    function x(e, t, n, r, i, o) {
                        (this.indented = e), (this.column = t), (this.type = n), (this.prev = i), (this.info = o), null != r && (this.align = r);
                    }
                    function w(e, t) {
                        for (var n = e.localVars; n; n = n.next) if (n.name == t) return !0;
                        for (var r = e.context; r; r = r.prev) for (n = r.vars; n; n = n.next) if (n.name == t) return !0;
                    }
                    var k = { state: null, column: null, marked: null, cc: null };
                    function C() {
                        for (var e = arguments.length - 1; e >= 0; e--) k.cc.push(arguments[e]);
                    }
                    function S() {
                        return C.apply(null, arguments), !0;
                    }
                    function A(e, t) {
                        for (var n = t; n; n = n.next) if (n.name == e) return !0;
                        return !1;
                    }
                    function M(e) {
                        var t = k.state;
                        if (((k.marked = "def"), t.context))
                            if ("var" == t.lexical.info && t.context && t.context.block) {
                                var r = (function e(t, n) {
                                    if (n) {
                                        if (n.block) {
                                            var r = e(t, n.prev);
                                            return r ? (r == n.prev ? n : new D(r, n.vars, !0)) : null;
                                        }
                                        return A(t, n.vars) ? n : new D(n.prev, new L(t, n.vars), !1);
                                    }
                                    return null;
                                })(e, t.context);
                                if (null != r) return void (t.context = r);
                            } else if (!A(e, t.localVars)) return void (t.localVars = new L(e, t.localVars));
                        n.globalVars && !A(e, t.globalVars) && (t.globalVars = new L(e, t.globalVars));
                    }
                    function T(e) {
                        return "public" == e || "private" == e || "protected" == e || "abstract" == e || "readonly" == e;
                    }
                    function D(e, t, n) {
                        (this.prev = e), (this.vars = t), (this.block = n);
                    }
                    function L(e, t) {
                        (this.name = e), (this.next = t);
                    }
                    var O = new L("this", new L("arguments", null));
                    function j() {
                        (k.state.context = new D(k.state.context, k.state.localVars, !1)), (k.state.localVars = O);
                    }
                    function E() {
                        (k.state.context = new D(k.state.context, k.state.localVars, !0)), (k.state.localVars = null);
                    }
                    function _() {
                        (k.state.localVars = k.state.context.vars), (k.state.context = k.state.context.prev);
                    }
                    function N(e, t) {
                        var n = function () {
                            var n = k.state,
                                r = n.indented;
                            if ("stat" == n.lexical.type) r = n.lexical.indented;
                            else for (var i = n.lexical; i && ")" == i.type && i.align; i = i.prev) r = i.indented;
                            n.lexical = new x(r, k.stream.column(), e, null, n.lexical, t);
                        };
                        return (n.lex = !0), n;
                    }
                    function I() {
                        var e = k.state;
                        e.lexical.prev && (")" == e.lexical.type && (e.indented = e.lexical.indented), (e.lexical = e.lexical.prev));
                    }
                    function F(e) {
                        return function t(n) {
                            return n == e ? S() : ";" == e || "}" == n || ")" == n || "]" == n ? C() : S(t);
                        };
                    }
                    function R(e, t) {
                        return "var" == e
                            ? S(N("vardef", t), be, F(";"), I)
                            : "keyword a" == e
                            ? S(N("form"), P, R, I)
                            : "keyword b" == e
                            ? S(N("form"), R, I)
                            : "keyword d" == e
                            ? k.stream.match(/^\s*$/, !1)
                                ? S()
                                : S(N("stat"), B, F(";"), I)
                            : "debugger" == e
                            ? S(F(";"))
                            : "{" == e
                            ? S(N("}"), E, oe, I, _)
                            : ";" == e
                            ? S()
                            : "if" == e
                            ? ("else" == k.state.lexical.info && k.state.cc[k.state.cc.length - 1] == I && k.state.cc.pop()(), S(N("form"), P, R, I, Ae))
                            : "function" == e
                            ? S(Le)
                            : "for" == e
                            ? S(N("form"), Me, R, I)
                            : "class" == e || (c && "interface" == t)
                            ? ((k.marked = "keyword"), S(N("form", "class" == e ? e : t), Ne, I))
                            : "variable" == e
                            ? c && "declare" == t
                                ? ((k.marked = "keyword"), S(R))
                                : c && ("module" == t || "enum" == t || "type" == t) && k.stream.match(/^\s*\w/, !1)
                                ? ((k.marked = "keyword"), "enum" == t ? S(Ge) : "type" == t ? S(je, F("operator"), ue, F(";")) : S(N("form"), xe, F("{"), N("}"), oe, I, I))
                                : c && "namespace" == t
                                ? ((k.marked = "keyword"), S(N("form"), W, R, I))
                                : c && "abstract" == t
                                ? ((k.marked = "keyword"), S(R))
                                : S(N("stat"), Q)
                            : "switch" == e
                            ? S(N("form"), P, F("{"), N("}", "switch"), E, oe, I, I, _)
                            : "case" == e
                            ? S(W, F(":"))
                            : "default" == e
                            ? S(F(":"))
                            : "catch" == e
                            ? S(N("form"), j, z, R, I, _)
                            : "export" == e
                            ? S(N("stat"), ze, I)
                            : "import" == e
                            ? S(N("stat"), $e, I)
                            : "async" == e
                            ? S(R)
                            : "@" == t
                            ? S(W, R)
                            : C(N("stat"), W, F(";"), I);
                    }
                    function z(e) {
                        if ("(" == e) return S(Ee, F(")"));
                    }
                    function W(e, t) {
                        return H(e, t, !1);
                    }
                    function $(e, t) {
                        return H(e, t, !0);
                    }
                    function P(e) {
                        return "(" != e ? C() : S(N(")"), B, F(")"), I);
                    }
                    function H(e, t, n) {
                        if (k.state.fatArrowAt == k.stream.start) {
                            var r = n ? Y : K;
                            if ("(" == e) return S(j, N(")"), re(Ee, ")"), I, F("=>"), r, _);
                            if ("variable" == e) return C(j, xe, F("=>"), r, _);
                        }
                        var i = n ? U : V;
                        return b.hasOwnProperty(e)
                            ? S(i)
                            : "function" == e
                            ? S(Le, i)
                            : "class" == e || (c && "interface" == t)
                            ? ((k.marked = "keyword"), S(N("form"), _e, I))
                            : "keyword c" == e || "async" == e
                            ? S(n ? $ : W)
                            : "(" == e
                            ? S(N(")"), B, F(")"), I, i)
                            : "operator" == e || "spread" == e
                            ? S(n ? $ : W)
                            : "[" == e
                            ? S(N("]"), Ue, I, i)
                            : "{" == e
                            ? ie(ee, "}", null, i)
                            : "quasi" == e
                            ? C(G, i)
                            : "new" == e
                            ? S(
                                  (function (e) {
                                      return function (t) {
                                          return "." == t ? S(e ? J : X) : "variable" == t && c ? S(ge, e ? U : V) : C(e ? $ : W);
                                      };
                                  })(n)
                              )
                            : S();
                    }
                    function B(e) {
                        return e.match(/[;\}\)\],]/) ? C() : C(W);
                    }
                    function V(e, t) {
                        return "," == e ? S(B) : U(e, t, !1);
                    }
                    function U(e, t, n) {
                        var r = 0 == n ? V : U,
                            i = 0 == n ? W : $;
                        return "=>" == e
                            ? S(j, n ? Y : K, _)
                            : "operator" == e
                            ? /\+\+|--/.test(t) || (c && "!" == t)
                                ? S(r)
                                : c && "<" == t && k.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, !1)
                                ? S(N(">"), re(ue, ">"), I, r)
                                : "?" == t
                                ? S(W, F(":"), i)
                                : S(i)
                            : "quasi" == e
                            ? C(G, r)
                            : ";" != e
                            ? "(" == e
                                ? ie($, ")", "call", r)
                                : "." == e
                                ? S(Z, r)
                                : "[" == e
                                ? S(N("]"), B, F("]"), I, r)
                                : c && "as" == t
                                ? ((k.marked = "keyword"), S(ue, r))
                                : "regexp" == e
                                ? ((k.state.lastType = k.marked = "operator"), k.stream.backUp(k.stream.pos - k.stream.start - 1), S(i))
                                : void 0
                            : void 0;
                    }
                    function G(e, t) {
                        return "quasi" != e ? C() : "${" != t.slice(t.length - 2) ? S(G) : S(W, q);
                    }
                    function q(e) {
                        if ("}" == e) return (k.marked = "string-2"), (k.state.tokenize = v), S(G);
                    }
                    function K(e) {
                        return y(k.stream, k.state), C("{" == e ? R : W);
                    }
                    function Y(e) {
                        return y(k.stream, k.state), C("{" == e ? R : $);
                    }
                    function X(e, t) {
                        if ("target" == t) return (k.marked = "keyword"), S(V);
                    }
                    function J(e, t) {
                        if ("target" == t) return (k.marked = "keyword"), S(U);
                    }
                    function Q(e) {
                        return ":" == e ? S(I, R) : C(V, F(";"), I);
                    }
                    function Z(e) {
                        if ("variable" == e) return (k.marked = "property"), S();
                    }
                    function ee(e, t) {
                        return "async" == e
                            ? ((k.marked = "property"), S(ee))
                            : "variable" == e || "keyword" == k.style
                            ? ((k.marked = "property"), "get" == t || "set" == t ? S(te) : (c && k.state.fatArrowAt == k.stream.start && (n = k.stream.match(/^\s*:\s*/, !1)) && (k.state.fatArrowAt = k.stream.pos + n[0].length), S(ne)))
                            : "number" == e || "string" == e
                            ? ((k.marked = s ? "property" : k.style + " property"), S(ne))
                            : "jsonld-keyword" == e
                            ? S(ne)
                            : c && T(t)
                            ? ((k.marked = "keyword"), S(ee))
                            : "[" == e
                            ? S(W, ae, F("]"), ne)
                            : "spread" == e
                            ? S($, ne)
                            : "*" == t
                            ? ((k.marked = "keyword"), S(ee))
                            : ":" == e
                            ? C(ne)
                            : void 0;
                        var n;
                    }
                    function te(e) {
                        return "variable" != e ? C(ne) : ((k.marked = "property"), S(Le));
                    }
                    function ne(e) {
                        return ":" == e ? S($) : "(" == e ? C(Le) : void 0;
                    }
                    function re(e, t, n) {
                        function r(i, o) {
                            if (n ? n.indexOf(i) > -1 : "," == i) {
                                var a = k.state.lexical;
                                return (
                                    "call" == a.info && (a.pos = (a.pos || 0) + 1),
                                    S(function (n, r) {
                                        return n == t || r == t ? C() : C(e);
                                    }, r)
                                );
                            }
                            return i == t || o == t ? S() : n && n.indexOf(";") > -1 ? C(e) : S(F(t));
                        }
                        return function (n, i) {
                            return n == t || i == t ? S() : C(e, r);
                        };
                    }
                    function ie(e, t, n) {
                        for (var r = 3; r < arguments.length; r++) k.cc.push(arguments[r]);
                        return S(N(t, n), re(e, t), I);
                    }
                    function oe(e) {
                        return "}" == e ? S() : C(R, oe);
                    }
                    function ae(e, t) {
                        if (c) {
                            if (":" == e) return S(ue);
                            if ("?" == t) return S(ae);
                        }
                    }
                    function se(e, t) {
                        if (c && (":" == e || "in" == t)) return S(ue);
                    }
                    function le(e) {
                        if (c && ":" == e) return k.stream.match(/^\s*\w+\s+is\b/, !1) ? S(W, ce, ue) : S(ue);
                    }
                    function ce(e, t) {
                        if ("is" == t) return (k.marked = "keyword"), S();
                    }
                    function ue(e, t) {
                        return "keyof" == t || "typeof" == t || "infer" == t || "readonly" == t
                            ? ((k.marked = "keyword"), S("typeof" == t ? $ : ue))
                            : "variable" == e || "void" == t
                            ? ((k.marked = "type"), S(me))
                            : "|" == t || "&" == t
                            ? S(ue)
                            : "string" == e || "number" == e || "atom" == e
                            ? S(me)
                            : "[" == e
                            ? S(N("]"), re(ue, "]", ","), I, me)
                            : "{" == e
                            ? S(N("}"), fe, I, me)
                            : "(" == e
                            ? S(re(pe, ")"), de, me)
                            : "<" == e
                            ? S(re(ue, ">"), ue)
                            : void 0;
                    }
                    function de(e) {
                        if ("=>" == e) return S(ue);
                    }
                    function fe(e) {
                        return e.match(/[\}\)\]]/) ? S() : "," == e || ";" == e ? S(fe) : C(he, fe);
                    }
                    function he(e, t) {
                        return "variable" == e || "keyword" == k.style
                            ? ((k.marked = "property"), S(he))
                            : "?" == t || "number" == e || "string" == e
                            ? S(he)
                            : ":" == e
                            ? S(ue)
                            : "[" == e
                            ? S(F("variable"), se, F("]"), he)
                            : "(" == e
                            ? C(Oe, he)
                            : e.match(/[;\}\)\],]/)
                            ? void 0
                            : S();
                    }
                    function pe(e, t) {
                        return ("variable" == e && k.stream.match(/^\s*[?:]/, !1)) || "?" == t ? S(pe) : ":" == e ? S(ue) : "spread" == e ? S(pe) : C(ue);
                    }
                    function me(e, t) {
                        return "<" == t
                            ? S(N(">"), re(ue, ">"), I, me)
                            : "|" == t || "." == e || "&" == t
                            ? S(ue)
                            : "[" == e
                            ? S(ue, F("]"), me)
                            : "extends" == t || "implements" == t
                            ? ((k.marked = "keyword"), S(ue))
                            : "?" == t
                            ? S(ue, F(":"), ue)
                            : void 0;
                    }
                    function ge(e, t) {
                        if ("<" == t) return S(N(">"), re(ue, ">"), I, me);
                    }
                    function ve() {
                        return C(ue, ye);
                    }
                    function ye(e, t) {
                        if ("=" == t) return S(ue);
                    }
                    function be(e, t) {
                        return "enum" == t ? ((k.marked = "keyword"), S(Ge)) : C(xe, ae, Ce, Se);
                    }
                    function xe(e, t) {
                        return c && T(t) ? ((k.marked = "keyword"), S(xe)) : "variable" == e ? (M(t), S()) : "spread" == e ? S(xe) : "[" == e ? ie(ke, "]") : "{" == e ? ie(we, "}") : void 0;
                    }
                    function we(e, t) {
                        return "variable" != e || k.stream.match(/^\s*:/, !1) ? ("variable" == e && (k.marked = "property"), "spread" == e ? S(xe) : "}" == e ? C() : "[" == e ? S(W, F("]"), F(":"), we) : S(F(":"), xe, Ce)) : (M(t), S(Ce));
                    }
                    function ke() {
                        return C(xe, Ce);
                    }
                    function Ce(e, t) {
                        if ("=" == t) return S($);
                    }
                    function Se(e) {
                        if ("," == e) return S(be);
                    }
                    function Ae(e, t) {
                        if ("keyword b" == e && "else" == t) return S(N("form", "else"), R, I);
                    }
                    function Me(e, t) {
                        return "await" == t ? S(Me) : "(" == e ? S(N(")"), Te, I) : void 0;
                    }
                    function Te(e) {
                        return "var" == e ? S(be, De) : "variable" == e ? S(De) : C(De);
                    }
                    function De(e, t) {
                        return ")" == e ? S() : ";" == e ? S(De) : "in" == t || "of" == t ? ((k.marked = "keyword"), S(W, De)) : C(W, De);
                    }
                    function Le(e, t) {
                        return "*" == t ? ((k.marked = "keyword"), S(Le)) : "variable" == e ? (M(t), S(Le)) : "(" == e ? S(j, N(")"), re(Ee, ")"), I, le, R, _) : c && "<" == t ? S(N(">"), re(ve, ">"), I, Le) : void 0;
                    }
                    function Oe(e, t) {
                        return "*" == t ? ((k.marked = "keyword"), S(Oe)) : "variable" == e ? (M(t), S(Oe)) : "(" == e ? S(j, N(")"), re(Ee, ")"), I, le, _) : c && "<" == t ? S(N(">"), re(ve, ">"), I, Oe) : void 0;
                    }
                    function je(e, t) {
                        return "keyword" == e || "variable" == e ? ((k.marked = "type"), S(je)) : "<" == t ? S(N(">"), re(ve, ">"), I) : void 0;
                    }
                    function Ee(e, t) {
                        return "@" == t && S(W, Ee), "spread" == e ? S(Ee) : c && T(t) ? ((k.marked = "keyword"), S(Ee)) : c && "this" == e ? S(ae, Ce) : C(xe, ae, Ce);
                    }
                    function _e(e, t) {
                        return "variable" == e ? Ne(e, t) : Ie(e, t);
                    }
                    function Ne(e, t) {
                        if ("variable" == e) return M(t), S(Ie);
                    }
                    function Ie(e, t) {
                        return "<" == t ? S(N(">"), re(ve, ">"), I, Ie) : "extends" == t || "implements" == t || (c && "," == e) ? ("implements" == t && (k.marked = "keyword"), S(c ? ue : W, Ie)) : "{" == e ? S(N("}"), Fe, I) : void 0;
                    }
                    function Fe(e, t) {
                        return "async" == e || ("variable" == e && ("static" == t || "get" == t || "set" == t || (c && T(t))) && k.stream.match(/^\s+[\w$\xa1-\uffff]/, !1))
                            ? ((k.marked = "keyword"), S(Fe))
                            : "variable" == e || "keyword" == k.style
                            ? ((k.marked = "property"), S(Re, Fe))
                            : "number" == e || "string" == e
                            ? S(Re, Fe)
                            : "[" == e
                            ? S(W, ae, F("]"), Re, Fe)
                            : "*" == t
                            ? ((k.marked = "keyword"), S(Fe))
                            : c && "(" == e
                            ? C(Oe, Fe)
                            : ";" == e || "," == e
                            ? S(Fe)
                            : "}" == e
                            ? S()
                            : "@" == t
                            ? S(W, Fe)
                            : void 0;
                    }
                    function Re(e, t) {
                        if ("?" == t) return S(Re);
                        if (":" == e) return S(ue, Ce);
                        if ("=" == t) return S($);
                        var n = k.state.lexical.prev;
                        return C(n && "interface" == n.info ? Oe : Le);
                    }
                    function ze(e, t) {
                        return "*" == t ? ((k.marked = "keyword"), S(Ve, F(";"))) : "default" == t ? ((k.marked = "keyword"), S(W, F(";"))) : "{" == e ? S(re(We, "}"), Ve, F(";")) : C(R);
                    }
                    function We(e, t) {
                        return "as" == t ? ((k.marked = "keyword"), S(F("variable"))) : "variable" == e ? C($, We) : void 0;
                    }
                    function $e(e) {
                        return "string" == e ? S() : "(" == e ? C(W) : "." == e ? C(V) : C(Pe, He, Ve);
                    }
                    function Pe(e, t) {
                        return "{" == e ? ie(Pe, "}") : ("variable" == e && M(t), "*" == t && (k.marked = "keyword"), S(Be));
                    }
                    function He(e) {
                        if ("," == e) return S(Pe, He);
                    }
                    function Be(e, t) {
                        if ("as" == t) return (k.marked = "keyword"), S(Pe);
                    }
                    function Ve(e, t) {
                        if ("from" == t) return (k.marked = "keyword"), S(W);
                    }
                    function Ue(e) {
                        return "]" == e ? S() : C(re($, "]"));
                    }
                    function Ge() {
                        return C(N("form"), xe, F("{"), N("}"), re(qe, "}"), I, I);
                    }
                    function qe() {
                        return C(xe, Ce);
                    }
                    function Ke(e, t, n) {
                        return (t.tokenize == m && /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(t.lastType)) || ("quasi" == t.lastType && /\{\s*$/.test(e.string.slice(0, e.pos - (n || 0))));
                    }
                    return (
                        (_.lex = !0),
                        (I.lex = !0),
                        {
                            startState: function (e) {
                                var t = { tokenize: m, lastType: "sof", cc: [], lexical: new x((e || 0) - o, 0, "block", !1), localVars: n.localVars, context: n.localVars && new D(null, null, !1), indented: e || 0 };
                                return n.globalVars && "object" == typeof n.globalVars && (t.globalVars = n.globalVars), t;
                            },
                            token: function (e, t) {
                                if ((e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), (t.indented = e.indentation()), y(e, t)), t.tokenize != g && e.eatSpace())) return null;
                                var n = t.tokenize(e, t);
                                return "comment" == r
                                    ? n
                                    : ((t.lastType = "operator" != r || ("++" != i && "--" != i) ? r : "incdec"),
                                      (function (e, t, n, r, i) {
                                          var o = e.cc;
                                          for (k.state = e, k.stream = i, k.marked = null, k.cc = o, k.style = t, e.lexical.hasOwnProperty("align") || (e.lexical.align = !0); ; )
                                              if ((o.length ? o.pop() : l ? W : R)(n, r)) {
                                                  for (; o.length && o[o.length - 1].lex; ) o.pop()();
                                                  return k.marked ? k.marked : "variable" == n && w(e, r) ? "variable-2" : t;
                                              }
                                      })(t, n, r, i, e));
                            },
                            indent: function (t, r) {
                                if (t.tokenize == g || t.tokenize == v) return e.Pass;
                                if (t.tokenize != m) return 0;
                                var i,
                                    s = r && r.charAt(0),
                                    l = t.lexical;
                                if (!/^\s*else\b/.test(r))
                                    for (var c = t.cc.length - 1; c >= 0; --c) {
                                        var u = t.cc[c];
                                        if (u == I) l = l.prev;
                                        else if (u != Ae) break;
                                    }
                                for (; ("stat" == l.type || "form" == l.type) && ("}" == s || ((i = t.cc[t.cc.length - 1]) && (i == V || i == U) && !/^[,\.=+\-*:?[\(]/.test(r))); ) l = l.prev;
                                a && ")" == l.type && "stat" == l.prev.type && (l = l.prev);
                                var d = l.type,
                                    h = s == d;
                                return "vardef" == d
                                    ? l.indented + ("operator" == t.lastType || "," == t.lastType ? l.info.length + 1 : 0)
                                    : "form" == d && "{" == s
                                    ? l.indented
                                    : "form" == d
                                    ? l.indented + o
                                    : "stat" == d
                                    ? l.indented +
                                      ((function (e, t) {
                                          return "operator" == e.lastType || "," == e.lastType || f.test(t.charAt(0)) || /[,.]/.test(t.charAt(0));
                                      })(t, r)
                                          ? a || o
                                          : 0)
                                    : "switch" != l.info || h || 0 == n.doubleIndentSwitch
                                    ? l.align
                                        ? l.column + (h ? 0 : 1)
                                        : l.indented + (h ? 0 : o)
                                    : l.indented + (/^(?:case|default)\b/.test(r) ? o : 2 * o);
                            },
                            electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
                            blockCommentStart: l ? null : "/*",
                            blockCommentEnd: l ? null : "*/",
                            blockCommentContinue: l ? null : " * ",
                            lineComment: l ? null : "//",
                            fold: "brace",
                            closeBrackets: "()[]{}''\"\"``",
                            helperType: l ? "json" : "javascript",
                            jsonldMode: s,
                            jsonMode: l,
                            expressionAllowed: Ke,
                            skipExpression: function (e) {
                                var t = e.cc[e.cc.length - 1];
                                (t != W && t != $) || e.cc.pop();
                            },
                        }
                    );
                }),
                    e.registerHelper("wordChars", "javascript", /[\w$]/),
                    e.defineMIME("text/javascript", "javascript"),
                    e.defineMIME("text/ecmascript", "javascript"),
                    e.defineMIME("application/javascript", "javascript"),
                    e.defineMIME("application/x-javascript", "javascript"),
                    e.defineMIME("application/ecmascript", "javascript"),
                    e.defineMIME("application/json", { name: "javascript", json: !0 }),
                    e.defineMIME("application/x-json", { name: "javascript", json: !0 }),
                    e.defineMIME("application/manifest+json", { name: "javascript", json: !0 }),
                    e.defineMIME("application/ld+json", { name: "javascript", jsonld: !0 }),
                    e.defineMIME("text/typescript", { name: "javascript", typescript: !0 }),
                    e.defineMIME("application/typescript", { name: "javascript", typescript: !0 });
            })(n(15));
        },
        function (e, t, n) {
            !(function (e) {
                "use strict";
                var t = "CodeMirror-lint-markers";
                function n(e) {
                    e.parentNode && e.parentNode.removeChild(e);
                }
                function r(t, r, i, o) {
                    var a = (function (t, n, r) {
                        var i = document.createElement("div");
                        function o(t) {
                            if (!i.parentNode) return e.off(document, "mousemove", o);
                            (i.style.top = Math.max(0, t.clientY - i.offsetHeight - 5) + "px"), (i.style.left = t.clientX + 5 + "px");
                        }
                        return (
                            (i.className = "CodeMirror-lint-tooltip cm-s-" + t.options.theme),
                            i.appendChild(r.cloneNode(!0)),
                            t.state.lint.options.selfContain ? t.getWrapperElement().appendChild(i) : document.body.appendChild(i),
                            e.on(document, "mousemove", o),
                            o(n),
                            null != i.style.opacity && (i.style.opacity = 1),
                            i
                        );
                    })(t, r, i);
                    function s() {
                        var t;
                        e.off(o, "mouseout", s),
                            a &&
                                ((t = a).parentNode &&
                                    (null == t.style.opacity && n(t),
                                    (t.style.opacity = 0),
                                    setTimeout(function () {
                                        n(t);
                                    }, 600)),
                                (a = null));
                    }
                    var l = setInterval(function () {
                        if (a)
                            for (var e = o; ; e = e.parentNode) {
                                if ((e && 11 == e.nodeType && (e = e.host), e == document.body)) return;
                                if (!e) {
                                    s();
                                    break;
                                }
                            }
                        if (!a) return clearInterval(l);
                    }, 400);
                    e.on(o, "mouseout", s);
                }
                function i(e, t, n) {
                    (this.marked = []),
                        (this.options = t),
                        (this.timeout = null),
                        (this.hasGutter = n),
                        (this.onMouseOver = function (t) {
                            !(function (e, t) {
                                var n = t.target || t.srcElement;
                                if (/\bCodeMirror-lint-mark-/.test(n.className)) {
                                    for (var i = n.getBoundingClientRect(), o = (i.left + i.right) / 2, a = (i.top + i.bottom) / 2, l = e.findMarksAt(e.coordsChar({ left: o, top: a }, "client")), c = [], u = 0; u < l.length; ++u) {
                                        var d = l[u].__annotation;
                                        d && c.push(d);
                                    }
                                    c.length &&
                                        (function (e, t, n) {
                                            for (var i = n.target || n.srcElement, o = document.createDocumentFragment(), a = 0; a < t.length; a++) {
                                                var l = t[a];
                                                o.appendChild(s(l));
                                            }
                                            r(e, n, o, i);
                                        })(e, c, t);
                                }
                            })(e, t);
                        }),
                        (this.waitingFor = 0);
                }
                function o(e) {
                    var n = e.state.lint;
                    n.hasGutter && e.clearGutter(t);
                    for (var r = 0; r < n.marked.length; ++r) n.marked[r].clear();
                    n.marked.length = 0;
                }
                function a(t, n, i, o, a) {
                    var s = document.createElement("div"),
                        l = s;
                    return (
                        (s.className = "CodeMirror-lint-marker CodeMirror-lint-marker-" + i),
                        o && ((l = s.appendChild(document.createElement("div"))).className = "CodeMirror-lint-marker CodeMirror-lint-marker-multiple"),
                        0 != a &&
                            e.on(l, "mouseover", function (e) {
                                r(t, e, n, l);
                            }),
                        s
                    );
                }
                function s(e) {
                    var t = e.severity;
                    t || (t = "error");
                    var n = document.createElement("div");
                    return (n.className = "CodeMirror-lint-message CodeMirror-lint-message-" + t), void 0 !== e.messageHTML ? (n.innerHTML = e.messageHTML) : n.appendChild(document.createTextNode(e.message)), n;
                }
                function l(t) {
                    var n = t.state.lint.options,
                        r = n.options || n,
                        i = n.getAnnotations || t.getHelper(e.Pos(0, 0), "lint");
                    if (i)
                        if (n.async || i.async)
                            !(function (t, n, r) {
                                var i = t.state.lint,
                                    o = ++i.waitingFor;
                                function a() {
                                    (o = -1), t.off("change", a);
                                }
                                t.on("change", a),
                                    n(
                                        t.getValue(),
                                        function (n, r) {
                                            t.off("change", a),
                                                i.waitingFor == o &&
                                                    (r && n instanceof e && (n = r),
                                                    t.operation(function () {
                                                        c(t, n);
                                                    }));
                                        },
                                        r,
                                        t
                                    );
                            })(t, i, r);
                        else {
                            var o = i(t.getValue(), r, t);
                            if (!o) return;
                            o.then
                                ? o.then(function (e) {
                                      t.operation(function () {
                                          c(t, e);
                                      });
                                  })
                                : t.operation(function () {
                                      c(t, o);
                                  });
                        }
                }
                function c(e, n) {
                    o(e);
                    for (
                        var r,
                            i,
                            l = e.state.lint,
                            c = l.options,
                            u = (function (e) {
                                for (var t = [], n = 0; n < e.length; ++n) {
                                    var r = e[n],
                                        i = r.from.line;
                                    (t[i] || (t[i] = [])).push(r);
                                }
                                return t;
                            })(n),
                            d = 0;
                        d < u.length;
                        ++d
                    ) {
                        var f = u[d];
                        if (f) {
                            var h = [];
                            f = f.filter(function (e) {
                                return !(h.indexOf(e.message) > -1) && h.push(e.message);
                            });
                            for (var p = null, m = l.hasGutter && document.createDocumentFragment(), g = 0; g < f.length; ++g) {
                                var v = f[g],
                                    y = v.severity;
                                y || (y = "error"),
                                    (i = y),
                                    (p = "error" == (r = p) ? r : i),
                                    c.formatAnnotation && (v = c.formatAnnotation(v)),
                                    l.hasGutter && m.appendChild(s(v)),
                                    v.to && l.marked.push(e.markText(v.from, v.to, { className: "CodeMirror-lint-mark CodeMirror-lint-mark-" + y, __annotation: v }));
                            }
                            l.hasGutter && e.setGutterMarker(d, t, a(e, m, p, u[d].length > 1, l.options.tooltips));
                        }
                    }
                    c.onUpdateLinting && c.onUpdateLinting(n, u, e);
                }
                function u(e) {
                    var t = e.state.lint;
                    t &&
                        (clearTimeout(t.timeout),
                        (t.timeout = setTimeout(function () {
                            l(e);
                        }, t.options.delay || 500)));
                }
                e.defineOption("lint", !1, function (n, r, a) {
                    if (
                        (a &&
                            a != e.Init &&
                            (o(n), !1 !== n.state.lint.options.lintOnChange && n.off("change", u), e.off(n.getWrapperElement(), "mouseover", n.state.lint.onMouseOver), clearTimeout(n.state.lint.timeout), delete n.state.lint),
                        r)
                    ) {
                        for (var s = n.getOption("gutters"), c = !1, d = 0; d < s.length; ++d) s[d] == t && (c = !0);
                        var f = (n.state.lint = new i(n, (h = r) instanceof Function ? { getAnnotations: h } : ((h && !0 !== h) || (h = {}), h), c));
                        !1 !== f.options.lintOnChange && n.on("change", u), 0 != f.options.tooltips && "gutter" != f.options.tooltips && e.on(n.getWrapperElement(), "mouseover", f.onMouseOver), l(n);
                    }
                    var h;
                }),
                    e.defineExtension("performLint", function () {
                        this.state.lint && l(this);
                    });
            })(n(15));
        },
        function (e, t, n) {
            !(function (e) {
                "use strict";
                e.registerHelper("lint", "json", function (t) {
                    var n = [];
                    if (!window.jsonlint) return window.console && window.console.error("Error: window.jsonlint not defined, CodeMirror JSON linting cannot run."), n;
                    var r = window.jsonlint.parser || window.jsonlint;
                    r.parseError = function (t, r) {
                        var i = r.loc;
                        n.push({ from: e.Pos(i.first_line - 1, i.first_column), to: e.Pos(i.last_line - 1, i.last_column), message: t });
                    };
                    try {
                        r.parse(t);
                    } catch (e) {}
                    return n;
                });
            })(n(15));
        },
        function (e, t, n) {
            "use strict";
            n(59);
        },
        function (e, t, n) {
            "use strict";
            n.r(t);
            var r = n(2),
                i = n.n(r)()(!1);
            i.push([
                e.i,
                "\n.json-editor[data-v-09ebc5e1] {\n  height: 100%;\n  position: relative;\n}\n.json-editor[data-v-09ebc5e1] .CodeMirror {\n  height: auto;\n  min-height: 300px;\n}\n.json-editor[data-v-09ebc5e1] .CodeMirror-scroll {\n  min-height: 300px;\n}\n.json-editor[data-v-09ebc5e1] .cm-s-rubyblue span.cm-string {\n  color: #f08047;\n}\n",
                "",
            ]),
                (t.default = i);
        },
        function (e, t, n) {
            "use strict";
            n.r(t);
            var r = function () {
                var e = this,
                    t = e.$createElement,
                    n = e._self._c || t;
                return n(
                    "div",
                    [
                        n(
                            "div",
                            { staticClass: "json-schema-vue-editor" },
                            [
                                n(
                                    "el-row",
                                    { attrs: { type: "flex", align: "middle" } },
                                    [
                                        n(
                                            "el-col",
                                            { staticClass: "col-item name-item col-item-name", attrs: { span: 8 } },
                                            [
                                                n(
                                                    "el-row",
                                                    { attrs: { type: "flex", justify: "space-around", align: "middle" } },
                                                    [
                                                        n("el-col", { staticClass: "down-style-col", attrs: { span: 2 } }, [
                                                            "object" === e.schemaData.type
                                                                ? n("span", { staticClass: "down-style", on: { click: e.handleClickIcon } }, [
                                                                      e.show ? n("i", { staticClass: "el-icon-caret-bottom icon-object" }) : e._e(),
                                                                      e.show ? e._e() : n("i", { staticClass: "el-icon-caret-right icon-object" }),
                                                                  ])
                                                                : e._e(),
                                                        ]),
                                                        n("el-col", { attrs: { span: 20 } }, [n("el-input", { attrs: { disabled: "", value: "root", size: "small" } })], 1),
                                                        n(
                                                            "el-col",
                                                            { staticStyle: { "text-align": "center" }, attrs: { span: 4 } },
                                                            [
                                                                n(
                                                                    "el-tooltip",
                                                                    { attrs: { placement: "top", content: "Select all" } },
                                                                    [n("el-checkbox", { attrs: { checked: e.checked, disabled: e.disabled }, on: { change: e.changeCheckBox } })],
                                                                    1
                                                                ),
                                                            ],
                                                            1
                                                        ),
                                                    ],
                                                    1
                                                ),
                                            ],
                                            1
                                        ),
                                        n(
                                            "el-col",
                                            { staticClass: "col-item col-item-type", attrs: { span: 6 } },
                                            [
                                                n(
                                                    "el-select",
                                                    {
                                                        staticClass: "type-select-style",
                                                        attrs: { value: e.schemaData.type, disabled: e.schemaData.disabled && !e.schemaData.canChangeType, size: "small" },
                                                        on: {
                                                            change: function (t) {
                                                                return e.handleChangeType2(t);
                                                            },
                                                        },
                                                    },
                                                    e._l(e.schemaTypes, function (e) {
                                                        return n("el-option", { key: e, attrs: { value: e, label: e } });
                                                    }),
                                                    1
                                                ),
                                            ],
                                            1
                                        ),
                                        e.isMock
                                            ? n(
                                                  "el-col",
                                                  { staticClass: "col-item col-item-mock", attrs: { span: 3 } },
                                                  [n("MockSelect", { attrs: { schema: e.schemaData }, on: { showEdit: e.handleShowEdit, change: e.handleChangeMock } })],
                                                  1
                                              )
                                            : e._e(),
                                        e.showTitle
                                            ? n(
                                                  "el-col",
                                                  { staticClass: "col-item col-item-mock", attrs: { span: e.isMock ? 4 : 5 } },
                                                  [
                                                      n(
                                                          "el-input",
                                                          {
                                                              attrs: { placeholder: "Title", disabled: e.schemaData.disabled, size: "small" },
                                                              model: {
                                                                  value: e.schemaData.title,
                                                                  callback: function (t) {
                                                                      e.$set(e.schemaData, "title", t);
                                                                  },
                                                                  expression: "schemaData.title",
                                                              },
                                                          },
                                                          [
                                                              n("i", {
                                                                  staticClass: "el-icon-edit",
                                                                  attrs: { slot: "append" },
                                                                  on: {
                                                                      click: function (t) {
                                                                          return e.handleSchemaUpdateEvent({ eventType: "show-edit", field: "title", prefix: ["properties"], isRoot: !0 });
                                                                      },
                                                                  },
                                                                  slot: "append",
                                                              }),
                                                          ]
                                                      ),
                                                  ],
                                                  1
                                              )
                                            : e._e(),
                                        !e.showTitle && e.showDefaultValue
                                            ? n(
                                                  "el-col",
                                                  { staticClass: "col-item col-item-mock", attrs: { span: e.isMock ? 4 : 5 } },
                                                  [
                                                      n(
                                                          "el-input",
                                                          {
                                                              attrs: { placeholder: "Default", size: "small", disabled: "object" === e.schemaData.type || "array" === e.schemaData.type || e.schemaData.disabled },
                                                              model: {
                                                                  value: e.schemaData.default,
                                                                  callback: function (t) {
                                                                      e.$set(e.schemaData, "default", t);
                                                                  },
                                                                  expression: "schemaData.default",
                                                              },
                                                          },
                                                          [
                                                              n("i", {
                                                                  staticClass: "el-icon-edit",
                                                                  attrs: { slot: "append" },
                                                                  on: {
                                                                      click: function (t) {
                                                                          return e.handleSchemaUpdateEvent({ eventType: "show-edit", field: "default", prefix: ["properties"], isRoot: !0 });
                                                                      },
                                                                  },
                                                                  slot: "append",
                                                              }),
                                                          ]
                                                      ),
                                                  ],
                                                  1
                                              )
                                            : e._e(),
                                        n("el-col", { staticClass: "col-item col-item-setting", attrs: { span: 12, align: "right" } }, [
                                            n(
                                                "span",
                                                {
                                                    staticClass: "adv-set adv-set--left-pad",
                                                    on: {
                                                        click: function (t) {
                                                            return e.handleSchemaUpdateEvent({ eventType: "setting", schemaType: e.schemaData.type, prefix: ["properties"], isRoot: !0 });
                                                        },
                                                    },
                                                },
                                                [n("el-tooltip", { attrs: { placement: "top", content: "Settings" } }, [n("i", { staticClass: "el-icon-setting" })])],
                                                1
                                            ),
                                            "object" === e.schemaData.type
                                                ? n(
                                                      "span",
                                                      {
                                                          staticClass: "add-field add-field--right-pad",
                                                          on: {
                                                              click: function (t) {
                                                                  return e.handleSchemaUpdateEvent({ eventType: "add-field", isChild: !1, prefix: ["properties"] });
                                                              },
                                                          },
                                                      },
                                                      [n("el-tooltip", { attrs: { placement: "top", content: "Add field" } }, [n("i", { staticClass: "el-icon-plus plus" })])],
                                                      1
                                                  )
                                                : e._e(),
                                        ]),
                                    ],
                                    1
                                ),
                                e.show ? n("schema-json", { attrs: { data: e.schemaData, "is-mock": e.isMock, "show-title": e.showTitle, "show-default-value": e.showDefaultValue, "editor-id": e.editorId } }) : e._e(),
                                e.showRaw
                                    ? n("RawDialog", {
                                          attrs: { visible: e.rawDialogVisible, schema: e.schemaData },
                                          on: {
                                              "update:visible": function (t) {
                                                  e.rawDialogVisible = t;
                                              },
                                          },
                                      })
                                    : e._e(),
                                n("BasicDialog", {
                                    attrs: { visible: e.basicDialogVisible, "init-data": e.basicModalData },
                                    on: {
                                        "update:visible": function (t) {
                                            e.basicDialogVisible = t;
                                        },
                                    },
                                }),
                                n("StringDialog", {
                                    attrs: { visible: e.settingDialogVisible.string, "init-data": e.settingModalData },
                                    on: {
                                        "update:visible": function (t) {
                                            return e.$set(e.settingDialogVisible, "string", t);
                                        },
                                    },
                                }),
                                n("NumberDialog", {
                                    attrs: { visible: e.settingDialogVisible.number, "init-data": e.settingModalData },
                                    on: {
                                        "update:visible": function (t) {
                                            return e.$set(e.settingDialogVisible, "number", t);
                                        },
                                    },
                                }),
                                n("NumberDialog", {
                                    attrs: { visible: e.settingDialogVisible.integer, "init-data": e.settingModalData },
                                    on: {
                                        "update:visible": function (t) {
                                            return e.$set(e.settingDialogVisible, "integer", t);
                                        },
                                    },
                                }),
                                n("ArrayDialog", {
                                    attrs: { visible: e.settingDialogVisible.array, "init-data": e.settingModalData },
                                    on: {
                                        "update:visible": function (t) {
                                            return e.$set(e.settingDialogVisible, "array", t);
                                        },
                                    },
                                }),
                                n("BooleanDialog", {
                                    attrs: { visible: e.settingDialogVisible.boolean, "init-data": e.settingModalData },
                                    on: {
                                        "update:visible": function (t) {
                                            return e.$set(e.settingDialogVisible, "boolean", t);
                                        },
                                    },
                                }),
                                n("ObjectDialog", {
                                    attrs: { visible: e.settingDialogVisible.object, "init-data": e.settingModalData },
                                    on: {
                                        "update:visible": function (t) {
                                            return e.$set(e.settingDialogVisible, "object", t);
                                        },
                                    },
                                }),
                            ],
                            1
                        ),
                    ],
                    1
                );
            };
            r._withStripped = !0;
            var i = n(5),
                o = n.n(i),
                a = n(6),
                s = n.n(a),
                l = n(40),
                c = n.n(l),
                u = n(3),
                d = n.n(u),
                f = function () {
                    var e = this,
                        t = e.$createElement,
                        n = e._self._c || t;
                    return n(
                        "div",
                        e._b({ staticClass: "schema-content" }, "div", e.$attrs, !1),
                        [
                            "array" === e.data.type
                                ? [n("schema-array", { attrs: { prefix: e.name, data: e.data, "is-mock": e.isMock, "show-title": e.showTitle, "show-default-value": e.showDefaultValue, "editor-id": e.editorId } })]
                                : e._e(),
                            "object" === e.data.type
                                ? [n("schema-object", { attrs: { prefix: e.nameArray, data: e.data, "is-mock": e.isMock, "show-title": e.showTitle, "show-default-value": e.showDefaultValue, "editor-id": e.editorId } })]
                                : e._e(),
                        ],
                        2
                    );
                };
            f._withStripped = !0;
            var h = n(13),
                p = {
                    name: "SchemaJson",
                    components: { "schema-array": n(25).a, "schema-object": h.a },
                    inheritAttrs: !1,
                    props: {
                        data: { type: Object, default: () => [] },
                        isMock: { type: Boolean, default: !1 },
                        showTitle: { type: Boolean, default: !1 },
                        showDefaultValue: { type: Boolean, default: !1 },
                        editorId: { type: String, default: "editor_id" },
                    },
                    data: () => ({ name: [] }),
                    computed: {
                        nameArray() {
                            return [].concat(this.name, "properties");
                        },
                    },
                    methods: {},
                },
                m = n(1),
                g = Object(m.a)(p, f, [], !1, null, null, null);
            g.options.__file = "src/Schema/index.vue";
            var v = g.exports,
                y = n(12),
                b =
                    (n(143),
                    function () {
                        var e = this,
                            t = e.$createElement,
                            n = e._self._c || t;
                        return n(
                            "div",
                            [
                                n(
                                    "el-dialog",
                                    {
                                        attrs: { title: e.initData.title, visible: e.visible, width: "30%" },
                                        on: {
                                            "update:visible": function (t) {
                                                e.visible = t;
                                            },
                                        },
                                    },
                                    [
                                        n("el-input", {
                                            staticStyle: { "margin-bottom": "15px" },
                                            attrs: { type: "textarea", rows: 3, placeholder: "" },
                                            model: {
                                                value: e.data,
                                                callback: function (t) {
                                                    e.data = t;
                                                },
                                                expression: "data",
                                            },
                                        }),
                                        n(
                                            "span",
                                            { staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" },
                                            [n("el-button", { on: { click: e.close } }, [e._v("Cancel")]), n("el-button", { attrs: { type: "primary" }, on: { click: e.handleOk } }, [e._v("Ok")])],
                                            1
                                        ),
                                    ],
                                    1
                                ),
                            ],
                            1
                        );
                    });
            b._withStripped = !0;
            var x = {
                    name: "BasicDialog",
                    props: { visible: { type: Boolean, default: !1 }, initData: { type: Object, default: () => ({ title: "", value: "" }) } },
                    data: () => ({ dialogVisible: !1, data: "" }),
                    watch: {
                        initData: {
                            handler() {
                                this.data = this.initData.value;
                            },
                            deep: !0,
                        },
                    },
                    created() {},
                    methods: {
                        close() {
                            this.$emit("update:visible", !1);
                            this.$jsEditorEvent.emit("schema-update-" + this.initData.editorId, { eventType: "cancel-showedit", ...this.initData });
                        },
                        handleOk() {
                            (this.initData.value = this.data), this.$jsEditorEvent.emit("schema-update-" + this.initData.editorId, { eventType: "save-showedit", ...this.initData }), this.close();
                        },
                    },
                },
                w = Object(m.a)(x, b, [], !1, null, "58fb3670", null);
            w.options.__file = "src/dialog/BasicDialog.vue";
            var k = w.exports,
                C = function () {
                    var e = this,
                        t = e.$createElement,
                        n = e._self._c || t;
                    return n(
                        "div",
                        [
                            n(
                                "el-dialog",
                                e._g(e._b({ attrs: { title: "Settings", width: "700px" }, on: { open: e.onOpen, close: e.onClose } }, "el-dialog", e.$attrs, !1), e.$listeners),
                                [
                                    n(
                                        "el-row",
                                        { attrs: { gutter: 15 } },
                                        [
                                            n(
                                                "el-form",
                                                { ref: "elForm", attrs: { model: e.formData, rules: e.rules, size: "small", "label-width": "100px" } },
                                                [
                                                    n(
                                                        "el-col",
                                                        { attrs: { span: 24 } },
                                                        [
                                                            n(
                                                                "el-form-item",
                                                                { attrs: { label: "Default value:", prop: "default" } },
                                                                [
                                                                    n("el-input", {
                                                                        style: { width: "100%" },
                                                                        attrs: { placeholder: "", maxlength: 200, clearable: "" },
                                                                        model: {
                                                                            value: e.formData.default,
                                                                            callback: function (t) {
                                                                                e.$set(e.formData, "default", t);
                                                                            },
                                                                            expression: "formData.default",
                                                                        },
                                                                    }),
                                                                ],
                                                                1
                                                            ),
                                                        ],
                                                        1
                                                    ),
                                                    n(
                                                        "el-col",
                                                        { attrs: { span: 12 } },
                                                        [
                                                            n(
                                                                "el-form-item",
                                                                { attrs: { label: "Min length:", prop: "minLength" } },
                                                                [
                                                                    n("el-input-number", {
                                                                        staticStyle: { width: "160px" },
                                                                        attrs: { placeholder: "", step: 2 },
                                                                        model: {
                                                                            value: e.formData.minLength,
                                                                            callback: function (t) {
                                                                                e.$set(e.formData, "minLength", t);
                                                                            },
                                                                            expression: "formData.minLength",
                                                                        },
                                                                    }),
                                                                ],
                                                                1
                                                            ),
                                                        ],
                                                        1
                                                    ),
                                                    n(
                                                        "el-col",
                                                        { attrs: { span: 12 } },
                                                        [
                                                            n(
                                                                "el-form-item",
                                                                { attrs: { label: "Max length:", prop: "maxLength" } },
                                                                [
                                                                    n("el-input-number", {
                                                                        staticStyle: { width: "160px" },
                                                                        attrs: { placeholder: "", step: 2 },
                                                                        model: {
                                                                            value: e.formData.maxLength,
                                                                            callback: function (t) {
                                                                                e.$set(e.formData, "maxLength", t);
                                                                            },
                                                                            expression: "formData.maxLength",
                                                                        },
                                                                    }),
                                                                ],
                                                                1
                                                            ),
                                                        ],
                                                        1
                                                    ),
                                                    n(
                                                        "el-col",
                                                        { attrs: { span: 24 } },
                                                        [
                                                            n(
                                                                "el-row",
                                                                [
                                                                    n("el-col", { attrs: { span: 3 } }, [
                                                                        n(
                                                                            "div",
                                                                            { staticStyle: { "padding-top": "5px", "text-align": "right" } },
                                                                            [
                                                                                n("label", { attrs: { for: "" } }, [e._v("Enumerate:")]),
                                                                            ],
                                                                            1
                                                                        ),
                                                                    ]),
                                                                    n(
                                                                        "el-col",
                                                                        { staticStyle: { "padding-left": "18px" }, attrs: { span: 21 } },
                                                                        [
                                                                            n(
                                                                                "el-form-item",
                                                                                { attrs: { "label-width": "0", prop: "enum" } },
                                                                                [
                                                                                    n(
                                                                                        "el-checkbox",
                                                                                        {
                                                                                            model: {
                                                                                                value: e.enableEnum,
                                                                                                callback: function (t) {
                                                                                                    e.enableEnum = t;
                                                                                                },
                                                                                                expression: "enableEnum",
                                                                                            },
                                                                                        },
                                                                                        [e._v(" enable")]
                                                                                    ),
                                                                                    n("el-input", {
                                                                                        style: { width: "100%" },
                                                                                        attrs: { type: "textarea", placeholder: "Enter enumeration items, one per line", maxlength: 120, disabled: !e.enableEnum, autosize: { minRows: 4, maxRows: 4 } },
                                                                                        model: {
                                                                                            value: e.formData.enum,
                                                                                            callback: function (t) {
                                                                                                e.$set(e.formData, "enum", t);
                                                                                            },
                                                                                            expression: "formData.enum",
                                                                                        },
                                                                                    }),
                                                                                ],
                                                                                1
                                                                            ),
                                                                        ],
                                                                        1
                                                                    ),
                                                                ],
                                                                1
                                                            ),
                                                        ],
                                                        1
                                                    ),
                                                    e.enableEnum
                                                        ? n(
                                                              "el-col",
                                                              { attrs: { span: 24 } },
                                                              [
                                                                  n(
                                                                      "el-form-item",
                                                                      { attrs: { label: "Enum description:", prop: "enumDesc" } },
                                                                      [
                                                                          n("el-input", {
                                                                              style: { width: "100%" },
                                                                              attrs: { type: "textarea", placeholder: "", maxlength: 100, autosize: { minRows: 4, maxRows: 4 } },
                                                                              model: {
                                                                                  value: e.formData.enumDesc,
                                                                                  callback: function (t) {
                                                                                      e.$set(e.formData, "enumDesc", t);
                                                                                  },
                                                                                  expression: "formData.enumDesc",
                                                                              },
                                                                          }),
                                                                      ],
                                                                      1
                                                                  ),
                                                              ],
                                                              1
                                                          )
                                                        : e._e(),
                                                ],
                                                1
                                            ),
                                        ],
                                        1
                                    ),
                                    n(
                                        "div",
                                        { attrs: { slot: "footer" }, slot: "footer" },
                                        [n("el-button", { on: { click: e.close } }, [e._v("Cancel")]), n("el-button", { attrs: { type: "primary" }, on: { click: e.handleConfirm } }, [e._v("Ok")])],
                                        1
                                    ),
                                ],
                                1
                            ),
                        ],
                        1
                    );
                };
            C._withStripped = !0;
            var S = n(24),
                A = n.n(S),
                M = n(0),
                T = {
                    name: "StringDialog",
                    inheritAttrs: !1,
                    props: { initData: { type: Object, default: () => ({}) } },
                    data: () => ({
                        enableEnum: !1,
                        formData: { default: void 0, minLength: void 0, maxLength: void 0, enum: void 0, enumDesc: void 0 },
                        rules: { default: [], minLength: [], maxLength: [], innerScope: [], enum: [], enumDesc: [] },
                    }),
                    methods: {
                        onOpen() {
                            const { minLength: e, maxLength: t, enumDesc: n } = this.initData;
                            let r = this.initData.enum;
                            if (r)
                                try {
                                    (r = r.join("\n")), (this.enableEnum = !0);
                                } catch (e) {
                                    this.$message({ text: "The enumeration details entered are not in the correct format and will be cleared", type: "warning" }), (r = "");
                                }
                            Object.assign(this.formData, { minLength: e, maxLength: t, enumDesc: n }, { default: this.initData.default, enum: r });
                        },
                        onClose() {
                            this.$refs.elForm.resetFields();
                        },
                        close() {
                            this.$emit("update:visible", !1);
                        },
                        handleConfirm() {
                            this.$refs.elForm.validate((e) => {
                                if (!e) return;
                                const t = Object(M.g)(this.formData);
                                t.enum && (t.enum = A()(t.enum.split("\n"))), this.$jsEditorEvent.emit("schema-update-" + this.initData.editorId, { eventType: "save-setting", ...this.initData, newData: t }), this.close();
                            });
                        },
                    },
                },
                D = Object(m.a)(T, C, [], !1, null, null, null);
            D.options.__file = "src/dialog/StringDialog.vue";
            var L = D.exports,
                O = function () {
                    var e = this,
                        t = e.$createElement,
                        n = e._self._c || t;
                    return n(
                        "div",
                        [
                            n(
                                "el-dialog",
                                e._g(e._b({ attrs: { title: "Settings", width: "700px" }, on: { open: e.onOpen, close: e.onClose } }, "el-dialog", e.$attrs, !1), e.$listeners),
                                [
                                    n(
                                        "el-row",
                                        { attrs: { gutter: 15 } },
                                        [
                                            n(
                                                "el-form",
                                                { ref: "elForm", attrs: { model: e.formData, rules: e.rules, size: "small", "label-width": "100px" } },
                                                [
                                                    n(
                                                        "el-col",
                                                        { attrs: { span: 24 } },
                                                        [
                                                            n(
                                                                "el-form-item",
                                                                { attrs: { label: "Default value:", prop: "default" } },
                                                                [
                                                                    n("el-input", {
                                                                        style: { width: "100%" },
                                                                        attrs: { type: "number", placeholder: "", maxlength: 15, clearable: "" },
                                                                        model: {
                                                                            value: e.formData.default,
                                                                            callback: function (t) {
                                                                                e.$set(e.formData, "default", t);
                                                                            },
                                                                            expression: "formData.default",
                                                                        },
                                                                    }),
                                                                ],
                                                                1
                                                            ),
                                                        ],
                                                        1
                                                    ),
                                                    n(
                                                        "el-col",
                                                        { attrs: { span: 12 } },
                                                        [
                                                            n(
                                                                "el-form-item",
                                                                { attrs: { label: "Minimum:", prop: "minLength" } },
                                                                [
                                                                    n("el-input-number", {
                                                                        staticStyle: { width: "160px" },
                                                                        attrs: { placeholder: "", min: -9007199254740992, step: 1 },
                                                                        model: {
                                                                            value: e.formData.minLength,
                                                                            callback: function (t) {
                                                                                e.$set(e.formData, "minLength", t);
                                                                            },
                                                                            expression: "formData.minLength",
                                                                        },
                                                                    }),
                                                                ],
                                                                1
                                                            ),
                                                        ],
                                                        1
                                                    ),
                                                    n(
                                                        "el-col",
                                                        { attrs: { span: 12 } },
                                                        [
                                                            n(
                                                                "el-form-item",
                                                                { attrs: { label: "Maximum:", prop: "maxLength" } },
                                                                [
                                                                    n("el-input-number", {
                                                                        staticStyle: { width: "160px" },
                                                                        attrs: { placeholder: "", step: 1, max: 9007199254740992 },
                                                                        model: {
                                                                            value: e.formData.maxLength,
                                                                            callback: function (t) {
                                                                                e.$set(e.formData, "maxLength", t);
                                                                            },
                                                                            expression: "formData.maxLength",
                                                                        },
                                                                    }),
                                                                ],
                                                                1
                                                            ),
                                                        ],
                                                        1
                                                    )
                                                ],
                                                1
                                            ),
                                        ],
                                        1
                                    ),
                                    n(
                                        "div",
                                        { attrs: { slot: "footer" }, slot: "footer" },
                                        [n("el-button", { on: { click: e.close } }, [e._v("Cancel")]), n("el-button", { attrs: { type: "primary" }, on: { click: e.handleConfirm } }, [e._v("Ok")])],
                                        1
                                    ),
                                ],
                                1
                            ),
                        ],
                        1
                    );
                };
            O._withStripped = !0;
            var j = {
                    name: "NumberDialog",
                    inheritAttrs: !1,
                    props: { initData: { type: Object, default: () => ({}) } },
                    data: () => ({
                        enableEnum: !1,
                        formData: { default: void 0, minLength: void 0, maxLength: void 0, enum: void 0, enumDesc: void 0 },
                        rules: { default: [], minLength: [], maxLength: [], innerScope: [], enum: [], enumDesc: [] },
                    }),
                    methods: {
                        onOpen() {
                            const { minLength: e, maxLength: t, enumDesc: n } = this.initData;
                            let r = this.initData.enum;
                            if (r)
                                try {
                                    (r = r.join("\n")), (this.enableEnum = !0);
                                } catch (e) {
                                    this.$message({ text: "The enumeration value is not correct, it will be discarded.", type: "warning" }), (r = "");
                                }
                            Object.assign(this.formData, { minLength: e, maxLength: t, enumDesc: n }, { default: this.initData.default, enum: r });
                        },
                        onClose() {
                            this.$refs.elForm.resetFields();
                        },
                        close() {
                            this.$emit("update:visible", !1);
                        },
                        handleConfirm() {
                            this.$refs.elForm.validate((e) => {
                                if (!e) return;
                                const t = Object(M.g)(this.formData);
                                t.enum && (t.enum = A()(t.enum.split("\n"))),
                                    t.default && (t.default = Number(t.default)),
                                    this.$jsEditorEvent.emit("schema-update-" + this.initData.editorId, { eventType: "save-setting", ...this.initData, newData: t }),
                                    this.close();
                            });
                        },
                    },
                },
                E = Object(m.a)(j, O, [], !1, null, null, null);
            E.options.__file = "src/dialog/NumberDialog.vue";
            var _ = E.exports,
                N = function () {
                    var e = this,
                        t = e.$createElement,
                        n = e._self._c || t;
                    return n(
                        "el-dialog",
                        e._g(e._b({ attrs: { title: "Array item limits", width: "700px" }, on: { open: e.onOpen, close: e.onClose } }, "el-dialog", e.$attrs, !1), e.$listeners),
                        [
                            n(
                                "el-row",
                                { attrs: { gutter: 15 } },
                                [
                                    n(
                                        "el-form",
                                        { ref: "elForm", attrs: { model: e.formData, size: "small", "label-width": "100px" } },
                                        [
                                            n(
                                                "el-col",
                                                { attrs: { span: 12 } },
                                                [
                                                    n(
                                                        "el-form-item",
                                                        { attrs: { label: "Minimum", prop: "minItems" } },
                                                        [
                                                            n("el-input-number", {
                                                                attrs: { placeholder: "...", min: 0, step: 1 },
                                                                model: {
                                                                    value: e.formData.minItems,
                                                                    callback: function (t) {
                                                                        e.$set(e.formData, "minItems", t);
                                                                    },
                                                                    expression: "formData.minItems",
                                                                },
                                                            }),
                                                        ],
                                                        1
                                                    ),
                                                ],
                                                1
                                            ),
                                            n(
                                                "el-col",
                                                { attrs: { span: 12 } },
                                                [
                                                    n(
                                                        "el-form-item",
                                                        { attrs: { label: "Maximum:", prop: "maxItems" } },
                                                        [
                                                            n("el-input-number", {
                                                                attrs: { placeholder: "...", max: 1e5, step: 1 },
                                                                model: {
                                                                    value: e.formData.maxItems,
                                                                    callback: function (t) {
                                                                        e.$set(e.formData, "maxItems", t);
                                                                    },
                                                                    expression: "formData.maxItems",
                                                                },
                                                            }),
                                                        ],
                                                        1
                                                    ),
                                                ],
                                                1
                                            ),
                                        ],
                                        1
                                    ),
                                ],
                                1
                            ),
                            n(
                                "div",
                                { attrs: { slot: "footer" }, slot: "footer" },
                                [n("el-button", { on: { click: e.close } }, [e._v("Cancel")]), n("el-button", { attrs: { type: "primary" }, on: { click: e.handleConfirm } }, [e._v("Ok")])],
                                1
                            ),
                        ],
                        1
                    );
                };
            N._withStripped = !0;
            var I = {
                    name: "ArrayDialog",
                    inheritAttrs: !1,
                    props: { initData: { type: Object, default: () => ({}) } },
                    data: () => ({ formData: { minItems: void 0, maxItems: void 0 } }),
                    created() {},
                    methods: {
                        onOpen() {
                            const { minItems: e, maxItems: t } = this.initData;
                            Object.assign(this.formData, { minItems: e, maxItems: t });
                        },
                        onClose() {
                            this.$refs.elForm.resetFields();
                        },
                        close() {
                            this.$emit("update:visible", !1);
                        },
                        handleConfirm() {
                            this.$refs.elForm.validate((e) => {
                                if (!e) return;
                                const t = Object(M.g)(this.formData);
                                this.$jsEditorEvent.emit("schema-update-" + this.initData.editorId, { eventType: "save-setting", ...this.initData, newData: t }), this.close();
                            });
                        },
                    },
                },
                F = Object(m.a)(I, N, [], !1, null, null, null);
            F.options.__file = "src/dialog/ArrayDialog.vue";
            var R = F.exports,
                z = function () {
                    var e = this,
                        t = e.$createElement,
                        n = e._self._c || t;
                    return n(
                        "el-dialog",
                        e._g(e._b({ attrs: { title: "Settings", width: "600px" }, on: { open: e.onOpen, close: e.onClose } }, "el-dialog", e.$attrs, !1), e.$listeners),
                        [
                            n(
                                "el-form",
                                { ref: "elForm", attrs: { model: e.formData, size: "small", "label-width": "100px" } },
                                [
                                    n(
                                        "el-form-item",
                                        { attrs: { label: "Default:", prop: "default" } },
                                        [
                                            n(
                                                "el-select",
                                                {
                                                    style: { width: "60%" },
                                                    attrs: { placeholder: "Select an option", clearable: "" },
                                                    model: {
                                                        value: e.formData.default,
                                                        callback: function (t) {
                                                            e.$set(e.formData, "default", t);
                                                        },
                                                        expression: "formData.default",
                                                    },
                                                },
                                                e._l(e.defaultOptions, function (e, t) {
                                                    return n("el-option", { key: t, attrs: { label: e.label, value: e.value, disabled: e.disabled } });
                                                }),
                                                1
                                            ),
                                        ],
                                        1
                                    ),
                                ],
                                1
                            ),
                            n(
                                "div",
                                { attrs: { slot: "footer" }, slot: "footer" },
                                [n("el-button", { on: { click: e.close } }, [e._v("Cancel")]), n("el-button", { attrs: { type: "primary" }, on: { click: e.handleConfirm } }, [e._v("Ok")])],
                                1
                            ),
                        ],
                        1
                    );
                };
            z._withStripped = !0;
            var W = {
                    name: "BooleanDialog",
                    inheritAttrs: !1,
                    props: { initData: { type: Object, default: () => ({}) } },
                    data: () => ({
                        formData: { default: void 0 },
                        defaultOptions: [
                            { label: "none", value: undefined },
                            { label: "true", value: !0 },
                            { label: "false", value: !1 },
                        ],
                    }),
                    created() {},
                    methods: {
                        onOpen() {
                            Object.assign(this.formData, { default: this.initData.default });
                        },
                        onClose() {
                            this.$refs.elForm.resetFields();
                        },
                        close() {
                            this.$emit("update:visible", !1);
                        },
                        handleConfirm() {
                            this.$refs.elForm.validate((e) => {
                                if (!e) return;
                                const t = Object(M.g)(this.formData);
                                this.$jsEditorEvent.emit("schema-update-" + this.initData.editorId, { eventType: "save-setting", ...this.initData, newData: this.formData }), this.close();
                            });
                        },
                    },
                },
                $ = Object(m.a)(W, z, [], !1, null, null, null);
            $.options.__file = "src/dialog/BooleanDialog.vue";
            var P = $.exports,
                H = function () {
                    var e = this,
                        t = e.$createElement,
                        n = e._self._c || t;
                    return n(
                        "el-dialog",
                        e._g(e._b({ attrs: { title: "Settings", width: "600px" }, on: { open: e.onOpen, close: e.onClose } }, "el-dialog", e.$attrs, !1), e.$listeners),
                        [
                            n(
                                "el-form",
                                { ref: "elForm", attrs: { model: e.formData, size: "small", "label-width": "100px" } },
                                [
                                    n(
                                        "el-form-item",
                                        { staticStyle: { "text-align": "center" }, attrs: { "label-width": "0", prop: "notEmpty" } },
                                        [
                                            n(
                                                "el-radio-group",
                                                {
                                                    attrs: { size: "medium" },
                                                    model: {
                                                        value: e.formData.notEmpty,
                                                        callback: function (t) {
                                                            e.$set(e.formData, "notEmpty", t);
                                                        },
                                                        expression: "formData.notEmpty",
                                                    },
                                                },
                                                e._l(e.notEmptyOptions, function (t, r) {
                                                    return n("el-radio", { key: r, attrs: { label: t.value, disabled: t.disabled } }, [e._v(e._s(t.label))]);
                                                }),
                                                1
                                            ),
                                        ],
                                        1
                                    ),
                                ],
                                1
                            ),
                            n(
                                "div",
                                { attrs: { slot: "footer" }, slot: "footer" },
                                [n("el-button", { on: { click: e.close } }, [e._v("Cancel")]), n("el-button", { attrs: { type: "primary" }, on: { click: e.handleConfirm } }, [e._v("Ok")])],
                                1
                            ),
                        ],
                        1
                    );
                };
            H._withStripped = !0;
            var B = {
                    name: "ObjectDialog",
                    inheritAttrs: !1,
                    props: { initData: { type: Object, default: () => ({}) } },
                    data: () => ({
                        formData: { notEmpty: !1 },
                        notEmptyOptions: [
                            { label: "Nullable", value: !1 },
                            { label: "Not nullable", value: !0 },
                        ],
                    }),
                    created() {},
                    methods: {
                        onOpen() {
                            Object.assign(this.formData, { notEmpty: this.initData.notEmpty });
                        },
                        onClose() {
                            this.$refs.elForm.resetFields();
                        },
                        close() {
                            this.$emit("update:visible", !1);
                        },
                        handleConfirm() {
                            this.$refs.elForm.validate((e) => {
                                if (!e) return;
                                const t = Object(M.g)(this.formData);
                                this.$jsEditorEvent.emit("schema-update-" + this.initData.editorId, { eventType: "save-setting", ...this.initData, newData: t }), this.close();
                            });
                        },
                    },
                },
                V = Object(m.a)(B, H, [], !1, null, null, null);
            V.options.__file = "src/dialog/ObjectDialog.vue";
            var U = V.exports,
                G = function () {
                    var e = this,
                        t = e.$createElement,
                        n = e._self._c || t;
                    return n(
                        "div",
                        [
                            n("el-dialog", e._g(e._b({ attrs: { title: "RAW源码查看", width: "700px" }, on: { open: e.onOpen, close: e.onClose } }, "el-dialog", e.$attrs, !1), e.$listeners), [
                                n("div", { staticClass: "sourcecode" }, [n("s-json-editor", { attrs: { value: e.schema } })], 1),
                                n("span", { staticClass: "dialog-footer", attrs: { slot: "footer" }, slot: "footer" }, [n("el-button", { on: { click: e.close } }, [e._v("关 闭")])], 1),
                            ]),
                        ],
                        1
                    );
                };
            G._withStripped = !0;
            var q = function () {
                var e = this.$createElement,
                    t = this._self._c || e;
                return t("div", { staticClass: "json-editor" }, [t("textarea", { ref: "textarea" })]);
            };
            q._withStripped = !0;
            var K = n(15),
                Y = n.n(K);
            n(145), n(147), n(149), n(151), n(156), n(157), n(158);
            n(153);
            var X = {
                    name: "SJsonEditor",
                    props: { value: { type: Object, default: () => ({}) }, readonly: { type: Boolean, default: !0 }, theme: { type: String, default: "idea" } },
                    data: () => ({ jsonEditor: !1 }),
                    watch: {
                        value(e) {
                            e !== this.jsonEditor.getValue() && this.jsonEditor.setValue(JSON.stringify(this.value, null, 2));
                        },
                        theme() {
                            this.jsonEditor.setOption({ theme: this.theme });
                        },
                    },
                    mounted() {
                        (this.jsonEditor = Y.a.fromTextArea(this.$refs.textarea, {
                            lineNumbers: !0,
                            mode: "application/json",
                            gutters: ["CodeMirror-lint-markers"],
                            theme: this.theme || "idea",
                            readonly: !!this.readonly && "nocursor",
                            lint: !0,
                        })),
                            this.jsonEditor.setValue(JSON.stringify(this.value, null, 2)),
                            this.jsonEditor.on("change", (e) => {
                                this.$emit("changed", e.getValue()), this.$emit("input", e.getValue());
                            });
                    },
                    methods: {
                        getValue() {
                            return this.jsonEditor.getValue();
                        },
                    },
                },
                J = (n(159), Object(m.a)(X, q, [], !1, null, "09ebc5e1", null));
            J.options.__file = "src/json-editor/src/json-editor.vue";
            var Q = J.exports;
            Q.install = function (e) {
                e.component(Q.name, Q);
            };
            var Z = {
                    name: "RawDialog",
                    components: { SJsonEditor: Q },
                    inheritAttrs: !1,
                    props: { schema: { type: Object, default: () => ({}) } },
                    data: () => ({}),
                    created() {},
                    methods: {
                        onOpen() {},
                        onClose() {},
                        close() {
                            this.$emit("update:visible", !1);
                        },
                    },
                },
                ee = Object(m.a)(Z, G, [], !1, null, "20f0527c", null);
            ee.options.__file = "src/dialog/RawDialog.vue";
            var te = ee.exports,
                ne = {
                    name: "SJsonSchemaEditor",
                    components: { MockSelect: y.a, SchemaJson: v, BasicDialog: k, StringDialog: L, NumberDialog: _, ArrayDialog: R, BooleanDialog: P, ObjectDialog: U, RawDialog: te },
                    props: {
                        schema: { type: Object, default: () => {} },
                        isMock: { type: Boolean, default: !1 },
                        showTitle: { type: Boolean, default: !1 },
                        showDefaultValue: { type: Boolean, default: !1 },
                        showRaw: { type: Boolean, default: !1 },
                    },
                    data() {
                        const e = {};
                        M.b.map((t) => {
                            e[t] = !1;
                        });
                        const t = this.schema || M.d;
                        return {
                            editorId: Object(M.j)(),
                            checked: !1,
                            disabled: !1,
                            show: !0,
                            schemaTypes: M.b,
                            schemaData: t,
                            rawDialogVisible: !1,
                            basicDialogVisible: !1,
                            basicModalData: { title: "", value: "" },
                            settingDialogVisible: e,
                            settingModalData: {},
                        };
                    },
                    watch: {
                        schemaData: {
                            handler(e) {
                                Object(M.i)(this, "watch", e);
                            },
                            deep: !0,
                        },
                    },
                    mounted() {
                        Object(M.i)(this, this.schemaData), this.$jsEditorEvent.on("schema-update-" + this.editorId, this.handleSchemaUpdateEvent);
                    },
                    beforeDestroy() {
                        this.$jsEditorEvent.off("schema-update-" + this.editorId, this.handleSchemaUpdateEvent);
                    },
                    methods: {
                        handleSchemaUpdateEvent(e) {
                            const { eventType: t, ...n } = e;
                            switch (t) {
                                case "add-field":
                                    this.addFieldAction(n);
                                    break;
                                case "delete-field":
                                    this.deleteFieldAction(n);
                                    break;
                                case "update-field-name":
                                    this.updateFieldNameAction(n);
                                    break;
                                case "schema-type":
                                    this.handleChangeType(n);
                                    break;
                                case "show-edit":
                                    this.handleShowEdit(n);
                                    break;
                                case "save-showedit":
                                    this.handleSaveShowEdit(n);
                                    break;
                                case "setting":
                                    this.handleSettingAction(n);
                                    break;
                                case "save-setting":
                                    this.handleSaveSetting(n);
                                    break;
                                case "toggle-required":
                                    this.enableRequireAction(n);
                            }
                        },
                        handleClickIcon() {
                            this.show = !this.show;
                        },
                        changeCheckBox(e) {
                            this.requireAllAction({ required: e, value: this.schemaData });
                        },
                        requireAllAction(e) {
                            const { value: t, required: n } = e,
                                r = Object(M.c)(t);
                            Object(M.h)(r, n), this.forceUpdate(r), this.handleEmitChange(r);
                        },
                        enableRequireAction(e) {
                            const { prefix: t, name: n, required: r } = e,
                                i = d()(t);
                            i.pop();
                            const a = [...i],
                                l = a.join(M.a),
                                c = d()(this.schemaData);
                            let u = null;
                            u = l ? s()(c, l) : c;
                            const f = [].concat(u.required || []),
                                h = f.indexOf(n);
                            !r && h >= 0 ? (f.splice(h, 1), a.push("required"), 0 === f.length ? Object(M.f)(c, a) : o()(c, a, f)) : r && -1 === h && (f.push(n), a.push("required"), o()(c, a, f)),
                                this.forceUpdate(c),
                                this.handleEmitChange(c);
                        },
                        addFieldAction(e) {
                            Object(M.i)(this, e);
                            const { isChild: t, name: n, prefix: r } = e;
                            let i = "",
                                a = [];
                            if (t) {
                                const e = [].concat(r, n);
                                (i = e.concat("properties").join(M.a)), (a = [...e]);
                            } else {
                                i = r.join(M.a);
                                const e = [].concat(r);
                                e.pop(), (a = e);
                            }
                            Object(M.i)("addFieldAction>>>", i, "\n\t");
                            let l = {};
                            const c = "field_" + Object(M.j)(),
                                u = s()(this.schemaData, i);
                            (l = Object.assign({}, u)), (l[c] = d()(M.e.string));
                            const f = d()(this.schemaData);
                            o()(f, i, l);
                            let h = null;
                            h = a.length ? s()(f, a) : f;
                            const p = [].concat(h.required || []);
                            p.push(c), a.push("required"), o()(f, a, p), (this.schemaData = f), this.forceUpdate(f), this.handleEmitChange(f);
                        },
                        deleteFieldAction(e) {
                            const { name: t, prefix: n } = e,
                                r = [].concat(n, t).join(M.a),
                                i = d()(this.schemaData);
                            c()(i, r), (this.schemaData = i), this.forceUpdate(), this.handleEmitChange(i);
                        },
                        updateFieldNameAction(e) {
                            Object(M.i)(this, e);
                            const { value: t, name: n, prefix: r } = e;
                            let i = [];
                            const a = d()(r);
                            a.pop(), (i = a);
                            const l = r.join(M.a),
                                u = r.concat(n).join(M.a),
                                f = d()(this.schemaData),
                                h = s()(f, u);
                            c()(f, u), o()(f, `${l}.${t}`, h);
                            let p = null;
                            p = i.length ? s()(f, i) : f;
                            let m = [].concat(p.required || []);
                            (m = m.map((e) => (e === n ? t : e))), i.push("required"), o()(f, i, m), (this.schemaData = f), this.forceUpdate(), this.handleEmitChange(f);
                        },
                        handleChangeType2(e) {
                            this.schemaData.type = e;
                            const t = this.schemaData.description ? { description: this.schemaData.description } : {},
                                n = M.e[e],
                                r = Object.assign({}, n, t);
                            (this.schemaData = r), this.handleEmitChange(this.schemaData);
                        },
                        handleChangeType(e) {
                            Object(M.i)(this, e, 2);
                            const { value: t, name: n, prefix: r } = e,
                                i = [].concat(r, n),
                                a = d()(this.schemaData),
                                l = s()(a, i),
                                c = M.e[t],
                                u = l.description ? { description: l.description } : {},
                                f = Object.assign({}, c, u);
                            o()(a, i, f), (this.schemaData = a), this.forceUpdate(), this.handleEmitChange(a);
                        },
                        handleShowEdit(e) {
                            const { field: t, name: n, prefix: r, isRoot: i } = e;
                            let o;
                            if ((Object(M.i)(this, "handleShowEdit", n, r), i)) o = this.schemaData;
                            else {
                                const e = [].concat(r, n);
                                o = s()(this.schemaData, e);
                            }
                            ("default" === t && "array" === o.type) ||
                                "object" === o.type ||
                                ((this.basicDialogVisible = !0), Object.assign(this.basicModalData, { title: "title" === t ? "Title" : "default" === t ? "Defaults" : "Description", value: o[t], editorId: this.editorId, ...e }));
                        },
                        handleSaveShowEdit(e) {
                            const { value: t, field: n, name: r, prefix: i, isRoot: a } = e;
                            let s;
                            const l = d()(this.schemaData);
                            a ? (l[n] = t) : ((s = [].concat(i, r, n)), o()(l, s, t)), (this.schemaData = l), this.forceUpdate(), this.handleEmitChange(l);
                        },
                        handleSettingAction(e) {
                            const { schemaType: t, name: n, prefix: r, isRoot: i } = e;
                            let o;
                            if (((this.settingDialogVisible[t] = !0), i)) o = this.schemaData;
                            else {
                                const e = [].concat(r, n);
                                o = s()(this.schemaData, e);
                            }
                            this.settingModalData = { schemaType: t, name: n, isRoot: i, prefix: r, editorId: this.editorId, ...o };
                        },
                        handleSaveSetting(e) {
                            const { name: t, prefix: n, newData: r, isRoot: i } = e,
                                a = d()(this.schemaData);
                            if ((console.log(i), i)) Object.assign(a, { ...r });
                            else {
                                const e = [].concat(n, t),
                                    i = s()(a, e);
                                o()(a, e, { ...i, ...r });
                            }
                            (this.schemaData = a), this.forceUpdate(), this.handleEmitChange(a);
                        },
                        handleChangeMock() {},
                        handleReqBodyRaw() {
                            (this.rawDialogVisible = !0), this.forceUpdate();
                        },
                        forceUpdate(e) {
                            const t = e || this.schemaData;
                            (this.schemaData = {}),
                                this.$nextTick(() => {
                                    this.schemaData = t;
                                });
                        },
                        handleEmitChange(e) {
                            this.$emit("schema-change", e), this.$emit("update:schema", e);
                        },
                    },
                },
                re = Object(m.a)(ne, r, [], !1, null, null, null);
            re.options.__file = "src/json-schema-editor.vue";
            var ie = re.exports,
                oe = n(23);
            const ae = new (n.n(oe).a)({
                methods: {
                    on(...e) {
                        this.$on.apply(this, e);
                    },
                    emit(...e) {
                        this.$emit.apply(this, e);
                    },
                    off(...e) {
                        this.$off.apply(this, e);
                    },
                    once(...e) {
                        this.$once.apply(this, e);
                    },
                },
            });
            var se = {
                install: function (e) {
                    Object.defineProperty(e.prototype, "$jsEditorEvent", { value: ae, writable: !0 });
                },
            };
            const le = function (e) {
                e.use(se), e.component(ie.name, ie);
            };
            (ie.install = le), "undefined" != typeof window && window.Vue && le(window.Vue);
            t.default = ie;
        },
        function (e, t, n) {
            "use strict";
            n.r(t);
            var r = function () {
                var e = this,
                    t = e.$createElement,
                    n = e._self._c || t;
                return n(
                    "div",
                    [
                        n(
                            "el-row",
                            { attrs: { type: "flex", align: "middle" } },
                            [
                                n(
                                    "el-col",
                                    { staticClass: "col-item name-item col-item-name", style: e.tagPaddingLeftStyle, attrs: { span: 8 } },
                                    [
                                        n(
                                            "el-row",
                                            { attrs: { type: "flex", justify: "space-around", align: "middle" } },
                                            [
                                                n("el-col", { staticClass: "down-style-col", attrs: { span: 2 } }, [
                                                    "object" === e.value.type
                                                        ? n("span", { staticClass: "down-style", on: { click: e.handleClickIcon } }, [
                                                              e.showIcon ? n("i", { staticClass: "el-icon-caret-bottom icon-object" }) : e._e(),
                                                              e.showIcon ? e._e() : n("i", { staticClass: "el-icon-caret-right icon-object" }),
                                                          ])
                                                        : e._e(),
                                                ]),
                                                n("el-col", { staticClass: "el-input--small", attrs: { span: 20 } }, [
                                                    n("input", {
                                                        staticClass: "el-input el-input__inner",
                                                        class: { "is-disabled": e.value.disabled },
                                                        attrs: { size: "small", disabled: e.value.disabled },
                                                        domProps: { value: e.name },
                                                        on: { change: e.handleNameChange },
                                                    }),
                                                ]),
                                                n(
                                                    "el-col",
                                                    { staticStyle: { "text-align": "center" }, attrs: { span: 4 } },
                                                    [
                                                        n(
                                                            "el-tooltip",
                                                            { attrs: { placement: "top", content: "Required?" } },
                                                            [n("el-checkbox", { attrs: { checked: (e.data.required && -1 != e.data.required.indexOf(e.name)) || !1 }, on: { change: e.handleEnableRequire } })],
                                                            1
                                                        ),
                                                    ],
                                                    1
                                                ),
                                            ],
                                            1
                                        ),
                                    ],
                                    1
                                ),
                                n(
                                    "el-col",
                                    { staticClass: "col-item col-item-type", attrs: { span: 6 } },
                                    [
                                        n(
                                            "el-select",
                                            { staticClass: "type-select-style", attrs: { size: "small", value: e.value.type, disabled: e.value.disabled && !e.value.canChangeType }, on: { change: e.handleChangeType } },
                                            e._l(e.schemaTypes, function (e) {
                                                return n("el-option", { key: e, attrs: { value: e, label: e } });
                                            }),
                                            1
                                        ),
                                    ],
                                    1
                                ),
                                e.isMock
                                    ? n(
                                          "el-col",
                                          { staticClass: "col-item col-item-mock", attrs: { span: 3 } },
                                          [
                                              n("MockSelect", {
                                                  attrs: { schema: e.value },
                                                  on: {
                                                      showEdit: function (t) {
                                                          return e.handleAction({ eventType: "mock-edit" });
                                                      },
                                                      change: e.handleChangeMock,
                                                  },
                                              }),
                                          ],
                                          1
                                      )
                                    : e._e(),
                                n(
                                    "el-col",
                                    { staticClass: "col-item col-item-setting", attrs: { span: 12, align: "right" } },
                                    [
                                        n(
                                            "span",
                                            {
                                                staticClass: "description-set",
                                                on: {
                                                click: function (t) {
                                                    return e.handleAction({ eventType: "show-edit", field: "description" });
                                                },
                                            },
                                            },
                                            [n("el-tooltip", { attrs: { placement: "top", content: "Description" } }, [n("i", { staticClass: "el-icon-edit" })])],
                                            1
                                        ),
                                        n(
                                            "span",
                                            {
                                                staticClass: "adv-set",
                                                on: {
                                                    click: function (t) {
                                                        return e.handleAction({ eventType: "setting", schemaType: e.value.type });
                                                    },
                                                },
                                            },
                                            [n("el-tooltip", { attrs: { placement: "top", content: "Settings" } }, [n("i", { staticClass: "el-icon-setting" })])],
                                            1
                                        ),
                                        "object" === e.value.type ? n("DropPlus", { attrs: { prefix: e.prefix, name: e.name }, on: { "add-field": e.handleAction } }) : e._e(),
                                        "object" !== e.value.type
                                            ? n(
                                                  "span",
                                                  {
                                                      on: {
                                                          click: function (t) {
                                                              return e.handleAction({ eventType: "add-field", isChild: !1 });
                                                          },
                                                      },
                                                  },
                                                  [n("el-tooltip", { attrs: { placement: "top", content: "Add field" } }, [n("i", { staticClass: "el-icon-plus plus" })])],
                                                  1
                                              )
                                            : e._e(),
                                        n(
                                            "span",
                                            {
                                                staticClass: "delete-item",
                                                class: { hidden: e.value.disabled },
                                                on: {
                                                    click: function (t) {
                                                        return e.handleAction({ eventType: "delete-field" });
                                                    },
                                                },
                                            },
                                            [n("el-tooltip", { attrs: { placement: "top", content: "Remove" } }, [n("i", { staticClass: "el-icon-close" })])],
                                        ),
                                    ],
                                    1
                                ),
                            ],
                            1
                        ),
                        n(
                            "div",
                            { staticClass: "option-formStyle" },
                            [
                                "array" === e.value.type
                                    ? [n("schema-array", { attrs: { prefix: e.prefixArray, data: e.value, "is-mock": e.isMock, "show-title": e.showTitle, "show-default-value": e.showDefaultValue, "editor-id": e.editorId } })]
                                    : e._e(),
                                "object" === e.value.type && e.showIcon
                                    ? [n("schema-object", { attrs: { prefix: e.nameArray, data: e.value, "is-mock": e.isMock, "show-title": e.showTitle, "show-default-value": e.showDefaultValue, "editor-id": e.editorId } })]
                                    : e._e(),
                            ],
                            2
                        ),
                    ],
                    1
                );
            };
            r._withStripped = !0;
            var i = n(22),
                o = n.n(i),
                a = n(12),
                s = function () {
                    var e = this,
                        t = e.$createElement,
                        n = e._self._c || t;
                    return n(
                        "el-tooltip",
                        { attrs: { placement: "top", content: "添加兄弟/子节点" } },
                        [
                            n(
                                "el-dropdown",
                                { attrs: { trigger: "click" } },
                                [
                                    n("i", { staticClass: "el-icon-plus plus" }),
                                    n(
                                        "el-dropdown-menu",
                                        { attrs: { slot: "dropdown" }, slot: "dropdown" },
                                        [
                                            n("el-dropdown-item", [
                                                n(
                                                    "span",
                                                    {
                                                        on: {
                                                            click: function (t) {
                                                                return e.addFieldAction({ type: "add-field", isChild: !1 });
                                                            },
                                                        },
                                                    },
                                                    [e._v("兄弟节点")]
                                                ),
                                            ]),
                                            n("el-dropdown-item", [
                                                n(
                                                    "span",
                                                    {
                                                        on: {
                                                            click: function (t) {
                                                                return e.addFieldAction({ type: "add-field", isChild: !0 });
                                                            },
                                                        },
                                                    },
                                                    [e._v("子节点")]
                                                ),
                                            ]),
                                        ],
                                        1
                                    ),
                                ],
                                1
                            ),
                        ],
                        1
                    );
                };
            s._withStripped = !0;
            var l = {
                    name: "DropPlus",
                    components: {},
                    props: { prefix: { type: Array, default: () => [] }, name: { type: String, default: "" } },
                    data: () => ({}),
                    created() {},
                    mounted() {},
                    methods: {
                        addFieldAction(...e) {
                            this.$emit("add-field", ...e);
                        },
                    },
                },
                c = n(1),
                u = Object(c.a)(l, s, [], !1, null, "050a88e4", null);
            u.options.__file = "src/Schema/DropPlus.vue";
            var d = u.exports,
                f = n(13),
                h = n(25),
                p = n(0),
                m = {
                    name: "SchemaItem",
                    components: { MockSelect: a.a, DropPlus: d, "schema-array": h.a, "schema-object": f.a },
                    props: {
                        isMock: { type: Boolean, default: !0 },
                        showTitle: { type: Boolean, default: !1 },
                        showDefaultValue: { type: Boolean, default: !1 },
                        editorId: { type: String, default: "editor_id" },
                        name: { type: String, default: "" },
                        prefix: { type: Array, default: () => [] },
                        data: { type: Object, default: () => {} },
                    },
                    data() {
                        return { showIcon: !0, tagPaddingLeftStyle: {}, schemaTypes: p.b, value: this.data.properties[this.name] };
                    },
                    computed: {
                        nameArray() {
                            const e = [].concat(this.prefix, this.name);
                            return [].concat(e, "properties");
                        },
                        prefixArray() {
                            return [].concat(this.prefix, this.name);
                        },
                    },
                    beforeMount() {
                        const e = this.prefix.filter((e) => "properties" !== e).length;
                        this.tagPaddingLeftStyle = { paddingLeft: 20 * (e + 1) + "px" };
                    },
                    methods: {
                        isUndefined: () => o.a,
                        handleClickIcon() {
                            this.showIcon = !this.showIcon;
                        },
                        handleAction(e) {
                            const { prefix: t, name: n } = this;
                            this.$jsEditorEvent.emit("schema-update-" + this.editorId, { eventType: "add-field", prefix: t, name: n, ...e });
                        },
                        handleNameChange(e) {
                            this.handleAction({ eventType: "update-field-name", value: e.target.value });
                        },
                        handleEnableRequire(e) {
                            const { prefix: t, name: n } = this;
                            this.$jsEditorEvent.emit("schema-update-" + this.editorId, { eventType: "toggle-required", prefix: t, name: n, required: e });
                        },
                        handleChangeMock() {},
                        handleChangeType(e) {
                            this.handleAction({ eventType: "schema-type", value: e });
                        },
                    },
                },
                g = Object(c.a)(m, r, [], !1, null, null, null);
            g.options.__file = "src/Schema/SchemaItem.vue";
            t.default = g.exports;
        },
    ]);
});
