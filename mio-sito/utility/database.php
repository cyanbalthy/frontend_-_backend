<?php
$hostname = '172.17.0.1:3306';
$username = 'root';
$password = 'my-secret-pw';
$db = 'mydb';

$mysqli=new mysqli($hostname,$username,$password,$db)
or die ("<br>Connessione non riuscita " . $mysqli->connect_error . " " . $mysqli->connect_errno);



?>