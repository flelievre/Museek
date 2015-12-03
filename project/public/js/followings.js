var lastIndexSelected = -1;
function showFollowings(){
    var $followings = "";
    for (indexFollowings; indexFollowings < 10 && indexFollowings < followingCount; indexFollowings++){
        $notif = followingsTrackNotifNum[indexFollowings] + followingsFavoritesNotifNum[indexFollowings];
        $followings += '<div class="friend col-xs-12" id="friend'+followingsId[indexFollowings]+'" onclick="getMusicFollowing('+followingsId[indexFollowings]+');"><span class="col-xs-2"><img class="img30" src="'+followingsImg[indexFollowings]+'" alt="friend avatar"/></span><div class="center col-xs-7">'+followingsName[indexFollowings]+'</div><div class="red col-xs-3 center">'+$notif+'</div></div>';
    }
    $followings += '<div class="friend col-xs-12 center red" id="loadingFollowing" onclick="showMoreFollowings(0);">Load More</div>';//load more button
    $navigation.html($followings);
    loaded=true;
}

function showMoreFollowings(i){
    if (loaded){
        loaded = false;
        if (indexFollowings < ((followingsId.length-1) - nbFollowingsAdded)){
            $navigation.find('#loadingFollowing').html("Loading...");
            indexFollowings++;
            calculateMoreFollowingsTrackNumber(i, followingsTrackTime[indexFollowings]);
        }
        else{
            loaded=true;
        }
    }
}
 
function displayMoreFollowings(i){
    $notif = followingsTrackNotifNum[indexFollowings] + followingsFavoritesNotifNum[indexFollowings];
    $('<div class="friend col-xs-12" id="friend'+followingsId[indexFollowings]+'" onclick="getMusicFollowing('+followingsId[indexFollowings]+');"><span class="col-xs-2"><img class="img30" src="'+followingsImg[indexFollowings]+'" alt="friend avatar" class="friendImg" /></span><div class="col-xs-7 center">'+followingsName[indexFollowings]+'</div><div class="red col-xs-3 center">'+$notif+'</div></div>').insertBefore($navigation.find('#loadingFollowing'));
    //$followingsFixedContent.scrollTop($("#friend"+followingsId[indexFollowings]).offset().top);
   /* $followingsFixedContent.animate({ 
        scrollTop: $(this).height()}, 
        1400, 
        "easeOutQuint"
    );*/
    if (i < 3 && (indexFollowings < (followingsId.length-1 - nbFollowingsAdded))) {
        i++;
        loaded=true;
        showMoreFollowings(i);
    }
    else{
        if (indexFollowings == (followingsId.length-1 - nbFollowingsAdded))
            $navigation.find('#loadingFollowing').remove();
        else
            $navigation.find('#loadingFollowing').html("Load More");
        loaded=true;
    }
}

function calculateMoreFollowingsTrackNumber(i, times) {
    var offset = times * 200;
    SC.get("/users/" + followingsId[indexFollowings] + "/tracks", {
        limit: 200,
        offset: offset
    }, function(songs, error) {
        if (error) {
            displayError();
            loaded=true;
        } else if (songs.length == 0) {
            calculateMoreFollowingsFavoriteNumber(i, followingsFavoritesTime[indexFollowings]);
        } else {
            songs.forEach(function(song, index) {
                trueId=parseInt(song.id);
                if ((!(tabIdFavorites.contains(trueId))) && (!(followingsIdAllReadyCounted[indexFollowings].contains(trueId))) && (!(refusedId.contains(song.id))) && (song.streamable) ) {
                    followingsIdAllReadyCounted[indexFollowings].push(trueId);
                    followingsTrackNotifNum[indexFollowings]++;
                }
                if (index == songs.length - 1) {
                    if (times == 0)
                        calculateMoreFollowingsFavoriteNumber(i, followingsFavoritesTime[indexFollowings]);
                    else {
                        times--;
                        calculateMoreFollowingsTrackNumber(i, times);
                    }
                }
            });
        }
    });
}

function calculateMoreFollowingsFavoriteNumber(i, times) {
    var offset = times * 200;
    SC.get("/users/" + followingsId[indexFollowings] + "/favorites", {
        limit: 200,
        offset: offset
    }, function(songs, error) {
        if (error) {
            displayError();
            loaded=true;
        } else if (songs.length == 0) {
            displayMoreFollowings(i);
        } else {
            songs.forEach(function(song, index) {
                trueId=parseInt(song.id);
                if ((!(tabIdFavorites.contains(trueId))) && (!(followingsIdAllReadyCounted[indexFollowings].contains(trueId))) && (!(refusedId.contains(trueId))) && (song.streamable)) {
                    followingsIdAllReadyCounted[indexFollowings].push(trueId);
                    followingsFavoritesNotifNum[indexFollowings]++;
                }
                if (index == songs.length - 1) {
                    if (times == 0)
                        displayMoreFollowings(i);
                    else {
                        times--;
                        calculateMoreFollowingsFavoriteNumber(i, times);
                    }
                }
            });
        }
    });
}

function displayNumbersFollowing(i){
        $navUserName.html(followingsName[i]);
        $navUserCover.attr('src', followingsImg[i]);
        $navInfosLikes.html(followingsFavoritesNotifNum[i]);
        $navInfosTracks.html(followingsTrackNotifNum[i]);
}

function getMusicFollowing(id,index) {
    if(loaded){
        loaded=false;
        lastIndexSelected = followingsId.indexOf(id);
        console.log(lastIndexSelected);
        reset();
        followingsIdAllReadyCounted[lastIndexSelected] = [];
        getFollowingsTracks(id, followingsTrackTime[followingsId.indexOf(id)]);
        idUser = id;
    }
}

function getFollowingsTracks(id, times){
    var offset = times*200;
    SC.get("/users/"+id+"/tracks", {limit: 200, offset : offset}, function(songs, error){
        if (error){
            displayError();
            loaded=true;
        }
        else if (songs.length == 0){
            getFollowingsFavorites(id, followingsFavoritesTime[followingsId.indexOf(id)]);
        }                
        else {
           songs.forEach(function(song, index){
               trueId = parseInt(song.id);
                if ((!(tabIdFavorites.contains(trueId))) && (!(followingsIdAllReadyCounted[followingsId.indexOf(id)].contains(trueId))) && (!(refusedId.contains(song.id))) && (song.streamable) ){    
                    followingsIdAllReadyCounted[followingsId.indexOf(id)].push(trueId);
                    tabId.push(trueId);
                    tabIdRef.push(trueId);
                    tabUrl.push(song.permalink_url); 
                    tabUrlRef.push(song.permalink_url); 
                    tabName.push(song.user.username+' ~ '+song.title);
                    tabNameRef.push(song.user.username+' ~ '+song.title);
                    var img = song.artwork_url;
                    if (img == null){
                        img = song.user.avatar_url;
                    }
                    tabImg.push(img);
                    tabImgRef.push(img);
                }
                if (index == songs.length-1){
                    if (times == 0){
                        getFollowingsFavorites(id, followingsFavoritesTime[followingsId.indexOf(id)]);
                    }
                    else {
                        times--;
                        getFollowingsTracks(id, times);
                    }
                }
            });
        }
    });
}


function getFollowingsFavorites(id, times){
    var offset = times*200;
    SC.get("/users/"+id+"/favorites", {limit: 200, offset: offset}, function(songs, error){
        if (error)
            displayError();
        else if (songs.length == 0)
            showMusicFollowing();
        else {
           songs.forEach(function(song, index){
               trueId = parseInt(song.id);
                if ((!(tabIdFavorites.contains(trueId))) && (!(followingsIdAllReadyCounted[followingsId.indexOf(id)].contains(trueId))) && (!(refusedId.contains(song.id))) && (song.streamable)){
                    tabId.push(trueId);
                    tabIdRef.push(trueId);
                    tabUrl.push(song.permalink_url);
                    tabUrlRef.push(song.permalink_url);
                    tabName.push(song.user.username+' ~ '+song.title);
                    tabNameRef.push(song.user.username+' ~ '+song.title);
                    var img = song.artwork_url;
                    if (img == null){
                        img = song.user.avatar_url;
                    }
                    tabImg.push(img);
                    tabImgRef.push(img);
                }
               if (index == songs.length-1){
                    if (times == 0){
                        showMusicFollowing();
                    }
                    else {
                        times--;
                        getFollowingsFavorites(id, times);
                    }
               }
            });
        }
    });
}

function showMusicFollowing(){ $("#friend"+followingsId[lastIndexSelected]).find(".red").html(tabId.length);
    displayInfos('Sort '+followingsName[lastIndexSelected]+'\'s tracks !');
    dynamicItems = "";
    tabId.forEach(function (id, i){
        dynamicItems += '<div class="item"  data-groups=\'["all", "' + tabName[i] + '"]\'><input type="hidden" class="item__title" value="' + tabName[i] + '" /><input type="hidden" class="item__url" value="' + tabUrl[i] + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + tabImg[i] + '" /><div class="trackBlock  '+ id + '" id="'+id+'"><p class="trackP trackOptionText">Play</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="'+ tabUrl[i] +'" /><img class="trackCover" src="'+tabImg[i]+'" alt="'+tabName[i]+'" /><div class="quarter quarter1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon"></div></div><div class="quarter quarter2 quarterFirst " title="Add to Likes" onclick="favoriteTrack('+myId+','+idUser+','+id+');"><div class="like trackIcon"></div></div><div class="quarter quarter3 quarterFirst " title="Refuse track" onclick="refuseTrack('+myId+', '+id+','+idUser+', 1);"><div class="delete trackIcon"></div></div><div class="quarter quarter4 quarterFirst" title="More options ..."><div class="more trackIcon"></div></div><div class="quarter quarter1 quarterSecond " title="Recommend to...""><div class="recommend trackIcon"></div></div><div class="quarter quarter2 quarterSecond" title="Play next" onclick="addToNexts('+id+');"><div class="next trackIcon"></div></div><div id="'+i+'sc" class="quarter quarter3 quarterSecond soundCloud" title="Listen in SoundCloud"><div class="soundcloud trackIcon"></div></div><div class="quarter quarter4 quarterSecond " title="More options ..."><div class="more trackIcon"></div></div></div><p class="trackP trackInfo">'+tabName[i].substr(0,50)+"..."+'</p></div></div>';
  });
    $grid.append(dynamicItems);
    displayNumbersFollowing(lastIndexSelected);
    activateShuffle();
    updateListeners();
    graphicalResume();
}
//'<div class="item"  data-groups=\'["all", "' + tabName[i] + '"]\'><input type="hidden" class="item__title" value="' + tabName[i] + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + tabImg[i] + '" /><div class="trackBlock" id="'+id+'"><p class="trackP trackOptionText">Play</p><div class="trackCoverBlock"><img class="imgPlayPause" src="../img/play.svg" alt="now playing" /><img class="trackCover" src="'+tabImg[i]+'" alt="'+tabName[i]+'" /><div class="quarter quarter1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon"></div></div><div class="quarter quarter2 quarterFirst " title="Add to Likes" onclick="favoriteTrack('+myId+','+idUser+','+id+');"><div class="like trackIcon"></div></div><div class="quarter quarter3 quarterFirst " title="Refuse track" onclick="refuseTrack('+myId+', '+id+','+idUser+', 1);"><div class="delete trackIcon"></div></div><div class="quarter quarter4 quarterFirst" title="More options ..."><div class="more trackIcon"></div></div><div class="quarter quarter1 quarterSecond " title="Recommend to...""><div class="recommend trackIcon"></div></div><div class="quarter quarter2 quarterSecond" title="Play next" onclick="addToNexts('+id+');"><div class="next trackIcon"></div></div><div id="'+i+'sc" class="quarter quarter3 quarterSecond soundCloud" title="Listen in SoundCloud"><div class="soundcloud trackIcon"></div></div><div class="quarter quarter4 quarterSecond " title="More options ..."><div class="more trackIcon"></div></div></div><p class="trackP trackInfo">'+tabName[i].substr(0,50)+"..."+'</p></div></div>'