<?php
    // *头文件
    header("Content-type: text/html; charset=uft-8");
    // *数据库连接
    $database = new MySQLi("192.168.0.249","root","root","mydatabank");
    // *设置编码
    mysqli_set_charset( $database , 'utf8' );

    // *查询语句
    $sql = "select * from student";

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