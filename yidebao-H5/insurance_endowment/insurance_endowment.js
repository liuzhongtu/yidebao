/* 
* @Author: anchen
* @Date:   2017-03-11 19:39:30
* @Last Modified by:   liu zhongtu
* @Last Modified time: 2017-05-22 22:32:51
*/

var age;                    //   当前年龄
var income = 6000;          //   当前月收入
var familySameGenderLife=75;            //  家族同性平均寿命
var averageSalary = 5000;               //  所在城市平均工资
var ssPaymentBase = 3500;               //  社保月平均缴纳基数
var ssPaymentYear = 15;                 //  社保共缴纳的年数
var retireLifeLevel = 0.6;              //  退休后生活水平
var has_ss=true;                        //  有无社保

var expectedLifeSpan;           //  预期寿命
var retirement_pension;         //  退休工资
var gap=0;                        //  缺口

var iTag = 1; //  菜单编号


$(document).ready(function(){
    
});

function switchTag(tag, content) {
    for (i = 1; i < 3; i++) {
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
}

function GetXmlHttpObject() {
    var objXMLHttp = null;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码       
        objXMLHttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    return objXMLHttp;
}

function load() {
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }
    var url = "insurance_endowment_product_list.php";
    url = url + "?q=" + Math.random();
    xmlHttp.onreadystatechange = stateChanged;
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);

 //   onInitialUpdate();
}

////////////////////////////////////////////////////////////////////////////////////////////////
//  第一页

//  初始化
function onInitialUpdate(){
    age = getAge('1999-1-1');

    updateExpectedLifeSpan();
    updateRetirementPension();   
    updatePensionGap();   
}

function incomeChange(){
    income = parseInt($("#income").val());
    updateExpectedLifeSpan();
    updateRetirementPension();   
    updatePensionGap(); 
}

function updateExpectedLifeSpan(){
    expectedLifeSpan=(familySameGenderLife-age)/0.8+age;
    $('#expected_life_span').html(expectedLifeSpan+'岁');
}

//  （城市平均工资*(1+3%) ^（退休年龄-现在年龄）+月平均缴纳基数）/2*（缴纳年限/100）+月平均缴纳基数*8%/129月
function updateRetirementPension(){
    if(has_ss)
        retirement_pension = (averageSalary*Math.pow(1.03, RETIREMENT_AGE-age)+ssPaymentBase)/2*(ssPaymentYear/100)+ssPaymentBase*0.08/129;
    else
        retirement_pension = 0;

    $('#retirement_pendion').html(Math.round(retirement_pension)+'元/月');    
}

//  （（家庭平均寿命-目前个人年龄）/ 5+家庭目前平均寿命）*退休后理想生活水平*（1+3%）^(退休年龄-现在年龄)
function updatePensionGap(){
    var _pension_need = ((expectedLifeSpan-age)/5 + expectedLifeSpan-RETIREMENT_AGE)*12*income*retireLifeLevel*Math.pow(1.03, RETIREMENT_AGE-age);
    gap =Math.round((_pension_need -(expectedLifeSpan-RETIREMENT_AGE)*12*retirement_pension)/10000);

    $('#pending_gap').html(gap+'万元');  
    $('#bar_value').html(gap);  
}

function dateChange() {
    age = getAge($("#birthday").val());

    updateExpectedLifeSpan();
    updateRetirementPension();
    updatePensionGap();
}

function retireLevelChange(){
    retireLifeLevel = parseFloat($("#retire_level").val());
    updateExpectedLifeSpan();
    updateRetirementPension();
    updatePensionGap();
}

function socialSecurityChange(s){
    if(s==1){
        $('#social_security1').attr("checked",true); 
        $('#social_security2').attr("checked",false); 

        $('#ss1').show();
        $('#ss2').show();
        $('#ss3').show();
        $('#ss4').show();

        has_ss = true;
    }
    else if(s==2){
        $('#social_security1').attr("checked",false); 
        $('#social_security2').attr("checked",true); 

        $('#ss1').hide();
        $('#ss2').hide();
        $('#ss3').hide();
        $('#ss4').hide();

        has_ss = false;
    }

    updateExpectedLifeSpan();
    updateRetirementPension();
    updatePensionGap();
}

function ssPaymentYearChange(){
    ssPaymentYear = parseInt($("#sspayment_year").val());

    updateRetirementPension();
}

function averageSalaryChange(){
    averageSalary = parseInt($("#average_salary").val());
    updateRetirementPension();
}

function averageSsBaseChange(){
    ssPaymentBase = parseInt($("#averageSsBase").val());
    updateRetirementPension();
}

function familySameGenderLifeChange(){
    familySameGenderLife = parseFloat($("#familySameGenderLife").val());

    updateExpectedLifeSpan();
    updateRetirementPension();
    updatePensionGap();
}

////////////////////////////////////////////////////////////////////////////////////////////////
//  第二页

function stateChanged() {
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        xmlDoc = xmlHttp.responseXML;
        
        // 更新产品列表
        // 
        var x = xmlDoc.getElementsByTagName("insurance_endowment");
          for (i = 0; i <x.length; i++) { 
            if(xmlDoc.getElementsByTagName("product_name")[i].childNodes[0] == undefined)continue;
            var _product_name = xmlDoc.getElementsByTagName("product_name")[i].childNodes[0].nodeValue;

            var _product_type;
            if(xmlDoc.getElementsByTagName("product_type")[i].childNodes[0] == undefined)
                _product_type="";
            else
                _product_type=xmlDoc.getElementsByTagName("product_type")[i].childNodes[0].nodeValue;

            var _company;
            if(xmlDoc.getElementsByTagName("company")[i].childNodes[0] == undefined)
                _company="";
            else
                _company=xmlDoc.getElementsByTagName("company")[i].childNodes[0].nodeValue;

            var _main_risk;
            if(xmlDoc.getElementsByTagName("main_risk")[i].childNodes[0] == undefined)
                _main_risk="";
            else
                _main_risk=xmlDoc.getElementsByTagName("main_risk")[i].childNodes[0].nodeValue;

            var _product_img;
            if(xmlDoc.getElementsByTagName("product_img")[i].childNodes[0] == undefined)
                _product_img="";
            else
                _product_img=xmlDoc.getElementsByTagName("product_img")[i].childNodes[0].nodeValue;

            var _keywords;
            if(xmlDoc.getElementsByTagName("keywords")[i].childNodes[0] == undefined)
                _keywords="";
            else
                _keywords=xmlDoc.getElementsByTagName("keywords")[i].childNodes[0].nodeValue;            

            appendProduct(
                    _product_name,
                    _product_type,
                    _main_risk,
                    _company,
                    _product_img,
                    _keywords,
                    i
                );
          }
    }
}

function openPremiumCalc(_product_name, _product_img)
{
    var _href="premium_calculation.htm?product_name="+_product_name+"&img="+_product_img;
    window.location.href(_href);
}

function appendProduct(_product_name,_type,_main_risk,_company, _product_img, _keywords,_i){

    var _li = document.createElement('li');
    _li.className = "span4";
    $('#product_list').append(_li);

    var _div = document.createElement('div');
    _div.className="thumbnail";
    _li.appendChild(_div);

    var _img = document.createElement('img');
    _img.id = _product_name+'img';
    _img.alt = "300x200" ;
    _img.style="width:100%;"
    _img.src = '../img/insurance_endowment/'+_product_img;
    _div.appendChild(_img);

    var _div_caption = document.createElement('div');
    _div_caption.className="caption";
    _div.appendChild(_div_caption);

    var _h5_caption = document.createElement('h5');
    _h5_caption.innerHTML = _product_name;
    _div_caption.appendChild(_h5_caption);

    var _small_subtitle=document.createElement('small');
    _small_subtitle.innerHTML = _company;
    _h5_caption.appendChild(_small_subtitle);

    var _p = document.createElement('p');
    _p.innerHTML= _keywords;
    _div_caption.appendChild(_p);

    var _p_btn = document.createElement('p');
    _div_caption.appendChild(_p_btn);

    var _a = document.createElement('a');
    _a.style="float:right;";
    _a.className = "btn btn-default btn-sm";
    _a.role = "button";

    _a.onclick = function(){
        if(gap==0){
            window.alert("请先估算您的养老缺口");
            switchTag('tag1','content1');this.blur();

            $('#product_name').html(_product_name);
            return;
        }

        setGapParameters();
        window.location.href = 'premium_calculation.htm?product_name='+_product_name+'&img='+_img.src+'&birthday='+$("#birthday").val()+'&lifespan='+expectedLifeSpan+'&gap='+gap+'&expectedExpense='+income*retireLifeLevel+'&pension='+retirement_pension+'&gender=1&coverage=1&period=10';        
    }

    //onProductPremium(+_product_name+","+_img.src+")";
    _a.innerHTML = "保费测算";
    _p_btn.appendChild(_a);

    var _span = document.createElement('span');
    _span.className="glyphicon glyphicon-chevron-right";
    _a.appendChild(_span);
}

function setGapParameters(){
    setCookie("age", age);
    setCookie("income", income);
    setCookie("retireLifeLevel", retireLifeLevel);

    setCookie("has_ss", has_ss);
    setCookie("averageSalary", averageSalary);
    setCookie("ssPaymentBase", ssPaymentBase);
    setCookie("ssPaymentYear", ssPaymentYear);
    setCookie("retirement_pension", retirement_pension);

    setCookie("familySameGenderLife", familySameGenderLife);
    setCookie("expectedLifeSpan", expectedLifeSpan);
    setCookie("gap", gap);
}

function next()
{
    if($('#bar_value').html()==""){
        window.alert("请先设置年龄以估算您的养老缺口");
    }
    else if($('#product_name').html()=="未选择产品"){
        window.alert("请先选择产品");
    }
    else{
        var _product_name = $('#product_name').html();

        window.location.href = 'premium_calculation.htm?product_name='+_product_name+'&img='+$('#'+_product_name+'img')[0].src+'&birthday='+$("#birthday").val()+'&lifespan='+expectedLifeSpan+'&gap='+gap+'&expectedExpense='+income*retireLifeLevel+'&pension='+retirement_pension+'&gender=1&coverage=1&period=10';        
    }
}