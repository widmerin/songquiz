<?php
/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';
require 'dbConnect.php';

\Slim\Slim::registerAutoloader();


$app = new \Slim\Slim();
$app->get('/user', 'getLogin');
$app->get('/score/highscore', 'getHighscore');
$app->post('/user', 'addUser');
$app->post('/score', 'addScore');

//Get LoginData from DB
function getLogin() {
    echo "Validate User data";
    $app = \Slim\Slim::getInstance();

    $conn = getDB();
    // Ist die $_POST Variable submit nicht leer ???
    // dann wurden Logindaten eingegeben, die müssen wir überprüfen !
    if (!empty($_POST["submit"]))
        {
        // Die Werte die im Loginformular eingegeben wurden "escapen",
        // damit keine Hackangriffe über den Login erfolgen können !
        // Mysql_real... ist auf jedenfall dem Befehle addslashes()
        // vorzuziehen !!! Ohne sind mysql injections möglich !!!!
        $_username = mysql_real_escape_string($_POST["username"]);
        $_password = mysql_real_escape_string($_POST["passwort"]);

        // Befehl für die MySQL Datenbank
        // Wichtig ist, die Variablen von $_username und $_passwort
        // zu umklammern. Da wir mit Anführungszeichen den SQL String
        // angeben, nehmen wir dafür die einfachen Anführungszeichen
        // die man neben der Enter Taste auf der # findet !
        $_sql = "SELECT * FROM user WHERE
                    username='$_username' AND
                    password='$_password'// AND
                    //user_geloescht=0
                LIMIT 1";

        // Prüfen, ob der User in der Datenbank existiert !
        $_res = mysql_query($_sql, $conn);
        $_anzahl = @mysql_num_rows($_res);

        // Die Anzahl der gefundenen Einträge überprüfen. Maximal
        // wird 1 Eintrag rausgefiltert (LIMIT 1). Wenn 0 Einträge
        // gefunden wurden, dann gibt es keinen Usereintrag, der
        // gültig ist. Keinen wo der Username und das Passwort stimmt
        // und user_geloescht auch gleich 0 ist !
        if ($_anzahl > 0)
            {
            echo "Der Login war erfolgreich.<br>";

            // In der Session merken, dass der User eingeloggt ist !
            $_SESSION["login"] = 1;

            // Den Eintrag vom User in der Session speichern !
            $_SESSION["user"] = mysql_fetch_array($_res, MYSQL_ASSOC);

            // Das Einlogdatum in der Tabelle setzen !
            $_sql = "UPDATE login_usernamen SET letzter_login=NOW()
                     WHERE id=".$_SESSION["user"]["id"];
            mysql_query($_sql);
            }
        else
            {
            return false;
            //echo "Die Logindaten sind nicht korrekt.<br>";
            }
        }

    // Ist der User eingeloggt ???
    if ($_SESSION["login"] == 0)
        {
        // ist nicht eingeloggt, also Formular anzeigen, die Datenbank
        // schliessen und das Programm beenden
        //include("login-formular.html");
        mysql_close($conn);
        exit;
        }

    // Hier wäre der User jetzt gültig angemeldet ! Hier kann
    // Programmcode stehen, den nur eingeloggte User sehen sollen !!
    //include_once 'login.php';
    // SELECT ...
}

//Create new User in DB
function addUser() {
    echo "Create new User";
    $app = \Slim\Slim::getInstance();

    $conn = getDB();
    // SELECT ...
}


//Get highscore from DB
function getHighscore() {
    $app = \Slim\Slim::getInstance();

    $conn = getDB();
    $sql = "SELECT  u.username,  100/SUM(s.playedQuestions)*SUM(s.correctAnswers) as total FROM  score s, user u where s.userid=u.id GROUP BY u.id ORDER BY total DESC";


    $result = mysqli_query ($conn,$sql);
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo '{"highscore": ' . json_encode($rows) . '}';
    $conn->close();

    // SELECT ...
}

//Save Score in DB
function addScore() {
    echo "Add new Score";
    $app = \Slim\Slim::getInstance();

    $conn = getDB();
    // SELECT ...
}

$app->run();
