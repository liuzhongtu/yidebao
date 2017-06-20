//////////////////////////////////////////////////////////////////////
///     保费测算


var age = -1;
var gender = -1;


function load(){
    var _products_selected = getCookie("products_selected");
    $('#products_selected').html(_products_selected);
    document.title=_products_selected;  

    var h=[];    //定义一个hash表  
    var _company_list = new Array;  //  公司列表

    //  从Cookie中读入选择的产品信息
    var products = _products_selected.split('+');
    for (var i = 0; i < products.length; i++) {
        if(products[i] == "")continue;

        var _company = getCookie(products[i]+'company');
          if(!h[_company]){ 
            //存入hash表  
            h[_company] = true;  
            //把当前数组元素存入到临时数组中  
            _company_list.push(_company);              
          }

        //  
        if(getCookie(products[i]+'type')=='term_life')
            AddTermLife(products[i]);
        else if(getCookie(products[i]+'type')=='accident_insurance')
            AddAccidentInsurance(products[i]);
    };

    //  设置公司简介
   if(_company_list.length==1)     //  如果只有一个产品
        InitCompanyUrlFromDB(_company_list[0]);
    else{
        InitCompanyUrlsFromDB(_company_list,0);
    }

    initAgeAndGender();
}

function initAgeAndGender(){
    //   初始化年龄和性别控件
    var genders = [
        {'id': '10001', 'value': '男'},
        {'id': '10002', 'value': '女'}
    ];
    var ages = [
        {'id': '20001', 'value': '20'},
        {'id': '20002', 'value': '21'},
        {'id': '20003', 'value': '22'},
        {'id': '20004', 'value': '23'},
        {'id': '20005', 'value': '24'},
        {'id': '20006', 'value': '25'},
        {'id': '20007', 'value': '26'},
        {'id': '20008', 'value': '27'},
        {'id': '20009', 'value': '28'},
        {'id': '20010', 'value': '29'},
        {'id': '20011', 'value': '30'},
        {'id': '20012', 'value': '31'},
        {'id': '20013', 'value': '32'},
        {'id': '20014', 'value': '33'},
        {'id': '20015', 'value': '34'},
        {'id': '20016', 'value': '35'},
        {'id': '20017', 'value': '36'},
        {'id': '20018', 'value': '37'},
        {'id': '20019', 'value': '38'},
        {'id': '20020', 'value': '39'},
        {'id': '20021', 'value': '40'},
        {'id': '20022', 'value': '41'},
        {'id': '20023', 'value': '42'},
        {'id': '20024', 'value': '43'},
        {'id': '20025', 'value': '44'},
        {'id': '20026', 'value': '45'},
        {'id': '20027', 'value': '46'},
        {'id': '20028', 'value': '47'},
        {'id': '20029', 'value': '48'},
        {'id': '20030', 'value': '49'},
        {'id': '20031', 'value': '50'},
        {'id': '20032', 'value': '51'},
        {'id': '20033', 'value': '52'},
        {'id': '20034', 'value': '53'},
        {'id': '20035', 'value': '54'},
        {'id': '20036', 'value': '55'},
        {'id': '20037', 'value': '56'},
        {'id': '20038', 'value': '57'},
        {'id': '20039', 'value': '58'},
        {'id': '20040', 'value': '59'},
        {'id': '20041', 'value': '60'}
    ];

    var showGeneralDom = document.querySelector('#showGeneral');
    var suIdDom = document.querySelector('#suId');
    var weiIdDom = document.querySelector('#weiId');
    showGeneralDom.addEventListener('click', function () {
        var suId = showGeneralDom.dataset['su_id'];
        var suValue = showGeneralDom.dataset['su_value'];
        var weiId = showGeneralDom.dataset['wei_id'];
        var weiValue = showGeneralDom.dataset['wei_value'];
        var sanguoSelect = new IosSelect(2, 
            [genders, ages],
            {
                title: '性别和年龄选择',
                itemHeight: 35,
                oneLevelId: suId,
                twoLevelId: weiId,
                callback: function (selectOneObj, selectTwoObj) {
                    suIdDom.value = selectOneObj.id;
                    weiIdDom.value = selectTwoObj.id;
                    showGeneralDom.value = selectOneObj.value + ' - ' + selectTwoObj.value+'岁';

                    showGeneralDom.dataset['su_id'] = selectOneObj.id;
                    showGeneralDom.dataset['su_value'] = selectOneObj.value;
                    showGeneralDom.dataset['wei_id'] = selectTwoObj.id;
                    showGeneralDom.dataset['wei_value'] = selectTwoObj.value;

                    if(selectOneObj.value=='男')
                        gender=1;
                    else
                        gender=0;

                    age=parseInt(selectTwoObj.value);
                    refreshAllPremiums();
                }
        });
    });
}

function InitCompanyUrlFromDB(company_name){
    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var company_url_mid = xmlhttp.responseText;
            company_local_url = "../companies/"+company_url_mid+"/intro.html";            

            var _a_company = document.getElementById("company_brief");
            _a_company.setAttribute("data-target", "");
            _a_company.setAttribute("data-toggle", "");            
            _a_company.setAttribute("href", company_local_url);            
        }
    }
    var url = "insurance_personal_value_company.php";
    url = url + "?company_name=" + company_name;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);    
}

function InitCompanyUrlsFromDB(companies, i){

    if(i>=companies.length || companies[i]=="")
        return;

    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var company_url_mid = xmlhttp.responseText;
            company_local_url = "../companies/"+company_url_mid+"/intro.html";
   
            var _p = document.createElement('p'); 
            var _a = document.createElement('a'); 
            _a.style="width:80%;"
            _a.className="btn btn-warning";
            _a.href=company_local_url;
            _a.innerHTML="查看"+companies[i]+"公司介绍";

            $("#companies_container").append(_p); 
            _p.appendChild(_a);

            InitCompanyUrlsFromDB(companies, i+1);           
        }
    }
    var url = "insurance_personal_value_company.php";
    url = url + "?company_name=" + companies[i];
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function updateProductTitle(){
    //  寿险部分
    var n = selected_term_life.length;
    for (var i = 0; i < n ; i++) {
        var product_title="产品"+(i+1)+":"+selected_term_life[i]+"(定期寿险)";
        var h = document.getElementById(selected_term_life[i]+"header");

        h.innerHTML=product_title;
    }; 

    //  意外部分
    var m = selected_accident_insurance.length;
    for (var i = 0; i < m ; i++) {
        var product_title="产品"+(i+1+n)+":"+selected_accident_insurance[i]+"(意外险)";
        var h = document.getElementById(selected_accident_insurance[i]+"header");

        h.innerHTML=product_title;
    }; 
}

function AddTermLife(_product_name){  
    var div_product = document.createElement('div'); 
    div_product.id=_product_name;
    div_product.className="panel panel-default";
    div_product.style="width:90%; margin:auto auto;"

    document.getElementById("scheme").appendChild(div_product);    

    //  标题 
    var div_heading = document.createElement('div'); 
    div_heading.className="panel-heading"; 
    div_heading.style="margin-top:0px;"
    var h5=document.createElement('h5');
    h5.className="panel-title";
    h5.id=_product_name+"header";
    h5.innerHTML=_product_name;
    var sub_title = document.createElement('small');
    sub_title.innerHTML='(定期寿险)';
    h5.appendChild(sub_title);

    div_product.appendChild(div_heading);
    div_heading.appendChild(h5);
          
    //  panel-body
    var div_panel_body = document.createElement('div'); 
    div_panel_body.className="panel-body";
    div_panel_body.style="padding-bottom:0px;margin-bottom:15px;"
    div_product.appendChild(div_panel_body);

    // img
    var img_div = document.createElement('div');
    img_div.align="center";

    var img_src = getCookie(_product_name+'img');
    var product_img = document.createElement('img');
    product_img.src = img_src;
    product_img.style="width:80%;margin-bottom:15px;";

    div_panel_body.appendChild(img_div);
    img_div.appendChild(product_img);    

    //  table
    var tbl_content = document.createElement('table');
    var tbl_body=document.createElement('tbody');
    tbl_content.className="tbl";
    div_panel_body.appendChild(tbl_content);
    tbl_content.appendChild(tbl_body);
    
    //  第一行
    var row1=document.createElement("tr"); //创建行 
    var td11=document.createElement("td"); //创建单元格
    var td12=document.createElement("td"); //创建单元格
    tbl_body.appendChild(row1);
    row1.appendChild(td11);
    row1.appendChild(td12);

    td11.className="text-left tbl_noline";
    td11.innerHTML="<b>保障额度：</b>";
    td12.className="text-left tbl_noline";

    var td_sel1 =  document.createElement("select");
    td_sel1.className="form-control";
    td_sel1.size = 1;
    td_sel1.id=_product_name+"保障额度";
    var fn="refreshPremium('"+_product_name+"');";
    td_sel1.onchange=Function(fn);
    td12.appendChild(td_sel1);

        //  第一行数据
        var _coverage_range = getCookie(_product_name+'coverage_range');
        if(_coverage_range!=null && _coverage_range!=''){
            var coverage_array= new Array(); //定义一数组
            coverage_array = _coverage_range.split(';');

            for (var i=0 ; i<coverage_array.length; i++){
                var option = new Option(coverage_array[i]+"万元", coverage_array[i]); 
                td_sel1.options.add(option);
            }

            td_sel1.options[0].selected = true;

        //    var _coverage = $("#"+_product_name+"保障额度").val();
        }

    //  第二行
    var row2=document.createElement("tr"); //创建行 
    var td21=document.createElement("td"); //创建单元格
    var td22=document.createElement("td"); //创建单元格
    tbl_body.appendChild(row2);
    row2.appendChild(td21);
    row2.appendChild(td22);

    td21.className="text-left tbl_noline";
    td21.innerHTML="<b>缴费年限：</b>";
    td22.className="text-left tbl_noline";

    var td_sel2 =  document.createElement("select");
    td_sel2.className="form-control";
    td_sel2.size = 1;
    td_sel2.id=_product_name+"缴费年限";
    var fn="refreshPremium('"+_product_name+"');";
    td_sel2.onchange=Function(fn);
    td22.appendChild(td_sel2);

        //  第二行
        var _payment_period = getCookie(_product_name+'payment_period');
        if(_payment_period!="" && _payment_period){
            var payment_period_array= new Array(); //定义一数组
            payment_period_array = _payment_period.split(';');

            for (var i=0 ; i<payment_period_array.length; i++){
                var option = new Option(payment_period_array[i]+"年", payment_period_array[i]); 
                td_sel2.options.add(option);
            }

            td_sel2.options[0].selected = true;
        }
        
    
    //  第三行
    var row3=document.createElement("tr"); //创建行 
    var td31=document.createElement("td"); //创建单元格
    var td32=document.createElement("td"); //创建单元格
    tbl_body.appendChild(row3);
    row3.appendChild(td31);
    row3.appendChild(td32);

    td31.className="text-left tbl_noline";
    td31.innerHTML="<b>保障期限:</b>";
    td32.className="text-left tbl_noline";

    var td_sel3 =  document.createElement("select");
    td_sel3.className="form-control";
    td_sel3.size = 1;
    td_sel3.id=_product_name+"保障期限";
    var fn="refreshPremium('"+_product_name+"');";
    td_sel3.onchange=Function(fn);
    td32.appendChild(td_sel3);

        //  第3行
        var _insurance_period = getCookie(_product_name+'insurance_period');
        if(_insurance_period !='' && _insurance_period){
            var insurance_period_array= new Array(); //定义一数组
            insurance_period_array = _insurance_period.split(';');

            for (var i = 0; i< insurance_period_array.length; i++) {
                _period = insurance_period_array[i];
                var _period_arr = _period.split('~');
                if (_period_arr.length==2) {
                    var option = new Option("到"+_period_arr[1]+"岁", _period); 
                    td_sel3.options.add(option);                    
                }
                else {
                    var option;
                    var n= parseInt(_period);
                    if(n==999){
                        option = new Option("保终身", _period);
                    }
                    else{
                        option = new Option(_period+"年", _period);
                    }
                    td_sel3.options.add(option);                                        
                }
            };

            td_sel3.options[0].selected = true;
        }
            
    //  保费
    var div_premium = document.createElement('div'); 
    div_premium.style.float="right";
    div_premium.style.marginTop="20px";
    div_premium.style.marginRight="20px";
    div_premium.className="form-group";

    var label_premium = document.createElement('label'); 
    label_premium.className="control-label";
    label_premium.innerHTML="年缴保险费：";

    var text_premium = document.createElement('text');
    text_premium.id= _product_name+"保费";
    text_premium.innerHTML="      元";

    div_panel_body.appendChild(div_premium);
    div_premium.appendChild(label_premium);
    div_premium.appendChild(text_premium);
}

function AddAccidentInsurance(_product_name){
    var div_product = document.createElement('div'); 
    div_product.id=_product_name;
    div_product.className="panel panel-default";
    div_product.style="width:90%; margin:auto auto;"

    document.getElementById("scheme").appendChild(div_product);    

    //  标题 
    var div_heading = document.createElement('div'); 
    div_heading.className="panel-heading"; 
    div_heading.style="margin-top:0px;"
    var h5=document.createElement('h5');
    h5.className="panel-title";
    h5.id=_product_name+"header";
    h5.innerHTML=_product_name;
    var sub_title = document.createElement('small');
    sub_title.innerHTML='(意外险)';
    h5.appendChild(sub_title);
    div_product.appendChild(div_heading);
    div_heading.appendChild(h5);
          
    //  panel-body
    var div_panel_body = document.createElement('div'); 
    div_panel_body.className="panel-body";
    div_panel_body.style="padding-bottom:0px;margin-bottom:15px;"
    div_product.appendChild(div_panel_body);

    // img
    var img_div = document.createElement('div');
    img_div.align="center";

    var img_src = getCookie(_product_name+'img');
    var product_img = document.createElement('img');
    product_img.src = img_src;
    product_img.style="width:80%;margin-bottom:15px;";

    div_panel_body.appendChild(img_div);
    img_div.appendChild(product_img);    

    //  table
    var tbl_content = document.createElement('table');
    var tbl_body=document.createElement('tbody');
    tbl_content.className="tbl";
    div_panel_body.appendChild(tbl_content);
    tbl_content.appendChild(tbl_body);
    
    //  第一行
    var row1=document.createElement("tr"); //创建行 
    var td11=document.createElement("td"); //创建单元格
    var td12=document.createElement("td"); //创建单元格
    tbl_body.appendChild(row1);
    row1.appendChild(td11);
    row1.appendChild(td12);

    td11.className="text-left tbl_noline";
    td11.innerHTML="<b>保障额度：</b>";
    td12.className="text-left tbl_noline";

    var td_sel1 =  document.createElement("select");
    td_sel1.className="form-control";
    td_sel1.size = 1;
    td_sel1.id=_product_name+"保障额度";
    var fn="refreshPremium('"+_product_name+"');";
    td_sel1.onchange=Function(fn);
    td12.appendChild(td_sel1);

        //  第一行参数
        var _coverage_range = getCookie(_product_name+'coverage_range');
        if(_coverage_range && _coverage_range !=""){
            var coverage_array= new Array(); //定义一数组
            coverage_array = _coverage_range.split(';');

            for (var i=0 ; i<coverage_array.length; i++){
                var option = new Option(coverage_array[i]+"万元", coverage_array[i]); 
                td_sel1.options.add(option);
            }

            td_sel1.options[0].selected=true;
        }

    //  第二行
    var row2=document.createElement("tr"); //创建行 
    var td21=document.createElement("td"); //创建单元格
    var td22=document.createElement("td"); //创建单元格
    tbl_body.appendChild(row2);
    row2.appendChild(td21);
    row2.appendChild(td22);

    td21.className="text-left tbl_noline";
    td21.innerHTML="<b>缴费年限：</b>";
    td22.className="text-left tbl_noline";

    var td_sel2 =  document.createElement("select");
    td_sel2.className="form-control";
    td_sel2.size = 1;
    td_sel2.id=_product_name+"缴费年限";
    var fn="refreshPremium('"+_product_name+"');";
    td_sel2.onchange=Function(fn);
    td22.appendChild(td_sel2);

        //  第二行参数
        var _payment_period=getCookie(_product_name+"payment_period");
        if(_payment_period && _payment_period !="") {
            var payment_period_array= new Array(); //定义一数组
            payment_period_array = _payment_period.split(';');

            for (var i=0 ; i<payment_period_array.length; i++){
                var option = new Option(payment_period_array[i]+"年", payment_period_array[i]); 
                td_sel2.options.add(option);
            }
            td_sel2.options[0].selected=true;
        }
    
    //  第三行
    var row3=document.createElement("tr"); //创建行 
    var td31=document.createElement("td"); //创建单元格
    var td32=document.createElement("td"); //创建单元格
    tbl_body.appendChild(row3);
    row3.appendChild(td31);
    row3.appendChild(td32);

    td31.className="text-left tbl_noline";
    td31.innerHTML="<b>保障期限:</b>";
    td32.className="text-left tbl_noline";

    var td_sel3 =  document.createElement("select");
    td_sel3.className="form-control";
    td_sel3.size = 1;
    td_sel3.id=_product_name+"保障期限";
    var fn="refreshPremium('"+_product_name+"');";
    td_sel3.onchange=Function(fn);
    td32.appendChild(td_sel3);

        //  第三行参数
        var _insurance_period=getCookie(_product_name+"insurance_period");
        if(_insurance_period && _insurance_period !=''){
            var insurance_period_array= new Array(); //定义一数组
            insurance_period_array = _insurance_period.split(';');

            for (var i = 0; i< insurance_period_array.length; i++) {
                _period = insurance_period_array[i];
                var _period_arr = _period.split('~');
                if (_period_arr.length==2) {
                    var option = new Option("到"+_period_arr[1]+"岁", _period); 
                    td_sel3.options.add(option);                    
                }
                else {
                    var option;
                    var n= parseInt(_period);
                    if(n==999){
                        option = new Option("保终身", _period);
                    }
                    else{
                        option = new Option(_period+"年", _period);
                    }
                    td_sel3.options.add(option);                    
                }
            };

            td_sel3.options[0].selected=true;
        }

    //  保费
    var div_premium = document.createElement('div'); 
    div_premium.style.float="right";
    div_premium.style.marginTop="20px";
    div_premium.style.marginRight="20px";
    div_premium.className="form-group";

    var label_premium = document.createElement('label'); 
    label_premium.style="margin-bottom:5px;padding-bottom:0px;"
    label_premium.className="control-label";
    label_premium.innerHTML="年缴保险费：";

    var text_premium = document.createElement('text');
    text_premium.id= _product_name+"保费";
    text_premium.innerHTML="      元";

    div_panel_body.appendChild(div_premium);
    div_premium.appendChild(label_premium);
    div_premium.appendChild(text_premium);
}

////////////////////////////////////////////////////////////////////////////////

function refreshTotalPremium(){
    var total_price = 0;

    var _products_selected = getCookie("products_selected");
    var _products_arr = _products_selected.split('+');

    for (var i = 0; i< _products_arr.length; i++) {
        var _product_name = _products_arr[i];

        var ele = document.getElementById(_product_name+"保费");
        var price=ele.innerHTML.split("元");
        total_price  = total_price+ parseFloat(price[0]);
    };

    $("#bar_value3").html(total_price);
}

var nPremium, iPremium;
function refreshAllPremiums(){
    var _products_selected = getCookie("products_selected");
    var _products_arr = _products_selected.split('+');

    iPremium=0;
    nPremium=_products_arr.length;

    for (var i = 0; i < nPremium; i++) {
        refreshPremium(_products_arr[i]);
    };

    $('#insurance_detail').show();
}

function refreshPremium(_product_name){
    if(age==-1 || gender==-1){
        alert("请您先设置年龄和性别。");
        return;
    }

    var _coverage = $("#"+_product_name+"保障额度").val();
    var _paymentPeriod = $("#"+_product_name+"缴费年限").val();
    var _insurancePeriod = $("#"+_product_name+"保障期限").val();

    //  如果是定寿，查10万保额
    if(getCookie(_product_name+'type') == 'term_life')
        _coverage=10;

    //    连接字符串
    var strParas = "product_name=" + encodeURI(_product_name) + "&age=" + age + "&period=" + _paymentPeriod + "&gender=" + gender+ "&coverage="+_coverage+"&insurance_period="+_insurancePeriod;
    var strCmd = "premium_rate_db.php?" + strParas;
    //alert(strCmd);    
    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var t = xmlhttp.responseText;
            var premium_arr = t.split(";");
            var premium1 = parseFloat(premium_arr[0]);
            var premium2 = parseFloat(premium_arr[1]);

            if(getCookie(_product_name+'type') == 'term_life')
            {
                var _coverage = $("#"+_product_name+"保障额度").val();
                premium1 = premium1*_coverage/10;
            }

            var premium_ele = document.getElementById(_product_name+"保费");
            if(premium_ele){
                premium_ele.innerHTML = premium1+"元";
                premium_ele.name=premium2;

                refreshTotalPremium();

                iPremium=iPremium+1;
                if(iPremium==nPremium)
                    calculateInsurance();
            }
        }
    }
    xmlhttp.open("GET", strCmd, true);
    xmlhttp.send();
}

///////////////////////////////////////////////////////////
/// 赔付计算
    var premium_return;         //  保费返还
    var sickness_death_compst=new Array(2);     //  疾病身故赔付
    var general_acci_compst = new Array(2);     //  一般意外赔付
    var traffic_acci_compst = new Array(2);     //  交通意外赔付
    var driving_acci_compst = new Array(2);     //  驾乘意外赔付
    var natural_disa_compst = new Array(2);     //  自然灾害赔付
    var aircraft_acci_compst= new Array(2);     //  航空意外赔付
    var medical_expense     = new Array(2);     //  意外住院津贴    


function initInsuranceContent(){
    premium_return = 0;         //  保费返还
    sickness_death_compst = [0,0];  //  疾病身故赔付
    general_acci_compst = [0,0];//  一般意外赔付
    traffic_acci_compst = [0,0];//  交通意外赔付
    driving_acci_compst = [0,0];//  驾乘意外赔付
    natural_disa_compst = [0,0];//  自然灾害赔付
    aircraft_acci_compst = [0,0];    //  航空意外赔付
    medical_expense = [0,0];    //  意外住院津贴

    document.getElementById("t_premium_return").innerHTML="0万元";
    document.getElementById("t_sickness_death_payment").innerHTML="0万元";
    document.getElementById("t_general_accident_payment").innerHTML="0万元";
    document.getElementById("t_traffic_accident_payment").innerHTML="0万元";
    document.getElementById("t_driving_accident_payment").innerHTML="0万元";
    document.getElementById("t_natural_disaster_payment").innerHTML="0万元";
    document.getElementById("t_aircraft_accident_payment").innerHTML="0万元";
    document.getElementById("t_medical_expense_payment").innerHTML="每天0元";
}

function refreshInsuranceContent(){
    document.getElementById("t_premium_return").innerHTML=premium_return+"元*缴费年数";
    document.getElementById("t_sickness_death_payment").innerHTML  =sickness_death_compst[0]+"万元+"+sickness_death_compst[1].toFixed(2)+"元*缴费年数";
    document.getElementById("t_general_accident_payment").innerHTML=general_acci_compst[0]+"万元+"+general_acci_compst[1].toFixed(2)+"元*缴费年数";
    document.getElementById("t_traffic_accident_payment").innerHTML=traffic_acci_compst[0]+"万元+"+traffic_acci_compst[1].toFixed(2)+"元*缴费年数";
    document.getElementById("t_driving_accident_payment").innerHTML=driving_acci_compst[0]+"万元+"+ driving_acci_compst[1].toFixed(2)+"元*缴费年数";
    document.getElementById("t_natural_disaster_payment").innerHTML=natural_disa_compst[0]+"万元+"+ natural_disa_compst[1].toFixed(2)+"元*缴费年数";
    document.getElementById("t_aircraft_accident_payment").innerHTML=aircraft_acci_compst[0]+"万元+"+aircraft_acci_compst[1].toFixed(2)+"元*缴费年数";
    document.getElementById("t_medical_expense_payment").innerHTML="每天"+medical_expense[0]+"元，每年总额不超过"+medical_expense[1]+"万元";
}

function addTermLifeToContent(_product_name){
    var timestamp=new Date().getTime();
    var url = "term_life_payment.php";
    url = url + "?product_name=" + _product_name+"&timestamp="+timestamp;

    //  获得保额
    var ctrl1= document.getElementById(_product_name+"保障额度");
    if(!ctrl1)return;

    var _coverage=parseFloat(ctrl1.value);

    //  获得保费
    var ctrl2= document.getElementById(_product_name+"保费");
    if(!ctrl2)return;

    var _preimum=parseFloat(ctrl2.innerHTML);

    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //  返还
            premium_return = premium_return+parseFloat(xmlhttp.responseText)*_coverage;

            sickness_death_compst[0]= sickness_death_compst[0]+_coverage;
            general_acci_compst[0]  = general_acci_compst[0] + _coverage;
            traffic_acci_compst[0]  = traffic_acci_compst[0] + _coverage;
            driving_acci_compst[0]  = driving_acci_compst[0] + _coverage;
            natural_disa_compst[0]  = natural_disa_compst[0] + _coverage;
            aircraft_acci_compst[0] = aircraft_acci_compst[0]+ _coverage;

            refreshInsuranceContent();
        }   // if
    }   // function
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function addAccidentInsuranceToContent(_product_name){
    var timestamp=new Date().getTime();
    var url = "accident_insurance_payment.php";
    url = url + "?product_name=" + _product_name+"&timestamp="+timestamp;

    //  获得保额
    var ctrl1= document.getElementById(_product_name+"保障额度");
    if(!ctrl1)return;

    var _coverage=parseFloat(ctrl1.value);

    //  获得保费
    var ctrl2= document.getElementById(_product_name+"保费");
    if(!ctrl2)return;

    var _premium;
    if(ctrl2.name!=0)
        _preimum=ctrl2.name;
    else 
        _preimum=parseFloat(ctrl2.innerHTML);

    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var payments_text = xmlhttp.responseText;
            var payments_arr = payments_text.split(";");

            //  返还
            if(payments_arr[0]!=""){
                premium_return = premium_return+parseFloat(payments_arr[0])*_preimum;                
            }

            //  疾病身故赔付
            if(payments_arr[1]!=""){
                var sdp_arr = payments_arr[1].split('+');

                //  保额系数
                sickness_death_compst[0] = sickness_death_compst[0]+_coverage*parseFloat(sdp_arr[0].replace("保额", ""));

                //  保费系数
                sickness_death_compst[1] = sickness_death_compst[1]+_preimum*parseFloat(sdp_arr[1].replace("保费", ""));
            }

            //  一般意外赔付
            if(payments_arr[2]!=""){
                var gap_arr = payments_arr[2].split('+');

                //  保额系数
                general_acci_compst[0] = general_acci_compst[0]+_coverage*parseFloat(gap_arr[0].replace("保额", ""));

                //  保费系数
                general_acci_compst[1] = general_acci_compst[1]+_preimum*parseFloat(gap_arr[1].replace("保费", ""));
            }

            //  交通意外赔付
            if(payments_arr[3]!=""){
                var tap_arr = payments_arr[3].split('+');

                //  保额系数
                traffic_acci_compst[0] = traffic_acci_compst[0]+_coverage*parseFloat(tap_arr[0].replace("保额", ""));

                //  保费系数
                traffic_acci_compst[1] = traffic_acci_compst[1]+_preimum*parseFloat(tap_arr[1].replace("保费", ""));
            }

            //  驾乘意外赔付
            if(payments_arr[4]!=""){
                var dp_arr = payments_arr[4].split('+');

                //  保额系数
                driving_acci_compst[0] = driving_acci_compst[0]+_coverage*parseFloat(dp_arr[0].replace("保额", ""));

                //  保费系数
                driving_acci_compst[1] = driving_acci_compst[1]+_preimum*parseFloat(dp_arr[1].replace("保费", ""));
            }
            
            //  自然灾害身故赔付
            if(payments_arr[5]!=""){
                var ndp_arr = payments_arr[5].split('+');

                //  保额系数
                natural_disa_compst[0] = natural_disa_compst[0]+_coverage*parseFloat(ndp_arr[0].replace("保额", ""));

                //  保费系数
                natural_disa_compst[1] = natural_disa_compst[1]+_preimum*parseFloat(ndp_arr[1].replace("保费", ""));
            }

            //  航空意外赔付
            if(payments_arr[6]!=""){
                var aap_arr = payments_arr[6].split('+');

                //  保额系数
                aircraft_acci_compst[0] = aircraft_acci_compst[0]+_coverage*parseFloat(aap_arr[0].replace("保额", ""));

                //  保费系数
                aircraft_acci_compst[1] = aircraft_acci_compst[1]+_preimum*parseFloat(aap_arr[1].replace("保费", ""));

                //  第三部分
                aircraft_acci_compst[0] = natural_disa_compst[0]+parseFloat(aap_arr[2].replace("万"), "");
            }

            //  每天医疗费用
            if(payments_arr[7]!=""){
                var medp_arr = payments_arr[7].split('+');

                //  保额系数
                medical_expense[0] = medical_expense[0]+parseFloat(medp_arr[0].replace("每天", "").replace("元", ""));

                //  保费系数
                medical_expense[1] = medical_expense[1]+parseFloat(medp_arr[1].replace("最高", "").replace("万", ""));
            }

            refreshInsuranceContent();
         }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//  刷新保障内容
function calculateInsurance(){
    var _products_selected = getCookie("products_selected");
    if (_products_selected=="") return;

    document.getElementById("insurance_content").className="";

    initInsuranceContent();


    var _products_selected = getCookie("products_selected");
    var _products_arr = _products_selected.split('+');

    for (var i = 0; i < _products_arr.length; i++) {
            var _product_name = _products_arr[i];

            if(getCookie(_product_name+'type')=='term_life')
                addTermLifeToContent(_product_name);
            else
                addAccidentInsuranceToContent(_product_name);
     };    
}

///////////////////////////////////////////////////////////////////////////////////////
var rule_initialized = false;
function InitRules(){
    var _products_selected = getCookie("products_selected");
    var products = _products_selected.split('+');

    InitRuleFromDB(products, 0);
    rule_initialized = true;
}

function InitRuleFromDB(product_list, _i){
    if(_i >=product_list.length || product_list[_i]=="")
        return;

    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var rule_text = xmlhttp.responseText;
            var rules = rule_text.split(";");

            var div_header = document.createElement('div');
            div_header.style="margin:0;padding-bottom:0px;";
            div_header.className = "page-header";

            var h5_header = document.createElement('h5');
            h5_header.style = "text-align:center;padding-top:0px;";
            h5_header.innerHTML=product_list[_i]+"-投保规则";

            div_header.appendChild(h5_header);

            var div_rule=document.createElement('div');

            for (var i = 0; i <= rules.length - 1; i++) {

                var _p = document.createElement('p');
                
                _p.innerHTML = "<span class='glyphicon glyphicon-star-empty'></span>"+rules[i];
                div_rule.appendChild(_p);
            };

            $('#rule_content').append(div_header);
            $('#rule_content').append(div_rule);            

            InitRuleFromDB(product_list, _i+1);
        }
    }
    var url = "insurance_personal_value_rule.php";
    url = url + "?product_name=" + product_list[_i];
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

var case_initialized = false;
function InitCases(){
    var _products_selected = getCookie("products_selected");
    var products = _products_selected.split('+');

    InitCaseFromDB(products, 0);
    case_initialized = true;
}

function InitCaseFromDB(product_list, j){

    if(j >=product_list.length || product_list[j]=="")
        return;

    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var case_text = xmlhttp.responseText;
            var case_items = case_text.split(";");

            var div_header = document.createElement('div');
            div_header.style="margin:0;padding-bottom:0px;";
            div_header.className = "page-header";

            var h5_header = document.createElement('h5');
            h5_header.style = "text-align:center;padding-top:0px;";
            h5_header.innerHTML=product_list[j]+"-投保案例";

            div_header.appendChild(h5_header);

            var div_rule=document.createElement('div');

            for (var i = 0; i <= case_items.length - 1; i++) {
                var t=case_items[i].split('-');
                var _subtitle=t[0];
                var _subcontent=t[1];

                var _h6 = document.createElement('h6');
                var _i = document.createElement('i');
                var _span = document.createElement('span');
                var _p = document.createElement('p');

                if(_subtitle=='投保')
                    _i.className="hz-icon-insure case-icon";
                else if(_subtitle=="出险")
                    _i.className="hz-icon-accident case-icon";
                else if(_subtitle=="理赔")
                    _i.className="hz-icon-payment case-icon";
                else
                    _i.className="hz-icon-insure case-icon";

                _span.innerHTML = _subtitle;
                _p.innerHTML = _subcontent;

                div_rule.appendChild(_h6);
                _h6.appendChild(_i);
                _h6.appendChild(_span);
                div_rule.appendChild(_p);
            };

            $('#case_container').append(div_header);
            $('#case_container').append(div_rule);            

            InitCaseFromDB(product_list, j+1);           

        }
    }
    var url = "insurance_personal_value_case.php";
    url = url + "?product_name=" + product_list[j];
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}


var QA_initialized = false;

function InitQAFromDB(){
    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var QA_text = xmlhttp.responseText;
            var QA_items = QA_text.split(";");

            for (var i = 0; i <= QA_items.length - 1; i++) {
                var t=QA_items[i].split('-');

                var p_q = document.createElement('p');
                var p_a = document.createElement('p');

                p_q.style="margin-bottom:0px;padding-bottom:5px;"
                p_q.innerHTML = "<span class='glyphicon glyphicon-question-sign'></span>"+t[0];
                p_a.innerHTML = "<span class='glyphicon glyphicon-info-sign'></span>"+t[1];

                $('#QA_content').append(p_q);
                $('#QA_content').append(p_a);
            };

            QA_initialized = true;
        }
    }
    var url = "insurance_personal_value_QA.php";
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

