$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function() {
            $('.login-box').show();
            $('.reg-box').hide();
        })
        // 添加输入密码框的输入规则
        //添加规则需要调用 layui js文件里的.form 再添加规则;
    var form = layui.form;
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repwd: function(value) {
                //获取密码框的值
                var pwd = $('.reg-box [name=pwd]').val();
                //对比密码框和再次输入密码框的值是否一样
                if (pwd !== value) {
                    return '两次输入的密码不一样!'
                };
            }
        })
        //添加变量layui 导出 layui.layer方法 用于弹出提示框layer.msg()
    var layer = layui.layer;
    //向服务器发起注册请求
    //1.监听注册页面的提交事件
    $('#form_reg').on('submit', function(e) {
            //2 阻止默认提交行为
            e.preventDefault()
                //3 发起ajax 用post 提交注册信息
            var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=pwd]').val()
            }
            $.post("/api/reguser", data,
                function(res) {
                    if (res.status !== 0) {
                        //使用layui的弹出方法提示
                        return layer.msg(res.message)
                    }
                    layer.msg('注册成功!')
                        //注册成功后自动返回登录页面 模拟手点去登录
                    $('#link_login').click();
                },

            );
        })
        //向服务器发起登录请求
        //1 监听登录页面的提交事件
    $('#form_login').on('submit', function(e) {
        //2 阻止表单默认提交行为
        e.preventDefault()
            //3 发起ajax 用post 提交登录信息
        $.ajax({
            type: "POST",
            url: "/api/login",
            //使用.serialize()快速提交表单元素 注意表单name值与服务器请求体相同
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                    //将成功登录后服务器发送的 token值保存到本地
                localStorage.setItem('token', res.token)
                    //自动跳转页面到后台页面           
                location.href = "/index.html"
            }
        });
    })
});