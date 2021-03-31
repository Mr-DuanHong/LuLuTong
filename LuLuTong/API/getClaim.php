<?php
    header("Content-type: text/html; charset=utf-8");
    // *使用缓存
    session_start();

    // *参数卡号
    $carid = $_POST['card_id'];

    // *判断session中是否存在卡号缓存，以确定是否为正常登陆
    if (isset($_SESSION['cardnumber'])) {
        // *存在，合法登录
        if ($carid == $_SESSION['cardnumber']) {
            // *缓存卡号与传入卡号一致，正常

            // *数据库连接
            // $database = new MySQLi("192.168.0.249","root","root","luluda");
            $database = new MySQLi("127.0.0.1:8889","root","root","TestDatabase");
            // *设置编码
            mysqli_set_charset( $database , 'utf8' );

            // *查询语句
            $sql = "select * from claim";
            $user = $_POST["card_id"];
            $sql .= " where claimcard_id like ".$user;

            // *取得结果对象
            $result = $database->query($sql);

            // *获取具体数据
            $data = array();
            while ($tmp = $result->fetch_assoc()) {
                $data[] = $tmp;
            }

            // *最终数据
            $res = array(
                "status"=>"success",
                "msg"=>"获取理赔列表成功!",
                "code"=>122,
                "data"=>$data
            );
            echo json_encode($res);

        } else {
            // *缓存卡号与传入卡号不一致
            $re = array(
                "status" => "error",
                "msg" => "后台缓存卡号与传入卡号不一致,重新登录",
                "code" => 121,
                "data" => array()
            );
            echo json_encode($re);
        }

    } else {
        // *不存在，异常登录
        $re = array(
            "status" => "error",
            "msg" => "后台缓存中不存在该账号，非法登录",
            "code" => 120,
            "data" => array()
        );
        echo json_encode($re);
        }
?>