$(function () {
    // 1.获取数据 渲染页面--------------
    initCateList();
    // 2. 点击添加 弹出 添加输入框-------------
    $('#btnAddCate').on('click', addCatList);
    // 3.给未来~~弹出框里面的表单 绑定事件----------
    $('body').on('submit', '#form_add', addList);
    // 4. 删除文章功能-------
    $('tbody').on('click', '#removeBtn', removeList);
    // 5. 编辑文章功能-------
    $('tbody').on('click', '.btn_Edit', showEdit);
})
// 1.获取数据 渲染页面--------------
function initCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (ele) {
            // 遍历数据 生成html字符串
            let strHtml = template('temp', ele);
            // 生成完成的字符串 追加到tbody中去
            $('tbody').html(strHtml);
        }
    })
}
// 2. 点击添加 弹出 添加输入框-------------
let indexAdd = null;
function addCatList() {
    indexAdd = layui.layer.open({
        type: 1,
        area: ['500px', '260px'],
        title: '添加文章分类',
        content: $('#tempMsg').html()
    });

}
// 3.给未来~~弹出框里面的表单 绑定事件----------
function addList(e) {
    e.preventDefault();
    // 获取表单内 用户输入的数据--
    let title = $('.layui-layer-title').text().trim();
    if (title == '添加文章分类') {
        // 添加操作
        let strEle = $(this).serialize();
        strEle = strEle.replace('Id=&', '');
        // 发送异步请求--
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: strEle,
            success: function (ele) {
                layui.layer.msg(ele.message)
                if (ele.status != 0) {
                    return;
                }
                // 数据请求成功之后 重新渲染页面
                initCateList();
                // 添加完毕之后  关闭弹出层
                layui.layer.close(indexAdd);
            }
        })
    } else {
        //编辑操作
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (ele) {
                layui.layer.msg(ele.message);
                if (ele.status != 0) {
                    return;
                }
                // 数据请求成功之后 重新渲染页面
                initCateList();
                // 修改完毕之后  关闭弹出层
                layui.layer.close(indexAdd);
            }
        })
    }

}
// 4. 删除功能事件--------------
function removeList() {
    let indexId = $(this).attr('data-id');
    layui.layer.confirm('确认删除文章吗?', function (index) {
        //do something

        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + indexId,
            success: function (ele) {
                layui.layer.msg(ele.message);
                if (ele.status != 0) {
                    return
                }
                initCateList();
            }
        })
        layui.layer.close(index);
    });

}

// 5. 编辑功能事件--------------
function showEdit() {

    //  这是一个修改数据的弹出层
    indexAdd = layui.layer.open({
        type: 1,
        area: ['500px', '260px'],
        title: '修改文章分类',
        content: $('#tempMsg').html()
    });
    //获取 当前点击项 的id
    let id = $(this).attr('data-id')
    // 根据id 查询到对应的数据
    $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,
        success: function (ele) {
            console.log(ele);
            layui.form.val('formData', ele.data);
        }
    })
}