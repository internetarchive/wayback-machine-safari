/**
 * @fileOverview This file provides for the menu that pops over when
 * you click on the Wayback Machine icon in the browser Safari.
 */

window.onload = function(){
    initComponent();
    initEventHandler();
}

function _onSavePageNow() {
    var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g; 
    var url = safari.application.activeBrowserWindow.activeTab.url;
    var open_url = "https://web.archive.org/save/" + encodeURI(url.replace(pattern, ""));
    safari.application.activeBrowserWindow.activeTab.url = open_url;
}

function _onRecentVersion() {
    safari.extension.globalPage.contentWindow._onRecentVersion();
}

function _onFirstVersion() {
    safari.extension.globalPage.contentWindow._onFirstVersion();
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

function initEventHandler() {
    document.getElementById("btn_save_page_now").onclick    = _onSavePageNow;
    document.getElementById("btn_recent_version").onclick   = _onRecentVersion;
    document.getElementById("btn_first_version").onclick    = _onFirstVersion;
    document.getElementById("btn_facebook").onclick         = _onFacebook;
    document.getElementById("btn_twitter").onclick          = _onTwitter;
    document.getElementById("btn_google").onclick           = _onGooglePlus;
}

function initComponent() {
    $("#search_input").typeahead({ 
        source          :["item1","item2","item3"],
        fitToElement    : true,
        items           : 5,
        showHintOnFocus : false,
    });
}

/**
 * Helper function for activateExtension() and deactivateExtension().
 *
 * @param {node} toShow The element that needs to be shown
 * @param {node} toHide The element that needs to be hidden
 */
function extensionStateChange(toShow, toHide) {
    
    /* istanbul ignore if */
    if (typeof safari !== "undefined" && safari.extension !== undefined) {
        safari.extension.globalPage.contentWindow.modalButton.modeChange();
    }

    // Update the UI
    $(toShow).show();
    $(toHide).hide();
}





