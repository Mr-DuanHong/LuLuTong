// 令牌检测
let cardId = localStorage.getItem("card_id");
if (cardId == null) {
    location.href = "../activateLogin.html";
}

// dom获取
// 信息查询页跳转
let actCom_searchBtnDom = document.querySelector(".actCom_searchButton");
// 理赔查询页跳转
let actCom_claimBtnDom = document.querySelector(".actCom_claimButton");
// 主页跳转
let actCom_indexBtnDom = document.querySelector(".actCom_returnIndex");


// 点击事件
actCom_searchBtnDom.onclick = function () {
    location.href = "../cardInformation.html";
}
actCom_claimBtnDom.onclick = function () {
    location.href = "../claimList.html";
}
actCom_indexBtnDom.onclick = function () {
    location.href = "../index.html";
}
