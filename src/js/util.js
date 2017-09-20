function openTab(waybackURL, url) {
    if (url == "") return;
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = waybackURL + url;
}

function openURL(waybackURL, url) {
    if (url == "") return;
    safari.application.activeBrowserWindow.activeTab.url = waybackURL + url;
}

function getURL() {
    var url = "";
    if (getSearchTerm() == "") {
        url = getActiveURL();
    } else {
        url = getSearchTerm();
    }

    removeWBM(url);
    removeAlexa(url);
    removeWhois(url);
}

function getSearchTerm() {
    return document.getElementById("search_term").value; 
}

function getActiveURL() {
    return safari.application.activeBrowserWindow.activeTab.url;
}

function removeWBM(url) {
    var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g; 
    return encodeURI(url.replace(pattern, ""));
}

function removeAlexa(url) {

}

function removeWhois(url) {

}

/* ------------------------------- */
function handleReadyState(readyState, status) {
    if ((readyState == 4 && httpFailCodes.indexOf(status) >= 0 && isValidUrl(requestURL))
        || readyState == 0 && status == 0) {
        
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
function wmAvailabilityCheck(url, onsuccess, onfail) {
    if (url == "") onfail("Empty URL!");

    var xhr = new XMLHttpRequest();
    var requestParams = "url=" + encodeURI(url);
    xhr.open("POST", availability_api_URL, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Wayback-Extension-Version", "Wayback_Machine_Safari_EB/" + safari.extension.displayVersion);
    xhr.setRequestHeader("Wayback-Api-Version", 2);
    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        var wayback_url = getWaybackUrlFromResponse(response);
        if (wayback_url !== null) {
            onsuccess(wayback_url);
        } else if (onfail) {
            onfail("URL not found in wayback archives!");
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