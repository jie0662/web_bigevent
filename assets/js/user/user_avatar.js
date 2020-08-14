$(function() {
    var layer = layui.layer
        //初始化裁剪区 实现基本裁剪效果
        // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //给上传按钮绑定点击事件
    $('#btn_file').on('click', function() {
        //模拟点击上传文件输输入框
        $('#file').click()
    })

    //为文件选择框绑定 change 事件
    $('#file').on('change', function(e) {
        //获取到用户选择的图片
        var filelist = e.target.files
            //判断用户是否选择了图片
        if (filelist.length === 0) {
            return layer.msg('请选择上传图片!')
        }
        //跟换裁剪区图片
        //1.拿到图片
        var file = e.target.files[0]
            //2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
            //3/先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //上传头像
    //为上传按钮绑定点击事件
    $('#btn_upload').on('click', function() {
        //获取用户裁剪区域图片 转化为 base64格式
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 上传服务器
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('上传更新头像失败!')
                }
                layer.msg('上传更新头像成功!')
                    //刷新主页面
                window.parent.getUserInfo();
            }
        });
    })
})