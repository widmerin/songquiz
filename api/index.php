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
$app->get('/score/highscore/', 'getHighscore');
$app->post('/user', 'addUser');
$app->post('/score', 'addScore');

//Get LoginData from DB
function getLogin() {
    echo "Validate User data";
    $app = \Slim\Slim::getInstance();

    $conn = getDB();
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
    echo "Show Highscore";
    $app = \Slim\Slim::getInstance();

    $conn = getDB();
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
