<?php

header('Content-Type: text/xml');
header("Cache-Control: no-cache, must-revalidate");

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

//  定期寿险
//  
$product_name = urldecode($_GET["product_name"]);


$sql = sprintf("SELECT * FROM tbl_product_disease WHERE product_name='%s'", $product_name);

$retval = mysql_query($sql, $conn) or die(mysql_error());
$row = mysql_fetch_array($retval);

/*
if($row)
    $row['sickness_death_payment'].";".$row['return_rate'].";".$row['general_accident_payment'].";".$row['traffic_accident_payment'].";".$row['traffic_accident_payment'].";".$row['driving_accident_payment'].";".$row['natural_disaster_payment'].";".$row['aircraft_accident_payment'].";".$row['medical_expenses_day_payment'];
else
     echo "";
*/

if($row){
     echo $row['severe_case_num']."#".$row['mild_case_num']."#".$row['severe_case_times']."#".$row['mild_case_times']."#".$row['mild_compensate_percent']."#".$row['birthday_gift_age']."#".$row['age18_death_compensate']."#".$row['severe_case']."#".$row['mild_case']."#".$row['has_deformity']."#".$row['has_final_stage']."#".$row['green_channel']."#".$row['holder_exemption']."#".$row['mild_case_exemption'];
}
else{
     echo "";
}


mysql_close($conn);
    
?>
