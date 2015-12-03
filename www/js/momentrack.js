$momenTracksHeader = $('#momenTracksHeader');
var tabUsers = [];
$momenTracksHeader.click(function(){
    if (loaded){
        loaded=false;
        reset();
        tabUsers.length=0;
        $.ajax({
            url: "getMomenTracks",
            type:"GET",
            beforeSend: function (xhr) {
                var token = $('meta[name="csrf_token"]').attr('content');
                if (token) {
                      return xhr.setRequestHeader('X-CSRF-TOKEN', token);
                }
            },
            data: {followingsId : followingsId, myId: myId},
            success:function(data){
                res = JSON.parse(data);
                if(!isEmpty(res))
                {
                    for(var i=0; i< res.length; i++)
                    {//res contains users tabs
                        if(res[i]['momentrack'] != null)
                            tabUsers.push(res[i]);
                    }
                    id = tabUsers[0]['momentrack'];
                    getTrack(id, 0);
                }
                else{
                    displayInfos('No friends has a momentrack...start spreading Museek !');
                    $grid.html('');
                    loaded = true;
                }
            }
        }); 
    }
}); 

function setMomenTrack(idTrack){
    $.ajax({
        url: "setMomenTrack",
        type:"POST",
        beforeSend: function (xhr) {
            var token = $('meta[name="csrf_token"]').attr('content');
            if (token) {
                  return xhr.setRequestHeader('X-CSRF-TOKEN', token);
            }
        },
        data: {user_id : myId, track_id : idTrack},
        success:function(data){
            $trackBlock = $('#'+idTrack);
            $trackBlock.find('.moment').removeClass('moment').addClass('done');
        }
    });
}

function displayMomenTracks(){
    var i = 0;
    var dynamicItems = "";
    var icon;
    var highlight;
    for (i; i< tabId.length; i++){
        id = tabId[i];
        url = tabUrl[i];
        img = tabImg[i];
        name = tabName[i];
        friend_id = tabUsers[i].id;
        avatar = tabUsers[i].avatar_url;
        username = tabUsers[i].username; 
        icon = tabIdFavorites.contains(id)?'done':'like';
        dynamicItems += '<div class="item"  data-groups=\'["all", "' + name + '"]\'><input type="hidden" class="item__title" value="' + name + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + img + '" /><div class="'+id+' trackBlock trackBlockNotif " id="'+id+'"><p class="trackPNotif trackOptionTextNotif"><img class="trackCoverNotif" src="'+avatar+'"/>'+username+'</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="now playing" /><img class="trackCover" src="'+img+'" alt="'+name+'" /><div class="quarter half quarter1 half1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon trackIconHalf"></div></div><div class="quarter quarter2 half half2 quarterFirst " title="Add to Likes" onclick="favoriteTrack('+myId+','+friend_id+','+id+');"><div class="'+icon+' trackIcon trackIconHalf"></div></div></div><p class="trackPNotif trackInfoNotif">'+name+'</p></div></div>';
    }
            //'<div class="col-xs-12 notifBlock"><div class="col-xs-3 right"><img class="trackCoverNotif" src="'+tabUsers[i].avatar_url+'"/></div><div class="col-xs-6 center">'+tabUsers[i].username+'\'s best track is <br/> '+tabName[i]+'</div><div class="col-xs-3 left"><img class="trackCoverNotif" src="'+tabImg[i]+'" /></div></div>';
    //'<div class="col-xs-12"><div class="col-xs-3"><img class="trackCoverNotif" src="'+tabImg[i]+'"></div><div class="col-xs-3">'+tabName[i]+" liked</div><div class='col-xs-3'>"+tabUsers[i].username+"</div></div>"; 
    $displayStatus.html('');
    $grid.html('');
    $grid.append(dynamicItems);
    activateShuffle();
    updateListeners();
    loaded=true;
}

function getTrack(id, index){
    SC.get("/tracks/" + id, {limit: 1}, function(track)
    {
        tabId.push(parseInt(track.id));
        tabIdRef.push(parseInt(track.id));
        tabUrl.push(track.permalink_url);
        tabUrlRef.push(track.permalink_url);
        tabName.push(track.user.username + ' ~ ' + track.title);
        tabNameRef.push(track.user.username + ' ~ ' + track.title);
        var img = track.artwork_url;
        if (img == null) {
            img = track.user.avatar_url;
        }
        tabImg.push(img);
        tabImgRef.push(img);
        if (index == tabUsers.length-1)
        {
            displayMomenTracks();
        }
        else{
            index++;
            getTrack(tabUsers[index]['momentrack'], index);
        }
    });
}