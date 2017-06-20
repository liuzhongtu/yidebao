/* 
* @Author: liu zhongtu
* @Date:   2017-02-25 07:57:26
* @Last Modified by:   liu zhongtu
* @Last Modified time: 2017-04-09 12:06:23
*/

var iTag = 0; //  菜单编号
var product_name;
var guide = [0,0,0,0,0,0,0];

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
    //updateTabBar();
}


function load() {
    xmlHttp = GetXmlHttpObject()
    if (xmlHttp == null) {
        alert("Browser does not support HTTP Request");
        return;
    }
    var url = "insurance_disease_products_list.php";
    url = url + "?q=" + Math.random();
    xmlHttp.onreadystatechange = stateChanged;
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

////////////////////////////////////////////////////////////////////////////////////////
//  第一页
function guideInsurancePeriod(s){
    guide[0]=s;
    if(s==1){
        $('#guide_insurance_period1').attr("checked",true); 
        $('#guide_insurance_period2').attr("checked",false); 
    }
    else if(s==2){
        $('#guide_insurance_period1').attr("checked",false); 
        $('#guide_insurance_period2').attr("checked",true); 
    }

    guideSearch(1);
}

function guideSevereTimes(s){
    guide[1]=s;
    if(s==1){
        $('#guide_severe_times1').attr("checked",true); 
        $('#guide_severe_times2').attr("checked",false); 
    }
    else if(s==2){
        $('#guide_severe_times1').attr("checked",false); 
        $('#guide_severe_times2').attr("checked",true); 
    }

    guideSearch(2);
}

function guideSevereNum(s){
    guide[2]=s;
    if(s==1){
        $('#guide_severe_num1').attr("checked",true); 
        $('#guide_severe_num2').attr("checked",false); 
        $('#guide_severe_num3').attr("checked",false);    
    }
    else if(s==2){
        $('#guide_severe_num1').attr("checked",false); 
        $('#guide_severe_num2').attr("checked",true); 
        $('#guide_severe_num3').attr("checked",false);    
    }
    else if(s==3){
        $('#guide_severe_num1').attr("checked",false); 
        $('#guide_severe_num2').attr("checked",false); 
        $('#guide_severe_num3').attr("checked",true);    
    }

    guideSearch(3);  
}

function guideMildTimes(s){
    guide[3]=s;
    if(s==1){
        $('#guide_mild_times1').attr("checked",true); 
        $('#guide_mild_times2').attr("checked",false); 
        $('#guide_mild_times3').attr("checked",false);    
    }
    else if(s==2){
        $('#guide_mild_times1').attr("checked",false); 
        $('#guide_mild_times2').attr("checked",true); 
        $('#guide_mild_times3').attr("checked",false);    
    }
    else if(s==3){
        $('#guide_mild_times1').attr("checked",false); 
        $('#guide_mild_times2').attr("checked",false); 
        $('#guide_mild_times3').attr("checked",true);    
    }

    guideSearch(4);     
}

function guideGreenChannel(s){
    guide[4]=s;
    if(s==1){
        $('#guide_green_channel1').attr("checked",true); 
        $('#guide_green_channel2').attr("checked",false); 
    }
    else if(s==2){
        $('#guide_green_channel1').attr("checked",false); 
        $('#guide_green_channel2').attr("checked",true); 
    }

    guideSearch(5);    
}

function guideHolderExemption(s){
    guide[5]=s;

    if(s==1){
        $('#guide_holder_exemption1').attr("checked",true); 
        $('#guide_holder_exemption2').attr("checked",false); 
    }
    else if(s==2){
        $('#guide_holder_exemption1').attr("checked",false); 
        $('#guide_holder_exemption2').attr("checked",true); 
    }

    guideSearch(6);    
}

function guideMildCaseExemption(s){
    guide[6]=s;

    if(s==1){
        $('#guide_mild_case_exemption1').attr("checked",true); 
        $('#guide_mild_case_exemption2').attr("checked",false); 
    }
    else if(s==2){
        $('#guide_mild_case_exemption1').attr("checked",false); 
        $('#guide_mild_case_exemption2').attr("checked",true); 
    }

    guideSearch(7);        
}

function guideSearch(_i){
    //    连接字符串
    var strParas = "insurance_period=" + guide[0];
    strParas = strParas + "&severe_times="+guide[1];
    strParas = strParas + "&severe_num="+guide[2];
    strParas = strParas + "&mild_times="+guide[3];
    strParas = strParas + "&green_channel="+guide[4];
    strParas = strParas + "&holder_exemption="+guide[5];
    strParas = strParas + "&mild_case_exemption="+guide[6];
    strParas = strParas + "&i="+_i;

    var strCmd = "insurance_diseases_guide.php?" + strParas;
    //alert(strCmd);    
    // ajax通过php查询数据库
    var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码           
        xmlhttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            updateGuideResult(_i, xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", strCmd, true);
    xmlhttp.send();    
}

function updateGuideResult(i, response_text){
    var ret_val = response_text.split('+');
   // $('#satisfied_product_list').html(ret_val[0]);

    switch(i){
        case 1:
            formatProductLink( $('#guide_insurance_period'), ret_val[1]);
            break;
        case 2:
            //$('#guide_severe_times').html(formatProductLink(ret_val[1]));
            formatProductLink( $('#guide_severe_times'), ret_val[1]);

            break;
        case 3:
            //$('#guide_severe_num').html(formatProductLink(ret_val[1]));
             formatProductLink( $('#guide_severe_num'), ret_val[1]);
           break;
        case 4:
            //$('#guide_mild_times').html(formatProductLink(ret_val[1]));
            formatProductLink( $('#guide_mild_times'), ret_val[1]);
            break;
        case 5:
            //$('#guide_green_channel').html(formatProductLink(ret_val[1]));
            formatProductLink( $('#guide_green_channel'), ret_val[1]);
            break;
        case 6:
             formatProductLink( $('#guide_holder_exemption'), ret_val[1]);
           //$('#guide_holder_exemption').html(formatProductLink(ret_val[1]));
            break;
        case 7:
             formatProductLink( $('#guide_mild_case_exemption'), ret_val[1]);
           //$('#guide_mild_case_exemption').html(formatProductLink(ret_val[1]));
            break;
    }
}

function formatProductLink(f, products){
    var _product_arr = products.split(';');
    f.empty();

    if(products==""){
        f.html("无");

        return;
    }

    for (var i = 0; i< _product_arr.length; i++) {
        var _product_name = _product_arr[i];
        if(_product_name=="")
            continue;

        var _product_img = $('#'+_product_name+'img')[0];
        var _href = "premium_calculation.htm?product_name="+_product_name+"&img="+_product_img.src+"&birthday=1987-01-01&gender=1&coverage=20&period=20&insurance_period=999";
		 if (_product_name=='爱加倍') {
         _href = "aijiabei.htm?product_name="+_product_name+"&img="+_img.src+"&birthday=1987-01-01&gender=1&coverage=20&period=20&insurance_period=999";
   	 }
        var _a = document.createElement('a');
        _a.innerHTML=_product_name;
        _a.className="result_product";
        _a.href = _href ;

        f.append(_a);
    };
}

////////////////////////////////////////////////////////////////////////////////////////
//  第二页
function stateChanged() {
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        xmlDoc = xmlHttp.responseXML;
        
        // 更新产品列表
        // 
        var x = xmlDoc.getElementsByTagName("insurance_diseases");
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

function GetXmlHttpObject() {
    var objXMLHttp = null;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码       
        objXMLHttp = new XMLHttpRequest();
    else // IE6, IE5 浏览器执行代码
        objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    return objXMLHttp;
}

function openPremiumCalc(_product_name, _product_img)
{
    var _href="premium_calculation.htm?product_name="+_product_name+"&img="+_product_img+"&birthday=1987-01-01&gender=1&coverage=20&period=20&insurance_period=999";
     if (_product_name=='爱加倍') {
         _href = "aijiabei.htm?product_name="+_product_name+"&img="+_img.src+"&birthday=1987-01-01&gender=1&coverage=20&period=20&insurance_period=999";
    }
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
    _img.src = '../img/insurance_diseases/'+_product_img;
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
    _a.href = "premium_calculation.htm?product_name="+_product_name+"&img="+_img.src+"&birthday=1987-01-01&gender=1&coverage=20&period=20&insurance_period=999";
   
    if (_product_name=='爱加倍') {
         _a.href = "aijiabei.htm?product_name="+_product_name+"&img="+_img.src+"&birthday=1987-01-01&gender=1&coverage=20&period=20&insurance_period=999";
    }
    _a.innerHTML = "保费测算";
    _p_btn.appendChild(_a);

    var _span = document.createElement('span');
    _span.className="glyphicon glyphicon-chevron-right";
    _a.appendChild(_span);
}
