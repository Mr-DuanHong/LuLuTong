<?php
    // *数据库连接
    // $database = new MySQLi("192.168.0.249","root","root","luluda");
    $database = new MySQLi("127.0.0.1:8889","root","root","TestDatabase");
    // *设置编码
    mysqli_set_charset( $database , 'utf8' );
    // *数据库测试
    // echo "<pre>";
    // print_r($database);

    // *数据增加语句
    // $sqladd = "insert into card values ('519300000011','123456','0')";
    // $database->query($sqladd);
    // $sqladd = "insert into card values ('519300000012','123456','0')";
    // $database->query($sqladd);
    // $sqladd = "insert into card values ('519300000013','123456','0')";
    // $database->query($sqladd);
    // $sqladd = "insert into card values ('519300000014','123456','0')";
    // $database->query($sqladd);
    // $sqladd = "insert into card values ('519300000015','123456','0')";
    // $database->query($sqladd);
    // $sqladd = "insert into card values ('519300000016','123456','0')";
    // $database->query($sqladd);
   

    // *查询语句
    // $sql = "select * from card";
    $sql = "select * from actived";
    // $sql = "select * from claim";
    // $sql = "select * from card left JOIN actived on card.card_id = actived.activeCard_id";
    // $sql = "select * from card left JOIN actived on card.card_id = actived.activeCard_id where card_active like '1'";

    

    // *取得结果对象
    $result = $database->query($sql);

    // *获取具体数据
    $data = array();
    while ($tmp = $result->fetch_assoc()) {
        $data[] = $tmp;
    }


    // !在此打印出的是乱码，似乎是数据库=》PHP的是乱码，应该设置什么样的编码语句？
    // echo "<pre>";
    // print_r(json_encode($data));
    // *最终数据
    $res = array(
        "status"=>"success",
        "msg"=>"成功",
        "code"=>1,
        "data"=>$data
    );
    echo json_encode($res);
?>