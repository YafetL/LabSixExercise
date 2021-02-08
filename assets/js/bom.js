/*  
Here is the exercise on working on the remaining bom method 

Location , Navigator , screen , Window 

Follow the Instruction on the comments 

1. Declare the UI Variables for selecting on the elements 
2. Use the innerHTML property to display the result on each element 
3. The Text  of the elements will lead you what bom information is required 

Adding Extra is Possible if you want to explore more ...

Good Luck !!! 
*/




// Define UI Variables  here 

var href = document.getElementById("href");
var prot = document.getElementById("Protocol");
var hst = document.getElementById("host");
var prt = document.getElementById("port");
var host_name = document.getElementById("hostname");

var app_name = document.getElementById("appname");
var app_version = document.getElementById("appversion");
var ptform = document.getElementById("platform");
var lang = document.getElementById("language");
var cookie_enabled = document.getElementById("cookieenabled");

var hgt = document.getElementById("height");
var wdh = document.getElementById("width");
var pixel_depth = document.getElementById("pixeldepth");

var lgth = document.getElementById("length");
var stt = document.getElementById("state");


// Display the BOM Information on the innerHTML of the elements
href.innerHTML = location.href;
prot.innerHTML = location.protocol;
hst.innerHTML = location.host;
prt.innerHTML = location.port;
host_name.innerHTML = location.hostname;
app_name.innerHTML = navigator.appName;
app_version.innerHTML = navigator.appVersion;
ptform.innerHTML = navigator.platform;
lang.innerHTML = navigator.language;
cookie_enabled.innerHTML = navigator.cookieEnabled;
hgt.innerHTML = screen.height;
wdh.innerHTML = screen.width;
pixel_depth.innerHTML = screen.pixelDepth;
lgth.innerHTML = history.length;
stt.innerHTML = history.state;