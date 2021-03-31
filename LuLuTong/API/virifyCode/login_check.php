<?php
// 启动 session
session_start();
//判断是否点击了登录按钮
if (isset($_POST["submit"])) {
    // 获取输入的验证码，并转为大写
    $ucode = strtoupper($_POST['code']);
    // 获取 session 中保存的图片显示的验证码
    $scode = strtoupper($_SESSION['code']);
    // 比较两者是否相同，不同则提示错误信息，并跳转到登录页面重新登录
    if ($ucode != $scode) {
        echo '<script>
   			alert("验证码错误！");
   			location.href="login.php";
		</script>';
    }
    // 验证码正确，则进一步判断输入的 用户名和密码 是否对应已存在的用户
    else {
        $user = $_POST["userName"];
        $pw = $_POST["PW"];
        if ($user == "root" && $pw == 'root') {
            //将用户添加到 session 中，并跳转到主页
            $_SESSION['user'] = $user;
            header('Location:main.php');
        }
        // 用户名和密码 不对应则输出错误信息，并跳转到登录页面重新登录
        else {
            echo '<script>
   			alert("用户名或密码错误！");
   			location.href="login.php";
		</script>';}
    }
}
?>