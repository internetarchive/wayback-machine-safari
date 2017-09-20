function openTab(url) {

}

function openURL(url) {
    safari.application.activeBrowserWindow.activeTab.url = url;
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