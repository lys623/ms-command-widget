
var  f = require('../lib/file.js');
module.exports={
    init:function(path,name){
        var widgetDir =path+'/widget/'+name;
        if(f.exists(widgetDir)){
            console.log('fis3 warnning : widget ['+name+'] is exists');
            return;
        }
        console.log('fis3 tips: if you create it, input "y" else input "n" ');
        var Prompt = require('simple-prompt');
        var questions = [
            {
                question: 'vm',
                required: true
            }
            ,{question: 'js'}
            ,{question: 'less'}
            ,{question: 'json'}
        ];
        var profile = new Prompt(questions);
        profile.create().then(function (error, answers) {
            if (error) {
                return;
            }
            var createFilesArray = [];
            if(answers.vm == 'y') createFilesArray.push('vm');
            if(answers.js == 'y') createFilesArray.push('js');
            if(answers.less == 'y') createFilesArray.push('less');
            if(answers.json == 'y') createFilesArray.push('json');

            f.mkdir(widgetDir);
            //jdf.config.widget.createFiles
            createFilesArray.forEach(function(item){
                f.write(widgetDir+'/'+name+'.'+item, '');
            });
            console.log('fis3 widget "'+name+'" create done');
        });
    }
}