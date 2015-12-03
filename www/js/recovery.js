$trackRecoveryHeader = $('#trackRecoveryHeader');
$trackRecoveryHeader.click(function(){
    reset();
    $.ajax({
        url: "getMyRefuse",
        type:"GET",
        beforeSend: function (xhr) {
            var token = $('meta[name="csrf_token"]').attr('content');
            if (token) {
                  return xhr.setRequestHeader('X-CSRF-TOKEN', token);
            }
        },
        data: {id : myId},
        success:function(data){
            res = JSON.parse(data);
            if (!isEmpty(res)){
                var i = 0;
                var dynamicItems = "";
                displayInfos('MISTAKE HAPPENS...RECOVER ANY TRACK YOU REFUSED');
                for (i; i< res.length; i++){
                    var id = res[i].track_id;
                    var name = res[i].track_name;
                    var img = res[i].track_cover;
                    var friend_id = res[i].friend_id;
                    var url = res[i].track_url;
                    tabId.push(id);
                    tabIdRef.push(id);
                    tabName.push(name);
                    tabNameRef.push(name);
                    tabImg.push(img);
                    tabImgRef.push(img);
                    tabUrl.push(url);
                    tabUrlRef.push(url);
                    dynamicItems += '<div class="item"  data-groups=\'["all", "' + name + '"]\'><input type="hidden" class="item__title" value="' + name + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__url" value="' + url + '" /><input type="hidden" class="item__img" value="' + img + '" /><div class="trackBlock '+id+'" id="'+id+'"><p class="trackP trackOptionText">Play</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="now playing" /><img class="trackCover" src="'+img+'" alt="'+name+'" /><div class="quarter half quarter1 half1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon trackIconHalf"></div></div><div class="quarter quarter2 half half2 quarterFirst " title="Add to Likes" onclick="favoriteTrackRefuse('+id+','+friend_id+');"><div class="like trackIcon trackIconHalf"></div></div></div><p class="trackP trackInfo">'+name+"..."+'</p></div></div>';
                       // '<div class="item"  data-groups=\'["all", "' + name + '"]\'><input type="hidden" class="item__title" value="' + name + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + img + '" /><div class="trackBlock" id="'+id+'"><p class="trackP trackOptionText">Play</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="now playing" /><img class="trackCover" src="'+img+'" alt="'+name+'" /><div class="quarter quarter1 quarterFirst playPause" title="Play Track" id="play"><div class="play trackIcon"></div></div><div class="quarter quarter2 quarterFirst " title="Add to Likes" onclick="favoriteTrack('+myId+','+idUser+','+id+');"><div class="like trackIcon"></div></div><div class="quarter quarter3 quarterFirst " title="Refuse track" onclick="refuseTrack('+myId+', '+id+','+idUser+', 1);"><div class="delete trackIcon"></div></div><div class="quarter quarter4 quarterFirst" title="More options ..."><div class="more trackIcon"></div></div><div class="quarter quarter1 quarterSecond " title="Recommend to...""><div class="recommend trackIcon"></div></div><div class="quarter quarter2 quarterSecond" title="Play next" onclick="addToNexts('+id+');"><div class="next trackIcon"></div></div><div id="'+i+'sc" class="quarter quarter3 quarterSecond soundCloud" title="Listen in SoundCloud"><div class="soundcloud trackIcon"></div></div><div class="quarter quarter4 quarterSecond " title="More options ..."><div class="more trackIcon"></div></div></div><p class="trackP trackInfo">'+name+"..."+'</p></div></div>';
                }
                $grid.html('');
                $grid.append(dynamicItems);
                activateShuffle();
                updateListeners();
                loaded=true;
            }
            else{
                displayInfos('No track refused...Nothing to recover !');
                $grid.html('');
                loaded = true;
            }
        }
    });
});


function favoriteTrackRefuse (idTrack, idFriend) {
    if (!(tabIdFavorites.contains(idTrack)) && loaded){
        loaded=false;
        $trackBlock = $('#'+idTrack);
        var block = $trackBlock.find('.trackCover');
        var track_name = block.attr('alt');
        var track_cover = block.attr('src');
        var img = $trackBlock.find('.trackCover').attr('src');
        var token = $('meta[name="csrf_token"]').attr('content');
        $trackBlock.find('.trackCover').attr('src', "img/utils/loader.gif");
        SC.put('/me/favorites/'+idTrack, function(status, error) {
            if (error) {
                alert("Une erreure s'est produit, veuillez rééssayez.");
                $trackBlock.find('.trackCover').attr('src', img);
                loaded=true;
            } else {
                var userObj;
                SC.get('/users/'+idFriend, function(user) {
                    var userObj = user;
                    $.ajax({
                        url: "relike",
                        type:"POST",
                        beforeSend: function (xhr) {
                            var token = $('meta[name="csrf_token"]').attr('content');
                            if (token) {
                                  return xhr.setRequestHeader('X-CSRF-TOKEN', token);
                            }
                        },
                         data: {user : userObj, track_id : idTrack, sender_id : myId, friend_id : idFriend, sender_name : myUserName, track_cover : track_cover, track_name : track_name, sender_cover : myAvatarUrl},
                        success:function(data){
                            var name = $trackBlock.find('.trackInfo').html();
                            var url = tabUrl[tabId.indexOf(idTrack)];
                            addtoLikes(idTrack, url, name, img);
                            $trackBlock.find('.like').parent().attr('onclick', '').attr('title', 'Added to Likes !');
                            $trackBlock.find('.like').removeClass('like').addClass('done');
                            $trackBlock.find('.trackCover').attr('src', "img/utils/track_added.png");
                            $('#tracks').find('#'+idTrack).find('.delete').parent().attr('onclick', '');
                            $('#tracks').find('#'+idTrack).css('display', 'none');
                            nb=$trackRecoveryHeader.find(".nb").html();
                            nb--;
                            $trackRecoveryHeader.find('.nb').html(nb);
                            deleteFromRefused(idTrack);
                            loaded=true;
                        },error:function(){ 
                            alert("error!!!!");
                        }
                    });
                });
            }
        });
    }
}

