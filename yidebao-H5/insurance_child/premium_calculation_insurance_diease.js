/* 
 * @Author: liu zhongtu
 * @Date:   2017-02-25 07:57:26
 * @Last Modified by:   liu zhongtu
 * @Last Modified time: 2017-05-24 07:48:17
 */
var product_name;
var product_img;
var company_name;
var birthday;
var gender;
var coverage;
var period;
var insurance_period=999;
var initialized;

var iTag = 0; //  病种编号

function load() {
    initialized = false;

    var urlinfo = window.location.href; //獲取url
    var paras = urlinfo.split("?")[1].split("&");

    //  获得产品名称
    product_name = decodeURI(paras[0].split("=")[1]); //拆分url得到”=”後面的參數
    document.title= product_name; 

    //  产品图片
    product_img = paras[1].split("=")[1]; //拆分url得到”=”後面的參數
    $('#product_img').attr('src', product_img);
    $('#products_selected').html(product_name);

    //  生日
     birthday = paras[2].split("=")[1];
    $('#birthday').val(birthday);

    //  性别
    gender = paras[3].split("=")[1];

    //  保额
    coverage = paras[4].split("=")[1];

    //  缴费期限
    period = paras[5].split("=")[1];       

    //  保障期限
    insurance_period = paras[6].split("=")[1];       


    getInsuranceDiseasesParametersFromDB(product_name);
}

function updatePremium() {
    //    保额
    coverage = $("#coverage").val();
    var coef = parseInt(coverage) / 10;
    //    性别
    var arr = document.getElementsByName("gender");
    gender = arr[0].checked ? 1 : 0;
    //    缴费年限
    period = parseInt($("#period").val());

    //    年龄计算
    birthday = $("#birthday").val();    
    var _age = getAge(birthday);

    //  修改URL，以便共享
    refreshURL();

    //    连接字符串
    var strParas = "product_name=" + encodeURI(product_name) + "&age=" + _age + "&period=" + period + "&gender=" + gender;
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
            // alert(xmlhttp.responseText);
            var premium = parseInt(xmlhttp.responseText) * coef;
            var zsj = premium * period / 10000;
            
            document.getElementById("price_per_year").innerHTML = premium;
            document.getElementById("birthday80_gift").innerHTML = zsj+"万";

            //  获得重疾和轻疾等的信息
            getInsuranceDiseasesPaymentFromDB(product_name);            
        }
    }
    xmlhttp.open("GET", strCmd, true);
    xmlhttp.send();
}

function coverageChange(s) {
    updatePremium();
}

function periodChange(s) {
    updatePremium();
}

function genderChange(obj) {
    //         alert(obj.value);
    updatePremium();
}

function dateChange() {
    updatePremium();
}

function refreshURL(){
    var _url = 'premium_calculation.htm?product_name='+product_name+'&img='+product_img+'&birthday='+birthday+'&gender='+gender+'&coverage='+coverage+'&period='+period+'&insurance_period='+insurance_period;

    window.history.pushState({},0,_url); 
}

////////////////////////////////////////////////////////////////////////////////
function getInsuranceDiseasesParametersFromDB(_product_name) {
    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            xmlDoc = xmlhttp.responseXML;
            var payments_text = xmlhttp.responseText;
            if (xmlDoc.getElementsByTagName("product_name")[0].childNodes[0] == undefined) return;
            var _product_name = xmlDoc.getElementsByTagName("product_name")[0].childNodes[0].nodeValue;
            var _coverage_range = xmlDoc.getElementsByTagName("coverage_range")[0].childNodes[0].nodeValue;
            var _insurance_period = xmlDoc.getElementsByTagName("insurance_period")[0].childNodes[0].nodeValue;
            var _payment_period = xmlDoc.getElementsByTagName("payment_period")[0].childNodes[0].nodeValue;
            company_name = xmlDoc.getElementsByTagName("company_name")[0].childNodes[0].nodeValue;

            var sel1 = document.getElementById('coverage');
            if (_coverage_range != undefined && sel1) {
                var coverage_array = new Array(); //定义一数组
                coverage_array = _coverage_range.split(';');
                for (var i = 0; i < coverage_array.length; i++) {
                    var option = new Option(coverage_array[i] + "万元", coverage_array[i]);
                    sel1.options.add(option);
                }
                sel1.options[0].selected = true;
            }
            var sel2 = document.getElementById('period');
            if (sel2 && _payment_period) {
                var payment_period_array = new Array(); //定义一数组
                payment_period_array = _payment_period.split(';');
                for (var i = 0; i < payment_period_array.length; i++) {
                    var option = new Option(payment_period_array[i] + "年", payment_period_array[i]);
                    sel2.options.add(option);
                }
                sel2.options[0].selected = true;
            }
            var sel3 = document.getElementById('insurance_period');
            if (sel3 && _insurance_period) {
                var insurance_period_array = new Array(); //定义一数组
                insurance_period_array = _insurance_period.split(';');
                for (var i = 0; i < insurance_period_array.length; i++) {
                    _period = insurance_period_array[i];
                    var _period_arr = _period.split('~');
                    if (_period_arr.length == 2) {
                        var option = new Option("到" + _period_arr[1] + "岁", _period);
                        sel3.options.add(option);
                    } else {
                        var option;
                        var n = parseInt(_period);
                        if (n == 999) {
                            option = new Option("保终身", _period);

                        } else {
                            option = new Option(_period + "年", _period);
                        }
                        sel3.options.add(option);
                    }
                };
                sel3.options[0].selected = true;
            }

            if(initialized==false){
                initialize();

                initialized = true;
            }
        }
    }
    var url = "insurance_diseases_parameters.php";
    url = url + "?product_name=" + _product_name;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}


function initialize(){
    if(gender==1){
        $("#gender_female").removeAttr("checked");
        $("#gender_male").attr('checked',true);
    }
    else{
        $("#gender_male").removeAttr("checked");
        $("#gender_female").attr('checked',true);
    }

    selectItemByValue(document.getElementById('coverage'), coverage);
    selectItemByValue(document.getElementById('period'), period);
    selectItemByValue(document.getElementById('insurance_period'), insurance_period);

    updatePremium();
 }

function getInsuranceDiseasesPaymentFromDB(_product_name) {
    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var payments_text = xmlhttp.responseText;
            if (payments_text == "") return;
            var payments_arr = payments_text.split("#");
            //  重疾数
            var severe_case_num = parseInt(payments_arr[0]);
            $('#severe_case_num').html(severe_case_num);

            //  轻疾数
            var mild_case_num = parseInt(payments_arr[1]);
            $('#mild_case_num').html(mild_case_num);

            //  重疾次数
            var severe_case_times = parseInt(payments_arr[2]);
            $('#severe_case_times').html(severe_case_times);

            //  轻疾次数
            var mild_case_times = parseInt(payments_arr[3]);
            $('#mild_case_times').html(mild_case_times);

            //  重疾赔付金额
            $('#severe_case_payment').html(coverage*10000);

            //  轻疾赔付比例
            var mild_compensate_percent = parseFloat(payments_arr[4]);
            $('#mild_case_payment').html(coverage*100*mild_compensate_percent);

            //  高残
            $('#deformity_payment').html(coverage*10000);

            //  身故
            $('#death_payment').html(coverage*10000);

            //  身故
            $('#final_stage_payment').html(coverage*10000);

            //  祝寿金年龄
            if (payments_arr[5] == "" || payments_arr[5] == "0") {
                if (!$('#full_term').hasClass('hidecontent')) {
                    $('#full_term').addClass('hidecontent');
                    $('#full_term_payment').addClass('hidecontent');
                    $('#full_term_slogon').addClass('hidecontent');
                }
            } else {
                if ($('#full_term').hasClass('hidecontent')) {
                    $('#full_term').removeClass('hidecontent');
                    $('#full_term_payment').removeClass('hidecontent');
                    $('#full_term_slogon').removeClass('hidecontent');
                }

                var birthday_gift_age = parseInt(payments_arr[5]);
            }

            //  18岁身故补偿
            var age18_death_compensate = parseInt(payments_arr[6]);

            //  重疾内容
            var severe_case_arr = payments_arr[7].split(';');
            for (var i = 0; i < severe_case_arr.length; i++) {
                var _li = document.createElement('li');
                _li.innerHTML = severe_case_arr[i];
                $('#severe_case_list').append(_li);
            }
            //  轻疾内容
            var mild_case_arr = payments_arr[8].split(';');
            for (var i = 0; i < mild_case_arr.length; i++) {
                var _li = document.createElement('li');
                _li.innerHTML = mild_case_arr[i];
                $('#mild_case_list').append(_li);
            }

            //  高残保障
            var has_deformity = payments_arr[9];
            if(parseInt(has_deformity)==1)
                $('#deformity').show();
            else
                $('#deformity').hide();

            //  终末期保障
            var has_final_stage = payments_arr[10];
            if(parseInt(has_final_stage)==1)
                $('#final_stage').show();
            else
                $('#final_stage').hide();
            
            //  绿通服务
            var has_green_channel = payments_arr[11];
            if(parseInt(has_green_channel)==1){
                $('#green_channel').show();
                $('#green_channel_detail').show();
            }
            else{
                $('#green_channel').hide();
                $('#green_channel_detail').hide();
            }

            //  投保人豁免
            var holder_exemption = payments_arr[12];
             if(parseInt(holder_exemption)==1){
                $('#holder_free').show();
            }
            else{
                $('#holder_free').hide();
            }
                       
            //  轻症豁免
            var mild_case_exemption = payments_arr[12];
             if(parseInt(mild_case_exemption)==1){
                $('#mild_free').show();
            }
            else{
                $('#mild_free').hide();
            }

            if(holder_exemption==0&&mild_case_exemption==0)
                $('#premium_free').hide();
            else
                $('#premium_free').show();
        }
    }
    var url = "insurance_diseases_payment.php";
    url = url + "?product_name=" + _product_name;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var company_local_url = "";
function InitCompanyUrlFromDB(){
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
            window.location.href = company_local_url;
        }
    }
    var url = "insurance_diseases_company.php";
    url = url + "?company_name=" + company_name;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);    
}


var rule_initialized = false;
function InitRuleFromDB(){
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

            for (var i = 0; i <= rules.length - 1; i++) {

                var _p = document.createElement('p');
                
                _p.innerHTML = "<span class='glyphicon glyphicon-star-empty'></span>"+rules[i];
                $('#rule_content').append(_p);
            };

        }
    }
    var url = "insurance_diseases_rule.php";
    url = url + "?product_name=" + product_name;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

var case_initialized = false;
function InitCaseFromDB(){
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

                $('#case_content').append(_h6);
                _h6.appendChild(_i);
                _h6.appendChild(_span);
                $('#case_content').append(_p);
            };

        }
    }
    var url = "insurance_diseases_case.php";
    url = url + "?product_name=" + product_name;
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

        }
    }
    var url = "insurance_diseases_QA.php";
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

//////////////////////////////////////////////////////////////////////////////
function switchTag(tag, content) {
    if(tag=="severe_btn"){
        $('#severe_btn').removeClass('btn-default');

        if(!$('#severe_btn').hasClass('btn-primary'))
            $('#severe_btn').addClass('btn-primary');

        $('#mild_btn').removeClass('btn-primary');

        if(!$('#mild_btn').hasClass('btn-default'))
            $('#mild_btn').addClass('btn-default');

        $('#severe_content').show();
        $('#mild_content').hide();
    }
    else{
        $('#mild_btn').removeClass('btn-default');

        if(!$('#mild_btn').hasClass('btn-primary'))
            $('#mild_btn').addClass('btn-primary');

        $('#severe_btn').removeClass('btn-primary');

        if(!$('#severe_btn').hasClass('btn-default'))
            $('#severe_btn').addClass('btn-default');

        $('#mild_content').show();
        $('#severe_content').hide();
    }
}


