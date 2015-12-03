<!DOCTYPE html>
<html>
    <head>        
        <meta charset="utf-8">
        <meta name="csrf_token" content="{{ csrf_token() }}" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
        <link href='https://fonts.googleapis.com/css?family=Raleway:400,500,300,200' rel='stylesheet' type='text/css'>
        <title>Museek</title>
        {!! HTML::style('css/style.css') !!}
        {!! HTML::style('css/sprites.css') !!}
        {!! HTML::style('css/bootstrap.min.css') !!}
        
        {!! HTML::script('http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'); !!}
        {!! HTML::script('js/jquery-ui/jquery-ui.min.js'); !!}
        {!! HTML::script('js/bootstrap.min.js'); !!}
        <!--{!! HTML::script('http://d3js.org/d3.v3.min.js'); !!}!-->
        {!! HTML::script('//connect.soundcloud.com/sdk.js'); !!}
        {!! HTML::script('//w.soundcloud.com/player/api.js'); !!}
        <link rel="shortcut icon" href="{{{ asset('img/favicon.ico') }}}">
		<!--[if lt IE 9]>
			{{ Html::style('https://oss.maxcdn.com/libs/html5shiv/3.7.2/html5shiv.js') }}
			{{ Html::style('https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js') }}
		<![endif]-->
    </head>
    <body>
        <div id="volet" class='col-lg-6 col-md-6 col-sm-8 col-xs-10 col-xs-offset-1 col-sm-offset-2 col-md-offset-3 col-lg-offset-3'>
            <div class="row">
                <span class="delete col-xs-1 img30" onclick="closeRecommendMenu();"></span>
                <span class="col-xs-11 center title">Recommend</span>
                <span id="header" class="col-xs-12 center"></span>
            </div>
            <div class="row"> 
                <span class='fixed-content-reco col-lg-4 col-md-4 col-sm-6 col-xs-8 col-xs-offset-2 col-sm-offset-3 col-md-offset-4 col-lg-offset-4'>
                    <span id="text"></span>
                </span>
            </div>
            <div class='col-xs-12 center' id='recoImg'></div>
            <div class='col-xs-offset-4 col-xs-4 center button' onclick="sendReco()">Send !</div>
        </div>
        <input id="token" type="hidden" value={{{$token}}} />
        <img id="backgroundCover" class="col-lg-offset-2 col-sm-offset-3 col-md-offset-3 col-xs-offset-5" src="img/white.jpg" alt="cover background" />
        <nav class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>                        
      </button>
      <a class="navbar-brand" id="home" href="#">My Music</a>
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav">
        <li id="notificationsHeader"><a href="#"><span class="notification"></span>Notifications <span class="nbNotif">{{{$user->notif}}}</span></a></li>
        <li id="recommendedHeader"><a href="#"><span class="recommend"></span>Recommendations {{{$user->recommendation}}}</a></li>
        <li id="trackRecoveryHeader"><a href="#"><span class="trackRecovery"></span>Track Recovery <span class="nb">{{{$user->refuse}}}</span></a></li>
        <li id="momenTracksHeader"><a href="#"><span class="moment"></span>MomenTracks</a></li>
        <li id="generatorHeader"><a href="#"><span class="generator"></span>Generator</a></li>
      </ul>
      <!--<ul class="nav navbar-nav navbar-right">
        <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Log Out</a></li>
      </ul>
        !-->
    </div>
  </div>
</nav> 
<div id="player" class="col-xs-12">
    <div id="playerControls" class="col-xs-12 col-sm-4 col-md-4 col-lg-2">
        <span class="col-xs-1 left">{!! HTML::image('img/favicon.ico', 'cover of track playing', array('class' => 'img30 playerCover')) !!}</span>
        <span class="col-xs-2 left prevPlayer playerControls"></span>
        <span class="col-xs-2 left playPlayer playerControls"></span>
        <span class="col-xs-2 left nextPlayer playerControls"></span>
        <!--<span class="col-xs-2 left nbLikes playerControls"></span>!-->
        <div id="volPlayer" class="playerControls col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>
    </div>
    <div id="playerInfos" class="hidden-xs col-sm-7 col-md-7 col-lg-9">
        <span class="playerTrackName hidden-xs">Please Play An Awesome Track !</span>
    </div>
</div>
</div>
<div id="playerPosition" class="col-xs-12">
    <div class="loading trackProgress"></div>  
    <div class="loading loadingProgress"></div>  
</div>
        <?php 
        ?>
        <!--<script src="/js/generator.js"></script>!-->
    
    <div id="menuLeft" class="col-lg-2 col-md-3 col-sm-3 col-xs-5 ">
    <div class="row">
        <div class="col-xs-12 navInfos">
            <img class="img30" id="navUserCover" src="{{{$user->avatar_url}}}"/>
            <span class="navUserName">{{{$user->username}}}</span>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 navInfos">
            <div class="col-xs-4">
                <span class="nbLikes playerControls"></span>
                <span class="navInfosNb hidden-xs navInfosLikes">{{{$user->public_favorites_count}}}</span>
                <span class="navInfosNb hidden-sm hidden-md hidden-lg displayBlock navInfosLikes">{{{$user->public_favorites_count}}}</span>
            </div>
            <div class="col-xs-4">
                <span class="nbTracks playerControls"></span>
                <span class="navInfosNb hidden-xs navInfosTracks">{{{$user->track_count}}}</span>
                <span class="navInfosNb hidden-sm hidden-md hidden-lg displayBlock navInfosTracks">{{{$user->track_count}}}</span>
            </div>
            <div class="col-xs-4">
                <div class="nbRevealed playerControls"></div>
                <span class="navInfosNb hidden-xs navInfosRevealed">{{{$user->revealed}}}</span>
                <span class="navInfosNb hidden-sm hidden-md hidden-lg displayBlock navInfosRevealed">{{{$user->revealed}}}</span>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="search-wrapper cf col-xs-12 col-md-12 col-lg-12 col-sm-12">
            <input type="text" placeholder="Song, user" required="" class="js-shuffle-search col-xs-7 col-sm-7 col-md-7 col-lg-7">
            <button type="submit" class="col-xs-5 col-sm-5 col-md-5 col-lg-5 searchButton" onclick="searchTracks();">Search</button>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 menuLeftOptionBar navInfos">
            <div class="col-xs-6 searchOption searchOptionActive menuLeftOption menuLeftFollowings">
                <p>Friends</p>
            </div>
            <div  class="col-xs-6 searchOption menuLeftOption menuLeftNext">
                <p>Next</p>
            </div>
        </div>
        <div id="followings-fixed-content" class="fixed-content show col-lg-2 col-md-3 col-sm-3 col-xs-5">
            <div id="navigation">
                <span class="col-xs-12 center">Loading followings. Please wait.</span>
            <?php 
                //$i = 0;
                //if (($me['followings_count']) == 0)
                  //  echo "You follow nobody, search for artists or friends with the search bar above";
            ?>
            </div>
        </div>
        <div id="next-fixed-content" class="fixed-content col-lg-2 col-md-3 col-sm-3 col-xs-5">
            <div id="next">
            </div>
        </div>
        
    </div>
</div>
    
    <?php  /*
foreach ($tracksRefused as $id){
    echo '<input type="hidden" class="refused" value="'.$id.'" />';
}*/
?>
<div class="row">
    <p class="displayStatus center col-lg-offset-4 col-md-offset-5 col-sm-offset-5 col-xs-offset-7 col-lg-7 col-md-6 col-sm-6 col-xs-4">Loading...<span class="red"><span id="purcent">0</span>%</span></p>
</div>
<div class="row" >
    <div class="col-lg-offset-2 col-md-offset-3 col-sm-offset-3 col-xs-offset-5 col-lg-10 col-md-9 col-sm-9 col-xs-7" id="tracks" > 
        <div id="grid">
            <div class="shuffle__sizer"></div>
        </div>
    </div>
</div>
    
<?php foreach ($refuse as $ref)
    echo "<input type='hidden' class='refused' value='".$ref['track_id']."' />";
?>
{!! HTML::script('js/utils.js'); !!}
{!! HTML::script('js/init.js'); !!}
{!! HTML::script('js/followings.js'); !!}
{!! HTML::script('js/js-shuffle/jquery.shuffle.min.js'); !!}
{!! HTML::script('js/player.js'); !!}
{!! HTML::script('js/collection.js'); !!}
{!! HTML::script('js/search.js'); !!}
{!! HTML::script('js/next.js'); !!}
{!! HTML::script('js/recovery.js'); !!}
{!! HTML::script('js/notifications.js'); !!}
{!! HTML::script('js/momentrack.js'); !!}
{!! HTML::script('js/recommendations.js'); !!}
    </body>
</html>