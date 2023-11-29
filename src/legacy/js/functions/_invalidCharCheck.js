function replaceInvalidChars(str) {
    // replace "Start of Text" (U+0002)
    var UNICODE_CHARS_TO_REPLACE = /\u{0002}/gu

    return str.replace(UNICODE_CHARS_TO_REPLACE,' ');
}

function initReplaceInvalidChars() {
    $('input[type=text], textarea').on('input', function(e) {
        var sanitised = replaceInvalidChars($(e.target).val())
        $(e.target).val(sanitised)
});
}


