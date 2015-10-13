
var  f = require('../lib/file.js');
module.exports={
    init:function(path,name){
        var force = false;
        var remoteSettings=global.settings;
        global.remoteSettings=remoteSettings;
        var source = remoteSettings.widgetServerDir +'widget/'+name;
        var target = global.baseUrl+'/widget/'+name;

        var widgetname = name;
        var ftp = require('../lib/ftp.js');

        ftp.client.on('ready',function(){
            //console.log(source)
            ftp.listMain(source, function(data){
                //console.log(data)
                if (data != 'error') {
                    var version = '';
                    data.forEach(function(item){
                        version = item.name;
                    })
                    if (!parseInt(version)) {
                        version = '';
                    }

                    var widgetNameVersion = widgetname+'/'+version;

                    if (!force) {
                        if (f.exists(target) ) {
                            console.log('jdf warnning widget "'+widgetname+'" is exists in current project');
                            return;
                        }
                    }
                    //console.log(source+'/'+version)
                    //console.log(target)
                    //if (type=='dir') {
                    ftp.downloadMain(source+'/'+version, target, function(data){
                        //console.log('cbdata:'+data)
                        if (data == 'error') {
                            console.log('jdf warnning widget "'+widgetNameVersion+'" is not exists on server ');
                        }else{
                            console.log('jdf widget "'+widgetNameVersion+'" install done from server ');
                        }
                    })
                    //}else{
                    //	console.log('jdf warnning "'+name+'" format error in server');
                    //}
                }else{
                    console.log('jdf error [widget.install] ftp error!,or not find '+name+' widget ');
                }
            });
        });


    }
}