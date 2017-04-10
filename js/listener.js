/**
 * Shows the popover based on the command event.
 *
 * @param event the command event that is dispatched
 *
 */
function showPopoverCallback(event) {
    if (event.command === "NoMore404s") {
        safari.extension.toolbarItems[0].showPopover();
    }
} 

safari.application.addEventListener("command", showPopoverCallback, false);
