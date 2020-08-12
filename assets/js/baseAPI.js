//每次调用ajax发起get或post请求时 会先调用以下函数,可以用来优化每次发起请求的URL地址拼接
$.ajaxPrefilter(function(options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url
        //为需要有权限的接口添加headers 
    if (options.url.indexOf('/my/' !== -1)) {
        options.headers = { Authorization: localStorage.getItem('token') || " " }
    }
    //全局统一挂载 complete回调函数 
    options.complete = function(res) {
        //判断是否非法用户登录
        //complete回调里的responseJSON对象获取服务器返回的登录失败信息
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空本地存储的token
            localStorage.removeItem('token')
                //强制跳转回登录页面
            location.href = '/login.html'
        }
    }

});