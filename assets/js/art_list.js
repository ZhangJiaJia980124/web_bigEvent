// 【全局变量】 分页查询参数对象
let q = {
    pagenum: 1, //当前页码
    pagesize: 2, // 一页显示几条数据
    cate_id: '', // 文章分类的ID
    state: '' // 文章的状态
}

$(function () {
    // 1. 获取数据 渲染页面
    initList();
    // 过滤器
    template.defaults.imports.dateTime = function (val) {
        let date = new Date(val);
        let y = date.getFullYear();
        let m = date.getMonth();
        let d = date.getDate();
        let h = date.getHours();
        h = h < 10 ? '0' + h : h;
        let t = date.getMinutes();
        t = t < 10 ? '0' + t : t;
        let s = date.getSeconds();
        s = s < 10 ? '0' + s : s;
        return `${y}-${m}-${d}  ${h}:${t}:${s}`;
    }

    // 2. 初始化 文章分类的 功能---------
    getArticle();
    // 3. 为form表单 绑定 提交事件
    $('#form_Seach').on('submit', formSeach);

    // 5. 给删除按钮 绑定事件  删除当前tr行
    $('tbody').on('click', '#removeBtn', removeTr);
})
// 1. 获取数据 渲染页面
function initList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (ele) {
            // layui.layer.msg(ele.message);
            if (ele.status != 0) {
                return;
            }
            let strHtml = template('tepl', ele)
            $('tbody').html(strHtml);
            renderPage(ele.total);
        }
    })
}

// 2. 初始化 文章分类的 功能---------
function getArticle() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (ele) {
            if (ele.status != 0) {
                return;
            }
            //  生成html标签字符串
            let strHtml = template('templ', ele.data);
            // 把它追加到select 标签里面 
            $('select[name=cate_id]').html(strHtml)
            // 通知layui 重新映射 渲染这个下拉框
            layui.form.render();
        }
    })
}

// 3. 为form表单 绑定 提交事件
function formSeach(e) {
    //  取消表单默认行为
    e.preventDefault();
    // 把下拉框的值 添加到q对象中去 
    q.cate_id = $('select[name=cate_id]').val();
    q.state = $('select[name=state]').val();
    // 重新调用渲染页面的函数
    initList();
}

// 4. 定义分页的功能
function renderPage(total) {
    //开启location.hash的记录
    layui.laypage.render({
        elem: 'pageBar', // 页码条的容器盒子
        count: total, // 总的行数
        curr: q.pagenum, //获取起始页
        limit: q.pagesize, //每页的数据条数
        limits: [2, 3, 5, 10],
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        //  触发jump 的方式有三种  
        // 1. 点击页码的时候会触发
        // 2. 只要调用了layui.laypage方法 也会触发jump方法
        // 3. 更爱页容量 也会触发jump 方法
        jump: function (obj, first) {
            // 把最新的页面值 赋值给q的oagenum 
            q.pagenum = obj.curr
            // 获取下拉框的页容量 赋值给 分页查询
            q.pagesize = obj.limit
            //  再根据q的值 进行重新渲染页面
            if (!first) {
                initList();
            }
        }
    });
}

// 5. 给删除按钮 绑定事件  删除当前tr行
function removeTr() {
    // 获取自定义id 
    let id = $(this).attr('data-id');
    let len = $('tbody tr td #removeBtn').length
    console.log(len);
    layui.layer.confirm('确认删除吗?', function (index) {
        //do something
        //根据id  请求服务器删除数据
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function (ele) {
                layui.layer.msg(ele.message);
                if (ele.status != 0) {
                    return
                }
                if (len <= 1) {
                    q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                }
                // 重新渲染页面
                initList();
            }
        })
        layui.layer.close(index);
    });
}