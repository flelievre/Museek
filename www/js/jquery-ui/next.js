var idNext = [];
var nameNext = [];
var imgNext = [];
var indexNext = -1;
var infoNextTime = [];


function addToNexts(id){
    if (!idNext.contains(id)){
        var src = $('#'+id).attr('src');
        var alt = $('#'+id).attr('alt');
        idNext[idNext.length] = id;
        nameNext[nameNext.length] = alt;
        imgNext[imgNext.length] = src;
        $('#scrollable').append('<div class="blocImgNext" id="blocImgNext'+id+'"><div class="imgHighlight"><img id="next'+id+'" class="imgNext" alt="'+alt+'" src="'+src+'" onclick="playTrack('+id+');changeIndexNext('+id+');hidePreviousNexts();" /></div><div class="infoNext" onclick="playTrack('+id+');changeIndexNext('+id+');hidePreviousNexts();"></div><div class="deleteNext" onclick="deleteNext('+id+');"><img class="deleteNextImg" src="../img/next/deleteNext.png" alt="delete"/></div></div>');
        $('#scrollable').find("#blocImgNext"+id).bind("mouseenter",function(){
            clearTimeout(infoNextTime[id]);
            $(this).width('160px');
            $name = alt.split("~");
            $name = $name[1].substr(0, 16);
            $(this).find(".infoNext").html($name);
            $(this).find(".deleteNext").css('display', 'inline-block');
            }).bind("mouseout",function(){
            var $this = $(this);
            clearTimeout(infoNextTime[id]);
            infoNextTime[id] = setTimeout(function() { 
                $this.find(".deleteNext").css('display', 'none');
                $this.find(".infoNext").html("");
                $this.width('30px');
            }, 2000);
        });
        $('#scrollable').find("#blocImgNext"+id).find('.deleteNextImg').bind("mouseenter",function(){
            $(this).css('background-color', '#E6C09F');
        }).bind("mouseout", function(){
            $(this).css('background-color', 'white');
        });
    }
} 

function playNextFromNexts(){
    indexNext = indexNext+1;
    var nextNext;
    if (idNext.length == 0)
        playNext();
    else {
        playNextBool = true;
        if (indexNext == idNext.length)
            nextNext=idNext[0];
        else
            nextNext=idNext[indexNext];
        $('#blocImgNext'+nextNext).find('.imgHighlight').css('background-color', '#FF3838');
        playTrack(nextNext);  
    }
}

function changeIndexNext(id){
    indexNext = idNext.indexOf(id);
}

function hideNext(){
    $("#next"+idNext[indexNext]).css('opacity', '0.3');
}

function hidePreviousNexts(){
    for (var i = 0; i < indexNext; i++){
        $("#next"+idNext[i]).css('opacity', '0.3');
        $('#blocImgNext'+idNext[i]).find('.imgHighlight').css('background-color', '#FF3838');
    }
    $('#blocImgNext'+idNext[i++]).find('.imgHighlight').css('background-color', '#FF3838');
}

function deleteNext(id){
    if (id == idPlaying)
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
    console.log(indexToDel);
    $('#scrollable').find("#blocImgNext"+id).remove();
}

function deleteAllNexts(id){
    if (idNext.contains(idPlaying))
        playNext();
    idNext = [];
    imgNext = [];
    nameNext = [];
    indexNext = -1;
    $('#scrollable').find(".blocImgNext").remove();
}