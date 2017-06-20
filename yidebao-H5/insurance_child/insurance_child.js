/* 
* @Author: anchen
* @Date:   2017-03-11 19:39:30
* @Last Modified by:   liu zhongtu
* @Last Modified time: 2017-05-30 11:45:26
*/

var age;                    //   当前年龄
var gender=1;
var iTag = 1;
var insurance_disease_coverage;
var insurance_education_coverage;

function switchTag(tag, content, instruction) {
    for (i = 1; i <= 4; i++) {
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

        if ("instruction" + i == instruction) {
            document.getElementById(instruction).className = "";
        } else {
            document.getElementById("instruction" + i).className = "hidecontent";
        }

    }
}

function load() {
    loadChildInsuranceDisease();
}


function GetXmlHttpObject() {
    var objXMLHttp = null;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码       
        objXMLHttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    return objXMLHttp;
}


function loadChildInsuranceDisease(){
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }          
    var url = "child_insurance_disease_product_list.php";
    url = url + "?q=" + Math.random();
    xmlHttp.onreadystatechange = stateChanged_disease;
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
    iCurProductList = 0;
}

function loadChildInsuranceHealth(){
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }          
    var url = "child_insurance_health_product_list.php";
    url = url + "?q=" + Math.random();
    xmlHttp.onreadystatechange = stateChanged_health;
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
    iCurProductList = 0;
}

function loadChildInsuranceEducation(){
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }
    var url = "child_insurance_education_product_list.php";
    url = url + "?q=" + Math.random();
    xmlHttp.onreadystatechange = stateChanged_education;
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
    iCurProductList = 1;
}

function loadChildInsuranceCashFlow(){
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }
    var url = "child_insurance_cashflow_product_list.php";
    url = url + "?q=" + Math.random();
    xmlHttp.onreadystatechange = stateChanged_cashFlow;
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);    
    iCurProductList = 2;
}

function stateChanged_disease() {
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        xmlDoc = xmlHttp.responseXML;
        
        // 更新产品列表
        // 
        var x = xmlDoc.getElementsByTagName("insurance_child_disease");
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
        loadChildInsuranceHealth();
    }
}

function stateChanged_health(){
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        xmlDoc = xmlHttp.responseXML;
        
        // 更新产品列表
        // 
        var x = xmlDoc.getElementsByTagName("insurance_child_health");
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
        loadChildInsuranceEducation();
    }    
}

function stateChanged_education(){
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        xmlDoc = xmlHttp.responseXML;
        
        // 更新产品列表
        // 
        var x = xmlDoc.getElementsByTagName("insurance_child_education");
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
        loadChildInsuranceCashFlow();
    }
}

function stateChanged_cashFlow(){
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        xmlDoc = xmlHttp.responseXML;
        
        // 更新产品列表
        // 
        var x = xmlDoc.getElementsByTagName("insurance_child_cashflow");
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

function appendProduct(_product_name,_type,_main_risk,_company, _product_img, _keywords,_i){

    var _li = document.createElement('li');
    _li.className = "span12";

    var _div = document.createElement('div');
    _div.className="thumbnail";
    _li.appendChild(_div);

    var _img = document.createElement('img');
    _img.id = _product_name+'img';
    _img.alt = "300x200" ;
    _img.style="width:100%;"
    _img.src = '../img/insurance_child/'+_product_img;
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
    _a.innerHTML = "保费测算";

    var _span = document.createElement('span');
    _span.className="glyphicon glyphicon-chevron-right";
    _a.appendChild(_span);

     if(_type=="少儿重疾险"){
        _a.href = "premium_calculation_insurance_disease.htm?product_name="+_product_name+"&img="+_img.src;
        _p_btn.appendChild(_a);

        $('#insurance_disease_product_list').append(_li);        
        $('#current_disease_insurance_products')[0].add(new Option(_product_name,_product_name));
    }
    else if(_type=="少儿医疗险")
    {
        _a.href = "premium_calculation_insurance_health.htm?product_name="+_product_name+"&img="+_img.src;
        _p_btn.appendChild(_a);

        $('#insurance_health_product_list').append(_li);        
  //      $('#current_disease_insurance_products')[0].add(new Option(_product_name,_product_name));
    }
    else if(_type=="少儿教育创业险"){
        _a.href = "premium_calculation_insurance_education.htm?product_name="+_product_name+"&img="+_img.src;
        _p_btn.appendChild(_a);

        $('#insurance_education_product_list').append(_li);

        var sel = $('#current_education_insurance_products')[0];
        sel.add(new Option(_product_name,_product_name));
    } 
    else if(_type=="少儿年金险"){
        _a.href = "premium_calculation_insurance_cashflow.htm?product_name="+_product_name+"&img="+_img.src;
        _p_btn.appendChild(_a);

        $('#insurance_cashflow_product_list').append(_li);
        $('#current_cashflow_insurance_products')[0].add(new Option(_product_name,_product_name));
    }    

}


///////////////////////////////////////////////////////////////////////
//  交互

function dateChange()
{
    switch(iTag)
    {
        case 1:
            set_insurance_disease_instruction();
            break;
        case 2:
            break;
        case 3:
            set_insurance_education_instruction();
            break;
        case 4:
            set_insurance_cashflow_instruction();
            break;
    }
}

function retrieve_age_and_gender()
{
    var birth = $("#birthday").val();

    age = getAge(birth);
    if(age<0 ||age>20)return;


    //    性别
    var arr = document.getElementsByName("gender");
    gender = arr[0].checked ? 1 : 0;    
}

function set_insurance_disease_instruction()
{
    retrieve_age_and_gender();

    insurance_disease_coverage = $('#insurance_disease_coverage').val();
    var product_name= $('#current_disease_insurance_products').val();

    //    连接字符串
    var strParas = "product_name=" + encodeURI(product_name) + "&age=" + age + "&period=" + 20 + "&gender=" + gender;
    var strCmd = "instruction_insurance_disease.php?" + strParas;
    //alert(strCmd);    
    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // alert(xmlhttp.responseText);

            premium = parseInt(insurance_disease_coverage)*parseInt(xmlhttp.responseText)/10.0;
            $("#disease_premium").html(premium);
            $('#total_coverage').html(parseInt($('#insurance_disease_coverage').val())+10);
        }
    }
    xmlhttp.open("GET", strCmd, true);
    xmlhttp.send();
}

function set_insurance_education_instruction()
{
    retrieve_age_and_gender();

    var product_name= $('#current_education_insurance_products').val();

    //    连接字符串
    var strParas = "product_name=" + encodeURI(product_name) + "&age=" + age + "&period=" + 10 + "&gender=" + gender;
    var strCmd = "instruction_insurance_education.php?" + strParas;

    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var paras = xmlhttp.responseText;
            if (paras == "") return;
            var paras_arr = paras.split("#");

            var  r = 0.045;     //  利率

            var future_demand = parseInt($('#education_budget').val())+parseInt($('#venture_budget').val());

            var _premium_coef = parseFloat(paras_arr[0])/100000;    //  保费相保额的系数，元对元
            var _t = parseFloat(paras_arr[1].replace("保额", ""));
            var _period = 10;       //  少儿年金产品均以10年缴费期

            var left_coef = _t*(Math.pow(1+r, 21)-1)/r+_premium_coef*10;
            var _Coverage = Math.ceil(100*future_demand/left_coef)/100;

            var _premium = 10000*_premium_coef*_Coverage;

            $('#education_coverage').html(_Coverage);
            $('#education_premium').html(parseInt(_premium));
        }
    }
    xmlhttp.open("GET", strCmd, true);
    xmlhttp.send();
}

function money_at100(_r, _t1, _t2, _coverage, _premium, _age)
{
    var part1 = _t1*_coverage*(Math.pow(1+_r, 60-age)-1)/_r*Math.pow(1+_r,40);
    var part2 = _t2*_coverage*(Math.pow(1+_r, 20)-1)/_r*Math.pow(1+_r, 20);
    var part3 = 10*_premium*Math.pow(1+_r, 20);

    return part1+part2+part3;
}

function set_insurance_cashflow_instruction()
{
    retrieve_age_and_gender();

    var product_name= $('#current_cashflow_insurance_products').val();

    //    连接字符串
    var strParas = "product_name=" + encodeURI(product_name) + "&age=" + age + "&period=" + 10 + "&gender=" + gender;
    var strCmd = "instruction_insurance_cashflow.php?" + strParas;

    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var paras = xmlhttp.responseText;
            if (paras == "") return;
            var paras_arr = paras.split("#");

            var  r = 0.045;     //  利率

            var _premium_coef = parseFloat(paras_arr[0])/100000;    //  保费相保额的系数，元对元
            var _coverage = $('#cashflow_premium').val()/_premium_coef;        //  保额，单位：万元

            var _t1 = parseFloat(paras_arr[1].replace("保额", ""));   //  60岁前
            var _t2 = parseFloat(paras_arr[2].replace("保额", ""));   //  60岁后

            var _period = 10;       //  少儿年金产品均以10年缴费期

            // 第一部分
            $('#cashflow_everyyear_receiption').html(parseInt(_coverage*10000*_t1));
            $('#cashflow_after60_receiption').html(parseInt(_coverage*10000*_t2));

            //  第二部分
            //  1.读大学每年领，共四年 
            var T = _t1*_coverage*10000;    //  单位：元
            var reception_at20_everyyear = (0.1*(Math.pow(1+r, 20-age)-1)/r+1)*T;
            $('#cashflow_education_receiption').html(parseInt(reception_at20_everyyear));

            //  2.结婚和创业
            var reception_4venture = ((Math.pow(1+r, 20-age)-1)/r*0.6*Math.pow(1+r, 9)+(Math.pow(1+r, 5)-1)/r)*T;
           $('#cashflow_venture_receiption').html(parseInt(reception_4venture));

           //   3.退休60-80岁
           var A = T*(Math.pow(1+r, 60-27-age)-1)/r*Math.pow(1+r, 20);
           var B = (Math.pow(1+r, 20)-1)/r*(1+r);
           var reception_4retirement_everyyear=A/B+_t2*_coverage;
           $('#cashflow_retirement_receiption').html(parseInt(reception_4retirement_everyyear));
           $('#cashflow_80_receiption').html(parseInt(10*$('#cashflow_premium').val()*10000));

           //   4.一直不领，直到100岁领
           var min_at100 = money_at100(0.03,_t1,_t2,_coverage*10000,$('#cashflow_premium').val()*10000, age);
           var mid_at100 = money_at100(0.045,_t1,_t2,_coverage*10000,$('#cashflow_premium').val()*10000,age);
           var max_at100 = money_at100(0.06,_t1,_t2,_coverage*10000,$('#cashflow_premium').val()*10000, age);
           $('#cashflow_100_min').html(parseInt(min_at100));
           $('#cashflow_100_mid').html(parseInt(mid_at100));
           $('#cashflow_100_max').html(parseInt(max_at100));
        }
    }
    xmlhttp.open("GET", strCmd, true);
    xmlhttp.send();    
}
