;(function($){
    $.fn.cityBan = function(options){

        var _default = {
            item:".scroll-recInner",
            loopStep:40,
            next:".scroll-recBtn .down",
            prev:".scroll-recBtn .up",
            durction:0.5
        };

        var _opt = $.extend({},_default,options);
        var _box = this;
        var _moveBox = $(_box).find(_opt.item)
        var _index = 1
        

        var _firstC = _moveBox.children(":first-child").clone()
        var _lastC = _moveBox.children(":last-child").clone()

        _moveBox.append(_firstC).prepend(_lastC).css("top",_opt.loopStep*-1)

        var _length = _moveBox.children().length;

        $(_box).delegate(_opt.next,"click",function(){
            var callback = null;
            if(++_index >= _length-1){
                callback = function(){
                    _index = 1;
                    _moveBox.css("top",_opt.loopStep*-1)
                }
            }
            move(callback);
            return false;
        })
        $(_box).delegate(_opt.prev,"click",function(){
            var callback = null;
            if(--_index<= 0){
                callback = function(){
                    _index = _length-2;
                    _moveBox.css("top",_index *_opt.loopStep*-1)
                }
            }
            move(callback);
            return false;
        })
        function move(callback){
            _moveBox.stop(true,true).animate({top:_index*_opt.loopStep*-1},500,callback)
        }
        setInterval(function(){
            $(_box).find(_opt.next).trigger("click")
        },5000)
    }
})(jQuery);