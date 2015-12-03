var nbFollowingsAdded = 0;
function searchTracks(){
    if (loaded){
            loaded = false;
            var query = $(".js-shuffle-search").val();
            if (query != ""){
                reset();
                SC.get('/tracks', { q: query, limit : 200 }, function(tracks) {
                    if (tracks.length == 0){
                        $grid = $('#tracks').find('#grid');
                        $grid.html('');
                        $displayStatus.html("<p class='col-xs-12'>Searched for <span class='red'>"+query+"</span><br />No track found...<br /> Click on Users below to search for Users !</p>");
                        showSearchOptions('searchOptionActive', '');
                        loaded=true;
                    }
                    else {
                        tracks.forEach(function(track, index) {
                            trueId = parseInt(track.id);
                            if ((!(tabIdFavorites.contains(trueId))) && (!(tabId.contains(trueId))) && (!(refusedId.contains(track.id))) && (track.streamable)) {
                                tabId.push(trueId);
                                tabIdRef.push(trueId);
                                tabName.push(track.user.username+' ~ '+track.title);
                                tabNameRef.push(track.user.username+' ~ '+track.title);
                                var img = track.artwork_url;
                                if (img == null){
                                    img = track.user.avatar_url;
                                }
                                tabImg.push(img);
                                tabUrl.push(track.permalink_url);
                                tabUrlRef.push(track.permalink_url);
                                tabImgRef.push(img);
                                tabUserId.push(track.user_id);
                                tabUserIdRef.push(track.user_id);
                            }
                            if (index == tracks.length-1){
                                $displayStatus.html("<p class='col-xs-12'>Searched for <span class='red'>"+query+"</span></p>");
                                showMusicSearch();
                            }
                        });
                    }
                });
        }
        else
            loaded=true;
    }
}

function favoriteTrackSearch (idTrack) {
    if (loaded){
        loaded=false;
        if (!(tabIdFavorites.contains(idTrack))){
            if (tabId.contains(idTrack)){
                $trackBlock = $('#'+idTrack);
                var img;
                img = $trackBlock.find('.trackCover').attr('src');
                console.log(img);
                $trackBlock.find('.trackCover').attr('src', "img/utils/loader.gif");
            }
            if (SC.isConnected() ){
                SC.put('/me/favorites/'+idTrack, function(status, error) {
                    if (error) {
                        displayError();
                        if(tabId.contains(idTrack))
                            $trackBlock.find('.trackCover').attr('src', img);
                        loaded=true;
                    } else {
                        if(tabId.contains(idTrack)){
                            console.log(img);
                            var name = $trackBlock.find('.trackInfo').html();
                            var url = tabUrl[tabId.indexOf(idTrack)];
                            img = tabImg[tabId.indexOf(idTrack)];
                            console.log(idTrack +' '+ url +' '+  name +' '+ img);
                            addtoLikes(idTrack, url, name, img);
                            $trackBlock.find('.like').parent().attr('onclick', '').attr('title', 'Added to Likes !');
                            $trackBlock.find('.like').removeClass('like').addClass('done');
                            $trackBlock.find('.trackCover').attr('src', "img/utils/track_added.png");
                            $trackBlock.find('.like').removeClass('like').addClass('done');
                            $trackBlock.find('.quarter2').attr('onclick', '');
                        }
                        else {
                            var name = $playerTrackName.html();
                            var img = $playerCover.attr('src');
                            var url = $playerCover.attr('alt');
                            console.log('ici');
                            addtoLikes(idTrack, url, name, img);
                            //si on est sur notre jukebox prepend à la grid ! 
                        }
                        loaded=true;
                    }
                });
            }
            else {
                alert("For security reasons, please log ag");
                authenticate();
            }
        }
        loaded=true;
        console.log('added');
    }
}

function showMusicSearch(){
    dynamicItems = "";
    tabId.forEach(function (id, i){
        dynamicItems += '<div class="item"  data-groups=\'["all", "' + tabName[i] + '"]\'><input type="hidden" class="item__title" value="' + tabName[i] + '" /><input type="hidden" class="item__url" value="' + tabUrl[i] + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + tabImg[i] + '" /><div class="trackBlock ' + id + '" id="'+id+'"><p class="trackP trackOptionText">Play</p><div class="trackCoverBlock"><img class="imgPlayPause" src="../img/play.svg" alt="'+ tabUrl[i] +'" /><img class="trackCover" src="'+tabImg[i]+'" alt="'+tabName[i]+'" /><div class="quarter quarter1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon"></div></div><div class="quarter quarter2 quarterFirst " title="Add to Likes" onclick="favoriteTrackSearch('+id+');"><div class="like trackIcon"></div></div><div class="quarter quarter3 quarterFirst " title="Refuse track" onclick="refuseTrack('+myId+', '+id+', '+tabUserId[i]+', 2);"><div class="delete trackIcon"></div></div><div class="quarter quarter4 quarterFirst" title="More options ..."><div class="more trackIcon"></div></div><div class="quarter quarter1 quarterSecond " title="Recommend to...""><div class="recommend trackIcon"></div></div><div class="quarter quarter2 quarterSecond" title="Play next" onclick="addToNexts('+id+');"><div class="next trackIcon"></div></div><div class="quarter quarter3 quarterSecond soundCloud " id="'+i+'sc"  title="Listen in SoundCloud"><div class="soundcloud trackIcon"></div></div><div class="quarter quarter4 quarterSecond " title="More options ..."><div class="more trackIcon"></div></div></div><p class="trackP trackInfo">'+tabName[i].substr(0,50)+"..."+'</p></div></div>';
    });
    $grid.append(dynamicItems);
    activateShuffle();
    updateListeners();  
    showSearchOptions('searchOptionActive', '');
}


function searchUsers(){
    if (loaded){
        loaded=false;
        var query = $(".js-shuffle-search").val();
        if (query != ""){
            reset();
            $dynamicItems = "";
            $grid = $('#tracks').find('#grid');
            $grid.html('');
            SC.get('/users', { q: query, limit : 200 }, function(users) {
                if (users.length == 0){
                    $displayStatus.html("<p class='col-xs-12'>Searched for <span class='red'>"+query+"</span><br />No users found...<br /> Click on Tracks below to search for tracks !</p>");
                    showSearchOptions("","searchOptionActive");
                    loaded=true;
                }
                else {
                    users.forEach(function(user, index) {
                        if (!(followingsId.contains(user.id))){
                            url = user.permalink_url;
                            $dynamicItems +='<div class="item"  data-groups=\'["all", "' + user.username + '"]\'><input type="hidden" class="item__title" value="' + user.username + '" /><input type="hidden" class="item__url" value="' + user.permalink_url + '" /><input type="hidden" class="item__id" value="' + user.id + '" /><input type="hidden" class="item__img" value="' + user.avatar_url + '" /><div class="trackBlock ' + user.id + ' trackBlockNotif" id="'+user.id+'"><p class="trackPNotif trackOptionTextNotif">'+user.username+'</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="'+ url +'" /><img class="trackCover" src="'+user.avatar_url+'" alt="'+user.username+'" /><div class="quarter half quarter1 half1 quarterFirst " title="Add User" onclick="addUserToFavorite('+user.id+',\''+ user.username+'\',\''+ user.avatar_url+'\','+ user.track_count+', '+user.public_favorites_count+');"><div class="like trackIconHalf"></div></div><div class="quarter half quarter2 half2 quarterFirst soundCloud" title="See in SoundCloud" id="'+i+'sc"><div class="soundcloud  trackIconHalf"></div></div></div><p class="trackPNotif trackInfoNotif"><span class="nbLikes"></span>'+user.followers_count+'</p></div></div>';
                            
                            //'<div class="item"  data-groups=\'["all", "' + name + '"]\'><input type="hidden" class="item__title" value="' + name + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + img + '" /><div class="'+id+' trackBlock trackBlockNotif" id="'+id+'"><p class="trackPNotif trackOptionTextNotif"><img class="trackCoverNotif" src="'+avatar+'"/>'+username+'</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="now playing" /><img class="trackCover" src="'+img+'" alt="'+name+'" /><div class="quarter half quarter1 half1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon trackIconHalf"></div></div><div class="quarter quarter2 half half2 quarterFirst " title="Add to Likes" onclick="favoriteTrackRefuse('+id+','+friend_id+');"><div class="like trackIcon trackIconHalf"></div></div></div><p class="trackPNotif trackInfoNotif">'+name+'</p></div></div>'
                       }
                        if (index == users.length-1){
                            $displayStatus.html("<p class='col-xs-12'>Searched for <span class='red'>"+query+"</span></p>");
                            showSearchOptions("","searchOptionActive");
                            $grid.append($dynamicItems);
                            loaded=true;
                            updateListeners();
                            activateShuffle();
                        }
                    });
                }
            });
        }
        else
            loaded=true;
    }
}

function addUserToFavorite(id, username, avatar_url, track_count, public_favorites_count){
    SC.put('/me/followings/'+id);
    followingsId.push(id);
    followingsIdAllReadyCounted[followingsId.length-1] = [];
    followingsName.push(username);
    followingsImg.push(avatar_url);
    followingsTrackNotifNum[followingsId.length-1] = 0;
    followingsFavoritesNotifNum[followingsId.length-1] = 0;
    followingsTrackTime.push(Math.floor(track_count / 200));
    followingsFavoritesTime.push(Math.floor(public_favorites_count / 200));
    $('#'+id).find('.like').removeClass('like').addClass('done');
    $('#'+id).find('.half1').attr('onclick', '');
    addToFollowings();
}

function showSearchOptions(track, user){
     $displayStatus.append('<div class="searchOption '+track+' col-xs-6 searchTracks searchMenuOption">Tracks</div><div class="'+user+' searchOption col-xs-6 searchUsers searchMenuOption">Users</div>');
    $('.searchMenuOption').click(function(){
        $('.searchMenuOption').toggleClass('searchOptionActive');
    });
    $('.searchUsers').click(function(){
        searchUsers();
    });
    $('.searchTracks').click(function(){
        searchTracks();
    });
}


function addToFollowings(){
    if (loaded){
        loaded = false;
        calculateNewFollowingsTrackNumber(followingsTrackTime[followingsId.length-1]);
    }
}
 
function displayNewFollowings(){
    console.log('displayNewFollowings');
    var index = followingsId.length-1;
    $notif = followingsTrackNotifNum[index] + followingsFavoritesNotifNum[index];
    nbFollowingsAdded++;
    $navigation.prepend('<div class="friend col-xs-12" id="friend'+followingsId[index]+'" onclick="getMusicFollowing('+followingsId[index]+');"><span class="col-xs-2"><img class="img30" src="'+followingsImg[index]+'" alt="friend avatar" class="friendImg" /></span><div class="col-xs-7 center">'+followingsName[index]+'</div><div class="red col-xs-3 center">'+$notif+'</div></div>');
    $menuLeftFollowings.click();
    $followingsFixedContent.scrollTop(0);
    loaded=true;
}

function calculateNewFollowingsTrackNumber(times) {
    console.log('calculateNewFollowingsTrackNumber');
    var offset = times * 200;
    SC.get("/users/" + followingsId[followingsId.length-1] + "/tracks", {
        limit: 200,
        offset: offset
    }, function(songs, error) {
        if (error) {
            displayError();
        } else if (songs.length == 0) {
            calculateNewFollowingsFavoriteNumber(followingsFavoritesTime[followingsId.length-1]);
        } else {
            songs.forEach(function(song, index) {
                if ((!(tabIdFavorites.contains(song.id))) && (!(followingsIdAllReadyCounted[followingsId.length-1].contains(song.id))) && (!(refusedId.contains(song.id.toString()))) && (song.streamable) ) {
                    followingsIdAllReadyCounted[followingsId.length-1].push(song.id);
                    followingsTrackNotifNum[followingsId.length-1]++;
                }
                if (index == songs.length - 1) {
                    if (times == 0)
                        calculateNewFollowingsFavoriteNumber(followingsFavoritesTime[followingsId.length-1]);
                    else {
                        times--;
                        calculateNewFollowingsTrackNumber(times);
                    }
                }
            });
        }
    });
}

function calculateNewFollowingsFavoriteNumber(times) {
    console.log('calculateNewFollowingsFavoriteNumber');
    var offset = times * 200;
    SC.get("/users/" + followingsId[followingsId.length-1] + "/favorites", {
        limit: 200,
        offset: offset
    }, function(songs, error) {
        if (error) {
            displayError();
        } else if (songs.length == 0) {
            displayNewFollowings();
        } else {
            songs.forEach(function(song, index) {
                if ((!(tabIdFavorites.contains(song.id))) && (!(followingsIdAllReadyCounted[followingsId.length-1].contains(song.id))) && (!(refusedId.contains(song.id.toString()))) && (song.streamable)) {
                    followingsIdAllReadyCounted[followingsId.length-1].push(song.id);
                    followingsFavoritesNotifNum[followingsId.length-1]++;
                }
                if (index == songs.length - 1) {
                    if (times == 0)
                        displayNewFollowings();
                    else {
                        times--;
                        calculateNewFollowingsFavoriteNumber(times);
                    }
                }
            });
        }
    });
}