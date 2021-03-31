<?php
// 启动 session
session_start();
// 判断是否存在该用户，存在则进入显示主页内容
if (isset($_SESSION['user'])) {
    echo "欢迎您！" . $_SESSION["user"] . "<br/>";
    echo "<a href='logout.php?action=logout'>注销</a> ";
}
// 否则就是不存在该用户，则显示提示信息
else {
    echo "用户不存在！";
}
?>