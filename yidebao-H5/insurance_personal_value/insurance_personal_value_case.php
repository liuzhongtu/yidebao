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

////////////////////////////////////////////////////////////////////////////////////////
///     查tbl_product_basic_info表


$overal_result="";
$product_name = urldecode($_GET["product_name"]);

$sql = sprintf("SELECT * FROM tbl_product_basic_info WHERE product_name='%s'", $product_name);

$retval = mysql_query($sql, $conn) or die(mysql_error());
$row = mysql_fetch_array($retval);
echo $row['case'];

mysql_close($conn);
    
?>
