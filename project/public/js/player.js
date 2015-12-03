var lastTrackIdSelected = -1;
var idPlaying=-1;
var soundObject;
var playing = false;
var duration;
var playNextBool = false; //if player should play next track

function updateListeners(){
    $(".trackCover").click(function (){
        if (loaded){
            loaded = false;
            if (lastTrackIdSelected != -1){//if a track was previously selected
                hideTrackOptions(lastTrackIdSelected);
            }
            lastTrackIdSelected = $(this).parent().parent().attr('id');//set new id
            var $parent = $(this).parent(); 
            var $parent2 = $parent.parent();
            $parent.find(".quarterFirst").show();//show quarter options
            $parent2.find(".trackP").visible();//show texts
            $(this).parent().parent().find('.trackInfo').css('background','none'); //reset background to none
            $parent2.addClass('trackBlockActive');//add class active to the block (white background)
            isShowingOptions = true;
            loaded=true;
        } 
    });
    
    $('.soundCloud').click(function(){
        if (loaded){
            loaded=false;
            var id = $(this).parent().parent().attr('id');
            var url;
            url = $(this).parent().find('.imgPlayPause').attr('alt');
            window.open(url, "_blank");
            loaded=true;
        }
    });

    $('.playPause').click(function(){
        if (loaded){
            loaded = false;
            handleTrack($(this).parent().parent().attr('id'));
            loaded=true;
        }
    });

    $(".trackCover").mouseover(function (){//when mouse is over a track cover
            $(this).parent().parent().find('.trackInfo').visible();//show the artist and track name
    });

    $(".trackCover").mouseleave(function (){//when mouse is leaving a track 
        var $parent2 = $(this).parent().parent();
        if(lastTrackIdSelected != $parent2.attr('id'))//if the track is not selected
            $parent2.find('.trackInfo').invisible();//hide the track name and artist
        else if (!isShowingOptions){
            $parent2.find('.trackInfo').invisible();
        }
    });

    $('.quarter').mouseover(function (){//when mouse over a quarter display the option action text in the text above
        $(this).parent().parent().find('.trackOptionText').html($(this).attr('title'));
    });

    $('.quarter1, .quarter2, .quarter3').click(function (){//when clicking on quarter 1 ,2 or 3 
        hideTrackOptions($(this).parent().parent().attr('id'));//hide the track options and texts (which are corresponding to the ids)
    });

    $('.quarter4').click(function (){
        if ($(this).hasClass('quarterFirst')){
            $(this).parent().find('.quarterSecond').show();
            $(this).parent().find('.quarterFirst').hide();
        }
        else{
            $(this).parent().find('.quarterFirst').show();
            $(this).parent().find('.quarterSecond').hide();
        }
    });
    loaded= true;
}

(function($) {
    $.fn.invisible = function() {
        return this.css("opacity", "0");
    };
    $.fn.visible = function() {
        return this.css("opacity", "1");
    };
})(jQuery);


function hideTrackOptions(id){//hide the track options and texts corresponding to the track of id "id".
    $("."+id).find('.quarter').hide();
    $("."+id).removeClass('trackBlockActive');
    $("."+id).find('.trackInfo').css('background','rgba(255,255,255,0.8)');
    $("."+id).find('.trackP').invisible();
    isShowingOptions = false;
}

function handleTrack(id){
    if (playNextBool || (hasClickedNextPlay && nextClickedPlay!=nextClickedPlayPrev)) {
        playNextTrack(id);
    }
    else{
        if (id == idPlaying){
            if (playing){
                pauseTrack();
            }
            else
                resumeTrack();
        }
        else{
            playNewTrack(id);
        }
    }
}

function pauseTrack(){
    soundObject.pause();
    graphicalPause();
    playing = false;
}



function graphicalPause(){
    if(tabId.contains(idPlaying)){
        var $trackBlock = $tracks.find('.'+idPlaying);
        $trackBlock.find('.imgPlayPause').attr('src', '     img/pause.svg ').show();
        $trackBlock.find('.trackCover').css('opacity', '0.5');
        $trackBlock.find('.playPause').find('.trackIcon').removeClass('pause').addClass('play').parent().attr('title', 'Play Track');
    }
    //change next menu graphics
    $playPlayer.removeClass('pausePlayer').addClass('playPlayer');
}

function resumeTrack(){
    play(soundObject);
    graphicalResume();
    playing = true;
}

function graphicalResume(){
    var index = tabId.indexOf(idPlaying);
    if(index > -1){
        var $trackBlock = $tracks.find('.'+idPlaying);
        $trackBlock.find('.imgPlayPause').attr('src', 'img/play.svg ').show();
        $trackBlock.find('.trackCover').css('opacity', '0.5');
        $trackBlock.find('.playPause').find('.trackIcon').removeClass('play').addClass('pause').parent().attr('title', 'Pause Track');
        var img = tabImg[index];//retrieve the img
        var img500 = img.substr(0, img.length-9);//subtract the -large.jpg
        img500+="t500x500.jpg";
        $playerCover.attr('src', img);
        $playerCover.attr('alt', $trackBlock.find('.trackCoverBlock').find('.imgPlayPause').attr('alt'));
        $playerTrackName.html(tabName[index]);
        $backgroundCover.attr('src', img500);
    }
    //tabIdFavorites.contains(idPlaying)?$likePlayer.removeClass('nbLikes').addClass('done') : $likePlayer.removeClass('done').addClass('nbLikes');
    $playPlayer.removeClass('playPlayer').addClass('pausePlayer');
} 


function graphicalNext(){
    var $next = $('#next'+indexNext);
    var alt = $next.find('.col-xs-7').html();
    var img = $next.find('.img30').attr('src');
    var img500 = img.substr(0, img.length-9);//subtract the -large.jpg
    img500+="t500x500.jpg";
    $playerCover.attr('src', img);
    $playerTrackName.html(alt);
    $backgroundCover.attr('src', img500);
    graphicalResume();
}

function playNewTrack(id){
    if (playNextBool || (hasClickedNextPlay && nextClickedPlay!=nextClickedPlayPrev)){
        playNextBool=false;
        hasClickedNextPlay=false;
    }
    if(soundObject)
        soundObject.destruct();
    graphicalReset();
    idPlaying = parseInt(id);
    SC.stream("/tracks/" + id, function(sound){
        SC.get("/tracks/" + id, {limit: 1}, function(track){
            duration = track.duration;
        });
        soundObject = sound;
        soundObject.setVolume($volPlayer.slider( "value" ))
        resumeTrack();
    });
}

function playNextTrack(id){
    playNextBool=false;
    hasClickedNextPlay=false;
    if(soundObject)
        soundObject.destruct();
    graphicalReset();
    idPlaying = parseInt(id);
    SC.stream("/tracks/" + id, function(sound){
        SC.get("/tracks/" + id, {limit: 1}, function(track){
            duration = track.duration;
        });
        soundObject = sound;
        soundObject.setVolume($volPlayer.slider( "value" ))
        play(soundObject);
        graphicalNext();
        playing = true;
    });
}

function graphicalReset(){
    if(tabId.contains(idPlaying)){
        var $trackBlock = $tracks.find('.'+idPlaying);
        $trackBlock.find('.imgPlayPause').attr('src', 'img/pause.svg ').hide();
        $trackBlock.find('.trackCover').css('opacity', '1');
        $trackBlock.find('.playPause').find('.trackIcon').removeClass('pause').addClass('play').parent().attr('title', 'Play Track');;
    }
    $playPlayer.removeClass('pausePlayer').addClass('playPlayer');
    
}

function play(sound){
    var progress;
    //$("#playerTimeLeft").html("- " + secondsToTime(sound.duration/1000));
    sound.play({
        onload: function() {
            if (this.readyState == 2) {
                playNext();
                return true;
            }
        },
        whileplaying: function() {
            var width = sound.position/sound.durationEstimate*100;
            var loadingWidth = sound.duration/sound.durationEstimate*100;
            //$("#player-progress-bar .progress-bar.loading").width(loadingWidth+"%");
            $loadingProgress.width(loadingWidth+"%");
            $trackProgress.width(width+"%");
            //progress = sound.position/sound.duration;
            //p = secondsToTime(sound.duration/1000 - (progress*sound.duration/1000));
            //if (loadingWidth == 100)
            //    $("#playerTimeLeft").html("- " + p);
        },
        onfinish: function() {
            playNext();
        }
    });
}


function playNext(){
    if (indexNext > -1)
        hideNext();
    if (indexNext < (idNext.length-1)){
        playNextFromNexts();
    }
    else{
        var next;
        var index = tabId.indexOf(idPlaying);
        if (index == (tabId.length-1))
            next=tabId[0];
        else
            next=tabId[index+1];
        if (next == idPlaying)
                playNewTrack(next);
        else 
            handleTrack(next);  
    }
}

function playPrevious(){
    var previous;
    var index = tabId.indexOf(idPlaying);
    //if (index ==-1)
    //    index = tabId.indexOf(idPlaying);
    if (index == 0)
        previous=tabId[tabId.length-1];
    else if (index == -1)
        previous = tabId[index+1];
    else
        previous=tabId[index-1];
    handleTrack(previous);    
}

function getId(id){
    return (parseInt(id) == -1) ? id : parseInt(id);
}