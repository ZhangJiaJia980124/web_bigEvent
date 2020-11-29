$image = null;
var options = null;
$(function () {
    // 1. 请求分类下拉框数据 并且加载页面
    initCateList();

    // 2. 初始化富文本编辑器
    initEditor()

    // 3. 初始化图片裁剪器
    $image = $('#image')
    // 3.1. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.2. 初始化裁剪区域
    $image.cropper(options)

    // 4. 为选择--封面按钮-- 添加事件
    $('#BtnChoose').on('click', function () {
        $('#coverFile').click();
    })

    // 5.监听 coverFile 的 change事件 获取用户预上传文件
    $('#coverFile').on('change', fileChange)

    // 6. 为发布  和草稿按钮 绑定事件
    $('#btn_Ok').on('click', publish);
    $('#btn_Draft').on('click', Draft);

    // 7. 为表单绑定 提交事件
    $('#form_Publish').on('submit', doSubmit);
})
// 1. 请求分类下拉框数据 并且加载页面----------
function initCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (ele) {
            layui.layer.msg(ele.message);
            if (ele.status != 0) {
                return;
            }

            let strHtml = template('tmp', ele)
            $('select[name=cate_id]').html(strHtml)
            layui.form.render();
        }
    })

}
// 5.监听 coverFile 的 change事件 获取用户预上传文件-------
function fileChange(e) {
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
    $image.cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
}
// 6. 为发布  和草稿按钮 绑定事件----------
let state = '已发布';
function publish() {
    state = '已发布';
    console.log(state);
}

function Draft() {
    state = '草稿';
    console.log(state);
}

// 7. 为表单绑定 提交事件------------
function doSubmit(e) {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 获取表单数据 装入ForemData 对象  (有文件上传)
    let fd = new FormData(this);
    // 为 FormData 追加 state值
    fd.append('state', state);
    // 为FormData 追加二进制 图片文件
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)

            // 提交到接口
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                processData: false,
                contentType: false,
                success: function (ele) {
                    if (ele.status != 0) {
                        layui.layer.msg(ele.message);
                    }
                    window.location.href = '../../article/art_list.html';
                }
            })
        })


}