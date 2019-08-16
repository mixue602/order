function c() {
		var a = $(".floor:eq(0)");
		if (a && a.length > 0) {
			var b = [],
				c = [];
			$(".floor").each(function(a) {
				b.push({
					f: a + 1 + "F",
					n: $(this).data("title")
				})
			}), $.each(b, function(a, b) {
				c.push('<li class="handler"><b class="etitle" href="javascript:;"></b><a href="javascript:;"><span>'+ b.f +'</span><p>' + b.n + '</p></a></li>')
			}), $("body").append('<div id="elevator" class="elevator"><div class="fl_nav">楼层导航</div><ul>' + c.join("") + '</ul><ul class="fl_goto"><li class="flTop"><a href="javascript:;"></a></li><li class="fl_bottom"><a href="javascript:;"></a><span></span></li></ul></div>');
			var d = $("#elevator");
			(d.fixable({
				x: "left",
				y: "top",
				xValue: -(d.width() + 10),
				yValue: "center",
				zIndex: 960,
				context: a
			}), d.delegate(".handler", "mouseenter", function() {
				$(this).addClass("hover")
			}), d.delegate(".handler", "mouseleave", function() {
				$(this).removeClass("hover")
			}));
			var e = $("body");
			e.elevator({
				floorClass: "floor",
				elevatorClass: "elevator",
				handlerClass: "handler",
				selectClass: "current",
				delay: 1200,
				easing: "easeOutCirc",
				onStart: function() {

                },
				onEnd: function(a) {
					$(a.floor).addClass("floor-current").siblings().removeClass("floor-current");
				}
			}),	
				f = [];
				var elevator = e.data("plugin_elevator");
			elevator.handlers.each(function(a) {
				var b = "f+" + (a + 1);
				f.push(b)
			}), $("body").smartkey({
				name: "elevator",
				keys: f,
				callback: function(a) {
					elevator.goto(a - 1)
				}
			})

            $("#elevator .flTop").hover(function(){
                $(this).find('a').addClass('hover');
            },function(){
                $(this).find('a').removeClass('hover');
            })
            $("#elevator .fl_bottom").hover(function(){
                $(this).find('a').addClass('hover');
            },function(){
                $(this).find('a').removeClass('hover');
            })
            $("#elevator .flTop").click(function(){
                $('body,html').animate({scrollTop:0},500);
            });
            $("#elevator .fl_bottom").click(function(){
                $('body,html').animate({scrollTop:$('#gome-foot').offset().top},500);
            });
		}
	}
	c();