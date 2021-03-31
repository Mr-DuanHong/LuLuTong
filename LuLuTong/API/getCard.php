<?php

// 使用缓存
session_start();

// 类型值（1:投保人  2:受保人  3：受益人）
$people_kind = $_POST['people_kind'];
// 参数卡号
$carid = $_POST['card_id'];

// 判断卡号在session缓存是否存在
if (isset($_SESSION['cardnumber'])) {
    // 存在判断卡号是否与传入卡号一致
    if ($carid == $_SESSION['cardnumber']) {
        // 一致
        // 头部信息
        header("Content-type: text/html; charset=utf-8");

        // 连接数据库
        $dbts  = new MySQLi("127.0.0.1:8889","root","root","TestDatabase");
        // $dbts = new MySQLi("192.168.0.249", "root", "root", "luluda");

        // 设置编码
        mysqli_set_charset($dbts, "utf8");

        // 投保人
        if ($people_kind == 1) {
            // 查询语句
            $sql = "select 
            activeCard_id,NameA,IdTypeA,IDCardNumA,SexA,BirthA,EMailA,PhoneA,AddrA 
            from actived 
            where activeCard_id = ".$carid." ";
            // 执行查询语句
            $datObj = $dbts->query($sql);
            // 具体数据
            $arr = array();
            while ($a = $datObj->fetch_assoc()) {
                $arr[] = $a;
            }

            $re = array(
                "status" => "success",
                "msg" => "成功",
                "code" => 122,
                "data" => array(
                    "thecard_id" => $arr[0]['activeCard_id'],
                    "Theactive_date" => "",
                    "Theeffect_date" => "",
                    "Recognizee_name" => $arr[0]['NameA'],
                    "Recogid_class" => $arr[0]['IdTypeA'],
                    "Recogid_number" => $arr[0]['IDCardNumA'],
                    "Recog_sex" => $arr[0]['SexA'],
                    "Recog_birth_date" => $arr[0]['BirthA'],
                    "Recog_email" => $arr[0]['EMailA'],
                    "Recog_tele" => $arr[0]['PhoneA'],
                    "Recog_address" => $arr[0]['AddrA'],
                    "Cardclass" => "",
                )
            );
            // 处理数据
            echo json_encode($re);
        } else if ($people_kind == 2) {
            // 受保人
            // 查询语句
            $sql = "select 
            activeCard_id,NameE,IdTypeE,IDCardNumE,SexE,BirthE,EMailE,PhoneE,AddrE 
            from actived
            where activeCard_id = ".$carid." ";
            // 执行查询语句
            $datObj = $dbts->query($sql);
            // 具体数据
            $arr = array();
            while ($a = $datObj->fetch_assoc()) {
                $arr[] = $a;
            }

            $re = array(
                "status" => "success",
                "msg" => "成功",
                "code" => 122,
                "data" => array(
                    "thecard_id" => $arr[0]['activeCard_id'],
                    "Theactive_date" => "",
                    "Theeffect_date" => "",
                    "Insure_name" => $arr[0]['NameE'],
                    "Insureid_class" => $arr[0]['IdTypeE'],
                    "Insureid_number" => $arr[0]['IDCardNumE'],
                    "Insure_sex" => $arr[0]['SexE'],
                    "Insure_birth" => $arr[0]['BirthE'],
                    "Insure_email" => $arr[0]['EMailE'],
                    "Insure_tele" => $arr[0]['PhoneE'],
                    "Insure" => $arr[0]['AddrE'],
                    "Cardclass" => "",
                )
            );
            // 处理数据
            echo json_encode($re);
        } else {
            // 受益人
            $re = array(
                "status" => "success",
                "msg" => "成功",
                "code" => 122,
                "data" => array(
                    "thecard_id" => "",
                    "Theactive_date" => "",
                    "Theeffect_date" => "",
                    "Insure_name" => "",
                    "Insureid_class" => "",
                    "Insureid_number" => "",
                    "Insure_sex" => "",
                    "Insure_birth" => "",
                    "Insure_email" => "",
                    "Insure_tele" => "",
                    "Insure" => "",
                    "Cardclass" => "",
                )
            );
            // 处理数据
            echo json_encode($re);
        }
    } else {
        // 不一致
        $re = array(
            "status" => "success",
            "msg" => "错误",
            "code" => 121,
            "data" => array(
                "status" => "非法操作！或登陆有误"
            )
        );
        echo json_encode($re);
    }
} else {
    // 不存在账号，提示未登陆
    $re = array(
        "status" => "success",
        "msg" => "错误",
        "code" => 120,
        "data" => array(
            "status" => "未登陆"
        )
    );
    echo json_encode($re);
}
