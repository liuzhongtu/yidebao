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

//  少儿医疗险
$sql = "SELECT * FROM tbl_product_basic_info WHERE find_in_set('少儿医疗险', product_type)";
$retval = mysql_query($sql, $conn) or die(mysql_error());

while($row = mysql_fetch_array($retval))
 {
    echo "<insurance_child_health>";
     echo "<product_name>" . $row['product_name'] . "</product_name>";
     echo "<product_type>" . '少儿医疗险' . "</product_type>";
     echo "<company>" . $row['company'] . "</company>";
     echo "<product_img>" . $row['product_img'] . "</product_img>";
     echo "<keywords>" . $row['keywords'] . "</keywords>";
     echo "<main_risk>". $row['main_risk'] . "</main_risk>";
    echo "</insurance_child_health>";
 }


echo "</ydb>";
mysql_close($conn);
    
?>
