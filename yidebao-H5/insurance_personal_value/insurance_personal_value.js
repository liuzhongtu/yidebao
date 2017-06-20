

var selected_term_life = new Array();       //  选择的定期寿险数组
var selected_accident_insurance=new Array;  //  选择的意外险
var insurance_scheme = "";                  //  保身价方案

var selfContribute = 240; //  个人对家庭贡献
var finicalResponsibility = 230; //  个人未尽的经济责任
var retiring_age = 65;
var age = 30;

var iTag = 1; //  菜单编号

function updatePersonalValue() {
    $("#bar_value").html((selfContribute + finicalResponsibility) / 2);
}

function updateSelfContribute() {
    //    个人年收入
    var _income = parseInt($("#income").val());
    //    个人收入占家庭收入
    var _income_percent = parseFloat($("#income_percent").val());
    //    个人花销占个人收入
    var _selfSpense_percent = parseFloat($("#selfSpense_percent").val());
    //    年龄计算
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay() + 1;
    var birth = $("#birthday").val();
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
    $("#self_contribute").html(selfContribute + "万元");
    updatePersonalValue();
}

function updateFinacialResponsibility() {
    var _house_loan = parseInt($("#house_loan").val());
    var _car_loan = parseInt($("#car_loan").val());
    var _education_budget = parseInt($("#education_budget").val());
    var _parental_support = parseInt($("#parental_support").val());
    var _spouse_support_pa = parseInt($("#spouse_support_pa").val());
    finicalResponsibility = _house_loan + _car_loan + _education_budget + _parental_support + _spouse_support_pa;
    $('#finicial_responsibility').html(finicalResponsibility + "万元");
    updatePersonalValue();
}

function incomeChange(s) {
    updateSelfContribute();
}

function incomePercentChange(s) {
    if(s>=0.7){

    }

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
            $('#bar_title').text("选择的产品：");
            $("#bar_value").text(insurance_scheme);
            $('#bar_unit').text('');
            $('#bar_next').text('查看投保方案');
            break;
        default: // 身价测算
            $('#bar_title').text("我要保的身价至少是：￥");
            $("#bar_value").text(insurance_scheme);
            $('#bar_unit').text('万元');
            $('#bar_next').text('选择产品');
    }
}

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
    updateTabBar();
}

function next()
{
    if(iTag==1){
        switchTag('tag2','content2');
    }
    else{
        window.location.href="premium_calculation.htm"; 
    }
}

/////////////////////////////////////////////////////////////////////////
///     第二页，即产品列表

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
        var y = xmlDoc.getElementsByTagName("accident_insurance");
          for (i = 0; i <x.length+y.length; i++) {
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

function GetXmlHttpObject() {
    var objXMLHttp = null;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码       
        objXMLHttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    return objXMLHttp;
}

////    将产品加入产品列表
///

function appendProduct(_product_name,_type,_main_risk,_company, _product_img, _keywords,_i){

    var _li = document.createElement('li');
    _li.className = "span4";
    $('#product_list').append(_li);

    var _div = document.createElement('div');
    _div.className="thumbnail tsc_ribbon_wrap edge";
    _li.appendChild(_div);

    var _wrap=document.createElement('div');
    if(_type=="定期寿险")
        _wrap.className="ribbon-wrap right-edge fork lblue";
    else
        _wrap.className="ribbon-wrap right-edge fork lred";

    _div.appendChild(_wrap);
    var _wrap_span=document.createElement('span');
    _wrap_span.innerHTML=_type;
    _wrap.appendChild(_wrap_span);

    var _img = document.createElement('img');
    _img.id = _product_name+'img';
    _img.alt = "300x200" ;
    _img.style="width:100%;"
    _img.src = '../img/personal_value/'+_product_img;
    setCookie(_img.id, _img.src);
    _div.appendChild(_img);

    var _div_caption = document.createElement('div');
    _div_caption.className="caption";
    _div_caption.style="padding-bottom:0px;";    
    _div.appendChild(_div_caption);

    var _h5_caption = document.createElement('h5');
    _h5_caption.innerHTML = _product_name;
    _h5_caption.id="产品列表"+_product_name; //  用"产品列表"+产品名作为id
    if(_main_risk!="")
        _h5_caption.setAttribute('name', _main_risk); //  用主险为作name
   
    _div_caption.appendChild(_h5_caption);

    var _small_subtitle=document.createElement('small');
    _small_subtitle.innerHTML = _company;
    _h5_caption.appendChild(_small_subtitle);

    var _p = document.createElement('p');
    _p.innerHTML= _keywords;
    _div_caption.appendChild(_p);

    var _p_btn = document.createElement('p');
    _p_btn.style="margin-bottom:5px;margin-top:-5px;float:right;background:#fff;";
    _div_caption.appendChild(_p_btn);

/*    var _a = document.createElement('a');
    _a.style="float:right;";
    _a.className = "btn btn-default btn-sm";
    _a.role = "button";
    _a.href = "premium_calculation.htm?product_name="+_product_name+"&img="+_img.src;
    _a.innerHTML = "保费测算";
    _p_btn.appendChild(_a);

    var _span = document.createElement('span');
    _span.className="glyphicon glyphicon-chevron-right";
    _a.appendChild(_span);*/

    var checkbox=document.createElement('input');
    var fn="onModifyScheme('" + _product_name + "', '" + _type+ "');";
    checkbox.onclick = Function(fn);
    checkbox.type = 'checkbox';
    checkbox.id = _product_name+'是否加入方案';
    _p_btn.appendChild(checkbox);

    var label=document.createElement('label');
    label.innerHTML = "加入方案";
    _p_btn.appendChild(label);
}

/*
function appendProduct(_product_name,_type,_main_risk,_company, _product_img, _keywords,_i){

        //  外面三层div包裹
        var product_div = document.createElement('div');    //  最外层
        var container_div = document.createElement('div');  //  container
        var row_div = document.createElement('div');        //  row

        container_div.className = "container";
        row_div.className = "row";

        var t= document.getElementById("product_list") ;//$("#product_list");
        t.appendChild(product_div);
        product_div.appendChild(container_div);
        container_div.appendChild(row_div);

        //  一边，img用两层div包裹
        var img_div1 = document.createElement('div'); 
        var img_div2 = document.createElement('div');
        var img = document.createElement('img');

        img_div1.style.width = "40%";
        img_div1.style.float = "left";
        img_div2.style.padding = "25px 10px 25px 10px";
        img.id=_product_name+'img';
        img.style.padding="5px";
        img.style.margin="0";
        img.style.width="100%";
        img.style.height="120px";
        img.src='../img/'+_product_img;
        setCookie(img.id, img.src);

        img_div1.appendChild(img_div2);
        img_div2.appendChild(img);
        
        //  另一边，信息栏
        var info_div = document.createElement('div');
        var title = document.createElement('h5');

        var sub_title = document.createElement('div');
        var passage=document.createElement('p');

        var btn_p = document.createElement('p');
        var span1 = document.createElement('span');
        var span2 = document.createElement('span');

        var checkbox=document.createElement('input');
        var label=document.createElement('label');

        info_div.style.width="60%";
        info_div.style.float = "left";
        info_div.style.padding="0px 5px 0px 5px";
        title.className="section-heading";
        title.innerHTML=_product_name;
        title.id="产品列表"+_product_name; //  用"产品列表"+产品名作为id
        if(_main_risk!="")
            title.setAttribute('name', _main_risk); //  用主险为作name

        sub_title.className = "sub-title lead3";
        var _subtitle_info = _company;
        if(_main_risk!=""){
            _subtitle_info=_subtitle_info+" · 附加险";
        }
        sub_title.innerHTML = _subtitle_info;

        passage.className = "lead";

        var array = _keywords.split(";");
        if(array.length<=0)
            array = _keywords.split("；");

        var pcontent="";
        for (var i=0 ; i<array.length; i++){
            if(i!=array.length-1)
                pcontent = pcontent+"★"+array[i]+";<br>";
            else
                pcontent = pcontent+"★"+array[i]+"。<br>";
        }
        passage.innerHTML = pcontent;

        btn_p.style.margin = "2px";

        //span1.innerHTML="加入方案";
        span1.style.float="right";
        span2.style.float="right";
        span1.style.marginRight="10px";

        checkbox.type = 'checkbox';
        checkbox.id = _product_name+'是否加入方案';
        checkbox.className="chkbx";

        var fn="onModifyScheme('" + _product_name + "', '" + _type+ "');";
        checkbox.onclick = Function(fn);
        label.innerHTML = "加入方案";
        label.className="chkbx_lbl";
        
        info_div.appendChild(title);
        info_div.appendChild(sub_title);
        info_div.appendChild(passage);
        info_div.appendChild(btn_p);


        span1.appendChild(checkbox);
        span1.appendChild(label);
   
        btn_p.appendChild(span2);        
        btn_p.appendChild(span1);     

        //
        if(_i%2==0){
            product_div.className = "content-section-b";

            row_div.appendChild(img_div1);
            row_div.appendChild(info_div);            
        }
        else{
            product_div.className = "content-section-a";

            row_div.appendChild(info_div);            
            row_div.appendChild(img_div1);            
        }
}
*/
function onModifyScheme(_product_name, _type){
    if(_type=="定期寿险"){
        modifySelectedTermLife(_product_name);        
    }
    else{
        modifySelectedAccidentInsurance(_product_name);
    }

    updateSchemeTitle();

 //   updateProductTitle();

    updateTabBar();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/// 与方案有关

function updateSchemeTitle(){
    //  寿险部分
    insurance_scheme="";
    var n = selected_term_life.length;
    if (n>0) {
        insurance_scheme=selected_term_life[0];
    }

    for (var i = 1; i < n ; i++) {
        insurance_scheme  = insurance_scheme+ "+"+selected_term_life[i];
    };  

    //  意外险部分
    var n = selected_accident_insurance.length;
    if (insurance_scheme=="") {
        if (n>0) {
            insurance_scheme=selected_accident_insurance[0];
            for (var i = 1; i < n ; i++) {
                insurance_scheme  = insurance_scheme+ "+"+selected_accident_insurance[i];
            }
        }
    }
    else{
        for (var i = 0; i < n ; i++) {
            insurance_scheme  = insurance_scheme+ "+"+selected_accident_insurance[i];
        }
    };

    setCookie("products_selected", insurance_scheme);

//    $("#products_selected").innerHTML=insurance_scheme;       
}

//  用户将寿险从选择列表中加或减
function modifySelectedTermLife(_product_name)
{
    var bFound=false;

    //  在定期寿险中查找
    for(i=0; i < selected_term_life.length; i++){
        if(selected_term_life[i]==_product_name){
            bFound=true;
            break;
        }
    }

    if (bFound) {
        selected_term_life.splice(i,1);
//        RemoveTermLife(_product_name);
    }
    else{
        selected_term_life.push(_product_name);
//        AddTermLife(_product_name);
        AddTermLifeParametersToCookie(_product_name);        
    }
}

//  用户将意外险从选择列表中加或减
function modifySelectedAccidentInsurance(_product_name){
    var bFound=false;   //  是否已经在选择列表中
    for(i=0; i < selected_accident_insurance.length; i++){
        if(selected_accident_insurance[i]==_product_name){
            bFound=true;
            break;
        }
    }

    if (bFound) {   //  如果在，则进行删除操作
        //  如果是主险，而且也选择了相应的附加险，提示主险与险加险将一起被删除
        var _additional_risk = getAdditionalInsurance(_product_name);
        if(_additional_risk !=""){
            //  检查附险是否已选中
            var bAdditionalRiskFound = false;
            for (var j = selected_accident_insurance.length - 1; j >= 0; j--) {
                if(selected_accident_insurance[j]==_additional_risk){
                    bAdditionalRiskFound=true;
                    break;
                }
            };

            if(bAdditionalRiskFound){
                document.getElementById('checkMainInsurance').click();
                var check_ele = document.getElementById(_additional_risk+'是否加入方案');
                check_ele.checked=false;

                if(j>i){
                    selected_accident_insurance.splice(j,1);
                }
                else{
                    selected_accident_insurance.splice(j,1);
                    i=i-1;
                }

  //              RemoveAccidentInsurance(_additional_risk);                
            }
        }
          
        selected_accident_insurance.splice(i,1);
  //      RemoveAccidentInsurance(_product_name);
    }
    else{           //  如果不在，则进行添加操作

        //  如果是附加险，先确认是否已经加入主险，否则提示先加入主险
        var _main_risk = getMainInsurance(_product_name);
        if(_main_risk!=""&&_main_risk!=undefined)   //  如果本险的主险存在
        {
            //  检查主险是否已选中
            var bMainRiskFound=false;
            for (var i = selected_accident_insurance.length - 1; i >= 0; i--) {
                if(selected_accident_insurance[i]==_main_risk){
                    bMainRiskFound=true;
                    break;
                }
            };

            if(bMainRiskFound==false)
            {
                document.getElementById('checkAdditionalInsurance').click();
                var check_ele = document.getElementById(_product_name+'是否加入方案');
                check_ele.checked=false;
                return;
            }
        }
       
        selected_accident_insurance.push(_product_name);
        AddAccidentInsuranceParametersToCookie(_product_name);
    }
}


//  获得给定险种的主险
function getMainInsurance(_product_name){
    var ele = document.getElementById("产品列表"+_product_name);
    if (ele)    {
        return ele.getAttribute('name');        
    } 
    else
        return "";
}

//  获得给定险种的附加险
function getAdditionalInsurance(_product_name){
    var ele_arr = document.getElementsByName(_product_name);
    if(ele_arr.length==0)   {
        return "";
    }
    else {
        var id_str = ele_arr[0].id;
        return id_str.replace('产品列表', '');
    }
}


////////////////////////////////////////////////////////////////////////////////
function AddTermLifeParametersToCookie(_product_name){
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }
    var url = "term_life_parameters.php";
    url = url + "?product_name=" + _product_name;
    xmlHttp.onreadystatechange = function() {
//    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

            xmlDoc = xmlHttp.responseXML;

            if(xmlDoc.getElementsByTagName("product_name")[0].childNodes[0] == undefined)return;

            var _product_name = xmlDoc.getElementsByTagName("product_name")[0].childNodes[0].nodeValue;
            var _company = xmlDoc.getElementsByTagName("company")[0].childNodes[0].nodeValue;
            var _coverage_range = xmlDoc.getElementsByTagName("coverage_range")[0].childNodes[0].nodeValue;
            var _insurance_period= xmlDoc.getElementsByTagName("insurance_period")[0].childNodes[0].nodeValue;
            var _payment_period=xmlDoc.getElementsByTagName("payment_period")[0].childNodes[0].nodeValue;

            setCookie(_product_name+'type', 'term_life');
            setCookie(_product_name+'company', _company);
            setCookie(_product_name+'coverage_range', _coverage_range);
            setCookie(_product_name+'insurance_period', _insurance_period);
            setCookie(_product_name+'payment_period', _payment_period);            
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function AddAccidentInsuranceParametersToCookie(_product_name){
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }
    var url = "accident_insurance_parameters.php";
    url = url + "?product_name=" + _product_name;
    xmlHttp.onreadystatechange = function() {
//    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

            xmlDoc = xmlHttp.responseXML;

            if(xmlDoc.getElementsByTagName("product_name")[0].childNodes[0] == undefined)return;

            var _product_name = xmlDoc.getElementsByTagName("product_name")[0].childNodes[0].nodeValue;
            var _company = xmlDoc.getElementsByTagName("company")[0].childNodes[0].nodeValue;            
            var _coverage_range = xmlDoc.getElementsByTagName("coverage_range")[0].childNodes[0].nodeValue;
            var _insurance_period= xmlDoc.getElementsByTagName("insurance_period")[0].childNodes[0].nodeValue;
            var _payment_period=xmlDoc.getElementsByTagName("payment_period")[0].childNodes[0].nodeValue;

            setCookie(_product_name+'type', 'accident_insurance');
            setCookie(_product_name+'company', _company);            
            setCookie(_product_name+'coverage_range', _coverage_range);
            setCookie(_product_name+'insurance_period', _insurance_period);
            setCookie(_product_name+'payment_period', _payment_period);            
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

