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
            var url = "http://miliao.chuangduyouyue.cn/index/index/dialogue?id="+data.id+"&uid="+data.uid+"&model_id="+data.model_id+"&size="+data.size;
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
        for(var i = 0; i < strs.length; i ++) {
            var arr = strs[i].split("=");
            theRequest[arr[0]]=unescape(arr[1]);
        }
    }
    return theRequest;
}