$(function () {
    initCropper();
    // 1. 点击 上传按钮 手动触发file属性
    $('#btnChooseImg').on('click', chooseFile)
    //  2.为 文件选择框绑定 onchange事件
    $('#files').on('change', fileChange)
    // 3. 为确认上传按钮 添加点击事件
    $('#btnOk').on('click', btnImg)
})
// 1.1 获取裁剪区域的 DOM 元素 全局变量
let $image = null;
// 1.2 配置选项 全局配置选项-----
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}
function initCropper() {
    $image = $('#image')
    // 1.3 创建裁剪区域
    $image.cropper(options)
}

// 1. 点击 上传按钮 手动触发file属性-------------------
function chooseFile() {
    $('#files').click();
}
//  2.为 文件选择框绑定 change事件-------------------
function fileChange(e) {
    console.log(e);
    let fileList = e.target.files;
    if (fileList.length == 0) {
        return layui.layer.msg('请您选择文件~')
    }
    console.log(fileList);
    // 1. 拿到用户选择的文件 第一个文件
    let file = e.target.files[0]
    // 2. 将文件，转化为虚拟路径
    let imgURL = URL.createObjectURL(file)
    // 3. 重新初始化裁剪区域
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
}
// 3. 确认上传----------------------------
function btnImg() {
    var dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')

    // 向服务器发送 POST请求--
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (ele) {
            layui.layer.msg(ele.message)
            if (ele.status !== 0) {
                return;
            }
            window.top.getUserInfo()
        }
    })
}
