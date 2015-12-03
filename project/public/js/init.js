var $player = $('#player');
var $home = $('#home');
var $body = $('body');
var $backgroundCover = $('#backgroundCover');
var $playerControls = $player.find('#playerControls');
var $playerCover = $playerControls.find('.playerCover');// player cover img
var $playPlayer = $playerControls.find('.playPlayer');// player play img
var $nextPlayer = $playerControls.find('.nextPlayer');// player next img
var $prevPlayer = $playerControls.find('.prevPlayer');// player prev img
var $volPlayer = $playerControls.find('#volPlayer');// player volume slider
var $likePlayer = $playerControls.find('.nbLikes');
var $playerTrackName = $player.find('#playerInfos').find('.playerTrackName');//player track name

var $playerPosition = $('#playerPosition');
var $trackProgress = $playerPosition.find('.trackProgress');
var $loadingProgress = $playerPosition.find('.loadingProgress');

var $menuLeft = $('#menuLeft');
var $navUserName = $menuLeft.find('.navUserName');
var $navUserCover = $menuLeft.find('#navUserCover');
var $navInfosLikes = $menuLeft.find('.navInfosLikes');
var $navInfosTracks = $menuLeft.find('.navInfosTracks');
var $navInfosRevealed = $menuLeft.find('.navInfosRevealed');
var $menuLeftNext = $menuLeft.find('.menuLeftNext');
var $menuLeftFollowings = $menuLeft.find('.menuLeftFollowings');
var $navigation = $menuLeft.find('#navigation');
var $next = $menuLeft.find('#next');
var $menuLeftOptions = $menuLeft.find('.menuLeftOption');
var $fixedContent = $menuLeft.find('.fixed-content');
var $followingsFixedContent = $menuLeft.find('#followings-fixed-content');
var $next = $menuLeft.find('#next');


var $tracks =$('#tracks');
var $grid =$tracks.find('#grid');
var $displayStatus =$('.displayStatus');
var $purcent=$displayStatus.find('#purcent');

var loaded = false;
var tabId = new Array();
var tabName = new Array();
var tabIdFavorites = new Array(); //tab containing all favorite tracks
var tabNameFavorites = new Array(); //tab containing all favorite tracks
var tabImgFavorites = new Array(); //tab containing all favorite tracks
var tabUrlFavorites = new Array();
var tabUrl = new Array(); //tab containing all url of favorite tracks
var tabUrlRef = new Array(); //tab containing all url of favorite tracks
var tabImg = new Array(); //tab containing all img
var tabIdRef = new Array(); // tab id reference when search shuffle is back empty for listeners
var tabNameRef = new Array(); // tab name reference when search shuffle is back empty for listeners
var tabImgRef = new Array(); // tab img reference when search shuffle is back empty for listeners
var tabUserId = new Array(); // tab img reference when search shuffle is back empty for listeners
var tabUserIdRef = new Array(); // tab img reference when search shuffle is back empty for listeners
var refused = $('.refused');

var refusedId = new Array(); // collecting all the id's in one tab
for (i = 0; i < refused.length; i++) {
    refusedId.push(parseInt(refused[i].value));
}

//To be sure to have all followings ( query limited to 50)
var timesFollowings;
var followingCount;
var offsetFollowings;

// GET FOLLOWINGS AND THEIR NOTIF NUMBER
var followingsId = [];
var followingsName = [];
var followingsImg = [];
var followingsIdAllReadyCounted = new Array();
var followingsTrackNotifNum = [];
var followingsFavoritesNotifNum = [];
var followingsNumber = []; //sum of track & favorites numbers : total notif number
var indexFollowings = 0; //index of followings (to know how much has been showed yet)
var followingsTrackTime = [];
var followingsFavoritesTime = [];

var myId = - 1; // my idUser
var myUserName = "";
var myAvatarUrl = "";
var trackCount =- 1; //my tracks number
var trackCountStreamable =- 1; //my tracks number
var favoriteCount = - 1;
var favoriteCountStreamable = - 1;
var favoriteTimes =- 1;
var favoriteLeft =- 1;
var trackTimes =- 1;
var trackLeft =- 1;
var playlistCount = - 1;
var playlistCountStreable = - 1;
var idUser = - 1;
var myRefusedCount = refused.length;

$(document).ready(function(){
    //volume slider
    $backgroundCover.width($body.width()-$menuLeft.width()).height($body.height()-90+"px");
    $(window).resize(function(){
        $backgroundCover.width($body.width()-$menuLeft.width()).height($body.height()-90+"px");
    });
    $volPlayer.slider({
        max : 100 ,
        value : 100
    }).on( "slide slidechange slidestop", function( event, ui ) {
        if (soundObject){
            soundObject.setVolume($(this).slider( "value" ));
        }
    });
    $playerCover.click(function(){
        if (tabId.contains(idPlaying)){
            $("html, body").animate({    // Need both for full browser support
                scrollTop: $("#"+idPlaying).offset().top - 300 // Extra 100px
            }, 500);
        }
    });
    $likePlayer.click(function(){
        if (loaded && (!(tabIdFavorites.contains(idPlaying)))){
            if (idPlaying > -1){
                favoriteTrackSearch(idPlaying);
                $(this).removeClass('nbLikes').addClass('done');
            }    
        }        
    });
    $home.click(function(){
        if (loaded){
            loaded=false;
            idUser = myId;
            reset();
            for(var i=0; i<tabIdFavorites.length; i++){
                tabId[i] = tabIdFavorites[i];
                tabIdRef[i] = tabIdFavorites[i];
                tabUrl[i] = tabUrlFavorites[i];
                tabUrlRef[i] = tabUrlFavorites[i];
                tabImg[i] = tabImgFavorites[i];
                tabImgRef[i] = tabImgFavorites[i];
                tabName[i] = tabNameFavorites[i];
                tabNameRef[i] = tabNameFavorites[i]; 
            }
            getMyFavoritesOnly();
            graphicalResume();
        }     
    });
    //menu left options : next and followings
    $menuLeftOptions.click(function(){
        if (!($(this).hasClass('searchOptionActive'))){
            $menuLeftOptions.toggleClass('searchOptionActive');
            $fixedContent.toggleClass('show');
        }
    });
    $playerPosition.click(function(e){
        if (soundObject){
            var xPosition = e.pageX - $(this).position().left;
            soundObject.setPosition(xPosition/$(this).width()*duration);
        }
    });
    $nextPlayer.click(function(){
        if (loaded){
            loaded = false;
            playNext();
            loaded=true;
        }
    });
    $prevPlayer.click(function(){
        if (loaded){
            loaded = false;
            playPrevious();
            loaded=true;
        }
    });
    $playPlayer.click(function(){
        if (loaded){
            loaded = false;
            if (idPlaying == -1){
                handleTrack(tabId[0]);
                idPlaying = tabId[0];
            }
            else {
                handleTrack(idPlaying);
            }
            loaded = true;
        }
    });
    //initialize soundcloud datas
    SC.get("/me", function(me, error) {
        if (error){
            alert(error);
            displayError();
        }
        myId = me.id;
        favoriteCount = me.public_favorites_count;
        favoriteCountStreamable = me.public_favorites_count;
        trackCount = me.track_count;
        trackCountStreamable = me.track_count;
        playlistCount = me.playlist_count;
        playlistCountStreable = me.playlist_count;
        favoriteTimes = Math.floor(favoriteCount / 200);
        trackTimes = Math.floor(trackCount / 200);
        favoriteLeft = favoriteCount - (favoriteTimes * 200);
        trackLeft = trackCount - (trackTimes * 200);
        followingCount = me.followings_count;
        timesFollowings = Math.floor(followingCount / 50);
        leftFollowings = followingCount - (timesFollowings * 200);
        $purcent.html(20);
        getFollowingsId(timesFollowings, 0);
        idUser = myId;
        myUserName = me.username;
        myAvatarUrl = me.avatar_url;
        if (favoriteCount == 0 ) {
            $(".displayStatus").html('Please use the searchbar on the left to search for songs or artists');
            loaded = true;
        }
    });
});

function getFollowingsId(times, offsetFollowings) {
        SC.get('/users/' + myId + '/followings', {offset: offsetFollowings}, function(followings) {
            if (followings.length == 0){
               getMyFavorites(favoriteTimes, 0);
            }
            else {
                followings.forEach(function (user, index){
                       followingsId.push(parseInt(user.id));
                        followingsName.push(user.username);
                        followingsImg.push(user.avatar_url);
                        followingsTrackNotifNum[index + offsetFollowings] = 0;
                        followingsFavoritesNotifNum[index + offsetFollowings] = 0;
                        followingsTrackTime.push(Math.floor(user.track_count / 200));
                        followingsFavoritesTime.push(Math.floor(user.public_favorites_count / 200));
                        if (index == followings.length-1) {
                            if (times == 0) {
                                for (var k = 0; k < followingsId.length ; k++)
                                    followingsIdAllReadyCounted[k] = [];
                                getMyFavorites(favoriteTimes, 0);
                            } else {
                                offsetFollowings += 50;
                                timesFollowings--;
                                getFollowingsId(timesFollowings, offsetFollowings);
                            }
                        }
                   });
            }
    
            /*followings.forEach(function (user, index) {
                followingsId.push(parseInt(user.id));
                followingsName.push(user.username);
                followingsImg.push(user.avatar_url);
                followingsTrackNotifNum[index + offsetFollowings] = 0;
                followingsFavoritesNotifNum[index + offsetFollowings] = 0;
                followingsTrackTime.push(Math.floor(user.track_count / 200));
                followingsFavoritesTime.push(Math.floor(user.public_favorites_count / 200));
                if (index == followings.length - 1) {
                    if (times == 0) {
                        for (var k = 0; k < followingsId.length ; k++)
                            followingsIdAllReadyCounted[k] = [];
                        getMyFavorites(favoriteTimes, 0);
                    } else {
                        offsetFollowings += 50;
                        timesFollowings--;
                        getFollowingsId(timesFollowings, offsetFollowings);
                    }
                }
            });*/
        });
}

function getMyFavorites(times, offset) {
    SC.get("/users/" + myId + "/favorites", {
        limit: 200,
        offset: offset
    }, function(playlist) {
        if (playlist.length == 0){
            $purcent.html(60);
            favoriteCountStreamable = tabId.length;
            getFollowingsTracksNumber(0, followingsTrackTime[0]);
        }   
        else {
            for (i = 0 ; i < playlist.length; i++) {
                tabId.push(parseInt(playlist[i].id));
                tabIdRef.push(parseInt(playlist[i].id));
                tabIdFavorites.push(parseInt(playlist[i].id));
                tabUrlFavorites.push(playlist[i].permalink_url);
                tabUrl.push(playlist[i].permalink_url);
                tabUrlRef.push(playlist[i].permalink_url);
                tabName.push(playlist[i].user.username + ' ~ ' + playlist[i].title);
                tabNameRef.push(playlist[i].user.username + ' ~ ' + playlist[i].title);
                tabNameFavorites.push(playlist[i].user.username + ' ~ ' + playlist[i].title);
                var img = playlist[i].artwork_url;
                if (img == null) {
                    img = playlist[i].user.avatar_url;
                }
                tabImg.push(img);
                tabImgRef.push(img);
                tabImgFavorites.push(img);
                if (i == (playlist.length - 1)) {
                    if (times == 0) {
                        $purcent.html(60);
                        favoriteCountStreamable = tabId.length;
                        getFollowingsTracksNumber(0, followingsTrackTime[0]);
                    } else {
                        offset += 200;
                        times--;
                        getMyFavorites(times, offset);
                    }
                }
            }
        }
    });
}

function getFollowingsTracksNumber(i, times) {
    var offset = times * 200;
    SC.get("/users/" + followingsId[i] + "/tracks", {limit: 200,offset : offset}, function(songsObj, error) {
        var songs = [];
        for (var index in songsObj){
            songs.push(songsObj[index]);
        }
        
        if (error) {
            displayError();
        } else if (songs.length == 1) {
            if (i == 9){
                $purcent.html(80);
                getFollowingsFavoritesNumber(0, followingsFavoritesTime[0]);
            }
            else {
                i++;
                getFollowingsTracksNumber(i, followingsTrackTime[i]);
            }
        } else {
            for (var j = 0; j < songs.length-1; j++){
                if ((!(tabIdFavorites.contains(parseInt(songs[j].id)))) && (!(followingsIdAllReadyCounted[i].contains(parseInt(songs[j].id)))) && (!(refusedId.contains(parseInt(songs[j].id)))) && (songs[j].streamable) ) {
                    followingsIdAllReadyCounted[i].push(parseInt(songs[j].id));
                    followingsTrackNotifNum[i]++;
                }
                if (parseInt(j+2) == songs.length)  {
                    if (times == 0) {
                        if (i == 9){
                            $purcent.html(80);
                            getFollowingsFavoritesNumber(0, followingsFavoritesTime[0]);
                        }
                        else {
                            i++;
                            getFollowingsTracksNumber(i, followingsTrackTime[i]);
                        }
                    } else {
                        times--;
                        getFollowingsTracksNumber(i, times);
                    }
                }
            }
        }
    });
}


function getFollowingsFavoritesNumber(i, times) {
    var offset = times * 200;
    SC.get("/users/" + followingsId[i] + "/favorites", {limit: 200, offset: offset}, function(songs, error) {
        if (error) {
            displayError();
        } else if (songs.length==0) {
            if (i == 9) {
                $purcent.html(100);
                showMyFavorites();
                showFollowings();
            } else {
                i++;
                getFollowingsFavoritesNumber(i, followingsFavoritesTime[i]);
            }
        } else {
            songs.forEach(function(song, index) {
                if ((!(tabIdFavorites.contains(parseInt(song.id)))) && (!(followingsIdAllReadyCounted[i].contains(parseInt(song.id)))) && (!(refusedId.contains(parseInt(song.id)))) && (song.streamable)) {
                    followingsIdAllReadyCounted[i].push(parseInt(song.id));
                    followingsFavoritesNotifNum[i]++;
                }
                if (index == songs.length - 1) {
                    if (times == 0) {
                        if (i == 9) {
                            $purcent.html(100);
                            showMyFavorites();
                            showFollowings();
                        } else {
                            i++;
                            getFollowingsFavoritesNumber(i, followingsFavoritesTime[i]);
                        }
                    } else {
                        times--; 
                        getFollowingsFavoritesNumber(i, times);
                    }
                }
            });
        }
    });
}

function displayMyNumbers(){
        $navUserName.html(myUserName);
        $navUserCover.attr('src', myAvatarUrl);
        $navInfosLikes.html(favoriteCount);
        $navInfosTracks.html(trackCount);
}

function getMyFavoritesOnly() {
    $displayStatus.html('');
    $grid.html('');
    dynamicItems = "";
    tabIdFavorites.forEach(function (id, i) {
        dynamicItems += '<div class="item"  data-groups=\'["all", "' + tabNameFavorites[i] + '"]\'><input type="hidden" class="item__title" value="' + tabNameFavorites[i] + '" /><input type="hidden" class="item__url" value="' + tabUrlFavorites[i] + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + tabImgFavorites[i] + '" /><div class="trackBlock ' + id + '" id="'+id+'"><p class="trackP trackOptionText">Play</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="'+ tabUrlFavorites[i] +'" /><img class="trackCover" src="'+tabImgFavorites[i]+'" alt="'+tabNameFavorites[i]+'" /><div class="quarter quarter1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon"></div></div><div class="quarter quarter2 quarterFirst " title="Play next" onclick="addToNexts('+id+');"><div class="next trackIcon"></div></div><div class="quarter quarter3 quarterFirst " title="Recommend to ..."><div class="recommend trackIcon"></div></div><div class="quarter quarter4 quarterFirst" title="More options ..."><div class="more trackIcon"></div></div><div class="quarter quarter1 quarterSecond " title="Delete Track" onclick="refuseTrack('+myId+', '+id+', -1, 0);"><div class="delete trackIcon"></div></div><div class="quarter quarter2 quarterSecond " title="Set as MomenTrack" onclick="setMomenTrack('+id+');"><div class="moment trackIcon"></div></div><div id="'+i+'sc" class="quarter quarter3 quarterSecond soundCloud" title="Listen in SoundCloud"><div class="soundcloud trackIcon"></div></div><div class="quarter quarter4 quarterSecond " title="More options ..."><div class="more trackIcon"></div></div></div><p class="trackP trackInfo">'+tabNameFavorites[i].substr(0,50)+"..."+'</p></div></div>'
    });
    $grid.append(dynamicItems);
    displayMyNumbers();
    activateShuffle();
    updateListeners();
}

function showMyFavorites() {
    $displayStatus.html('');
    $grid.html('');
    dynamicItems = "";
    tabId.forEach(function (id, i) {
        dynamicItems += '<div class="item"  data-groups=\'["all", "' + tabName[i] + '"]\'><input type="hidden" class="item__title" value="' + tabName[i] + '" /><input type="hidden" class="item__url" value="' + tabUrl[i] + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + tabImg[i] + '" /><div class="trackBlock ' + id + '" id="'+id+'"><p class="trackP trackOptionText">Play</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="'+ tabUrl[i] +'" /><img class="trackCover" src="'+tabImg[i]+'" alt="'+tabName[i]+'" /><div class="quarter quarter1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon"></div></div><div class="quarter quarter2 quarterFirst " title="Play next" onclick="addToNexts('+id+');"><div class="next trackIcon"></div></div><div class="quarter quarter3 quarterFirst " title="Recommend to ..." onclick="showRecommendMenu('+id+');"><div class="recommend trackIcon"></div></div><div class="quarter quarter4 quarterFirst" title="More options ..."><div class="more trackIcon"></div></div><div class="quarter quarter1 quarterSecond " title="Delete Track" onclick="refuseTrack('+myId+', '+id+', -1, 0);"><div class="delete trackIcon"></div></div><div class="quarter quarter2 quarterSecond " title="Set as MomenTrack" onclick="setMomenTrack('+id+');"><div class="moment trackIcon"></div></div><div id="'+i+'sc" class="quarter quarter3 quarterSecond soundCloud" title="Listen in SoundCloud"><div class="soundcloud trackIcon"></div></div><div class="quarter quarter4 quarterSecond " title="More options ..."><div class="more trackIcon"></div></div></div><p class="trackP trackInfo">'+tabName[i].substr(0,50)+"..."+'</p></div></div>'
    });
    $grid.append(dynamicItems);
    activateShuffle();
    updateListeners();
}

function activateShuffle() {
    var $items = $('.item');
    var shuffle = $grid.data('shuffle');
    var $sizer = $grid.find('.trackBlock');
    $grid.shuffle({
        itemSelector: '.item',
        sizer: $sizer
    });
    $('.js-shuffle-search').on('keyup change', function() {
        if (this.value.length < 1) {
            resetTab();
            $grid.shuffle('shuffle', 'all' );
        } else if (this.value.length >= 3 ) {
            tabId.length = 0 ;
            tabName.length = 0;
            tabImg.length = 0;
            tabUrl.length = 0;
            var val = this.value.toLowerCase();
            $grid.shuffle('shuffle', function($el, shuffle) {

                // Only search elements in the current group
                if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === - 1) {
                    return false;
                }
                var text = $.trim( $el.find('.item__title').val() ).toLowerCase();
                if ((text.indexOf(val) !== - 1)) {
                    tabId.push(parseInt($el.find('.item__id').val()));
                    tabImg.push($el.find('.item__img').val());
                    tabUrl.push($el.find('.item__url').val());
                    string = $el.find('.item__title').val();
                    tabName.push(string);
                    window.scroll(0, 0);
                    return true;
                }
            });
        }
    });
}

function activateRecovery() {
    var $items = $('.item');
    var shuffle = $grid.data('shuffle');
    var $sizer = $grid.find('.notifBlock');
    $grid.shuffle({
        itemSelector: '.item',
        sizer: $sizer
    });
    $('.js-shuffle-search').on('keyup change', function() {
        if (this.value.length < 1) {
            resetTab();
            $grid.shuffle('shuffle', 'all' );
        } else if (this.value.length >= 3 ) {
            tabId.length = 0 ;
            tabName.length = 0;
            tabImg.length = 0;
            tabUrl.length = 0;
            var val = this.value.toLowerCase();
            $grid.shuffle('shuffle', function($el, shuffle) {

                // Only search elements in the current group
                if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === - 1) {
                    return false;
                }
                var text = $.trim( $el.find('.item__title').val() ).toLowerCase();
                if ((text.indexOf(val) !== - 1)) {
                    tabId.push(parseInt($el.find('.item__id').val()));
                    tabImg.push($el.find('.item__img').val());
                    string = $el.find('.item__title').val();
                    tabName.push(string);
                    window.scroll(0, 0);
                    return true;
                }
            });
        }
    });
}
function resetTab() {
    tabIdRef.forEach(function(id, i) {
        tabId[i] = id;
        tabName[i] = tabNameRef[i];
        tabImg[i] = tabImgRef[i];
        tabUrl[i] = tabUrlRef[i];
    });
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
