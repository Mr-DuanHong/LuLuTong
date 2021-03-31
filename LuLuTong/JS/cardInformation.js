// *令牌检测
let cardId = localStorage.getItem("card_id");
if (cardId == null) {
    location.href = "../cardLogin.html";
}


// *Dom获取
// 投保人选项卡按钮
let cardInfor_speBtn_applicantDom = document.querySelector(".cardInfor_speBtn_applicant");
// 被保人选项卡按钮
let cardInfor_speBtn_insuredDom = document.querySelector(".cardInfor_speBtn_insured");
// 受益人选项卡
let cardInfor_speBtn_benefiDom = document.querySelector(".cardInfor_speBtn_benefi");
// 卡种
let cardInforTitle_titleDom = document.querySelector(".cardInforTitle_title span");
// 卡号
let cardInfor_cardIdDom = document.querySelector(".cardInfor_cardId span");
// 面值
let cardInforTitle_priceDom = document.querySelector(".cardInforTitle_price span");
// 保额
let cardInfor_amountOneDom = document.querySelector(".cardInfor_amountOne span");
// 保额2
let cardInfor_amountTwo = document.querySelector(".cardInfor_amountTwo span");
// 加载中
let cardInfor_loadingDom = document.querySelector(".cardInfor_loading");
// // 投保人
// let cardInfor_spe_applicantDom = document.querySelector(".cardInfor_spe_applicant");
// // 被保人
// let cardInfor_spe_insuredDom = document.querySelector(".cardInfor_spe_insured");
// // 受益人
// let cardInfor_spe_benefiDom = document.querySelector(".cardInfor_spe_benefi");
// 显示区
let cardInfor_spe_showDom = document.querySelector(".cardInfor_spe_show");
// 理赔信息按钮
let cardInfor_nextButtonDom = document.querySelector(".cardInfor_nextButton");
// 安全退出按钮
let cardInfor_exitButtonDom = document.querySelector(".cardInfor_exitButton");
// 安全退出--确认
let cardInfor_selectHint_hint_ensureDom = document.querySelector(".cardInfor_selectHint_hint_ensure");
// 选择框
let cardInfor_selectHint_hintDom = document.querySelector(".cardInfor_selectHint_hint");

// *变量定义
// 投保人信息
let applicantInfor = {};
// 被保人信息
let insuredInfor = {};

// *获取数据
for (let i = 1; i <= 2; i++) {
    myAjax({
        "method":"POST",
        "url":"../API/getCard.php",
        "data":{
            "card_id": cardId,
            "people_kind": i
        },
        "dataType":"JSON",
        "success": function (jsondata) {
            if (jsondata.status == "success") {
                // 数据返回成功
                if (i == 1) {
                    applicantInfor = jsondata.data;
                } else if (i == 2) {
                    insuredInfor = jsondata.data;
                }
            } else {
                // 数据返回失败
                // 提示失败信息
            }
        }
    });
}

// *初始化卡种、卡值
initiCardInfor();
// *初始化，一定时间后初始化时因为防止ajax请求未返回。
let loadInterval = setInterval(() => {
    if (JSON.stringify(applicantInfor) == '{}' || JSON.stringify(insuredInfor) == '{}') {
        // 如果数据还未返回
        cardInfor_loadingDom.style.display = 'block';
    } else {
        // 如果数据已经返回，此时初始化
        // console.log(applicantInfor);
        cardInfor_loadingDom.style.display = 'none';
        initiPeopleInfor(1,cardInfor_spe_showDom,applicantInfor);
        clearInterval(loadInterval);
    }
}, 100);


// *选项卡切换点击事件
cardInfor_speBtn_applicantDom.onclick = function () {
    // 修改选项卡样式
    changeBtnCurrent(cardInfor_speBtn_applicantDom);
    // 渲染信息
    initiPeopleInfor(1,cardInfor_spe_showDom,applicantInfor);
}
cardInfor_speBtn_insuredDom.onclick = function () {
    // 修改选项卡样式
    changeBtnCurrent(cardInfor_speBtn_insuredDom);
    // 渲染信息
    initiPeopleInfor(2,cardInfor_spe_showDom,insuredInfor);
}
cardInfor_speBtn_benefiDom.onclick = function () {
    // 修改选项卡样式
    changeBtnCurrent(cardInfor_speBtn_benefiDom);
    // 渲染信息
    cardInfor_spe_showDom.innerHTML = "<p class='cardInfor_spe_show_bene'>受益人为法定继承人</p>";
}
cardInfor_nextButtonDom.onclick = function () {
    location.href = "../claimList.html";
}
// 安全退出页面点击事件
cardInfor_exitButtonDom.onclick = function () {
    // 清除令牌（缓存卡号）
    showSelectHint(cardInfor_selectHint_hintDom,"确认退出?");
}

// 安全退出选择框-确认退出
cardInfor_selectHint_hint_ensureDom.onclick = function () {
    // 清除缓存
    localStorage.removeItem("card_id");
    // 页面跳转
    location.href = "../claimLogin.html";
    // !怎么可以实现：本页面刷新不清除？也就是说要判断页面是刷新还是关闭(移动到其他页面)
}


// *辅助函数
// 初始化页面，填写卡种、卡号、面值等信息
function initiCardInfor () {
    if (cardId == null) {
        // 如果卡号缓存为null，说明没有正常登陆，则跳转到登录页
        location.href = "../activateLogin.html";
    } else {
        let targetStr = cardId.substr(3,1);
        if ( targetStr == "1") {
            // A卡
            cardClassContent("A",cardId,"500.00","15000.00","5000.00");
        } else if ( targetStr == "2" ) {
            // B卡
            cardClassContent("B",cardId,"200.00","6000.00","2000.00");
        } else if ( targetStr == "3" ) {
            // C卡
            cardClassContent("C",cardId,"1000.00","30000.00","10000.00");
        } else {
            showHint(clause_hintDom, "卡种异常，请联系客服人员!", 2500);
        }
    }

    function cardClassContent(cardClass, cardiD,price, amountone, amounttwo) {
        // Dom获取
        cardInforTitle_titleDom.innerText = cardClass;
        cardInfor_cardIdDom.innerText = cardiD;
        cardInforTitle_priceDom.innerText = price;
        cardInfor_amountOneDom.innerText = amountone;
        cardInfor_amountTwo.innerText = amounttwo;
    }

}

// 渲染人物信息 
function initiPeopleInfor (type,dom,dataObj) {
    if (type == 1) {
        var nametitle = "投保人姓名";
        var name = dataObj.Recognizee_name;
        var cardType = dataObj.Recogid_class == '1' ? '身份证' : dataObj.Recogid_class == '0' ? '护照' : null;
        var cardId = dataObj.Recogid_number;
        var sex = dataObj.Recog_sex == '0' ? '女' : dataObj.Recog_sex == '1' ? '男' : null;
        var brithDate = dataObj.Recog_birth_date;
        var email = dataObj.Recog_email;
        var phone = dataObj.Recog_tele;
        var address = dataObj.Recog_address;
    } else {
        var nametitle = "被保人姓名";
        var name = dataObj.Insure_name;
        var cardType= dataObj.Insureid_class == '1' ? '身份证' : dataObj.Insureid_class == '0' ? '护照' : null;
        var cardId = dataObj.Insureid_number;
        var sex = dataObj.Insure_sex  == '0' ? '女' : dataObj.Insure_sex == '1' ? '男' : null;
        var brithDate = dataObj.Insure_birth;
        var email = dataObj.Insure_email;
        var phone = dataObj.Insure_tele;
        var address = dataObj.Insure;
    }
    dom.innerHTML = `<div class="cardInfor_spe_item"><span class="cardInfor_spe_item_title">${nametitle}</span><span class="cardInfor_spe_item_content">${name}</span></div>
    <div class="cardInfor_spe_item"><span class="cardInfor_spe_item_title">证件类型</span><span class="cardInfor_spe_item_content">${cardType}</span></div>
    <div class="cardInfor_spe_item"><span class="cardInfor_spe_item_title">证件号码</span><span class="cardInfor_spe_item_content">${cardId}</span></div>
    <div class="cardInfor_spe_item"><span class="cardInfor_spe_item_title">性别</span><span class="cardInfor_spe_item_content">${sex}</span></div>
    <div class="cardInfor_spe_item"><span class="cardInfor_spe_item_title">出生日期</span><span class="cardInfor_spe_item_content">${brithDate}</span></div>
    <div class="cardInfor_spe_item"><span class="cardInfor_spe_item_title">电子邮箱</span><span class="cardInfor_spe_item_content">${email}</span></div>
    <div class="cardInfor_spe_item"><span class="cardInfor_spe_item_title">手机号</span><span class="cardInfor_spe_item_content">${phone}</span></div>
    <div class="cardInfor_spe_item"><span class="cardInfor_spe_item_title">地址</span><span class="cardInfor_spe_item_content">${address}</span></div>`
}

// 清除投保人/被保人/受益人按钮的选中样式,并未目标增加选中样式
function changeBtnCurrent (dom) {
    let currentStatusDom = document.querySelector(".cardInfor_spe_button_current");
    currentStatusDom.classList.remove("cardInfor_spe_button_current");
    dom.classList.add("cardInfor_spe_button_current");
}