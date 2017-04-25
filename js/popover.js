/**
 * @fileOverview This file provides for the menu that pops over when
 * you click on the Privly icon in the browser Safari.
 */

var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g; 

$('document').ready(function() {
    initEventHandler();
    initSocialPlugin();
});

/**
 * Function to init events of elements.
 */
function initEventHandler() {
    $('#btn_save_page_now').click(function() {
        _onSavePageNow();
    });

    $('#btn_recent_version').click(function() {
        _onRecentVersion();
    });

    $('#btn_first_version').click(function() {
        _onFirstVersion();
    });

    $('.social-facebook').click(function() {
        _onFacebook();
    });

    $('.social-twitter').click(function() {
        _onTwitter();
    });

    $("#deactivateExtension").click(deactivateExtension);
    $("#activateExtension").click(activateExtension);
}

/**
 * Function to init social plugins.
 */
function initSocialPlugin() {
    
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
    /* istanbul ignore if */
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
    /* istanbul ignore if */
    if (typeof safari !== "undefined" && safari.extension !== undefined) {
        safari.extension.toolbarItems[0].image = safari.extension.baseURI + 'img/extension_off.png';
    }
}

function _onSavePageNow() {
    url = safari.application.activeBrowserWindow.activeTab.url;
    open_url = "https://web.archive.org/save/" + encodeURI(url.replace(pattern, ""));
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
    shareOnFacebook(
      safari.application.activeBrowserWindow.activeTab.url,
      safari.application.activeBrowserWindow.activeTab.title
    );
}

function shareOnFacebook(url, title) {
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = getSharingUrl(url, title);
}

function getSharingUrl(url, title, desc, caption, imageUrl) {
    let uri = `?u=${encodeURIComponent(url)}`
        + `&title=${encodeURIComponent(title)}`;

    return 'https://www.facebook.com/sharer/sharer.php' + uri;
}
/***/

/**
 * Twitter sharing
 */
function _onTwitter() {
    var url = "http://twitter.com/share?url=" + safari.application.activeBrowserWindow.activeTab.url + "&via=internetarchive";
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = url;
}
/***/




