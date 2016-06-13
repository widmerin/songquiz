<?php
/**
 * REST API - Songquiz
 * Created by mj, iw, yh on 10.06.2016
 * @ FHNW iCompetence webeng FS2016
 */

require 'Slim/Slim.php';
require 'dbConnect.php';

\Slim\Slim::registerAutoloader();


$app = new \Slim\Slim();
$app->post('/user', 'getLogin');
$app->post('/user/add', 'addUser');
$app->post('/score', 'addScore');
$app->get('/user', 'getLogout');
$app->get('/score/highscore', 'getHighscore');
$app->get('/score/user', 'getUserscore');
$app->get('/billboard', 'getArtists');


function getLogout() {
    $app = \Slim\Slim::getInstance();
    session_start();
    echo session_status();
    session_unset(); 
    session_destroy();
    echo session_status();
    if (session_status() == PHP_SESSION_NONE) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => true ));
    } else{
         echo json_encode(array('success' => false ));
    }
}

//Get LoginData from DB
function getLogin() {
    $app = \Slim\Slim::getInstance();
    //$app->setCookie('foo', 'bar', '5 minutes');
    $login = json_decode($app->request()->getBody());
    $cookies = $app->cookies;
    $username = $login->{'user'};
    $password = $login->{'pw'};
    $conn = getDB();
    //$stmt = $conn->prepare('SELECT password FROM user WHERE username=? and password=?');
    //$stmt->bind_param('ss', $username, $password);
    $stmt = $conn->prepare('SELECT password, id FROM user WHERE username=?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows >= "1") {
        $row = $result->fetch_row();
        $pwVerified = password_verify($password, $row[0]);
        if ($pwVerified) {
            //session start
            session_start();
            // Set session variables
            $userid =  $row[1];
            $_SESSION["userid"] = $userid;
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => true, 'pw' => $password, 'pwHash' => $row[0], 'pwVerified' => $pwVerified, 'userid' => $_SESSION["userid"],
            ));

        }
        else {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => false, 'pw' => $password, 'pwHash' => $row[0], 'pwVerified' => $pwVerified,
            ));
            //$app->deleteCookie('foo');
        }
    }
    else {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('success' => false, 'pw' => $password,
        ));
    }
    $conn->close();
}

//Create new User in DB
function addUser() {
    $app = \Slim\Slim::getInstance()->request();
    $login = json_decode($app->getBody());
    $username = $login->{'user'};
    $password = $login->{'pw'};

    /**
     * Note that the salt here is randomly generated.
     * Never use a static salt or one that is not randomly generated.
     *
     * For the VAST majority of use-cases, let password_hash generate the salt randomly for you
     */
    //$options = [
       // 'salt' => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM),
    //];
    $pwSaltedHashed = password_hash($password, PASSWORD_BCRYPT);

    $conn = getDB();

    $logstmt = $conn->prepare('SELECT password FROM user WHERE username=?');
    $logstmt->bind_param('s', $username);
    $logstmt->execute();
    $result = $logstmt->get_result();
    if ($result->num_rows >= "1") {
           header('Content-Type: application/json; charset=utf-8');
           echo json_encode(array('success' => false, 'errmsg' => 1,
           ));
    }
    else {
        $stmt = $conn->prepare('INSERT INTO user(username, password) VALUES (?, ?)');
        $stmt->bind_param('ss', $username, $pwSaltedHashed);
        $conn->begin_Transaction();

        $success = $stmt->execute();
        if($success) {
            $conn->commit();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => true,));
        }
        else {
            $conn->rollBack();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => false, 'errmsg' => 2,));
        }
    }
    $conn->close();
}


//Get highscore from DB
function getHighscore() {
    $app = \Slim\Slim::getInstance();

    $conn = getDB();

    //Gets correct Answers per User in %
    $sql = "SELECT  u.username,  100/SUM(s.playedQuestions)*SUM(s.correctAnswers) as total, SUM(s.playedQuestions) as played FROM  score s, user u where s.userid=u.id GROUP BY u.id ORDER BY total DESC LIMIT 9";

    $result = mysqli_query ($conn,$sql);
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    if ($result->num_rows >= "1") {
        header('Content-Type: application/json; charset=utf-8');
        echo '{"highscore": ' . json_encode($rows) . '}';
    } else {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('success' => false, 'errmsg' => 2,));    
    }
    $conn->close();
}

//Get Userscore from DB
function getUserscore() {
    session_start();
    if($_SESSION["userid"]) {
        $app = \Slim\Slim::getInstance();
        $conn = getDB();
        $userid = $_SESSION["userid"];
        // prepare
        $sql1 = "SELECT 100/SUM(s.playedQuestions)*SUM(s.correctAnswers) as total, SUM(s.playedQuestions) as played FROM  score s, user u where s.userid=u.id AND u.id =";
        $sql2 = $sql1.$userid;
        echo($sql2);
        $result = mysqli_query($conn,$sql2);
        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        if ($result->num_rows >= "1") {
            header('Content-Type: application/json; charset=utf-8');
            echo '{"userscore": ' . json_encode($rows) . '}';
        } else {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => false, 'errmsg' => 2,));
        }
        $conn->close();
    }
}


//Save Score in DB
function addScore() {
    
    // set parameters and execute
    session_start();

    if($_SESSION["userid"]) {
    $app = \Slim\Slim::getInstance()->request();
    $conn = getDB();

        $score = json_decode($app->getBody());
        $userid = $_SESSION["userid"];
        // prepare and bind
        $stmt = $conn->prepare("INSERT INTO score (userid, playedQuestions, correctAnswers) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $userid, $playedQuestions, $correctAnswer);

        
        $playedQuestions = $score->playedQuestions;
        $correctAnswer = $score->correctAnswers;
        $success = $stmt->execute();
        if($success) {
            $conn->commit();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => true, 'userid' =>$userid,
            ));
        }
        else {
            $conn->rollBack();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => false, 'errmsg' => 2, 'userid' =>$userid,
            ));
        }
    $conn->close();
    } else {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => false, 'errmsg' => 2, 'userid' =>'no user found',
            ));
    }
    
    
}


//getArtists from DB
function getArtists() {
    $app = \Slim\Slim::getInstance();

    $conn = getDB();

    //get all artists from billboard list
    $sql = "SELECT  artist FROM  billboard";         // " ORDER BY RAND() LIMIT 4"; is slow

    $result = mysqli_query ($conn,$sql);
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    if ($result->num_rows >= "1") {
        echo json_encode($rows);
    } else {
        echo json_encode(array('success' => false, 'errmsg' => 'no artist found'));
    }
    $conn->close();
}

$app->run();
