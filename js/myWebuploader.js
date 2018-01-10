(function ($, window) {
    //__________¶¶_¶¶__¶¶_¶¶_¶
    //_________¶¶_¶¶_¶¶_¶¶_¶¶¶
    //_____¶¶¶¶¶____________¶¶¶¶¶¶¶
    //___¶¶¶¶¶_______________¶¶¶¶¶¶¶
    //__¶¶¶¶¶_______WJ_________¶¶¶¶¶¶
    //__¶¶¶¶____________________¶¶¶¶
    //___¶¶______________________¶¶¶
    //___¶________________________¶¶¶¶
    //__¶¶_____¶¶¶______¶¶________¶¶¶¶¶¶¶
    //__¶_____¶¶¶¶_____¶¶¶¶¶______¶¶¶¶¶¶_¶
    //__¶____¶¶¶¶¶____¶¶¶¶¶¶¶¶____¶¶¶¶¶¶__¶
    //__¶¶__¶¶¶¶¶______¶¶¶¶¶¶¶___¶¶¶¶¶¶¶___¶
    //___¶__¶¶¶__________¶¶¶¶___¶¶¶¶¶¶¶¶¶___¶
    //___¶¶____________________¶¶¶¶¶¶¶¶¶¶___¶¶¶
    //___¶¶¶_____¶¶¶¶¶¶_______¶¶¶¶¶¶¶¶¶¶¶___¶¶¶¶
    //___¶¶¶¶¶___¶¶¶¶¶¶_____¶¶¶¶¶¶¶¶¶¶¶¶¶__¶¶¶¶¶¶
    //___¶¶¶¶¶¶¶_________¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶__¶¶¶¶¶¶¶¶
    //___¶¶¶¶¶¶¶¶__¶¶¶___¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶_¶¶¶¶¶¶¶¶¶
    //____¶¶¶¶¶¶¶¶¶¶¶¶__¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶
    //____¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶ ¶¶¶¶¶¶¶¶¶¶
    //____¶¶¶¶¶¶¶¶¶_¶¶¶¶¶¶¶_¶¶¶¶¶¶¶¶¶¶¶ ¶¶¶¶¶¶¶¶
    //__¶¶¶¶¶¶¶¶¶¶¶_________¶¶¶¶¶¶¶¶¶¶¶ ¶¶¶¶¶
    //__¶¶¶¶¶¶¶¶¶¶_________¶¶¶¶¶¶¶¶¶¶¶
    //___¶¶¶¶¶¶¶_________¶¶¶¶¶¶¶¶¶¶¶¶
    //___________________¶¶¶¶¶¶¶¶¶¶¶
    //___________________¶¶¶¶¶¶¶¶¶¶


    /**
     * [配置静态文件地址，智能引入js css，若未能引入给出提示]
     * @author  [wj]
     * @date    [2017-6-27 11:25:52]
     * @version [1.0.0]
     * @return  未引入文件，提示！
     */
    var applicationPath = window.applicationPath === "" ? "" : window.applicationPath || SITE_URL;
    $.fn.powerWebUpload = function (options) {
        var ele = this;
        if (typeof WebUploader == 'undefined') {
            var casspath = applicationPath + "/webuploader/webuploader.min.css";
            $("<link>").attr({ rel: "stylesheet", type: "text/css", href: casspath }).appendTo("head");
            var jspath = applicationPath + "/webuploader/webuploader.min.js";
            $.getScript(jspath).done(function() {
                // 启动核心方法
                initWebUpload(ele, options);
            })
            .fail(function() {
                alert("请检查webuploader的路径是否正确!")
            });
        }
        else {
            // 启动核心方法
            initWebUpload(ele, options);
        }
    }


    /**
     * [算法：返回一个唯一随机ID]
     * @author  [wj]
     * @date    [2017-6-27 11:31:37]
     * @version [1.0.0]
     * @return  string  一个相对唯一的ID
     */
    function getRandomID() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }


    /**
     * [转义函数]
     * @author  [wj]
     * @param   string   待处理的字符串
     * @date    [2017-6-27 11:33:34]
     * @version [1.0.0]
     * @return  string  返回转义后的字符串
     */
    function htmlEncode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    }


    /**
     * [整理json数据放入input的value中]
     * @author  [wj]
     * @param   object   插件对文件信息的展示
     * @param   object   ajax返回值
     * @date    [2017-6-27 11:33:34]
     * @version [1.0.0]
     * @return  返回转义后的字符串
     */
    function getJsonFormValue(file, response) {
        // 此处文件名必须转义！！！
        // 此处文件名必须转义！！！
        // 此处文件名必须转义！！！
        var aForm = new Array();
        // 该文件上传文件序列的序号
        var aID = file.id.split('_');
        response['fid'] = aID.pop();
        var obj = {
                'fid':response.fid,
                'fileName':htmlEncode(response.oldName),
                'fileSize':response.fileSize,
                'url':response.filePath
            };
        aForm.push(obj);
        // [Object { fid="0",  fileName="IMG_20170624_114317.jpg",  fileSize=259417,  更多...}]
        var sForm = JSON.stringify(aForm);
        // [{"fid":"0","fileName":"IMG_20170624_114317.jpg","fileSize":259417,"url":"/webUploader/201706/1498547489605410a5c8e9e83d.jpg"}]
        return sForm;
    }


    /**
     * [初始化上传核心方法]
     * @param   object   Object[div#uploader]   uploader的JQuery对象
     * @param   object   Object { auto=false,  fileName="jFile",  fileNumLimit=10}   自定义参数
     * @author  [wj]
     * @date    [2017-6-27 13:17:14]
     * @version [1.0.0]
     * @return  上传部分整体操作
     */
    function initWebUpload(item, options) {
        // 验证当前浏览器是否支持此插件
        if (!WebUploader.Uploader.support()) {
            var error = "上传控件不支持您的浏览器！请尝试升级flash版本或者使用Chrome引擎的浏览器。";
            if (window.console) {
                window.console.log(error);
            }
            $(item).text(error);
            return;
        }

        // 默认参数
        var defaults = {
            // 自定义参数，是否提供预览
            preview : false,
            // 缩略图大小
            thumbnailWidth : 125,
            thumbnailHeight : 125,
            // auto {Boolean} [可选] [默认值：false] 设置为 true 后，不需要手动调用上传，有文件选择即开始上传。
            auto: true,
            // form表单上传文件 接受的name
            // 此处可以自定义的原因的，是一个页面可以同时有多个附件上传
            fileName: "fileName",
            // 当所有file都上传后执行的回调函数
            onAllComplete: function (event) { },
            // 每上传一个file的回调函数
            onComplete: function (event) { },
            // webuploaderoptions方法的自定义参数
            innerOptions: {},
            // 验证文件总数量, 超出则不允许加入队列。
            fileNumLimit: undefined,
            // 验证文件总大小是否超出限制, 超出则不允许加入队列。
            fileSizeLimit: undefined,
            // 验证单个文件大小是否超出限制, 超出则不允许加入队列。
            fileSingleSizeLimit: undefined,
        };

        // 把默认参数与自定义参数整合，确定最终的参数
        var opts = $.extend(defaults, options);

        // 整个div块（容器）
        var target = $(item);

        // pickerid初始化并赋值
        var pickerid = "";
        pickerid = getRandomID();

        // 通过判断preview参数来动态生成相应的HTML元素
        if (opts.preview) {
            // Begin
            var uploaderStrdiv = '<div class="webuploader">'
                uploaderStrdiv +=
                '<div id="fileList" class="uploader-list"></div>' +
                '<div class="btns">' +
                '<div id="' + pickerid + '">选择图片</div>' +
                '</div>';
            uploaderStrdiv += '<div style="display:none" class="UploadhiddenInput">\
                               </div>'
            uploaderStrdiv += '</div>';
            // End
        } else {
            // 通过判断auto参数来动态生成相应的HTML元素
            // Begin
            var uploaderStrdiv = '<div class="webuploader">'
            // 自动上传
            if (opts.auto) {
                uploaderStrdiv +=
                '<div id="Uploadthelist" class="uploader-list"></div>' +
                '<div class="btns">' +
                '<div id="' + pickerid + '">选择文件</div>' +
                '</div>'
            // 手动上传
            } else {
                uploaderStrdiv +=
                '<div class="uploader-list"></div>' +
                '<div class="btns">' +
                '<div id="' + pickerid + '">选择文件</div>' +
                '<button class="webuploadbtn" type="button">开始上传</button>' +
                '</div>'
            }
            uploaderStrdiv += '<div style="display:none" class="UploadhiddenInput">\
                               </div>'
            uploaderStrdiv += '</div>';
            // End
        }

        // 放入DIV容器
        target.append(uploaderStrdiv);

        // 部分参数初始化操作
            // <div id="thelist" class="uploader-list"></div>
            // 用来存放文件信息 [文件名称；状态；删除]
        var $list = target.find('.uploader-list'),
            // 手动上传按钮
            $btn = target.find('.webuploadbtn'),
            // 状态置为 待定的
            state = 'pending',
            // <div class="UploadhiddenInput" style="display:none"></div>
            // 回显核心内容
            // 例如：<input id="hiddenInputuploaderWU_FILE_1" class="hiddenInput" name="jFile[]" value="[{"fid":"1","fileName":"IMG_20170624_114317.jpg","fileSize":259417,"url":"/webUploader/201706/1498545216605410a5c8e9e83d.jpg"}]" type="text">
            $hiddenInput = target.find('.UploadhiddenInput'),
            // Uploader对象初始化
            uploader;

        // 核心配置参数
        var webuploaderoptions = $.extend({
            // swf文件路径
            swf: SITE_URL+'/Uploader.swf',
            // 文件接收服务端。
            server: SITE_URL+'/fileUpload.php',
            // 未完成 删除文件的部分
            deleteServer: '',
            // 指定选择文件的按钮容器，不指定则不创建按钮。
            pick: '#' + pickerid,
            // 分片的配置
            chunked: true,
            // 默认为5M
            chunkSize: 5*1024*1024,
            // 不压缩image
            resize: false,
            // 类型限制
            accept: {
                title: 'Files',
                extensions: 'gif,jpg,jpeg,bmp,png,pdf,doc,docx,txt,xls,xlsx,ppt,pptx,zip,mp3,mp4,text,csv',
                mimeTypes: 'image/*,text/*'
                //word
                +',application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                //excel
                +',application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                //ppt
                +',application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
                +',application/pdf'
                +',application/zip'
                +',application/csv'
                // mp3,mp4
                +',audio/mpeg,audio/mp4,video/mp4'
            },
            fileNumLimit: opts.fileNumLimit,
            fileSizeLimit: opts.fileSizeLimit,
            fileSingleSizeLimit: opts.fileSingleSizeLimit
        }, opts.innerOptions);
        // 实例化Uploader对象
        var uploader = WebUploader.create(webuploaderoptions);

        // 通过判断preview参数来动态生成相应的HTML元素
        if (opts.preview) {
            // 当有文件添加进来的时候
            uploader.on('fileQueued', function(file) {

                // var $li = $(
                //         '<div id="' + $(item)[0].id + file.id + '" class="file-item thumbnail">' +
                //             '<img>' +
                //             '<div class="info">' + '<span class="webuploadinfo">' + file.name + '</span>' +
                //             '</div>' +
                //             '<span class="webuploadstate" style="position: absolute;bottom: -18px;">正在上传...</span>' +
                //             '<div class="webuploadDelbtn" style="position: absolute;bottom: -22px;left: 100px;">删除</div><br />' +
                //         '</div>'
                //         ),
                //     $img = $li.find('img');

                var $li = $(
                        '<div id="' + $(item)[0].id + file.id + '" class="file-item thumbnail">' +
                            '<img>' +
                            '<div class="info">' + '<span class="webuploadinfo">' + file.name + '</span>' +
                            '</div>' +
                            '<span class="webuploadstate">正在上传...</span>' +
                            '<div class="webuploadDelbtn">删除</div><br />' +
                        '</div>'
                        ),
                    $img = $li.find('img');

                $list.append($li);

                uploader.upload();

                // 创建缩略图
                uploader.makeThumb(file, function(error, src) {
                    if (error) {
                        $img.replaceWith('<span>不能预览</span>');
                        return;
                    }
                    $img.attr('src', src);
                }, opts.thumbnailWidth, opts.thumbnailHeight);
            });
        } else {
            // [文件名称；状态；删除]回显
            // 自动上传
            if (opts.auto) {
                // fileQueued  当文件被加入队列以后触发。
                uploader.on('fileQueued', function (file) {
                    $list.append('<div id="' + $(item)[0].id + file.id + '" class="item">' +
                       '<span class="webuploadinfo">' + file.name + '</span>' +
                       '<span class="webuploadstate">正在上传...</span>' +
                       '<div class="webuploadDelbtn">删除</div><br />' +
                       '</div>');
                    // upload() 开始上传。此方法可以从初始状态调用开始上传流程，也可以从暂停状态调用，继续上传流程。
                    uploader.upload();
                });
            // 手动上传
            } else {
                // fileQueued  当文件被加入队列以后触发。
                uploader.on('fileQueued', function (file) {
                    $list.append('<div id="' + $(item)[0].id + file.id + '" class="item">' +
                        '<span class="webuploadinfo">' + file.name + '</span>' +
                        '<span class="webuploadstate">等待上传...</span>' +
                        '<div class="webuploadDelbtn">删除</div><br/>' +
                        '</div>');
                });
            }
        }

        // uploadProgress  上传过程中触发，携带上传进度。
        uploader.on('uploadProgress', function (file, percentage) {
            // 焦点元素
            var $li = target.find('#' + $(item)[0].id + file.id),
                $percent = $li.find('.progress .bar');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<span class="progress">' +
                    '<span class="percentage"><span class="text"></span>' +
                    '<span class="bar" role="progressbar" style="width: 0%">' +
                    '</span></span>' +
                    '</span>').appendTo($li).find('.bar');
            }
            percentage = (percentage == 1) ? 0.99 : percentage;
            $li.find('span.webuploadstate').html('上传中');
            // 此处由于采用分片上传，当上传达到100%时，若文件过大，组合时间过长，所以此处修改为上传最高显示99%。
            // 当合成完成后，取消进度条，显示上传状态
            $li.find(".text").text(Math.floor(percentage * 100) + '%');
            $percent.css('width', percentage * 100 + '%');
        });

        // uploadSuccess  当文件上传成功时触发。
        uploader.on('uploadSuccess', function (file, response) {
            // 判断返回值，修改状态，若成功则触发文件名与地址回显
            if (!response.success) {
                target.find('#' + $(item)[0].id + file.id).find('span.webuploadstate').html('上传出错，请重新上传~');
            } else {
                target.find('#' + $(item)[0].id + file.id).find('span.webuploadstate').html('已上传');
                // 通过函数整理数据作为form接受的value
                var sForm = getJsonFormValue(file, response);
                $hiddenInput.append('<input type="text" name="' + opts.fileName + '[]" id="hiddenInput'+$(item)[0].id + file.id + '" class="hiddenInput" value=\'' + sForm + '\' />');
            }
        });

        // uploadError  当文件上传出错时触发。
        uploader.on('uploadError', function (file) {
            target.find('#' + $(item)[0].id + file.id).find('span.webuploadstate').html('上传出错');
        });

        // uploadComplete  不管成功或者失败，文件上传完成时触发。
        // 进度条消失
        uploader.on('uploadComplete', function (file) {
            target.find('#' + $(item)[0].id + file.id).find('.progress').fadeOut();
        });

        // 这个根据状态显示按钮字体，没什么卵用
        uploader.on('all', function (type) {
            // ↓↓↓  插件加载成功  ↓↓↓
            // ready
            // ↓↓↓  选择文件成功  ↓↓↓
            // beforeFileQueued
            // fileQueued
            // filesQueued
            // ↓↓↓  点击上传文件  ↓↓↓
            // startUpload
            // uploadStart
            // uploadBeforeSend
            // ↓↓↓  触发上传方法  ↓↓↓
            // uploadProgress
            // uploadAccept
            // uploadSuccess
            // uploadComplete
            // uploadFinished
            if (type === 'startUpload') {
                state = 'uploading';
            } else if (type === 'stopUpload') {
                state = 'paused';
            } else if (type === 'uploadFinished') {
                state = 'done';
            }

            if (state === 'uploading') {
                $btn.text('暂停上传');
            } else {
                $btn.text('开始上传');
            }
        });

        // fileDequeued  当文件被移除队列后触发。
        uploader.on('fileDequeued', function(file) {
            var fullName = $("#hiddenInput" + $(item)[0].id + file.id).val();
            // 调用已经写好的删除方法，删除物理文件
            if (fullName != null) {
                // $.post(webuploaderoptions.deleteServer, { jFileInformation : fullName }, function (data) {
                //     console.log(data.message);
                // });
            }
            // 移除对应的文件显示信息以及回显数据信息
            $("#"+ $(item)[0].id + file.id).remove();
            $("#hiddenInput" + $(item)[0].id + file.id).remove();
        })

        // 多文件点击上传采取的办法，排队上传，传完一个再接着传下一个
        $btn.on('click', function () {
            if (state === 'uploading') {
                uploader.stop();
            } else {
                uploader.upload();
            }
        });

        // 移除某一文件, 默认只会标记文件状态为已取消，如果第二个参数为 true 则会从 queue 中移除。
        $list.on("click", ".webuploadDelbtn", function () {
            var $ele = $(this);
            var id = $ele.parent().attr("id");
            var id = id.replace($(item)[0].id, "");
            var file = uploader.getFile(id);
            uploader.removeFile(file);
        });
    }

    /**
     * [测试：返回文件上传的名称与地址]
     * @author  [wj]
     * @date    [2017-6-27 16:52:51]
     * @version [1.0.0]
     * @return  array  ["[{"fid":"0","fileName":"...4605db52cfcb2e36.jpg"}]"]
     */
    $.fn.GetFilesAddress = function (options) {
        var ele = $(this);
        var filesdata = ele.find(".UploadhiddenInput");
        var filesAddress = [];
        filesdata.find(".hiddenInput").each(function () {
            filesAddress.push($(this).val());
        })
        return filesAddress;
    }
})(jQuery, window);
