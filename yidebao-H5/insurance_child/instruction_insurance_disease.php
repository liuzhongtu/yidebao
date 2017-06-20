<?php
// 连主库
$conn = mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);

if(! $conn )
{
 die('Could not connect: ' . mysql_error());
}
 
mysql_select_db('app_wxprj');
/*
$sql = 'SELECT products_name, gender , 
        coverage, age_0
    FROM tbl_premium_rate where products_name="康健人生" AND gender = 1';
$retval = mysql_query( $sql, $conn );
if(! $retval )
{
 die('Could not get data: ' . mysql_error());
}
while($row = mysql_fetch_array($retval, MYSQL_ASSOC))
{
  echo "products_name :{$row['products_name']} <br> ".
     "gender: {$row['gender']} <br> ".
     "coverage: {$row['coverage']} <br> ".
     "age_0 : {$row['age_0']} <br> ".
     "--------------------------------<br>";
} 
echo "Fetched data successfully\n"."<br><br>";
*/

$product_name = urldecode($_GET["product_name"]);
$gender = $_GET["gender"];
$period = $_GET["period"];
$age = $_GET["age"];


$sql = sprintf("SELECT * FROM tbl_premium_rate WHERE product_name='%s' AND gender=%d AND period=%d", $product_name, $gender, $period);
$retval = mysql_query($sql, $conn) or die(mysql_error());

$premium_rate = mysql_result($retval, 0, 5+$age);

echo $premium_rate;

mysql_close($conn);
    
?>
