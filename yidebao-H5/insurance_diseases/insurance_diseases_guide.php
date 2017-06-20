<?php

// 连主库
$conn = mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);

if(! $conn )
{
 die('Could not connect: ' . mysql_error());
}
 
mysql_select_db('app_wxprj');


/*
echo "Fetched data successfully\n"."<br><br>";

*/

 
$insurance_period = $_GET["insurance_period"];
$severe_times = $_GET["severe_times"];
$severe_num = $_GET["severe_num"];
$mild_times = $_GET["mild_times"];
$green_channel = $_GET["green_channel"];
$holder_exemption= $_GET["holder_exemption"];
$mild_case_exemption = $_GET["mild_case_exemption"];
$i=$_GET["i"];



////////////////////////////////////////////////////////////////////////////////////////
///     查tbl_product_disease表

$overal_search=1;   //  为1表明要对所有条件进行查询，否则，只查单项的

//  保障期限
$condition_insurance_period="";
if($insurance_period==0)
    $overal_search=0;        
if($insurance_period==1)
    $condition_insurance_period="(insurance_period='~60' OR insurance_period='~70' OR insurance_period='~60;~70')";
else
    $condition_insurance_period="insurance_period='999'";


//  重疾赔付次数
$condition_severe_times="";
if($severe_times==0)
    $overal_search=0;
else if($severe_times==1)
    $condition_severe_times= "severe_case_times=1 "; 
else  
    $condition_severe_times= "severe_case_times>1 "; 

//  重疾数目
 $condition_severe_num="";
if($severe_num==0)
    $overal_search=0;
else if($severe_num==1)
    $condition_severe_num= "severe_case_num=60"; 
else if($severe_num==2) 
    $condition_severe_num= "severe_case_num=80";
else
    $condition_severe_num= "severe_case_num>=100";


//  轻疾赔付次数
$condition_mild_times="";
if($mild_times==0)
    $overal_search=0;
else if($mild_times==1)
    $condition_mild_times= "mild_case_times=1"; 
else if($mild_times==2) 
    $condition_mild_times= "(mild_case_times=2 OR mild_case_times=3)";
else
    $condition_mild_times= "mild_case_times>3"; 

//  绿通服务
$condition_green_channel="";
if($green_channel==0)
    $overal_search=0;
else if($green_channel==1)
    $condition_green_channel = "green_channel=1";
else
    $condition_green_channel = "green_channel=0";

//  投保人豁免
$condition_holder_exemption="";
if($holder_exemption==0)
    $overal_search=0;
else if($holder_exemption==1)
    $condition_holder_exemption="holder_exemption=1";
else
    $condition_holder_exemption="holder_exemption=0";

//  投保人豁免
$condition_mild_case_exemption="";
if($mild_case_exemption==0)
    $overal_search=0;
else if($mild_case_exemption==1)
    $condition_mild_case_exemption="mild_case_exemption=1";
else
    $condition_mild_case_exemption="mild_case_exemption=0";

/////////////////////////////////////////////////////////////////////////////////////////////////
///  对所有条件一起查询
$overal_result="";
if($overal_search){
    $sql = sprintf("SELECT * FROM tbl_product_disease WHERE %s AND %s AND %s AND %s AND %s AND %s", $condition_severe_times, $condition_severe_num, $condition_mild_times, $green_channel, $condition_holder_exemption, $condition_mild_case_exemption);

    $retval = mysql_query($sql, $conn) or die(mysql_error());

    $name_array=array();
    while($row = mysql_fetch_array($retval)){
        array_push($name_array, $row['product_name']);
    } 
}

////////////////////////////////////////////////////////////////////////////////////////
///     查tbl_product_basic_info表

$output_array=array();
if($overal_search==1 || $insurance_period !=0){
    $sql = sprintf("SELECT * FROM tbl_product_basic_info WHERE %s AND product_type='重疾险'", $condition_insurance_period);

    $retval = mysql_query($sql, $conn) or die(mysql_error());

    $products1="";
    while($row = mysql_fetch_array($retval)){

        if($overal_search==1){
            if (in_array($row['product_name'], $name_array)) {
                array_push($output_array, $row['product_name']);
            }           
        }
 
        if($i==1){
            if($products1=="")
                $products1=$row['product_name'];
            else
                $products1=$products1.";".$row['product_name'];
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////
///     两表汇总
if (count($output_array)>0) {
    $overal_result = $output_array[0];
    if(count($output_array)>1){
        for ($i=1; $i < count($output_array); $i++) { 
            $overal_result = $overal_result.";".$output_arry[i];        
        }
    }
}    

/////////////////////////////////////////////////////////////////////////////////////////
///     再查单项，并把单项结果附在汇总结果上
$single_result="";   
switch ($i)
{
 case 1:        //  用户点击的是保障期限
    $single_result=$products1;
    break;
 case 2:        //  用户点击的是重疾次数
    $sql = sprintf("SELECT * FROM tbl_product_disease WHERE %s", $condition_severe_times);
    $retval = mysql_query($sql, $conn) or die(mysql_error());

    while($row = mysql_fetch_array($retval)){
        if($single_result=="")
            $single_result=$row['product_name'];
        else
            $single_result=$single_result.";".$row['product_name'];        
    }
 
    break;
 case 3:        //  用户点击的是重疾个数
    $sql = sprintf("SELECT * FROM tbl_product_disease WHERE %s", $condition_severe_num);
    $retval = mysql_query($sql, $conn) or die(mysql_error());

    while($row = mysql_fetch_array($retval)){
        if($single_result=="")
            $single_result=$row['product_name'];
        else
            $single_result=$single_result.";".$row['product_name'];        
    }

    break;
 case 4:        //  用户点击的是轻疾个数
    $sql = sprintf("SELECT * FROM tbl_product_disease WHERE %s", $condition_mild_times);
    $retval = mysql_query($sql, $conn) or die(mysql_error());

    while($row = mysql_fetch_array($retval)){
        if($single_result=="")
            $single_result=$row['product_name'];
        else
            $single_result=$single_result.";".$row['product_name'];        
    }
  
    break;
 case 5:        //  用户点击的是绿通
    $sql = sprintf("SELECT * FROM tbl_product_disease WHERE %s", $condition_green_channel);
    $retval = mysql_query($sql, $conn) or die(mysql_error());

    while($row = mysql_fetch_array($retval)){
        if($single_result=="")
            $single_result=$row['product_name'];
        else
            $single_result=$single_result.";".$row['product_name'];        
    }

    break;
 case 6:        //  用户点击的是投保人豁免
    $sql = sprintf("SELECT * FROM tbl_product_disease WHERE %s", $condition_holder_exemption);
    $retval = mysql_query($sql, $conn) or die(mysql_error());

    while($row = mysql_fetch_array($retval)){
        if($single_result=="")
            $single_result=$row['product_name'];
        else
            $single_result=$single_result.";".$row['product_name'];        
    }

    break;
 case 7:        //  用户点击的是轻症豁免
    $sql = sprintf("SELECT * FROM tbl_product_disease WHERE %s", $condition_mild_case_exemption);
    $retval = mysql_query($sql, $conn) or die(mysql_error());

    while($row = mysql_fetch_array($retval)){
        if($single_result=="")
            $single_result=$row['product_name'];
        else
            $single_result=$single_result.";".$row['product_name'];        
    }

    break;
}

echo  $overal_result."+".$single_result;

mysql_close($conn);
    
?>
