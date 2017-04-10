/**
 * @fileOverview This file provides for the menu that pops over when
 * you click on the Privly icon in the browser Safari.
 */

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

/**
 * Helper function to open new tabs from the links.
 */
function openPopoverPage() {

    /* istanbul ignore if */
    if (typeof safari !== "undefined" && safari.application !== undefined) {
        safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + this.getAttribute("data-popover-path");
    }
}

function _onSavePageNow() {
    url = safari.application.activeBrowserWindow.activeTab.url;
    open_url = "https://web.archive.org/save/" + encodeURI(url.replace(pattern, ""));
    safari.application.activeBrowserWindow.activeTab.url = open_url;
}

function _onRecentVersion() {
    // url = safari.application.activeBrowserWindow.activeTab.url;
    // open_url = "https://web.archive.org/web/2/" + encodeURI(url.replace(pattern, ""));
    // safari.application.activeBrowserWindow.activeTab.url = open_url;
    safari.extension.globalPage.contentWindow._onRecentVersion();
}

function _onFirstVersion() {
    // url = safari.application.activeBrowserWindow.activeTab.url;
    // open_url = "https://web.archive.org/web/0/" + encodeURI(url.replace(pattern, ""));
    // safari.application.activeBrowserWindow.activeTab.url = open_url;
    safari.extension.globalPage.contentWindow._onFirstVersion();
}

// Set the activation UI
$("#deactivateExtension").click(deactivateExtension);
$("#activateExtension").click(activateExtension);

// Open new windows from the links
$(".popover_data").click(openPopoverPage);

var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;

$('document').ready(function() {
    $('#btn_save_page_now').click(function() {
        _onSavePageNow();
    });

    $('#btn_recent_version').click(function() {
        _onRecentVersion();
    });

    $('#btn_first_version').click(function() {
        _onFirstVersion();
    });
});

// safari.application.activeBrowserWindow.openTab().url = open_url;


