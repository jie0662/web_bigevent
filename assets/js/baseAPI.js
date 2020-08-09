//每次调用ajax发起get或post请求时 会先调用以下函数,可以用来优化每次发起请求的URL地址拼接
$.ajaxprefilter(function(options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url
});