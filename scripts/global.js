var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504, 509, 520, 521, 523, 524, 525, 526];
var WB_API_URL = "https://archive.org/wayback/available";
var excluded_urls = [
  "web.archive.org/web/",
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];

var requestURL = "";
var currentScriptURL = "";

$(document).ready(function() {
    safari.application.addEventListener('beforeNavigate', _onBeforeNavigate, true);
    safari.application.addEventListener('navigate', _onNavigate, true);
});

function _onBeforeNavigate(event) {
    requestURL = event.url;
}

function _onNavigate(event) {
    if (currentScriptURL.length > 0) {
        safari.extension.removeContentScript(currentScriptURL);
        currentScriptURL = "";
    }

    /* - Get Status in XMLHttpRequest - */
    // var request = new XMLHttpRequest();
    // request.open('GET', requestURL, false);
    // request.send(null);

    // console.log(request.status);
    
    /* - Get Status in ajax - */
    $.ajax({
        url     : requestURL,
        type    : 'get',
        error   : function(xhr, err) {
            // console.log('readyState', xhr.readyState); //1: loading, 2: loaded, 3: interactive, 4: complete
            // console.log('status', xhr.status);
            // console.log('responseText', xhr.responseText);

            handleReadyState(xhr.readyState, xhr.status);
            
        }   
    });

}

function _onRecentVersion() {
    var url = new URL(requestURL);
    
    wmAvailabilityCheck(requestURL, null, function(wayback_url, url) {
        safari.application.activeBrowserWindow.activeTab.url = wayback_url;
    });
}

function _onFirstVersion() {
    var url = new URL(requestURL);
    wmAvailabilityCheck(requestURL, "00000000000000", function(wayback_url, url) {
        safari.application.activeBrowserWindow.activeTab.url = wayback_url;
    });
}

/* ------------------------------- */
function handleReadyState(readyState, status) {
    if ((readyState == 4 && httpFailCodes.indexOf(status) >= 0 && isValidUrl(requestURL))
        || readyState == 0 && status == 0) {
        // var myScriptTag = document.createElement('script');
        // myScriptTag.src = safari.extension.baseURI + 'scripts/client.js';
        // console.log(myScriptTag.src);
        // document.body.appendChild(myScriptTag);

        // console.log("readyState, status", readyState);

        var whitelist;
        var url = new URL(requestURL);
        if (url) {
            whitelist = ["http://*", "https://*", url.protocol + "//" + url.host + "*"];
        } else {
            whitelist = [requestURL];
        }
        
        wmAvailabilityCheck(requestURL, null, function(wayback_url, url) {
            // currentScriptURL = safari.extension.addContentScriptFromURL(safari.extension.baseURI + "scripts/client.js", whitelist, [], false);
            // if (currentScriptURL != null) {
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(
                'SHOW_BANNER', 
                {wayback_url: wayback_url}
            );
            // }
        });
    }
}
/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, timestamp, onsuccess, onfail) {
    var xhr = new XMLHttpRequest();
    var requestUrl = WB_API_URL;
    var requestParams = "url=" + encodeURI(url);
    if (timestamp != null) {
        requestParams += "&&timestamp=" + timestamp;
    }
    xhr.open("POST", requestUrl, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
/* ------------------------------- */