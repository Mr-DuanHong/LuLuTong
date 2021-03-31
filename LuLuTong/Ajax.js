/* 
    调用：
    myAjax({
        "method":"GET",
        "url":"data.php",
        "data":{
            "keyword": keyword,
            "page": 1
        },
        "dataType":"JSON",
        "success": function (jsondata) {
            console.log(jsondata);
        }
    });
*/
// *myAjax()函数
function myAjax(option) {
    // open()方法参数
    let method = "GET";
    let url = "";
    let asyn = true;
    // 前台发送给后台的数据
    let data = null;
    // 成功时执行函数
    let success = function () {
        console.log("成功");
    };
    // 请求超时时执行函数
    let timeout = function () {
        console.log("超时");
        // showHint(hintDom, "登录超时!",2000);
    };
    // 数据类型
    let dataType = "text";

    // *参数替换
    if (option) {
        if (option.method != undefined) method = option.method;
        if (option.url != undefined) url = option.url;
        if (option.asyn != undefined) asyn = option.asyn;
        if (option.data != undefined) data = option.data;
        if (option.success != undefined) success = option.success;
        if (option.timeout != undefined) timeout = option.timeout;
        if (option.dataType != undefined) dataType = option.dataType;
    }

    // *XMLHttpRequest对象创建
    let xml = new XMLHttpRequest();

    // *跨域处理
    xml.withCredentials = true; 

    // *设置需要传入的数据
    // 'GET'方式
    if (method == 'GET') {
        // 去掉url本来的数据
        // url = iniUrl(url);
        url = url + dataToUrlArg(data);
    }

    // *初始化请求
    xml.open(method, url, asyn);

    // 'POST'方式
    let postData = method == "POST" ? data : null;
    // 判断是formdata对象还是普通object对象
    if ( !(postData instanceof FormData)) {
        // 如果是普通object,将其转换为发送字符串形式
        xml.setRequestHeader("content-type", "application/x-www-form-urlencoded");  //注意本句必须在open方法以后
        postData = dataToPOSTAry(postData);
    }

    // *发送请求
    xml.send(postData);

    // *监听xml对象的readystate变化，当变化时执行函数；简单来说就是根据后台得到的值做出反应：
    xml.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // 说明请求已成功发送，数据传输完成。并且响应已成功。
            let data = this.responseText;
            // console.log(this.responseText);
            if (dataType == "JSON") {
                // 目标数据类型是JSON，则
                try {

                    data = JSON.parse(this.responseText);

                } catch (error) {
                    console.log(data);
                    console.log(error);

                    data = {
                        "status":"error",
                        "msg":"错误，服务器返回数据非JSON!",
                        "code":-1,
                        "data":[]
                    }
                }
            }
            if (dataType == "HTML") {
                data = this.responseText;
            }


            // 执行函数
            success(data);

        }
    }

    // *请求超时处理
    xml.timeout = 2000;
    xml.ontimeout = function () {
        // 超时时要执行的函数
        timeout();
    }

    // JSON对象数据转换为网址参数字符串(适用于GET方式)
    function dataToUrlArg (data) {
        let tmp = '?';
        for (const key in data) {
            tmp += `${key}=${data[key]}&`;
        }
        // 去掉最后一个&
        tmp = tmp.substr(0,tmp.length - 1);
        return tmp;
    }
    
    // JSON对象数据转换为POST方式发送的字符串
    function dataToPOSTAry (data) {
        let tmp = "";
        for (const key in data) {
            tmp += `${key}=${data[key]}&`;
        }
        // 去掉最后一个&
        tmp = tmp.substr(0,tmp.length - 1);
        return tmp;
    }

    // 初始化url，去掉?以及其后的内容
    function iniUrl(str) {
        let newStr = str.split("?");
        return newStr[0];
    }
}

