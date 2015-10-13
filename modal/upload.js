var widget=require('../lib/widget.js');
var ftp = require('ftp');
var path = require('path');
var f = require('../lib/file.js');



var remoteDirCache = {};
var resolveing = {};
module.exports= {
    init:function(path,name){
        var force=false;
        //var remoteSettings=fis.config.get('deploy.widget.ftp');
        //global.remoteSettings=remoteSettings;
        //if(!remoteSettings){
        //    console.log('fis3 warnning : please write fis.config.set("deploy.widget.ftp",{}) in fis-conf.js file');
        //    return ;
        //}
        if (widget.pathCheck(name)) {
            return;
        }
        remoteSettings=global.settings;
        remoteSettings.remoteDir = remoteSettings.widgetServerDir || '/';
        //dest = path.join(dest.to || '', dest.release);
        //var dirname = global.baseUrl+'/widget/'+name;

        var cUrl = global.baseUrl+'/widget/'+name  +'/'+ 'component.json';
        f.readJSON(cUrl, function(data){
            if (data) {
                var cName = data.name;
                var cVersion = data.version;
                var ftp = require('../lib/ftp.js');
                var publishDir=remoteSettings.remoteDir+'widget';
                var target = publishDir+'/'+name+'/'+cVersion;
                //ftp.mkdir(publishDir+'/'+name);
                ftp.mkdir(target);
                ftp.list(target, function(data){
                    if (data == 'error' || force) {
                        ftp.mkdir(publishDir+'/'+name+'/');
                        ftp.mkdir(target);
                        ftp.uploadMain(global.baseUrl+'/widget/'+name, target, null, null, null, null, null, function(err){
                            console.log('jdf widget "'+''+name+'/'+cVersion+'" publish done!');
                        });
                    }else {
                        console.log('jdf warnning "'+target+'" is exists in server');
                    }
                });
            }
        });
    }
}

// 参考：
// https://github.com/hitsthings/node-live-ftp-upload/blob/master/index.js
function createFtpQueue(opts) {
    var client;
    var queue = [];

    opts.remoteDir = opts.remoteDir.replace(/^\/+/, '');

    function initClient(cb) {
        client = new ftp();
        client.on('ready', cb);
        client.on('error', function (err, info){
            var message = err.message;
            if (message == 'connect ETIMEDOUT') {
                return;
            }
            console.log('deploy ftp: error ' + message);
            client.destroy();
        });
        client.connect(opts.connect);
    }
    function consoleinfo(info){
        if (opts.console) {
            console.info(info);
        }
    }

    function getRemoteName(filename) {
        console.log(filename+'\n')
        console.log(opts.remoteDir)
        return path.join(opts.remoteDir, filename).replace(/\\/g, '/');
    }

    function doSend(filename, remoteName, fileSource) {
        if (!client) {
            initClient(doSend.bind(null, filename, remoteName, fileSource));
            return;
        }
        remoteName = getRemoteName(remoteName) || getRemoteName(filename);
        consoleinfo("Uploading " + filename + " as " + remoteName + ".");
        client.put(fileSource || filename, remoteName, function(err) {
            consoleinfo(err ? "Couldn't upload " + filename + ":\n" + err : filename + ' uploaded.');
            advanceQueue(err);
        });
    }

    function doDelete(filename) {
        if (!client) {
            initClient(doDelete.bind(null, filename));
            return;
        }
        var remoteName = getRemoteName(filename);
        consoleinfo("Deleting  " + remoteName + ".");
        client.delete(remoteName, function(err) {
            consoleinfo(err ? "Couldn't delete " + filename + ":\n" + err : filename + ' deleted.');
            advanceQueue(err);
        });
    }

    function doMkdir(filename) {
        if (!client) {
            initClient(doMkdir.bind(null, filename));
            return;
        }
        var remoteName = getRemoteName(filename);
        consoleinfo("Adding  " + remoteName + ".");
        client.mkdir(remoteName, true, function(err) {
            consoleinfo(err ? "Couldn't add " + filename + ":\n" + err : filename + ' added.');
            advanceQueue(err);
        });
    }

    function doRmdir(filename) {
        if (!client) {
            initClient(doMkdir.bind(null, filename));
            return;
        }
        var remoteName = getRemoteName(filename);
        consoleinfo("Deleting  " + remoteName + ".");
        client.rmdir(remoteName, function(err) {
            consoleinfo(err ? "Couldn't delete " + filename + ":\n" + err : filename + ' deleted.');
            advanceQueue(err);
        });
    }

    function doList(dirname) {
        if (!client) {
            initClient(doList.bind(null, dirname));
            return;
        }
        var remoteName = getRemoteName(dirname);
        console.log('remoteName'+remoteName)
        consoleinfo("Listing  " + remoteName + ".");

        // some bs to deal with this callback possibly being called multiple times.
        // the result we want is not always the first or last one called.
        var result = [], resultTimer;
        client.list(remoteName, function(err, list) {
            if (err) {
                result = true;
                consoleinfo("Couldn't list " + dirname + ":\n" + err);
                advanceQueue(err, list);
            }
            if (result === true || result.length) return;

            if (list && list.length) {
                result = list;
            }
            if (resultTimer) return;
            resultTimer = setTimeout(function() {
                consoleinfo(dirname + ' listed.');
                advanceQueue(null, result);
            }, 100);
        });
    }

    function execute(entry) {
        var file = entry.file;
        var remoteName = entry.remoteName;
        var action = entry.action;
        switch(action) {
            case 'upsert' : doSend(file, remoteName, entry.source); break;
            case 'delete' : doDelete(file); break;
            case 'mkdir' : doMkdir(file); break;
            case 'rmdir' : doRmdir(file); break;
            case 'list'   : doList(file); break;
            default       : throw new Error("Unexpected action " + action); break;
        }
    }

    function entryEquals(a, b) {
        return a.action === b.action &&
            a.file === b.file
        a.callback === b.callback;
    }

    function addToQueue(entry) {
        if (queue.slice(1).some(entryEquals.bind(null, entry))) {
            return;
        }
        queue.push(entry);
        if (queue.length === 1) {
            execute(entry);
        }
    }

    function advanceQueue(err, currentResult) {
        var finished = queue.shift();
        if (!finished) {
            return ;
        }
        if (finished.callback) {
            finished.callback(err, currentResult);
        }
        if (queue.length) {
            execute(queue[0]);
        }
    }

    function addFile(filename, remoteName, source, callback) {
        addToQueue({ file : filename, source: source, remoteName: remoteName, action : 'upsert', callback : callback });
    }

    function removeFile(filename, callback) {
        addToQueue({ file : filename, action : 'delete', callback : callback });
    }

    function addDir(filename, callback) {
        addToQueue({ file : filename, action : 'mkdir', callback : callback });
    }

    function removeDir(filename, callback) {
        addToQueue({ file : filename, action : 'rmdir', callback : callback });
    }

    function listFiles(dirname, callback) {
        addToQueue({ file : dirname, action : 'list', callback : callback });
    }

    function end(){
        client.end();
    }

    return {
        addFile : addFile,
        removeFile : removeFile,
        addDir : addDir,
        removeDir : removeDir,
        listFiles : listFiles,
        advanceQueue : advanceQueue,
        end : end
    };
}
