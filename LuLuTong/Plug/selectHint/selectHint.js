// Dom获取：
let selectHint_maskDom = document.querySelector(".selectHint_mask");
let selectHint_selecthintDom = document.querySelector(".selectHint_hint");

// 取消按键：
let selectHint_cancelBtnDom = document.querySelector(".selectHint_hint_content_button .selectHint_hint_cancel");
selectHint_cancelBtnDom.onclick = function () {
    // 取消遮罩
    selectHint_maskDom.classList.toggle("selectHint_onmask");
    // 重新隐藏
    selectHint_selecthintDom.style.display = "none";
}

// 显示选择提示框
function showSelectHint (dom, hinttext) {
    // 启动遮罩
    selectHint_maskDom.classList.toggle("selectHint_onmask");
    // 显示选择提示框
    dom.style.display = "block";
    dom.querySelector(".selectHint_hint_content").innerText = hinttext;
}
