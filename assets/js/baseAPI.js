$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 统一为有权限的接口 设置 headers 请求头 
    if (options.url.indexOf('/my/') > -1) {
        options.headers = {
            Authorization: localStorage.getItem('myToken')
        };
    }

    //统一 定义 complate 回调函数
    options.complete = function (res) {
        console.log(res);
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            // 没有登录 就 提示消息  并清空token值 强制跳转到login页面
            layui.layer.msg(res.responseJSON.message, {
                icon: 1,
                time: 1000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                // 清空token值
                localStorage.removeItem('myToken');
                //强制跳转到login页面
                location.href = '/login.html';
            });
        }
    }
})