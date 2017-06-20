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


$sql = sprintf("SELECT * FROM tbl_product_annuity WHERE product_name='%s'", $product_name);

//echo $sql."<br><br>";

$retval = mysql_query($sql, $conn) or die(mysql_error());
$row = mysql_fetch_array($retval);

if($row){
     echo $row['immediate_collar'].";".
          $row['start_payment_year'].";".
          $row['annual_payment_before_60'].";".
          $row['annual_payment_after_60'].";".
          $row['full_term_survival_money'].";".
          $row['full_term_time'];
}
else{
     echo "";
}


mysql_close($conn);
    
?>
