/* 
 * @Author: liu zhongtu
 * @Date:   2017-02-25 07:57:26
 * @Last Modified by:   liu zhongtu
 * @Last Modified time: 2017-05-31 11:21:10
 */
var product_name;
var company_name;
var product_img;
var birthday;
var gender;
var period;
var coverage;
var premium;        //  10万保额对应的保费，单位：元

var expectedLifeSpan;
var gap;
var expectedExpense;
var retirement_pension;

var age;
var t1;
var t2;
var full_term_year=0;   //  满期金年龄
var full_term_coef=0;   //  保费系数

var initialized;

var rate=0.03;  // 利率
/*
var A;      //  刚退休时，资金水池的金额
var r;      //  利率
var C;      //  期望退休后的每月生活费用
var E;      //  估计的寿命
var t1;     //  每个月从资金池拿的费用相对保费的系数
var t2;     //  每个月不是从资金池拿的费用相对保费的系数

计算公式为：60岁资金池金额A=t1*P((1+r)^(60-age)-1)/r
资金池从60岁到耗尽
 
   (((A(1+r)-(C-t2*p))*(1+r)-(C-t2*p))(1+r)-(C-t2*p))(1+r)-(C-t2*p)……=0
*/

//  计算最低保费
function computeMinimunCoverage(_r, _age, _E, _curC){

    if(full_term_coef>0)    //  如果有满期金
    {
        premium_coef = premium/10000;  //1万保额对应的保费

        var A = t1*(Math.pow(1+_r, 60-age)-1)/_r*Math.pow(1+_r, 21);
        var B = t2*(Math.pow(1+_r, 20)-1)/_r;
        var C = 10*premium_coef;

        return parseInt(10*gap/(A+B+C))/10;
    }
    else
    {
        var C = (12*_curC)*Math.pow(1+_r, parseInt((RETIREMENT_AGE+parseInt(_E))/2-_age));              //  以退休到预计寿命的中间值所对应的利率下的花费缺口
        var s1 = Math.pow(1+_r, RETIREMENT_AGE-_age)-1;  //  求退休时资金池大小时，保费的系数
        var s2 = Math.pow(1+_r, _E-RETIREMENT_AGE)-1;

        return parseInt(10*s2*C/(t1*s1+t2*s2)/10000)/10;        
    }
}

function load() {
    initialized = false;
    var urlinfo = window.location.href; //獲取url
    var paras = urlinfo.split("?")[1].split("&");

    //  获得产品名称
    product_name = decodeURI(paras[0].split("=")[1]); //拆分url得到”=”後面的參數
    document.title= product_name; 
    $('#products_selected').html(product_name);

    //  产品图片
    product_img = paras[1].split("=")[1]; //拆分url得到”=”後面的參數
    $('#product_img').attr('src', product_img);

    //  生日
    birthday = paras[2].split("=")[1];
    $('#birthday').val(birthday);

    //  预期寿命
    expectedLifeSpan = paras[3].split("=")[1];

    //  缺口
    gap = paras[4].split("=")[1];

    //  预期退休后每月消费
    expectedExpense = paras[5].split("=")[1];

    //  退休金
    retirement_pension = paras[6].split("=")[1];

    //  性别
    gender = paras[7].split("=")[1];

    //  保额
    coverage = paras[8].split("=")[1];

    //  缴费期限
    period = paras[9].split("=")[1];

    getInsuranceEndowmentParametersFromDB(product_name);
    getGapParameters();
}

function getGapParameters(){
    var _age =getCookie('age');
    $('#age').html(getCookie('age'));
    $('#income').html(getCookie('income'));
    $('#level').html(100*parseFloat(getCookie('retireLifeLevel')));

    var has_ss = getCookie('has_ss');
    if(has_ss=="true"){
        $('#ss').html('有');
        $('#ss_average').html(getCookie('averageSalary'));
        $('#ss_base').html(getCookie('ssPaymentBase'));
        $('#ss_year').html(getCookie('ssPaymentYear'));
        $('#ss_salary').html(parseInt(getCookie('retirement_pension')));
    }
    else{
        $('#ss').html('无');
        $('#ss_detail').hide();
    }

    $('#age').html(getCookie('familySameGenderLife'));
    $('#expected_age').html(getCookie('expectedLifeSpan'));
    $('#gap').html(parseFloat(getCookie('gap')));
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
 }

function updatePremium() {
    //    保额
    var coef = parseFloat($("#coverage").val());
    coverage = coef;

    //    性别
    var arr = document.getElementsByName("gender");
    gender = arr[0].checked ? 1 : 0;
    //    缴费年限
    period = parseInt($("#period").val());
    //    年龄计算
    birthday = $("#birthday").val();
    age = getAge(birthday);

    //  修改URL，以便共享
    refreshURL();

    //    连接字符串
    var strParas = "product_name=" + encodeURI(product_name) + "&age=" + age + "&period=" + period + "&gender=" + gender;
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

            premium = parseInt(xmlhttp.responseText) * coef;
            document.getElementById("price_per_year").innerHTML = premium;

            //  满期金
            $('#birthday80_gift').html(premium*period);
            $('#death_payment').html(premium);

            updatePayment(product_name);
        }
    }
    xmlhttp.open("GET", strCmd, true);
    xmlhttp.send();
}

function updatePayment(_product_name){
    var url = "insurance_endowment_payment.php";
    url = url + "?product_name=" + _product_name;
    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var ret_arr = xmlhttp.responseText.split(';');

            //  缴立领
            var _immediate_payment = parseFloat(ret_arr[0].replace("保额", ""));
            if(_immediate_payment==0){
                $('#immediate_payment').hide();
            }
            else{
                $('#immediate_payment_value').html(10000*_immediate_payment*coverage);
            }

            //  开始领年金年份
            var start_payment_year = parseInt(ret_arr[1]);
            var strStartPaymentYear = "从第"+start_payment_year+"年";
            if(start_payment_year==1)
                $('#is_immediate_payment').show();
            else
                $('#is_immediate_payment').hide();

            $('#start_year').html(strStartPaymentYear);

            //  60岁前每年领
            t1 = parseFloat(ret_arr[2].replace("保额", ""))
            var _annual_payment_before_60 = parseInt(t1*coverage*10000);
            $('#annual_payment_before_60').html(_annual_payment_before_60);

            //  60岁后每年领
            t2 = parseFloat(ret_arr[3].replace("保额", ""));
            var _annual_payment_after_60 = t2*coverage*10000;
            $('#annual_payment_after_60').html(_annual_payment_after_60);

            //  满期金时间
            if(ret_arr[5].indexOf("岁") >= 0)        //只处理岁的情况
            {
                full_term_year = parseInt(ret_arr[4].replace("岁", ""));
                full_term_coef =  parseFloat(ret_arr[4].replace("保费", ""));
            }

            if(initialized==false){
                var minCoverage=computeMinimunCoverage(rate, getAge(birthday), expectedLifeSpan, expectedExpense-retirement_pension, t1, t2);
                $('#min_coverage').html(Math.round(minCoverage)+'万元');
                initialized = true;
            }


            calcUniveralAccount();
            calcAnnuities();
        }   // if
    }   // function
    xmlhttp.open("GET", url, true);
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
    var _url = 'premium_calculation.htm?product_name='+product_name+'&img='+product_img+'&birthday='+birthday+'&lifespan='+expectedLifeSpan+'&gap='+gap+'&expectedExpense='+expectedExpense+'&pension='+retirement_pension+'&gender'+gender+'&coverage='+coverage+'&period='+period;

    window.history.pushState({},0,_url); 
}

////////////////////////////////////////////////////////////////////////////////

function getInsuranceEndowmentParametersFromDB(_product_name) {
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
                if(coverage_array.length>1){
                    for (var i = 0; i < coverage_array.length; i++) {
                        var option = new Option(coverage_array[i] + "万元", coverage_array[i]);
                        sel1.options.add(option);
                    }
                }
                else{
                    coverage_array = _coverage_range.split('~');
                    var start = parseFloat(coverage_array[0]);
                    var delta = parseFloat(coverage_array[1]);
                    var end = parseFloat(coverage_array[2]);

                    //  满足养老缺口的最低保额
                    for(i=start; i <= end; i=i+delta){
                        var option = new Option(i + "万元", i);
                        sel1.options.add(option);                        
                    }
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
                    var _period = insurance_period_array[i];
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

            if(initialized == false){
                initialize();
            }

            updatePremium();
        }
    }
    var url = "insurance_endowment_parameters.php";
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
    var url = "insurance_endowment_company.php";
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
    var url = "insurance_endowment_rule.php";
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
    var url = "insurance_endowment_case.php";
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
    var url = "insurance_endowment_QA.php";
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

///////////////////////////////////////////////////////////////////////
//  万能账户计算
var r =0.048;
var v_age;


var initProgress = function(){
    music_bar = new scale("#progress-button","#all-progress","#current-progress");
};

scale = function(btn, bar, cur_bar){
    this.btn = $(btn);
    this.bar = $(bar);
    this.cur_bar = $(cur_bar);
    this.minLength = this.bar.offsetLeft;
    this.maxLength = this.minLength + this.bar.width();
    this.currentX = this.btn.offsetLeft;
    this.currentY = this.btn.offsetTop;
    this.init();
};

scale.prototype = {
    init : function(){
        var f = this;
        document.addEventListener("touchstart", function(e1){
            e1.preventDefault();
            document.addEventListener("touchmove", function(e2){
                var p = e2.touches[0];
                var moveX = p.clientX;
                var moveY = p.clientY;
                if((Math.abs(moveX - f.currentX) < 20) && (Math.abs(moveY - f.currentY) < 20 )){
                    if(moveX < f.minLength){
                        f.cur_bar.css("width", "0%");
                        f.currentX = f.minLength;
                    }else if(moveX > f.maxLength){
                        f.cur_bar.css("width","100%");
                        f.currentX = f.maxLength;
                    }else{
                        var percent = ((moveX - f.minLength)*100)/(f.maxLength - f.minLength);
                        f.cur_bar.css("width",percent+"%");
                        f.currentX = moveX;
                    }
                }
            });
        });
        document.addEventListener("touchend", function(e){
            document.addEventListener("touchmove",null);
        });
    }
};

function low_rate(){
    if ($('.low-rate-btn').hasClass('btn-default')) 
        $('.low-rate-btn').removeClass('btn-default');
    $('.low-rate-btn').addClass('btn-warning');

    if ($('.mid-rate-btn').hasClass('btn-warning')) 
        $('.mid-rate-btn').removeClass('btn-warning');
    $('.mid-rate-btn').addClass('btn-default');
    
    if ($('.high-rate-btn').hasClass('btn-warning')) 
        $('.high-rate-btn').removeClass('btn-warning');
    $('.high-rate-btn').addClass('btn-default');

    if ($('.latest-rate-btn').hasClass('btn-warning')) 
        $('.latest-rate-btn').removeClass('btn-warning');
    $('.latest-rate-btn').addClass('btn-default');

    r = 0.03;
    calcUniveralAccount();     
}

function mid_rate(){
    if ($('.mid-rate-btn').hasClass('btn-default')) 
        $('.mid-rate-btn').removeClass('btn-default');
    $('.mid-rate-btn').addClass('btn-warning');

    if ($('.low-rate-btn').hasClass('btn-warning')) 
        $('.low-rate-btn').removeClass('btn-warning');
    $('.low-rate-btn').addClass('btn-default');
    
    if ($('.high-rate-btn').hasClass('btn-warning')) 
        $('.high-rate-btn').removeClass('btn-warning');
    $('.high-rate-btn').addClass('btn-default');

    if ($('.latest-rate-btn').hasClass('btn-warning')) 
        $('.latest-rate-btn').removeClass('btn-warning');
    $('.latest-rate-btn').addClass('btn-default');

    r = 0.045;
    calcUniveralAccount(); 
}

function high_rate(){
    if ($('.high-rate-btn').hasClass('btn-default')) 
        $('.high-rate-btn').removeClass('btn-default');
    $('.high-rate-btn').addClass('btn-warning');

    if ($('.mid-rate-btn').hasClass('btn-warning')) 
        $('.mid-rate-btn').removeClass('btn-warning');
    $('.mid-rate-btn').addClass('btn-default');
    
    if ($('.low-rate-btn').hasClass('btn-warning')) 
        $('.low-rate-btn').removeClass('btn-warning');
    $('.low-rate-btn').addClass('btn-default');

    if ($('.latest-rate-btn').hasClass('btn-warning')) 
        $('.latest-rate-btn').removeClass('btn-warning');
    $('.latest-rate-btn').addClass('btn-default');    

    r = 0.06;
    calcUniveralAccount(); 
}

function latest_rate(){
    if ($('.latest-rate-btn').hasClass('btn-default')) 
        $('.latest-rate-btn').removeClass('btn-default');
    $('.latest-rate-btn').addClass('btn-warning');

    if ($('.mid-rate-btn').hasClass('btn-warning')) 
        $('.mid-rate-btn').removeClass('btn-warning');
    $('.mid-rate-btn').addClass('btn-default');
    
    if ($('.high-rate-btn').hasClass('btn-warning')) 
        $('.high-rate-btn').removeClass('btn-warning');
    $('.high-rate-btn').addClass('btn-default');

    if ($('.low-rate-btn').hasClass('btn-warning')) 
        $('.low-rate-btn').removeClass('btn-warning');
    $('.low-rate-btn').addClass('btn-default'); 

    r = 0.048;
    calcUniveralAccount();   
}

//  万能账户计算
function calcUniveralAccount(){
    var result;

    var v_age = age_slider.getValue();
    if(v_age<age){
        result = 0;
    }
    else if(v_age<60){
        var m = v_age-age;
        var C = t1*coverage;
        result = C*(Math.pow(1+r, m+1)-1)/r;
    }
    else
    {
        var A = t1*coverage*(Math.pow(1+r, 59-age)-1)/r;

        if(full_term_coef>0 && v_age>=80) // 如果存在满期金，且年满80
        {
            var Y = A*Math.pow(1+r, 21)+t2*coverage*(Math.pow(1+r, 20)-1)/r+full_term_coef*premium/10000;

            if(v_age==80)
                result = Y;
            else
                result = Y*Math.pow(1+r, v_age-80);
        }
        else
        {
            var n = v_age-60;

            result = A*Math.pow(1+r, n+1)+t2*coverage*(Math.pow(1+r, n+1)-1)/r;
        }
    } 

    var info = String(parseInt(result*10)/10.0);

    $('#universal_account_value').html(info);
}

/*
    C 保额 
    t1 每个月从资金池拿的费用相对保费的系数
    t2 每个月不是从资金池拿的费用相对保费的系数
    m 拿养老金的起始年
    n 拿养老金的终止年
    i 祝寿金年龄=full_term_year
    period 缴费年限
    X m~n岁间每年领取
    Y 从资金池中每年拿出的部分
    r 利率
 */
function calcAnnuities(){

    var m = parseInt($("#start_age").val());
    var n =parseInt($("#end_age").val());
    var i = full_term_year;

    var _r  =0.045;
    var A = t1*10000*coverage*(Math.pow(1+_r, 60-1-age)-1)/_r;

    var annuity;
    switch(m)
    {
        case 55:
              var A1 = t1*10000*coverage*(Math.pow(1+_r, 55-1-age)-1)/_r;
              var B = A*Math.pow(1+_r,n-54);
              var C = (Math.pow(1+_r, 5)-1)/_r*Math.pow(1+_r, n-60);
              var D = (1+_r)*(Math.pow(1+_r, n-60)-1)/_r;

              annuity = (B+t1*10000*coverage*C+t2*10000*coverage*D)/(C+D);
            break;
        case 60:
              var B = A*Math.pow(1+_r,n-60);
              var C = t2*10000*coverage*(Math.pow(1+_r, n-59)-1)/_r;
              var D = (1+_r)*(Math.pow(1+_r, n-60)-1)/_r;

              annuity = (B+C)/D;

            break;
        case 65:
              var B = A*Math.pow(1+_r,n-60);
              var C = t2*10000*coverage*(Math.pow(1+_r, n-59)-1)/_r;
              var D = (1+_r)*(Math.pow(1+_r, n-65)-1)/_r;

              annuity = (B+C)/D;
            break;
        default:
              annuity= 0;
    }

    var final_annuity = premium*full_term_coef*Math.pow(1+_r, n-80)-t2*10000*coverage*(1+_r)*(Math.pow(1+_r, n-80)-1)/r;

    $('#end_age_t').html(n);
    $('#annuity').html(parseInt(annuity));
    $('#final_annuity').html(parseInt(final_annuity));
}

function startAgeChange(s)
{
    calcAnnuities();
}

function endAgeChange(s)
{
    calcAnnuities();
}

//
