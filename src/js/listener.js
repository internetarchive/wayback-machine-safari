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
    openTab("http://www.alexa.com/siteinfo/", getOriginalURL(url));
}

function _onWhois(url) {
    openTab("http://www.whois.com/whois/", getOriginalURL(url));
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

function _onAbout() {
    var html = "<h2><strong>The Official Wayback Machine Extension:</strong></h2>" + 
               "<p>In cooperation with GSoC, The Internet Archive presents The Official WayBack Machine Extension. With the power of the WayBack&nbsp;Machine, we let you go in time to see how a URL has changed and evolved through the history of the Web!</p>" + 
               "<p><strong> Features</strong></p>" + 
               "<ul>" + 
                    "<li><strong>Save Page Now</strong></li>" +
                        "<ul>Allows you to instantly save the page you are currently viewing in The WayBack Machine.</ul>" +
                    "<li><strong>Recent Version &amp; First Version</strong></li>" + 
                        "<ul>View the most recent, and the first version of a page, in the WayBack Machine.</ul>" + 
                    "<li><strong>Alexa &amp; Whois</strong></li>" + 
                        "<ul>gives analytical information about the page you are currently viewing, along with interesting facts, such as who owns it and how popular it is.</ul>" + 
                    "<li><strong>Tweets</strong></li>" + 
                        "<ul>Searches Twitter For information Regarding your current page.</ul>" + 
                "</ul>" + 
                "<p><strong>Modes</strong></p>" + 
                "<ul>" + 
                    "<li><span>✅</span><br>Your page is in the WayBack Machine.</li>" + 
                    "<li><span style='background-color:red;color:white;'>☓</span><br>Your page is not Currently in the WayBack Machine.</li>" + 
                    "<li><span>⛔</span><br>Your page can not be saved in the Wayback Machine.</li>" + 
                "</ul>" +
                "<p><strong>License</strong></p>" + 
                "<p>&nbsp;Copyright Internet Archive, 2017 AGPL-3&nbsp;</p>" + 
                "<p><strong>Credit</strong></p>" + 
                "<p>" + 
                    "Richard Caceres, @rchrd2&nbsp;<br>" + 
                    "Mark Graham, @markgraham&nbsp;<br>" + 
                    "Benjamin Mandel&nbsp;<br>" + 
                    "Kumar Yoges&nbsp;<br />Anton, @anton&nbsp;<br>" + 
                    "Abhidhas, @abhidas17695&nbsp;<br>" + 
                    "Rakesh N Chinta, @rakesh-chinta" + 
                "</p>" + 
                "<p><strong>Support</strong></p>" + 
                "<p>info@archive.org</p>";
                
    dispatchMessage("SHOW_ABOUT", {html: html});
}

function _onSetting(url) {

}