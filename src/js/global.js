var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504, 509, 520, 521, 523, 524, 525, 526];
var availability_api_URL = "https://archive.org/wayback/available";

var requestURL = "";

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

function _onRecentVersion() {
    var url = safari.application.activeBrowserWindow.activeTab.url;
    wmAvailabilityCheck(getOriginalURL(url), null, function(wayback_url, url) {
        safari.application.activeBrowserWindow.activeTab.url = wayback_url;
    });
}

function _onFirstVersion() {
    var url = safari.application.activeBrowserWindow.activeTab.url;
    wmAvailabilityCheck(getOriginalURL(url), "00000000000000", function(wayback_url, url) {
        safari.application.activeBrowserWindow.activeTab.url = wayback_url;
    });
}

/* ------------------------------- */
function handleReadyState(readyState, status) {
    if ((readyState == 4 && httpFailCodes.indexOf(status) >= 0 && isValidUrl(requestURL))
        || readyState == 0 && status == 0) {

        // var whitelist;
        // var url = new URL(requestURL);
        // if (url) {
        //     whitelist = ["http://*", "https://*", url.protocol + "//" + url.host + "*"];
        // } else {
        //     whitelist = [requestURL];
        // }
        
        wmAvailabilityCheck(requestURL, null, function(wayback_url, url) {
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(
                'SHOW_BANNER', 
                {wayback_url: wayback_url}
            );
        });
    } 
}
/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, timestamp, onsuccess, onfail) {
    var xhr = new XMLHttpRequest();
    var requestParams = "url=" + encodeURI(url);
    if (timestamp != null) {
        requestParams += "&&timestamp=" + timestamp;
    }
    xhr.open("POST", availability_api_URL, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Wayback-Extension-Version", "Wayback_Machine_Safari_EB/" + safari.extension.displayVersion);
    xhr.setRequestHeader("Wayback-Api-Version", 2);
    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        var wayback_url = getWaybackUrlFromResponse(response);
        if (wayback_url !== null) {
            onsuccess(wayback_url, url);
        } else if (onfail) {
            onfail();
        }
    };
    xhr.send(requestParams);
}

/**
 * @param response {object}
 * @return {string or null}
 */
function getWaybackUrlFromResponse(response) {
    if (response.results &&
        response.results[0] &&
        response.results[0].archived_snapshots &&
        response.results[0].archived_snapshots.closest &&
        response.results[0].archived_snapshots.closest.available &&
        response.results[0].archived_snapshots.closest.available === true &&
        response.results[0].archived_snapshots.closest.status.indexOf("2") === 0 &&
        isValidSnapshotUrl(response.results[0].archived_snapshots.closest.url)) 
    {
        return makeHttps(response.results[0].archived_snapshots.closest.url);
    } else {
        return null;
    }
}

function isValidUrl(url) {
    var excluded_urls = [
        "web.archive.org/web/",
        "localhost",
        "0.0.0.0",
        "127.0.0.1"
    ];
    for (var i = 0; i < excluded_urls.length; i++) {
        if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
            return false;
        }
    }
    return true;
}

/**
 * Makes sure response is a valid URL to prevent code injection
 * @param url {string}
 * @return {bool}
 */
function isValidSnapshotUrl(url) {
    return ((typeof url) === "string" &&
        (url.indexOf("http://") === 0 || url.indexOf("https://") === 0));
}

function makeHttps(url) {
    return url.replace(/^http:/, "https:");
}

function setExtensionIcon(fileName) {
    var iconUri = safari.extension.baseURI + "../../public/img/" + fileName;
    for (var i = 0; i < safari.extension.toolbarItems.length; i++) {
        safari.extension.toolbarItems[i].image = iconUri;
    }
}

/**
 * Check url if provided by archive.org or not
 * And return original url
 * @param {string} url 
 * @return {string}
 */
function getOriginalURL(url) {
    var originalURL = null;
    if ((url.match(/http/g) || []).length > 1) {
        originalURL = url.substr(url.lastIndexOf("http"));
    } else {
        originalURL = url;
    }

    return originalURL;
}