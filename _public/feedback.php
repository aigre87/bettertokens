<?php

require_once "Mail.php";

$file_tmp_name = array();
$file_name = array();
$file_size = array();
$file_type = array();

$count = 0;
foreach ( $_FILES['file']['name'] as $file ) {
   $file_tmp_name[$count] = $_FILES['file']['tmp_name'][$count];
   $file_size[$count] = $_FILES['file']['size'][$count];
   $file_type[$count] = $_FILES['file']['type'][$count];
   $file_name[$count] = $file;
   $count = $count + 1;
}

$subject = 'MEMBERSHIP APPLICATION'; //subject of email
$message = "\rEmail: {$_POST['email']};\r\nLink to project’s website: {$_POST['link']};\r\nToken ID: {$_POST['tokenid']};\r\nName of Project: {$_POST['projectname']};\r\nCrypto-wallet address: {$_POST['address']};\r\nRequested ticker: {$_POST['ticker']};\r\ndescription: {$_POST['description']};\r\n";

$from_email = $recipient_email = filter_var('sec@bettertokens.org', FILTER_SANITIZE_EMAIL);


$encoded_content = array();
$count = 0;
foreach ( $file_tmp_name as $name ) {
	$handle = fopen($name, "r");
	$content = fread($handle, $file_size[$count]);
	fclose($handle);
	$encoded_content[$count] = chunk_split(base64_encode($content));
	$count = $count + 1;
}

$boundary = md5("sanwebe");
//header
$headers = "MIME-Version: 1.0\r\n";
$headers .= "From:".$from_email."\r\n";
$headers .= "Reply-To: ".$recipient_email."" . "\r\n";
$headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";

//plain text
$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=utf-8\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$body .= chunk_split(base64_encode($message));

$count = 0;
foreach ( $encoded_content as $file ) {
    //attachment
    $body .= "--$boundary\r\n";
    $body .="Content-Type: $file_type[$count]; name=\"$file_name[$count]\"\r\n";
    $body .="Content-Disposition: attachment; filename=\"$file_name[$count]\"\r\n";
    $body .="Content-Transfer-Encoding: base64\r\n";
    $body .="X-Attachment-Id: ".rand(1000,99999)."\r\n\r\n";
    $body .= $file;
    $count = $count + 1;
}


ini_set('SMTP', 'smtp.wavesplatform.com'); 
ini_set('smtp_port', 25); 


$sentMail = @mail($recipient_email, $subject, $body, $headers);
if($sentMail) //output success or failure messages
{
    die('Thank you for your email');
}else{
    die('Could not send mail! Please check your PHP mail configuration.');
}

//$from = "Support Bettertokens <sec@bettertokens.org>";
//$host = "smtp.wavesplatform.com";
//$headers = array ('From' => $from,
//    'To' => $recipient_email,
//    'Subject' => $subject);
//$smtp = Mail::factory('smtp',
//    array ('host' => $host,
//    'auth' => false));
//$mail = $smtp->send($recipient_email, $headers, $body);
//
//die('Thank you for your email');

?>
