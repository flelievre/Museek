<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
//First welcome screen
Route::get('/', 'WelcomeController@index');
//When user click connect on first page to log with SC account
Route::get('play', 'UserController@connexion');

Route::resource('user', 'UserController');
Route::post('setMomenTrack', 'UserController@setMomenTrack');
Route::get('getMomenTracks', 'UserController@getMomenTracks');

Route::resource('refuse', 'RefuseController');
//Route::post('refuseTrack', 'RefuseController@refuse');
Route::post('refuseTrack', 'RefuseController@refuse');
Route::get('getMyRefuse', 'RefuseController@getMyRefuse');


Route::resource('notification', 'NotificationController');
Route::post('test', 'NotificationController@like');
Route::post('relike', 'NotificationController@relike');
Route::post('hideNotif', 'NotificationController@hideNotif');
Route::get('getMyNotifications', 'NotificationController@getMyNotifications');

Route::resource('recommendation', 'RecommendationController');
Route::post('sendReco', 'RecommendationController@sendReco');

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);
