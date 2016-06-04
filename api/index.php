<?php
/**
 * REST API - Songquiz
 *
 */

require 'Slim/Slim.php';
require 'dbConnect.php';

\Slim\Slim::registerAutoloader();


$app = new \Slim\Slim();
$app->post('/user', 'getLogin');
$app->get('/score/highscore', 'getHighscore');
$app->post('/user/add', 'addUser');
$app->post('/score', 'addScore');
$app->get('/score', 'getScore');
$app->get('/billboard', 'getArtists');

//Get LoginData from DB
function getLogin() {
    $app = \Slim\Slim::getInstance()->request();
    $login = json_decode($app->getBody());
    $username = $login->{'user'};
    $password = $login->{'pw'};
    //echo $username;
    //echo $password;
    //$username = mysql_real_escape_string($_GET['email']);
    //$password = mysql_real_escape_string($_GET['pw']);
    $conn = getDB();
    $stmt = $conn->prepare('SELECT password FROM user WHERE username=? and password=?');
    $stmt->bind_param('ss', $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows >= "1") {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('success' => true,
        ));
    }
    else {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('success' => false,
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
        $stmt->bind_param('ss', $username, $password);
        $conn->begin_Transaction();

        $success = $stmt->execute();
        if($success) {
            $conn->commit();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => true,
            ));
        }
        else {
            $conn->rollBack();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => false, 'errmsg' => 2,
            ));
        }
    }
    $conn->close();
}


//Get highscore from DB
function getHighscore() {
    $app = \Slim\Slim::getInstance();

    $conn = getDB();

    //Gets correct Answers per User in %
    $sql = "SELECT  u.username,  100/SUM(s.playedQuestions)*SUM(s.correctAnswers) as total FROM  score s, user u where s.userid=u.id GROUP BY u.id ORDER BY total DESC";

    $result = mysqli_query ($conn,$sql);
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo '{"highscore": ' . json_encode($rows) . '}';
    $conn->close();
}
/*
//Get highscore from DB via PDO // not finished
function getHighscore() {
    $sql_query = "SELECT  u.username,  100/SUM(s.playedQuestions)*SUM(s.correctAnswers) as total FROM  score s, user u where s.userid=u.id GROUP BY u.id ORDER BY total DESC";
        try {
        $dbCon = getDB();
        $stmt   = $dbCon->query($sql_query);
        $result  = $stmt->fetchAll(PDO::FETCH_OBJ);
        $dbCon = null;
        $rows = array();
        while ($row = $result->fetch_assoc()) { // this is unclear
            $rows[] = $row;
        }
        echo '{"highscore": ' . json_encode($rows) . '}';
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
*/


//Save Score in DB
function addScore() {
    
    $app = \Slim\Slim::getInstance()->request();
    $conn = getDB();

        $score = json_decode($app->getBody());

        // prepare and bind
        $stmt = $conn->prepare("INSERT INTO score (userid, playedQuestions, correctAnswers) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $userid, $playedQuestions, $correctAnswer);

        // set parameters and execute
        $userid = $score->userid;
        $playedQuestions = $score->playedQuestions;
        $correctAnswer = $score->correctAnswers;
        $stmt->execute();
        $success = $stmt->execute();
        if($success) {
            $conn->commit();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => true,
            ));
        }
        else {
            $conn->rollBack();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(array('success' => false, 'errmsg' => 2,
            ));
        }
    
    $conn->close();
}

function getScore() {
    echo("GET SCORE");
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
    echo json_encode($rows);
    $conn->close();
}

/*      PDO function
function getArtists() {
    $sql_query = "SELECT  artist FROM  billboard";
    try {
        $dbCon = getDB();
        $stmt   = $dbCon->query($sql_query);
        $artists  = $stmt->fetchAll(PDO::FETCH_OBJ);
        $dbCon = null;
        echo '{"artists": ' . json_encode($artists) . '}';
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
*/

$app->run();
