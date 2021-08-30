var resolution_factor = 2; // TO-DO: count based of amount of symbols in longest string
var card = { 
    "width" : 86*resolution_factor, 
    "height" : 55*resolution_factor, 
    "padding": 10*resolution_factor, 
    "rx": 5*resolution_factor,
    "ry": 5*resolution_factor,
};
var sheet = { 
    "width" : 297*resolution_factor, 
    "height" : 420*resolution_factor 
};
var defaults = {
    "font_size": 14
}

function tick_x(i, sheet, card) {
  var lim = Math.floor(sheet.width/card.width); 
  if ( i >= lim ) {
    i = ( i - lim ) % lim;
  }
  return i;
};

function tick_y(i, sheet, card) {
  var lim = Math.floor(sheet.width/card.width);
  return Math.trunc(i/lim);
}

function outline_card(svg, card, x, y, do_round_corners) {
    var obj = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    obj.setAttributeNS(null, "x", x);
    obj.setAttributeNS(null, "y", y);
    obj.setAttributeNS(null, "width", card.width);
    obj.setAttributeNS(null, "height", card.height);
    obj.setAttributeNS(null, 'fill', 'none');
    obj.setAttributeNS(null, 'stroke', 'red');
    
    if ( do_round_corners ) {
        obj.setAttributeNS(null, 'rx', card.rx );
        obj.setAttributeNS(null, 'ry', card.ry );
    }
    
    svg.appendChild(obj);
}

function outline_all_cards(svg, sheet, card, length, do_round_corners) {
    for (let i = 0; i < length; i++) {
        var x0 = tick_x(i, sheet, card)*card.width;
        var y0 = tick_y(i, sheet, card)*card.height;
        outline_card(svg, card, x0, y0, do_round_corners);
    }
}

function add_sheet_frame(svg, sheet) {
    var obj = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    obj.setAttributeNS(null, "y", 0);
    obj.setAttributeNS(null, "x", 0);
    obj.setAttributeNS(null, "width", sheet.width);
    obj.setAttributeNS(null, "height", sheet.height);
    obj.setAttributeNS(null, 'fill', 'none');
    obj.setAttributeNS(null, 'stroke', 'blue');
    svg.appendChild(obj);
}

function saveSvg(svgEl, name) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

const sampleString = `String 1
String 2
String 3
String 4
String 5
String 6
String 7
String 8
String 9
String 10
String 11
String 12
String 13
String 14
String 15
String 16
String 17
String 18
String 19
String 20
String 21`;

function makeSvg(settings) {
    settings.text = settings.text.split("\n").map(function(y) {
      return { "text" : y };
    });
    
    var max_cards_per_page = 21;
    if ( settings.text.length > max_cards_per_page ) {
        var elemsToDelete = settings.text.length - max_cards_per_page;
        var warn_msg = "You specified more that 21 sentence. "+elemsToDelete+" strings trimmed";
        alert(warn_msg);
        settings.text.splice(settings.text.length - elemsToDelete, elemsToDelete);
    }
    
    if (settings.font_size === "") {
        settings.font_size = defaults.font_size;
    }
    
    console.log("Settings: ",settings);
    
    new d3plus.TextBox()
    .data(settings.text)
    .fontSize(settings.font_size)
    // .fontMax(24)
    // .fontMin(14)
    .fontResize(function(d) { return d.resize; })
    .height(card.height)
    .width(card.width)
    .padding(card.padding)
    .textAnchor("middle")
    .verticalAlign("middle")
    .x(function(d, i) { return tick_x(i, sheet, card) * card.width })
    .y(function(d, i) { return tick_y(i, sheet, card)  * card.height })
    .select("#cards")
    .render();
    
    svg = document.getElementById("cards");
    add_sheet_frame(svg, sheet);
    outline_all_cards(svg, sheet, card, settings.text.length, settings.round_corners);
    saveSvg(svg, 'result.svg')        
}

$( document ).ready(function() {
    console.log("Javascript ready");
    
    $( "#submit" ).click(function() {
        var settings = $('form').serializeJSON();
        makeSvg(settings);
    });
    
    $( "#load_sample" ).click(function() {
        var settings = { "text": sampleString, "font_size":defaults.font_size };
        $( "#text" ).val(settings.text);
        makeSvg(settings);
    });
});
