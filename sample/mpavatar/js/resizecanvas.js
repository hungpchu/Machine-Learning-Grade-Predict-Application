var maxmobilesize = 700;
var canvas;
$(document).ready(function() {
    canvas = Module['canvas'];
    $(window).resize( respondCanvas);
    $(window).on("orientationchange", respondCanvas);
    $(window).on('touchmove', function(e) {
        e.preventDefault();
    });
    respondCanvas();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $( function() {
            $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
            $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
            setTimeout(function() {
                $("#mpfooter").show();
            }, 1000);
        } );
    }
    else{
        showallTab();
    }
});
function respondCanvas(){
    var w = $(window).width();
    var h = $(window).height();   
    if(w > maxmobilesize)
        w = maxmobilesize;
    if(h > maxmobilesize)
        h = maxmobilesize;
    var offsetf = 20;
    if (Math.abs(window.orientation) === 90) { //only run on mobile
        //Landscape
        canvas.width = h; 
        canvas.height = h; 
        if(window['slider'] != undefined)
            $(slider).height(h);
        if(window['video'] != undefined)
            $(video).width(h);
    } else {
        // Portrait
        canvas.width = w; 
        canvas.height = w;
        if(window['slider'] != undefined)
            $(slider).height(w);
        if(window['video'] != undefined)
            $(video).width(w);
    }
}


function showallTab(){
    $("#tabs > div").show();
    $("#tabs > ul").hide();
    $("#tabs").css({"background" : "rgba(0,0,0,0.2)", "padding-top" : "10px"}); 
    $("#tabs > div").css({"width": "35%", "border-right": "thick double #FFEB3B"});
    $("#tabs-3").css("border", "none");
    $("#mpfooter").show();
}