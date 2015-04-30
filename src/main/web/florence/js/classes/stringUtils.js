var StringUtils = {
  textareaLines: function (line, maxLineLength, start, numberOfLinesCovered) {

    if (start + maxLineLength >= line.length) {
      //console.log('Line Length = ' + numberOfLinesCovered);
      return numberOfLinesCovered;
    }

    var substring = line.substr(start, maxLineLength + 1);
    var actualLineLength = substring.lastIndexOf(' ') + 1;

    if (actualLineLength === maxLineLength) // edge case - the break is at the end of the line exactly with a space after it
    {
      actualLineLength--;
    }

    if (start + actualLineLength === line.length) {
      return numberOfLinesCovered;
    }

    //console.log('Line: ' + numberOfLinesCovered + ' length = ' + actualLineLength);

    return StringUtils.textareaLines(line, maxLineLength, start + actualLineLength, numberOfLinesCovered + 1);
  }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') { module.exports = StringUtils; }

