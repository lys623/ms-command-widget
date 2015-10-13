# ms-command-widget
服务器需配置ftp服务器；
```js
fis.config.set('settings',{
  connect : {
    host:'192.168.97.150',
    user:'＊＊＊＊＊＊',
    password:'＊＊＊＊＊＊'
  },
    "baseDir": "", //静态文件名称
    "cssDir": "css", //css文件夹名称
    "imgDir": "css/i", //css/i文件夹名称
    "imagesDir": "images", //images文件夹名称
    "jsDir": "js", //js文件夹名称
    "htmlDir": "html", //html文件夹名称
    "widgetDir": "widget", //widget文件夹名称
    "cdn":"http://www.miaoshoucdn.com",
    "devcdn": "http://192.168.97.150:89", //newcdn
    "serverDir": "/wwwroot/www.miaoshoucdn.com/", //上传至远端服务器文件夹的名称
    "previewServerDir": "/wwwroot/page.miaoshou.com/", //html文件夹上传至服务器所在的文件夹名称
    "widgetServerDir": "/wwwroot/widget.miaoshou.com/", //widget服务器所在的文件夹名称
  "widgetDir":"widget",
  "widget":{
    //widget预览所依赖的js
    "js": [
      "http://misc.360buyimg.com/jdf/lib/jquery-1.6.4.js",
      "http://misc.360buyimg.com/jdf/1.0.0/unit/base/1.0.0/base.js"
    ],
    //widget预览所依赖的css
    "css": [
      "http://misc.360buyimg.com/lib/skin/2013/base.css"
    ],
    //新建widget文件夹的文件类型
    "createFiles": ["vm"]
  }
})
```