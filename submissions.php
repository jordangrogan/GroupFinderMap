<?php
require 'config.php';
require 'Twilio/autoload.php';

/* EMAIL TO SMALL GROUPS TEAM */
$name = htmlspecialchars(stripslashes(trim($_POST['name'])));
$group = htmlspecialchars(stripslashes(trim($_POST['group'])));
$email = htmlspecialchars(stripslashes(trim($_POST['email'])));
$phone = htmlspecialchars(stripslashes(trim($_POST['phone'])));
$to = 'jordan.grogan@xr.church';
$subject = "Small Group Interest - " . $name;
$body = "This person is interested in a small group:<br /><strong>Name</strong>: " . $name . "<br /><strong>Email</strong>: " . $email . "<br /><strong>Phone</strong>: " . $phone . "<br /><strong>Small Group</strong>: " . $group;
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: "Crossroads Web Team" <webteam@xr.church>' . "\r\n";

/* TEXT TO USER */
$message =  "Here are the small group details:\n" . $group;
$client = new Twilio\Rest\Client(TWILIO_SID, TWILIO_TOKEN);
$message = $client->messages->create(
    $phone, // Text this number
    array(
        'from' => TWILIO_PHONE_NUMBER, // From a valid Twilio number
        'body' => $message
    )
);

/* Send email to small group team */
if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
} else {
    http_response_code(400);
}
