// 设置某个Dom的display:block以及设置innerText,一定毫秒后隐藏;如show(hintDom,"密码错误",3000)
function showHint (dom, hinttext, term) {
    dom.style.display = "block";
    dom.innerText = hinttext;
    // 默认值
    let realterm = term == undefined ? 3000 : term;
    setTimeout( () => {
        dom.style.display = "none";
    }, realterm);
}