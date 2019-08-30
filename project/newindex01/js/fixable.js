;(function ( $, window, document, undefined ) {

		var pluginName = "fixable",
		defaults = {
			context: null,
			delay: 50,
			x: "left",
			y: "top",
			xValue: 0,
			yValue: 0,
			zIndex: null
		};
		var c = [];
		function d(a) {
			c.push(a)
		}

		$(window).bind("resize load scroll", function() {
			$.each(c, function(a, b) {
				b.onResize()
			})
		});

		function e(b, c) {
				var d = this.el,
					e = this.options,
					f = e.context,
					g = f.offset().left,
					h = f.offset().top,
					i = f.outerWidth(),
					j = f.outerHeight(),
					k = $.page.clientWidth(),
					l = $.page.clientHeight(),
					m = {
						xValue: b,
						yValue: c
					};
				"left" == e.x ? ("center" == e.xValue ? m.xValue = i / 100 * 50 - d.outerWidth() / 2 : -1 != ("" + b).indexOf("%") && (m.xValue = i / 100 * parseInt(b)), m.xValue += g) : "right" == e.x && ("center" == e.xValue ? m.xValue = i / 100 * 50 - d.outerWidth() / 2 : -1 != ("" + b).indexOf("%") && (m.xValue = i / 100 * parseInt(b)), m.xValue += k - (g + i));
				var n = h + j > l ? l : j;
				return "top" == e.y ? ("center" == e.yValue ? m.yValue = n / 100 * 50 - d.outerHeight() / 2 : -1 != ("" + c).indexOf("%") && (m.yValue = n / 100 * parseInt(c)), l > h + j && (m.yValue += h)) : "bottom" == e.y && ("center" == e.yValue ? m.yValue = n / 100 * 50 - d.outerHeight() / 2 : -1 != ("" + c).indexOf("%") && (m.yValue = n / 100 * parseInt(c)), l > h + j && (m.yValue += l - (h + j))), m
			}

		function f() {

			var b = this.el,
				c = this.options,
				d = $.browser.isIE6(),
				f = {},
				g = c.context,
				h = c.xValue,
				i = c.yValue;
			if ("center" == h) {
				var j = b.outerWidth() / 2;
				d ? h = $.page.clientWidth() / 2 - j : (g || (f.marginLeft = -j), h = "50%")
			}
			if ("center" == i) {
				var k = b.outerHeight() / 2;
				d ? i = $.page.clientHeight() / 2 - k : (g || (f.marginTop = -k), i = "50%")
			}
			if (g) {
				var l = e.call(this, h, i);
				h = l.xValue, i = l.yValue
			}
			d ? (f.position = "absolute", 
				-1 != ("" + h).indexOf("%") && (h = $.page.clientWidth() / 100 * parseInt(h)),
				-1 != ("" + i).indexOf("%") && (i = $.page.clientHeight() / 100 * parseInt(i)), 
				0 > h && (h = 1), 0 > i && (i = 1), 
				"top" == c.y && b[0].style.setExpression("top", "eval((document.documentElement||document.body).scrollTop+" + i + ") + 'px'"), 
				"bottom" == c.y && b[0].style.setExpression("top", "eval((document.documentElement||document.body).scrollTop+ " + -i + " + (document.documentElement||document.body).clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0))+'px'"), 
				"left" == c.x && b[0].style.setExpression("left", "eval((document.documentElement||document.body).scrollLeft+" + h + ") + 'px'"), 
				"right" == c.x && b[0].style.setExpression("left", "(eval((document.documentElement||document.body).scrollLeft + " + -h + " + (document.documentElement||document.body).clientWidth-this.offsetWidth)-(parseInt(this.currentStyle.marginLeft,10)||0)-(parseInt(this.currentStyle.marginRight,10)||0)) + 'px'"), 
				$("html").eq(0).css("text-overflow", "ellipsis")) : (f.position = "fixed", f[c.x] = h, f[c.y] = i), b.css(f)
		}


		function Fixable ( el, options ) {
				this.el = $(el);
				this.options = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		$.extend(Fixable.prototype, {
				resizeThread: -1,
				init: function() {
					var a = this,
						b = this.el,
						c = this.options;
					null != c.zIndex && b.css("z-index", c.zIndex), c.context && 0 == c.context.length && (c.context = null), f.call(a), a.options.delay >= 0 && d(a)
				},
				onResize: function() {
					var a = this,
						b = a.options;
					clearTimeout(a.resizeThread), a.resizeThread = setTimeout(function() {
						f.call(a)
					}, b.delay)
				}

		});
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Fixable( this, options ) );
						}
						// console.log($.data(this));
						// console.log(this);
						// console.log(elevator);
						// console.log(this == elevator);
						
				});
		};

})( jQuery, window, document );