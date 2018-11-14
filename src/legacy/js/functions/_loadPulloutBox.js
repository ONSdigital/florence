function loadPulloutBox () {
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

};
function loadPulloutWarningBox () {
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
    var nextClosingTag = afterCursor.indexOf("</ons-warning-box>");
    var nextOpeningTag = afterCursor.indexOf("<ons-warning-box");

    // Detect that the cursor is inside box markdown, 
    // so that we can choose to remove it instead of adding a new one.
    if (nextClosingTag < nextOpeningTag || (nextClosingTag >= 0 && nextOpeningTag === -1)) {
        cursorIsInsideBoxTag = true;
    }

    // Detect that the cursor is on a box tag so that we can
    // choose to remove the entire tag
    if (selectedLine.indexOf("<ons-warning-box") >= 0) {
        cursorIsOnOpeningTag = true;
    }
    if (selectedLine.indexOf("</ons-warning-box>") >= 0) {
        cursorIsOnClosingTag = true;
    }

    if (cursorIsOnOpeningTag) {
        var eachLine = $input.val().split("\n");
        var closingTagRemoved = false;
        eachLine.splice([beforeCursorArray.length-1], 1);

        var index = [beforeCursorArray.length-1];
        while(!closingTagRemoved) {
            if (eachLine[index].indexOf("</ons-warning-box>") >= 0) {
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
            if (eachLine[index].indexOf("<ons-warning-box") >= 0) {
                eachLine.splice(index, 1);
                closingTagRemoved = true;
            }
            index--;
        }
        newInputValue = eachLine.join("\n");
    } else if (cursorIsInsideBoxTag) {
        beforeCursorArray.reverse();
        for (var [index, value] of beforeCursorArray.entries()) {
            if (value.indexOf("<ons-warning-box") >= 0) {
                beforeCursorArray.splice(index, 1);
                break;
            }
        }
        beforeCursorArray.reverse();

        for (var [index, value] of afterCursorArray.entries()) {
            if (value.indexOf("</ons-warning-box>") >= 0) {
                afterCursorArray.splice(index, 1);
                break;
            }
        }
        newInputValue = beforeCursorArray.join("\n") + afterCursorArray.join("\n");
    } else {
        if (selectionStart === selectionEnd) {
            var eachLine = $input.val().split("\n");
            var selection = beforeCursorArray[beforeCursorArray.length-1] + afterCursorArray[0];
            var wrappedSelection = '<ons-warning-box>\n' + selection + '\n</ons-warning-box>';
            eachLine[beforeCursorArray.length-1] = wrappedSelection;
            newInputValue = eachLine.join("\n");

        } else {
            selection = $input.val().substring(selectionStart, selectionEnd);
            newInputValue = $input.val().slice(0, selectionStart) + '<ons-warning-box>\n' + selection + '\n</ons-warning-box>' + $input.val().slice(selectionEnd);
        }
    }

    $input.val(newInputValue);
    $('#wmd-input').trigger('input');
    $input[0].setSelectionRange(selectionStart, selectionEnd);
    Florence.Editor.markdownEditor.refreshPreview();
};