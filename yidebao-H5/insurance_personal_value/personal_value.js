
var product_name;
var selfContribute = 240; //  个人对家庭贡献
var finicalResponsibility = 230; //  个人未尽的经济责任
var retiring_age = 65;
var age = 30;
var iTag = 0; //  菜单编号

var colors = new Array("#ffaf51", "#688fd0", "#ff8080", "#875e78", "#94d15e");

/***
 *读取指定的Cookie值
 *@param {string} cookieName Cookie名称
 */
function ReadCookie(cookieName) {
    var theCookie = "" + document.cookie;
    var ind = theCookie.indexOf(cookieName);
    if (ind == -1 || cookieName == "") return "";
    var ind1 = theCookie.indexOf(';', ind);
    if (ind1 == -1) ind1 = theCookie.length;
    /*读取Cookie值*/
    return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
}

function $(id) {
    return document.getElementById(id);
}

function updatePersonalValue() {
    $("personal_value").innerHTML = (selfContribute + finicalResponsibility) / 2;
}

function updateSelfContribute() {
    //    个人年收入
    var _income = parseInt($("income").value);
    //    个人收入占家庭收入
    var _income_percent = parseFloat($("income_percent").value);
    //    个人花销占个人收入
    var _selfSpense_percent = parseFloat($("selfSpense_percent").value);
    //    年龄计算
    var _age;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay() + 1;
    var birth = $("birthday").value;
    var birth_year = birth.split('-')[0];
    var birth_month = birth.split('-')[1];
    var birth_day = birth.split('-')[2];
    if (birth_month - month == 0) {
        if (birth_day - day <= 0) age = year - birth_year;
        else age = year - birth_year - 1;
    } else if (birth_month - month < 0) age = year - birth_year;
    else age = year - birth_year - 1;
    //  计算个人对家庭贡献
    selfContribute = (retiring_age - age) * (1 - _selfSpense_percent) * _income;
    $("self_contribute").innerHTML = String(selfContribute) + "万元";
    updatePersonalValue();
}

function updateFinacialResponsibility() {
    var _house_loan = parseInt($("house_loan").value);
    var _car_loan = parseInt($("car_loan").value);
    var _education_budget = parseInt($("education_budget").value);
    var _parental_support = parseInt($("parental_support").value);
    var _spouse_support_pa = parseInt($("spouse_support_pa").value);
    finicalResponsibility = _house_loan + _car_loan + _education_budget + _parental_support + _spouse_support_pa * (retiring_age - age);
    updatePersonalValue();
}

function incomeChange(s) {
    updateSelfContribute();
}

function incomePercentChange(s) {
    updateSelfContribute();
}

function selfSpensePercentChange(s) {
    //         alert(obj.value);
    updateSelfContribute();
}

function dateChange() {
    updateSelfContribute();
}

function parentalSupportChange(s) {
    updateFinacialResponsibility();
}

function educationBudgetChange(s) {
    updateFinacialResponsibility();
}

function carLoanChange(s) {
    updateFinacialResponsibility();
}

function houseLoanChange(s) {
    updateFinacialResponsibility();
}

function spouseSupportChange(s) {
    updateFinacialResponsibility();
}

function updateTabBar() {
    switch (iTag) {
        case 2: //  产品列表
            $("bar_title").className = "name";
            $("bar_title").innerHTML = "选择的产品：";
            $("bar_value").className = "totalPrice";
            $("bar_value").innerHTML = "精心优选" + "+百万身价";
            $("bar_unit").className = "hidecontent";
            $("bar_unit").innerHTML = "";
            $("bar_second").className = "nextStep"
            $("bar_second").innerHTML = "查看投保方案"
            break;
        case 3: //  投保方案
            $("bar_title").className = "hidecontent";
            $("bar_title").innerHTML = "";
            $("bar_value").className = "hightlight";
            $("bar_value").innerHTML = "身价保障方案：年投入￥4800元，保障总额￥80万元";
            $("bar_unit").className = "hidecontent";
            $("bar_second").className = "hidecontent";
            break;
        default: // 身价测算
            $("bar_title").className = "name";
            $("bar_title").innerHTML = "我要保的身价至少是：￥";
            $("bar_value").className = "totalPrice";
            $("bar_value").innerHTML = "";
            $("bar_unit").className = "name";
            $("bar_unit").innerHTML = "万元";
            $("bar_second").className = "nextStep";
            $("bar_second").innerHTML = "选择产品"
    }
}

function switchTag(tag, content) {
    for (i = 1; i <= 3; i++) {
        if ("tag" + i == tag) {
            document.getElementById(tag).className = "active";
            iTag = i;
        } else {
            document.getElementById("tag" + i).className = "";
        }
        if ("content" + i == content) {
            document.getElementById(content).className = "";
        } else {
            document.getElementById("content" + i).className = "hidecontent";
        }
    }
    updateTabBar();
}

function load() {
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }
    var url = "insurance_personal_value_products_list.php";
    url = url + "?q=" + Math.random();
    xmlHttp.onreadystatechange = stateChanged;
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function stateChanged() {
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        xmlDoc = xmlHttp.responseXML;

        // 更新产品列表        
        var x = xmlDoc.getElementsByTagName("term_life");
          for (i = 0; i <x.length; i++) { 
            appendProduct(
                    x[i].getElementsByTagName("product_name")[0].childNodes[0].nodeValue,
                    x[i].getElementsByTagName("company")[0].childNodes[0].nodeValue,
                    x[i].getElementsByTagName("img_path")[0].childNodes[0].nodeValue,
                    x[i].getElementsByTagName("keywords")[0].childNodes[0].nodeValue,
                    colors[i]
                );
          }
    }
}

function GetXmlHttpObject() {
    var objXMLHttp = null;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码       
        objXMLHttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    return objXMLHttp;
}

function appendProduct(_product_name, _company, _img_path, _keywords, _color){

        var pxui_area = document.createElement('div');
        var div1 = document.createElement('div');
        var h2 = document.createElement('h2');
        var h2_text = document.createElement('text');
        var a = document.createElement('a');
        var img = document.createElement('img');
        var div2 = document.createElement('div');
        var div3 = document.createElement('div');
        var div4 = document.createElement('div');
        var mlabel = document.createElement('label');
        var minput = document.createElement('input');
        pxui_area.className = 'pxui-area';
        // div1
        div1.style.padding = "0";
        div1.style.margin = "0";
        h2.style.backgroundColor = _color;
        h2_text.innerHTML = _product_name;
        if(_product_name.length>4)
        {
            h2.style.fontSize='18px';
            h2.style.PaddingLeft='5px';
            h2.style.PaddingRight='5px';
        }


        h2_text.color = "#FFFFFF";
        a.className = 'max';
        a.href = '#';
        if(_img_path)
            img.src = '../img/'+_img_path;
        else
            img.src = '../img/love.jpg';

        img.width = '160';
        img.height = '116';
        pxui_area.appendChild(div1);
        div1.appendChild(h2);
        div1.appendChild(a);
        h2.appendChild(h2_text);
        a.appendChild(img);

        // div2 div3
        pxui_area.appendChild(div2);
        div2.style.marginTop = '0';
        div2.className = 'row-fluid';
        div3.className = 'row-fluid';
        div2.appendChild(div3);
        
        var array = _keywords.split(";");
        if(array.length<=1)
            array = _keywords.split("；");

        for (var i=0 ; i<array.length && i<4 ; i++)
        {
            var text_i = document.createElement('text');

            text_i.innerHTML = array[i];
            if(i==0||i==array.length-1||i==3)
            {
                text_i.style.backgroundColor = _color;
                text_i.className = 'highlight_tip';
            }
            else
            {
                text_i.style.border = '1px '+_color+' solid';
                text_i.className = 'hollow_tip';
            }

            div3.appendChild(text_i);
        } 
        
        //  div4
        div4.className = 'container';
        pxui_area.appendChild(div4);
        var div5 = document.createElement('div');
        div4.appendChild(div5);
        div5.align = "left";
        div5.style.marginTop = '50px';
        div5.style.width = "100%";
        div5.className = "row-fluid";
        minput.type = 'checkbox';
        minput.id = 'product1';
        minput.style.marginLeft = '1px';
        div5.appendChild(minput);
        div5.appendChild(document.createTextNode("加入方案"));
        $('product_list').appendChild(pxui_area);

}

