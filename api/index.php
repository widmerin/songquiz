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


$app->get('/quote/random', function (){
	echo "Get Random Quotes";
});

//GET highscore
$app->get('/highscore/', function (){
    echo "Show Highscore";
    $app = \Slim\Slim::getInstance();

    $conn = getDB();
    // SELECT ...
    $conn->close();
});




$app->run();
