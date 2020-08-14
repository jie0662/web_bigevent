$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '字符必须在1~6之间'
            }
        }
    })
    initUserInfo()


    //自定义获取用户信息函数
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                //使用layui 表单赋值 快速填入内容
                form.val('formUserInfo', res.data)
            }
        });
    }

    //修改重置按钮 避免全部输入框清空
    $('#btnreset').on('click', function(e) {
        //禁用默认清空行为
        e.preventDefault()
            //重新获取用户信息
        initUserInfo()
    })

    //提交确认修改按键 更新用户信息
    //监听表单
    $('.layui-form').on('submit', function(e) {
        //禁用默认提交行为
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                    //调用主页面的获取用户信息 渲染到信息栏
                window.parent.getUserInfo()
            }
        });
    })
})