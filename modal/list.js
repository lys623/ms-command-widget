
var  f = require('../lib/file.js');
module.exports={
    init:function(path,name){
        var force = false;
        var remoteSettings=global.settings;
        //global.remoteSettings=remoteSettings;
        //if(!remoteSettings){
        //    console.log('fis3 warnning : please write fis.config.set("deploy.widget.ftp",{}) in fis-conf.js file');
        //    return ;
        //}
        var publishDir = remoteSettings.widgetServerDir +'widget';
        var ftp = require('../lib/ftp.js');
        ftp.list(publishDir, function(data){
            if(data){
                console.log('jdf widget list: ');
                console.log('----------------');
                data.forEach(function(item){
                    console.log(item.name);
                })
                ftp.client.end();
            }
        })
    }
}