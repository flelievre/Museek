/* UNLIKE TRACK */
function refuseTrack(idUser, idTrack, idFriend, page){
    if (loaded){// Page == 0 : My collection; 1: Explore, 2: Search
        loaded=false;
        var $trackBlock = $('#'+idTrack);
        var block = $trackBlock.find('.trackCover');
        var blockUrl = $trackBlock.find('.imgPlayPause');
        var track_name = block.attr('alt');
        var track_cover = block.attr('src');
        var track_url = blockUrl.attr('alt');
        $trackBlock.find('.trackCover').attr('src', "img/utils/loader.gif");
        if (idPlaying == idTrack)
            playNext();
        if (page==0){
            idFriend=idUser;
            SC.delete('/me/favorites/'+idTrack, function(status, error) {
                if (error) {
                    block.attr('src', track_cover);
                    loaded=true;
                } 
            });
        }
        $.ajax({
            url: "refuseTrack",
            type:"POST",
            beforeSend: function (xhr) {
                var token = $('meta[name="csrf_token"]').attr('content');
                if (token) {
                      return xhr.setRequestHeader('X-CSRF-TOKEN', token);
                }
            },
            data: {track_id : idTrack, user_id : myId, friend_id : idFriend, track_cover:track_cover, track_name:track_name, track_url: track_url},
            success:function(data){
                if (page == 1){
                    var nb = $("#friend"+idFriend).find(".red").html();
                    nb--;
                    $("#friend"+idFriend).find(".red").html(nb);
                }
                $('#tracks').find('#'+idTrack).find('.delete').parent().attr('onclick', '');
                $('#tracks').find('#'+idTrack).css('display', 'none');
                nb=$trackRecoveryHeader.find(".nb").html();
                nb++;
                $trackRecoveryHeader.find('.nb').html(nb);
                loaded = true;
                addtoRefuse(idTrack);
                deleteFromLikes(idTrack);
            },error:function(){ 
                alert("error!!!!");
            }

        });
    }
}

function favoriteTrack (idUser, idFriend, idTrack) {
    if (!(tabIdFavorites.contains(idTrack)) && loaded){
        loaded=false;
        $trackBlock = $('#'+idTrack);
        var block = $trackBlock.find('.trackCover');
        var track_name = block.attr('alt');
        var track_cover = block.attr('src');
        var img = $trackBlock.find('.trackCover').attr('src');
        var token = $('meta[name="csrf_token"]').attr('content');
        var url = block.parent().find('.imgPlayPause').attr('alt');
        $trackBlock = $("."+idTrack);
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
                        url: "test",
                        type:"POST",
                        beforeSend: function (xhr) {
                            var token = $('meta[name="csrf_token"]').attr('content');
                            if (token) {
                                  return xhr.setRequestHeader('X-CSRF-TOKEN', token);
                            }
                        },
                        data: {user : userObj, track_id : idTrack, sender_id : myId, friend_id : idFriend, sender_name : myUserName, track_cover : track_cover, track_name : track_name, sender_cover : myAvatarUrl},
                        success:function(data){
                            addtoLikes(idTrack, url, track_name, img);
                            $trackBlock.find('.like').parent().attr('onclick', '').attr('title', 'Added to Likes !');
                            $trackBlock.find('.like').removeClass('like').addClass('done');
                            $trackBlock.find('.trackCover').attr('src', "img/utils/track_added.png");
                            var nb = $("#friend"+idFriend).find(".red").html();
                            nb--;
                            $("#friend"+idFriend).find(".red").html(nb); 
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
    /*
                $.ajax({
                    type : "POST",
                    url : "php/tpl/music/likeTrack_ajax.php",
                    data : {
                        idFriend : idFriend,
                        idUser : idUser,
                        idTrack : idTrack
                    },
                    success : function(msg) {
                        var name = $trackBlock.find('.trackInfo').html();
                        var url = tabUrl[tabId.indexOf(idTrack)];
                        addtoLikes(idTrack, url, name, img);
                        $trackBlock.find('.like').parent().attr('onclick', '').attr('title', 'Added to Likes !');
                        $trackBlock.find('.like').removeClass('like').addClass('done');
                        $trackBlock.find('.trackCover').attr('src', "../img/utils/track_added.svg");
                        var nb = $("#friend"+idFriend).find(".red").html();
                        nb--;
                        $("#friend"+idFriend).find(".red").html(nb); 
                        loaded=true;
                    }
              });
            }
        });
        */