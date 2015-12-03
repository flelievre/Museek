$volet = $( "#volet" );
$text = $volet.find('#text');
$fixed = $volet.find('.fixed-content-reco');
$header = $volet.find('#header');
$recoImg = $volet.find('#recoImg');
$string = "";
var recoIds = [];
function showRecommendMenu(track_id){
    if (loaded){
        loaded=false;
        $fixed.hide();
        $volet.hide();
        $trackBlock = $('#'+track_id);
        var block = $trackBlock.find('.trackCover');
        var track_name = block.attr('alt');
        var track_cover = block.attr('src');
        var track_url = block.parent().find('.imgPlayPause').attr('alt');
        header = "<img src='"+track_cover+"' class='img30' />"+track_name+" to a friend !";
        $string = "";
        $text.html("");
        $header.html("");
        followingsName.forEach(function (name, index){
            var user_id = followingsId[index];
            var user_img = followingsImg[index];
            $string +="<div class='col-xs-12 friend' onclick='selection("+user_id+", \""+user_img+"\");sendReco("+user_id+");' id='reco"+user_id+"'><span class='col-xs-2 right'><span class='done hide'></span></span><span class='col-xs-2 center'><img class='img30' src='"+followingsImg[index]+"' /></span><span class='col-xs-8'>"+name+"</span></div>";
            if (index == followingsName.length-1){
                $header.append(header); 
                $text.append($string);
                $volet.slideDown( "slow" );
                $fixed.slideDown('slow');
                
        loaded=true;
            }
        });
    }
}

function closeRecommendMenu(){
    if (loaded){
        loaded=false;
        $recoImg.html("");
        recoIds.length=0;
        $volet.slideUp( "slow" );
        $fixed.slideUp( "slow" );
        loaded=true;
    }
}

function selection(id, img){
    if (recoIds.contains(id)){
        console.log(recoIds.length);
        recoIds.splice(recoIds.indexOf(id), 1);
        $recoImg.find('#recoImg'+id).remove();
        console.log(recoIds.length);
    }
    else{
        recoIds.push(id);
        $recoImg.append("<img class='img30 recoImg' id='recoImg"+id+"' src='"+img+"' />");
    }
    $block = $("#reco"+id);
    $block.hasClass('highlight')?$block.removeClass('highlight'):$block.addClass('highlight');
    $check = $block.find('.done');
    $check.hasClass('hide')?$check.removeClass('hide').addClass('show'):$check.removeClass('show').addClass('hide')
}

function sendReco(){
     if (loaded){
        loaded = false;
        $.ajax({
            url: "sendReco",
            type:"POST",
            beforeSend: function (xhr) {
                var token = $('meta[name="csrf_token"]').attr('content');
                if (token) {
                      return xhr.setRequestHeader('X-CSRF-TOKEN', token);
                }
            },
            data: {},
            success:function(data){
                console.log(data);
                loaded = true;
            }
        });
    }
}