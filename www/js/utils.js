var token = $("#token").val();

SC.initialize({
    client_id: '4ebdbf269b04fe4b391f2083f692aa46',
    client_secret : '7bc269cd2395e48d14933cee98db486a',
    redirect_uri: 'http://museek.alwaysdata.net/play',
    access_token: token,
    scope: 'non-expiring'
}); 
/*
function ReadCookie(cookieName) {
    var theCookie=" "+document.cookie;
    var ind=theCookie.indexOf(" "+cookieName+"=");
    if (ind==-1) ind=theCookie.indexOf(";"+cookieName+"=");
    if (ind==-1 || cookieName=="") return "";
    var ind1=theCookie.indexOf(";",ind+1);
    if (ind1==-1) ind1=theCookie.length; 
    return unescape(theCookie.substring(ind+cookieName.length+2,ind1));
}
*/
function displayError(){
    $('.displayStatus').html('Sorry, there was an internal error from SoundCloud, please click below to retry...');
}
function displayInfos(message){
    $('.displayStatus').html(message);
}

function calculatePaddingBlocMusic(){
    var nbCovers = Math.floor($("#blocMusic").width()/130);
    var dec = ($("#blocMusic").width()/130)-nbCovers;
    var paddingLeftBlocMusic = (($("#blocMusic").width()-nbCovers*130-30)/2);
    $('#blocMusic').css('padding-left', paddingLeftBlocMusic);
}

function resetGrid() {
    var $grid = $('#grid');
    $grid.shuffle('destroy');
}

function reset(){
    $('#tracks').find('#grid').css('display', 'none');
    $('#tracks').find('#grid').html('');
    displayInfos("Loading...");
    if (lastIndexSelected !=-1)
        $('#friend'+followingsId[lastIndexSelected]).css("color", "#777");
    resetGrid();
    tabIdRef.length=0;
    tabUrl.length=0;
    tabUrlRef.length=0;
    tabNameRef.length=0;
    tabImgRef.length=0;
    tabId.length=0;
    tabImg.length=0;
    tabName.length=0;
    tabUserId.length=0;
    tabUserIdRef.length=0;
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function addtoRefuse(id){
    refusedId.push(id);
}

function addtoLikes(id, url, name, img){
    tabIdFavorites.unshift(id);
    tabUrlFavorites.unshift(url);
    tabNameFavorites.unshift(name);
    tabImgFavorites.unshift(img);
}

function deleteFromRefused(idTrack){
    refusedId.splice(refusedId.indexOf(idTrack.toString()), 1);
}

function deleteFromLikes(id){
    tabUrlFavorites.splice(tabIdFavorites.indexOf(id), 1);
    tabNameFavorites.splice(tabIdFavorites.indexOf(id), 1);
    tabImgFavorites.splice(tabIdFavorites.indexOf(id), 1);
    tabNameRef.splice(tabIdRef.indexOf(id), 1);
    tabName.splice(tabId.indexOf(id), 1);
    tabUrlRef.splice(tabIdRef.indexOf(id), 1);
    tabUrl.splice(tabId.indexOf(id), 1);
    tabImgRef.splice(tabIdRef.indexOf(id), 1);
    tabImg.splice(tabId.indexOf(id), 1);
    tabId.splice(tabId.indexOf(id), 1);
    tabIdRef.splice(tabIdRef.indexOf(id), 1);
    tabIdFavorites.splice(tabIdFavorites.indexOf(id), 1);
}


function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

 var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};
function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}



