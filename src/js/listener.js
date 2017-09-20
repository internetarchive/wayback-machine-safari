function _onSave() {
    openURL(BaseURL + "/save/" + getURL());
}

function _onRecent() {
    var url = safari.application.activeBrowserWindow.activeTab.url;
    wmAvailabilityCheck(getOriginalURL(url), null, function(wayback_url, url) {
        safari.application.activeBrowserWindow.activeTab.url = wayback_url;
    });
}

function _onFirst() {
    var url = safari.application.activeBrowserWindow.activeTab.url;
    wmAvailabilityCheck(getOriginalURL(url), "00000000000000", function(wayback_url, url) {
        safari.application.activeBrowserWindow.activeTab.url = wayback_url;
    });
}

function _onOverview() {

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