$(function () {
    // 点击 去注册 的链接
    $('#link_reg').on('click', regToggle)
    // 点击 去登陆 的链接
    $('#link_login').on('click', loginToggle)
    verify();
    // 3. 注册表单提交事件--------------
    $('#form_reg').on('submit', submitDate)
    // 4. 登录表单提交事件--------------
    $('#form_login').on('submit', loginData)
})
function regToggle() {
    $('.login_box').hide();
    $('.reg_box').show();
}
function loginToggle() {
    $('.login_box').show();
    $('.reg_box').hide();
}
function verify() {
    // 从layui中获取form对象
    let form = layui.form;
    // 通过 form.verify() 函数 自定义校验规则
    form.verify({
        // 自定义一个密码校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格~'
        ],
        repwd: function (val) {
            // 通过形参拿到确认密码的值，
            // 还需要拿到密码框中的值
            //然后进行一个等于的判断
            // 如果判断失败 则return 一个提示信息即可
            let pwd2 = $('.reg_box [name=password]').val();
            if (pwd2 != val) return '两次密码不一致~请重新输入'
        }
    })
}
// 3. 注册表单提交事件--------------
// 根接口 

function submitDate(e) {
    e.preventDefault();// 阻止表单默认提交行为
    // 获取 表单数据
    let strData = $(this).serialize();
    // 发送异步请求
    $.ajax({
        method: 'POST',
        url: '/api/reguser',
        data: strData,
        success: function (ele) {
            if (ele.status != 0) return layui.layer.msg(ele.message);
            layui.layer.msg(ele.message);
            $('#form_reg')[0].reset();
            // 将用户名 密码 自动填充到登录页面
            let uname = $('.reg_box [name=username]').val().trim();
            console.log(uname);
            $('.login_box [name=username]').val(uname);
            let upwd = $('.reg_box [name=password]').val().trim();
            console.log(upwd);
            $('.login_box [name=password]').val(upwd);
            $('#link_login').click();
        }
    })
}

// 4. 登录表单提交事件--------------
function loginData(e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/api/login',
        data: $(this).serialize(),
        success: function (ele) {
            console.log(ele);
            if (ele.status != 0) return layui.layer.msg(ele.message);
            // layui.layer.msg(ele.message);
            layui.layer.msg(ele.message, {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //do something
                localStorage.setItem('myToken', ele.token);
                $('#form_login')[0].reset();
                location.href = '/index.html';
            });

        }
    })
}

