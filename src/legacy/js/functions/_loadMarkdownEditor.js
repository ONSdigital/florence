/**
 * Manages markdown editor
 * 
 * Uses pagedown markdown librart - https://github.com/ujifgc/pagedown
 * 
 * @param content
 * @param onSave
 * @param pageData
 * @param notEmpty - if present, markdown cannot be left empty
 */

function loadMarkdownEditor(content, onSave, pageData, notEmpty) {

    if (content.title == undefined) {
        var html = templates.markdownEditorNoTitle(content);
        $('body').append(html);
        $('.markdown-editor').stop().fadeIn(200);
        $('#wmd-input').focus();
    } else {
        var html = templates.markdownEditor(content);
        $('body').append(html);
        $('.markdown-editor').stop().fadeIn(200);
        $('#wmd-input').focus();
    }

    markdownEditor();

    var markdown = $('#wmd-input').val();

    // Detect if markdown updated and update variable
    $('#wmd-input').on('input', function() {
        markdown = $('#wmd-input').val();
    });

    if (notEmpty === true || markdown === '') {
        $('.btn-markdown-editor-cancel').hide();
    } else {
        $('.btn-markdown-editor-cancel').on('click', function () {
            $('.markdown-editor').stop().fadeOut(200).remove();
        });
    }

    $(".btn-markdown-editor-save").click(function () {
        onSave(markdown);
    });

    if (notEmpty) {
        $(".btn-markdown-editor-exit").click(function () {
            if (markdown === '') {
                sweetAlert('Please add some text', "This can't be left empty");
            } else {
                onSave(markdown);
                $('.markdown-editor').stop().fadeOut(200).remove();
            }
        });
    } else {
        $(".btn-markdown-editor-exit").click(function () {
            // Just a little test to see if the markdown is ever getting set to null - can delete it later if this is never fired
            if (!markdown || markdown == "null") {
                console.log("Error, undefined or null markdown value");
            }
            onSave(markdown);
            $('.markdown-editor').stop().fadeOut(200).remove();
        });
    }

    var onInsertSave = function (name, markdown) {
        insertAtCursor($('#wmd-input')[0], markdown);
        $('#wmd-input').trigger('input');
        Florence.Editor.markdownEditor.refreshPreview();
    };

    $("#js-editor--chart").click(function () {
        loadChartBuilder(pageData, onInsertSave);
    });

    $("#js-editor--table").click(function () {
        loadTableBuilder(pageData, onInsertSave);
    });

    $("#js-editor--table-v2").click(function () {
        loadTableBuilderV2(pageData, onInsertSave);
    });

    $("#js-editor--equation").click(function () {
        loadEquationBuilder(pageData, onInsertSave);
    });

    $("#js-editor--image").click(function () {
        loadImageBuilder(pageData, function (name, markdown, pageData) {
            onInsertSave(name, markdown);
            refreshImagesList(Florence.collection.id, pageData)
        });
    });

    $("#js-editor--embed").click(function () {
        loadEmbedIframe(function (markdown) {
            onInsertSave('', markdown);
        });
    });

    $("#js-editor--box").click(function() {
        var $input = $('#wmd-input');
        var selectionStart = $input[0].selectionStart;
        var selectionEnd = $input[0].selectionEnd;
        var beforeCursor = $input.val().substring(0, selectionStart);
        var afterCursor = $input.val().substring(selectionStart);
        var beforeCursorArray = beforeCursor.split("\n");
        var afterCursorArray = afterCursor.split("\n");
        var selectedLine = $input.val().split("\n")[beforeCursorArray.length-1];
        var newInputValue = $input.val();
        var cursorIsInsideBoxTag = false;
        var cursorIsOnOpeningTag = false;
        var cursorIsOnClosingTag = false;
        var nextClosingTag = afterCursor.indexOf("</ons-box>");
        var nextOpeningTag = afterCursor.indexOf("<ons-box");

        // Detect that the cursor is inside box markdown, 
        // so that we can choose to remove it instead of adding a new one.
        if (nextClosingTag < nextOpeningTag || (nextClosingTag >= 0 && nextOpeningTag === -1)) {
            cursorIsInsideBoxTag = true;
        }

        // Detect that the cursor is on a box tag so that we can
        // choose to remove the entire tag
        if (selectedLine.indexOf("<ons-box") >= 0) {
            cursorIsOnOpeningTag = true;
        }
        if (selectedLine.indexOf("</ons-box>") >= 0) {
            cursorIsOnClosingTag = true;
        }

        if (cursorIsOnOpeningTag) {
            var eachLine = $input.val().split("\n");
            var closingTagRemoved = false;
            eachLine.splice([beforeCursorArray.length-1], 1);

            var index = [beforeCursorArray.length-1];
            while(!closingTagRemoved) {
                if (eachLine[index].indexOf("</ons-box>") >= 0) {
                    eachLine.splice(index, 1);
                    closingTagRemoved = true;
                }
                index++;
            }
            newInputValue = eachLine.join("\n");
        } else if (cursorIsOnClosingTag) {
            var eachLine = $input.val().split("\n");
            var closingTagRemoved = false;
            eachLine.splice([beforeCursorArray.length-1], 1);

            var index = [beforeCursorArray.length-1];
            while(!closingTagRemoved) {
                if (eachLine[index].indexOf("<ons-box") >= 0) {
                    eachLine.splice(index, 1);
                    closingTagRemoved = true;
                }
                index--;
            }
            newInputValue = eachLine.join("\n");
        } else if (cursorIsInsideBoxTag) {
            beforeCursorArray.reverse();
            for (var [index, value] of beforeCursorArray.entries()) {
                if (value.indexOf("<ons-box") >= 0) {
                    beforeCursorArray.splice(index, 1);
                    break;
                }
            }
            beforeCursorArray.reverse();

            for (var [index, value] of afterCursorArray.entries()) {
                if (value.indexOf("</ons-box>") >= 0) {
                    afterCursorArray.splice(index, 1);
                    break;
                }
            }
            newInputValue = beforeCursorArray.join("\n") + afterCursorArray.join("\n");
        } else {
            if (selectionStart === selectionEnd) {
                var eachLine = $input.val().split("\n");
                var selection = beforeCursorArray[beforeCursorArray.length-1] + afterCursorArray[0];
                var wrappedSelection = '<ons-box align="full">\n' + selection + '\n</ons-box>';
                eachLine[beforeCursorArray.length-1] = wrappedSelection;
                newInputValue = eachLine.join("\n");

            } else {
                selection = $input.val().substring(selectionStart, selectionEnd);
                newInputValue = $input.val().slice(0, selectionStart) + '<ons-box align="full">\n' + selection + '\n</ons-box>' + $input.val().slice(selectionEnd);
            }
        }

        $input.val(newInputValue);
        $('#wmd-input').trigger('input');
        $input[0].setSelectionRange(selectionStart, selectionEnd);
        Florence.Editor.markdownEditor.refreshPreview();

    });

    $("#wmd-input").on('click', function () {
        markDownEditorSetLines();
    });

    $("#wmd-input").on('keyup', function () {
        markDownEditorSetLines();
    });

    // http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
    $("#wmd-input").keydown(function (e) {
        if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var $this = $(this);
            var value = $this.val();

            // set textarea value to: text before caret + tab + text after caret
            $this.val(value.substring(0, start)
                + "\t"
                + value.substring(end));

            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            e.preventDefault();
        }
    });

    // http://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
    function insertAtCursor(field, value) {
        //IE support
        if (document.selection) {
            field.focus();
            sel = document.selection.createRange();
            sel.text = value;
        }
        //MOZILLA and others
        else if (field.selectionStart || field.selectionStart == '0') {
            var startPos = field.selectionStart;
            var endPos = field.selectionEnd;
            field.value = field.value.substring(0, startPos)
                + value
                + field.value.substring(endPos, field.value.length);
            field.selectionStart = startPos + value.length;
            field.selectionEnd = startPos + value.length;
        } else {
            field.value += value;
        }
    }
}


function markdownEditor() {

    var converter = new Markdown.getSanitizingConverter();

    // output chart tag as text instead of the actual tag.
    converter.hooks.chain("preBlockGamut", function (text) {
        var newText = text.replace(/(<ons-chart\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match) {
            console.log("ONS Chart tag found", match);
            var path = $(match).attr('path');
            return '[chart path="' + path + '" ]';
        });
        return newText;
    });

    // output table tag as text instead of the actual tag.
    converter.hooks.chain("preBlockGamut", function (text) {
        var newText = text.replace(/(<ons-table\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match) {
            var path = $(match).attr('path');
            return '[table path="' + path + '" ]';
        });
        return newText;
    });
    converter.hooks.chain("preBlockGamut", function (text) {
        var newText = text.replace(/(<ons-table-v2\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match) {
            var path = $(match).attr('path');
            return '[table path="' + path + '" ]';
        });
        return newText;
    });

    // output equation tag as text instead of the actual tag.
    converter.hooks.chain("preBlockGamut", function (text) {
        var newText = text.replace(/(<ons-equation\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match) {
            var path = $(match).attr('path');
            return '[equation path="' + path + '" ]';
        });
        return newText;
    });

    // output interactive tag as text instead of the actual tag.
    converter.hooks.chain("preBlockGamut", function (text) {
        var newText = text.replace(/(<ons-interactive\surl="([-A-Za-z0-9+&@#/%?=~_|!:,.;()*$]+)"\s?(?:\s?full-width="(.*[^"])")?\/>)/ig, function (match) {
            var path = $(match).attr('url');
            var fullWidth = $(match).attr('full-width') || "";
            var fullWidthText = fullWidth == "true" ? 'display="full-width"' : '';
            return '[interactive url="' + path + '" ' + fullWidthText + ']';
        });
        return newText;
    });

    // output box tag as text instead of the actual tag.
    converter.hooks.chain("preBlockGamut", function (text) {
        var newText = text.replace(/<ons-box\salign="([a-zA-Z]*)">((?:.|\n)*?)<\/ons-box>/igm, function (match) {
            var align = $(match).attr('align') || "";
            var content = $(match)[0].innerHTML;
            return '[box align="' + align + '"]' + content + '[/box]';
        });
        return newText;
    });

    converter.hooks.chain("plainLinkText", function (link) {
        console.log("link done, innit");
        console.log(link);
    });

    Markdown.Extra.init(converter, {
        extensions: "all"
    });

    var editor = new Markdown.Editor(converter);
    Florence.Editor.markdownEditor = editor;

    editor.hooks.chain("onPreviewRefresh", function () {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    });

    editor.run();
    markDownEditorSetLines();
}

