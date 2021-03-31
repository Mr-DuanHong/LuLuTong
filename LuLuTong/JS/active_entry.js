// 令牌检测
let cardId = localStorage.getItem("card_id");
if (cardId == null) {
    location.href = "../activateLogin.html";
}
// 初始化
initiActiveEntry();

// Dom获取
// 安全退出
let activeEntry_exitBtnDom = document.querySelector(".activeEntry_exitButton");
// 安全退出确认按键
let activeEntry_ensureBtnDom = document.querySelector(".activeEntry_selectHint_hint_ensure");
// 选择提示框
let activeEntry_selectHint_hintDom = document.querySelector(".activeEntry_selectHint_hint");
// 下一步按钮
let activeEntry_nextBtnDom = document.querySelector(".activeEntry_nextButton");
// 投保人除性别外的所有input
let activeEntry_InputDomArr = document.querySelectorAll(".activeEntry .activeEntry_form_input");
// 投保人所有input
let activeEntry_form_inputDomArr = document.querySelectorAll(".activeEntry_form_input");
// 被保人所有Input
let activeEntry_form_InsuredInputDomArr = document.querySelectorAll(".activeEntry_form_InsuredInput");
// 被保人除性别、是投保人外的所有input
let activeEntry_insuredInputDomArr = document.querySelectorAll(".activeEntry .activeEntry_form_InsuredInput");
// 投保人性别
let activeEntry_sex = document.querySelectorAll(".activeEntry_form_sex");
// 被保人性别
let activeEntry_insuredSex = document.querySelectorAll(".activeEntry_form_InsuredInput_sex");
// 是否是同一人
let activeEntry_sameDom = document.querySelectorAll(".activeEntry_form_same");
// 必须项（除性别）
let activeEntry_requiredDomArr = document.querySelectorAll(".formRequired");
// 提示框
let activeEntry_hintDom = document.querySelector(".activeEntry_hint");
// form表单
let activeEntry_formDom = document.querySelector(".activeEntry_form");
// 出生日期
let activeEntry_birthDomArr = document.querySelectorAll(".activeEntry_form_input_user_birth");
// 本卡生效时年龄年龄
let activeEntry_ageDom = document.querySelectorAll(".activeEntry_form_inputDivItem_age");
// 本卡生效日期选择
let activeEntry_effectDateDom = document.querySelector(".activeEntry_form_effectDate_inputdate");
// 本卡生效日期
let activeEntry_effectDateOrignDom = document.querySelector(".activeEntry_form_effectDate_term_orign");
// 本卡结束日期
let activeEntry_effectDateDesDom = document.querySelector(".activeEntry_form_effectDate_term_des");
// 投保人身份证号
let activeEntry_form_inputCardIdDom = document.querySelector(".activeEntry_form_inputCardId");
// 被保人身份证号
let activeEntry_form_InsuredInputCardIdDom = document.querySelector(".activeEntry_form_InsuredInputCardId");

// 变量
// 确认提交还是确认退出
let isSubmit = true;

// 下一步点击事件
activeEntry_nextBtnDom.onclick = function () {
    /* 判空操作 由于投保人和被保人除了”是投保人“这一选项外，其他都相同。所以 投保人的input设 class="activeEntry_form_Input"，
    被保人的input设class="activeEntry_form_InsuredInput"。但是性别和”是投保人“这一选项单独设类判空。*/
    // let flag = judgeNull(activeEntry_requiredDomArr, activeEntry_sex, activeEntry_insuredSex);
    let flag = true;
    if (flag == true) {
        // 表单无空项，进入表单项合法性检测
        flag = judgeLegality();
    }
    if (flag == true) {
        // 表单合法，进入被保人年龄检测
        let insuredAge = Number(activeEntry_ageDom[1].innerText);

        flag = judgeInsuredAge(insuredAge);
        if (!flag) {
            showHint(activeEntry_hintDom, "被保人不符合年龄要求(18-70岁);", 2500);
        }
    }  else {
        showHint(activeEntry_hintDom, "请继续完善表单!", 2500);
    }
    if (flag == true) {
        // 年龄正常，开始提交数据
       
        isSubmit = true;
        showSelectHint(activeEntry_selectHint_hintDom,"确认提交?");
    }
}

// 安全退出页面点击事件
activeEntry_exitBtnDom.onclick = function () {
    // 清除令牌（缓存卡号）
    isSubmit = false;
    showSelectHint(activeEntry_selectHint_hintDom,"确认退出?");
}

// 安全退出选择框-确认退出/提交
activeEntry_ensureBtnDom.onclick = function () {
    if (isSubmit) {
        // 解锁表单
        activeEntry_sex[1].disabled = false;
        activeEntry_sex[0].disabled = false;
        activeEntry_birthDomArr[0].disabled = false;
        activeEntry_insuredSex[0].disabled = false;
        activeEntry_insuredSex[1].disabled = false;
        activeEntry_birthDomArr[1].disabled = false;

        // 提交数据
        var formObj = new FormData(activeEntry_formDom);
        formObj.append("card_id",localStorage.getItem("card_id"));
        myAjax({
            "method":"POST",
            "url":"../API/activeCard.php",
            "data":formObj,
            "dataType":"JSON",
            "success": function (jsondata) {
                if (jsondata.status == "success") {
                    // 提交成功
                    console.log(jsondata);
                    location.href = "../activeCompelte.html";
                } else {
                    // 提交失败
                    showHint(activeEntry_hintDom, "提交失败!", 2500);
                }
            }
        });
    } else {
        // 清除缓存
        localStorage.removeItem("card_id");
        // 页面跳转
        location.href = "../activateLogin.html";
    }

    // !怎么可以实现：本页面刷新不清除？也就是说要判断页面是刷新还是关闭(移动到其他页面)
}

// 输入框事件，点击后取消红框：
for (let i = 0; i < activeEntry_requiredDomArr.length; i++) {
    activeEntry_requiredDomArr[i].onclick = function () {
        activeEntry_requiredDomArr[i].style.border = "1px solid #767676";
    }
}

// 出生日期选中后，根据生效日期是否填写，自动生成年龄
for (let i = 0; i < activeEntry_birthDomArr.length; i++) {
    activeEntry_birthDomArr[i].oninput = function () {
        if (activeEntry_effectDateDom.value != "") {
            console.log("年龄生成");
            // 出生年
            let birthYear = activeEntry_birthDomArr[i].value;
            birthYear = String(birthYear).substr(0,4);
            // 生效年
            let effectYear = activeEntry_effectDateDom.value;
            effectYear = String(effectYear).substr(0,4);
            // 年龄
            let age = Number(effectYear - birthYear);
            if (typeof age == "number" && age != NaN) {
                activeEntry_ageDom[i].innerText = age;
            }
        }
    }
}

// 生效日期选中后，根据出生日期是否填写，自动生成年龄
activeEntry_effectDateDom.addEventListener("input",()=>{
    console.log("年龄生成");
    activeEntry_effectDateOrignDom.innerText = activeEntry_effectDateDom.value;
    activeEntry_effectDateDesDom.innerText = getDateDes(activeEntry_effectDateDom.value); //此处应该进行结果的合法性检测
    for (let i = 0; i < activeEntry_birthDomArr.length; i++) {
        if (activeEntry_birthDomArr[i].value != "") {
            // 出生年
            let birthYear = activeEntry_birthDomArr[i].value;
            birthYear = String(birthYear).substr(0,4);
            // 生效年
            let effectYear = activeEntry_effectDateDom.value;
            effectYear = String(effectYear).substr(0,4);
            // 年龄
            let age = Number(effectYear - birthYear);
            if (typeof age == "number" && age != NaN) {
                activeEntry_ageDom[i].innerText = age;
            }
        }
    }
});

// 根据被投保人的选择，自动填充被保人信息
activeEntry_sameDom[0].oninput = function () {
    console.log("自动填充");
    if (activeEntry_sameDom[0].value == 'yes') {
        // 填充input
        for (let i = 0; i < activeEntry_InputDomArr.length; i++) {
            activeEntry_insuredInputDomArr[i].value = activeEntry_InputDomArr[i].value;
            if (activeEntry_insuredInputDomArr[i].value != "") {
                // 取消被填充项的红框样式与提示文本
                activeEntry_insuredInputDomArr[i].style.border = "1px solid #767676";
                let targetdoma = activeEntry_insuredInputDomArr[i].parentNode.querySelector(".activeEntry_form_inputDivItem_hint") == null ? activeEntry_insuredInputDomArr[i].parentNode.parentNode.querySelector(".activeEntry_form_inputDivItem_hint") : activeEntry_insuredInputDomArr[i].parentNode.querySelector(".activeEntry_form_inputDivItem_hint");
                targetdoma.style.opacity = "0";
            }
            activeEntry_ageDom[1].innerText = activeEntry_ageDom[0].innerText;
        }
        // 填充单选框
        for (let i = 0; i < activeEntry_sex.length; i++) {
            activeEntry_insuredSex[i].checked = activeEntry_sex[i].checked;
            if (activeEntry_insuredSex[i].value != "") {
                // 取消被填充项的红框样式与提示文本
                activeEntry_insuredSex[i].style.border = "1px solid #767676";
            }
        }
        // 设置双向绑定
        setBindData();
        // 是身份证，被保人的锁定
        let reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
        let target = activeEntry_form_InsuredInputCardIdDom.value;
        if (reg.test(target)) {
            // 填充
            activeEntry_insuredSex[0].disabled = true;
            activeEntry_insuredSex[1].disabled = true;
            activeEntry_birthDomArr[1].disabled = true;
        }
    } else {
        // 取消双向绑定
        cancelBindData();
        // 清空列表
        for (let i = 0; i < activeEntry_form_InsuredInputDomArr.length; i++) {
            activeEntry_insuredInputDomArr[i].value = "";
        }
        activeEntry_insuredSex[0].checked = false;
        activeEntry_insuredSex[1].checked = false;
        activeEntry_ageDom[1].innerText = "";
    }
}


// 投保人身份证
activeEntry_form_inputCardIdDom.addEventListener("input",()=>{
    // 如果身份证号符合正则
    let reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
    let target = activeEntry_form_inputCardIdDom.value;
    if (reg.test(target)) {
        // 获取性别、出生日期
        let sex = Number(target.substr(16,1)) % 2 == 1 ? "1" : "0";
        let birth = target.substr(6,4) + "-" + target.substr(10,2) + "-" + target.substr(12,2);
        // 填充性别
        if ( sex == "1") {
            activeEntry_sex[0].checked = true;
            activeEntry_sex[0].disabled = true;
            activeEntry_sex[1].checked = false;
            activeEntry_sex[1].disabled = true;
        } else if ( sex == "0" ) {
            activeEntry_sex[0].checked = false;
            activeEntry_sex[0].disabled = true;
            activeEntry_sex[1].checked = true;
            activeEntry_sex[1].disabled = true;
        }
        // 填充出生日期
        activeEntry_birthDomArr[0].value = birth;
        activeEntry_birthDomArr[0].disabled = true;
        // 生成年龄
        if (activeEntry_effectDateDom.value != "") {
            // 出生年
            let birthYear = birth;
            birthYear = String(birthYear).substr(0,4);
            // 生效年
            let effectYear = activeEntry_effectDateDom.value;
            effectYear = String(effectYear).substr(0,4);
            // 年龄
            let age = Number(effectYear - birthYear);
            if (typeof age == "number" && age != NaN) {
                activeEntry_ageDom[0].innerText = age;
            }
        }
        // 提示样式重置
        let doma = document.querySelector("input[name='user_sex']");
        let domb = document.querySelector("input[name='user_birth']");
        doma.style.border = "1px solid #767676";
        domb.style.border = "1px solid #767676";
        let targetdoma = doma.parentNode.parentNode.querySelector(".activeEntry_form_inputDivItem_hint");
        let targetdomb = domb.parentNode.querySelector(".activeEntry_form_inputDivItem_hint");
        targetdoma.style.opacity = "0";
        targetdomb.style.opacity = "0";
    } 
});
// 被保人身份证
activeEntry_form_InsuredInputCardIdDom.addEventListener("change",()=>{
    console.log(1);
    let reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
    let target = activeEntry_form_InsuredInputCardIdDom.value;
    if (reg.test(target)) {
        // 获取性别、出生日期
        let sex = Number(target.substr(16,1)) % 2 == 1 ? "1" : "0";
        let birth = target.substr(6,4) + "-" + target.substr(10,2) + "-" + target.substr(12,2);
        // 填充
        // 填充
        if ( sex == "1") {
            console.log(1);
            activeEntry_insuredSex[0].checked = true;
            activeEntry_insuredSex[0].disabled = true;
            activeEntry_insuredSex[1].checked = false;
            activeEntry_insuredSex[1].disabled = true;
        } else if ( sex == "0" ) {
            activeEntry_insuredSex[0].checked = false;
            activeEntry_insuredSex[0].disabled = true;
            activeEntry_insuredSex[1].checked = true;
            activeEntry_insuredSex[1].disabled = true;

        }
        // 填充出生日期
        activeEntry_birthDomArr[1].value = birth;
        activeEntry_birthDomArr[1].disabled = true;
        // 生成年龄
        if (activeEntry_effectDateDom.value != "") {
            // 出生年
            let birthYear = birth;
            birthYear = String(birthYear).substr(0,4);
            // 生效年
            let effectYear = activeEntry_effectDateDom.value;
            effectYear = String(effectYear).substr(0,4);
            // 年龄
            let age = Number(effectYear - birthYear);
            if (typeof age == "number" && age != NaN) {
                activeEntry_ageDom[1].innerText = age;
            }
        }
    } 
});


// 辅助函数
// 将投保人与被保人的数据进行双向绑定
function setBindData () {
    for (let i = 0; i < activeEntry_form_inputDomArr.length; i++) {
        activeEntry_form_inputDomArr[i].oninput = function () {
            activeEntry_form_InsuredInputDomArr[i].value = activeEntry_form_inputDomArr[i].value;
            activeEntry_form_InsuredInputDomArr[i].checked = activeEntry_form_inputDomArr[i].checked;
        }
        activeEntry_form_InsuredInputDomArr[i].oninput = function () {
            activeEntry_form_inputDomArr[i].value = activeEntry_form_InsuredInputDomArr[i].value;
            activeEntry_form_inputDomArr[i].checked = activeEntry_form_InsuredInputDomArr[i].checked;
        }
    }
} 

// 将投保人与被保人数据取消双向绑定
function cancelBindData () {
    for (let i = 0; i < activeEntry_InputDomArr.length; i++) {
        activeEntry_InputDomArr[i].oninput = function () {}
        activeEntry_insuredInputDomArr[i].oninput = function () {}
    }
}

// 初始化页面
function initiActiveEntry () {
    let cardId = localStorage.getItem("card_id");
    if (cardId == null) {
        // 如果卡号缓存为null，说明没有正常登陆，则跳转到登录页
        location.href = "../activateLogin.html";
    } else {
        let activeEntry_cardIdDom = document.querySelector(".activeEntry_cardId span");
        activeEntry_cardIdDom.innerText = cardId;
    }
}

// 判断表单是否有空项,如果有则红框并提示
// function judgeNull (domArr,radiodomArr1,radiodomArr2) {
//     // 优化：检测通过Formdata来检测应该更方便简单

//     let flag = true;
//     // 单选框
//     flag = judgeNullRadio(radiodomArr1);
//     flag = judgeNullRadio(radiodomArr2);
//     // 普通input
//     for (let i = 0; i < domArr.length; i++) {
//         if (domArr[i].value == "") {
//             flag = false;
//             domArr[i].style.border = "1px solid red";
//         } 
//     }
//     if (flag == false) {
//         showHint(activeEntry_hintDom, "表单未填写完，请继续填写红色框表单项", 2500);
//     }
//     return flag;

//     function judgeNullRadio(radioDomArr) {
//         let flag = false;
//         for (let i = 0; i < radioDomArr.length; i++) {
//             if (radioDomArr[i].checked == true) {
//                 flag = true;
//             }
//         }
//         return flag;
//     }

// }


// 判断表单项合法性

function judgeLegality () {
    let formObj = new FormData(activeEntry_formDom);
    if (formObj.get('id_card') == "") {
        if (formObj.get('user_sex') == null) formObj.set('user_sex',"");
    }
    if (formObj.get('insurance_id_card') == "") {
        if (formObj.get('insurance_sex') == null) formObj.set('insurance_sex',"");
    }

    let flag = true;
    // 正则
    var reg = new RegQ();
    // 数据
    let optionData = [{
        "formName":'username',
        "testReg":true,
        "msg":""
    },{
        "formName":'id_card',
        "testReg":reg.IDcard(formObj.get('id_card')),
        "msg":"身份证号码格式不合法!"
    },{
        "formName":'card_type',
        "testReg":true,
        "msg":""
    },{
        "formName":'user_birth',
        // "testReg":reg.birth(formObj.get('user_birth')),
        "testReg":true,
        "msg":"出生日期不能早于1900年!"
    },{
        "formName":'user_email',
        "testReg":reg.email(formObj.get('user_email')),
        "msg":"电子邮件格式不合法!"
    },{
        "formName":'user_phone',
        "testReg":reg.phone(formObj.get('user_phone')),
        "msg":"手机号码格式不合法!"
    },{
        "formName":'user_address',
        "testReg":true,
        "msg":""
    },{
        "formName":'isusername',
        "testReg":true,
        "msg":""
    },{
        "formName":'insurance_name',
        "testReg":true,
        "msg":""
    },{
        "formName":'insurance_id_card',
        "testReg":reg.IDcard(formObj.get('insurance_id_card')),
        "msg":"身份证号码格式不合法!"
    },{
        "formName":'insurance_card_type',
        "testReg":true,
        "msg":""
    },{
        "formName":'insurance_birth',
        // "testReg":reg.birth(formObj.get('insurance_birth')),
        "testReg":true,
        "msg":"出生日期不能早于1900年!"
    },{
        "formName":'insurance_email',
        "testReg":reg.email(formObj.get('insurance_email')),
        "msg":"电子邮件格式不合法!"
    },{
        "formName":'insurance_phone',
        "testReg":reg.phone(formObj.get('insurance_phone')),
        "msg":"手机号码格式不合法!"
    },{
        "formName":'insurance_address',
        "testReg":true,
        "msg":""
    },{
        "formName":'user_sex',
        "testReg":true,
        "msg":""
    },{
        "formName":'insurance_sex',
        "testReg":true,
        "msg":""
    }];

    // input判断
    for (let i = 0; i < optionData.length; i++) {
        legalTest(formObj,optionData[i]);
    }

    return flag;

    function legalTest (formdata,option) {
        let dom = document.querySelector("input[name='"+ option.formName +"']");
        // console.log(dom);
        // console.log(dom.getAttribute("disabled"));
        if (formdata.get(option.formName) == "") {
            // console.log(option.formName,formdata.get(option.formName));
            legalTest_mode("请填写该项!");
            flag = false;
            return;
        }
        if (!option.testReg) {
            legalTest_mode(option.msg);
            flag = false;
            return;
        }
        return;

        function legalTest_mode (Hintstr){
            let doma = document.querySelector(".activeEntry_form input[name='"+option.formName+"']") == null ? document.querySelector(".activeEntry_form select[name='"+option.formName+"']") : document.querySelector(".activeEntry_form input[name='"+option.formName+"']");
            let targetdoma = doma.parentNode.querySelector(".activeEntry_form_inputDivItem_hint") == null ? doma.parentNode.parentNode.querySelector(".activeEntry_form_inputDivItem_hint") : doma.parentNode.querySelector(".activeEntry_form_inputDivItem_hint");
            targetdoma.innerText = Hintstr;
            doma.style.border = "1px solid red";
            targetdoma.style.opacity = "1";
            doma.addEventListener("input",()=>{
                targetdoma.style.opacity = "0";
            });
        }
    }
}
// judgeLegality();
// 被保人年龄检测
function judgeInsuredAge (age) {
    if (age > 70 || age < 18) {
        showHint(activeEntry_hintDom, "本卡生效时被保人不符合年龄限制", 2500);
        return false;
    } else {
        return true;
    }
}

// 生效日期结束时间
function getDateDes (dateOri) {
    let year = dateOri.substr(0,4);
    let month = dateOri.substr(5,2);
    let day = dateOri.substr(8,2);
    let newMonth = Number(month) + 3;
    if (newMonth > 12) {
        newMonth = newMonth - 12;
        year = Number(year) + 1;
    }
    if (newMonth < 10) {
        newMonth = "0" + newMonth;
    }
    let date = year + "-" + newMonth + "-" + day;
    return date;
}
