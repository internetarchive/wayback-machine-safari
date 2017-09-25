window.onload = function(){
    safari.application.addEventListener("beforeNavigate", _onBeforeNavigate, true);
    safari.application.addEventListener("navigate", _onNavigate, true);
    safari.application.addEventListener("message", handleMessage, true);
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
    
    $.ajax({
        url     : requestURL,
        type    : 'get',
        error   : function(xhr, err) {
            handleReadyState(xhr.readyState, xhr.status);
        }
    });
}

function handleMessage(event) {
    if (event.name = "OPEN_URL") {
        openTab(event.message["wbURL"], getOriginalURL(event.message["pageURL"]));
    }
}

function _onSave(url) {
    openURL(BaseURL + "/save/", url);
}

function _onRecent(url) {
    wmAvailabilityCheck(getOriginalURL(url), function(){
        openTab(BaseURL + "/web/2/", getOriginalURL(url));
    });
}

function _onFirst(url) {
    wmAvailabilityCheck(getOriginalURL(url), function(){
        openTab(BaseURL + "/web/0/", getOriginalURL(url));
    });
}

function _onOverview(url) {
    wmAvailabilityCheck(getOriginalURL(url), function(){
        openTab(BaseURL + "/web/*/", getOriginalURL(url));
    });
}

function _onAlexa(url) {
    openTab("https://www.alexa.com/siteinfo/", getOriginalURL(url));
}

function _onWhois(url) {
    console.log("URL-", url);
    console.log("GetOriginalURL-", getOriginalURL(url));
    openTab("https://www.whois.com/whois/", getOriginalURL(url));
}

function _onTweets(url) {
    url = getOriginalURL(url);
    if (url.includes("http://")) {
        url = url.substring(7);
    } else if (url.includes("https://")) {
        url = url.substring(8);
    }

    url = url.slice(-1) == "/" ? url.substring(0, url.length -1) : url;
    openTab("https://twitter.com/search?q=", url);
}

function _onRadial(url) {
    dispatchMessage("RADIAL_TREE", {url: getOriginalURL(url)});
}

/**
 * Facebook sharing
 */
function _onFacebook(url) {
    openTab("https://www.facebook.com/sharer/sharer.php?u=", url);
}

/**
 * Twitter sharing
 */
function _onTwitter(url) {
    openTab("http://twitter.com/share?url=", url);
}

/**
 * Google+ sharing
 */
function _onGooglePlus(url) {
    openTab("https://plus.google.com/share?url=", url);
}

function _onLinkedin(url) {
    openTab("https://www.linkedin.com/shareArticle?url=", url);
}

function _onSearch(keyword, callback) {
    getSuggestions(keyword, function(urls){
        callback(urls);
    });
}