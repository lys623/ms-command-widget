
var  f = require('../lib/file.js');
var Openurl = require("../lib/openurl.js");
var fs = require('fs');
var settings={};
/**
 * @本地widget预览
 */
var widget = module.exports;
/**
 * @本地预览页面templete
 * @todo: 放在server上控制
 */
widget.templete = function(str, title){
    if (typeof(str) == 'undefined' || !str) {
        var str = '';
    }

    var css = '';
    settings.widget.css.forEach(function(item){
        css += '<link rel="stylesheet" type="text/css" href="'+item+'" media="all" />\r\n';
    })

    var js = '';
    settings.widget.js.forEach(function(item){
        js += '<script type="text/javascript" src="'+item+'"></script>\r\n';
    })

    return '<!DOCTYPE html>'+'\r\n'+
        '<html>'+'\r\n'+
        '<head>'+'\r\n'+
        '<meta charset="utf-8" />'+'\r\n'+
        '<title>'+title+'</title>'+'\r\n'+css+js+
        '</head>'+'\r\n'+
        '<body>'+'\r\n'+str+'\r\n'+
        '</body>'+'\r\n'+
        '</html>'
        ;
}
module.exports={
    init:function(baseUrl,name){
        var target = baseUrl+'/allwidget.html';
        settings=fis.config.get('settings');
        var widgetDir = baseUrl+'/'+settings.widgetDir||'widget';
        if (!f.exists(widgetDir)) {
            console.log('jdf error widget not exists');
            return;
        }
        var core = function(){
            var widgetListHtml = '';
            fs.readdirSync(widgetDir).forEach(function(item){
                if (f.excludeFiles(item)) {
                    widgetListHtml += '{%widget name="'+item+'"%}\r\n';
                }
            });

            var result = widget.templete( '\r\n'+widgetListHtml, (global.baseUrl.split('/').pop())+' - all widget preview' );
            f.write( target, result);
        }
        core();
        process.stdout.write(
            ((global.baseUrl.split('/').pop())+' - all widget preview done').green.bold+'\n'
        );
        setTimeout(function(){
            Openurl.open('http://localhost:8080/allwidget.html');
        },100)

    }
}
