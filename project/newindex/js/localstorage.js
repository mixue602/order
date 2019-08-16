;(function($){
    $.localStorage = {
        check: function() {
            return "object" == typeof window.localStorage
        },
        has: function(a) {
            return localStorage.getItem(a) ? !0 : !1
        },
        set: function(a, b) {
            try {
                localStorage.setItem(a, JSON.stringify(b))
            } catch (c) {}
        },
        get: function(a) {
            try {
                return JSON.parse(localStorage.getItem(a))
            } catch (b) {}
        },
        remove: function(a) {
            localStorage.removeItem(a)
        },
        clearByReg: function(a) {
            var b = new RegExp(a);
            var c = window.localStorage;
            for (var d in c) b.test(d) && this.remove(d)
        },
        clear: function() {
            localStorage.clear()
        }
    };
    return $.localStorage;
})(jQuery);