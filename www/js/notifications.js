$notificationsHeader = $('#notificationsHeader');
$nbNotif = $notificationsHeader.find('.nbNotif');

$notificationsHeader.click(function(){
    if (loaded){
        loaded = false;
        reset();
        $.ajax({
            url: "getMyNotifications",
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
                if(!isEmpty(res))
                {
                    var i = 0;
                    $nbNotif.html(res.length);
                    var dynamicItems = "";
                    displayInfos('Who liked your tracks ?');
                    for (i; i< res.length; i++){
                        var id = res[i].track_id;
                        var idNotif = res[i].id;
                        var name = res[i].track_name;
                        var img = res[i].track_cover;
                        var friend_id = res[i].friend_id;
                        tabId.push(id);
                        tabIdRef.push(id);
                        tabName.push(name);
                        tabNameRef.push(name);
                        tabImg.push(img);
                        tabImgRef.push(img);    
                        dynamicItems += '<div class="item"  data-groups=\'["all", "' + name + '"]\'><input type="hidden" class="item__title" value="' + name + '" /><input type="hidden" class="item__id" value="' + id + '" /><input type="hidden" class="item__img" value="' + img + '" /><div class="'+idNotif+' trackBlock trackBlockNotif" id="'+idNotif+'"><p class="trackPNotif trackOptionTextNotif"><img class="trackCoverNotif" src="'+res[i].sender_cover+'"/>'+res[i].sender_name+' added</p><div class="trackCoverBlock"><img class="imgPlayPause" src="img/play.svg" alt="now playing" /><img class="trackCover" src="'+img+'" alt="'+name+'" /><div class="quarter quarter2 half half2 quarterFirst full" title="Hide notification" onclick="hideNotif('+idNotif+');"><div class="delete trackIcon trackIconHalf"></div></div></div><p class="trackPNotif trackInfoNotif">'+name+'</p></div></div>';
                    }
                            //'<div class="col-xs-12 notifBlock"><div class="col-xs-3 right"><img class="trackCoverNotif" src="'+res[i].sender_cover+'"/></div><div class="col-xs-6 center">'+res[i].sender_name+' liked <br/> '+res[i].track_name+'</div><div class="col-xs-3 left"><img class="trackCoverNotif" src="'+res[i].track_cover+'" /></div></div>';
                    $grid.html('');
                    $grid.append(dynamicItems);
                    activateShuffle();
                    updateListeners();
                    loaded=true;
                }
                else{
                    displayInfos('No notifications yet..talk about Museek to your friends and start sharing songs !');
                    $grid.html('');
                    loaded = true;
                }
            }
        });
    }
});


function hideNotif(idNotif){
    if (loaded){
        loaded = false;
        $.ajax({
            url: "hideNotif",
            type:"POST",
            beforeSend: function (xhr) {
                var token = $('meta[name="csrf_token"]').attr('content');
                if (token) {
                      return xhr.setRequestHeader('X-CSRF-TOKEN', token);
                }
            },
            data: {idNotif : idNotif, idUser : myId},
            success:function(data){
                $("#"+idNotif).remove();
                var nb = $nbNotif.html();
                nb--;
                $nbNotif.html(nb);
                loaded = true;
            }
        });
    }
}