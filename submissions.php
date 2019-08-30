<?php
    if(isset($_POST['submit'])){
        $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
        $group = htmlspecialchars(stripslashes(trim($_POST['group'])));
        $email = htmlspecialchars(stripslashes(trim($_POST['email'])));
        $phone = htmlspecialchars(stripslashes(trim($_POST['phone'])));
        $to = 'jordan.grogan@xr.church';
        $subject = "Group Interest - " + $name;
        $body = "This person is interested in a group:\nName: $name\n E-mail: $email\n Phone: $phone\n Group: $group";
        mail($to, $subject, $body);
    }
