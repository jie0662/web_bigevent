$(function() {
    var layer = layui.layer
    var form = layui.form
        //获取页面数据
    initArtCateList()
        //定义初始化函数
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                //使用模板引擎渲染页面
                var htmlStr = template('tql_table', res)
                $('tbody').html(htmlStr)
            }
        });
    }
    //为关闭弹窗添加索引
    var addopen = null;
    //给添加类别按钮绑定事件
    $('#btnAddCate').on('click', function() {
        addopen = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })

    //因为表单提交按钮submit是动态生成,需要用代理的方式绑定事件
    $('body').on('submit', '#add-form', function(e) {
        //阻止默认提交
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加类别失败!')
                }
                layer.msg('添加类别成功!')
                    //重新获取页面数据
                initArtCateList()
                    //利用索引关闭弹窗
                layer.close(addopen)
            }
        });
    })
    var editopen = null;
    //代理获取 编辑按钮
    $('tbody').on('click', '.btn-edit', function() {
            editopen = layer.open({
                title: '修改文章分类',
                type: 1,
                area: ['500px', '250px'],
                content: $('#dialog-edit').html()
            });
            var id = $(this).attr('data-id')
            $.ajax({
                type: "get",
                url: "/my/article/cates/" + id,
                success: function(res) {
                    form.val('edit-form', res.data)
                }
            });
        })
        //更新修改数据
        //因为表单提交按钮submit是动态生成,需要用代理的方式绑定事件
    $('body').on('submit', '#edit-form', function(e) {
            // 阻止默认提交
            e.preventDefault()
            $.ajax({
                type: "POST",
                url: "/my/article/updatecate",
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类失败!')
                    }
                    layer.msg('更新分类成功!')
                    initArtCateList()
                        //利用索引关闭弹窗
                    layer.close(editopen)
                }
            });
        })
        //删除数据
        //代理方式给删除按键绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //点击获取分类的id
        var id = $(this).attr('data-id')
        console.log(id);
        //点击弹出提示框 确认是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //发起请求根据分类所以id删除该分类
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功!')
                    initArtCateList()
                    layer.close(index);
                }
            });
            layer.close(index);
        });


    })

})