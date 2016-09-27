/**
 * Controls the enhanced file input type, inputs is hidden off of page so javascript performs functions that you'd see happen natively
 */

$(function() {
    $('body').on('change', '.input__file input', function() {
        var $this = $(this),
            fileName = ($this.val()).split('\\').pop(); // split file path by backslashes into an array and use last entry

        $this.closest('label').attr('data-file-title', fileName);
    });
});
