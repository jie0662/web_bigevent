$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            samePwd: function(value) {
                if (value === $('[name=oldPwd]').val()) {
                    return '新密码不能与旧密码相同!'
                }
            },
            rePWd: function(val) {
                if (val !== $('[name=newPwd]').val()) {
                    return '两次新密码输入不相同!'
                }
            }
        })
        //提交表单 更新密码
    $('.layui-form').on('submit', function(e) {
        //阻止提交按钮默认行为
        e.preventDefault()
            //向服务器发送修改信息
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败!')
                }
                layer.msg('更新密码成功!')
                    //清空表单输入框 先转为原生DOM对象 使用原生js的方法清空表单
                $('.layui-form')[0].reset();
            }
        });
    })
    console.log($('.layui-form')[0]);
})