// Copy chart markdown to clipboard (clipboard.js plugin)
var clipboard = null;
function initialiseClipboard() {
    var i;

    // Add index to any trigger/target that will use clipboard.js so we can identify each element individually
    $('.copy-markdown').each(function(index) {
        var $this = $(this);
        if (!$this.hasClass('copy-markdown_' + index)) {
            $this.addClass('copy-markdown_' + index).attr('data-clipboard-index', index);
            $this.closest('.edit-section__sortable-item').find('.copy-markdown-target').attr('id', 'copy-markdown-target_' + index);
            $this.find('.tick-animation-trigger').addClass('tick-animation-trigger_' + index);
        }
    });

    // Fire clipboard initialisation
    clipboard = new Clipboard('.copy-markdown', {
        target: function(trigger) {
            i = $(trigger).attr('data-clipboard-index');
            return document.getElementById('copy-markdown-target_' + i);
        }
    });
    clipboard.on('success', function(e) {
        toggleTick(i, "show");
        setTimeout(function() {
            toggleTick(i, "hide")
        }, 2000);
        e.clearSelection();
    });
    clipboard.on('error', function(e) {
        console.log("Error copying markdown");
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

    // Switch 'done' tick on and off
    function toggleTick(i, state) {
        if (state == "show") {
            $(".copy-markdown_" + i).attr("style", "color:transparent;");
        }
        $(".tick-animation-trigger_" + i).toggleClass("drawn");
        if (state == "hide") {
            function showBtnText () { $(".copy-markdown_" + i).removeAttr("style");}
            setTimeout(showBtnText, 1600);
        }
    }
}
