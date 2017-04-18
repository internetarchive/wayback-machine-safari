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

    // setExtensionIcon("Icon-64.png");

}

function _onRecentVersion() {
    wmAvailabilityCheck(getOriginalURL(requestURL), null, function(wayback_url, url) {
        safari.application.activeBrowserWindow.activeTab.url = wayback_url;
    });
}

function _onFirstVersion() {
    wmAvailabilityCheck(getOriginalURL(requestURL), "00000000000000", function(wayback_url, url) {
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
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(
                'SHOW_BANNER', 
                {wayback_url: wayback_url}
            );
        });
    } 

    // console.log(httpFailCodes.indexOf(status));
    // if (httpFailCodes.indexOf(status) == -1) {
    //     console.log("New URL loaded");
        
    // }
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
    xhr.setRequestHeader("User-Agent", "Wayback_Machine_Safari_EB/1.3.0");
    xhr.setRequestHeader("Wayback-Api-Version", 2);
    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        var wayback_url = getWaybackUrlFromResponse(response);

        // if (wayback_url !== null) {
        //     setExtensionIcon("Icon-Smile.png");
        // } else {
        //     setExtensionIcon("Icon-Frown.png");
        // }

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
    console.log("Response", response);
    if (response.results &&
        response.results[0] &&
        response.results[0].archived_snapshots &&
        response.results[0].archived_snapshots.closest &&
        response.results[0].archived_snapshots.closest.available &&
        response.results[0].archived_snapshots.closest.available === true &&
        response.results[0].archived_snapshots.closest.status.indexOf("2") === 0 &&
        isValidSnapshotUrl(response.results[0].archived_snapshots.closest.url)) 
    {
        console.log("Archived_Snapshots", response.results[0].archived_snapshots);
        console.log("Snapshot_Closest_URL", response.results[0].archived_snapshots.closest.url);
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

function setExtensionIcon(fileName) {
    var iconUri = safari.extension.baseURI + "image/" + fileName;
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
/* ------------------------------- */