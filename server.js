/**
 * Created by tu6ge on 2018/6/30.
 */
"use strict";
var page = require('webpage').create();
var server = require('webserver').create();
var system = require('system');
var host, port;
page.viewportSize = { width: 750, height: 1080 };
var fs = require('fs');

if (system.args.length !== 2) {
    console.log('Usage: server.js <some port>');
    phantom.exit(1);
} else {
    port = system.args[1];
    var listening = server.listen(port, function (request, response) {
        console.log("GOT HTTP REQUEST");
        console.log(JSON.stringify(request, null, 4));

        if(request.url=="/favicon.ico"){
            console.log('渲染favicon');
            error(response,'favicon');
        }

        // we set the headers here
        try{
            var data = GetRequest(request.url);
            var settings = {
                encoding: "utf8",
                headers: {
                    "Content-Type": "text/html;charset=utf-8"
                }
            };
			if(!data.url){
				error(response,"url is empty");
                return;
			}
            var base = new Base64();
            var url = base.decode(data.url);
            page.open(url,settings, function start(status) {
                if (status !== 'success') {
                    error(response,"open web fail");
                    return;
                }
                response.statusCode = 200;
                //response.headers = {"Cache": "no-cache", "Content-Type": "text/json;charset=utf-8"};
                response.headers = {"Cache": "no-cache", "Content-Type": "image/png"};

                console.log('渲染完成');
                var base64 = page.renderBase64('PNG');
                var buffer = atob(base64);
                response.setEncoding("binary");
                response.write(buffer);
                //response.write('{"code":1,"base64":"'+base64+'"}');
                response.close();
            });
        }catch(err){
            response.write('{"code":0,"msg":"js error ,info:'+err+'"}');
            response.close();
        }


    });
    if (!listening) {
        console.log("could not create web server listening on port " + port);
        phantom.exit();
    }
}

function error(response,msg){
    response.statusCode = 200;
    response.headers = {"Cache": "no-cache", "Content-Type": "text/json;charset=utf-8"};
    response.write('{"code":0,"msg":"'+msg+'"}');
    response.close();
}
function GetRequest(url) {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(2);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i++ ) {
            var arr = strs[i].split("=");
            theRequest[arr[0]] = encodeURIComponent(arr[1]);
        }
    }
    return theRequest;
}
function Base64() {
 
	// private property
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
	// public method for encoding
	this.encode = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
 
	// public method for decoding
	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
 
	// private method for UTF-8 encoding
	var _utf8_encode = function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
		return utftext;
	}
 
	// private method for UTF-8 decoding
	var _utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = 0, c1 = 0, c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				var c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}