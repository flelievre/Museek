var idNext = [];
var nameNext = [];
var imgNext = [];
var indexNext = -1;
var infoNextTime = [];
var nextClickedPlay = 0;
var hasClickedNextPlay = false;
var nextClickedPlayPrev = 0;
/*
(function($) {
    var oldHide = $.fn.popover.Constructor.prototype.hide;

    $.fn.popover.Constructor.prototype.hide = function() {
        if (this.options.trigger === "hover" && this.tip().is(":hover")) {
            var that = this;
            // try again after what would have been the delay
            setTimeout(function() {
                return that.hide.call(that, arguments);
            }, that.options.delay.hide);
            return;
        }
        oldHide.call(this, arguments);
    };
})(jQuery);
*/

function addToNexts(id){
    var $trackBlock = $('#'+id);
    var src = $trackBlock.find('.trackCover').attr('src');
    var alt = $trackBlock.find('.trackInfo').html().substr(0, 30);
    idNext.push(id);
    nameNext.push(alt);
    imgNext.push(src);
    var length=idNext.length-1;
    $next.append('<div class="friend col-xs-12 spanNext" id="next'+length+'"><span class="col-xs-2" onclick="setINextClicked('+length+');handleTrack('+id+');"><img class="img30 friendImg" src="'+src+'" alt="next cover" /></span><div class="col-xs-7 center" onclick="setINextClicked('+length+');handleTrack('+id+');">'+alt+'</div></div></div>');
    $menuLeftNext.click();
                //<div class="col-xs-3 center" onclick="deleteNext('+id+','+length+');"><div class="img30 delete" id="delete'+length+'" ></div>
                 //<span id="next'+id+'" class="col-xs-12 spanNext '+spanIndex+'" title="'+alt+'"><img class="menuLeftCover trackCoverNext" src="'+src+'"/><ul><li class="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1"><a href="#" id="'+spanIndex+'" onclick="setINextClicked('+spanIndex+');playTrack('+id+');changeIndexNext('+id+');hidePreviousNexts();" class="play"></a></li><li class="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1"><a href="#" class="delete deleteNext" id="'+id+'"></a></li><li class="sep">'+alt.substr(0,50)+'</li></ul></span>');
//<div class="friend col-xs-12" id="friend'+followingsId[indexFollowings]+'" onclick="getMusicFollowing('+followingsId[indexFollowings]+');"><span class="col-xs-2"><img class="img30" src="'+followingsImg[indexFollowings]+'" alt="friend avatar" class="friendImg" /></span><div class="col-xs-7 center">'+followingsName[indexFollowings]+'</div><div class="red col-xs-3 center">'+$notif+'</div></div>
    //</div><div class="infoNext" onclick="playTrack('+id+');changeIndexNext('+id+');hidePreviousNexts();"></div><div class="deleteNext" onclick="deleteNext('+id+');"><img class="deleteNextImg" src="../img/next/deleteNext.png" alt="delete"/></div></div>');
    /*$('.deleteNext').click(function(){
        if ($(this).attr('id') == idPlaying)
            playNext();
        if (idNext.indexOf(id) <= indexNext)
            indexNext--;
        var indexToDel;
        idNext = jQuery.grep(idNext, function(value, index) {
            var res = true;
            if (value == id){
              indexToDel = index;
              res= false;
            }
            return res; 
        });
        imgNext.splice(indexToDel, 1);
        nameNext.splice(indexToDel, 1);
        $(this).parent().parent().parent().remove();
    });*/
} 

function playNextFromNexts(){
    console.log('ici');
    console.log(indexNext);
    indexNext = indexNext+1;
    $("#next"+indexNext).css('background-color', '#DDD').css('opacity', '1');
    var nextNext;
    if (idNext.length == 0)
        playNext();
    else {
        playNextBool = true;
        if (indexNext == idNext.length)
            nextNext=idNext[0];
        else 
            nextNext=idNext[indexNext];
        handleTrack(nextNext);  
    }
}

function deleteNext(id, index){
    console.log("indexNext :"+indexNext+", index :"+index);
    if (id == idPlaying)
        playNext();
    if (index <= indexNext){
        console.log(indexNext);
        indexNext--;
        console.log(indexNext);
    }   
    var indexToDel;
    idNext = jQuery.grep(idNext, function(value, index) {
        var res = true;
        if (value == id){
          indexToDel = index;
          res= false;
        }
        return res; 
    });
    imgNext.splice(indexToDel, 1);
    nameNext.splice(indexToDel, 1);
    $('#delete'+index).parent().parent().remove();
}

function setINextClicked(index){
    nextClickedPlayPrev = nextClickedPlay;
    nextClickedPlay = index;
    indexNext = index; 
    $("#next"+index).css('background-color', '#DDD').css('opacity', '1');
    hidePreviousNexts();
    hideNextsNexts();
    hasClickedNextPlay = true;
}

function changeIndexNext(index){
}

function hideNext(){
    $("#next"+indexNext).css('background-color', '#EEE').css('opacity', '0.7');
}

function hidePreviousNexts(){
    for (var i = 0; i < indexNext; i++){
        $("#next"+i).css('background-color', '#EEE').css('opacity', '0.7');
    }
}

function hideNextsNexts(){
    for (var i = indexNext+1; i < idNext.length; i++){
        $("#next"+i).css('background-color', '#F7F7F7').css('opacity', '1');
    }
}

function deleteAllNexts(id){
    if (idNext.contains(idPlaying))
        playNext();
    idNext = [];
    imgNext = [];
    nameNext = [];
    indexNext = -1;
    $('#scrollable').find(".spanNext").remove();
}