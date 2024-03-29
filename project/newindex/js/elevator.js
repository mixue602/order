;(function ( $, window, document, undefined ) {
		var a = $;
		var pluginName = "elevator",
		defaults = {
			floorClass: "floor",
			elevatorClass: "elevator",
			handlerClass: "handler",
			selectClass: null,
			event: "click",
			delay: 300,
			easing: null,
			effectSmooth: !0,
			threshold: "auto",
			floorScrollMargin: 0,
			onStart: null,
			onEnd: null,
			onOut: null
		};
		
		var c = -1;
		var d = -1;
		var e = [];
		var f = function(b, c) {
				var d = this;
				a.extend(d, c), d.self = b, d.isPlay = !1, d.isScrolling = !1, d.scrollThread = -1, d.resizeThread = -1, d.currentIdx = -1, d.floorList.each(function(b) {
					a(this).attr("data-idx", b)
				}), d.handlers.each(function(b) {
					a(this).attr("data-idx") || a(this).attr("data-idx", b)
				}), d.onScroll(), e.push(d)
			};
		f.prototype.onScroll = function() {
			var b = this;
			b.isPlay || (b.isScrolling || (b.isScrolling = !0, a.isFunction(b.onStart) && b.onStart()), clearTimeout(b.scrollThread), b.scrollThread = setTimeout(function() {
				var c = !1;
				var d = i(b.floorList);
				d && (c = !0, a.isFunction(b.onEnd) && b.onEnd.call(b, d)), g(b, c), c || a.isFunction(b.onOut) && b.onOut.call(b), b.isScrolling = !1
			}, 200))
		}, f.prototype.onResize = function() {
			var b = this;
			clearTimeout(b.resizeThread), b.resizeThread = setTimeout(function() {
				a.isFunction(b.onResizeCallback) && b.onResizeCallback.call(b)
			}, 200)
		}, f.prototype.remove = function() {
			var b = this;
			return a.each(e, function(a, c) {
				return b == c ? (e.slice(a, 1), !0) : void 0
			}), !1
		};

		function g(b, c) {
			if ("auto" == b.threshold) c ? b.elevatorBox.show() : b.elevatorBox.hide();
			else if (null != b.threshold) {
				var d = a("body").scrollTop() || a("html").scrollTop();
				var e = b.threshold;
				b.threshold instanceof a && (e = b.threshold.offset().top), e > d ? b.elevatorBox.hide() : b.elevatorBox.show()
			}
		}
		function h(b, c) {
			var d = a("body,html");
			b.effectSmooth && d.stop(), d.animate({
				scrollTop: b.top-20
			}, b.delay, b.easing, function() {
				c && (c(), c = null)
			})
		}
		function i(b) {
			var c = [];
			var d = a(window).height();
			var e = a("body").scrollTop() || a("html").scrollTop();
			var f = 0;
			var g = 0;
			var h = 0;
			var i = null;
			var j = !1;
			return a.each(b, function() {
//                f:楼层上边框距顶部高
//                g:楼层本身高
//                h:楼层下边框距顶部高
//                e+d:屏幕下边框高度
//                b = h - e 先正后负
//                e + d > f   屏幕下边框top 是否大于 楼层上边框top
				if (i = a(this), f = i.offset().top, g = i.outerHeight(), h = f + g, h > e+300 && e + d > f) {
					var b = 0;
					e > f && (b = h - e), f > e && e + d > f && (b = e + d - f), !j && b > d / 3 && (j = !0, b = 9999), c.push({
						floor: i,
						ch: b
					})
				}
			}), c.length > 0 ? (c.sort(function(a, b) {
				return a.ch < b.ch ? -1 : 1
			}), c.pop().floor) : null
		}
		function j(a, b, c) {
			a.removeClass(c), b.addClass(c)
		}
		function k(a, b, c, d) {
			return {
				handler: a[d],
				floor: b[d],
				from: c || -1,
				to: d
			}
		}
		a(window).bind("scroll", function() {
			clearTimeout(c), c = setTimeout(function() {
				clearTimeout(c), a.each(e, function(a, b) {
					b.onScroll()
				})
			}, 50)
		}), a(window).bind("resize", function() {
			clearTimeout(d), d = setTimeout(function() {
				a.each(e, function(a, b) {
					b.onResize()
				})
			}, 50)
		})


		function Elevator ( el, options ) {
				this.el = a(el);
				this.options = a.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		a.extend(Elevator.prototype, {
				floorList: null,
				elevatorBox: null,
				handlers: null,
				elevator: null,
				init: function() {
					var b = this;
					var c = b.options;
					var d = b.el;
					var e = b.floorList = d.find("." + c.floorClass);
					var g = b.elevatorBox = a("." + c.elevatorClass);
					var i = b.handlers = a("." + c.handlerClass, g);
					if (c.floorScrollMargin = isNaN(parseInt(c.floorScrollMargin)) ? 0 : parseInt(c.floorScrollMargin), e.length > 0 && e.length == i.length) {
						null != c.threshold && g.hide();
						var l = b.elevator = new f(b, {
							floorList: e,
							elevatorBox: g,
							handlers: i,
							delay: c.delay,
							threshold: c.threshold,
							selectClass: c.selectClass,
							onStart: function() {
								a.isFunction(c.onStart) && c.onStart.call(b, k(i, e, l ? l.currentIdx : -1, -1))
							},
							onEnd: function(d) {
								if (d) {
									var f = d.attr("data-idx");
									var g = l.currentIdx;
									if (l.currentIdx = f, f < l.handlers.length && f > -1) {
										var h = a(l.handlers.filter("[data-idx=" + f + "]"));
										if (!h || h.length < 1) return !1;
										j(i, h, c.selectClass), a.isFunction(c.onEnd) && c.onEnd.call(b, k(i, e, g, f))
									}
								}
							},
							onOut: function() {
								c.selectClass && i.removeClass(c.selectClass), a.isFunction(c.onOut) && c.onOut.call(b, g)
							}
						});
						if (c.event) {
							var m = -1;
							i.live(c.event, function(d) {
								var f = a(this);
								var n = f.attr("data-idx");
								var o = a(e[n]);
								var p = l.currentIdx;
								var q = null;
								clearTimeout(m), l.isPlay = !0, l.currentIdx = n, q = k(i, e, p, n), a.isFunction(c.onStart) && c.onStart.call(b, q), c.selectClass && j(i, f, c.selectClass), h({
									top: o.offset().top + c.floorScrollMargin,
									delay: c.delay,
									easing: c.easing,
									effectSmooth: c.effectSmooth
								}, function() {
									a.isFunction(c.onEnd) && c.onEnd.call(b, q), m = setTimeout(function() {
										l.isPlay = !1
									}, 100), g.show()
								}), d.preventDefault()
							})
						}
					}
				},
				"goto": function(a) {
					var b = this;
					var c = b.options;
					var d = b.handlers;
					return 0 > a || a >= d.length || !c.event ? !1 : void d.eq(a).trigger(c.event)
				}
		});
		a.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !a.data( this, "plugin_" + pluginName ) ) {
								a.data( this, "plugin_" + pluginName, new Elevator( this, options ) );
						}
						// console.log($.data(this,"plugin_elevator"));
				});
		};

})( jQuery, window, document );