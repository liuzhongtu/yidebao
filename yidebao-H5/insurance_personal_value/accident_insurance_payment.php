<?php

//header('Content-Type: text/xml');
//header("Cache-Control: no-cache, must-revalidate");


// 连主库
$conn = mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);

if(! $conn )
{
 die('Could not connect: ' . mysql_error());
}
 
mysql_select_db('app_wxprj');

//echo "Fetched data successfully\n"."<br><br>";


//  定期寿险
//  
$product_name = urldecode($_GET["product_name"]);


$sql = sprintf("SELECT * FROM tbl_product_term_life WHERE product_name='%s'", $product_name);

//echo $sql."<br><br>";

$retval = mysql_query($sql, $conn) or die(mysql_error());
$row = mysql_fetch_array($retval);

if($row){
     echo $row['return_rate'].";".$row['sickness_death_payment'].";". $row['general_accident_payment'].";".$row['traffic_accident_payment'].";".$row['driving_accident_payment'].";".$row['natural_disaster_payment'].";".$row['aircraft_accident_payment'].";".$row['medical_expenses_day_payment'];
}
else{
     echo "";
}


mysql_close($conn);
    
?>
