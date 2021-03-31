// 令牌检测
let cardId = localStorage.getItem("card_id");
if (cardId == null) {
    location.href = "../activateLogin.html";
}
// 初始化
initiClause();


// Dom获取
// 下一步
let clause_nextBtnDom = document.querySelector(".serCla_nextButton");
// 安全退出
let clause_exitBtnDom = document.querySelector(".serCla_exitButton");
// 复选框
let checkboxDomArr = document.querySelectorAll("input[type='checkbox']");
// 提示框
let clause_hintDom = document.querySelector(".clause_hint");
// 选择框
let clause_selecthintDom = document.querySelector(".clause_selectHint_hint");
// 选择框-确认
let clause_selecthintDom_ensure = document.querySelector(".serCla_selectHint_hint_ensure");


for (let i = 0; i < checkboxDomArr.length; i++) {
    if (i != checkboxDomArr.length - 1) {
        // 非全选项
        let flag = true;
        checkboxDomArr[i].onclick = function () {
            for (let j = 0; j < checkboxDomArr.length - 1; j++) {
                // 检测是否每一个非全选项都被选中
                if (checkboxDomArr[j].checked == false) {
                    flag = false;
                    break;
                } else {
                    flag = true;
                }
            }
            checkboxDomArr[checkboxDomArr.length - 1].checked = flag;
        }
    } else {
        // 全选项
        checkboxDomArr[i].onclick = function () {
            for (let j = 0; j < checkboxDomArr.length - 1; j++) {
                // 改变每一个非全选项的check
                checkboxDomArr[j].checked = checkboxDomArr[checkboxDomArr.length - 1].checked;
            } 
        }
    }
}


// 下一步点击事件
clause_nextBtnDom.onclick = function () {
    
    if (judgeCheckbox(checkboxDomArr)) {
        // 当复选框已经被全部选中
        location.href = "../active_entry.html";
    } else {
        // 当复选框未被全部选中
        showHint(clause_hintDom, "请在完成条款阅读后，勾选全部复选框", 2500);
    }
}

// 安全退出页面
clause_exitBtnDom.onclick = function () {
    // 清除令牌（缓存卡号）
    showSelectHint(clause_selecthintDom,"确认退出?");
}

// 安全退出选择框-确认退出
clause_selecthintDom_ensure.onclick = function () {
    // 清除缓存
    localStorage.removeItem("card_id");
    // 页面跳转
    location.href = "../activateLogin.html";
    // !怎么可以实现：本页面刷新不清除？也就是说要判断页面是刷新还是关闭(移动到其他页面)
}




// 辅助函数
// 判断复选框是否全部被选中
function judgeCheckbox (dom) {
    let flag = true;;
    for (let i = 0; i < dom.length; i++) {
        if (dom[i].checked == false) {
            flag = false;
            break;
        }
    }
    return flag;
}

// 初始化条款列表中的卡种、面值、保额
function initiClause () {
    let cardId = localStorage.getItem("card_id");
    if (cardId == null) {
        // 如果卡号缓存为null，说明没有正常登陆，则跳转到登录页
        location.href = "../activateLogin.html";
    } else {
        let targetStr = cardId.substr(3,1);
        if ( targetStr == "1") {
            // A卡
            cardClassContent("A","500.00","5000.00");
        } else if ( targetStr == "2" ) {
            // B卡
            cardClassContent("B","200.00","2000.00");
        } else if ( targetStr == "3" ) {
            // C卡
            cardClassContent("C","1000.00","10000.00");
        } else {
            showHint(clause_hintDom, "卡种异常，请联系客服人员!", 2500);
        }
    }

    // 根据卡种设置内容
    function cardClassContent(cardClass, price, cover) {
        // Dom获取
        let cardClassDomArr = document.querySelectorAll(".serCla_cardClass");
        let cardPriceDom = document.querySelector(".serClaTitle_price span");
        let cardCoverDomArr = document.querySelectorAll(".serCla_orangeMoney");

        for(let i = 0; i < cardClassDomArr.length; i++) {
            cardClassDomArr[i].innerText = cardClass;
        }
        cardPriceDom.innerText = price;
        for (let i = 0; i < cardCoverDomArr.length; i++) {
            cardCoverDomArr[i].innerText = cover;
        }
    }



}