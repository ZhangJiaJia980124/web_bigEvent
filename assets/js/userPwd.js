$(function () {
    // 1. 检验密码格式规则---------
    SetPwd();
    // 2.位表单添加提交事件-----------
    $('.layui-form').on('submit', getPwdInfo)
})
// 1. 检验密码格式规则---------
function SetPwd() {
    layui.form.verify({
        // 1.1 校验密码位数的规则
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位，并且不能有空格'],
        // 1.2 校验 新旧密码是否相同 (不能相同)
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样';
            }
        },
        // 1.3 校验两次输入的密码是否一样( 两次输入密码必须相同)
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入密码不相同,请重新输入~'
            }
        }
    })
}
// 2.为表单添加提交事件-----------
function getPwdInfo(e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function (ele) {
            if (ele.status != 0) {
                return layui.layer.msg(ele.message);
            }
            layui.layer.msg(ele.message, {
                icon: 1,
                time: 3000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //do something
                localStorage.removeItem('myToken');
                window.top.location.href = '/login.html';
            });

        }
    })
}