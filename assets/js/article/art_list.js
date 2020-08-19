$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //自义定一个默认参数对象
    var q = {
        pagenum: 1, //页码值,默认请求第一页数据
        pagesize: 2, //每页显示几条数据,默认每页显示2条
        cate_id: '', //文章分类id
        state: '' //文章分类状态
    }
    initTable()
    initCate()
        //自定义获取文章列表数据
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败')
                }
                //调用模板引擎渲染页面
                var htmlStr = template('tql-table', res)
                $('tbody').html(htmlStr)
                    //渲染完页面后再渲染分页
                renderPage(res.total)
            }
        });
    }

    //自定义初始化文章分类下拉菜单
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败!')
                }
                //调用模板引擎
                var htmlStr = template('tql-cate', res)
                    //渲染页面
                $('[name = cate_id]').html(htmlStr)
                    //调用layui.form.render()方法 重新调用layui.js渲染下拉菜单
                form.render()
            }
        });
    }

    //实现筛选功能
    //为筛选按钮绑定事件
    $('#form-screen').on('submit', function(e) {
        e.preventDefault()
            //获取需要筛选的数据
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name = state]').val()
            //再给参数对象q 需要筛选的对象赋相对于的值
        q.cate_id = cate_id
        q.state = state
            //最后根据 q的新值重新获取列表
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //利用laypage.render()方法渲染分页
        laypage.render({
            elem: 'pageBox', //需要渲染的容器 ID名不需要加//#
            count: total, //数据总条数
            limit: q.pagesize, //每页显示的数据条数
            curr: q.pagenum, //页面加载后默认显示的那一页;
            //自定义分页栏的排版以及添加功能 注意功能顺序 影响页面功能位置;
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //自定义每页显示数据条数
            //分页切换 触发 jump回调
            //触发jump回调条件 
            //1.点击分页页码;切换页面条目数
            //2.调用 laypage.render()方法,注意 容易造成死循环;
            jump: function(obj, first) {
                //根据切换的页码更新q参数 重新渲染页面 obj.curr 为当前切换的页码值
                q.pagenum = obj.curr
                    //根据切换页面条目数更新q参数 重新渲染页面 obj.limit 为当前切换的条目数
                q.pagesize = obj.limit
                    //first为布尔值 可以根据first判断jump的触发条件 如果为true 则是条件2,否则为条件1
                    //根据first判断(不为true)为点击分页触发jump,解决死循环; 
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //制作删除按钮
    //利用代理方式给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //获取当前页的删除按钮个数
        var btn_len = $('.btn-delete').length
        var id = $(this).attr('data-id')
            //弹出提示框 layer里的询问弹出层 confirm方法
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')
                        //当前页码内 数据全删除完后 自动跳转前一页 并重新获取前一页的数据
                        //根据当前页的删除按钮个数 判断当前页是否存在数据 按钮个数等于1时 如确认删除后则当前页已经没有数据;
                    if (btn_len == 1) {
                        //注意 先判断当前页是否为第一页 如果为第一页则保持当前页
                        //如果不为第一页则重新获取页码-1的数据
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    //重新获取文章列表
                    initTable()
                }
            });
            layer.close(index);
        });

    })


    //定义一个时间补零函数
    function padZero(n) {
        if (n < 10) {
            return '0' + n
        } else {
            return n
        }
    }
    //定义一个时间过滤器 格式为 年-月-日 时:分:秒
    template.defaults.imports.dateFormat = function(dataStr) {
        var dt = new Date(dataStr);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
        //过滤器最后一定要有return输出值
    }
})