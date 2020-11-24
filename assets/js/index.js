$(function () {
    // 1. 获取用户的基本信息------------------------
    getUserInfo();
    // 2. 点击 退出按钮 返回到登录页面-----------
    $('#btnLogout').on('click', logOut)
})
// 1. 获取用户的基本信息------------------------
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('myToken')
        // },
        success: function (ele) {
            // console.log(ele);
            if (ele.status != 0) {
                return layui.layer.msg(ele.message)
            }
            // 1.1  渲染用户头像信息---
            renderAvatar(ele.data);
        }
    })
}

// ---------------------------------------------------
// 1.1  渲染用户头像信息---
function renderAvatar(userData) {
    // a.先获取 用户名 (昵称 / 用户名)
    let name = userData.nickname || userData.username;
    // b.把用户名 获取到后 渲染给 span标签
    $('#welcome').html(`欢迎  ${name}`);
    // c. 按需渲染 用户的头像
    if (userData.user_pic != null) {
        //渲染用户的图片头像
        $('.layui-nav-img').attr('src', userData.user_pic).show();
        // 隐藏文字头像
        $('.text_avatar').hide()
    } else {
        // 隐藏图片头像
        $('.layui-nav-img').hide();
        // 取用户名第一个首字母 并转为大写 
        let strName = name[0].toUpperCase()
        // 设置为文字头像
        $('.text_avatar').text(strName).show()
    }
}

// 2. 点击 退出按钮 返回到登录页面-----------+------
function logOut() {
    layui.layer.confirm('确定退出登录?', { icon: 3, title: '系统提示' }, function (index) {
        // 删除 本地存储的 token值  再跳转到login页面
        localStorage.removeItem('myToken');
        location.href = '/login.html';
        layer.close(index);
    });
}