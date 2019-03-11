
<html>
<head>
  <style type="text/css">
    .button {
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100px; /* width of button */
    height: 30px; /* height of button */
}


  </style>
   
</head>
<body>
<?php
// Start the session
session_start();
?>

<!DOCTYPE html>
<html>
<body>


<?php
// Set session variables
//$_SESSION["favcolor"] = "green";
//$_SESSION["favanimal"] = "cat";
//echo "Session variables are set.";
?>

<?php 

  function get_data($url) {
        $ch = curl_init();
        $timeout = 5;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
   }

   $service = "http%3A%2F%2Fcse.unl.edu/~gpred/login.php";
   $serviceURL = "http://cse.unl.edu/~gpred/login.php";
   $CASURL = "https://cse-apps.unl.edu/cas";
   $CASLogin = "$CASURL/login?service=$service";
   $CASLogout = "$CASURL/logout?service=$service";

   if (array_key_exists('logout', $_REQUEST)){

    unset($_SESSION['AUTH_USER']) ;
    print "<h3> I have a logout  $_REQUEST</h3>";
    header('Location: '.$CASLogout);

   # PROCESS CAS LOGIN..
   }elseif (array_key_exists('ticket', $_REQUEST)){

    $ticket = $_REQUEST['ticket'];
    print "<h3> I have a ticket and it is $ticket</h3>";

    $casAuthURL = "$CASURL/proxyValidate?service=$service&ticket=$ticket";
    $casData = get_data($casAuthURL);

    print "<pre>";
     //print_r($_REQUEST);
    print_r($_REQUEST);
    print "</pre><br/>";
    print $casData;
    $_SESSION['AUTH_USER'] = $casData;
    header('Location: '.$serviceURL);


   # SESSION IF SET will always be set when user returns to page....
   } elseif (  array_key_exists('AUTH_USER', $_SESSION)) {

      $user = $_SESSION['AUTH_USER'];  

      print "<h3> I have a AUTH_USER in session variable and the user is $user </h3>";
      print "User is successfully logged in as $user<br/>";
       <button class="button">The button</button> 
       print "<a href='http://cse.unl.edu/~gpred/login.php?logout=1'>Log Out</a><br/>";
     print "<a href='http://ec2-18-223-113-182.us-east-2.compute.amazonaws.com/#/'>Log In</a><br/>";


   # USER IS NOT LOGGGED IN!!! STEP 1 in login process...
   } else{

     print "User Not authenticated<br/>";
     header('Location: '.$CASLogin);

   }


?>

</body>
</html>
