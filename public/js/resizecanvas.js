var maxmobilesize = 700;
var canvas;
$(document).ready(function() {
    canvas = Module['canvas'];
    // console.log(" Module['canvas'] = ");
    // console.log(Module['canvas']);
    // console.log('canvas = ');
    // console.log(canvas);
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
    // console.log('w= ', w);
    var h = $(window).height();  
    // console.log('h = ', h); 
    if(w > maxmobilesize)
        w = maxmobilesize;
    if(h > maxmobilesize)
        h = maxmobilesize;
    var offsetf = 20;

    // console.log('canvas.width trc = ');
    // console.log(canvas.width);  
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
        // console.log('w NULL = ', w);
        // console.log('canvas.width trc = ', canvas.width);   
        canvas.width = w; 
        // console.log('canvas.width = ', canvas.width);   
        canvas.height = w;
        // console.log(' canvas.height = ',  canvas.height);   
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