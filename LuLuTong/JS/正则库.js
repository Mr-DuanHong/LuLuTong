/* ***********************
 * 一、完成正则验证库
 *
 * 函数名: RegQ()
 * 使用方法: 
 *   var reg = new RegQ();
 *   reg.phone(phone);//返回true/false
 ********************** */
function RegQ() {
    // *手机号
    this.phone = function ( str ) {
        let isMatch = /^1[3-9]\d{9}/.test( str );
        return isMatch;
    }
    // *座机号
    this.telephone = function ( str ) {
        let isMatch = /0\d{2,3}-\d{7,8}/.test(str);
        return isMatch;
    }
    // *邮箱：登录名@主机名.域名
    // 主机名：只能包含数字、字母、连字符，且不能以连字符开头
    this.email = function (str) {
        let isMatch = /^\w+@\w[0-9a-zA-Z\-]+.\w+$/i.test(str);
        return isMatch;
    }
    // *身份证：1-2省份代码；3-4城市代码；5-6区县代码；7-14出生年、月、日；15-17同一地址、同一辖区内同年同月同日生出生人的顺序码，同时17位标识性别。18位校检码，[0-9X]
    // 出生年月敏感:1900至今
    this.IDcard = function (str) {
        // let isMatch = /^[0-9]{6}(([1][9]\d{2})|([2][0][012]\d))(([0][1-9])|([1][012]))(([0][1-9])|([12][0-9])|([3][01]))[0-9]{3}[0-9X]$/.test(str);
        let isMatch = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/.test(str);
        return isMatch;
    }
    // *手机号/座机号
    this.contact = function (str) {
        let isMatch = /((^1[3-9]\d{9})|(0\d{2,3}-\d{7,8}))/.test(str);
        return isMatch;
    }
    // *用户名:只能由数字字母下划线组成，且不能以数字开头
    // !为什么反斜杠也可以？
    this.username = function ( str ) {
        let isMatch = /^[a-zA-Z_][\w_]*$/.test(str);
        return isMatch;

    }
    // *密码
    this.password = function( str ) {

    }
    // *邮编
    this.postcode = function(str) {
        let isMatch = /[0-9]{6}/.test(str);
        return isMatch;
    }
    // *QQ
    this.qq = function(str) {
        let isMatch = /[1-9][0-9]{6,12}/.test(str);
        return isMatch;
    }
    // *是否带有小数
    this.isFloat = function(str) {
        let isMatch = /^\d+.\d+$/.test(str);
        return isMatch;
    }
    // *是否是中文名
    this.isChineseName = function(str) {
        let isMatch = /^[\u4E00-\u9FA5]{2,4}$/.test(str);
        return isMatch;
    }
    // *出生日期
    this.birth = function(str) {
        let isMathch = /(([1][9]\d{2})|([2][0][012]\d))-(([0][1-9])|([1][012]))-(([0][1-9])|([12][0-9])|([3][01]))/.test(str);
        return isMathch;
    }
    // *a标签中的网址
    this.getWebsite = function(str) {
        let isMatch =  [];
        let reg = /<a[^>]*href="(http:\/\/[^"]*)"[^>]*>/ig;
        let tmp = null;
        while (tmp = reg.exec(str)) {
            isMatch.push(tmp[1]);
        }
        return isMatch;
    }
    // *a标签中的内容
    this.getALabelInnerText = function(str) {
        let isMatch =  [];
        let reg = /<a [^>]*>([^<]*)<\/a>/ig;
        let tmp = null;
        while (tmp = reg.exec(str)) {
            console.log(tmp);
            isMatch.push(tmp[1]);
        }
        return isMatch;
    }

}

