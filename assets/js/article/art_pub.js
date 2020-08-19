$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 初始化富文本编辑器
    initEditor()
        //自定义获取文章类别方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败!')
                }
                //渲染模板引擎
                var htmlStr = template('tql-cate', res)
                    //渲染页面
                $('[name = cate_id]').html(htmlStr)
                    //注意 动态生成文章类别下拉项后要重新渲染layui
                form.render()
            }
        });
    }
    //裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选着封面按钮绑定事件 模拟点击上传裁剪图片按钮
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //监听 coverFile 的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
            //获取到用户选择的文件列表
            var files = e.target.files;
            //判断用户是否选择了上传的图片
            if (files.length === 0) {
                return
            }
            //根据文件 创建相对于的url
            var newImgURL = URL.createObjectURL(files[0])
                //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //定义发布状态 默认为 已发布
    var art_state = '已发布'
        //当点击存为草稿按钮是 将状态改为草稿
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    //为表单添加 submit 事件
    $('#form-pub').on('submit', function(e) {
            //阻止默认提交行为
            e.preventDefault()
                //给予 表单form 创建FormData对象
                //创建FormData对象使用原生JS方法 需要转换为DOM元素 $(this)[0]
            var fd = new FormData($(this)[0])
                //将文章发布状态添加到Formdata 
                //Formdata创建 state 添加值为art_state
            fd.append('state', art_state)
                //将裁剪区的图片转为一个文件对象 
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，添加进Formdata
                    fd.append('cover_img', blob)
                        //将数据发送到服务器
                    publishArticle(fd)
                })
        })
        //定义发送数据方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            //发送数据为Formdata 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                    //跳转回文章列表页面
                location.href = "../article/art_list.html"
            }
        });
    }
})