<?php
$file_tmp_name    = $_FILES['file']['tmp_name'];
$file_name        = $_FILES['file']['name'];
$file_size        = $_FILES['file']['size'];
$file_type        = $_FILES['file']['type'];
$file_error       = $_FILES['file']['error'];

$subject = 'PARTNERSHIP REQUEST'; //subject of email
$message = "\rCompany: {$_POST['company']};\r\nCompany representative: {$_POST['name']};\r\nCompany web site: {$_POST['site']};\r\nContact email: {$_POST['email']};\r\n"; //message body

$from_email = $recipient_email = filter_var('sec@bettertokens.org', FILTER_SANITIZE_EMAIL);

if(!empty($_FILES['file']['name']) && $file_error > 0)
{
    die('upload error');
}

if ($file_name) {
    $handle = fopen($file_tmp_name, "r");
    $content = fread($handle, $file_size);
    fclose($handle);
}

$encoded_content = chunk_split(base64_encode($content));


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

if ($file_name) {
    //attachment
    $body .= "--$boundary\r\n";
    $body .="Content-Type: $file_type; name=\"$file_name\"\r\n";
    $body .="Content-Disposition: attachment; filename=\"$file_name\"\r\n";
    $body .="Content-Transfer-Encoding: base64\r\n";
    $body .="X-Attachment-Id: ".rand(1000,99999)."\r\n\r\n";
    $body .= $encoded_content;
}



$sentMail = @mail($recipient_email, $subject, $body, $headers);
if($sentMail) //output success or failure messages
{
    die('Thank you for your email');
}else{
    die('Could not send mail! Please check your PHP mail configuration.');
}

?>
