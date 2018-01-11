# Web Uploader + PHP
## 使用背景

> WebUploader是一款非常吊的上传控件，基本可以解决你所遇到的大多上传问题。可以多附件上传，大附件可以切片上传。还可以自己定制想要的功能，如果你能把这款插件打穿，上传在无压力！

![](https://github.com/yugiwjun/webuploader/blob/master/example.png)

## 使用教程

##### 1. webuploader所在目录

* 放置文件夹到PHP环境的Web根目录下

* 自定义目录，需要调整一下文件路径，如下：
```html
<!-- Web根目录到webuploader文件下的路径 -->
<script type="text/javascript">var SITE_URL = ".";</script>
<!-- 样式文件，非官方 -->
<link rel="stylesheet" href="./css/webuploader.min.css">
<!-- 二次封装，非官方 -->
<script src="./js/myWebuploader.js"></script>
<!-- 官方控件文件 -->
<script src="./js/webuploader.min.js"></script>
```

##### 2. 控件配置完成后，访问index.html，即可达到如例图的效果，如果项目其他位置使用，只需要引入上述js css即可，调用方式如index.html中一致。

## 参数设置

- 修改下载文件保存目录，需要修改fileupload.php

```php
# 配置上传文件目录
# line 047
$targetDir = UPFILES_STORAGE.DIRECTORY_SEPARATOR.'webUploader'.DIRECTORY_SEPARATOR.date('Ym',time());
# line 048
$uploadDir = UPFILES_STORAGE.DIRECTORY_SEPARATOR.'webUploader'.DIRECTORY_SEPARATOR.date('Ym',time());
# line 160
$saveUrl = '/webUploader/'.date('Ym',time())."/".$hashName;
```

- 上传失败需查看php.ini是否满足配置
```ini
# 如果上传失败需要按需求调整以下6个参数
file_uploads = On 开启文件上传
upload_max_filesize = 100M  上传文件最大值 （必须大于5M）
post_max_size = 100M  POST接受数据最大值
memory_limit = 128M  内存限制
max_execution_time = 1800   变量max_execution_time设置了在强制终止脚本前PHP等待脚本执行完毕的时间，此时间以秒计算。
max_input_time = 1800  此变量可以以秒为单位对通过POST、GET以及PUT方式接收数据时间进行限制。
```

- 文件在上传完毕后，已经存储在服务器。保存方式为，上传完毕后，附件信息将返回到当前页面的隐藏域中，POST提交后，在后台接收再做处理，实际使用中需要按自己需求，修改js部分，实现上传回显。

```javascript
// 初始化上传控件
$("#uploader").empty();
var uploader = $("#uploader").powerWebUpload({
    // 是否自动上传
    auto: false,
    // 隐藏域name的名字，随意
    fileName: 'jFile',
    // 最大个数
    fileNumLimit: 10,
    // 最大尺寸
    fileSingleSizeLimit: 500*1024*1024,
    innerOptions:{
        // 类型限制
        accept: {
            title: 'Files',
            extensions: 'gif,jpg,jpeg,bmp,png,pdf,mp4',
            mimeTypes: 'image/*,application/pdf,audio/mp4,video/mp4'
        }
    }
});
```

```
# 后台接收对象为参数 fileName 的值，如下：
$_POST['jFile']
```

## 缺点
- 集中上传大文件（500M左右），会以切片方式上传，上传时并无明显问题，但是在切面组合时，读取文件频繁，IO消耗严重，导致拼接100片需要很久，会引发服务器连接超时，用户过久等待问题。
- 由于上传大附件需要等待较长时间，实际中，会存在用户再上传一半时就点击了提交，导致上传失败，在实际使用中，需要增加一些特殊的验证，保证用户操作不会影响到上传，强制关闭页面除外。
