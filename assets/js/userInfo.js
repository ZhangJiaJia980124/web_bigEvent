$(function () {
    // 1. 表单验证规则--------------------
    userVerify();
    // 2. 获取用户 信息 ------------------------
    initUserInfo();
    // 3. 重置按钮事件-----------
    $('#btnReset').on('click', reSet)

    $('.layui-form').on('submit', setUserInfo)
})
// 1. 表单验证规则--------------------
function userVerify() {
    layui.form.verify({
        nickname: [/^\S{2,8}$/, '昵称必须在2-8个字符之间~']
    })
}
// 2. 获取用户 信息 ------------------------
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (ele) {
            // console.log(ele);
            if (ele.status != 0) {
                return layui.layer.msg(ele.message);
            }
            // 2.1 利用 form.val 给表单添加内容
            layui.form.val('formUserInfo', ele.data)
        }
    })
}

// 3. 重置按钮事件-----------
function reSet() {
    initUserInfo();
}

function setUserInfo(e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function (ele) {
            layui.layer.msg(ele.message)
            // 修改失败 直接退出success函数
            if (ele.status != 0) {
                return;
            }
            //  如果获取数据成功 则通过 window.parent 或者 window.top 调用父页面的方法
            window.parent.getUserInfo();
        }
    })
}