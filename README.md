# WebUploader结合PHP使用说明
## 使用背景

> WebUploader是一款非常吊的上传控件，基本可以解决你所遇到的大多上传问题。可以多附件上传，大附件可以切片上传。还可以自己定制想要的功能，如果你能把这款插件打穿，上传在无压力！

![](https://github.com/yugiwjun/webuploader/blob/master/example.png)

## 使用教程

1.把文件夹解压缩后，放置文件夹到安装完成的PHP环境WEB根目录下，访问index.html

```shell
**
若未放置在根目录下，需要调整一下路径
**
<!-- Web根目录到webuploader文件下的路径 -->
<script type="text/javascript">var SITE_URL = ".";</script>
<!-- 样式文件，非官方 -->
<link rel="stylesheet" href="./css/webuploader.min.css">
<!-- 二次封装，非官方 -->
<script src="./js/myWebuploader.js"></script>
<!-- 官方控件文件 -->
<script src="./js/webuploader.min.js"></script>
```

2.访问index.html就可以实现例图的效果了

3.fileupload.php

    php.ini配置

    ```shell
    file_uploads = On 开启文件上传
    upload_max_filesize = 100M  上传文件最大值 （必须大于5M）
    post_max_size = 100M  POST接受数据最大值
    memory_limit = 128M  内存限制
    max_execution_time = 1800   变量max_execution_time设置了在强制终止脚本前PHP等待脚本执行完毕的时间，此时间以秒计算。
    max_input_time = 1800  此变量可以以秒为单位对通过POST、GET以及PUT方式接收数据时间进行限制。
    如果上传失败需要按需求调整以上6个参数
    ```

    **如果该问价下载地址，需要改一下三行**
    # 配置上传文件目录
    line047 ：$targetDir = UPFILES_STORAGE.DIRECTORY_SEPARATOR.'webUploader'.DIRECTORY_SEPARATOR.date('Ym',time());
    line048 ：$uploadDir = UPFILES_STORAGE.DIRECTORY_SEPARATOR.'webUploader'.DIRECTORY_SEPARATOR.date('Ym',time());
    line160 ：$saveUrl = '/webUploader/'.date('Ym',time())."/".$hashName;

4.后台通过POST接收数据的name值就是

    **
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

    fileName参数的值
    **
