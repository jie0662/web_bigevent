$(function() {
    //调用 gteUserInfo 获取用户信息 此函数为自定义函数
    getUserInfo()

    //退出登录功能
    //绑定点击退出按钮事件
    $('#btnLogout').on('click', function() {
        var layer = layui.layer
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function(index) {
            //确认退出时 先清除本地存储的token
            localStorage.removeItem('token')
                //再跳转回登录页面
            location.href = '/login.html'

            layer.close(index);
        });
    })
})

//定义getUserInfo函数 获取用户信息
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('登录失败')
            }
            //成功获取后 调用自定义函数renderAvatar() 渲染用户头像
            renderAvatar(res.data)
        }
    });
}

//定义renderAvatar() 渲染用户头像 函数
function renderAvatar(user) {
    //渲染用户名 判断用户是否自定义昵称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //渲染用户头像图标 如果有上传图片则使用 无则使用字体图标
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()

    } else {
        $('.layui-nav-img').hide()
            //获取用户名第一个字符制作字体图标,转大写;
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}