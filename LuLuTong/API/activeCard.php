<?php
// 头部信息
header("Content-type: text/html; charset=utf-8");
// 使用缓存
session_start();

// 参数卡号
$carid = $_POST['card_id'];

// 判断卡号在session缓存是否存在
if (isset($_SESSION['cardnumber'])) {

    // 存在判断卡号是否与传入卡号一致
    if ($carid == $_SESSION['cardnumber']) {

        // 一致
        // 获取传入信息
        $username = $_POST['username']; //持卡人姓名
        $card_type = $_POST['card_type']; //身份证类型
        $id_card = $_POST['id_card']; //身份证号码
        $user_sex = $_POST['user_sex']; //性别
        $user_birth = $_POST['user_birth']; //出生日期
        $user_email = $_POST['user_email']; //电子邮箱
        $user_phone = $_POST['user_phone']; //电话
        $user_address = $_POST['user_address']; //地址
        $isusername = $_POST['isusername']; //是否是投保人
        $insurance_name = $_POST['insurance_name']; //被保人姓名
        $insurance_card_type = $_POST['insurance_card_type']; //身份证类型
        $insurance_id_card = $_POST['insurance_id_card']; //身份证号码类型
        $insurance_sex = $_POST['insurance_sex']; //性别
        $insurance_birth = $_POST['insurance_birth']; //出生日期
        $insurance_email = $_POST['insurance_email']; //电子邮箱
        $insurance_phone = $_POST['insurance_phone']; //电话
        $insurance_address = $_POST['insurance_address']; //地址

        // 添加或修改投保人、被保人相关信息


        // 连接数据库
        // $dbts = new MySQLi("192.168.0.249", "root", "root", "luluda");
        $dbts  = new MySQLi("127.0.0.1:8889","root","root","TestDatabase");

        // 设置编码
        mysqli_set_charset($dbts, "utf8");

        // 查询actived表里有没有录入信息的卡号
        $sql = "select * from actived where activeCard_id like " . $carid;

        // 取得结果对象
        $result = $dbts->query($sql);

        // 获取具体数据
        $data = array();
        while ($tmp = $result->fetch_assoc()) {
            $data[] = $tmp;
        }

        // 存在录入信息的卡号
        if (count($data) != 0) {
            // 有信息，则更新该卡号信息
            $sqla = "update actived set 
            NameA='" . $username . "',
            IdTypeA='" . $card_type . "',
            IDCardNumA='" . $id_card . "',
            SexA='" . $user_sex . "',
            BirthA='" . $user_birth . "',
            EMailA='" . $user_email . "',
            PhoneA='" . $user_phone . "',
            AddrA='" . $user_address . "',
            RelashipE='" . $isusername . "',
            NameE='" . $insurance_name . "',
            IdTypeE='" . $insurance_card_type . "',
            IDCardNumE='" . $insurance_id_card . "',
            SexE='" . $insurance_sex . "',
            BirthE='" . $insurance_birth . "',
            EMailE='" . $insurance_email . "',
            PhoneE='" . $insurance_phone . "',
            addrE='" . $insurance_address . "',
            TEDT0A='' 
            where activeCard_id = '" . $carid . " '";
            // 执行查询语句
            $datObja = $dbts->query($sqla);
        } else {
            // 不存在录入信息的卡号，则添加卡号并录入信息
            $sqla = "insert into
            actived(
            activeCard_id,
            NameA,
            IdTypeA,
            IDCardNumA,
            SexA,
            BirthA,
            EMailA,
            PhoneA,
            AddrA,
            RelashipE,
            NameE,
            IdTypeE,
            IDCardNumE,
            SexE,
            BirthE,
            EMailE,
            PhoneE,
            AddrE) 
            values('$carid',
            '$username',
            '$card_type',
            '$id_card',
            '$user_sex',
            '$user_birth',
            '$user_email',
            '$user_phone',
            '$user_address',
            '$isusername',
            '$insurance_name',
            '$insurance_card_type',
            '$insurance_id_card',
            '$insurance_sex',
            '$insurance_birth',
            '$insurance_email',
            '$insurance_phone',
            '$insurance_address'
            )";
            // 执行查询语句
            $datObja = $dbts->query($sqla);
        }

        // 更新card表激活状态
        $sqlb = "update card set card_active='1' where card_id = '" . $carid . " '";

        // 执行查询语句
        $datObjb = $dbts->query($sqlb);

        // 查询card表激活状态
        $sqlc = "select card_active from card where card_id = '" . $carid . " '";

        // 执行查询语句
        $datObjc = $dbts->query($sqlc);

        // 具体数据
        $arr = array();
        while ($a = $datObjc->fetch_assoc()) {
            $arr[] = $a;
        }

        if ($arr[0]['card_active'] == 1) {
            $re = array(
                "status" => "success",
                "msg" => "成功",
                "code" => 111,
                "data" => array(
                    "status" => "激活成功",
                )
            );
            echo json_encode($re);
        } else {
            $re = array(
                "status" => "error",
                "msg" => "错误",
                "code" => 110,
                "data" => array(
                    "status" => "激活失败",
                )
            );
            echo json_encode($re);
        }
    } else {
        // 不一致
        $re = array(
            "status" => "error",
            "msg" => "错误",
            "code" => 109,
            "data" => array(
                "status" => "非法操作！登陆有误",
            )
        );
        echo json_encode($re);
    }
} else {
    // 不存在账号，提示未登陆
    $re = array(
        "status" => "error",
        "msg" => "错误",
        "code" => 108,
        "data" => array(
            "status" => "未登陆",
        )
    );
    echo json_encode($re);
}
