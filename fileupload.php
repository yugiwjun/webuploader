<?php
// +----------------------------------------------------------------------
// | php.ini配置
// +----------------------------------------------------------------------
// | file_uploads = On 开启文件上传
// +----------------------------------------------------------------------
// | upload_max_filesize = 100M  上传文件最大值 （必须大于5M）
// +----------------------------------------------------------------------
// | post_max_size = 100M  POST接受数据最大值
// +----------------------------------------------------------------------
// | memory_limit = 128M  内存限制
// +----------------------------------------------------------------------
// | max_execution_time = 1800   变量max_execution_time设置了在强制终止脚本前PHP等待脚本执行完毕的时间，此时间以秒计算。
// +----------------------------------------------------------------------
// | max_input_time = 1800  此变量可以以秒为单位对通过POST、GET以及PUT方式接收数据时间进行限制。
// +----------------------------------------------------------------------


        # 头文件
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");

        define("UPFILES_STORAGE", "./file");

        # 打印值为 POST
        # finish preflight CORS requests here
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit;
        }
        # 目前没用到，应该是个权限
        if (!empty($_REQUEST['debug'])) {
            $random = rand(0, intval($_REQUEST[ 'debug' ]) );
            if ($random === 0) {
                header("HTTP/1.0 500 Internal Server Error");
                exit;
            }
        }
        # 5 minutes execution time
        @set_time_limit(5 * 60);
        # Uncomment this one to fake upload time
        # 测试时，可以看到文件生成与执行顺序
        // sleep(1);
        # 配置上传文件目录
        $targetDir = UPFILES_STORAGE.DIRECTORY_SEPARATOR.'webUploader'.DIRECTORY_SEPARATOR.date('Ym',time());
        $uploadDir = UPFILES_STORAGE.DIRECTORY_SEPARATOR.'webUploader'.DIRECTORY_SEPARATOR.date('Ym',time());
        # Remove old files
        $cleanupTargetDir = true;
        # Temp file age in seconds
        $maxFileAge = 5 * 3600;
        # Create target dir
        if (!file_exists($targetDir)) {
            mkdir($targetDir,0777,true);
        }
        # Create target dir
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir,0777,true);
        }
        # Get a file name
        # 此处如果不能接受到POST传递的参数，就没法合并
        if (isset($_REQUEST["name"])) {
            $fileName = $_REQUEST["name"];
        } elseif (!empty($_FILES)) {
            $fileName = $_FILES["file"]["name"];
        } else {
            $fileName = uniqid("file_");
        }
        # 原文件名
        $oldName = $fileName;
        // 对文件名的编码，避免中文文件名乱码
        // 这个非常重要，要不很多都无法上传！！！
        $fileName = iconv("UTF-8", "GBK", $fileName);
        $filePath = $targetDir . DIRECTORY_SEPARATOR . $fileName;
        # Chunking might be enabled
        $chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
        $chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 1;
        # Remove old temp files
        if ($cleanupTargetDir) {
            if (!is_dir($targetDir) || !$dir = opendir($targetDir)) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 100, "message": "Failed to open temp directory."}, "id" : "id"}');
            }
            while (($file = readdir($dir)) !== false) {
                $tmpfilePath = $targetDir . DIRECTORY_SEPARATOR . $file;
                # If temp file is current file proceed to the next
                if ($tmpfilePath == "{$filePath}_{$chunk}.part" || $tmpfilePath == "{$filePath}_{$chunk}.parttmp") {
                    continue;
                }
                # Remove temp file if it is older than the max age and is not the current file
                if (preg_match('/\.(part|parttmp)$/', $file) && (@filemtime($tmpfilePath) < time() - $maxFileAge)) {
                    @unlink($tmpfilePath);
                }
            }
            closedir($dir);
        }
        # Open temp file
        if (!$out = @fopen("{$filePath}_{$chunk}.parttmp", "wb")) {
            die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
        }
        if (!empty($_FILES)) {
            if ($_FILES["file"]["error"] || !is_uploaded_file($_FILES["file"]["tmp_name"])) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 103, "message": "Failed to move uploaded file."}, "id" : "id"}');
            }
            # Read binary input stream and append it to temp file
            if (!$in = @fopen($_FILES["file"]["tmp_name"], "rb")) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
            }
        } else {
            if (!$in = @fopen("php://input", "rb")) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
            }
        }
        # die;
        # 文件名.mp4_0.parttmp   0KB
        while ($buff = fread($in, 4096)) {
            fwrite($out, $buff);
        }
        @fclose($out);
        @fclose($in);
        # die;
        # 文件名.mp4_0.parttmp   2050KB
        # 重命名，去掉tmp
        rename("{$filePath}_{$chunk}.parttmp", "{$filePath}_{$chunk}.part");
        # die;
        # 文件名.mp4_0.part   2050KB
        # 初始化
        $index = 0;
        $done = true;
        # 最后一片的时候，也就是最后一次ajax时把$done置为真，进行下边的合并
        for($index = 0; $index < $chunks; $index++) {
            if (!file_exists("{$filePath}_{$index}.part")) {
                $done = false;
                break;
            }
        }
        # 这个判断里的代码只执行一次
        if ($done) {
            $pathInfo = pathinfo($fileName);
            $hashStr = substr(md5($pathInfo['basename']),8,16);
            $hashName = time() . $hashStr . '.' .$pathInfo['extension'];
            $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $hashName;
            if (!$out = @fopen($uploadPath, "wb")) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
            }
            if (flock($out, LOCK_EX)) {
                for($index = 0; $index < $chunks; $index++) {
                    if (!$in = @fopen("{$filePath}_{$index}.part", "rb")) {
                        break;
                    }
                    while ($buff = fread($in, 4096)) {
                        fwrite($out, $buff);
                    }
                    @fclose($in);
                    @unlink("{$filePath}_{$index}.part");
                }
                flock($out, LOCK_UN);
            }
            @fclose($out);
            $saveUrl = '/webUploader/'.date('Ym',time())."/".$hashName;
            $response = array(
                'success'=>true,
                'oldName'=>$oldName,
                'filePath'=>$saveUrl,
                'fileSize'=>$_FILES['file']['size'],
                'fileSuffixes'=>$pathInfo['extension'],
                'file_id'=>'',
            );
            die(json_encode($response));
        }
        # Return Success JSON-RPC response
        die('{"jsonrpc" : "2.0", "result" : null, "id" : "id"}');
