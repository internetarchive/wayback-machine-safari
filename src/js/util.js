function openTab(prefix, url) {
    if (url == "") return;
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = prefix + url;
}

function openURL(prefix, url) {
    if (url == "") return;
    safari.application.activeBrowserWindow.activeTab.url = prefix + url;
}

function getOriginalURL(url) {
    url = removeWBM(url);
    url = removeAlexa(url);
    url = removeWhois(url);
    url = removeTwitter(url);
    url = removePort(url);
    return url;
}

function removeWBM(url) {
    var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g; 
    return encodeURI(url.replace(pattern, ""));
}

function removeAlexa(url) {
    var pattern = /https:\/\/www\.alexa\.com\/siteinfo\//g; 
    return encodeURI(url.replace(pattern, ""));
}

function removeWhois(url) {
    var pattern = /https:\/\/www\.whois\.com\/whois\//g; 
    return encodeURI(url.replace(pattern, ""));
}

function removeTwitter(url) {
    var pattern = /https:\/\/twitter\.com\/search\?q=/g; 
    return encodeURI(url.replace(pattern, ""));
}

function removePort(url) {
    var pattern = /:\d+\//g;
    return encodeURI(url.replace(pattern, "/"));
}

function getSuggestions(keyword, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", BaseURL + "/__wb/search/host?q=" + keyword, true);
    xhr.onload = function() {
        var data = JSON.parse(xhr.response);
        var urls = [];
        data.hosts.forEach(function(item){
            urls.push(item.display_name);
        });
        callback(urls);
    }
    xhr.send(null);
}

function handleReadyState(readyState, status) {
    if ((readyState == 4 && httpFailCodes.indexOf(status) >= 0 && isValidUrl(requestURL))
        || readyState == 0 && status == 0) {
        
        wmAvailabilityCheck(requestURL, function(waybackURL) {
            dispatchMessage("SHOW_BANNER", {waybackURL: waybackURL});
        });
    } 
}
/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, onsuccess, onfail) {
    var xhr = new XMLHttpRequest();
    var requestParams = "url=" + encodeURI(url);
    xhr.open("POST", availability_api_URL, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Wayback-Extension-Version", "Wayback_Machine_Safari_EB/" + safari.extension.displayVersion);
    xhr.setRequestHeader("Wayback-Api-Version", 2);
    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        console.log("wmAvailabilityCheck-", response);
        var waybackURL = getWaybackURLFromResponse(response);
        if (waybackURL !== null) {
            onsuccess(waybackURL);
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
function getWaybackURLFromResponse(response) {
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

function dispatchMessage(name, data) {
    safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(name, data);
}