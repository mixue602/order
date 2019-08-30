(function(a) {
	if ("undefined" == typeof a.browser) {
		var c = navigator.userAgent.toLowerCase();
		a.browser = {
			version: (c.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
			safari: /webkit/.test(c),
			opera: /opera/.test(c),
			msie: /msie/.test(c) && !/opera/.test(c),
			mozilla: /mozilla/.test(c) && !/(compatible|webkit)/.test(c)
		}
	} else if (!a.browser.webkit) {
		var c = navigator.userAgent.toLowerCase();
		a.browser.webkit = /webkit/.test(c)
	}
	a.extend(a.browser, function() {
		{
			var a = navigator.userAgent;
			navigator.appVersion
		}
		return {
			mobile: !! a.match(/AppleWebKit.*Mobile.*/),
			ios: !! a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
			android: a.indexOf("Android") > -1 || a.indexOf("Linux") > -1,
			iPhone: a.indexOf("iPhone") > -1,
			iPad: a.indexOf("iPad") > -1,
			webApp: -1 == a.indexOf("Safari")
		}
	}()), a.browser.isMobile = function() {
		return a.browser.mobile || a.browser.ios || a.browser.android
	}, a.browser.isIE6 = function() {
		return a.browser.msie && 6 == a.browser.version
	}, a.browser.isIE7 = function() {
		return a.browser.msie && 7 == a.browser.version
	}, a.browser.isIE8 = function() {
		return a.browser.msie && 8 == a.browser.version
	}, a.browser.isIE9 = function() {
		return a.browser.msie && 9 == a.browser.version
	}, a.browser.isIE10 = function() {
		return a.browser.msie && 10 == a.browser.version
	}, a.browser.isIE11 = function() {
		return a.browser.msie && 11 == a.browser.version
	}, a.page = function() {}, a.page.doc = function() {
		return "BackCompat" == document.compatMode ? document.body : document.documentElement
	}, a.page.clientWidth = function() {
		return a.page.doc().clientWidth
	}, a.page.clientHeight = function() {
		return a.page.doc().clientHeight
	}, a.page.docWidth = function() {
		return Math.max(a.page.doc().clientWidth, a.page.doc().scrollWidth)
	}, a.page.docHeight = function() {
		return Math.max(a.page.doc().clientHeight, a.page.doc().scrollHeight)
	}, "undefined" == typeof a.contains && (a.contains = function(a, b) {
		return a.compareDocumentPosition ? !! (16 & a.compareDocumentPosition(b)) : a !== b && a.contains(b)
	}), a.throttle = function(a, b) {
		var c, d, e, f;
		var g = 0;
		var h = function() {
				g = new Date, e = null, f = a.apply(c, d)
			};
		return function() {
			var i = new Date;
			var j = b - (i - g);
			return c = this, d = arguments, 0 >= j ? (clearTimeout(e), e = null, g = i, f = a.apply(c, d)) : e || (e = setTimeout(h, j)), f
		}
	}, a.tpl = function(a, b) {
		var c = "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + a.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');";
		return fn = new Function("obj", c), b ? fn(b) : fn
	}
})(jQuery),function(a) {
    if (a.browser.isMobile()) {
        var c,
            b = {};
        function d(a) {
            return "tagName" in a ? a: a.parentNode
        }
        function e(a, b, c, d) {
            var e = Math.abs(a - b),
                f = Math.abs(c - d);
            return e >= f ? a - b > 0 ? "Left": "Right": c - d > 0 ? "Up": "Down"
        }
        var g,
            f = 750;
        function h() {
            g = null,
                b.last && (b.el.trigger("longTap"), b = {})
        }
        function i() {
            g && clearTimeout(g),
                g = null
        }
        a(document).ready(function() {
            var j,
                k;
            a(document.body).bind("touchstart",
                function(e) {
                    j = Date.now(),
                        k = j - (b.last || j),
                        b.el = a(d(e.target)),
                        c && clearTimeout(c),
                        b.x1 = e.pageX,
                        b.y1 = e.pageY,
                        k > 0 && 250 >= k && (b.isDoubleTap = !0),
                        b.last = j,
                        g = setTimeout(h, f)
                }).bind("touchmove",
                function(a) {
                    i(),
                        b.x2 = a.pageX,
                        b.y2 = a.pageY
                }).bind("touchend",
                function() {
                    i(),
                        b.isDoubleTap ? (b.el.trigger("doubleTap"), b = {}) : b.x2 && Math.abs(b.x1 - b.x2) > 30 || b.y2 && Math.abs(b.y1 - b.y2) > 30 ? (b.el.trigger("swipe") && b.el.trigger("swipe" + e(b.x1, b.x2, b.y1, b.y2)), b = {}) : "last" in b && (b.el.trigger("tap"), c = setTimeout(function() {
                                c = null,
                                    b.el.trigger("singleTap"),
                                    b = {}
                            },
                            250))
                }).bind("touchcancel",
                function() {
                    c && clearTimeout(c),
                        g && clearTimeout(g),
                        g = c = null,
                        b = {}
                })
        }),
            ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(b) {
                a.fn[b] = function(a) {
                    return this.bind(b, a)
                }
            })
    }
} ($);