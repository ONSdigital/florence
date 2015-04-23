StringUtils = {
  textareaLines: function (line, maxLineLength, start, numberOfLinesCovered) {

    if (start + maxLineLength >= line.length) {
      console.log('Line Length = ' + numberOfLinesCovered);
      return numberOfLinesCovered;
    }

    var substring = line.substr(start, maxLineLength + 1);
    var actualLineLength = substring.lastIndexOf(' ');

    if (actualLineLength === maxLineLength) // edge case - the break is at the end of the line exactly with a space after it
    {
      console.log('edge case hit');
      actualLineLength--;
    }

    if (start + actualLineLength === line.length) {
      console.log('edge case  2 hit');
      return numberOfLinesCovered;
    }
    if (actualLineLength === -1) {
      console.log('edge case   3 hit');
      return numberOfLinesCovered;
    }

    console.log('Line: ' + numberOfLinesCovered + ' length = ' + actualLineLength);

    return StringUtils.textareaLines(line, maxLineLength, start + actualLineLength, numberOfLinesCovered + 1);
  }
};