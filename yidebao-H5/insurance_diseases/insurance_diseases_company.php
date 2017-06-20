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
///     查tbl_company表


$company_name = urldecode($_GET["company_name"]);
$sql = sprintf("SELECT * FROM tbl_company WHERE name='%s'", $company_name);

$retval = mysql_query($sql, $conn) or die(mysql_error());
$row = mysql_fetch_array($retval);
echo $row['local_url'];

mysql_close($conn);
    
?>
