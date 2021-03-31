// *Dom获取
// form表单获取
let formDom = document.querySelector(".activateLogin_form");
// 密码是否可视
let passwordVisibleDom = document.querySelector(".iconfont");
// 隐藏input
let formHiddenDom = document.querySelector(".activateLogin_act"); 
// 卡号输入框
let inputCardIdDom = document.querySelector(".activateLogin_cardId");
// 密码输入框
let inputPassDom = document.querySelector(".activateLogin_password");
// 验证码输入框
let inputViriCodeDom = document.querySelector(".activateLogin_authCode");
// 验证码图片
let vircodeImgDom = document.querySelector(".activateLogin_virifyCode");
// 下一步按钮
let nextBtnDom = document.querySelector(".activateLogin_nextBtn");
// 提示框
let hintDom = document.querySelector(".activateLogin_hint");
// 选择框
let selecthintDom = document.querySelector(".activateLogin_selectHint");
// 选择框按钮：理赔查询
let claimSearchBtnDom = document.querySelector(".activateLogin_selectHint_claim");
// 选择框按钮：信息查询
let informationSearchBtnDom = document.querySelector(".activateLogin_selectHint_information");
// 选择框按钮：激活按键
let activePageBtnDom = document.querySelector(".activateLogin_selectHint_active");
// 选择框按钮：主页
let returnIndexBtnDom = document.querySelector(".activateLogin_selectHint_index");
// 选择框按钮：取消按钮
let cancelBtnDom = document.querySelector(".activateLogin_selectHint_cancel");


// *变量设置
// 记录卡号、卡号是否符合规范
let idvalue = "";
let idtest = true;
// 记录密码、密码是否符合规范
let pwvalue = "";
let passwordtest = true;
// 验证码是否符合规范
let virifytest = true;
// 登录类型变量：a 激活登录 ,ca 信息查询登录,cl 理赔登录 
let loginType = formHiddenDom.value == "active" ? 'a' : null ||  formHiddenDom.value == "claim" ? 'cl' : null || formHiddenDom.value == "card" ? 'ca' : null;

// *初始化
// 检查缓存中是否存在卡号密码，存在则自动添加到输入框中
let storageId = localStorage.getItem("card_id");
let storagePassword = localStorage.getItem("card_password");
if (storageId == null && storagePassword != null) {
    localStorage.removeItem("card_password");
}
if (storageId != null || storagePassword != null) {
    inputCardIdDom.value = storageId;
    inputPassDom.value = storagePassword;
}


// *密码可视点击事件
passwordVisibleDom.onclick = function () {
    // 切换类名以更改视图
    passwordVisibleDom.classList.toggle("icon-icon_eye-close");
    passwordVisibleDom.classList.toggle("icon-icon_eye-open");
    // 根据当前类名，修改input的type类型
    let visible = passwordVisibleDom.classList.value;
    visible = visible.indexOf("open");
    // 为-1说明现在为close不可见密码状态，不为-1说明现在为open可见密码状态
    inputPassDom.type = visible == -1 ?  "password" : "text";
}

// *验证码点击刷新
vircodeImgDom.onclick = function () {
    vircodeImgDom.src = "";
    vircodeImgDom.src = "./API/virifyCode2/validatecode.php";
}

// *下一步点击事件:onsubmit事件的执行函数
nextBtnDom.onclick = function () {

    // 获取form表单
    var formObj = new FormData(formDom);
    // 检测账号密码格式、是否为NULL检测,若检测未通过则做出提示并设置相关测试变量为False
    testCardId(formObj);
    if (loginType == 'a') {
        // 是激活登录，则进行密码合法性验证
        testPassword(formObj);
    } else {
        // 不是激活登录，即其他登录，就进行密码/身份证合法性验证
        testPasswordOrID(formObj);
    }
    testVirifyCode(formObj);

    if (idtest && passwordtest && virifytest) {
        // 格式检测则发送ajax请求
        myAjax({
            "method":"POST",
            "url":"../API/login.php",
            "data":formObj,  //Formdata数据
            "dataType":"JSON",
            "success": function (jsondata) {
                if (jsondata.status == "success") {
                    // 登录成功,清除本地存储
                    clearIdAndPwSession();

                    // 将卡号、密码写入本地存储
                    setIdAndPwSession(inputCardIdDom.value, inputPassDom.value);

                    if (jsondata.data.activated_status == 1) {
                        // 该卡已激活，弹出选项框，让用户选择转入理赔登录还是转入信息查询登录。
                        if (loginType == 'a') {

                            // 已激活，激活页面，弹出选择框
                            showSelectHint(selecthintDom, "该卡已被激活，请选择下一步操作：");

                            // 选择框按钮
                            // 理赔查询按钮
                            claimSearchBtnDom.onclick = function () {
                                // location.href = "../claimLogin.html";
                                location.href = "../claimList.html";
                            }

                            // 信息查询按钮
                            informationSearchBtnDom.onclick = function () {
                                // location.href = "../cardLogin.html";
                                location.href = "../cardInformation.html";
                            }

                            // 主页按钮
                            returnIndexBtnDom.onclick = function () {
                                location.href = "../index.html";
                                clearIdAndPwSession();
                            }

                            // 取消按钮
                            cancelBtnDom.addEventListener("click", () => {clearIdAndPwSession();});

                        } else if (loginType == 'ca'){
                            // 已激活，信息查询页面，正常进入下一步
                            localStorage.removeItem("card_password");
                            location.href = "../cardInformation.html";

                        } else if (loginType == 'cl') {
                            // 已激活，理赔查询页面，正常进入下一步
                            localStorage.removeItem("card_password");
                            console.log("登录成功");
                            location.href = "../claimList.html";

                        } else {
                            console.log("loginType值非法");
                        }

                    } else if (jsondata.data.activated_status == 0) {

                        if (loginType == 'a') {
                            // 未激活，激活页面，正常跳转
                            localStorage.removeItem("card_password");
                            location.href = "../serviceClause.html";

                        } else if (loginType == 'ca' || loginType == 'cl'){
                            // 将卡号、密码写入本地存储
                            setIdAndPwSession(inputCardIdDom.value, inputPassDom.value);

                            // 未激活，信息查询页面，弹出选择框
                            showSelectHint(selecthintDom, "该卡未被激活，请选择下一步操作：");

                            // 选择框按钮
                            // 理赔查询按钮
                            activePageBtnDom.onclick = function () {
                                // location.href = "../activateLogin.html";
                                location.href = "../serviceClause.html"
                            }

                            // 主页按钮
                            returnIndexBtnDom.onclick = function () {
                                location.href = "../index.html";
                                clearIdAndPwSession();
                            }

                            // 取消按钮
                            cancelBtnDom.addEventListener("click", () => {clearIdAndPwSession();});

                        } else {
                            console.log("loginType值非法");
                        }

                    } else {

                        showHint(hintDom, "激活状态异常，请联系客服人员!",2000);

                    }

                } else if(jsondata.code == 101){
                    // 验证码错误，更新验证码
                    showHint(hintDom, jsondata.msg,2000);
                    vircodeImgDom.src = "";
                    vircodeImgDom.src = "./API/virifyCode2/validatecode.php";

                } else if (jsondata == 103) {
                    // 密码错误
                    showHint(hintDom, jsondata.msg,2000);

                } else if (jsondata == 104) {
                    // 账号错误
                    showHint(hintDom, jsondata.msg,2000);

                } else {
                    // 其他
                    showHint(hintDom, jsondata.msg,2000);

                }
            }
        });
    } else {
        // 更新验证码
        vircodeImgDom.src = "";
        vircodeImgDom.src = "./API/virifyCode2/validatecode.php";
    }
}

// 输入框事件：当输入框聚焦样式变为正常
// 卡号框
inputCardIdDom.onfocus = function () {
    if (!idtest) {
        // 如果卡号检测未通过
        inputCardIdDom.style.border = "1px solid #767676";
        inputCardIdDom.style.color = "#000000";
        inputCardIdDom.value = idvalue;
    }
}

// 密码框
inputPassDom.onfocus = function () {
    if (!passwordtest) {
        // 如果密码检测未通过，那么重新输入时应该重置样式
        inputPassDom.style.border = "1px solid #767676";
        inputPassDom.style.color = "#000000";
        inputPassDom.value = pwvalue;
        inputPassDom.type = "password";
    }
}

// 验证码
inputViriCodeDom.onfocus = function () {
    if (!virifytest) {
        // 如果验证码检测未通过，那么重新输入时应该重置样式
        inputViriCodeDom.style.border = "1px solid #767676";
        inputViriCodeDom.style.color = "#000000";
        inputViriCodeDom.value = "";
    }
}

// *辅助函数
// !检测函数注意去除两端空格
// 检测卡号是否符合规范,参数为FormData对象;根据符合情况设置idtest变量值
function testCardId (obj) {
    // 获取card_id值
    let id = obj.get('card_id');

    if (id.length == 0) {
        // 未填写
        inputCardIdDom.style.border = "1px solid red";
        inputCardIdDom.style.color = "red";
        inputCardIdDom.value = "请输入卡号!";
        idtest = false;
    } else if (id.length == 12 || id == 'admin') {
        // 已填写，格式正确
        // !还要判断是否是纯数字
        idtest = true;
    } else {
        idvalue = inputCardIdDom.value;
        inputCardIdDom.style.border = "1px solid red";
        inputCardIdDom.style.color = "red";
        inputCardIdDom.value = "卡号长度非法!";
        idtest = false;
    }
}

// 检测密码是否符合规范,参数为FormData对象；根据符合情况设置passwordtest变量值
function testPassword (obj) {
    // 获取card_id值
    let pas = obj.get('card_password');

    if (pas.length == 0) {
        // 未填写
        inputPassDom.style.border = "1px solid red";
        inputPassDom.style.color = "red";
        inputPassDom.type = "text";
        inputPassDom.value = "请输入密码!";
        passwordtest = false;
    } else if (pas.length == 6) {
        // 已填写，格式正确
        // !还要判断是否是纯数字
        passwordtest = true;
    } else {
        pwvalue = inputPassDom.value;
        inputPassDom.style.border = "1px solid red";
        inputPassDom.style.color = "red";
        inputPassDom.type = "text";
        inputPassDom.value = "密码长度非法!";
        passwordtest = false;
    }
}

// 检测验证码是否符合规范,参数为FormData对象；根据符合情况设置virifytest变量值
function testVirifyCode (obj) {
    // 获取card_id值
    let code = obj.get('virify_code');

    if (code.length == 0) {
        // 未填写
        inputViriCodeDom.style.border = "1px solid red";
        inputViriCodeDom.style.color = "red";
        inputViriCodeDom.value = "请输入验证码!";
        virifytest = false;
    } else if (code.length == 4) {
        // 已填写，格式正确
        // !还要判断是否是纯数字
        virifytest = true;
    } else {
        inputViriCodeDom.style.border = "1px solid red";
        inputViriCodeDom.style.color = "red";
        inputViriCodeDom.value = "验证码长度非法!";
        virifytest = false;
    }
}

// 检测密码或身份证是否合法,参数为FormData对象；根据符合情况设置passwordtest变量值
function testPasswordOrID (obj) {
    // 获取card_id值
    let pas = obj.get('card_password');

    if (pas.length == 0) {
        // 未填写
        inputPassDom.style.border = "1px solid red";
        inputPassDom.style.color = "red";
        inputPassDom.type = "text";
        inputPassDom.value = "请输入密码/身份证!";
        passwordtest = false;
    } else if (pas.length == 6 || pas.length == 18) {
        // 已填写，格式正确
        // !还要判断是否是纯数字
        passwordtest = true;
    } else {
        pwvalue = inputPassDom.value;
        inputPassDom.style.border = "1px solid red";
        inputPassDom.style.color = "red";
        inputPassDom.type = "text";
        inputPassDom.value = "密码/身份证长度非法!";
        passwordtest = false;
    }
}

// 将卡号、密码写入本地存储
function setIdAndPwSession (idValue, pwValue) {
    localStorage.setItem("card_id", idValue);
    localStorage.setItem("card_password", pwValue);
}

// 清除本地存储中的卡号、密码
function clearIdAndPwSession () {
    localStorage.removeItem("card_id");
    localStorage.removeItem("card_password");
}


