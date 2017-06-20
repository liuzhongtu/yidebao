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


//  定期寿险
$sql = "SELECT * FROM tbl_product_basic_info WHERE product_type='定期寿险'";
$retval = mysql_query($sql, $conn) or die(mysql_error());

while($row = mysql_fetch_array($retval))
 {
    echo "<term_life>";
     echo "<product_name>" . $row['product_name'] . "</product_name>";
     echo "<product_type>" . $row['product_type'] . "</product_type>";
     echo "<company>" . $row['company'] . "</company>";
     echo "<product_img>" . $row['product_img'] . "</product_img>";
     echo "<keywords>" . $row['keywords'] . "</keywords>";
     echo "<main_risk>". $row['main_risk'] . "</main_risk>";
    echo "</term_life>";
 }


//  意外险
$sql = "SELECT * FROM tbl_product_basic_info WHERE product_type='意外险'";
$retval = mysql_query($sql, $conn) or die(mysql_error());

while($row = mysql_fetch_array($retval))
 {
    echo "<accident_insurance>";
     echo "<product_name>" . $row['product_name'] . "</product_name>";
     echo "<product_type>" . $row['product_type'] . "</product_type>";
     echo "<company>" . $row['company'] . "</company>";
     echo "<product_img>" . $row['product_img'] . "</product_img>";
     echo "<keywords>" . $row['keywords'] . "</keywords>";
     echo "<main_risk>". $row['main_risk'] . "</main_risk>";
    echo "</accident_insurance>";
 }

echo "</ydb>";
mysql_close($conn);
    
?>
