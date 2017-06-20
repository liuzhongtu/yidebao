var RETIREMENT_AGE = 60;

//写入cookie
function setCookie(name, value) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 6 * 24 * 60 * 60 * 1000); //6天过期
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            return true;
        };
//读取cookie
function getCookie(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]); return null;
        };

//    年龄计算
function getAge(birth)
{
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var birth_year = birth.split('-')[0];
    var birth_month = birth.split('-')[1];
    var birth_day = birth.split('-')[2];  

     if (birth_month - month == 0) {
        if (birth_day - day <= 0) 
            age = year - birth_year;
        else 
            age = year - birth_year - 1;
    } 
    else if (birth_month - month < 0) 
        age = year - birth_year;
    else 
        age = year - birth_year - 1;;    

    return age;
}

//  根据值设置select的哪一项选中
function selectItemByValue(objSelect, _val){
    for (var i = 0; i < objSelect.options.length; i++) { 
        if (objSelect.options[i].value == _val) { 
            objSelect.options[i].selected = true; 
            break; 
        }
    }     
}