/**
 * Created by luyisheng on 15/10/1.
 */

exports.name = 'widget [media name]';
exports.desc = 'build and deploy your project';
exports.options = {
    '-c, --create xxx':'create a widget to local',
    '-i, --install xxx':'install a widget to local',
    '-a, --all': 'preview all widget',
    '-l, --list': 'get widget list from server',
    '-u, --upload xxx':'upload a widget to server',
    '-p, --preview xxx':'preview a widget',
};

exports.run = function(argv, cli, env) {
    global.baseUrl=env.configBase;
    // 显示帮助信息
    if (argv.h || argv.help) {
        return cli.help(exports.name, exports.options);
    }
    validate(argv);
    var settings=fis.config.get('settings')||{};
    global.settings=settings;
    if(!settings){
        console.log('fis3 warnning : please write fis.config.set("settings",{}) in fis-conf.js file');
        return ;
    }
    if(argv.c||argv.create){
        require('./modal/create.js').init(env.configBase,(argv.c||argv.create));
    }else if(argv.u||argv.upload){
        require('./modal/upload.js').init(env.configBase,(argv.u||argv.upload));
    }else if(argv.i||argv.install){
        require('./modal/install.js').init(env.configBase,(argv.i||argv.install));
    }else if(argv.l||argv.list){
        require('./modal/list.js').init(env.configBase,(argv.l||argv.list));
    }else if(argv.a||argv.all){
        require('./modal/previewAll.js').init(env.configBase,argv);
    }else if(argv.p||argv.preview){
        require('./modal/preview.js').init(env.configBase,argv.p||argv.preview);
    }else{
        return cli.help(exports.name, exports.options);
    }
}

function validate(argv) {
    if (argv._.length > 1) {
        fis.log.error('Unregconized `%s`, please run `%s widget --help`', argv._.slice(1).join(' '), fis.cli.name);
        return;
    }

    var allowed = ['_', 'create', 'c', 'install', 'i', 'all', 'a', 'list', 'l', 'upload', 'u', 'preview', 'p'];

    Object.keys(argv).forEach(function(k) {
        if (!~allowed.indexOf(k)) {
            fis.log.error('The option `%s` is unregconized, please run `%s widget --help`', k, fis.cli.name);
            return;
        }
    });
}