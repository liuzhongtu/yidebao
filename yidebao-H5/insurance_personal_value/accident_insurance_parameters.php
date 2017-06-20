<?php

header('Content-Type: text/xml');
header("Cache-Control: no-cache, must-revalidate");

$q=$_GET["q"];

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


echo '<?xml version="1.0" encoding="utf-8"?><ydb>';
echo "<accident_insurance>";


//  定期寿险
//  
$product_name = urldecode($_GET["product_name"]);


$sql = sprintf("SELECT * FROM tbl_product_basic_info WHERE product_name='%s'", $product_name);

$retval = mysql_query($sql, $conn) or die(mysql_error());
$row = mysql_fetch_array($retval);
if($row)
 {
     echo "<product_name>" . $row['product_name'] . "</product_name>";
     echo "<product_type>" . $row['product_type'] . "</product_type>";
     echo "<company>" . $row['company'] . "</company>";
     echo "<main_risk>". $row['main_risk'] . "</main_risk>";

     echo "<coverage_range>" . $row['coverage_range'] . "</coverage_range>";
     echo "<insurance_period>" . $row['insurance_period'] . "</insurance_period>";
     echo "<payment_period>" . $row['payment_period'] . "</payment_period>";

 }
 else
 {
     echo "<product_name></product_name>";
     echo "<product_type></product_type>";
     echo "<company></company>";
     echo "<main_risk></main_risk>";

     echo "<coverage_range></coverage_range>";
     echo "<insurance_period></insurance_period>";
     echo "<payment_period></payment_period>";
 }

echo "</accident_insurance>";
echo "</ydb>";
mysql_close($conn);
    
?>
