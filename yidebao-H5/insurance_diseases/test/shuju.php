<?php

// 连主库
$conn = mysql_connect$conn = mysql_connect("localhost","root","");

if(! $conn )
{
 die('Could not connect: ' . mysql_error());
}
 
mysql_select_db('app_wxprj');

/*

echo "Fetched data successfully\n"."<br><br>";
*/

////////////////////////////////////////////////////////////////////////////////////////
///     查tbl_company表


$product_name = urldecode($_GET["product_name"]);
$sql = sprintf("SELECT * FROM tbl_product_classified_disease WHERE product_name='%s'", $product_name);

$retval = mysql_query($sql, $conn) or die(mysql_error());
$row = mysql_fetch_array($retval);
echo $row['local_url'];

mysql_close($conn);
    
?>
