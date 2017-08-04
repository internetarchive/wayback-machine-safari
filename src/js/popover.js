/**
 * @fileOverview This file provides for the menu that pops over when
 * you click on the Wayback Machine icon in the browser Safari.
 */

window.onload = function(){
    document.getElementById("btn_save_page_now").onclick = _onSavePageNow;
    document.getElementById("btn_recent_version").onclick = _onRecentVersion;
    document.getElementById("btn_first_version").onclick = _onFirstVersion;
    document.getElementById("btn_social_facebook").onclick = _onFacebook;
    document.getElementById("btn_social_twitter").onclick = _onTwitter;
    document.getElementById("btn_social_google").onclick = _onGooglePlus;
    // document.getElementById("deactivateExtension").onclick = deactivateExtension;
    // document.getElementById("activateExtension").onclick = activateExtension;
}

/**
 * Facebook sharing
 */
function _onFacebook() {
    shareOnFacebook(
      safari.application.activeBrowserWindow.activeTab.url,
      safari.application.activeBrowserWindow.activeTab.title
    );
}

/**
 * Twitter sharing
 */
function _onTwitter() {
    var url = "http://twitter.com/share?url=" + safari.application.activeBrowserWindow.activeTab.url + "&via=internetarchive";
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = url;
}
/**
 * Google+ sharing
 */
function _onGooglePlus() {
    var url = "https://plus.google.com/share?url=" + safari.application.activeBrowserWindow.activeTab.url;
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = url;
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

function shareOnFacebook(url, title) {
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = getSharingUrl(url, title);
}

function getSharingUrl(url, title, desc, caption, imageUrl) {
    var param = "?u=" + encodeURIComponent(url) +  "&title=" + encodeURIComponent(title);
    return 'https://www.facebook.com/sharer/sharer.php' + param;
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

/**
 * Activates application injection by messaging the background scripting
 * environment. The background scripting environment will then message
 * the privly.js content script.
 */
function activateExtension() {

    // Call the helper function to make necessary changes
    extensionStateChange("#deactivateExtension", "#activateExtension");

    // Change the toolbar item image to denote extension is on
    if (typeof safari !== "undefined" && safari.extension !== undefined) {
        safari.extension.toolbarItems[0].image = safari.extension.baseURI + 'img/extension_on.png';
    }
}

/**
 * Deactivates application injection by messaging the background scripting
 * environment. The background scripting environment will then message
 * the privly.js content script.
 */
function deactivateExtension() {

    // Call the helper function to make necessary changes
    extensionStateChange("#activateExtension", "#deactivateExtension");

    // Change the toolbar item image to denote extension is off
    if (typeof safari !== "undefined" && safari.extension !== undefined) {
        safari.extension.toolbarItems[0].image = safari.extension.baseURI + 'img/extension_off.png';
    }
}





