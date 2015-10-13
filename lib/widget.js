/**
 * Created by luyisheng on 15/10/1.
 */
//exports
var widget = module.exports;
var  f = require('../lib/file.js');
widget.pathCheck = function(name){
    if (typeof(name) == 'undefined'||name==true){
        console.log('fis3 error widgetName is required,please run fis3 widget --help');
        return true;
    }

    /*
     if ( !/^widget\//.test(name) ) {
     console.log('jdf error widget name format error');
     return true;
     }*/
    if (! f.exists(global.baseUrl+'/widget/'+name)) {
        console.log('fis3 error widget '+name+' is not exists');
        return true;
    }

    return false;
}
