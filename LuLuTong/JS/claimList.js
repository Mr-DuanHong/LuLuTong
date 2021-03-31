// 令牌检测
let cardId = localStorage.getItem("card_id");
if (cardId == null) {
    location.href = "../activateLogin.html";
}

// Dom获取
// 安全退出
let claimList_exitBtnDom = document.querySelector(".claimList_exitButton");
// 安全退出-确认键
let claimList_ensureDom = document.querySelector(".claimList_selectHint_hint_ensure");
// 选择框
let claimList_selectHintDom = document.querySelector(".claimList_selectHint_hint");
// 理赔显示区：
let claimList_showDom = document.querySelector(".claimList_item");
// 投保信息按钮
let claimList_nextButtonDom = document.querySelector(".claimList_nextButton");


// 初始化
initiClaimList();

// 安全退出页面点击事件
claimList_exitBtnDom.onclick = function () {
    // 清除令牌（缓存卡号）
    showSelectHint(claimList_selectHintDom,"确认退出?");
}

// 安全退出选择框-确认退出
claimList_ensureDom.onclick = function () {
    // 清除缓存
    localStorage.removeItem("card_id");
    // 页面跳转
    location.href = "../claimLogin.html";
    // !怎么可以实现：本页面刷新不清除？也就是说要判断页面是刷新还是关闭(移动到其他页面)
}
claimList_nextButtonDom.onclick = function () {
    location.href = "../cardInformation.html";
}

function initiClaimList () {
    let cardId = localStorage.getItem("card_id");
    if (cardId == null) {
        // 如果卡号缓存为null，说明没有正常登陆，则跳转到登录页
        location.href = "../activateLogin.html";
    } else {
        // 卡号
        let claimList_cardIdDom = document.querySelector(".claimList_cardId span");
        claimList_cardIdDom.innerText = cardId;

        // 
        let oneformObj = new FormData();
        oneformObj.append("card_id",cardId);

        // 获取数据
        myAjax({
            "method":"POST",
            "url":"../API/getClaim.php",
            "data":oneformObj,
            "dataType":"JSON",
            "success": function (jsondata) {
                if (jsondata.data.length == 0) {
                    // 当无理赔信息
                    claimList_showDom.innerHTML = '<div class="claimList_claimInfor claimList_top">暂无理赔信息</div>';
                } else {
                    // 当有理赔信息
                    let htmlStr = "";
                    for (let i = 0; i < jsondata.data.length; i++) {
                        htmlStr += `<div class="claimList_top_gray claimList_item_title">理赔 ${i+1}</div>
                        <div class="claimList_top">编号 : ${jsondata.data[i].id}</div>
                        <div class="claimList_top_gray">事故原因 : ${jsondata.data[i].reason}</div>
                        <div class="claimList_top">出险时间 : ${jsondata.data[i].createtime}</div>
                        <div class="claimList_top_gray">案件状态 : ${jsondata.data[i].state}</div>
                        <div class="claimList_top">完成时间 : ${jsondata.data[i].finishedtime}</div>`;
                    }
                    claimList_showDom.innerHTML = htmlStr;
                }
            }
        });
    }
}