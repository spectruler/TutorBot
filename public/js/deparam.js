(function($){

    $.deparam = $.deparam || function(uri){
        if(uri === undefined){
            uri = window.location.pathname
        }
        var val = window.location.pathname
        var val2 = val.split('/')
        var names = val2.pop()
        return names
    }

})(jQuery);