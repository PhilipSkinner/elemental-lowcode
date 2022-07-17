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
            e.exports = (function () {})();
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
                "",
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
                "",
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
                "",
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
                "",
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
                "",
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
            e.exports = {};
        },
        function (e, t, n) {
            !(function (e) {

            })(n(15));
        },
        function (e, t, n) {
            !(function (e) {})(n(15));
        },
        function (e, t, n) {
            !(function (e) {
                "use strict";
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
                "",
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
