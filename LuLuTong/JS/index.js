
// dom获取
// 信息查询页跳转
let actCom_searchBtnDom = document.querySelector(".index_searchButton");
// 理赔查询页跳转
let actCom_claimBtnDom = document.querySelector(".index_claimButton");
// 我要激活跳转
let actCom_activeBtnDom = document.querySelector(".index_activeButton");


// 点击事件
actCom_searchBtnDom.onclick = function () {
    location.href = "../cardLogin.html";
}
actCom_claimBtnDom.onclick = function () {
    location.href = "../claimLogin.html";
}
actCom_activeBtnDom.onclick = function () {
    location.href = "../activateLogin.html";
}
