// 复选框
let checkAllPlug_checkboxDomArr = document.querySelectorAll("input[type='checkbox']");

for (let i = 0; i < checkAllPlug_checkboxDomArr.length; i++) {
    if (i != checkAllPlug_checkboxDomArr.length - 1) {
        // 非全选项
        let flag = true;
        checkAllPlug_checkboxDomArr[i].onclick = function () {
            for (let j = 0; j < checkAllPlug_checkboxDomArr.length - 1; j++) {
                // 检测是否每一个非全选项都被选中
                if (checkAllPlug_checkboxDomArr[j].checked == false) {
                    flag = false;
                    break;
                } else {
                    flag = true;
                }
            }
            checkAllPlug_checkboxDomArr[checkAllPlug_checkboxDomArr.length - 1].checked = flag;
        }
    } else {
        // 全选项
        checkAllPlug_checkboxDomArr[i].onclick = function () {
            for (let j = 0; j < checkAllPlug_checkboxDomArr.length - 1; j++) {
                // 改变每一个非全选项的check
                checkAllPlug_checkboxDomArr[j].checked = checkAllPlug_checkboxDomArr[checkAllPlug_checkboxDomArr.length - 1].checked;
            } 
        }
    }
}
