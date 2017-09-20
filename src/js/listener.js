window.onload = function(){
    safari.application.addEventListener('beforeNavigate', _onBeforeNavigate, true);
    safari.application.addEventListener('navigate', _onNavigate, true);
}

// Event whenever a new URL is about load there
function _onBeforeNavigate(event) {
    requestURL = event.url;
}

// Event when main frame of the new URL has loaded
function _onNavigate(event) {
    if (requestURL.indexOf("https://www.facebook.com/dialog/return/close") > -1 ||
        requestURL.indexOf("https://twitter.com/intent/tweet/complete") > -1) {
        // safari.application.activeBrowserWindow.activeTab.close();
        return;
    }
    /* - Get Status in ajax - */
    $.ajax({
        url     : requestURL,
        type    : 'get',
        error   : function(xhr, err) {
            handleReadyState(xhr.readyState, xhr.status);
        }   
    });
}

function _onSave() {
    openURL(BaseURL + "/save/", getURL());
}

function _onRecent() {
    wmAvailabilityCheck(getURL(), function(){
        openTab(BaseURL + "/web/2/", getURL());
    }, function(err){
        console.log(err);
    });
}

function _onFirst() {
    wmAvailabilityCheck(getURL(), function(){
        openTab(BaseURL + "/web/0/", getURL());
    }, function(err){
        console.log(err);
    });
}

function _onOverview() {
    wmAvailabilityCheck(getURL(), function(){
        openTab(BaseURL + "/web/*/", getURL());
    }, function(err){
        console.log(err);
    });
}

function _onAlexa() {

}

function _onWhois() {

}

function _onTweets() {

}

function _onRadial() {

}

/**
 * Facebook sharing
 */
function _onFacebook() {
    if (!safari.application.activeBrowserWindow.activeTab.url) return;
    
    var url = safari.application.activeBrowserWindow.activeTab.url;
    var title = safari.application.activeBrowserWindow.activeTab.title;
    var param = "?u=" + encodeURIComponent(url) +  "&title=" + encodeURIComponent(title);
    var sharingURL = 'https://www.facebook.com/sharer/sharer.php' + param;
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = sharingURL;
}

/**
 * Twitter sharing
 */
function _onTwitter() {
    if (!safari.application.activeBrowserWindow.activeTab.url) return;
    
    var url = "http://twitter.com/share?url=" + safari.application.activeBrowserWindow.activeTab.url + "&via=internetarchive";
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = url;
}

/**
 * Google+ sharing
 */
function _onGooglePlus() {
    if (!safari.application.activeBrowserWindow.activeTab.url) return;
    
    var url = "https://plus.google.com/share?url=" + safari.application.activeBrowserWindow.activeTab.url;
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = url;
}

function _onLinkedin() {

}

function _onAbout() {

}

function _onSetting() {

}